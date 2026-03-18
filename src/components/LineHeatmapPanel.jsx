import { motion, AnimatePresence } from 'framer-motion'
import Panel from './Panel'
import { cn } from '../utils/cn'

const LineHeatmapPanel = ({ lineStats, activeLine }) => {
  const maxHits = lineStats.reduce((acc, item) => Math.max(acc, item.hits), 1)

  return (
    <Panel title="Line Heatmap" subtitle="Execution frequency and intensity" accent>
      <div className="max-h-64 space-y-2 overflow-auto pr-2 custom-scrollbar">
        {lineStats.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-center text-sm text-zinc-500">
            Run the code to track line execution logic.
          </p>
        ) : (
          <AnimatePresence>
            {lineStats.map((entry) => {
              const intensityRatio = Math.max((entry.hits / maxHits), 0.05)
              const width = `${intensityRatio * 100}%`
              const isActive = activeLine === entry.line
              
              // Color based on intensity
              const barColor = intensityRatio > 0.7 
                ? 'from-rose-500/80 to-rose-400/20' 
                : intensityRatio > 0.3 
                ? 'from-amber-400/80 to-amber-300/20' 
                : 'from-sky-400/80 to-sky-300/20'

              const glowColor = intensityRatio > 0.7 
                ? 'rgba(244,63,94,0.3)' 
                : intensityRatio > 0.3 
                ? 'rgba(251,191,36,0.3)' 
                : 'rgba(56,189,248,0.3)'

              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={`line-${entry.line}`} 
                  className={cn(
                    "group relative overflow-hidden rounded-xl border px-3 py-2.5 transition-all duration-300",
                    isActive 
                      ? "border-sky-500/40 bg-[#0a0d13]/90 shadow-lg scale-[1.02]" 
                      : "border-white/5 bg-[#0a0d13]/50 hover:bg-white/5"
                  )}
                  style={{ boxShadow: isActive ? `0 0 20px ${glowColor}` : 'none' }}
                >
                  {/* Dynamic background fill */}
                  <motion.div
                    className={cn("absolute inset-y-0 left-0 bg-gradient-to-r", barColor)}
                    initial={{ width: 0 }}
                    animate={{ width }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                  
                  <div className="relative z-10 flex items-center justify-between gap-3 text-xs w-full">
                    <span className={cn("font-medium tracking-wide", isActive ? "text-white" : "text-zinc-300")}>
                      Line <span className="font-mono text-zinc-400">{entry.line}</span>
                    </span>
                    <motion.span 
                      key={entry.hits}
                      initial={{ scale: 1.5, color: '#fff' }}
                      animate={{ scale: 1, color: '#9ca3af' }}
                      className="font-mono text-sm font-bold shadow-black drop-shadow-md"
                    >
                      {entry.hits}<span className="text-[10px] text-zinc-500 ml-1 opacity-70">EXEC</span>
                    </motion.span>
                  </div>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="heatmap-active-indicator"
                      className="absolute inset-y-0 left-0 w-1 bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]" 
                    />
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>
    </Panel>
  )
}

export default LineHeatmapPanel

