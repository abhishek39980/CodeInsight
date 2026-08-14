import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, X } from 'lucide-react'
import { getAchievementById } from '../store/achievements'

let toastQueue = []
let toastListeners = []

export function pushAchievementToast(ids) {
  ids.forEach(id => {
    const a = getAchievementById(id)
    if (a) toastQueue.push(a)
  })
  toastListeners.forEach(fn => fn([...toastQueue]))
}

export default function AchievementToast() {
  const [current, setCurrent] = useState(null)

  useEffect(() => {
    const listener = (queue) => {
      if (queue.length > 0 && !current) {
        const [next, ...rest] = queue
        toastQueue = rest
        setCurrent(next)
        setTimeout(() => {
          setCurrent(null)
          toastListeners.forEach(fn => fn([...toastQueue]))
        }, 4000)
      }
    }
    toastListeners.push(listener)
    return () => { toastListeners = toastListeners.filter(l => l !== listener) }
  }, [current])

  return (
    <div className="fixed bottom-6 right-6 z-[200] pointer-events-none">
      <AnimatePresence>
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="pointer-events-auto flex items-center gap-4 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-atlas-surface via-atlas-elev to-atlas-surface px-5 py-4 shadow-2xl shadow-amber-500/10 backdrop-blur-md min-w-[280px]"
          >
            {/* Glow ring */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-amber-400/30 blur-md" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-amber-400/50 bg-amber-400/10 text-2xl">
                {current.icon}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Trophy size={12} className="text-amber-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Achievement Unlocked</span>
              </div>
              <p className="mt-0.5 text-sm font-bold text-atlas-text truncate">{current.title}</p>
              <p className="text-xs text-atlas-muted truncate">{current.desc}</p>
            </div>
            <button
              onClick={() => setCurrent(null)}
              className="pointer-events-auto flex-shrink-0 rounded-lg p-1 text-atlas-muted hover:text-atlas-text transition"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
