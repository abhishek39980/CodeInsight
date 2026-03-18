import { detectStructures } from './structureDetector.js'
import { isRef, refId } from './runtime.js'

const POINTER_NAME_PATTERN = /^(i|j|k|l|r|p|q|idx|index|left|right|lo|hi|start|end|slow|fast|mid|windowStart|windowEnd)$/i

const serializePrimitive = (value) => {
  if (typeof value === 'string') {
    return `"${value}"`
  }
  if (value === undefined) {
    return 'undefined'
  }
  if (value === null) {
    return 'null'
  }
  return String(value)
}

const serializePromise = (value) => ({
  kind: 'promise',
  label: `${value.label || 'Promise'}<${value.state}>`,
  promiseId: value.id,
  state: value.state,
  settledAtStep: value.settledAtStep,
})

const serializeValue = (value) => {
  if (isRef(value)) {
    return {
      kind: 'reference',
      refId: refId(value),
      label: `#${refId(value)}`,
    }
  }

  if (value && value.kind === 'function') {
    return {
      kind: 'function',
      label: `[fn ${value.name}]`,
      closureScopeId: value.env?.id || null,
      async: Boolean(value.async),
      captures: value.captures || [],
    }
  }

  if (value && value.kind === 'promise') {
    return serializePromise(value)
  }

  if (typeof value === 'object' && value !== null) {
    return {
      kind: 'inline-object',
      label: JSON.stringify(value),
    }
  }

  return {
    kind: 'primitive',
    label: serializePrimitive(value),
  }
}

const snapshotFrame = (frame) => ({
  id: frame.id,
  name: frame.name,
  envId: frame.env?.id || null,
  vars: frame.env.entries().map(([name, raw]) => ({
    name,
    ...serializeValue(raw),
  })),
})

const snapshotHeap = (runtime) => {
  const nodes = [...runtime.heap.values()].map((node) => {
    const value = node.value

    if (Array.isArray(value)) {
      return {
        ...node,
        entries: value.map((item, index) => ({
          key: `[${index}]`,
          ...serializeValue(item),
        })),
      }
    }

    if (typeof value === 'object' && value !== null) {
      return {
        ...node,
        entries: Object.entries(value).map(([key, item]) => ({
          key,
          ...serializeValue(item),
        })),
      }
    }

    return {
      ...node,
      entries: [{ key: 'value', ...serializeValue(value) }],
    }
  })

  const structures = detectStructures(nodes)

  return nodes.map((node) => {
    const meta = structures.find((item) => item.id === node.id)
    return {
      id: node.id,
      shape: node.shape,
      entries: node.entries,
      mutationCount: node.mutationCount,
      lastMutationStep: node.lastMutationStep,
      createdAtStep: node.createdAtStep,
      detectedType: meta?.detectedType || node.shape,
      structureSubtype: meta?.structureSubtype || node.shape,
      nodeCount: meta?.nodeCount || 1,
      referenceRelationships: meta?.referenceRelationships || [],
      mutabilityEvents: meta?.mutabilityEvents || { mutationCount: node.mutationCount, lastMutationStep: node.lastMutationStep },
      detectionConfidence: meta?.detectionConfidence || 0.5,
      detectionReason: meta?.detectionReason || 'Pattern confidence is low; using default renderer.',
      collectionOps: meta?.collectionOps || node.collectionOps || [],
    }
  })
}

const buildReferenceGraph = (callStack, heap) => {
  const stackNodes = []
  const heapNodes = heap.map((node) => ({
    id: `heap:${node.id}`,
    label: `#${node.id}`,
    type: 'heap',
    subtype: node.structureSubtype,
  }))

  const edges = []
  const aliasGroups = {}

  callStack.forEach((frame) => {
    frame.vars.forEach((entry) => {
      const sourceId = `stack:${frame.id}:${entry.name}`
      stackNodes.push({
        id: sourceId,
        label: `${frame.name}.${entry.name}`,
        type: 'stack',
        frameId: frame.id,
        frameName: frame.name,
      })

      if (entry.kind === 'reference') {
        const target = `heap:${entry.refId}`
        edges.push({ id: `${sourceId}->${target}`, from: sourceId, to: target, kind: 'stack-ref' })

        if (!aliasGroups[target]) {
          aliasGroups[target] = []
        }
        aliasGroups[target].push(sourceId)
      }
    })
  })

  heap.forEach((node) => {
    node.entries
      .filter((entry) => entry.kind === 'reference')
      .forEach((entry) => {
        const from = `heap:${node.id}`
        const to = `heap:${entry.refId}`
        edges.push({ id: `${from}:${entry.key}->${to}`, from, to, kind: 'heap-ref', label: entry.key })
      })
  })

  const aliases = Object.entries(aliasGroups)
    .filter(([, sources]) => sources.length > 1)
    .map(([target, sources]) => ({ target, sources }))

  return {
    nodes: [...stackNodes, ...heapNodes],
    edges,
    aliases,
  }
}

const detectPointerCandidates = (callStack) => {
  const candidates = []

  callStack.forEach((frame) => {
    frame.vars.forEach((entry) => {
      const looksLikePointerName = POINTER_NAME_PATTERN.test(entry.name)
      const numericLabel = Number(entry.label)
      const isNumeric = Number.isFinite(numericLabel)

      if (looksLikePointerName || isNumeric) {
        candidates.push({
          entityId: `var:${frame.name}:${entry.name}`,
          frame: frame.name,
          name: entry.name,
          value: entry.label,
          confidence: looksLikePointerName && isNumeric ? 0.9 : looksLikePointerName ? 0.7 : 0.45,
          autoDetected: looksLikePointerName,
        })
      }
    })
  })

  return candidates
}

export const buildSnapshot = (runtime, step) => {
  const callStack = runtime.frames.map(snapshotFrame)
  const heap = snapshotHeap(runtime)

  const pointerLinks = []
  callStack.forEach((frame) => {
    frame.vars.forEach((entry) => {
      if (entry.kind === 'reference') {
        pointerLinks.push({
          sourceType: 'variable',
          sourceFrame: frame.id,
          sourceName: entry.name,
          targetRefId: entry.refId,
        })
      }
    })
  })

  const recursionTree = {
    nodes: runtime.recursionNodes.map((node) => ({ ...node })),
    edges: [...runtime.recursionEdges].map((edge) => {
      const [from, to] = edge.split('::')
      return { from, to }
    }),
  }

  const referenceGraph = buildReferenceGraph(callStack, heap)
  const pointerCandidates = detectPointerCandidates(callStack)

  return {
    ...step,
    callStack,
    heap,
    pointerLinks,
    recursionTree,
    referenceGraph,
    pointerCandidates,
    eventLoop: step.eventLoop || runtime.eventLoopSnapshot(),
    scopeState: step.scopeState || runtime.scopeSnapshot(),
  }
}

export const valueToText = (value) => {
  if (value?.kind === 'reference') {
    return value.label
  }
  if (value?.kind === 'promise') {
    return value.label
  }
  if (value?.label) {
    return value.label
  }
  return String(value)
}
