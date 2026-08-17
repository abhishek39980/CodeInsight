import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Code2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Layers,
  Cpu,
  Info,
  Terminal,
  CheckCircle2,
  Sliders
} from 'lucide-react'
import { simulateExecution } from '../engine/executor'
import { cn } from '../utils/cn'

const PRELOADED_SNIPPETS = {
  fib: {
    title: 'Fibonacci Recursion',
    code: `function fib(n) {
  if (n <= 1) return n;
  let a = fib(n - 1);
  let b = fib(n - 2);
  return a + b;
}
let result = fib(4);`
  },
  bsearch: {
    title: 'Binary Search',
    code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
let nums = [2, 5, 8, 12, 16, 23, 38, 56];
let idx = binarySearch(nums, 23);`
  },
  bubblesort: {
    title: 'Bubble Sort In-Place',
    code: `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}
let data = [64, 34, 25, 12, 22, 11, 90];
bubbleSort(data);`
  }
}

export default function CodeEngineView() {
  const [selectedSnippet, setSelectedSnippet] = useState('bsearch')
  const [code, setCode] = useState(PRELOADED_SNIPPETS.bsearch.code)
  const [steps, setSteps] = useState([])
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // Run execution trace on code changes
  useEffect(() => {
    try {
      const res = simulateExecution(code, {})
      if (res?.steps?.length > 0) {
        setSteps(res.steps)
        setStepIndex(0)
      } else {
        setSteps([{ event: 'Ready', explanation: 'Code ready for execution.' }])
      }
    } catch {
      setSteps([{ event: 'Ready', explanation: 'Parsed program ready.' }])
    }
  }, [code])

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      setStepIndex(prev => {
        if (prev + 1 >= steps.length) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 700)
    return () => clearInterval(timer)
  }, [isPlaying, steps])

  const currentStep = steps[stepIndex] || {}

  const handleSelectSnippet = (key) => {
    setSelectedSnippet(key)
    setCode(PRELOADED_SNIPPETS[key].code)
    setIsPlaying(false)
  }

  return (
    <div className="mx-auto max-w-[1580px] px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-atlas-surface via-atlas-elev to-atlas-surface p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
            <Code2 size={18} className="text-indigo-400" />
            <span>AST Code Execution & Memory Tracer</span>
          </div>
          <h1 className="mt-1 text-xl font-bold text-atlas-text">Watch Your Code Execute Step-by-Step</h1>
          <p className="text-xs text-atlas-muted mt-0.5 max-w-2xl">
            Write or edit code and step through Abstract Syntax Tree execution. Inspect stack frames, variables, loop counters, and heap memory mutations at each instruction.
          </p>
        </div>

        {/* Snippet Switcher */}
        <div className="flex items-center gap-1.5 bg-atlas-bg0/80 p-1.5 rounded-xl border border-atlas-muted/20">
          {Object.entries(PRELOADED_SNIPPETS).map(([k, v]) => (
            <button
              key={k}
              onClick={() => handleSelectSnippet(k)}
              className={cn(
                'px-3 py-1.5 text-xs font-semibold rounded-lg transition font-mono',
                selectedSnippet === k
                  ? 'bg-indigo-500 text-white shadow'
                  : 'text-atlas-muted hover:text-atlas-text'
              )}
            >
              {v.title}
            </button>
          ))}
        </div>
      </div>

      {/* Playback Controls */}
      <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-surface/80 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition border shadow',
              isPlaying
                ? 'bg-amber-500 text-white border-amber-400'
                : 'bg-indigo-500 text-white border-indigo-400'
            )}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            {isPlaying ? 'Pause' : 'Auto Step'}
          </button>
          <button
            onClick={() => { setIsPlaying(false); setStepIndex(prev => Math.max(0, prev - 1)) }}
            disabled={stepIndex === 0}
            className="rounded-lg bg-atlas-elev hover:bg-atlas-bg0 border border-atlas-muted/20 px-3 py-1.5 text-xs font-medium text-atlas-text transition disabled:opacity-40"
          >
            Step Back
          </button>
          <button
            onClick={() => { setIsPlaying(false); setStepIndex(prev => Math.min(steps.length - 1, prev + 1)) }}
            disabled={stepIndex >= steps.length - 1}
            className="rounded-lg bg-atlas-elev hover:bg-atlas-bg0 border border-atlas-muted/20 px-3 py-1.5 text-xs font-medium text-atlas-text transition disabled:opacity-40"
          >
            Step Next ➔
          </button>
          <button
            onClick={() => { setIsPlaying(false); setStepIndex(0) }}
            className="flex items-center gap-1 rounded-lg bg-atlas-elev hover:bg-atlas-bg0 border border-atlas-muted/20 px-3 py-1.5 text-xs font-medium text-atlas-muted hover:text-atlas-text transition"
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>

        {/* Step Scrubber */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-atlas-muted">Instruction Step:</span>
          <span className="text-indigo-400 font-bold">{stepIndex + 1} / {steps.length}</span>
          <input
            type="range"
            min={0}
            max={Math.max(0, steps.length - 1)}
            value={stepIndex}
            onChange={e => { setIsPlaying(false); setStepIndex(Number(e.target.value)) }}
            className="w-32 accent-indigo-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Main Two-Column Studio: Editor + Memory/Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 6 cols: Code Editor */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-atlas-muted uppercase">JavaScript Source</span>
              <span className="text-[10px] font-mono text-indigo-400">AST Parsed</span>
            </div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              rows={14}
              className="w-full rounded-xl bg-atlas-bg0 border border-atlas-muted/20 p-4 font-mono text-xs text-atlas-text focus:outline-none focus:border-indigo-400 resize-none leading-relaxed"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Right 6 cols: Call Stack & Variable State Inspector */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-4 font-mono">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-atlas-text font-sans">Execution State Inspector</h3>
              <span className="text-xs text-indigo-300 font-bold">Line {currentStep.line || '—'}</span>
            </div>

            {/* Current Action / Event */}
            <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/25 p-3 text-xs text-indigo-200">
              <span className="font-bold block text-[10px] text-indigo-400 uppercase">Current Step Action</span>
              <span>{currentStep.explanation || currentStep.event || 'Execution running...'}</span>
            </div>

            {/* Scope Variables */}
            <div className="space-y-2">
              <span className="text-[10px] text-atlas-muted uppercase block font-bold">Local Variables & Scope</span>
              <div className="rounded-xl bg-atlas-elev/80 p-3 border border-atlas-muted/15 min-h-[100px] max-h-[160px] overflow-y-auto space-y-1.5 text-xs">
                {currentStep.variables && Object.keys(currentStep.variables).length > 0 ? (
                  Object.entries(currentStep.variables).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between py-0.5 border-b border-atlas-muted/10 last:border-none">
                      <span className="text-cyan-300 font-bold">{k}:</span>
                      <span className="text-amber-300 font-mono">{JSON.stringify(v)}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-atlas-muted/60 text-xs">No active scope variables</span>
                )}
              </div>
            </div>

            {/* Call Stack Frame */}
            <div className="space-y-2">
              <span className="text-[10px] text-atlas-muted uppercase block font-bold">Call Stack Depth</span>
              <div className="rounded-xl bg-atlas-bg0 p-3 border border-atlas-muted/15 flex items-center gap-2">
                <Cpu size={16} className="text-indigo-400" />
                <span className="text-xs text-atlas-text font-bold font-mono">
                  main() {currentStep.scope ? `➔ ${currentStep.scope}()` : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
