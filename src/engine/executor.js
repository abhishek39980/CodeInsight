import { parse } from 'acorn'
import { buildAstArtifacts } from './analysis/astMap.js'
import { buildComplexityReport } from './analysis/complexity.js'
import { buildSynchronizationLayer } from './analysis/synchronization.js'
import { transpileToJavaScript } from './transpilers.js'
import { explainStep } from './explainers.js'
import { enrichExecutionInsights } from './insights.js'
import { buildSnapshot, valueToText } from './snapshotBuilder.js'
import { Runtime, isRef, refId } from './runtime.js'
import { listRuntimePlugins, registerPyodidePluginStub, selectRuntimePlugin } from './plugins/runtimePlugins.js'

class FlowSignal {
  constructor(type, value) {
    this.type = type
    this.value = value
  }
}

const createNativeFunction = (name, nativeImpl) => ({
  kind: 'function',
  name,
  node: null,
  env: null,
  async: false,
  captures: [],
  nativeImpl,
})

const createFunctionValue = (node, env, overrideName = null) => ({
  kind: 'function',
  name: overrideName || node.id?.name || 'anonymous',
  node,
  env,
  async: Boolean(node.async),
  captures: env.entries().map(([key]) => key),
  nativeImpl: null,
})

const commitStep = (runtime, payload, node = null) => {
  const astNodeId = payload.meta?.astNodeId || node?.__astId || null
  runtime.capture({
    ...payload,
    meta: {
      ...(payload.meta || {}),
      astNodeId,
      activeScopeId: runtime.scopeTracker?.activeScopeId || null,
    },
  })

  const latest = runtime.steps[runtime.steps.length - 1]
  const snapshot = buildSnapshot(runtime, latest)
  snapshot.explanation = explainStep(snapshot)
  runtime.steps[runtime.steps.length - 1] = snapshot
}

const statementEvent = (node) => {
  switch (node.type) {
    case 'VariableDeclaration':
      return { event: 'Variable declaration', eventType: 'declare' }
    case 'FunctionDeclaration':
      return { event: `Function ${node.id?.name || 'anonymous'} declared`, eventType: 'declare' }
    case 'ExpressionStatement':
      return { event: 'Expression evaluated', eventType: 'execution' }
    case 'IfStatement':
      return { event: 'Branch condition evaluated', eventType: 'branch' }
    case 'ForStatement':
      return { event: 'For loop cycle', eventType: 'loop' }
    case 'WhileStatement':
      return { event: 'While loop cycle', eventType: 'loop' }
    case 'ReturnStatement':
      return { event: 'Returning from function', eventType: 'return' }
    case 'BlockStatement':
      return { event: 'Entering block scope', eventType: 'scope' }
    default:
      return { event: 'Executing statement', eventType: 'execution' }
  }
}

const truthy = (value) => Boolean(value)

const makeRuntimeError = (message, line) => {
  const error = new Error(message)
  error.__line = line || 1
  return error
}

const resolveIdentifier = (env, name) => {
  const path = []
  let cursor = env

  while (cursor) {
    path.push(`${cursor.name}:${cursor.id || 'scope'}`)
    if (cursor.bindings.has(name)) {
      return { scope: cursor, path }
    }
    cursor = cursor.parent
  }

  return { scope: null, path }
}

const recordTransitionStep = (runtime, line, node = null) => {
  const transition = runtime.eventLoop.lastTransition
  if (!transition) return

  commitStep(runtime, {
    line,
    event: `${transition.label}: ${transition.from} -> ${transition.to}`,
    eventType: 'async',
    meta: {
      taskId: transition.taskId,
      from: transition.from,
      to: transition.to,
      queueReason: transition.reason,
    },
  }, node)
}

const queueTask = (runtime, queue, payload, reason, node = null) => {
  const task = runtime.makeEventTask({ queue, ...payload })
  runtime.enqueueTask(queue, task, reason)
  recordTransitionStep(runtime, payload.line || 1, node)
  return task
}

const isRuntimePromise = (value) => Boolean(value && value.kind === 'promise')

const settlePromise = (runtime, promise, state, value, line) => {
  if (!promise || promise.state !== 'pending') {
    return promise
  }

  promise.state = state
  promise.value = value
  promise.settledAtStep = runtime.stepId

  commitStep(runtime, {
    line,
    event: `Promise ${promise.id} ${state}`,
    eventType: 'async',
    meta: {
      promiseId: promise.id,
      promiseState: state,
    },
  })

  const handlers = [...promise.handlers]
  promise.handlers = []
  handlers.forEach((handler) => queuePromiseHandler(runtime, promise, handler, line))
  return promise
}

const attachPromiseHandler = (runtime, promise, onFulfilled, onRejected, line, existingNextPromise = null) => {
  const nextPromise = existingNextPromise || runtime.createPromise(`then:${promise.id}`)
  const handler = { onFulfilled, onRejected, nextPromise }

  if (promise.state === 'pending') {
    promise.handlers.push(handler)
  } else {
    queuePromiseHandler(runtime, promise, handler, line)
  }

  return nextPromise
}

const readMember = (runtime, objectRef, property, line, node = null) => {
  if (!isRef(objectRef)) {
    throw makeRuntimeError('Cannot access property on primitive value', line)
  }

  const nodeData = runtime.getHeapNode(objectRef)
  let raw
  if (Array.isArray(nodeData.value)) {
    if (property === 'length') {
      raw = nodeData.value.length
    } else if (!Number.isNaN(Number(property))) {
      raw = nodeData.value[Number(property)]
    } else {
      raw = nodeData.value[property]
    }
  } else {
    raw = nodeData.value[property]
  }

  runtime.recordAccess({
    refId: nodeData.id,
    path: String(property),
    line,
  })

  commitStep(runtime, {
    line,
    event: `Read #${nodeData.id}.${property}`,
    eventType: 'execution',
    meta: { refId: nodeData.id, property },
  }, node)

  return raw
}

const writeMember = (runtime, objectRef, property, nextValue, line, node = null) => {
  if (!isRef(objectRef)) {
    throw makeRuntimeError('Cannot assign property on primitive value', line)
  }

  const targetId = refId(objectRef)
  runtime.mutateHeap(objectRef, (heapNode) => {
    if (Array.isArray(heapNode.value)) {
      const index = Number(property)
      heapNode.value[index] = nextValue
    } else {
      heapNode.value[property] = nextValue
    }
  })

  runtime.addUpdate({
    kind: 'heap-mutate',
    key: `heap:${targetId}`,
    refId: targetId,
    path: String(property),
    reason: `Property ${property} updated`,
  })

  commitStep(runtime, {
    line,
    event: `Heap mutation on #${targetId}.${property}`,
    eventType: 'heap',
    meta: { refId: targetId, property },
  }, node)
}

const applyBinary = (operator, left, right, line) => {
  switch (operator) {
    case '+':
      return left + right
    case '-':
      return left - right
    case '*':
      return left * right
    case '/':
      return left / right
    case '%':
      return left % right
    case '===':
      return left === right
    case '==':
      return left == right
    case '!==':
      return left !== right
    case '!=':
      return left != right
    case '<':
      return left < right
    case '<=':
      return left <= right
    case '>':
      return left > right
    case '>=':
      return left >= right
    default:
      throw makeRuntimeError(`Unsupported operator: ${operator}`, line)
  }
}
const applyArrayMutation = (runtime, objectRef, method, args, line, node = null) => {
  const heapNode = runtime.getHeapNode(objectRef)
  if (!Array.isArray(heapNode.value)) {
    throw makeRuntimeError(`${method} is only supported on arrays`, line)
  }

  let result
  if (['push', 'pop', 'shift', 'unshift'].includes(method)) {
    runtime.mutateHeap(objectRef, (target) => {
      const array = target.value
      if (method === 'push') {
        result = array.push(...args)
      } else if (method === 'pop') {
        result = array.pop()
      } else if (method === 'shift') {
        result = array.shift()
      } else if (method === 'unshift') {
        result = array.unshift(...args)
      }
    })

    runtime.trackCollectionOperation(objectRef, method, {
      line,
      args: args.map((item) => valueToText(serializeValue(item))),
    })

    runtime.addUpdate({
      kind: 'heap-mutate',
      key: `heap:${heapNode.id}`,
      refId: heapNode.id,
      path: method,
      reason: `Array ${method} invoked`,
    })

    commitStep(runtime, {
      line,
      event: `Array ${method} on #${heapNode.id}`,
      eventType: 'heap',
      meta: { refId: heapNode.id, method },
    }, node)

    return result
  }

  if (method === 'slice') {
    const sliced = heapNode.value.slice(...args)
    return runtime.allocateHeap(sliced, 'array')
  }

  if (method === 'concat') {
    const unrolled = args.map((a) => (isRef(a) ? runtime.getHeapNode(a).value : a))
    const concated = heapNode.value.concat(...unrolled)
    return runtime.allocateHeap(concated, 'array')
  }

  if (method === 'indexOf') {
    return heapNode.value.indexOf(args[0])
  }

  if (method === 'includes') {
    return heapNode.value.includes(args[0])
  }

  return undefined
}

const registerBuiltins = (globalEnv, runtime) => {
  const mathObj = {
    floor: createNativeFunction('floor', ([x]) => Math.floor(x)),
    ceil: createNativeFunction('ceil', ([x]) => Math.ceil(x)),
    round: createNativeFunction('round', ([x]) => Math.round(x)),
    abs: createNativeFunction('abs', ([x]) => Math.abs(x)),
    min: createNativeFunction('min', (args) => Math.min(...args)),
    max: createNativeFunction('max', (args) => Math.max(...args)),
    pow: createNativeFunction('pow', ([x, y]) => Math.pow(x, y)),
    sqrt: createNativeFunction('sqrt', ([x]) => Math.sqrt(x)),
    random: createNativeFunction('random', () => Math.random()),
  }
  const mathRef = runtime.allocateHeap(mathObj, 'object')
  globalEnv.declare('Math', mathRef)

  globalEnv.declare('parseInt', createNativeFunction('parseInt', ([val, radix]) => parseInt(val, radix || 10)))
  globalEnv.declare('parseFloat', createNativeFunction('parseFloat', ([val]) => parseFloat(val)))
}

const processEventLoopTick = (runtime) => {
  const line = runtime.steps[runtime.steps.length - 1]?.line || 1
  let movedTask = false

  if (runtime.eventLoop.webApis.length) {
    const task = runtime.moveTask('webapi', 'macrotask', 'Timer ready, moved to macrotask queue')
    if (task) {
      movedTask = true
      recordTransitionStep(runtime, task.line || line)
    }
  }

  const next = runtime.takeNextQueuedTask()
  if (!next) {
    return movedTask
  }

  recordTransitionStep(runtime, next.task.line || line)

  if (next.task.callback) {
    invokeCallable(next.task.callback, next.task.args || [], runtime, {
      line: next.task.line || line,
      callNode: null,
      hideSyntheticCallSteps: true,
    })
  }

  runtime.completeActiveTask('Task callback finished')
  recordTransitionStep(runtime, next.task.line || line)

  return true
}

const drainEventLoop = (runtime, maxTicks = 3000) => {
  let guard = 0

  while (guard < maxTicks) {
    const progressed = processEventLoopTick(runtime)
    if (!progressed) {
      return
    }
    guard += 1
  }

  throw makeRuntimeError('Event loop processing exceeded safety budget', runtime.steps[runtime.steps.length - 1]?.line || 1)
}

const awaitPromise = (runtime, promise, line, node = null) => {
  if (!isRuntimePromise(promise)) {
    return promise
  }

  if (promise.state === 'pending') {
    commitStep(runtime, {
      line,
      event: `Awaiting Promise ${promise.id}`,
      eventType: 'async',
      meta: { promiseId: promise.id, promiseState: 'pending' },
    }, node)

    let guard = 0
    while (promise.state === 'pending' && guard < 2000) {
      const progressed = processEventLoopTick(runtime)
      if (!progressed) break
      guard += 1
    }
  }

  if (promise.state === 'pending') {
    throw makeRuntimeError(`Promise ${promise.id} never settled`, line)
  }
  if (promise.state === 'rejected') {
    throw makeRuntimeError(`Promise ${promise.id} rejected: ${promise.value}`, line)
  }

  commitStep(runtime, {
    line,
    event: `Await resumed from Promise ${promise.id}`,
    eventType: 'async',
    meta: { promiseId: promise.id, promiseState: promise.state },
  }, node)

  return promise.value
}

const invokeCallable = (callable, args, runtime, context = {}) => {
  const line = context.line || 1
  if (!callable || callable.kind !== 'function') {
    throw makeRuntimeError('Attempted to call a non-function value', line)
  }

  if (callable.nativeImpl) {
    return callable.nativeImpl(args, { runtime, line })
  }

  const parentFrame = runtime.currentFrame()
  const frameEnv = runtime.createEnv(
    callable.env,
    callable.name,
    callable.async ? 'async-function' : 'function',
    {
      captures: callable.captures,
      notes: `Closure from ${callable.env?.name || 'scope'}`,
    },
  )

  const params = callable.node?.params || []
  params.forEach((param, index) => {
    if (param.type !== 'Identifier') {
      throw makeRuntimeError('Only identifier params are supported', line)
    }

    frameEnv.declare(param.name, args[index])
    runtime.addUpdate({
      kind: 'declare',
      key: `var:${callable.name}:${param.name}`,
      scope: callable.name,
      name: param.name,
      reason: `Argument ${param.name} received`,
    })
  })

  const callNodeId = `call:${runtime.callId}`
  runtime.callId += 1

  runtime.recursionNodes.push({
    id: callNodeId,
    label: `${callable.name}(${args.map((item) => valueToText(serializeValue(item))).join(', ')})`,
    depth: runtime.frames.length,
    parentId: parentFrame.recursionNodeId,
    status: 'active',
    returnValue: null,
  })

  if (parentFrame.recursionNodeId) {
    runtime.recursionEdges.add(`${parentFrame.recursionNodeId}::${callNodeId}`)
  }

  runtime.frames.push({
    id: `frame:${callNodeId}`,
    name: callable.name,
    env: frameEnv,
    recursionNodeId: callNodeId,
  })

  if (!context.hideSyntheticCallSteps) {
    commitStep(runtime, {
      line,
      event: `Call ${callable.name}`,
      eventType: 'call',
      meta: {
        functionName: callable.name,
        args: args.map((item) => valueToText(serializeValue(item))),
      },
    }, context.callNode || callable.node)
  }

  let returnValue
  try {
    if (callable.node.body?.type === 'BlockStatement') {
      const signal = execStatement(callable.node.body, frameEnv, runtime)
      returnValue = signal?.type === 'return' ? signal.value : undefined
    } else {
      returnValue = evalExpression(callable.node.body, frameEnv, runtime)
    }
  } finally {
    const recursionNode = runtime.recursionNodes.find((item) => item.id === callNodeId)
    if (recursionNode) {
      recursionNode.status = 'returned'
      recursionNode.returnValue = valueToText(serializeValue(returnValue))
    }

    runtime.frames.pop()
    runtime.closeEnv(frameEnv)
  }

  if (!context.hideSyntheticCallSteps) {
    commitStep(runtime, {
      line,
      event: `${callable.name} returns ${valueToText(serializeValue(returnValue))}`,
      eventType: 'return',
      meta: {
        functionName: callable.name,
        returnValue: valueToText(serializeValue(returnValue)),
      },
    }, context.callNode || callable.node)
  }

  if (!callable.async) {
    return returnValue
  }

  const asyncPromise = runtime.createPromise(`async:${callable.name}`)
  queueTask(runtime, 'microtask', {
    kind: 'async-function-resolution',
    label: `Resolve ${callable.name}()`,
    line,
    callback: createNativeFunction(`resolve:${asyncPromise.id}`, () => {
      settlePromise(runtime, asyncPromise, 'fulfilled', returnValue, line)
      return undefined
    }),
  }, `Async function ${callable.name} queued resolution`, context.callNode || callable.node)

  return asyncPromise
}

const queuePromiseHandler = (runtime, promise, handler, line) => {
  queueTask(runtime, 'microtask', {
    kind: 'promise-handler',
    label: `Promise ${promise.id} handler`,
    line,
    callback: createNativeFunction(`promise:${promise.id}`, () => {
      const callback = promise.state === 'fulfilled' ? handler.onFulfilled : handler.onRejected

      if (!callback) {
        if (promise.state === 'fulfilled') {
          settlePromise(runtime, handler.nextPromise, 'fulfilled', promise.value, line)
        } else {
          settlePromise(runtime, handler.nextPromise, 'rejected', promise.value, line)
        }
        return undefined
      }

      try {
        const output = invokeCallable(callback, [promise.value], runtime, { line, callNode: null })
        if (isRuntimePromise(output)) {
          attachPromiseHandler(runtime, output, null, null, line, handler.nextPromise)
          return undefined
        }
        settlePromise(runtime, handler.nextPromise, 'fulfilled', output, line)
      } catch (error) {
        settlePromise(runtime, handler.nextPromise, 'rejected', error.message, line)
      }

      return undefined
    }),
  }, 'Promise reaction queued')
}
const evalExpression = (node, env, runtime) => {
  switch (node.type) {
    case 'Literal':
      return node.value

    case 'Identifier': {
      const lookup = resolveIdentifier(env, node.name)
      runtime.recordResolution(lookup.path)
      if (!lookup.scope) {
        throw makeRuntimeError(`'${node.name}' is not defined`, node.loc?.start?.line)
      }
      return lookup.scope.bindings.get(node.name)
    }

    case 'ArrayExpression': {
      const entries = node.elements.map((entry) => (entry ? evalExpression(entry, env, runtime) : undefined))
      return runtime.allocateHeap(entries, 'array')
    }

    case 'ObjectExpression': {
      const object = {}
      node.properties.forEach((property) => {
        if (property.type !== 'Property') {
          throw makeRuntimeError('Only simple object properties are supported', node.loc?.start?.line)
        }
        const key = property.key.type === 'Identifier' ? property.key.name : property.key.value
        object[key] = evalExpression(property.value, env, runtime)
      })
      return runtime.allocateHeap(object, 'object')
    }

    case 'FunctionExpression':
    case 'ArrowFunctionExpression':
      return createFunctionValue(node, env, node.id?.name || 'anonymous')

    case 'NewExpression': {
      const line = node.loc?.start?.line || 1
      if (node.callee.type === 'Identifier' && node.callee.name === 'Promise') {
        const promise = runtime.createPromise('Promise')
        const executor = node.arguments[0] ? evalExpression(node.arguments[0], env, runtime) : null

        if (executor && executor.kind === 'function') {
          const resolveFn = createNativeFunction(`resolve:${promise.id}`, ([value]) => {
            settlePromise(runtime, promise, 'fulfilled', value, line)
            return undefined
          })
          const rejectFn = createNativeFunction(`reject:${promise.id}`, ([reason]) => {
            settlePromise(runtime, promise, 'rejected', reason, line)
            return undefined
          })
          invokeCallable(executor, [resolveFn, rejectFn], runtime, {
            line,
            callNode: node,
            hideSyntheticCallSteps: true,
          })
        }

        return promise
      }
      throw makeRuntimeError('Unsupported constructor', line)
    }

    case 'BinaryExpression': {
      const left = evalExpression(node.left, env, runtime)
      const right = evalExpression(node.right, env, runtime)
      return applyBinary(node.operator, left, right, node.loc?.start?.line)
    }

    case 'LogicalExpression': {
      const left = evalExpression(node.left, env, runtime)
      if (node.operator === '&&') {
        return truthy(left) ? evalExpression(node.right, env, runtime) : left
      }
      if (node.operator === '||') {
        return truthy(left) ? left : evalExpression(node.right, env, runtime)
      }
      throw makeRuntimeError(`Unsupported logical operator: ${node.operator}`, node.loc?.start?.line)
    }

    case 'UnaryExpression': {
      const arg = evalExpression(node.argument, env, runtime)
      if (node.operator === '-') return -arg
      if (node.operator === '+') return +arg
      if (node.operator === '!') return !truthy(arg)
      throw makeRuntimeError(`Unsupported unary operator: ${node.operator}`, node.loc?.start?.line)
    }

    case 'ConditionalExpression': {
      const test = evalExpression(node.test, env, runtime)
      return truthy(test)
        ? evalExpression(node.consequent, env, runtime)
        : evalExpression(node.alternate, env, runtime)
    }

    case 'AwaitExpression': {
      const awaited = evalExpression(node.argument, env, runtime)
      return awaitPromise(runtime, awaited, node.loc?.start?.line || 1, node)
    }

    case 'MemberExpression': {
      const objectValue = evalExpression(node.object, env, runtime)
      const property = node.computed
        ? evalExpression(node.property, env, runtime)
        : node.property.name
      return readMember(runtime, objectValue, property, node.loc?.start?.line || 1, node)
    }

    case 'AssignmentExpression': {
      const right = evalExpression(node.right, env, runtime)
      const line = node.loc?.start?.line || 1

      if (node.left.type === 'Identifier') {
        const name = node.left.name
        const lookup = resolveIdentifier(env, name)
        runtime.recordResolution(lookup.path)
        if (!lookup.scope) {
          throw makeRuntimeError(`'${name}' is not defined`, line)
        }

        const prev = lookup.scope.bindings.get(name)
        const base = node.operator === '=' ? 0 : prev
        const next = node.operator === '=' ? right : applyBinary(node.operator.slice(0, -1), base, right, line)
        lookup.scope.bindings.set(name, next)

        runtime.addUpdate({
          kind: 'set',
          key: `var:${lookup.scope.name}:${name}`,
          scope: lookup.scope.name,
          name,
          prev: valueToText(serializeValue(prev)),
          next: valueToText(serializeValue(next)),
          reason: `${name} updated`,
        })

        if (isRef(next) && !isRef(prev)) {
          commitStep(runtime, {
            line,
            event: `${name} now points to #${refId(next)}`,
            eventType: 'reference',
            meta: { name, refId: refId(next) },
          }, node)
        }

        return next
      }

      if (node.left.type === 'MemberExpression') {
        const objectValue = evalExpression(node.left.object, env, runtime)
        const property = node.left.computed
          ? evalExpression(node.left.property, env, runtime)
          : node.left.property.name

        if (node.operator === '=') {
          writeMember(runtime, objectValue, property, right, line, node)
          return right
        }

        const current = readMember(runtime, objectValue, property, line, node)
        const result = applyBinary(node.operator.slice(0, -1), current, right, line)
        writeMember(runtime, objectValue, property, result, line, node)
        return result
      }

      throw makeRuntimeError('Unsupported assignment target', line)
    }

    case 'UpdateExpression': {
      const line = node.loc?.start?.line || 1
      if (node.argument.type !== 'Identifier') {
        throw makeRuntimeError('Only identifier updates are supported', line)
      }
      const lookup = resolveIdentifier(env, node.argument.name)
      runtime.recordResolution(lookup.path)
      if (!lookup.scope) {
        throw makeRuntimeError(`'${node.argument.name}' is not defined`, line)
      }
      const current = lookup.scope.bindings.get(node.argument.name)
      const delta = node.operator === '++' ? 1 : -1
      const next = current + delta
      lookup.scope.bindings.set(node.argument.name, next)

      runtime.addUpdate({
        kind: 'set',
        key: `var:${lookup.scope.name}:${node.argument.name}`,
        scope: lookup.scope.name,
        name: node.argument.name,
        prev: valueToText(serializeValue(current)),
        next: valueToText(serializeValue(next)),
        reason: `${node.argument.name} ${node.operator}`,
      })

      return node.prefix ? next : current
    }

    case 'CallExpression':
      return evalCallExpression(node, env, runtime)

    default:
      throw makeRuntimeError(`Unsupported expression: ${node.type}`, node.loc?.start?.line || 1)
  }
}

const evalCallExpression = (node, env, runtime) => {
  const line = node.loc?.start?.line || 1

  if (
    node.callee.type === 'MemberExpression'
    && node.callee.object.type === 'Identifier'
    && node.callee.object.name === 'console'
    && node.callee.property.type === 'Identifier'
    && node.callee.property.name === 'log'
  ) {
    const values = node.arguments.map((arg) => evalExpression(arg, env, runtime))
    const text = values.map((item) => valueToText(serializeValue(item))).join(' ')
    runtime.addOutput(text)

    commitStep(runtime, {
      line,
      event: `console.log(${text})`,
      eventType: 'output',
    }, node)
    return undefined
  }

  if (node.callee.type === 'Identifier' && node.callee.name === 'setTimeout') {
    const callback = node.arguments[0] ? evalExpression(node.arguments[0], env, runtime) : null
    const delay = node.arguments[1] ? Number(evalExpression(node.arguments[1], env, runtime)) : 0

    if (!callback || callback.kind !== 'function') {
      throw makeRuntimeError('setTimeout requires a function callback', line)
    }

    const task = queueTask(runtime, 'webapi', {
      kind: 'timeout',
      label: `setTimeout(${Number.isFinite(delay) ? delay : 0})`,
      line,
      callback,
      args: [],
      meta: { delay: Number.isFinite(delay) ? delay : 0 },
    }, `Timer scheduled for ${Number.isFinite(delay) ? delay : 0}ms`, node)

    return task.id
  }

  if (
    node.callee.type === 'MemberExpression'
    && node.callee.object.type === 'Identifier'
    && node.callee.object.name === 'Promise'
    && node.callee.property.type === 'Identifier'
  ) {
    const method = node.callee.property.name
    if (method === 'resolve' || method === 'reject') {
      const promise = runtime.createPromise(`Promise.${method}`)
      const arg = node.arguments[0] ? evalExpression(node.arguments[0], env, runtime) : undefined
      settlePromise(runtime, promise, method === 'resolve' ? 'fulfilled' : 'rejected', arg, line)
      return promise
    }
  }

  if (node.callee.type === 'MemberExpression') {
    const objectValue = evalExpression(node.callee.object, env, runtime)
    const property = node.callee.computed
      ? evalExpression(node.callee.property, env, runtime)
      : node.callee.property.name

    if (isRuntimePromise(objectValue) && (property === 'then' || property === 'catch')) {
      const onFulfilled = property === 'then' && node.arguments[0] ? evalExpression(node.arguments[0], env, runtime) : null
      const onRejected = property === 'catch'
        ? (node.arguments[0] ? evalExpression(node.arguments[0], env, runtime) : null)
        : (node.arguments[1] ? evalExpression(node.arguments[1], env, runtime) : null)

      const chained = attachPromiseHandler(runtime, objectValue, onFulfilled, onRejected, line)
      commitStep(runtime, {
        line,
        event: `Promise ${objectValue.id}.${property} registered`,
        eventType: 'async',
        meta: { promiseId: objectValue.id, method: property },
      }, node)
      return chained
    }

    if (isRef(objectValue) && ['push', 'pop', 'shift', 'unshift', 'slice', 'concat', 'indexOf', 'includes'].includes(property)) {
      const args = node.arguments.map((arg) => evalExpression(arg, env, runtime))
      return applyArrayMutation(runtime, objectValue, property, args, line, node)
    }

    const callable = readMember(runtime, objectValue, property, line, node)
    const args = node.arguments.map((arg) => evalExpression(arg, env, runtime))
    return invokeCallable(callable, args, runtime, { line, callNode: node })
  }

  let callable
  if (node.callee.type === 'Identifier') {
    const lookup = resolveIdentifier(env, node.callee.name)
    runtime.recordResolution(lookup.path)
    if (!lookup.scope) {
      throw makeRuntimeError(`${node.callee.name} is not defined`, line)
    }
    callable = lookup.scope.bindings.get(node.callee.name)
  } else {
    callable = evalExpression(node.callee, env, runtime)
  }

  const args = node.arguments.map((arg) => evalExpression(arg, env, runtime))
  return invokeCallable(callable, args, runtime, { line, callNode: node })
}
const execBlock = (statements, env, runtime) => {
  for (const statement of statements) {
    const signal = execStatement(statement, env, runtime)
    if (signal) return signal
  }
  return null
}

const execStatement = (node, env, runtime) => {
  if (!node) {
    return null
  }

  const line = node.loc?.start?.line || 1
  const baseEvent = statementEvent(node)
  commitStep(runtime, {
    line,
    event: baseEvent.event,
    eventType: baseEvent.eventType,
  }, node)

  switch (node.type) {
    case 'VariableDeclaration': {
      node.declarations.forEach((decl) => {
        if (decl.id.type !== 'Identifier') {
          throw makeRuntimeError('Only identifier declarations are supported', line)
        }
        const name = decl.id.name
        const value = decl.init ? evalExpression(decl.init, env, runtime) : undefined
        env.declare(name, value)

        runtime.addUpdate({
          kind: 'declare',
          key: `var:${env.name}:${name}`,
          scope: env.name,
          name,
          reason: `${name} declared`,
        })
      })
      return null
    }

    case 'ExpressionStatement':
      evalExpression(node.expression, env, runtime)
      return null

    case 'FunctionDeclaration':
      env.declare(node.id.name, createFunctionValue(node, env))
      runtime.addUpdate({
        kind: 'declare',
        key: `var:${env.name}:${node.id.name}`,
        scope: env.name,
        name: node.id.name,
        reason: `Function ${node.id.name} is ready`,
      })
      return null

    case 'IfStatement': {
      const decision = evalExpression(node.test, env, runtime)
      commitStep(runtime, {
        line,
        event: `Condition is ${decision ? 'true' : 'false'}`,
        eventType: 'branch',
        meta: { branch: decision ? 'consequent' : 'alternate' },
      }, node.test)

      if (truthy(decision)) {
        const branchEnv = runtime.createEnv(env, 'If Block', 'block')
        try {
          return execStatement(node.consequent, branchEnv, runtime)
        } finally {
          runtime.closeEnv(branchEnv)
        }
      }

      if (node.alternate) {
        const branchEnv = runtime.createEnv(env, 'Else Block', 'block')
        try {
          return execStatement(node.alternate, branchEnv, runtime)
        } finally {
          runtime.closeEnv(branchEnv)
        }
      }
      return null
    }

    case 'BlockStatement': {
      const blockEnv = runtime.createEnv(env, 'Block', 'block')
      try {
        return execBlock(node.body, blockEnv, runtime)
      } finally {
        runtime.closeEnv(blockEnv)
      }
    }

    case 'ForStatement': {
      const loopEnv = runtime.createEnv(env, 'For Loop', 'loop')
      let iteration = 0

      try {
        if (node.init) {
          if (node.init.type === 'VariableDeclaration') {
            execStatement(node.init, loopEnv, runtime)
          } else {
            evalExpression(node.init, loopEnv, runtime)
          }
        }

        while (node.test ? truthy(evalExpression(node.test, loopEnv, runtime)) : true) {
          iteration += 1
          const loopVar = node.init?.declarations?.[0]?.id?.name || 'i'
          const loopValue = loopEnv.resolve(loopVar) ? loopEnv.get(loopVar) : iteration
          commitStep(runtime, {
            line,
            event: `Loop iteration ${iteration}`,
            eventType: 'loop',
            meta: {
              loopType: 'for',
              iteration,
              loopVariable: loopVar,
              loopValue,
              condition: true,
            },
          }, node)

          const signal = execStatement(node.body, loopEnv, runtime)
          if (signal?.type === 'return') {
            return signal
          }
          if (node.update) {
            evalExpression(node.update, loopEnv, runtime)
          }
        }

        commitStep(runtime, {
          line,
          event: 'Loop condition became false',
          eventType: 'loop',
          meta: { loopType: 'for', condition: false, iteration },
        }, node)
        return null
      } finally {
        runtime.closeEnv(loopEnv)
      }
    }

    case 'WhileStatement': {
      const loopEnv = runtime.createEnv(env, 'While Loop', 'loop')
      let iteration = 0
      try {
        while (truthy(evalExpression(node.test, loopEnv, runtime))) {
          iteration += 1
          commitStep(runtime, {
            line,
            event: `While iteration ${iteration}`,
            eventType: 'loop',
            meta: { loopType: 'while', iteration, condition: true },
          }, node)

          const signal = execStatement(node.body, loopEnv, runtime)
          if (signal?.type === 'return') {
            return signal
          }
        }

        commitStep(runtime, {
          line,
          event: 'While condition became false',
          eventType: 'loop',
          meta: { loopType: 'while', condition: false, iteration },
        }, node)
        return null
      } finally {
        runtime.closeEnv(loopEnv)
      }
    }

    case 'ReturnStatement': {
      const value = node.argument ? evalExpression(node.argument, env, runtime) : undefined
      return new FlowSignal('return', value)
    }

    case 'TryStatement':
      try {
        return execStatement(node.block, env, runtime)
      } catch (error) {
        if (!node.handler) throw error
        const catchEnv = runtime.createEnv(env, 'Catch Block', 'block')
        catchEnv.declare(node.handler.param?.name || 'error', error.message)
        try {
          return execStatement(node.handler.body, catchEnv, runtime)
        } finally {
          runtime.closeEnv(catchEnv)
        }
      } finally {
        if (node.finalizer) {
          execStatement(node.finalizer, env, runtime)
        }
      }

    case 'ThrowStatement': {
      const value = node.argument ? evalExpression(node.argument, env, runtime) : 'Error'
      throw makeRuntimeError(String(valueToText(serializeValue(value))), line)
    }

    case 'EmptyStatement':
      return null

    default:
      throw makeRuntimeError(`Unsupported statement: ${node.type}`, line)
  }
}

export const serializeValue = (value) => {
  if (isRef(value)) {
    return { kind: 'reference', refId: refId(value), label: `#${refId(value)}` }
  }

  if (value?.kind === 'function') {
    return { kind: 'function', label: `[fn ${value.name}]` }
  }

  if (value?.kind === 'promise') {
    return { kind: 'promise', label: `${value.label}<${value.state}>`, promiseId: value.id }
  }

  if (typeof value === 'string') {
    return { kind: 'primitive', label: `"${value}"` }
  }
  if (value === undefined) {
    return { kind: 'primitive', label: 'undefined' }
  }
  if (value === null) {
    return { kind: 'primitive', label: 'null' }
  }

  return { kind: 'primitive', label: String(value) }
}

export const simulateExecution = (code, language = 'javascript', options = {}) => {
  let astArtifacts = {
    rootId: null,
    root: null,
    nodesById: {},
    lineToNodeIds: {},
    orderedNodeIds: [],
  }

  try {
    registerPyodidePluginStub()
    const plugin = options.preferRuntimePlugin
      ? selectRuntimePlugin(language, options.runtimePluginId || null)
      : null

    const runtimeMeta = {
      engine: 'simulator',
      plugin: plugin?.id || null,
      fallbackReason: plugin && typeof plugin.simulate !== 'function'
        ? (plugin.unavailableReason || 'Selected plugin does not expose synchronous execution.')
        : null,
    }

    const translated = transpileToJavaScript(code, language)
    const ast = parse(translated.code, {
      ecmaVersion: 'latest',
      locations: true,
      sourceType: 'script',
    })
    astArtifacts = buildAstArtifacts(ast)

    const runtime = new Runtime({
      lineMap: translated.lineMap,
      sourceLanguage: language,
    })
    const globalEnv = runtime.currentFrame().env
    registerBuiltins(globalEnv, runtime)

    for (const stmt of ast.body) {
      const signal = execStatement(stmt, globalEnv, runtime)
      if (signal?.type === 'return') {
        commitStep(runtime, {
          line: stmt.loc?.start?.line || 1,
          event: 'Program returned early',
          eventType: 'return',
        }, stmt)
        break
      }
    }

    if (runtime.steps.length === 0) {
      commitStep(runtime, {
        line: 1,
        event: 'No executable statements',
        eventType: 'execution',
      })
    }

    drainEventLoop(runtime)

    const enriched = enrichExecutionInsights(runtime.steps)
    const complexityReport = buildComplexityReport(ast, enriched.steps)
    const synchronizationLayer = buildSynchronizationLayer(enriched.steps, astArtifacts)

    return {
      ok: true,
      steps: enriched.steps,
      variableHistoryIndex: enriched.variableHistoryIndex,
      loopClusters: enriched.loopClusters,
      error: null,
      translatedCode: translated.code,
      astArtifacts,
      complexityReport,
      synchronizationLayer,
      runtimeMeta,
      runtimePlugins: listRuntimePlugins(),
    }
  } catch (error) {
    const line = error.__line || 1
    const failedStep = {
      id: 0,
      line,
      event: `Execution error: ${error.message}`,
      eventType: 'error',
      explanation: `Execution failed on line ${line}. Review the stack and recent updates.`,
      trace: [`Error: ${error.message}`],
      outputs: [],
      callStack: [],
      heap: [],
      pointerLinks: [],
      recursionTree: { nodes: [], edges: [] },
      updates: [],
      meta: { line, astNodeId: null },
      eventLoop: {
        webApis: [],
        microtaskQueue: [],
        macrotaskQueue: [],
        activeTask: null,
        transitions: [],
        lastTransition: null,
        queuePriority: 'microtask-first',
      },
      scopeState: {
        scopes: [],
        tree: [],
        activeScopeId: null,
        resolutionPath: [],
      },
    }

    const enriched = enrichExecutionInsights([failedStep])

    return {
      ok: false,
      error: error.message,
      steps: enriched.steps,
      variableHistoryIndex: enriched.variableHistoryIndex,
      loopClusters: enriched.loopClusters,
      astArtifacts,
      complexityReport: buildComplexityReport(null, enriched.steps),
      synchronizationLayer: buildSynchronizationLayer(enriched.steps, astArtifacts),
      runtimeMeta: {
        engine: 'simulator',
        plugin: null,
        fallbackReason: null,
      },
      runtimePlugins: listRuntimePlugins(),
    }
  }
}
