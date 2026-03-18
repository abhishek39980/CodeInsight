import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { motionTokens } from '../../atlas/motion'
import { cn } from '../../utils/cn'

const AtlasCallTreeScene = ({ currentStep, focusMode }) => {
  const tree = currentStep?.recursionTree || { nodes: [], edges: [] }

  const grouped = useMemo(() => {
    const groups = new Map()
    tree.nodes.forEach((node) => {
      const depth = node.depth || 0
      if (!groups.has(depth)) groups.set(depth, [])
      groups.get(depth).push(node)
    })
    return [...groups.entries()].sort((a, b) => a[0] - b[0])
  }, [tree.nodes])

  return (
    <div className="atlas-surface h-full p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Recursion Theater</h3>
        <p className="text-xs text-atlas-muted">Call hierarchy with return collapse continuity</p>
      </div>

      {grouped.length === 0 ? (
        <div className="grid h-[560px] place-items-center rounded-2xl border border-dashed border-atlas-muted/35">
          <p className="text-sm text-atlas-muted">Call tree appears when recursion or nested calls are detected.</p>
        </div>
      ) : (
        <div className="atlas-scrollbar relative h-[560px] overflow-auto rounded-2xl border border-atlas-muted/25 bg-atlas-bg0/30 p-4">
          <div className="flex min-w-[680px] gap-8">
            {grouped.map(([depth, nodes]) => (
              <div key={depth} className="flex min-w-[180px] flex-col gap-3">
                <p className="text-[11px] uppercase tracking-[0.14em] text-atlas-muted">Depth {depth}</p>
                {nodes.map((node) => {
                  const returned = node.status === 'returned'
                  return (
                    <motion.div
                      key={node.id}
                      layout
                      layoutId={`call:${node.id}`}
                      initial={{ opacity: 0, scale: 0.92, y: 20 }}
                      animate={{
                        opacity: focusMode && !returned ? 1 : returned ? 0.82 : 1,
                        scale: returned ? 0.96 : 1,
                        y: 0,
                      }}
                      transition={motionTokens.sceneSpring}
                      className={cn(
                        'rounded-2xl border p-3',
                        returned
                          ? 'border-atlas-loop/40 bg-atlas-loop/12'
                          : 'border-atlas-call/45 bg-atlas-call/14',
                      )}
                    >
                      <p className="text-xs text-atlas-text">{node.label}</p>
                      <p className="mt-1 text-[11px] text-atlas-muted">{returned ? `returned ${node.returnValue}` : 'active frame'}</p>
                    </motion.div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AtlasCallTreeScene
