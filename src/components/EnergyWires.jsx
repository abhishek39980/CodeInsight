import { motion } from 'framer-motion'

const EnergyWires = ({ triggerTarget, stepIndex }) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 hidden opacity-70 mix-blend-screen xl:block">
      <svg width="100%" height="100%" className="h-full w-full">
        {/* Static Background Wires */}
        <path d="M 58.3% 20% C 62% 20%, 65% 15%, 70% 15%" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M 58.3% 35% C 62% 35%, 65% 30%, 70% 30%" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" strokeDasharray="4 4" />

        {/* Animated Pulses running along wires on EVERY step */}
        <motion.path
          key={`wire-mem-${stepIndex}`}
          d="M 58.3% 20% C 62% 20%, 65% 15%, 70% 15%"
          fill="none"
          stroke="#bfff00"
          strokeWidth="3"
          initial={{ pathLength: 0, opacity: 1 }}
          animate={{ pathLength: 1, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ filter: 'drop-shadow(0 0 8px #bfff00)' }}
        />

        <motion.path
          key={`wire-stack-${stepIndex}`}
          d="M 58.3% 35% C 62% 35%, 65% 30%, 70% 30%"
          fill="none"
          stroke="#bc13fe"
          strokeWidth="3"
          initial={{ pathLength: 0, opacity: 1 }}
          animate={{ pathLength: 1, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          style={{ filter: 'drop-shadow(0 0 8px #bc13fe)' }}
        />
      </svg>
    </div>
  )
}

export default EnergyWires
