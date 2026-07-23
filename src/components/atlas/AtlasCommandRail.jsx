import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Bug,
  Compass,
  Focus,
  Pause,
  Play,
  RotateCcw,
  Search,
} from 'lucide-react'
import { motionTokens } from '../../atlas/motion'
import { cn } from '../../utils/cn'

const modes = [
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'story', label: 'Story', icon: BookOpenText },
  { id: 'debug', label: 'Debug', icon: Bug },
]

const views = [
  { id: 'timeline', label: 'Timeline' },
  { id: 'memory', label: 'Memory Graph' },
  { id: 'callTree', label: 'Call Tree' },
  { id: 'eventLoop', label: 'Event Loop' },
  { id: 'ast', label: 'AST' },
  { id: 'complexity', label: 'Complexity' },
  { id: 'scope', label: 'Scopes' },
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
  mode,
  onModeChange,
  view,
  onViewChange,
  selectedLanguage,
  languages,
  onLanguageChange,
  selectedExample,
  examples,
  onLoadExample,
  searchValue,
  onSearchChange,
  onFindVariable,
  focusMode,
  onToggleFocusMode,
  beginnerMode,
  onToggleBeginnerMode,
}) => {
  return (
    <div className="atlas-surface px-4 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="mr-2 flex items-center gap-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            transition={motionTokens.microSpring}
            className={cn(buttonClass, canRun && !isRunning && 'border-atlas-brand/50 bg-atlas-brand/20 text-atlas-text')}
            onClick={onRun}
            disabled={!canRun || isRunning}
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
          >
            <Pause size={14} />
            Pause
          </motion.button>
          <button type="button" className={buttonClass} onClick={onStepBack} disabled={isRunning || !canRun}>
            <ArrowLeft size={14} />
            Back
          </button>
          <button type="button" className={buttonClass} onClick={onStep} disabled={isRunning || !canRun}>
            <ArrowRight size={14} />
            Next
          </button>
          <button type="button" className={buttonClass} onClick={onReset}>
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

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

        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-atlas-muted/25 bg-atlas-surface/60 px-2 py-1">
          {modes.map((item) => {
            const Icon = item.icon
            const active = mode === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onModeChange(item.id)}
                className={cn(
                  'inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs transition',
                  active ? 'bg-atlas-brand/25 text-atlas-text' : 'text-atlas-muted hover:bg-atlas-elev/70',
                )}
              >
                <Icon size={13} />
                {item.label}
              </button>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-atlas-muted/25 bg-atlas-surface/60 px-2 py-1">
          {views.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onViewChange(item.id)}
              className={cn(
                'rounded-lg px-2.5 py-1.5 text-xs transition',
                view === item.id ? 'bg-atlas-elev text-atlas-text' : 'text-atlas-muted hover:bg-atlas-elev/70',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={13} className="pointer-events-none absolute left-2.5 top-2.5 text-atlas-muted" />
            <input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') onFindVariable()
              }}
              placeholder="Focus variable..."
              className="w-44 rounded-xl border border-atlas-muted/25 bg-atlas-surface px-8 py-2 text-xs text-atlas-text outline-none placeholder:text-atlas-muted/70 focus:border-atlas-brand/50"
            />
          </div>
          <button type="button" onClick={onFindVariable} className={buttonClass}>
            Find
          </button>

          <button
            type="button"
            onClick={onToggleFocusMode}
            className={cn(buttonClass, focusMode && 'border-atlas-brand/45 bg-atlas-brand/20')}
          >
            <Focus size={13} />
            Focus
          </button>

          <button
            type="button"
            onClick={onToggleBeginnerMode}
            className={cn(buttonClass, beginnerMode && 'border-atlas-loop/45 bg-atlas-loop/20')}
          >
            Beginner
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div className="rounded-lg border border-atlas-muted/25 bg-atlas-surface/60 px-2 py-1">
          <span className="mr-2 text-[11px] text-atlas-muted">Language</span>
          <select
            className="rounded-md border border-atlas-muted/25 bg-atlas-surface px-2 py-1 text-xs text-atlas-text outline-none"
            value={selectedLanguage}
            onChange={(event) => onLanguageChange(event.target.value)}
          >
            {languages.map((language) => (
              <option key={language.id} value={language.id}>
                {language.label}
              </option>
            ))}
          </select>
        </div>
        <div className="rounded-lg border border-atlas-muted/25 bg-atlas-surface/60 px-2 py-1">
          <span className="mr-2 text-[11px] text-atlas-muted">Example</span>
          <select
            className="max-w-64 rounded-md border border-atlas-muted/25 bg-atlas-surface px-2 py-1 text-xs text-atlas-text outline-none"
            value={selectedExample}
            onChange={(event) => onLoadExample(event.target.value)}
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
                'stacks-queues': '🥞 Stacks & Queues',
                'sorting': '🔀 Sorting Algorithms',
                'algorithms': '⚡ Searching & Math',
                'linked-lists-trees': '🔗 Linked Lists & Trees',
                'recursion-graphs': '🌐 Graphs & Traversal',
                'recursion': '🔁 Recursion',
                'structures': '🏗️ Data Structures',
                'loops': '🔄 Loops & Iteration',
                'objects': '📦 Objects & Maps',
                'references': '🔗 Pointers & Swaps',
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
  )
}

export default AtlasCommandRail
