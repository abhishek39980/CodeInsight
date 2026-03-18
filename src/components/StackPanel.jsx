import { AnimatePresence, motion } from 'framer-motion'
import Panel from './Panel'
import { cn } from '../utils/cn'

const StackPanel = ({ frames, currentEventType, currentMeta, onSelect }) => {
  const orderedFrames = [...frames].reverse()

  return (
    <Panel title="Call Stack" subtitle="Animated frame push/pop" className="h-full" accent>
      <div className="flex flex-col pt-2 pb-4">
        {orderedFrames.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/10 px-3 py-6 text-center text-sm text-zinc-500">Stack is empty.</p>
        ) : null}

        <AnimatePresence mode="popLayout">
          {orderedFrames.map((frame, idx) => {
            const isTop = idx === 0;
            return (
            <motion.button
              layout
              key={frame.id}
              type="button"
              onClick={() => onSelect({ type: 'frame', id: frame.id, label: frame.name })}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={cn(
                "relative w-full overflow-hidden rounded-2xl border p-4 text-left shadow-2xl transition-all hover:scale-[1.02] active:scale-95",
                isTop 
                  ? "border-blue-500/40 bg-[#0a0d13]/90 ring-1 ring-blue-500/20 backdrop-blur-md" 
                  : "border-white/5 bg-[#0a0d13]/50 text-zinc-400 opacity-80 backdrop-blur-sm"
              )}
              style={{
                zIndex: orderedFrames.length - idx,
                marginTop: idx === 0 ? '0px' : '-16px',
                transformOrigin: "top center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white-[0.02] to-transparent pointer-events-none" />
              {isTop && (
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
              )}

              <div className="mb-2 flex items-center justify-between relative z-10">
                <p className={cn("text-sm font-bold tracking-wide", isTop ? "text-blue-100" : "text-zinc-300")}>
                  {frame.name}
                </p>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  #{orderedFrames.length - idx}
                </span>
              </div>

              <div className="relative z-10">
                {currentEventType === 'call' && currentMeta?.functionName === frame.name && isTop && (
                  <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-2 text-xs font-mono text-sky-400 bg-sky-500/10 inline-block px-2 py-1 rounded">
                    enter ({currentMeta.args?.join(', ')})
                  </motion.p>
                )}

                {currentEventType === 'return' && currentMeta?.functionName === frame.name && isTop && (
                  <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 inline-block px-2 py-1 rounded">
                    return {currentMeta.returnValue}
                  </motion.p>
                )}

                <div className="space-y-1.5 mt-2">
                  {frame.vars.length === 0 ? (
                    <p className="text-xs italic text-zinc-600">No locals</p>
                  ) : (
                    frame.vars.map((entry) => (
                      <div key={`${frame.id}-${entry.name}`} className="flex items-center justify-between text-xs">
                        <span className={cn(isTop ? "text-zinc-300" : "text-zinc-500")}>{entry.name}</span>
                        <span className={cn("font-mono", isTop ? "text-blue-200" : "text-zinc-500")}>{entry.label}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.button>
          )})}
        </AnimatePresence>
      </div>
    </Panel>
  )
}

export default StackPanel
