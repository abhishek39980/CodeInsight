import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { LANGUAGES } from '../engine/languageStubs'
import { cn } from '../utils/cn'

export default function LanguageSwitcher({ value, onChange, className }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const selected = LANGUAGES.find(l => l.id === value) ?? LANGUAGES[0]

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-atlas-muted/20 bg-atlas-surface px-3 py-1.5 text-xs font-medium text-atlas-text hover:bg-atlas-elev transition"
      >
        <span>{selected.label}</span>
        <ChevronDown size={12} className={cn('text-atlas-muted transition', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-1.5 z-50 min-w-[140px] rounded-lg border border-atlas-muted/20 bg-atlas-surface shadow-xl shadow-black/40"
          >
            {LANGUAGES.map(lang => (
              <button
                key={lang.id}
                onClick={() => { onChange(lang); setOpen(false) }}
                className={cn(
                  'flex w-full items-center justify-between px-3.5 py-2 text-xs font-medium transition first:rounded-t-lg last:rounded-b-lg',
                  lang.id === value
                    ? 'bg-atlas-elev text-atlas-text'
                    : 'text-atlas-muted hover:bg-atlas-elev hover:text-atlas-text'
                )}
              >
                <span>{lang.label}</span>
                {lang.id === value && (
                  <span className="h-1.5 w-1.5 rounded-full bg-atlas-brand" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
