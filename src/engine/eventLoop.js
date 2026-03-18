const sanitizeTask = (task) => ({
  id: task.id,
  queue: task.queue,
  kind: task.kind,
  label: task.label,
  line: task.line,
  meta: task.meta || {},
})

const cloneQueue = (queue = []) => queue.map((task) => sanitizeTask(task))

const formatQueueName = (queue) => {
  if (queue === 'microtask') return 'Microtask Queue'
  if (queue === 'macrotask') return 'Macrotask Queue'
  if (queue === 'webapi') return 'Web APIs'
  return 'Event Loop'
}

export const createEventLoopState = () => ({
  taskId: 0,
  webApis: [],
  microtaskQueue: [],
  macrotaskQueue: [],
  activeTask: null,
  transitions: [],
  lastTransition: null,
})

export const makeEventTask = (state, payload) => {
  const id = `task:${state.taskId}`
  state.taskId += 1
  return {
    id,
    queue: payload.queue || 'microtask',
    kind: payload.kind || 'callback',
    label: payload.label || 'Task',
    line: payload.line || 1,
    callback: payload.callback || null,
    args: payload.args || [],
    meta: payload.meta || {},
  }
}

const pushTransition = (state, transition) => {
  const enriched = {
    ...transition,
    id: `${transition.taskId}:${transition.from}->${transition.to}:${state.transitions.length}`,
    at: transition.at ?? 0,
  }
  state.transitions.push(enriched)
  if (state.transitions.length > 80) {
    state.transitions.shift()
  }
  state.lastTransition = enriched
}

export const enqueueTask = (state, queueName, task, atStep = 0, reason = '') => {
  if (queueName === 'microtask') {
    state.microtaskQueue.push(task)
  } else if (queueName === 'macrotask') {
    state.macrotaskQueue.push(task)
  } else {
    state.webApis.push(task)
  }

  pushTransition(state, {
    taskId: task.id,
    label: task.label,
    from: 'scheduler',
    to: queueName,
    reason,
    at: atStep,
  })
}

export const moveTaskBetweenQueues = (state, fromQueue, toQueue, atStep = 0, reason = '') => {
  const source = fromQueue === 'webapi'
    ? state.webApis
    : fromQueue === 'macrotask'
      ? state.macrotaskQueue
      : state.microtaskQueue

  if (!source.length) {
    return null
  }

  const task = source.shift()
  task.queue = toQueue

  if (toQueue === 'microtask') {
    state.microtaskQueue.push(task)
  } else if (toQueue === 'macrotask') {
    state.macrotaskQueue.push(task)
  } else {
    state.webApis.push(task)
  }

  pushTransition(state, {
    taskId: task.id,
    label: task.label,
    from: fromQueue,
    to: toQueue,
    reason,
    at: atStep,
  })

  return task
}

export const takeNextEventLoopTask = (state, atStep = 0) => {
  let task = null
  let from = null

  if (state.microtaskQueue.length) {
    task = state.microtaskQueue.shift()
    from = 'microtask'
  } else if (state.macrotaskQueue.length) {
    task = state.macrotaskQueue.shift()
    from = 'macrotask'
  }

  if (!task) {
    state.activeTask = null
    return null
  }

  state.activeTask = task
  pushTransition(state, {
    taskId: task.id,
    label: task.label,
    from,
    to: 'callstack',
    reason: from === 'microtask' ? 'Microtasks run before macrotasks' : 'Dequeued for execution',
    at: atStep,
  })

  return {
    task,
    from,
  }
}

export const completeActiveEventTask = (state, atStep = 0, reason = '') => {
  if (!state.activeTask) {
    return null
  }

  const task = state.activeTask
  state.activeTask = null

  pushTransition(state, {
    taskId: task.id,
    label: task.label,
    from: 'callstack',
    to: 'completed',
    reason: reason || 'Task completed',
    at: atStep,
  })

  return task
}

export const snapshotEventLoopState = (state) => ({
  webApis: cloneQueue(state.webApis),
  microtaskQueue: cloneQueue(state.microtaskQueue),
  macrotaskQueue: cloneQueue(state.macrotaskQueue),
  activeTask: state.activeTask ? sanitizeTask(state.activeTask) : null,
  transitions: cloneQueue(state.transitions),
  lastTransition: state.lastTransition ? { ...state.lastTransition } : null,
  queuePriority: 'microtask-first',
  labels: {
    webapi: formatQueueName('webapi'),
    microtask: formatQueueName('microtask'),
    macrotask: formatQueueName('macrotask'),
  },
})
