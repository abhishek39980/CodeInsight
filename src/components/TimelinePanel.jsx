import { motion } from 'framer-motion'
import { useCallback, useRef } from 'react'
import { cn } from '../utils/cn'

const markerTone = {
  call: 'bg-sky-400',
  return: 'bg-emerald-400',
  loop: 'bg-violet-400',
  branch: 'bg-amber-400',
  error: 'bg-rose-500',
  heap: 'bg-cyan-400',
  reference: 'bg-indigo-400',
  output: 'bg-zinc-300',
  execution: 'bg-zinc-500',
  declare: 'bg-blue-400',
}

const TimelinePanel = ({ steps, currentIndex, onSeek, onReplayFrom, bookmarks, onToggleBookmark }) => {
  const total = steps.length
  const timelineRef = useRef(null)

  const handleTimelineClick = useCallback((e) => {
    if (!timelineRef.current || total === 0) return
    const rect = timelineRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const percentage = x / rect.width
    const step = Math.round(percentage * (total - 1))
    onSeek(step)
  }, [total, onSeek])

  const progress = total > 1 ? (currentIndex / (total - 1)) * 100 : 0

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-[#0a0d13]/80 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-zinc-100">Execution Timeline</h3>
        <div className="flex gap-3">
          <span className="text-xs text-zinc-400 font-mono tracking-wider">{total ? `STEP ${currentIndex + 1} / ${total}` : 'NO STEPS'}</span>
          <button
            type="button"
            onClick={() => onToggleBookmark(currentIndex)}
            className={cn(
              "rounded-md border px-2 py-0.5 text-[10px] uppercase tracking-widest transition-all",
              bookmarks.has(currentIndex) 
                ? "border-amber-400/50 bg-amber-400/20 text-amber-200" 
                : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10"
            )}
          >
            {bookmarks.has(currentIndex) ? 'Bookmarked' : 'Bookmark'}
          </button>
        </div>
      </div>

      <div 
        ref={timelineRef}
        className="relative h-12 w-full cursor-pointer group flex items-center"
        onClick={handleTimelineClick}
      >
        {/* Background track */}
        <div className="absolute inset-x-0 h-2 rounded-full bg-white/5 overflow-hidden">
          {/* Progress fill */}
          <motion.div 
            className="absolute inset-y-0 left-0 bg-blue-500/50"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        {/* Step Markers */}
        <div className="absolute inset-x-0 flex items-center h-full pointer-events-none">
          {steps.map((step, index) => {
            const isPast = index <= currentIndex
            const isCurrent = index === currentIndex
            const leftPos = total > 1 ? (index / (total - 1)) * 100 : 0
            
            return (
              <div 
                key={step.id}
                className="absolute flex flex-col items-center justify-center pointer-events-none"
                style={{ left: `${leftPos}%`, transform: 'translateX(-50%)' }}
              >
                {/* Marker Node */}
                <div 
                  className={cn(
                    "rounded-full transition-all duration-300",
                    isCurrent ? "h-3 w-3 " + (markerTone[step.eventType] || markerTone.execution) :
                    isPast ? "h-2 w-2 opacity-100 " + (markerTone[step.eventType] || markerTone.execution) : 
                    "h-2 w-2 opacity-20 bg-zinc-600"
                  )}
                  style={{
                    boxShadow: isCurrent ? '0 0 10px currentColor' : 'none'
                  }}
                />
                
                {/* Bookmark Indicator */}
                {bookmarks.has(index) && (
                  <div className="absolute -top-3 h-1 w-1 rounded-full bg-amber-400 animate-pulse shadow-[0_0_5px_rgba(251,191,36,0.8)]" />
                )}
              </div>
            )
          })}
        </div>

        {/* Playhead */}
        <motion.div
          className="absolute h-8 w-1.5 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,1)] pointer-events-none"
          initial={{ left: 0 }}
          animate={{ left: `${progress}%` }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
          style={{ transform: 'translateX(-50%)' }}
        >
          <div className="absolute inset-0 rounded-full bg-blue-400 blur-[4px] opacity-70" />
        </motion.div>
      </div>

      <div className="flex justify-start mt-1">
        <button
          type="button"
          onClick={() => onReplayFrom(currentIndex)}
          disabled={total <= 0}
          className="text-xs text-blue-400 hover:text-blue-300 disabled:opacity-40 disabled:hover:text-blue-400 transition"
        >
          Replay from here →
        </button>
      </div>
    </div>
  )
}

export default TimelinePanel
