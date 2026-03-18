import { motion, AnimatePresence } from 'framer-motion'
import Panel from './Panel'
import { cn } from '../utils/cn'

const glitchKeyframes = {
  initial: { opacity: 0, scale: 0.8, x: -5 },
  animate: {
    opacity: 1,
    scale: [1, 1.1, 0.9, 1.05, 1],
    x: [0, 2, -2, 1, 0],
    skewX: [0, -10, 10, -5, 0],
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: { opacity: 0, scale: 0.5 }
};

const MemoryPanel = ({ frames }) => {
  const activeFrame = frames[0]

  return (
    <Panel title="Memory State" subtitle="Active variable data orbs" className="h-full">
      <div className="flex h-full flex-col font-mono text-zinc-300 relative">
        {!activeFrame?.vars?.length ? (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-white/5 bg-[#050505]/40 italic text-zinc-600 shadow-inner">
            <span className="text-[10px] uppercase tracking-widest text-[#bc13fe]">No local state detected</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 items-center justify-start overflow-y-auto p-2 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {activeFrame.vars.map((entry) => (
                <motion.div
                  layout
                  key={`${activeFrame.name}-${entry.name}`}
                  className="flex flex-col items-center gap-2 group"
                  variants={glitchKeyframes}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <div className="relative">
                    {/* Glowing Data Orb */}
                    <div className={cn(
                      "flex items-center justify-center w-14 h-14 rounded-[40%] border shadow-[inset_0_0_15px_rgba(255,255,255,0.05)] bg-[#050505]/80 backdrop-blur-md relative z-10 transition-all duration-300",
                      entry.updated ? "border-[#bc13fe] shadow-[0_0_20px_rgba(188,19,254,0.4),inset_0_0_10px_rgba(188,19,254,0.2)]" : "border-white/10 group-hover:border-[#bfff00]/30"
                    )}>
                      <motion.span 
                        key={entry.label}
                        className={cn(
                          "text-[10px] font-bold font-mono tracking-wider overflow-hidden text-ellipsis px-1 max-w-full",
                          entry.updated ? "text-[#bc13fe]" : "text-zinc-200"
                        )}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 100, damping: 10 }}
                      >
                        {entry.label}
                      </motion.span>
                    </div>
                    
                    {/* Orb Pulse Effect when Updated */}
                    {entry.updated && (
                      <motion.div
                        className="absolute inset-0 rounded-[40%] bg-[#bc13fe]"
                        initial={{ scale: 0.8, opacity: 0.8 }}
                        animate={{ scale: 1.6, opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    )}
                  </div>
                  
                  {/* Variable Label Below */}
                  <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold max-w-[56px] truncate text-center group-hover:text-[#bfff00] transition-colors">
                    {entry.name}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </Panel>
  )
}

export default MemoryPanel
