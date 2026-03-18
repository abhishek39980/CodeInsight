const eventCaptions = {
  call: (step) => `Function enters: ${step.meta?.functionName || 'anonymous call'}.`,
  return: (step) => `Frame returns ${step.meta?.returnValue ?? 'a value'} and collapses.`,
  heap: (step) => `Heap object #${step.meta?.refId || '?'} mutates at ${step.meta?.property || 'path'}.`,
  loop: (step) => {
    if (step.meta?.condition === false) {
      return `Loop exits after ${step.meta?.iteration || 0} iterations.`
    }
    return `Loop iteration ${step.meta?.iteration || '?'} advances state.`
  },
  branch: (step) => `Branch picks ${step.meta?.branch || 'next path'}.`,
  reference: (step) => `Reference link updated to #${step.meta?.refId || '?'}.`,
  output: () => 'Program emits output.',
  async: (step) => `Event loop transition: ${step.meta?.from || 'scheduler'} -> ${step.meta?.to || 'queue'}.`,
  scope: () => 'Scope graph changed.',
  error: () => 'Execution stopped due to an error.',
  declare: () => 'New symbol enters scope.',
  execution: () => 'Execution advances one statement.',
}

const beginnerCaptions = {
  call: (step) => `${step.meta?.functionName || 'A function'} started running with fresh local variables.`,
  return: () => 'The function finished and returned control to the previous place in code.',
  heap: () => 'A value inside an object or array changed in memory.',
  loop: (step) => {
    if (step.meta?.condition === false) {
      return 'The loop condition became false, so the loop ended.'
    }
    return `The loop repeated, now at iteration ${step.meta?.iteration || '?'}.`
  },
  branch: (step) => `The condition evaluated to ${step.meta?.branch === 'consequent' ? 'true' : 'false'}.`,
  reference: () => 'A variable now points to a different object in memory.',
  output: () => 'This step prints text to output.',
  async: () => 'An async callback moved through the event loop queues.',
  scope: () => 'A scope opened or closed, changing variable visibility.',
  error: () => 'The interpreter encountered an invalid state and halted.',
  declare: () => 'A new variable or function was created.',
  execution: () => 'The next line executed.',
}

export const buildStepCaption = (step, beginnerMode = false) => {
  if (!step) {
    return 'Run your code to begin the visual walkthrough.'
  }

  const dictionary = beginnerMode ? beginnerCaptions : eventCaptions
  const builder = dictionary[step.eventType] || dictionary.execution
  return builder(step)
}

export const isLowSignalStep = (step) => {
  if (!step) return true
  const lowSignalTypes = new Set(['declare', 'execution'])
  return lowSignalTypes.has(step.eventType) && (step.importanceScore || 0) < 0.52
}
