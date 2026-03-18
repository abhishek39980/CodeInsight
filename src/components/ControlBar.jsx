import { motion } from 'framer-motion'
import { cn } from '../utils/cn'

const buttonClass =
  'inline-flex items-center justify-center rounded-sm border border-white/20 bg-[#050505] px-4 py-2 text-xs font-bold tracking-[0.1em] text-zinc-300 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30 hover:text-[#bfff00] hover:border-[#bfff00]/50 hover:shadow-[0_0_10px_rgba(191,255,0,0.4)] hover:bg-[#bfff00]/5 active:bg-[#000]'

const activeRunClass =
  'text-[#bc13fe] border-[#bc13fe]/70 shadow-[0_0_15px_rgba(188,19,254,0.4)] bg-[#bc13fe]/10 hover:text-[#bc13fe] hover:border-[#bc13fe] hover:shadow-[0_0_20px_rgba(188,19,254,0.7)] hover:bg-[#bc13fe]/20'

const KnobControl = ({ value, min, max, onChange }) => {
  const percentage = (value - min) / (max - min);
  const rotation = -135 + (percentage * 270);
  
  return (
    <div className="relative w-8 h-8 rounded-full border border-white/20 bg-[#0a0a0a] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] flex items-center justify-center group">
       <input 
         type="range" min={min} max={max} step="0.25" value={value}
         onChange={(e) => onChange(Number(e.target.value))}
         className="absolute inset-0 opacity-0 cursor-pointer z-10"
         title="Execution Speed"
       />
       <motion.div 
         className="w-full h-full rounded-full border border-white/5 relative"
         animate={{ rotate: rotation }}
         transition={{ type: "spring", stiffness: 200, damping: 15 }}
       >
         <div className="absolute top-[2px] left-1/2 -ml-[1px] w-[2px] h-2.5 rounded-full bg-[#bfff00] shadow-[0_0_5px_rgba(191,255,0,0.8)]" />
       </motion.div>
    </div>
  )
}

const ControlBar = ({
  isRunning,
  canRun,
  speed,
  onRun,
  onPause,
  onStep,
  onStepBack,
  onReset,
  onSpeedChange,
  selectedLanguage,
  languages,
  onLanguageChange,
  selectedExample,
  examples,
  onLoadExample,
  stepMeta,
  compareEnabled,
  onToggleCompare,
}) => {
  return (
    <motion.div
      className="relative flex flex-wrap items-center gap-3 border-b border-white/10 bg-[#050505]/60 px-5 py-4 backdrop-blur-md"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex gap-2 mr-2">
        <motion.button 
          whileHover={canRun && !isRunning ? { scale: 1.05 } : {}} 
          whileTap={canRun && !isRunning ? { scale: 0.95 } : {}} 
          className={cn(buttonClass, canRun && !isRunning && activeRunClass)} 
          onClick={onRun} 
          disabled={!canRun || isRunning}
        >
          {isRunning ? 'RUNNING...' : '▶ RUN'}
        </motion.button>
        <motion.button 
          whileHover={isRunning ? { scale: 1.05 } : {}} 
          whileTap={isRunning ? { scale: 0.95 } : {}} 
          className={cn(buttonClass, isRunning && 'border-amber-500/50 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]')} 
          onClick={onPause} 
          disabled={!isRunning}
        >
          ⏸ PAUSE
        </motion.button>
      </div>

      <div className="flex gap-2">
        <motion.button whileHover={!isRunning && canRun ? { scale: 1.05 } : {}} whileTap={!isRunning && canRun ? { scale: 0.95 } : {}} className={buttonClass} onClick={onStepBack} disabled={isRunning || !canRun}>
          [STEP -]
        </motion.button>
        <motion.button whileHover={!isRunning && canRun ? { scale: 1.05 } : {}} whileTap={!isRunning && canRun ? { scale: 0.95 } : {}} className={buttonClass} onClick={onStep} disabled={isRunning || !canRun}>
          [STEP +]
        </motion.button>
      </div>
      
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={cn(buttonClass, "ml-2")} onClick={onReset}>
        RESET
      </motion.button>

      <div className="ml-1 flex items-center gap-3 rounded-md border border-white/10 bg-[#050505] px-4 py-2 shadow-inner">
        <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 font-bold">SPD</span>
        <KnobControl value={speed} min={0.25} max={2} onChange={onSpeedChange} />
        <span className="min-w-[40px] text-right font-mono text-xs text-[#bfff00]">{speed.toFixed(2)}x</span>
      </div>

      <div className="ml-auto flex items-center gap-2 rounded-xl border border-white/10 bg-[#0a0d13]/50 px-3 py-2">
        <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-500 font-bold">Language</span>
        <select
          className="rounded-lg border border-white/5 bg-[#0a0d13] px-2 py-1 text-xs font-medium text-zinc-300 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          value={selectedLanguage}
          onChange={(event) => onLanguageChange(event.target.value)}
        >
          {languages.map((language) => (
            <option key={language.id} value={language.id}>{language.label}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0a0d13]/50 px-3 py-2">
        <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-500 font-bold">Example</span>
        <select
          className="max-w-[140px] truncate rounded-lg border border-white/5 bg-[#0a0d13] px-2 py-1 text-xs font-medium text-zinc-300 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          value={selectedExample}
          onChange={(event) => onLoadExample(event.target.value)}
        >
          {examples.map((example) => (
            <option key={example.id} value={example.id}>{example.label}</option>
          ))}
        </select>
      </div>

      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleCompare}
        className={cn(
          "rounded-xl border px-4 py-2 text-xs font-bold tracking-[0.08em] transition-all",
          compareEnabled 
            ? "border-sky-500/40 bg-sky-500/10 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.15)]" 
            : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/5"
        )}
      >
        {compareEnabled ? 'COMPARE ON' : 'COMPARE OFF'}
      </motion.button>
    </motion.div>
  )
}

export default ControlBar
