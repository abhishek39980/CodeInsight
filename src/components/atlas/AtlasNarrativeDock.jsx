import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, Plus, X, GitCommit } from 'lucide-react'

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
  watchlist = new Set(),
  onToggleWatchlist,
}) {
  const [watchInput, setWatchInput] = useState('')

  const updates = currentStep?.updates || []
  const topFrame = currentStep?.callStack?.[currentStep.callStack.length - 1] || null
  const activeVars = topFrame?.vars || []

  const causeEvents = (inspectorContext?.causeStepIds || [])
    .map((id) => steps.find((item) => item.id === id))
    .filter(Boolean)
    .slice(-3)

  const handleAddWatch = (e) => {
    e.preventDefault()
    if (watchInput.trim() && onToggleWatchlist) {
      onToggleWatchlist(watchInput.trim())
      setWatchInput('')
    }
  }

  return (
    <aside className="atlas-surface flex h-full flex-col p-4 overflow-y-auto">
      <div className="mb-4">
        <p className="text-[11px] uppercase tracking-[0.14em] text-atlas-muted">State Inspector</p>
        <h2 className="mt-1 text-lg font-semibold text-atlas-text">
          Step {totalSteps ? `${stepIndex + 1} / ${totalSteps}` : '0 / 0'}
        </h2>
        <p className="mt-1 text-xs text-atlas-muted">Live execution state & mutation trace</p>
      </div>

      {/* Step Narrative */}
      <div className="atlas-elevated space-y-2 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-atlas-muted">Step Narrative</p>
        <p className="text-sm font-medium leading-relaxed text-atlas-text">{currentStep?.event || 'Program Initialized'}</p>
        {currentStep?.explanation && (
          <p className="text-xs leading-relaxed text-atlas-muted">{currentStep.explanation}</p>
        )}
      </div>

      {/* Pinned Variable Watchlist */}
      <div className="mt-3 atlas-elevated space-y-2 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.13em] text-atlas-muted">
            <Eye size={12} className="text-atlas-brand" />
            <span>Variable Watchlist</span>
          </div>
        </div>

        <form onSubmit={handleAddWatch} className="flex gap-1.5 pt-1">
          <input
            type="text"
            placeholder="Pin variable (e.g. i, arr)"
            value={watchInput}
            onChange={(e) => setWatchInput(e.target.value)}
            className="flex-1 rounded-md border border-atlas-muted/25 bg-atlas-bg0/60 px-2 py-1 text-xs text-atlas-text outline-none focus:border-atlas-brand/50"
          />
          <button
            type="submit"
            className="rounded-md border border-atlas-brand/40 bg-atlas-brand/20 px-2 py-1 text-xs text-atlas-text hover:bg-atlas-brand/30"
          >
            <Plus size={14} />
          </button>
        </form>

        {watchlist.size > 0 ? (
          <div className="space-y-1.5 pt-1">
            {Array.from(watchlist).map((varName) => {
              const matched = activeVars.find((v) => v.name === varName)
              const valStr = matched ? matched.value : 'undefined'
              return (
                <div key={varName} className="flex items-center justify-between rounded-lg border border-atlas-brand/30 bg-atlas-brand/10 px-2.5 py-1.5 text-xs font-mono">
                  <span className="text-atlas-brand font-semibold">{varName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-atlas-text">{valStr}</span>
                    <button
                      type="button"
                      onClick={() => onToggleWatchlist && onToggleWatchlist(varName)}
                      className="text-atlas-muted hover:text-atlas-error"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-[11px] text-atlas-muted">Type a variable name above to pin it to your watchlist.</p>
        )}
      </div>

      {/* Active Mutations */}
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
                <button
                  type="button"
                  onClick={() => onToggleWatchlist && onToggleWatchlist(u.name || u.key)}
                  className="text-atlas-brand font-medium hover:underline text-left"
                  title="Click to pin variable to Watchlist"
                >
                  {u.name || u.key}
                </button>
                <span className="text-atlas-text">{u.prev !== undefined ? `${u.prev} → ${u.next}` : u.reason}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-atlas-muted">No variable mutations on this line.</p>
        )}
      </div>

      {/* Cause-Effect Chain */}
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
