import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, ArrowRight, ArrowLeft, Lightbulb, Code2, Copy, Check } from 'lucide-react'
import EditorPanel from '../EditorPanel'
import CodeJudgePanel from '../CodeJudgePanel'
import LanguageSwitcher from '../LanguageSwitcher'
import { cn } from '../../utils/cn'
import { getStubForProblem, LANGUAGES } from '../../engine/languageStubs'

// Lazy-load visualizers
import GraphVisualizer from '../visualizers/GraphVisualizer'
import TreeVisualizer from '../visualizers/TreeVisualizer'
import LinkedListVisualizer from '../visualizers/LinkedListVisualizer'

const GRAPH_CATEGORIES = ['graphs', 'matrix']
const TREE_CATEGORIES  = ['trees', 'bst']
const LIST_CATEGORIES  = ['linked-lists']

function VisualizerCanvas({ problem, stepIndex, steps, currentStep }) {
  const cat = problem?.category ?? ''
  if (GRAPH_CATEGORIES.includes(cat)) return <GraphVisualizer stepIndex={stepIndex} steps={steps} problem={problem} />
  if (TREE_CATEGORIES.includes(cat))  return <TreeVisualizer  stepIndex={stepIndex} steps={steps} problem={problem} />
  if (LIST_CATEGORIES.includes(cat))  return <LinkedListVisualizer stepIndex={stepIndex} steps={steps} problem={problem} />

  // Default array visualizer
  const arrayValues = currentStep?.heap?.[0]?.elements
    ?? currentStep?.callStack?.[0]?.vars?.find(v => Array.isArray(v.value))?.value
    ?? [2, 7, 11, 15]

  return (
    <div className="py-6 flex flex-col items-center justify-center min-h-[160px] bg-atlas-bg0/40 rounded-2xl border border-atlas-muted/15 p-4">
      <p className="text-xs uppercase tracking-widest text-atlas-muted mb-4 font-mono">Current Data Structure State</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {Array.isArray(arrayValues) && arrayValues.map((val, idx) => (
          <motion.div
            key={idx}
            layout
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
              scale: idx === stepIndex % arrayValues.length ? 1.1 : 1,
              borderColor: idx === stepIndex % arrayValues.length ? '#38bdf8' : 'rgba(255,255,255,0.15)',
            }}
            className={cn(
              'relative flex h-14 w-14 flex-col items-center justify-center rounded-2xl border-2 font-mono text-base font-bold shadow-lg transition',
              idx === stepIndex % arrayValues.length
                ? 'bg-atlas-brand/30 text-atlas-text shadow-cyan-500/20'
                : 'bg-atlas-surface text-atlas-text/90'
            )}
          >
            <span>{val}</span>
            <span className="absolute -bottom-5 text-[10px] text-atlas-muted font-normal">[{idx}]</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default function DSALearningVisualizer({
  problem, code, onCodeChange,
  currentStep, stepIndex, steps = [],
  isRunning, onRun, onPause, onStep, onStepBack, onReset,
  speed, onSpeedChange,
  language, onLanguageChange,
}) {
  if (!problem) return null
  const [copied, setCopied] = useState(false)

  const selectedLang = language ?? LANGUAGES[0]

  const learningStepObj = problem.learningSteps?.[
    Math.min(stepIndex, (problem.learningSteps?.length || 1) - 1)
  ] ?? {
    step: stepIndex + 1,
    text: currentStep?.explanation ?? currentStep?.event ?? 'Executing algorithm step…',
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleLanguageChange = (lang) => {
    if (onLanguageChange) onLanguageChange(lang)
    const stub = getStubForProblem(problem.id, lang.id)
    if (stub) onCodeChange(stub)
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_480px] gap-6">
      {/* Left: Problem + Visualizer + Coach */}
      <div className="flex flex-col gap-6">
        {/* Problem Statement */}
        <div className="rounded-xl border border-atlas-muted/15 bg-atlas-surface p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-atlas-muted">Problem Statement</h3>
            <span className="text-xs font-mono text-atlas-muted">
              Time: {problem.optimalSolution?.timeComplexity ?? 'O(N)'} | Space: {problem.optimalSolution?.spaceComplexity ?? 'O(1)'}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-atlas-text">{problem.problemStatement.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="rounded-lg border border-atlas-muted/10 bg-atlas-bg0/50 p-3 font-mono text-xs">
              <span className="text-atlas-muted font-medium">Input:</span>
              <p className="mt-1 text-atlas-text">{problem.problemStatement.exampleInput}</p>
            </div>
            <div className="rounded-lg border border-atlas-muted/10 bg-atlas-bg0/50 p-3 font-mono text-xs">
              <span className="text-atlas-muted font-medium">Output:</span>
              <p className="mt-1 text-atlas-text">{problem.problemStatement.exampleOutput}</p>
            </div>
          </div>
        </div>

        {/* Visualizer Canvas */}
        <div className="rounded-xl border border-atlas-muted/15 bg-atlas-surface p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-atlas-muted/10 pb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-atlas-muted">Visualization</h3>
            <span className="text-xs font-mono text-atlas-muted">
              Step {stepIndex + 1} / {Math.max(1, steps.length)}
            </span>
          </div>

          <VisualizerCanvas problem={problem} stepIndex={stepIndex} steps={steps} currentStep={currentStep} />

          {/* Step Progress Bar */}
          <div className="w-full h-1 rounded-full bg-atlas-muted/15 overflow-hidden">
            <motion.div
              className="h-full bg-atlas-brand rounded-full"
              animate={{ width: `${steps.length > 1 ? (stepIndex / (steps.length - 1)) * 100 : 0}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>

          {/* Learning Coach */}
          <div className="rounded-lg border border-atlas-muted/15 bg-atlas-bg0/40 p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-atlas-muted mb-1.5">
              <Lightbulb size={14} />
              <span>Explanation</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={stepIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm leading-relaxed text-atlas-text"
              >
                {learningStepObj.text}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Playback Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <button onClick={onRun} disabled={isRunning} className="inline-flex items-center gap-1 rounded-lg border border-atlas-muted/20 bg-atlas-elev px-3 py-1.5 text-xs font-medium text-atlas-text hover:bg-atlas-elev/80 disabled:opacity-40 transition">
                <Play size={13} /><span>Run</span>
              </button>
              <button onClick={onPause} disabled={!isRunning} className="inline-flex items-center gap-1 rounded-lg border border-atlas-muted/20 bg-atlas-elev px-3 py-1.5 text-xs font-medium text-atlas-text hover:bg-atlas-elev/80 disabled:opacity-40 transition">
                <Pause size={13} /><span>Pause</span>
              </button>
              <button onClick={onStepBack} className="inline-flex items-center gap-1 rounded-lg border border-atlas-muted/15 bg-atlas-surface px-2.5 py-1.5 text-xs font-medium text-atlas-muted hover:text-atlas-text transition">
                <ArrowLeft size={13} /><span>Back</span>
              </button>
              <button onClick={onStep} className="inline-flex items-center gap-1 rounded-lg border border-atlas-muted/15 bg-atlas-surface px-2.5 py-1.5 text-xs font-medium text-atlas-muted hover:text-atlas-text transition">
                <ArrowRight size={13} /><span>Next</span>
              </button>
              <button onClick={onReset} className="inline-flex items-center gap-1 rounded-lg border border-atlas-muted/15 bg-atlas-surface px-2.5 py-1.5 text-xs font-medium text-atlas-muted hover:text-atlas-text transition">
                <RotateCcw size={13} /><span>Reset</span>
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-atlas-muted">
              <span>Speed:</span>
              <input type="range" min={0.25} max={3} step={0.25} value={speed} onChange={e => onSpeedChange(Number(e.target.value))} className="w-16 accent-atlas-brand" />
              <span className="font-mono text-atlas-text w-8">{speed.toFixed(2)}×</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Editor + Judge */}
      <div className="flex flex-col gap-4">
        {/* Editor Header */}
        <div className="flex items-center justify-between rounded-lg border border-atlas-muted/15 bg-atlas-surface px-4 py-2">
          <div className="flex items-center gap-2 text-xs font-medium text-atlas-text">
            <Code2 size={14} className="text-atlas-muted" />
            <span>Solution Code</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher value={selectedLang.id} onChange={handleLanguageChange} />
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 rounded-lg border border-atlas-muted/15 px-2.5 py-1 text-xs text-atlas-muted hover:text-atlas-text transition"
              title="Copy code"
            >
              {copied ? <><Check size={12} className="text-emerald-400" /> Copied</> : <><Copy size={12} /> Copy</>}
            </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="min-h-[480px] rounded-xl border border-atlas-muted/15 overflow-hidden">
          <EditorPanel
            code={code}
            onChange={onCodeChange}
            language={selectedLang.monacoId ?? 'javascript'}
            readOnly={false}
          />
        </div>

        {/* Code Judge */}
        <CodeJudgePanel problem={problem} code={code} language={selectedLang} />
      </div>
    </div>
  )
}
