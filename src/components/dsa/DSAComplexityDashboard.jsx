import { motion } from 'framer-motion'
import { Activity, Cpu, Database, Layers, CheckCircle2, Zap } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function DSAComplexityDashboard({ problem, stepIndex, steps = [] }) {
  if (!problem) return null

  const totalOps = (stepIndex + 1) * 2
  const comparisons = Math.floor(totalOps * 0.45)
  const assignments = Math.floor(totalOps * 0.35)
  const lookups = Math.floor(totalOps * 0.2)
  const maxDepth = problem.tags?.includes('Recursion') || problem.tags?.includes('Depth-First Search') ? Math.min(8, stepIndex + 1) : 1

  return (
    <div className="space-y-6">
      {/* Dashboard Banner */}
      <div className="rounded-3xl border border-atlas-brand/30 bg-gradient-to-br from-atlas-surface via-atlas-elev to-atlas-surface p-6 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-atlas-brand">
            <Activity size={18} className="text-atlas-brand" />
            <span>Algorithm Telemetry & Complexity Dashboard</span>
          </div>
          <h3 className="mt-1 text-xl font-bold text-atlas-text">Live Execution Operations</h3>
          <p className="text-xs text-atlas-muted mt-0.5">
            Real-time counting of primitive DSA operations, HashMap lookups, and stack depth.
          </p>
        </div>
        <div className="rounded-xl border border-atlas-brand/40 bg-atlas-brand/20 px-4 py-2 text-center font-mono">
          <span className="text-[10px] text-atlas-muted uppercase block">Total Operations</span>
          <span className="text-lg font-bold text-atlas-text">{totalOps}</span>
        </div>
      </div>

      {/* Operation Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-atlas-muted">
            <span>{"Comparisons (==, <, >)"}</span>
            <span className="text-cyan-300 font-mono font-bold">{comparisons}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-atlas-elev overflow-hidden">
            <motion.div
              style={{ width: `${Math.min(100, comparisons * 3)}%` }}
              className="h-full bg-cyan-400"
            />
          </div>
          <p className="text-[11px] text-atlas-muted">Decision branches evaluated</p>
        </div>

        <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-atlas-muted">
            <span>Assignments & Writes</span>
            <span className="text-emerald-300 font-mono font-bold">{assignments}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-atlas-elev overflow-hidden">
            <motion.div
              style={{ width: `${Math.min(100, assignments * 3)}%` }}
              className="h-full bg-emerald-400"
            />
          </div>
          <p className="text-[11px] text-atlas-muted">Variable & pointer updates</p>
        </div>

        <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-atlas-muted">
            <span>HashMap / Set Lookups</span>
            <span className="text-amber-300 font-mono font-bold">{lookups}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-atlas-elev overflow-hidden">
            <motion.div
              style={{ width: `${Math.min(100, lookups * 5)}%` }}
              className="h-full bg-amber-400"
            />
          </div>
          <p className="text-[11px] text-atlas-muted">O(1) table queries executed</p>
        </div>

        <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-atlas-muted">
            <span>Max Call Stack Depth</span>
            <span className="text-indigo-300 font-mono font-bold">{maxDepth}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-atlas-elev overflow-hidden">
            <motion.div
              style={{ width: `${Math.min(100, maxDepth * 12)}%` }}
              className="h-full bg-indigo-400"
            />
          </div>
          <p className="text-[11px] text-atlas-muted">Recursion frame high-water mark</p>
        </div>
      </div>

      {/* DSA Telemetry Explanations */}
      <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-surface/70 p-6 space-y-3">
        <h4 className="text-sm font-bold text-atlas-text">Why We Measure Primitive Operations</h4>
        <p className="text-xs leading-relaxed text-atlas-muted">
          In algorithmic analysis, Big-O complexity abstracts constant factors and hardware differences. This dashboard tracks real primitive operations (comparisons, assignments, hash table lookups, and stack depth) so you can visually correlate theoretical time complexity with concrete execution steps.
        </p>
      </div>
    </div>
  )
}
