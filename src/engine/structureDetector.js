import { isRef, refId } from './runtime.js'

const isObjectLike = (value) => value && typeof value === 'object' && !Array.isArray(value)

const hasOnly = (keys, targetKeys) => keys.every((key) => targetKeys.includes(key))

const scoreFrom = (value) => Math.max(0, Math.min(1, value))

const detectArrayShape = (node) => {
  const value = node.value
  if (!Array.isArray(value)) {
    return null
  }

  const isTwoDimensional = value.length > 0 && value.every((entry) => Array.isArray(entry) || isRef(entry))
  if (isTwoDimensional) {
    return {
      detectedType: 'array',
      structureSubtype: 'array-2d',
      confidence: scoreFrom(0.9),
      reason: 'Array entries look like nested arrays/references.',
    }
  }

  const ops = node.collectionOps || []
  const pushCount = ops.filter((op) => op.operation === 'push').length
  const popCount = ops.filter((op) => op.operation === 'pop').length
  const shiftCount = ops.filter((op) => op.operation === 'shift').length
  const unshiftCount = ops.filter((op) => op.operation === 'unshift').length

  if (pushCount + popCount >= 2 && shiftCount + unshiftCount === 0) {
    return {
      detectedType: 'array',
      structureSubtype: 'stack-pattern',
      confidence: scoreFrom(0.84),
      reason: 'Runtime operations favor push/pop operations.',
    }
  }

  if (shiftCount + unshiftCount >= 2 || (pushCount >= 1 && shiftCount >= 1)) {
    return {
      detectedType: 'array',
      structureSubtype: 'queue-pattern',
      confidence: scoreFrom(0.84),
      reason: 'Runtime operations favor shift/unshift queue behavior.',
    }
  }

  return {
    detectedType: 'array',
    structureSubtype: 'array',
    confidence: scoreFrom(0.92),
    reason: 'Literal or computed array allocation.',
  }
}

const detectObjectShape = (node) => {
  const value = node.value
  if (!isObjectLike(value)) {
    return {
      detectedType: 'object',
      structureSubtype: 'primitive-box',
      confidence: scoreFrom(0.4),
      reason: 'Value is primitive and boxed in heap node.',
    }
  }

  const keys = Object.keys(value)

  if (keys.includes('next')) {
    return {
      detectedType: 'object',
      structureSubtype: 'linked-list-node',
      confidence: scoreFrom(hasOnly(keys, ['value', 'next']) ? 0.9 : 0.76),
      reason: 'Object contains a next pointer.',
    }
  }

  if (keys.includes('left') || keys.includes('right')) {
    return {
      detectedType: 'object',
      structureSubtype: 'binary-tree-node',
      confidence: scoreFrom(keys.includes('value') ? 0.88 : 0.72),
      reason: 'Object contains left/right child references.',
    }
  }

  if (keys.includes('children') && Array.isArray(value.children)) {
    return {
      detectedType: 'object',
      structureSubtype: 'tree-node',
      confidence: scoreFrom(0.82),
      reason: 'Object contains children collection.',
    }
  }

  const adjacencyLike = keys.some((key) => {
    const entry = value[key]
    if (Array.isArray(entry)) {
      return entry.some((item) => isRef(item) || typeof item === 'string' || typeof item === 'number')
    }
    return false
  })

  if (adjacencyLike) {
    return {
      detectedType: 'object',
      structureSubtype: 'graph-like',
      confidence: scoreFrom(0.74),
      reason: 'Object fields resemble adjacency lists.',
    }
  }

  const refFieldCount = keys.reduce((count, key) => (isRef(value[key]) ? count + 1 : count), 0)
  if (refFieldCount >= 2) {
    return {
      detectedType: 'object',
      structureSubtype: 'object-graph-node',
      confidence: scoreFrom(0.78),
      reason: 'Object holds multiple references to heap nodes.',
    }
  }

  return {
    detectedType: 'object',
    structureSubtype: 'object',
    confidence: scoreFrom(0.7),
    reason: 'Generic object layout.',
  }
}

const countReachable = (rootRef, heap) => {
  const startId = refId(rootRef)
  if (!startId || !heap.has(startId)) {
    return 0
  }

  const seen = new Set()
  const queue = [startId]

  while (queue.length) {
    const id = queue.shift()
    if (seen.has(id)) {
      continue
    }
    seen.add(id)
    const node = heap.get(id)
    if (!node) {
      continue
    }

    const val = node.value
    if (Array.isArray(val)) {
      val.forEach((item) => {
        const target = refId(item)
        if (target && !seen.has(target)) {
          queue.push(target)
        }
      })
    } else if (isObjectLike(val)) {
      Object.values(val).forEach((entry) => {
        const target = refId(entry)
        if (target && !seen.has(target)) {
          queue.push(target)
        }
      })
    }
  }

  return seen.size
}

export const extractReferences = (node) => {
  const refs = []
  const value = node.value

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const target = refId(item)
      if (target) {
        refs.push({ fromKey: `[${index}]`, to: target })
      }
    })
    return refs
  }

  if (isObjectLike(value)) {
    Object.entries(value).forEach(([key, item]) => {
      const target = refId(item)
      if (target) {
        refs.push({ fromKey: key, to: target })
      }
    })
  }

  return refs
}

export const detectStructures = (heapNodes) => {
  const heap = new Map(heapNodes.map((node) => [node.id, node]))

  return heapNodes.map((node) => {
    const arrayShape = detectArrayShape(node)
    const objectShape = detectObjectShape(node)
    const shape = arrayShape || objectShape
    const rootRef = { __ref: `ref:${node.id}` }

    return {
      id: node.id,
      detectedType: shape.detectedType,
      structureSubtype: shape.structureSubtype,
      detectionConfidence: shape.confidence,
      detectionReason: shape.reason,
      nodeCount: countReachable(rootRef, heap) || 1,
      referenceRelationships: extractReferences(node),
      mutabilityEvents: {
        mutationCount: node.mutationCount,
        lastMutationStep: node.lastMutationStep,
      },
      collectionOps: node.collectionOps || [],
    }
  })
}
