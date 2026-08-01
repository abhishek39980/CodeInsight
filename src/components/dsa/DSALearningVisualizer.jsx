import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, ArrowRight, ArrowLeft, Lightbulb, CheckCircle2, Code2, Terminal } from 'lucide-react'
import EditorPanel from '../EditorPanel'
import { cn } from '../../utils/cn'

export default function DSALearningVisualizer({ problem, code, onCodeChange, currentStep, stepIndex, steps = [], isRunning, onRun, onPause, onStep, onStepBack, onReset, speed, onSpeedChange }) {
  if (!problem) return null

  const learningStepObj = problem.learningSteps?.[Math.min(stepIndex, (problem.learningSteps?.length || 1) - 1)] || {
    step: stepIndex + 1,
    text: currentStep?.explanation || currentStep?.event || 'Executing algorithm step...',
  }

  const arrayValues = currentStep?.heap?.[0]?.elements || currentStep?.callStack?.[0]?.vars?.find(v => Array.isArray(v.value))?.value || [2, 7, 11, 15]

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_480px] gap-6">
      {/* Left Column: Problem Statement + Visualizer Canvas + Learning Coach */}
      <div className="flex flex-col gap-6">
        {/* Problem Statement Card */}
        <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-atlas-muted">Problem Statement</h3>
            <span className="rounded-lg bg-atlas-brand/15 px-2.5 py-1 text-xs font-mono text-atlas-brand">
              Time: {problem.optimalSolution?.timeComplexity || 'O(N)'} | Space: {problem.optimalSolution?.spaceComplexity || 'O(1)'}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-atlas-text">{problem.problemStatement.description}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl border border-atlas-muted/20 bg-atlas-elev/60 p-3 font-mono text-xs">
              <span className="text-atlas-muted font-bold">Example Input:</span>
              <p className="mt-1 text-atlas-text">{problem.problemStatement.exampleInput}</p>
            </div>
            <div className="rounded-xl border border-atlas-muted/20 bg-atlas-elev/60 p-3 font-mono text-xs">
              <span className="text-atlas-muted font-bold">Example Output:</span>
              <p className="mt-1 text-atlas-text">{problem.problemStatement.exampleOutput}</p>
            </div>
          </div>
        </div>

        {/* Interactive Visualizer Canvas */}
        <div className="rounded-2xl border border-atlas-muted/25 bg-gradient-to-b from-atlas-surface/90 to-atlas-elev/60 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-atlas-muted/20 pb-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-atlas-brand animate-pulse" />
              <h3 className="text-base font-bold text-atlas-text">Live Algorithm Execution Visualizer</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-atlas-muted">
                Step <strong className="text-atlas-text">{stepIndex + 1}</strong> of <strong className="text-atlas-text">{Math.max(1, steps.length)}</strong>
              </span>
              <span className="rounded-lg border border-atlas-brand/40 bg-atlas-brand/20 px-2.5 py-1 text-xs font-mono text-atlas-text">
                Operations: {(stepIndex + 1) * 2}
              </span>
            </div>
          </div>

          {/* Animated Array / Pointers Display */}
          <div className="py-6 flex flex-col items-center justify-center min-h-[160px] bg-atlas-bg0/40 rounded-2xl border border-atlas-muted/15 p-4">
            <p className="text-xs uppercase tracking-widest text-atlas-muted mb-4 font-mono">Current Data Structure State</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {Array.isArray(arrayValues) ? (
                arrayValues.map((val, idx) => (
                  <motion.div
                    key={idx}
                    layout
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{
                      scale: idx === stepIndex % arrayValues.length ? 1.08 : 1,
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
                ))
              ) : (
                <div className="text-sm font-mono text-atlas-muted">Running optimal algorithm...</div>
              )}
            </div>
          </div>

          {/* Learning Mode Coach Explanation Box */}
          <div className="rounded-2xl border-2 border-atlas-brand/50 bg-gradient-to-r from-atlas-brand/15 via-atlas-brand/10 to-transparent p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-atlas-brand mb-2">
              <Lightbulb size={16} className="text-atlas-brand" />
              <span>Learning Mode Coach — Why this step works</span>
            </div>
            <p className="text-base font-medium leading-relaxed text-atlas-text">
              {learningStepObj.text}
            </p>
          </div>

          {/* Playback & Interactive Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={onRun}
                disabled={isRunning}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-xl border border-atlas-brand/60 bg-atlas-brand/25 px-4 py-2 text-xs font-semibold text-atlas-text transition hover:bg-atlas-brand/35 disabled:opacity-50'
                )}
              >
                <Play size={14} />
                <span>Run</span>
              </button>
              <button
                onClick={onPause}
                disabled={!isRunning}
                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/20 px-4 py-2 text-xs font-semibold text-atlas-text hover:bg-amber-500/30 disabled:opacity-50"
              >
                <Pause size={14} />
                <span>Pause</span>
              </button>
              <button
                onClick={onStepBack}
                className="inline-flex items-center gap-1.5 rounded-xl border border-atlas-muted/30 bg-atlas-surface px-3 py-2 text-xs font-medium text-atlas-text hover:bg-atlas-elev"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
              <button
                onClick={onStep}
                className="inline-flex items-center gap-1.5 rounded-xl border border-atlas-muted/30 bg-atlas-surface px-3 py-2 text-xs font-medium text-atlas-text hover:bg-atlas-elev"
              >
                <ArrowRight size={14} />
                <span>Next Step</span>
              </button>
              <button
                onClick={onReset}
                className="inline-flex items-center gap-1.5 rounded-xl border border-atlas-muted/30 bg-atlas-surface px-3 py-2 text-xs font-medium text-atlas-text hover:bg-atlas-elev"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-atlas-muted">
              <span>Speed:</span>
              <input
                type="range"
                min={0.25}
                max={2}
                step={0.25}
                value={speed}
                onChange={(e) => onSpeedChange(Number(e.target.value))}
                className="w-20 accent-atlas-brand"
              />
              <span className="font-mono text-atlas-text">{speed.toFixed(2)}x</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Monaco Code Editor */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-xl border border-atlas-muted/25 bg-atlas-surface px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Code2 size={16} className="text-atlas-brand" />
            <span className="text-xs font-bold uppercase tracking-wider text-atlas-text">Interactive Solution Code</span>
          </div>
          <span className="rounded-lg bg-atlas-elev px-2 py-0.5 text-[11px] font-mono text-atlas-muted">JavaScript (ES2024)</span>
        </div>
        <div className="min-h-[520px] rounded-2xl border border-atlas-muted/25 overflow-hidden shadow-xl">
          <EditorPanel
            code={code}
            onChange={onCodeChange}
            language="javascript"
            readOnly={false}
          />
        </div>
      </div>
    </div>
  )
}
