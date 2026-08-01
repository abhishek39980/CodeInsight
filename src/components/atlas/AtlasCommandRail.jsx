import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw } from 'lucide-react'
import { motionTokens } from '../../atlas/motion'
import { cn } from '../../utils/cn'

// Tabs to show — removed: Tree/Graph Diagram, Memory Graph, Call Tree, Scopes
const views = [
  { id: 'timeline', label: 'Timeline' },
  { id: 'compare', label: 'Dual Comparison' },
  { id: 'complexity', label: 'Complexity Analysis' },
  { id: 'ast', label: 'AST Explorer' },
]

const buttonClass =
  'inline-flex items-center gap-1.5 rounded-xl border border-atlas-muted/25 bg-atlas-surface/70 px-3 py-2 text-xs text-atlas-text transition hover:border-atlas-muted/40 hover:bg-atlas-elev/90 disabled:cursor-not-allowed disabled:opacity-40'

const AtlasCommandRail = ({
  isRunning,
  canRun,
  speed,
  onRun,
  onPause,
  onStep,
  onStepBack,
  onReset,
  onSpeedChange,
  view,
  onViewChange,
  selectedLanguage,
  languages,
  onLanguageChange,
  selectedExample,
  examples,
  onLoadExample,
  breakpoints = new Set(),
  watchlist = new Set(),
}) => {
  return (
    <div className="atlas-surface px-4 py-3">
      {/* Row 1: Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Playback buttons */}
        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            transition={motionTokens.microSpring}
            className={cn(buttonClass, canRun && !isRunning && 'border-atlas-brand/50 bg-atlas-brand/20 text-atlas-text')}
            onClick={onRun}
            disabled={!canRun || isRunning}
            id="btn-run"
          >
            <Play size={14} />
            Run
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            transition={motionTokens.microSpring}
            className={cn(buttonClass, isRunning && 'border-atlas-ember/40 bg-atlas-ember/20')}
            onClick={onPause}
            disabled={!isRunning}
            id="btn-pause"
          >
            <Pause size={14} />
            Pause
          </motion.button>
          <button type="button" id="btn-back" className={buttonClass} onClick={onStepBack} disabled={isRunning || !canRun}>
            <ArrowLeft size={14} />
            Back
          </button>
          <button type="button" id="btn-next" className={buttonClass} onClick={onStep} disabled={isRunning || !canRun}>
            <ArrowRight size={14} />
            Next
          </button>
          <button type="button" id="btn-reset" className={buttonClass} onClick={onReset}>
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        {/* Speed */}
        <div className="rounded-xl border border-atlas-muted/25 bg-atlas-surface/60 px-3 py-2 text-xs text-atlas-muted">
          Speed
          <input
            type="range"
            min={0.25}
            max={2}
            step={0.25}
            value={speed}
            onChange={(event) => onSpeedChange(Number(event.target.value))}
            className="mx-2 w-20 accent-atlas-brand"
          />
          <span className="font-mono text-atlas-text">{speed.toFixed(2)}x</span>
        </div>

        {/* Language picker */}
        <select
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="rounded-xl border border-atlas-muted/25 bg-atlas-surface px-3 py-2 text-xs text-atlas-text outline-none"
          id="select-language"
        >
          {languages.map((lang) => (
            <option key={lang.id} value={lang.id}>{lang.label}</option>
          ))}
        </select>

        {/* Status badges */}
        <div className="ml-auto flex items-center gap-2">
          {breakpoints.size > 0 && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/20 px-2.5 py-1 text-xs text-red-200 font-mono">
              Breakpoints: <span className="font-bold">{breakpoints.size}</span>
            </div>
          )}
          {watchlist.size > 0 && (
            <div className="rounded-lg border border-atlas-brand/40 bg-atlas-brand/20 px-2.5 py-1 text-xs text-atlas-text font-mono">
              Watchlist: <span className="font-bold">{watchlist.size}</span>
            </div>
          )}

          {/* Example picker */}
          <div className="flex items-center gap-2 rounded-xl border border-atlas-muted/25 bg-atlas-surface/60 px-2 py-1">
            <span className="text-[11px] text-atlas-muted">Example</span>
            <select
              className="max-w-56 rounded-md border border-atlas-muted/25 bg-atlas-surface px-2 py-1 text-xs text-atlas-text outline-none"
              value={selectedExample}
              onChange={(event) => onLoadExample(event.target.value)}
              id="select-example"
            >
              {Object.entries(
                examples.reduce((acc, example) => {
                  const cat = example.category || 'other'
                  if (!acc[cat]) acc[cat] = []
                  acc[cat].push(example)
                  return acc
                }, {})
              ).map(([catKey, catExamples]) => {
                const catLabelMap = {
                  'sorting': '🔀 Sorting Algorithms',
                  'searching': '🔍 Searching & Two Pointers',
                  'linked-lists': '🔗 Linked Lists',
                  'trees-recursion': '🌲 Trees & Recursion',
                  'graphs-matrix': '🌐 Graphs & Matrix',
                  'stacks-queues': '🥞 Stacks & Queues',
                  'dp': '🧩 Dynamic Programming',
                }
                const groupLabel = catLabelMap[catKey] || catKey.toUpperCase()
                return (
                  <optgroup key={catKey} label={groupLabel}>
                    {catExamples.map((example) => (
                      <option key={example.id} value={example.id}>
                        {example.label}
                      </option>
                    ))}
                  </optgroup>
                )
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Row 2: View tabs */}
      <div className="mt-3 flex flex-wrap items-center gap-1">
        {views.map((item) => (
          <button
            key={item.id}
            type="button"
            id={`tab-${item.id}`}
            onClick={() => onViewChange(item.id)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-medium transition',
              view === item.id
                ? 'bg-atlas-brand/25 text-atlas-text border border-atlas-brand/40'
                : 'text-atlas-muted hover:bg-atlas-elev/70 border border-transparent',
            )}
          >
            {item.label}
          </button>
        ))}

        <div className="ml-auto rounded-lg border border-atlas-muted/20 bg-atlas-surface/50 px-3 py-1 text-[11px] font-mono text-atlas-muted">
          Engine: <span className="text-atlas-brand font-semibold">JavaScript (Native AST)</span>
        </div>
      </div>
    </div>
  )
}

export default AtlasCommandRail
