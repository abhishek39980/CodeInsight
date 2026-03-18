const EMPTY_SCOPE = {
  scopes: [],
  activeScopeId: null,
  resolutionPath: [],
}

export const createScopeTracker = () => ({
  counter: 0,
  scopes: new Map(),
  activeScopeId: null,
  lastResolutionPath: [],
})

export const registerScope = (tracker, env, details = {}) => {
  const id = env.id || `scope:${tracker.counter}`
  if (!env.id) {
    env.id = id
  }
  tracker.counter += 1

  const parentId = env.parent?.id || null
  tracker.scopes.set(id, {
    id,
    name: env.name,
    type: details.type || env.type || 'block',
    parentId,
    createdAtStep: details.createdAtStep ?? 0,
    destroyedAtStep: null,
    status: 'active',
    captures: details.captures || [],
    notes: details.notes || null,
  })
  tracker.activeScopeId = id

  return id
}

export const closeScope = (tracker, env, stepId = 0) => {
  if (!env?.id) {
    return
  }

  const scope = tracker.scopes.get(env.id)
  if (!scope || scope.status === 'destroyed') {
    return
  }

  scope.status = 'destroyed'
  scope.destroyedAtStep = stepId
  tracker.activeScopeId = env.parent?.id || null
}

export const recordResolutionPath = (tracker, path = []) => {
  tracker.lastResolutionPath = path
}

const toNode = (scope, scopeMap) => ({
  ...scope,
  children: [...scopeMap.values()]
    .filter((candidate) => candidate.parentId === scope.id)
    .map((candidate) => toNode(candidate, scopeMap)),
})

export const snapshotScopes = (tracker) => {
  if (!tracker) {
    return EMPTY_SCOPE
  }

  const scopes = [...tracker.scopes.values()].map((scope) => ({ ...scope }))
  const scopeMap = new Map(scopes.map((scope) => [scope.id, scope]))

  const rootScopes = scopes
    .filter((scope) => !scope.parentId)
    .map((scope) => toNode(scope, scopeMap))

  return {
    scopes,
    tree: rootScopes,
    activeScopeId: tracker.activeScopeId,
    resolutionPath: [...tracker.lastResolutionPath],
  }
}
