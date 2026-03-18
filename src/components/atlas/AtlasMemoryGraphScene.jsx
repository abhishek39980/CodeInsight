import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { GitBranch, Grid3X3, MoveHorizontal } from 'lucide-react'
import { motionTokens } from '../../atlas/motion'
import { cn } from '../../utils/cn'

const EMPTY_ITEMS = []

const buildHeapPositions = (heap) => {
  if (!heap?.length) return {}

  const centerX = 54
  const centerY = 48
  const radius = Math.max(24, 30 + heap.length * 1.5)
  const result = {}

  heap.forEach((node, index) => {
    const angle = (Math.PI * 2 * index) / heap.length - Math.PI / 2
    result[node.id] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    }
  })

  return result
}

const resolveNodeKind = (node) => {
  const subtype = node?.structureSubtype || ''
  if (subtype.includes('array')) return 'array'
  if (subtype.includes('linked-list')) return 'linked-list'
  if (subtype.includes('tree')) return 'tree'
  return 'object'
}

const GenericObject = ({ node }) => (
  <div className="rounded-xl border border-atlas-muted/30 bg-atlas-surface/65 p-3">
    <div className="space-y-1.5 text-xs">
      {node.entries.map((entry) => (
        <div key={`${node.id}:${entry.key}`} className="flex items-center justify-between rounded-lg border border-atlas-muted/20 bg-atlas-bg0/35 px-2 py-1.5">
          <span className="text-atlas-muted">{entry.key}</span>
          <span className="font-mono text-atlas-text">{entry.label}</span>
        </div>
      ))}
    </div>
  </div>
)

const LinkedListView = ({ node }) => {
  const sequence = node.entries.filter((entry) => entry.key === 'value' || entry.key === 'next')
  return (
    <div className="atlas-scrollbar overflow-auto rounded-xl border border-atlas-muted/30 bg-atlas-surface/65 p-3">
      <div className="flex min-w-max items-center gap-2">
        {sequence.map((entry, index) => (
          <motion.div key={`${node.id}:${entry.key}:${index}`} layout className="flex items-center gap-2">
            <div className="rounded-lg border border-atlas-muted/30 bg-atlas-bg0/35 px-2 py-2 text-xs">
              <p className="text-atlas-muted">{entry.key}</p>
              <p className="font-mono text-atlas-text">{entry.label}</p>
            </div>
            {index < sequence.length - 1 ? <span className="text-atlas-muted">-&gt;</span> : null}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const TreeView = ({ node }) => {
  const pick = (key) => node.entries.find((entry) => entry.key === key)?.label || 'null'
  return (
    <div className="rounded-xl border border-atlas-muted/30 bg-atlas-surface/65 p-4">
      <div className="grid place-items-center gap-4">
        <div className="rounded-lg border border-atlas-muted/30 bg-atlas-bg0/35 px-3 py-2 text-xs text-atlas-text">value: {pick('value')}</div>
        <div className="flex items-center gap-6">
          <div className="rounded-lg border border-atlas-muted/30 bg-atlas-bg0/35 px-3 py-2 text-xs text-atlas-text">left: {pick('left')}</div>
          <div className="rounded-lg border border-atlas-muted/30 bg-atlas-bg0/35 px-3 py-2 text-xs text-atlas-text">right: {pick('right')}</div>
        </div>
      </div>
    </div>
  )
}

const ArrayView = ({ node, activePointers }) => {
  const cellWidth = 68
  const gap = 8

  return (
    <div className="rounded-xl border border-atlas-muted/30 bg-atlas-surface/65 p-3">
      <div className="relative atlas-scrollbar overflow-auto pb-2">
        <div className="relative flex min-w-max gap-2 pt-8">
          {node.entries.map((entry, index) => (
            <div key={`${node.id}:${entry.key}`} className="relative" style={{ width: `${cellWidth}px` }}>
              <div className="rounded-lg border border-atlas-muted/30 bg-atlas-bg0/35 px-2 py-2 text-center text-xs">
                <p className="text-atlas-muted">{index}</p>
                <p className="mt-1 font-mono text-atlas-text">{entry.label}</p>
              </div>
            </div>
          ))}

          {activePointers.map((pointer, idx) => {
            const left = pointer.index * (cellWidth + gap) + (cellWidth / 2)
            return (
              <motion.div
                key={pointer.entityId}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0, x: left }}
                transition={motionTokens.scrubFollow}
                className="absolute top-0 -translate-x-1/2"
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="rounded-full border border-atlas-brand/50 bg-atlas-brand/20 px-2 py-0.5 text-[10px] text-atlas-text">
                    {pointer.name}
                  </span>
                  <MoveHorizontal size={12} className="text-atlas-brand" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const AtlasMemoryGraphScene = ({
  currentStep,
  selectedEntity,
  hoverEntity,
  focusMode,
  pointerTags,
  onTogglePointerTag,
  onSelectEntity,
  onHoverEntity,
}) => {
  const heap = useMemo(() => currentStep?.heap ?? EMPTY_ITEMS, [currentStep?.heap])
  const callStack = useMemo(() => currentStep?.callStack ?? EMPTY_ITEMS, [currentStep?.callStack])
  const pointerCandidates = useMemo(() => currentStep?.pointerCandidates ?? EMPTY_ITEMS, [currentStep?.pointerCandidates])
  const positions = useMemo(() => buildHeapPositions(heap), [heap])
  const [memoryMode, setMemoryMode] = useState('structure')

  const selectedHeapNode = useMemo(() => {
    if (selectedEntity?.startsWith?.('heap:')) {
      const id = selectedEntity.replace('heap:', '')
      return heap.find((item) => item.id === id) || heap[0]
    }
    return heap[0]
  }, [heap, selectedEntity])

  const activePointerIds = useMemo(() => {
    const manual = new Set(pointerTags || [])
    pointerCandidates.forEach((candidate) => {
      if (candidate.autoDetected && candidate.confidence >= 0.6) {
        manual.add(candidate.entityId)
      }
    })
    return manual
  }, [pointerCandidates, pointerTags])

  const activePointersOnArray = useMemo(() => {
    if (!selectedHeapNode || resolveNodeKind(selectedHeapNode) !== 'array') {
      return []
    }

    const topFrames = [...callStack].reverse()
    const pointers = []

    topFrames.forEach((frame) => {
      frame.vars.forEach((entry) => {
        const entityId = `var:${frame.name}:${entry.name}`
        if (!activePointerIds.has(entityId)) {
          return
        }

        const index = Number(entry.label)
        if (!Number.isInteger(index) || index < 0 || index >= selectedHeapNode.entries.length) {
          return
        }

        pointers.push({
          entityId,
          name: entry.name,
          index,
        })
      })
    })

    return pointers
  }, [activePointerIds, callStack, selectedHeapNode])

  const stackReferences = useMemo(
    () =>
      callStack.flatMap((frame) =>
        frame.vars
          .filter((entry) => entry.kind === 'reference')
          .map((entry) => ({
            source: `var:${frame.name}:${entry.name}`,
            target: entry.refId,
            label: `${frame.name}.${entry.name}`,
          })),
      ),
    [callStack],
  )

  const heapReferences = useMemo(
    () =>
      heap.flatMap((node) =>
        node.entries
          .filter((entry) => entry.kind === 'reference')
          .map((entry) => ({
            source: `heap:${node.id}`,
            target: entry.refId,
            label: `${entry.key}`,
          })),
      ),
    [heap],
  )

  const allEdges = [...stackReferences, ...heapReferences]

  const orderedFrames = [...callStack].reverse()
  const visibleFrames = orderedFrames.slice(0, 4)
  const hiddenFrames = Math.max(0, orderedFrames.length - visibleFrames.length)

  const renderStructure = () => {
    if (!selectedHeapNode) {
      return (
        <p className="rounded-xl border border-dashed border-atlas-muted/35 p-4 text-xs text-atlas-muted">
          Run execution to detect heap data structures.
        </p>
      )
    }

    if (selectedHeapNode.detectionConfidence < 0.55) {
      return (
        <div className="space-y-2">
          <p className="text-xs text-atlas-muted">Detection confidence is low, falling back to default object rendering.</p>
          <GenericObject node={selectedHeapNode} />
        </div>
      )
    }

    const kind = resolveNodeKind(selectedHeapNode)

    if (kind === 'array') {
      return <ArrayView node={selectedHeapNode} activePointers={activePointersOnArray} />
    }

    if (kind === 'linked-list') {
      return <LinkedListView node={selectedHeapNode} />
    }

    if (kind === 'tree') {
      return <TreeView node={selectedHeapNode} />
    }

    return <GenericObject node={selectedHeapNode} />
  }

  return (
    <div className="grid h-full grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
      <section className="atlas-surface p-3">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Depth Stack</h3>
          {hiddenFrames > 0 ? <span className="text-xs text-atlas-muted">+{hiddenFrames} frames</span> : null}
        </div>
        <div className="atlas-scrollbar space-y-2 overflow-auto pr-1">
          {visibleFrames.length ? (
            visibleFrames.map((frame, idx) => {
              const isTop = idx === 0
              return (
                <motion.div
                  key={frame.id}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: focusMode && !isTop ? 0.28 : 1, y: 0 }}
                  transition={motionTokens.sceneSpring}
                  className={cn(
                    'rounded-2xl border border-atlas-muted/30 bg-atlas-surface/72 p-3',
                    isTop && 'border-atlas-call/45 bg-atlas-call/10',
                  )}
                >
                  <p className="mb-2 text-xs font-medium">{frame.name}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {frame.vars.map((entry) => {
                      const entityId = `var:${frame.name}:${entry.name}`
                      const active = selectedEntity === entityId || hoverEntity === entityId
                      const pointerTagged = activePointerIds.has(entityId)

                      return (
                        <div key={entityId} className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onMouseEnter={() => onHoverEntity(entityId)}
                            onMouseLeave={() => onHoverEntity(null)}
                            onClick={() =>
                              onSelectEntity({
                                type: 'variable',
                                scope: frame.name,
                                name: entry.name,
                                label: `${frame.name}.${entry.name}`,
                                entityId,
                              })
                            }
                            className={cn(
                              'rounded-full border px-2 py-1 text-[11px] transition',
                              active
                                ? 'border-atlas-brand/70 bg-atlas-brand/20 text-atlas-text'
                                : 'border-atlas-muted/30 bg-atlas-surface text-atlas-muted hover:text-atlas-text',
                            )}
                          >
                            {entry.name}
                          </button>
                          <button
                            type="button"
                            onClick={() => onTogglePointerTag(entityId)}
                            className={cn(
                              'rounded-full border px-1.5 py-0.5 text-[10px] transition',
                              pointerTagged
                                ? 'border-atlas-loop/55 bg-atlas-loop/20 text-atlas-text'
                                : 'border-atlas-muted/25 text-atlas-muted hover:text-atlas-text',
                            )}
                            title="Tag/untag pointer"
                          >
                            ptr
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )
            })
          ) : (
            <p className="rounded-xl border border-dashed border-atlas-muted/35 p-4 text-xs text-atlas-muted">
              Run execution to populate stack depth.
            </p>
          )}
        </div>
      </section>

      <section className="atlas-surface p-3">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold">Memory Panel Extensions</h3>
            <p className="text-xs text-atlas-muted">Specialized structure rendering, pointer overlays, and reference graph toggle</p>
          </div>
          <div className="inline-flex items-center gap-1 rounded-lg border border-atlas-muted/25 bg-atlas-surface/70 p-1">
            <button
              type="button"
              onClick={() => setMemoryMode('structure')}
              className={cn(
                'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs',
                memoryMode === 'structure' ? 'bg-atlas-brand/20 text-atlas-text' : 'text-atlas-muted',
              )}
            >
              <Grid3X3 size={12} />
              Structure
            </button>
            <button
              type="button"
              onClick={() => setMemoryMode('reference')}
              className={cn(
                'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs',
                memoryMode === 'reference' ? 'bg-atlas-brand/20 text-atlas-text' : 'text-atlas-muted',
              )}
            >
              <GitBranch size={12} />
              Reference Graph
            </button>
          </div>
        </div>

        {memoryMode === 'structure' ? (
          <div className="space-y-2">
            {selectedHeapNode ? (
              <div className="flex items-center justify-between rounded-lg border border-atlas-muted/25 bg-atlas-surface/70 px-3 py-2 text-xs">
                <span className="font-mono text-atlas-text">#{selectedHeapNode.id}</span>
                <span className="text-atlas-muted">
                  {selectedHeapNode.structureSubtype} • confidence {(selectedHeapNode.detectionConfidence * 100).toFixed(0)}%
                </span>
              </div>
            ) : null}
            {renderStructure()}
          </div>
        ) : (
          <div className="relative h-[580px] overflow-hidden rounded-2xl border border-atlas-muted/25 bg-atlas-bg0/35">
            <svg viewBox="0 0 110 96" className="absolute inset-0 h-full w-full">
              {allEdges.map((edge, index) => {
                const target = positions[edge.target]
                if (!target) return null

                const sourceIndex = index + 1
                const startX = 9 + (sourceIndex % 3) * 6
                const startY = 14 + sourceIndex * 4
                const fromX = edge.source.startsWith('heap:') ? positions[edge.source.replace('heap:', '')]?.x ?? startX : startX
                const fromY = edge.source.startsWith('heap:') ? positions[edge.source.replace('heap:', '')]?.y ?? startY : startY
                const ctrlX = (fromX + target.x) / 2 + 5
                const ctrlY = (fromY + target.y) / 2 - 6
                const path = `M ${fromX} ${fromY} Q ${ctrlX} ${ctrlY} ${target.x} ${target.y}`

                const highlighted = selectedEntity === edge.source || hoverEntity === edge.source
                return (
                  <motion.path
                    key={`${edge.source}-${edge.target}-${index}`}
                    d={path}
                    fill="none"
                    stroke={highlighted ? 'rgba(255, 143, 90, 0.95)' : 'rgba(143, 124, 255, 0.45)'}
                    strokeWidth={highlighted ? 1.5 : 1}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: focusMode && !highlighted ? 0.22 : 1 }}
                    transition={motionTokens.scrubFollow}
                  />
                )
              })}
            </svg>

            {heap.map((node) => {
              const point = positions[node.id]
              if (!point) return null
              const entityId = `heap:${node.id}`
              const active = selectedEntity === entityId || hoverEntity === entityId
              return (
                <motion.button
                  key={node.id}
                  layoutId={entityId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: focusMode && !active ? 0.24 : 1,
                    scale: active ? 1.07 : 1,
                    x: `${point.x}%`,
                    y: `${point.y}%`,
                  }}
                  whileHover={{ scale: 1.06 }}
                  transition={motionTokens.sceneSpring}
                  onMouseEnter={() => onHoverEntity(entityId)}
                  onMouseLeave={() => onHoverEntity(null)}
                  onClick={() =>
                    onSelectEntity({
                      type: 'heap',
                      id: node.id,
                      label: `#${node.id}`,
                      entityId,
                    })
                  }
                  className={cn(
                    'absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl border px-3 py-2 text-left shadow-atlas-soft',
                    active
                      ? 'border-atlas-ember/65 bg-atlas-ember/18'
                      : 'border-atlas-muted/30 bg-atlas-surface/90',
                  )}
                >
                  <p className="font-mono text-xs text-atlas-text">#{node.id}</p>
                  <p className="mt-0.5 text-[11px] text-atlas-muted">{node.structureSubtype}</p>
                  <p className="mt-1 text-[10px] text-atlas-muted">mutations {node.mutationCount}</p>
                </motion.button>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

export default AtlasMemoryGraphScene
