export const computeRuntimeMetrics = (steps, stepIndex = steps.length - 1) => {
  const viewed = steps.slice(0, Math.max(stepIndex + 1, 0))

  const uniqueLines = new Set()
  let functionCalls = 0
  let recursionDepth = 0
  let loopIterations = 0
  let peakStackDepth = 0
  let heapObjectCount = 0

  viewed.forEach((step) => {
    if (step.line) {
      uniqueLines.add(step.line)
    }

    if (step.eventType === 'call') {
      functionCalls += 1
    }

    if (step.eventType === 'loop') {
      loopIterations += 1
    }

    peakStackDepth = Math.max(peakStackDepth, step.callStack?.length || 0)
    recursionDepth = Math.max(recursionDepth, step.recursionTree?.nodes?.length || 0)
    heapObjectCount = Math.max(heapObjectCount, step.heap?.length || 0)
  })

  const outputCount = viewed[viewed.length - 1]?.outputs?.length || 0

  const complexityLabel = loopIterations > 25 || recursionDepth > 18
    ? 'High'
    : loopIterations > 10 || recursionDepth > 8
      ? 'Moderate'
      : 'Basic'

  return {
    totalExecutionSteps: viewed.length,
    functionCallCount: functionCalls,
    recursionDepth,
    loopIterations,
    peakStackDepth,
    heapObjectCount,
    outputCount,
    hotLineCount: uniqueLines.size,
    estimatedComplexity: complexityLabel,
  }
}
