import { useMemo, useState, useEffect } from 'react'
import { Swords, RotateCcw } from 'lucide-react'
import { simulateExecution } from '../../engine/executor'
import { codeExamples } from '../../engine/examples'

// Lazy simulation — runs after mount to avoid blocking the main thread
function useSimulation(code) {
  const [result, setResult] = useState({ steps: [], ok: false })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const r = simulateExecution(code, 'javascript')
        setResult(r)
      } catch {
        setResult({ steps: [], ok: false })
      }
      setReady(true)
    }, 50)
    return () => window.clearTimeout(id)
  }, [code])

  return { result, ready }
}

const QUICK_CODE = codeExamples.find((e) => e.id === 'js-quick-sort')?.code || ''
const BUBBLE_CODE = codeExamples.find((e) => e.id === 'js-bubble-sort')?.code || ''

export default function AtlasCompareScene() {
  const [stepIndex, setStepIndex] = useState(0)

  const { result: leftRes, ready: leftReady } = useSimulation(QUICK_CODE)
  const { result: rightRes, ready: rightReady } = useSimulation(BUBBLE_CODE)

  const leftSteps = leftRes.steps || []
  const rightSteps = rightRes.steps || []
  const maxTotalSteps = Math.max(leftSteps.length, rightSteps.length, 1)
  const currentLeft = leftSteps[Math.min(stepIndex, leftSteps.length - 1)] || null
  const currentRight = rightSteps[Math.min(stepIndex, rightSteps.length - 1)] || null

  const isLoading = !leftReady || !rightReady

  return (
    <div className="atlas-surface flex h-full flex-col p-4 overflow-y-auto space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-atlas-brand/40 bg-atlas-brand/15 p-2 text-atlas-brand">
            <Swords size={18} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-atlas-muted">Comparative Benchmark</p>
            <h3 className="text-base font-semibold text-atlas-text">Side-by-Side Dual Algorithm Compare</h3>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-1 max-w-md atlas-elevated px-3 py-2">
          {isLoading ? (
            <span className="text-xs text-atlas-muted font-mono">Simulating...</span>
          ) : (
            <>
              <span className="text-xs text-atlas-muted font-mono">Step {stepIndex + 1} / {maxTotalSteps}</span>
              <input
                type="range"
                min={0}
                max={maxTotalSteps - 1}
                value={stepIndex}
                onChange={(e) => setStepIndex(Number(e.target.value))}
                className="flex-1 accent-atlas-brand cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setStepIndex(0)}
                className="rounded-md border border-atlas-muted/30 bg-atlas-surface px-2 py-1 text-xs text-atlas-muted hover:text-atlas-text"
              >
                <RotateCcw size={12} />
              </button>
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-atlas-brand border-t-transparent" />
            <p className="text-xs text-atlas-muted font-mono">Running both algorithms in background...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Dual Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="atlas-elevated p-4 space-y-3 border-l-4 border-l-atlas-brand">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-atlas-brand text-sm">Algorithm A: Quick Sort</h4>
                <span className="text-xs font-mono text-emerald-400 font-bold">O(N log N) avg</span>
              </div>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between text-atlas-muted">
                  <span>Total Steps:</span>
                  <span className="text-atlas-text font-bold">{leftSteps.length}</span>
                </div>
                <div className="flex justify-between text-atlas-muted">
                  <span>Current Action:</span>
                  <span className="text-atlas-brand font-medium truncate max-w-[200px]">{currentLeft?.event || 'Done'}</span>
                </div>
                <div className="flex justify-between text-atlas-muted">
                  <span>Stack Depth:</span>
                  <span className="text-atlas-text">{currentLeft?.callStack?.length || 0} frames</span>
                </div>
              </div>
            </div>

            <div className="atlas-elevated p-4 space-y-3 border-l-4 border-l-amber-500">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-amber-400 text-sm">Algorithm B: Bubble Sort</h4>
                <span className="text-xs font-mono text-amber-400 font-bold">O(N²) worst</span>
              </div>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between text-atlas-muted">
                  <span>Total Steps:</span>
                  <span className="text-atlas-text font-bold">{rightSteps.length}</span>
                </div>
                <div className="flex justify-between text-atlas-muted">
                  <span>Current Action:</span>
                  <span className="text-amber-400 font-medium truncate max-w-[200px]">{currentRight?.event || 'Done'}</span>
                </div>
                <div className="flex justify-between text-atlas-muted">
                  <span>Stack Depth:</span>
                  <span className="text-atlas-text">{currentRight?.callStack?.length || 0} frames</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dual Code Viewers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-[220px]">
            <div className="atlas-elevated p-3 flex flex-col">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-atlas-muted/20">
                <span className="text-xs font-mono font-semibold text-atlas-brand">QuickSort Source</span>
                <span className="text-[11px] font-mono text-atlas-muted">Line {currentLeft?.line || 1}</span>
              </div>
              <pre className="font-mono text-xs text-atlas-text bg-atlas-bg0/60 p-3 rounded-lg flex-1 overflow-auto">
                {QUICK_CODE.split('\n').map((line, idx) => {
                  const isCurrent = currentLeft?.line === idx + 1
                  return (
                    <div key={`left-${idx}`} className={isCurrent ? 'bg-atlas-brand/25 text-white font-bold px-1 rounded' : 'opacity-80'}>
                      <span className="inline-block w-6 text-atlas-muted select-none">{idx + 1}</span>
                      {line}
                    </div>
                  )
                })}
              </pre>
            </div>

            <div className="atlas-elevated p-3 flex flex-col">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-atlas-muted/20">
                <span className="text-xs font-mono font-semibold text-amber-400">BubbleSort Source</span>
                <span className="text-[11px] font-mono text-atlas-muted">Line {currentRight?.line || 1}</span>
              </div>
              <pre className="font-mono text-xs text-atlas-text bg-atlas-bg0/60 p-3 rounded-lg flex-1 overflow-auto">
                {BUBBLE_CODE.split('\n').map((line, idx) => {
                  const isCurrent = currentRight?.line === idx + 1
                  return (
                    <div key={`right-${idx}`} className={isCurrent ? 'bg-amber-500/25 text-white font-bold px-1 rounded' : 'opacity-80'}>
                      <span className="inline-block w-6 text-atlas-muted select-none">{idx + 1}</span>
                      {line}
                    </div>
                  )
                })}
              </pre>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
