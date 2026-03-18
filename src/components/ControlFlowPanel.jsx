import { motion, AnimatePresence } from 'framer-motion'
import Panel from './Panel'
import { cn } from '../utils/cn'

const ControlFlowPanel = ({ transitions }) => {
  const recent = transitions.slice(-12)

  return (
    <Panel title="Control Flow Animation" subtitle="Line-to-line directional flow graph" accent>
      <div className="rounded-2xl border border-white/10 bg-[#0a0d13]/80 p-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
        {recent.length === 0 ? (
          <p className="text-center text-sm text-zinc-500 py-6">Execution transitions appear here.</p>
        ) : (
          <div className="relative">
            <svg viewBox="0 0 520 180" className="h-[180px] w-full overflow-visible drop-shadow-[0_0_10px_rgba(167,139,250,0.6)]">
              <AnimatePresence>
                {recent.map((item, idx) => {
                  const x1 = 30 + idx * 40
                  const x2 = x1 + 35
                  // Adjust y visually based on the line length in general code files (assuming ~40 lines)
                  const y1 = Math.max(20, 160 - (item.from * 4 || 0))
                  const y2 = Math.max(20, 160 - (item.to * 4 || 0))
                  
                  const isJumpBack = item.to < item.from
                  const stroke = isJumpBack ? 'rgba(168,85,247,0.8)' : 'rgba(56,189,248,0.8)'
                  const isLatest = idx === recent.length - 1

                  // Dynamic curvature based on distance
                  const cpOffsetX = isJumpBack ? -15 : 15
                  const d = `M ${x1} ${y1} C ${x1 + 15} ${y1}, ${x2 + cpOffsetX} ${y2}, ${x2} ${y2}`

                  return (
                    <motion.g key={`${item.from}-${item.to}-${idx}`}>
                      {/* Base path trail */}
                      <path
                        d={d}
                        fill="none"
                        stroke={stroke}
                        strokeWidth="1.5"
                        strokeOpacity="0.2"
                      />
                      
                      {/* Animated moving path segment */}
                      <motion.path
                        d={d}
                        fill="none"
                        stroke={stroke}
                        strokeWidth={isLatest ? "3" : "2"}
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />

                      {/* Moving dot alongside path for "flow" visual */}
                      {isLatest && (
                         <motion.circle
                           r="4"
                           fill="#fff"
                           initial={{ offsetDistance: "0%" }}
                           animate={{ offsetDistance: "100%" }}
                           transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                           style={{ filter: "drop-shadow(0 0 8px #fff)", offsetPath: `path('${d}')` }}
                         />
                      )}
                    </motion.g>
                  )
                })}
              </AnimatePresence>
            </svg>
          </div>
        )}
      </div>

      <div className="mt-3 space-y-2 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence>
          {recent.slice(-5).reverse().map((item, idx) => {
            const isJumpBack = item.to < item.from;
            return (
              <motion.div 
                layout
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                key={`${item.from}-${item.to}-t-${idx}`} 
                className={cn(
                  "flex items-center justify-between rounded-xl border px-4 py-2 text-sm font-medium shadow-sm transition-all",
                  idx === 0 
                  ? "border-sky-500/40 bg-[#0a0d13]/90 text-sky-100 ring-1 ring-sky-500/20" 
                  : "border-white/5 bg-[#0a0d13]/40 text-zinc-400"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={cn("font-mono", isJumpBack ? "text-purple-400" : "text-sky-400")}>L{item.from}</span>
                  <span className="text-zinc-600">→</span>
                  <span className={cn("font-mono", isJumpBack ? "text-purple-300" : "text-sky-300")}>L{item.to}</span>
                </div>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-widest text-zinc-500">
                  {item.eventType}
                </span>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </Panel>
  )
}

export default ControlFlowPanel
