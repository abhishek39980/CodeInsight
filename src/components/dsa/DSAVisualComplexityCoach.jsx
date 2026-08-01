import { motion } from 'framer-motion'
import { TrendingUp, Layers, Cpu, ArrowDown, CheckCircle2 } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function DSAVisualComplexityCoach({ problem }) {
  if (!problem) return null

  const vc = problem.visualComplexity || {
    type: 'linear-scan',
    stepsExplanation: 'Linear scan visits each element a constant number of times.',
  }

  return (
    <div className="space-y-8">
      {/* Time Complexity Animated Visualizer */}
      <div className="rounded-3xl border border-atlas-brand/30 bg-atlas-surface/90 p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-atlas-brand">
            <TrendingUp size={18} className="text-atlas-brand" />
            <span>Time Complexity Visualizer — Why is it {problem.optimalSolution?.timeComplexity || 'O(N)'}?</span>
          </div>
          <span className="rounded-full bg-atlas-brand/20 px-3 py-1 text-xs font-mono font-bold text-atlas-text border border-atlas-brand/40">
            {problem.optimalSolution?.timeComplexity || 'O(N)'}
          </span>
        </div>

        <p className="text-sm text-atlas-muted leading-relaxed">
          {vc.stepsExplanation}
        </p>

        {/* Animated Complexity Models */}
        {vc.type === 'quadratic-to-linear' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300">Brute Force: O(N²) Nested Loops</span>
              <div className="flex flex-col items-center gap-2 py-4 font-mono text-xs text-atlas-text">
                <div className="w-48 rounded-lg bg-rose-500/20 p-2 text-center border border-rose-500/30">
                  Outer Loop ➔ N iterations
                </div>
                <ArrowDown size={14} className="text-rose-300" />
                <div className="w-48 rounded-lg bg-rose-500/20 p-2 text-center border border-rose-500/30">
                  Inner Loop ➔ N iterations
                </div>
                <ArrowDown size={14} className="text-rose-300" />
                <div className="w-48 rounded-lg bg-rose-500/40 p-2 text-center font-bold text-rose-200 border border-rose-500">
                  Total = N × N = O(N²)
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Optimal: O(N) HashMap / Pointers</span>
              <div className="flex flex-col items-center gap-2 py-4 font-mono text-xs text-atlas-text">
                <div className="w-48 rounded-lg bg-emerald-500/20 p-2 text-center border border-emerald-500/30">
                  Single Loop ➔ N iterations
                </div>
                <ArrowDown size={14} className="text-emerald-300" />
                <div className="w-48 rounded-lg bg-emerald-500/20 p-2 text-center border border-emerald-500/30">
                  HashMap Lookup ➔ O(1) instant
                </div>
                <ArrowDown size={14} className="text-emerald-300" />
                <div className="w-48 rounded-lg bg-emerald-500/40 p-2 text-center font-bold text-emerald-200 border border-emerald-500">
                  Total = N × 1 = O(N)
                </div>
              </div>
            </div>
          </div>
        )}

        {vc.type === 'logarithmic-halving' && (
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">Why Binary Search is O(log N)</span>
            <div className="flex flex-wrap items-center justify-center gap-3 py-4 font-mono text-xs text-atlas-text">
              {['N elements', '➔ N / 2', '➔ N / 4', '➔ N / 8', '➔ ...', '➔ 1 element'].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.15 }}
                  className="rounded-xl border border-cyan-500/40 bg-cyan-500/20 px-3.5 py-2 font-bold text-cyan-200"
                >
                  {item}
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-center text-atlas-muted">
              Halving an array of 1,000,000 elements takes at most <strong>20 comparisons</strong> (log₂ 1,000,000 ≈ 20).
            </p>
          </div>
        )}

        {vc.type === 'recurrence-tree' && (
          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Why Merge Sort is O(N log N)</span>
            <div className="flex flex-col items-center gap-2 py-4 font-mono text-xs text-atlas-text">
              <div className="rounded-lg bg-indigo-500/20 px-4 py-2 border border-indigo-500/30">
                Level 0: 1 array of size N ➔ N work to merge
              </div>
              <div className="rounded-lg bg-indigo-500/20 px-4 py-2 border border-indigo-500/30">
                Level 1: 2 arrays of size N/2 ➔ N work to merge
              </div>
              <div className="rounded-lg bg-indigo-500/20 px-4 py-2 border border-indigo-500/30">
                Level 2: 4 arrays of size N/4 ➔ N work to merge
              </div>
              <div className="rounded-lg bg-indigo-500/40 px-4 py-2 font-bold text-indigo-200 border border-indigo-500">
                Total = (log₂ N levels) × (N work per level) = O(N log N)
              </div>
            </div>
          </div>
        )}

        {(vc.type === 'linear-scan' || vc.type === 'window-slide' || vc.type === 'pointer-convergence' || vc.type === 'dp-subproblems' || vc.type === 'stack-operations' || vc.type === 'grid-traversal') && (
          <div className="rounded-2xl border border-atlas-brand/30 bg-atlas-brand/10 p-6 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-atlas-brand">Linear Work breakdown</span>
            <p className="text-xs leading-relaxed text-atlas-muted">
              Each element in the input is touched at most a constant number of times (e.g. once by a left pointer, once by a right pointer, or once pushed/popped from a stack). Thus, total work scales linearly with input size N.
            </p>
          </div>
        )}
      </div>

      {/* Space Complexity Animated Visualizer */}
      <div className="rounded-3xl border border-atlas-muted/25 bg-atlas-surface/90 p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-atlas-text">
            <Layers size={18} className="text-atlas-brand" />
            <span>Space Complexity Visualizer — Memory Allocation Trace</span>
          </div>
          <span className="rounded-full bg-atlas-elev px-3 py-1 text-xs font-mono font-bold text-atlas-text border border-atlas-muted/30">
            {problem.optimalSolution?.spaceComplexity || 'O(1)'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-elev/50 p-4 space-y-2">
            <span className="text-xs font-bold text-atlas-text">Extra Data Structures</span>
            <p className="text-xs text-atlas-muted leading-relaxed">
              {problem.optimalSolution?.spaceComplexity === 'O(1)'
                ? 'No auxiliary arrays, HashMaps, or Queues allocated. We only use O(1) primitive scalar variables.'
                : 'Allocates auxiliary memory (e.g. HashMap, visited array, or DP tabulation table) proportional to N.'}
            </p>
          </div>

          <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-elev/50 p-4 space-y-2">
            <span className="text-xs font-bold text-atlas-text">Recursion Call Stack</span>
            <p className="text-xs text-atlas-muted leading-relaxed">
              {problem.tags.includes('Recursion') || problem.tags.includes('Depth-First Search') || problem.tags.includes('Divide and Conquer')
                ? 'Recursive calls consume call-stack memory proportional to maximum recursion tree depth (O(N) or O(log N)).'
                : 'Iterative algorithm with explicit loops — 0 recursion call-stack overhead.'}
            </p>
          </div>

          <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-elev/50 p-4 space-y-2">
            <span className="text-xs font-bold text-atlas-text">Memory Growth Curve</span>
            <div className="h-12 w-full flex items-end gap-1.5 pt-2">
              {[15, 30, 45, 60, 75, 90].map((h, i) => (
                <div
                  key={i}
                  style={{
                    height: problem.optimalSolution?.spaceComplexity === 'O(1)' ? '20%' : `${h}%`,
                  }}
                  className="flex-1 rounded-t bg-atlas-brand/50 transition-all"
                />
              ))}
            </div>
            <span className="text-[10px] text-atlas-muted font-mono">
              {problem.optimalSolution?.spaceComplexity === 'O(1)' ? 'Flat constant O(1) memory' : 'Linear O(N) memory allocation'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
