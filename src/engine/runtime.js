import {
  completeActiveEventTask,
  createEventLoopState,
  enqueueTask,
  makeEventTask,
  moveTaskBetweenQueues,
  snapshotEventLoopState,
  takeNextEventLoopTask,
} from './eventLoop.js'
import {
  closeScope,
  createScopeTracker,
  recordResolutionPath,
  registerScope,
  snapshotScopes,
} from './scopeTracker.js'

const REF_PREFIX = 'ref:'

export const makeRef = (id) => ({ __ref: `${REF_PREFIX}${id}` })

export const isRef = (value) => Boolean(value && typeof value === 'object' && typeof value.__ref === 'string' && value.__ref.startsWith(REF_PREFIX))

export const refId = (value) => {
  if (!isRef(value)) {
    return null
  }
  return value.__ref.slice(REF_PREFIX.length)
}

export class Env {
  constructor(parent = null, name = 'scope', options = {}) {
    this.parent = parent
    this.name = name
    this.type = options.type || 'block'
    this.id = options.id || null
    this.bindings = new Map()
  }

  declare(name, value) {
    this.bindings.set(name, value)
  }

  resolve(name) {
    if (this.bindings.has(name)) {
      return this
    }
    if (this.parent) {
      return this.parent.resolve(name)
    }
    return null
  }

  get(name) {
    const scope = this.resolve(name)
    if (!scope) {
      throw new Error(`'${name}' is not defined`)
    }
    return scope.bindings.get(name)
  }

  set(name, value) {
    const scope = this.resolve(name)
    if (!scope) {
      throw new Error(`'${name}' is not defined`)
    }
    scope.bindings.set(name, value)
  }

  entries() {
    return [...this.bindings.entries()]
  }
}

export class Runtime {
  constructor({ lineMap = [], sourceLanguage = 'javascript', maxSteps = 3500 }) {
    this.maxSteps = maxSteps
    this.lineMap = lineMap
    this.sourceLanguage = sourceLanguage

    this.outputs = []
    this.trace = []
    this.steps = []
    this.updates = []
    this.errors = []
    this.bookmarks = []

    this.stepId = 0
    this.heapId = 0
    this.callId = 0
    this.promiseId = 0

    this.heap = new Map()
    this.promises = new Map()
    this.collectionOps = new Map()

    this.eventLoop = createEventLoopState()
    this.scopeTracker = createScopeTracker()

    const globalEnv = this.createEnv(null, 'Global', 'global')
    this.frames = [{
      id: 'frame:global',
      name: 'Global',
      env: globalEnv,
      recursionNodeId: null,
    }]

    this.recursionNodes = []
    this.recursionEdges = new Set()
    this.lastLoopMeta = null
    this.lastAccess = null
    this.lastCallEvent = null
  }

  createEnv(parent = null, name = 'scope', type = 'block', options = {}) {
    const env = new Env(parent, name, { type })
    registerScope(this.scopeTracker, env, {
      type,
      createdAtStep: this.stepId,
      captures: options.captures || [],
      notes: options.notes || null,
    })
    return env
  }

  closeEnv(env) {
    closeScope(this.scopeTracker, env, this.stepId)
  }

  scopeSnapshot() {
    return snapshotScopes(this.scopeTracker)
  }

  recordResolution(path) {
    recordResolutionPath(this.scopeTracker, path)
  }

  currentFrame() {
    return this.frames[this.frames.length - 1]
  }

  mapLine(line) {
    if (!this.lineMap.length) {
      return line || 1
    }
    return this.lineMap[(line || 1) - 1] || line || 1
  }

  ensureBudget() {
    if (this.stepId >= this.maxSteps) {
      const error = new Error(`Step limit (${this.maxSteps}) reached. Try smaller input.`)
      error.__line = this.steps[this.steps.length - 1]?.line || 1
      throw error
    }
  }

  pushTrace(event) {
    this.trace.push(event)
    if (this.trace.length > 140) {
      this.trace.shift()
    }
  }

  allocateHeap(value, shape = 'object') {
    const id = `h${this.heapId}`
    this.heapId += 1

    this.heap.set(id, {
      id,
      shape,
      value,
      mutationCount: 0,
      lastMutationStep: 0,
      createdAtStep: this.stepId,
      collectionOps: [],
    })

    return makeRef(id)
  }

  getHeapNode(refValue) {
    const id = refId(refValue)
    if (!id || !this.heap.has(id)) {
      throw new Error('Invalid heap reference')
    }
    return this.heap.get(id)
  }

  mutateHeap(refValue, mutateFn) {
    const node = this.getHeapNode(refValue)
    mutateFn(node)
    node.mutationCount += 1
    node.lastMutationStep = this.stepId
  }

  trackCollectionOperation(refValue, operation, metadata = {}) {
    const id = refId(refValue)
    if (!id) return

    const entry = {
      operation,
      stepId: this.stepId,
      ...metadata,
    }

    if (!this.collectionOps.has(id)) {
      this.collectionOps.set(id, [])
    }
    this.collectionOps.get(id).push(entry)

    const heapNode = this.heap.get(id)
    if (heapNode) {
      heapNode.collectionOps = [...(heapNode.collectionOps || []), entry]
      if (heapNode.collectionOps.length > 40) {
        heapNode.collectionOps = heapNode.collectionOps.slice(-40)
      }
    }
  }

  createPromise(label = 'promise') {
    const id = `p${this.promiseId}`
    this.promiseId += 1

    const promise = {
      kind: 'promise',
      id,
      label,
      state: 'pending',
      value: undefined,
      handlers: [],
      createdAtStep: this.stepId,
      settledAtStep: null,
    }

    this.promises.set(id, promise)
    return promise
  }

  getPromise(id) {
    return this.promises.get(id)
  }

  makeEventTask(payload) {
    return makeEventTask(this.eventLoop, payload)
  }

  enqueueTask(queueName, task, reason = '') {
    enqueueTask(this.eventLoop, queueName, task, this.stepId, reason)
  }

  moveTask(fromQueue, toQueue, reason = '') {
    return moveTaskBetweenQueues(this.eventLoop, fromQueue, toQueue, this.stepId, reason)
  }

  takeNextQueuedTask() {
    return takeNextEventLoopTask(this.eventLoop, this.stepId)
  }

  completeActiveTask(reason = '') {
    return completeActiveEventTask(this.eventLoop, this.stepId, reason)
  }

  eventLoopSnapshot() {
    return snapshotEventLoopState(this.eventLoop)
  }

  addUpdate(update) {
    this.updates.push(update)
  }

  consumeUpdates() {
    const list = [...this.updates]
    this.updates = []
    return list
  }

  recordAccess(access) {
    this.lastAccess = access
  }

  addOutput(text) {
    this.outputs.push(text)
  }

  addError(error) {
    this.errors.push(error)
  }

  addBookmark(bookmark) {
    this.bookmarks.push(bookmark)
  }

  capture({ event, eventType, line, meta = {} }) {
    this.ensureBudget()
    this.pushTrace(event)

    this.steps.push({
      id: this.stepId,
      line: this.mapLine(line),
      event,
      eventType,
      meta,
      updates: this.consumeUpdates(),
      trace: [...this.trace],
      outputs: [...this.outputs],
      errors: [...this.errors],
      bookmarks: [...this.bookmarks],
      lastAccess: this.lastAccess,
      eventLoop: this.eventLoopSnapshot(),
      scopeState: this.scopeSnapshot(),
    })

    this.stepId += 1
  }
}
