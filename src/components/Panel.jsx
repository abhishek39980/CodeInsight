import { motion } from 'framer-motion'
import { cn } from '../utils/cn'

const Panel = ({ title, subtitle, children, className, rightSlot }) => {
  return (
    <motion.section
      layout
      className={cn(
        'relative overflow-hidden rounded-xl bg-[#0a0a0a]/90 backdrop-blur-sm',
        'font-mono border',
        className,
      )}
      style={{
        borderImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.1), transparent) 1',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05), 0 8px 32px 0 rgba(0,0,0,0.5)',
      }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 10 }}
    >
      {/* Blueprint background grid effect internal to panel (optional, maybe too noisy, keeping it subtle) */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />
      <div className="relative z-10 p-4 h-full flex flex-col">
        <div className="mb-4 flex items-start justify-between gap-3 border-b border-white/5 pb-2">
          <div>
            {/* Using a font class that will be mapped to Space Grotesk later, for now just uppercase tracking */}
            <h3 className="text-xs uppercase font-bold tracking-[0.15em] text-[#bfff00] heading-font">{title}</h3>
            {subtitle ? <p className="text-[10px] mt-1 text-zinc-500 font-mono">{subtitle}</p> : null}
          </div>
          {rightSlot}
        </div>
        <div className="flex-1 relative overflow-hidden">
          {children}
        </div>
      </div>
    </motion.section>
  )
}

export default Panel

