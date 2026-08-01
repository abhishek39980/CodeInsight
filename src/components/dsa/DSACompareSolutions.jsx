import { useState } from 'react'
import { Zap, TrendingDown, CheckCircle2, Trophy, Clock, Database } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function DSACompareSolutions({ problem }) {
  if (!problem) return null

  const { bruteForce, optimalSolution } = problem
  if (!bruteForce || !optimalSolution) {
    return (
      <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-surface/80 p-8 text-center text-atlas-muted">
        This problem has a single canonical optimal solution without a standard brute-force tradeoff.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Compare Header Banner */}
      <div className="rounded-3xl border border-atlas-brand/30 bg-gradient-to-r from-atlas-surface via-atlas-elev to-atlas-surface p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-atlas-brand">
            <Trophy size={16} className="text-atlas-brand" />
            <span>Side-by-Side Algorithm Benchmark</span>
          </div>
          <h3 className="mt-1 text-xl font-bold text-atlas-text">Brute Force vs Optimal Solution</h3>
          <p className="text-xs text-atlas-muted mt-1">
            Compare algorithmic strategy, operation counts, and memory footprint side by side.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-center">
            <span className="text-[10px] text-rose-300 uppercase font-bold">Brute Force</span>
            <p className="text-xs font-mono font-bold text-rose-200">{bruteForce.timeComplexity}</p>
          </div>
          <span className="text-atlas-muted font-bold">VS</span>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-center">
            <span className="text-[10px] text-emerald-300 uppercase font-bold">Optimal</span>
            <p className="text-xs font-mono font-bold text-emerald-200">{optimalSolution.timeComplexity}</p>
          </div>
        </div>
      </div>

      {/* Split-Screen Solution Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brute Force Column */}
        <div className="flex flex-col justify-between rounded-2xl border border-rose-500/30 bg-atlas-surface/90 p-6 space-y-4 shadow-lg">
          <div>
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
              <span className="text-sm font-bold text-rose-300 flex items-center gap-1.5">
                <span>🐢 Brute Force Approach</span>
              </span>
              <div className="flex gap-1.5 font-mono text-xs">
                <span className="rounded bg-rose-500/20 px-2 py-0.5 text-rose-300">{bruteForce.timeComplexity}</span>
                <span className="rounded bg-atlas-elev px-2 py-0.5 text-atlas-muted">{bruteForce.spaceComplexity}</span>
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-atlas-muted">{bruteForce.explanation}</p>

            <pre className="mt-4 rounded-xl border border-rose-500/20 bg-atlas-bg0/60 p-4 font-mono text-xs text-atlas-text overflow-x-auto">
              <code>{bruteForce.code}</code>
            </pre>
          </div>

          <div className="mt-4 pt-4 border-t border-rose-500/20 space-y-2 text-xs">
            <div className="flex items-center justify-between font-mono text-rose-300">
              <span>Simulated Operations (N = 1,000):</span>
              <span className="font-bold">~500,000 ops</span>
            </div>
            <div className="h-2 w-full rounded-full bg-rose-500/20 overflow-hidden">
              <div className="h-full w-full bg-rose-500" />
            </div>
          </div>
        </div>

        {/* Optimal Solution Column */}
        <div className="flex flex-col justify-between rounded-2xl border-2 border-emerald-500/50 bg-atlas-surface/90 p-6 space-y-4 shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
              <span className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                <span>🚀 Optimal Interview Solution</span>
              </span>
              <div className="flex gap-1.5 font-mono text-xs">
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-emerald-300 font-bold">{optimalSolution.timeComplexity}</span>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-emerald-300 font-bold">{optimalSolution.spaceComplexity}</span>
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-atlas-muted">{optimalSolution.explanation}</p>

            <pre className="mt-4 rounded-xl border border-emerald-500/30 bg-atlas-bg0/60 p-4 font-mono text-xs text-atlas-text overflow-x-auto">
              <code>{optimalSolution.code}</code>
            </pre>
          </div>

          <div className="mt-4 pt-4 border-t border-emerald-500/30 space-y-2 text-xs">
            <div className="flex items-center justify-between font-mono text-emerald-300">
              <span>Simulated Operations (N = 1,000):</span>
              <span className="font-bold">~1,000 ops</span>
            </div>
            <div className="h-2 w-full rounded-full bg-emerald-500/20 overflow-hidden">
              <div className="h-full w-[2%] bg-emerald-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
