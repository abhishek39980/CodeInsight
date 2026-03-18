import { AnimatePresence, motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import { motionTokens } from '../../atlas/motion'

const AtlasInspectorOrb = ({ selected, inspectorContext, onSeekStep }) => {
  return (
    <AnimatePresence>
      {selected ? (
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={motionTokens.dockSlide}
          className="fixed bottom-24 right-6 z-40 w-[300px] rounded-2xl border border-atlas-brand/35 bg-atlas-surface/95 p-3 shadow-atlas backdrop-blur"
        >
          <div className="mb-2 flex items-center gap-2 text-atlas-text">
            <Eye size={14} className="text-atlas-brand" />
            <p className="text-xs font-medium uppercase tracking-[0.12em]">Inspector Orb</p>
          </div>
          <p className="text-xs text-atlas-text">{selected.label}</p>
          <p className="mt-1 text-xs text-atlas-muted">{inspectorContext?.reason || 'No reason available.'}</p>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-atlas-muted">
            <span>Last change</span>
            <button
              type="button"
              onClick={() => {
                if (inspectorContext?.stepId != null) onSeekStep(inspectorContext.stepId)
              }}
              className="rounded-md border border-atlas-muted/35 px-2 py-0.5 text-atlas-text"
            >
              step {inspectorContext?.stepId ?? 'n/a'}
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default AtlasInspectorOrb
