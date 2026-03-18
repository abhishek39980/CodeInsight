const isNode = (value) => Boolean(value && typeof value === 'object' && typeof value.type === 'string')

const buildNodeSummary = (node) => {
  if (node.type === 'Identifier') {
    return node.name
  }
  if (node.type === 'Literal') {
    return typeof node.value === 'string' ? `"${node.value}"` : String(node.value)
  }
  if (node.type === 'CallExpression') {
    return 'call(...)'
  }
  if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression') {
    return node.id?.name || 'anonymous'
  }
  return node.type
}

const getNodeChildren = (node) => {
  const children = []
  Object.entries(node).forEach(([key, value]) => {
    if (key === 'loc' || key === 'start' || key === 'end' || key === 'range') {
      return
    }

    if (Array.isArray(value)) {
      value.forEach((entry) => {
        if (isNode(entry)) {
          children.push(entry)
        }
      })
      return
    }

    if (isNode(value)) {
      children.push(value)
    }
  })
  return children
}

const mapNode = (node, state, parentId = null) => {
  const id = `ast:${state.counter}`
  state.counter += 1

  node.__astId = id

  const mapped = {
    id,
    type: node.type,
    parentId,
    startLine: node.loc?.start?.line || 1,
    startColumn: node.loc?.start?.column || 0,
    endLine: node.loc?.end?.line || node.loc?.start?.line || 1,
    endColumn: node.loc?.end?.column || node.loc?.start?.column || 0,
    summary: buildNodeSummary(node),
    childIds: [],
  }

  state.nodesById[id] = mapped

  const line = mapped.startLine
  if (!state.lineToNodeIds[line]) {
    state.lineToNodeIds[line] = []
  }
  state.lineToNodeIds[line].push(id)

  const children = getNodeChildren(node)
  children.forEach((child) => {
    const childId = mapNode(child, state, id)
    mapped.childIds.push(childId)
  })

  return id
}

const makeTreeNode = (id, nodesById) => {
  const node = nodesById[id]
  return {
    ...node,
    children: node.childIds.map((childId) => makeTreeNode(childId, nodesById)),
  }
}

export const buildAstArtifacts = (ast) => {
  if (!ast) {
    return {
      rootId: null,
      root: null,
      nodesById: {},
      lineToNodeIds: {},
      orderedNodeIds: [],
    }
  }

  const state = {
    counter: 0,
    nodesById: {},
    lineToNodeIds: {},
  }

  const rootId = mapNode(ast, state, null)

  return {
    rootId,
    root: makeTreeNode(rootId, state.nodesById),
    nodesById: state.nodesById,
    lineToNodeIds: state.lineToNodeIds,
    orderedNodeIds: Object.keys(state.nodesById),
  }
}
