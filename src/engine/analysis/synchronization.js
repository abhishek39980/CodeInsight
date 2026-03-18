const pushMapList = (map, key, value) => {
  if (!key && key !== 0) {
    return
  }
  if (!map[key]) {
    map[key] = []
  }
  map[key].push(value)
}

export const buildSynchronizationLayer = (steps, astArtifacts) => {
  const stepToLine = {}
  const stepToNode = {}
  const lineToStepIds = {}
  const nodeToStepIds = {}

  steps.forEach((step) => {
    stepToLine[step.id] = step.line
    stepToNode[step.id] = step.meta?.astNodeId || null

    pushMapList(lineToStepIds, step.line, step.id)
    if (step.meta?.astNodeId) {
      pushMapList(nodeToStepIds, step.meta.astNodeId, step.id)
    }
  })

  const nodeToLine = {}
  Object.values(astArtifacts?.nodesById || {}).forEach((node) => {
    nodeToLine[node.id] = node.startLine
  })

  return {
    stepToLine,
    stepToNode,
    lineToStepIds,
    nodeToStepIds,
    nodeToLine,
    lineToNodeIds: astArtifacts?.lineToNodeIds || {},
  }
}
