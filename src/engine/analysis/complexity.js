const complexityRank = {
  'O(1)': 1,
  'O(log N)': 2,
  'O(N)': 3,
  'O(N log N)': 4,
  'O(N^2)': 5,
  'O(2^N)': 6,
}

const higherComplexity = (left, right) => {
  if (!left) return right
  if (!right) return left
  return complexityRank[right] > complexityRank[left] ? right : left
}

const walk = (node, visitor) => {
  if (!node || typeof node !== 'object') return
  if (node.type) {
    visitor(node)
  }

  Object.values(node).forEach((value) => {
    if (Array.isArray(value)) {
      value.forEach((item) => walk(item, visitor))
      return
    }

    if (value && typeof value === 'object') {
      walk(value, visitor)
    }
  })
}

const analyzeStatic = (ast) => {
  const loopLines = []
  const recursiveFunctions = new Set()
  const functionStack = []
  let maxLoopDepth = 0
  let loopDepth = 0
  let allocationSites = 0

  walk(ast, (node) => {
    if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression') {
      functionStack.push(node.id?.name || 'anonymous')
    }

    if (node.type === 'ForStatement' || node.type === 'WhileStatement' || node.type === 'DoWhileStatement') {
      loopDepth += 1
      maxLoopDepth = Math.max(maxLoopDepth, loopDepth)
      loopLines.push(node.loc?.start?.line || 1)
    }

    if (node.type === 'CallExpression' && node.callee?.type === 'Identifier') {
      const currentFunction = functionStack[functionStack.length - 1]
      if (currentFunction && node.callee.name === currentFunction) {
        recursiveFunctions.add(currentFunction)
      }
    }

    if (node.type === 'ArrayExpression' || node.type === 'ObjectExpression' || node.type === 'NewExpression') {
      allocationSites += 1
    }
  })

  const hasRecursion = recursiveFunctions.size > 0

  let estimatedTime = 'O(1)'
  if (maxLoopDepth >= 2) {
    estimatedTime = 'O(N^2)'
  } else if (maxLoopDepth === 1 || hasRecursion) {
    estimatedTime = 'O(N)'
  }

  let estimatedSpace = 'O(1)'
  if (hasRecursion || allocationSites > 0) {
    estimatedSpace = 'O(N)'
  }

  return {
    maxLoopDepth,
    hasRecursion,
    allocationSites,
    loopLines,
    estimatedTime,
    estimatedSpace,
  }
}

const analyzeDynamic = (steps) => {
  let operations = 0
  let peakMemory = 0
  let loopEvents = 0
  let callDepth = 0

  const operationsSeries = []
  const memorySeries = []

  steps.forEach((step, index) => {
    const updateCount = step.updates?.length || 0
    const opWeight = 1 + updateCount + (step.eventType === 'loop' ? 1 : 0) + (step.eventType === 'heap' ? 1 : 0)
    operations += opWeight

    const stackSize = step.callStack?.length || 0
    const heapSize = step.heap?.length || 0
    const memory = stackSize + heapSize
    peakMemory = Math.max(peakMemory, memory)

    if (step.eventType === 'loop') {
      loopEvents += 1
    }

    callDepth = Math.max(callDepth, stackSize)

    operationsSeries.push({ step: index + 1, value: operations })
    memorySeries.push({ step: index + 1, value: memory })
  })

  let estimatedTime = 'O(1)'
  if (loopEvents > 18 || operations > 120) {
    estimatedTime = 'O(N^2)'
  } else if (loopEvents > 0 || operations > 32) {
    estimatedTime = 'O(N)'
  }

  let estimatedSpace = 'O(1)'
  if (peakMemory > 12 || callDepth > 6) {
    estimatedSpace = 'O(N)'
  }

  return {
    operations,
    peakMemory,
    loopEvents,
    callDepth,
    estimatedTime,
    estimatedSpace,
    operationsSeries,
    memorySeries,
  }
}

export const buildComplexityReport = (ast, steps) => {
  const staticInfo = analyzeStatic(ast)
  const dynamicInfo = analyzeDynamic(steps)

  const estimatedTime = higherComplexity(staticInfo.estimatedTime, dynamicInfo.estimatedTime)
  const estimatedSpace = higherComplexity(staticInfo.estimatedSpace, dynamicInfo.estimatedSpace)

  const agreement = staticInfo.estimatedTime === dynamicInfo.estimatedTime
  const confidenceScore = agreement ? 0.82 : 0.64
  const confidence = confidenceScore >= 0.8 ? 'High' : confidenceScore >= 0.7 ? 'Medium' : 'Low'

  const reasons = [
    `Static analysis detected loop depth ${staticInfo.maxLoopDepth}${staticInfo.hasRecursion ? ' with recursion' : ''}.`,
    `Dynamic trace observed ${dynamicInfo.operations} weighted operations and peak memory footprint ${dynamicInfo.peakMemory}.`,
    agreement
      ? 'Static and dynamic estimates agree on the dominant trend.'
      : 'Static and dynamic estimates diverge; reported bound uses the more conservative class.',
  ]

  return {
    estimatedTime,
    estimatedSpace,
    confidence,
    confidenceScore,
    reasoning: reasons.join(' '),
    static: staticInfo,
    dynamic: dynamicInfo,
    graphs: {
      operationsVsSteps: dynamicInfo.operationsSeries,
      memoryVsSteps: dynamicInfo.memorySeries,
    },
  }
}
