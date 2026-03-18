import { motion } from 'framer-motion'
import Panel from './Panel'
import PointerOverlay from './PointerOverlay'

const HeapPanel = ({ callStack, heap, pointerLinks, onSelect }) => {
  const frameVars = callStack.flatMap((frame) => frame.vars.map((entry) => ({ ...entry, frameId: frame.id, frameName: frame.name })))
  const refVars = frameVars.filter((entry) => entry.kind === 'reference')

  const frameOrder = refVars.map((entry) => ({ key: `${entry.frameId}:${entry.name}` }))
  const heapOrder = heap.map((node) => ({ id: node.id }))

  return (
    <Panel title="Stack vs Heap" subtitle="Reference relationships and heap objects" accent>
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_1.2fr]">
        <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-2">
          <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-400">Stack References</p>
          {refVars.length === 0 ? (
            <p className="text-xs text-zinc-500">No references in stack.</p>
          ) : (
            refVars.map((entry) => (
              <button
                key={`${entry.frameId}-${entry.name}`}
                type="button"
                onClick={() => onSelect({ type: 'variable', scope: entry.frameName, name: entry.name, label: `${entry.frameName}.${entry.name}` })}
                className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-[#090b0f] px-2 py-1 text-xs text-zinc-300 transition hover:bg-white/[0.06]"
              >
                <span>{entry.frameName}.{entry.name}</span>
                <span className="font-mono text-sky-300">#{entry.refId}</span>
              </button>
            ))
          )}
        </div>

        <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-2">
          <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-400">Heap Memory</p>
          {heap.length === 0 ? (
            <p className="text-xs text-zinc-500">No heap allocations yet.</p>
          ) : (
            heap.map((node) => (
              <motion.button
                key={node.id}
                type="button"
                onClick={() => onSelect({ type: 'heap', id: node.id, label: `#${node.id} (${node.structureSubtype})` })}
                className="w-full rounded-lg border border-white/10 bg-[#080a0d] px-2 py-2 text-left text-xs text-zinc-300 transition hover:bg-white/[0.06]"
                whileHover={{ y: -1 }}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-mono text-sky-200">#{node.id}</span>
                  <span className="text-zinc-500">{node.structureSubtype}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {node.entries.slice(0, 4).map((entry) => (
                    <span key={`${node.id}-${entry.key}`} className="rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] text-zinc-400">
                      {entry.key}: {entry.label}
                    </span>
                  ))}
                </div>
              </motion.button>
            ))
          )}
        </div>
      </div>

      <div className="mt-3 h-44 rounded-xl border border-white/10 bg-[#06080c] p-2">
        <PointerOverlay links={pointerLinks} frameOrder={frameOrder} heapOrder={heapOrder} />
      </div>
    </Panel>
  )
}

export default HeapPanel
