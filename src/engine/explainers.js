const describeUpdate = (update) => {
  if (!update) {
    return null
  }

  if (update.kind === 'declare') {
    return `${update.name} was created in ${update.scope}.`
  }

  if (update.kind === 'set') {
    if (update.prev !== undefined) {
      return `${update.name} changed from ${update.prev} to ${update.next}.`
    }
    return `${update.name} was updated.`
  }

  if (update.kind === 'heap-mutate') {
    return `Heap object ${update.refId} was mutated via ${update.path}.`
  }

  return null
}

export const explainStep = (step) => {
  if (!step) {
    return 'Run code to generate execution steps.'
  }

  const firstUpdate = step.updates?.[0]
  const updateText = describeUpdate(firstUpdate)

  switch (step.eventType) {
    case 'call':
      return `${step.event}. A new stack frame was pushed with fresh parameters.`
    case 'return':
      return `${step.event}. The function completed and its frame was popped.`
    case 'loop':
      return `${step.event}. Execution jumped through a loop cycle based on its condition.`
    case 'branch':
      return `${step.event}. A conditional branch decided the next control-flow path.`
    case 'error':
      return `${step.event}. Execution stopped because the interpreter hit an invalid state.`
    case 'heap':
      return updateText || `${step.event}. A referenced structure changed in heap memory.`
    case 'async':
      return `${step.event}. The event loop state changed and queue priority was applied.`
    case 'scope':
      return `${step.event}. Scope creation/destruction updated variable resolution paths.`
    default:
      return updateText || `${step.event}.`
  }
}

export const buildInspectorContext = (steps, stepIndex, selection) => {
  if (!selection) {
    return null
  }

  const prefix = selection.entityId
    || (selection.type === 'variable'
      ? `var:${selection.scope}:${selection.name}`
      : `${selection.type}:${selection.id}`)

  for (let i = stepIndex; i >= 0; i -= 1) {
    const step = steps[i]
    const hit = step.updates?.find((update) => update.key === prefix)
    if (hit) {
      return {
        reason: hit.reason || step.event,
        stepId: step.id,
        line: step.line,
        event: step.event,
        causeStepIds: step.causeStepIds || [],
        originStep: step.originStep ?? null,
      }
    }

    if (step.entityId === prefix) {
      return {
        reason: step.event,
        stepId: step.id,
        line: step.line,
        event: step.event,
        causeStepIds: step.causeStepIds || [],
        originStep: step.originStep ?? null,
      }
    }
  }

  return {
    reason: 'No direct mutation record found in available history.',
    stepId: null,
    line: null,
    event: null,
    causeStepIds: [],
    originStep: null,
  }
}
