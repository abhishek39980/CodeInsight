import { motion } from 'framer-motion'
import Panel from './Panel'

const StepScrubber = ({ stepIndex, totalSteps, onSeek, isRunning }) => {
  const progress = totalSteps > 1 ? (stepIndex / (totalSteps - 1)) * 100 : 0

  return (
    <Panel
      title="Execution Scrubber"
      subtitle="Jump to any state snapshot"
      rightSlot={<span className="text-xs text-zinc-400">{totalSteps ? `${stepIndex + 1}/${totalSteps}` : '0/0'}</span>}
    >
      <div className="space-y-3">
        <div className="relative h-2 rounded-full bg-white/10">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-sky-400/80 to-indigo-400/70"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.22 }}
          />
        </div>

        <input
          type="range"
          min="0"
          max={Math.max(totalSteps - 1, 0)}
          value={Math.min(stepIndex, Math.max(totalSteps - 1, 0))}
          onChange={(event) => onSeek(Number(event.target.value))}
          disabled={totalSteps <= 1 || isRunning}
          className="w-full accent-sky-400 disabled:opacity-50"
        />

        <p className="text-xs text-zinc-500">
          {isRunning ? 'Pause playback to scrub manually.' : 'Drag to inspect any point in execution.'}
        </p>
      </div>
    </Panel>
  )
}

export default StepScrubber

