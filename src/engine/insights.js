const scoreByEvent = {
  error: 1,
  call: 0.9,
  return: 0.86,
  heap: 0.82,
  reference: 0.8,
  branch: 0.72,
  loop: 0.58,
  output: 0.62,
  async: 0.74,
  scope: 0.66,
  declare: 0.44,
  execution: 0.34,
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const inferPrimaryEntity = (step) => {
  const firstUpdateKey = step.updates?.[0]?.key
  if (firstUpdateKey) {
    return firstUpdateKey
  }

  if (step.meta?.refId) {
    return `heap:${step.meta.refId}`
  }

  if (step.meta?.taskId) {
    return `task:${step.meta.taskId}`
  }

  if (step.lastAccess?.refId) {
    return `heap:${step.lastAccess.refId}`
  }

  return null
}

const ensureArrayMap = (map, key, value) => {
  if (!map.has(key)) {
    map.set(key, [])
  }
  map.get(key).push(value)
}

const groupLoopClusters = (steps) => {
  let sequence = 0
  const clusters = []
  let activeCluster = null

  steps.forEach((step, index) => {
    if (step.eventType !== 'loop') {
      activeCluster = null
      return
    }

    const key = `${step.line}:${step.meta?.loopType || 'loop'}`
    const continues =
      activeCluster
      && activeCluster.key === key
      && (step.meta?.condition !== false)
      && (steps[index - 1]?.eventType === 'loop')

    if (!continues) {
      activeCluster = {
        id: `loop:${sequence}`,
        key,
        line: step.line,
        startIndex: index,
        endIndex: index,
        count: 1,
      }
      clusters.push(activeCluster)
      sequence += 1
    } else {
      activeCluster.endIndex = index
      activeCluster.count += 1
    }

    step.loopClusterId = activeCluster.id
  })

  return clusters
}

const materializeHistoryIndex = (historyMap) => {
  const result = {}
  historyMap.forEach((value, key) => {
    result[key] = value
  })
  return result
}

export const enrichExecutionInsights = (steps) => {
  if (!steps.length) {
    return { steps, variableHistoryIndex: {}, loopClusters: [] }
  }

  const history = new Map()
  const origins = new Map()
  const latestMutation = new Map()
  const latestForLine = new Map()

  const enriched = steps.map((step) => {
    const entityId = inferPrimaryEntity(step)
    const base = scoreByEvent[step.eventType] ?? scoreByEvent.execution
    const updateBoost = clamp((step.updates?.length || 0) * 0.06, 0, 0.24)
    const traceBoost = step.lastAccess?.refId ? 0.06 : 0
    const queueBoost = step.eventType === 'async' ? 0.08 : 0
    const importanceScore = clamp(base + updateBoost + traceBoost + queueBoost, 0.2, 1)

    let originStep = null
    if (entityId) {
      if (!origins.has(entityId)) {
        origins.set(entityId, step.id)
      }
      originStep = origins.get(entityId)
      ensureArrayMap(history, entityId, step.id)
    }

    const causeStepIds = []
    if (entityId && latestMutation.has(entityId)) {
      causeStepIds.push(latestMutation.get(entityId))
    }
    if (latestForLine.has(step.line)) {
      const lineCause = latestForLine.get(step.line)
      if (!causeStepIds.includes(lineCause) && lineCause !== step.id) {
        causeStepIds.push(lineCause)
      }
    }

    const changedByStep = step.updates?.length ? step.id : latestMutation.get(entityId) ?? null

    if (entityId && step.updates?.length) {
      latestMutation.set(entityId, step.id)
    }
    latestForLine.set(step.line, step.id)

    return {
      ...step,
      entityId,
      originStep,
      changedByStep,
      causeStepIds,
      importanceScore,
      isImportant: importanceScore >= 0.74 || step.eventType === 'error',
    }
  })

  const loopClusters = groupLoopClusters(enriched)
  return {
    steps: enriched,
    variableHistoryIndex: materializeHistoryIndex(history),
    loopClusters,
  }
}
