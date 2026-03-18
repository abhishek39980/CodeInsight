import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { buildStepCaption } from '../../engine/story'
import { motionTokens } from '../../atlas/motion'
import { cn } from '../../utils/cn'

const modeSubtitle = {
  explore: 'Direct manipulation and lifecycle exploration.',
  story: 'Narrative walkthrough with guided captions.',
  debug: 'Cause-effect overlay and mutation origins.',
}

const AtlasNarrativeDock = ({
  mode,
  beginnerMode,
  currentStep,
  stepIndex,
  totalSteps,
  selected,
  inspectorContext,
  steps,
  onSeekStep,
  onClearSelection,
  milestone,
}) => {
  const caption = buildStepCaption(currentStep, beginnerMode)
  const causeEvents = (inspectorContext?.causeStepIds || [])
    .map((id) => steps.find((item) => item.id === id))
    .filter(Boolean)
    .slice(-3)

  return (
    <aside className="atlas-surface h-full p-4">
      <div className="mb-4">
        <p className="text-[11px] uppercase tracking-[0.14em] text-atlas-muted">Narrative Dock</p>
        <h2 className="mt-1 text-lg font-semibold">Step {totalSteps ? `${stepIndex + 1}/${totalSteps}` : '0/0'}</h2>
        <p className="mt-1 text-sm text-atlas-muted">{modeSubtitle[mode]}</p>
      </div>

      <div className="atlas-elevated space-y-2 p-3">
        <p className="text-[11px] uppercase tracking-[0.13em] text-atlas-muted">Story Caption</p>
        <p className="text-sm leading-relaxed text-atlas-text">{caption}</p>
        {currentStep?.explanation ? <p className="text-xs leading-relaxed text-atlas-muted">{currentStep.explanation}</p> : null}
      </div>

      <div className="mt-3 atlas-elevated space-y-2 p-3">
        <div className="flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.13em] text-atlas-muted">Why Did This Change?</p>
          {selected ? (
            <button type="button" className="text-[11px] text-atlas-muted hover:text-atlas-text" onClick={onClearSelection}>
              Clear
            </button>
          ) : null}
        </div>
        {selected ? (
          <>
            <p className="text-xs text-atlas-text">{selected.label}</p>
            <p className="text-xs text-atlas-muted">{inspectorContext?.reason || 'No mutation reason available yet.'}</p>
            <div className="flex items-center gap-2 text-[11px] text-atlas-muted">
              <span>Origin step</span>
              <button
                type="button"
                className="rounded-md border border-atlas-muted/30 px-2 py-0.5 text-atlas-text"
                onClick={() => {
                  if (inspectorContext?.originStep != null) onSeekStep(inspectorContext.originStep)
                }}
              >
                {inspectorContext?.originStep ?? 'n/a'}
              </button>
            </div>
          </>
        ) : (
          <p className="text-xs text-atlas-muted">Select a variable or heap node to inspect mutation origins and causes.</p>
        )}
      </div>

      <div className="mt-3 atlas-elevated p-3">
        <p className="mb-2 text-[11px] uppercase tracking-[0.13em] text-atlas-muted">Cause-Effect Chain</p>
        {causeEvents.length ? (
          <div className="space-y-2">
            {causeEvents.map((step) => (
              <button
                key={step.id}
                type="button"
                className="flex w-full items-center justify-between rounded-lg border border-atlas-muted/25 bg-atlas-surface/65 px-2.5 py-2 text-left text-xs text-atlas-muted transition hover:border-atlas-brand/40 hover:text-atlas-text"
                onClick={() => onSeekStep(step.id)}
              >
                <span className="truncate pr-2">{step.event}</span>
                <span className="inline-flex items-center gap-1 text-atlas-text">
                  {step.id}
                  <ArrowRight size={12} />
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-atlas-muted">No direct cause chain for current selection.</p>
        )}
      </div>

      {milestone ? (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={motionTokens.microSpring}
          className={cn(
            'mt-3 rounded-xl border px-3 py-2 text-sm',
            'border-atlas-loop/45 bg-atlas-loop/15 text-atlas-text',
          )}
        >
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-atlas-loop" />
            {milestone}
          </div>
        </motion.div>
      ) : null}
    </aside>
  )
}

export default AtlasNarrativeDock
