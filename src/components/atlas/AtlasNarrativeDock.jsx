import { motion } from 'framer-motion'
import { ArrowRight, Activity, GitCommit } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function AtlasNarrativeDock({
  currentStep,
  stepIndex,
  totalSteps,
  selected,
  inspectorContext,
  steps = [],
  onSeekStep,
  onClearSelection,
  milestone,
}) {
  const updates = currentStep?.updates || []
  const causeEvents = (inspectorContext?.causeStepIds || [])
    .map((id) => steps.find((item) => item.id === id))
    .filter(Boolean)
    .slice(-3)

  return (
    <aside className="atlas-surface flex h-full flex-col p-4">
      <div className="mb-4">
        <p className="text-[11px] uppercase tracking-[0.14em] text-atlas-muted">State Inspector</p>
        <h2 className="mt-1 text-lg font-semibold text-atlas-text">
          Step {totalSteps ? `${stepIndex + 1} / ${totalSteps}` : '0 / 0'}
        </h2>
        <p className="mt-1 text-xs text-atlas-muted">Live execution state & mutation trace</p>
      </div>

      <div className="atlas-elevated space-y-2 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-atlas-muted">Step Narrative</p>
        <p className="text-sm font-medium leading-relaxed text-atlas-text">{currentStep?.event || 'Program Initialized'}</p>
        {currentStep?.explanation && (
          <p className="text-xs leading-relaxed text-atlas-muted">{currentStep.explanation}</p>
        )}
      </div>

      <div className="mt-3 atlas-elevated space-y-2 p-3">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-atlas-muted">Active Mutations</p>
          {selected && (
            <button type="button" className="text-[11px] text-atlas-muted hover:text-atlas-text" onClick={onClearSelection}>
              Clear Focus
            </button>
          )}
        </div>

        {updates.length > 0 ? (
          <div className="space-y-1.5 pt-1">
            {updates.map((u, i) => (
              <div key={`${u.key}-${i}`} className="flex items-center justify-between rounded-lg border border-atlas-muted/20 bg-atlas-bg0/60 px-2.5 py-1.5 text-xs font-mono">
                <span className="text-atlas-brand font-medium">{u.name || u.key}</span>
                <span className="text-atlas-text">{u.prev !== undefined ? `${u.prev} → ${u.next}` : u.reason}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-atlas-muted">No variable mutations on this line.</p>
        )}
      </div>

      <div className="mt-3 atlas-elevated flex-1 p-3">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.13em] text-atlas-muted">Cause-Effect Chain</p>
        {causeEvents.length > 0 ? (
          <div className="space-y-2">
            {causeEvents.map((evt) => (
              <button
                key={evt.id}
                type="button"
                onClick={() => onSeekStep(evt.id)}
                className="flex w-full items-center justify-between rounded-lg border border-atlas-muted/25 bg-atlas-surface/80 px-2.5 py-1.5 text-left text-xs transition hover:border-atlas-brand/40"
              >
                <div className="truncate">
                  <span className="font-mono text-atlas-brand">Line {evt.line}: </span>
                  <span className="text-atlas-text">{evt.event}</span>
                </div>
                <ArrowRight size={12} className="text-atlas-muted" />
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-atlas-muted">Select a variable or heap node in the scene to trace its causal origin chain.</p>
        )}
      </div>

      {milestone && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-atlas-loop/40 bg-atlas-loop/15 px-3 py-2 text-xs text-atlas-text">
          <GitCommit size={14} className="text-atlas-loop" />
          <span>{milestone}</span>
        </div>
      )}
    </aside>
  )
}
