import { motion } from 'framer-motion'
import { Activity, TrendingUp, Cpu, BookOpen, Layers, Zap } from 'lucide-react'

const MetricCard = ({ label, value, subtext, color = 'text-atlas-brand' }) => (
  <div className="rounded-xl border border-atlas-muted/25 bg-atlas-surface/70 p-3">
    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-atlas-muted">{label}</p>
    <p className={`mt-1 text-xl font-bold font-mono ${color}`}>{value}</p>
    {subtext && <p className="mt-0.5 text-[11px] text-atlas-muted font-mono">{subtext}</p>}
  </div>
)

const AtlasComplexityScene = ({ complexityReport }) => {
  const report = complexityReport || {
    estimatedTime: 'O(N log N)',
    estimatedSpace: 'O(N)',
    empiricalFormula: 'f(N) ≈ 2.10 · O(N log N)',
    rSquared: 0.98,
    reasoning: 'Empirical regression fit over N=[5, 10, 20, 40].',
    theoretical: {
      name: 'Merge Sort',
      bestTime: 'O(N log N)',
      avgTime: 'O(N log N)',
      worstTime: 'O(N log N)',
      space: 'O(N)',
      recurrence: 'T(N) = 2T(N/2) + O(N)',
      explanation: 'Recursively divides the array into 2 halves until sub-arrays have length 1, then merges sorted halves linearly in O(N) work per level.',
    },
    dataPoints: [
      { n: 5, ops: 15, memory: 5 },
      { n: 10, ops: 35, memory: 10 },
      { n: 20, ops: 85, memory: 20 },
      { n: 40, ops: 190, memory: 40 },
    ],
  }

  const theoretical = report.theoretical || {}
  const points = report.dataPoints || []
  const maxOps = Math.max(...points.map((p) => p.ops), 10)

  return (
    <div className="grid h-full grid-cols-1 gap-4 xl:grid-cols-[400px_minmax(0,1fr)] overflow-y-auto">
      {/* Left Column: Theoretical Complexity Breakdown */}
      <section className="atlas-surface flex flex-col justify-between p-4 space-y-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="rounded-lg border border-atlas-brand/40 bg-atlas-brand/15 p-2 text-atlas-brand">
              <BookOpen size={18} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-atlas-muted">Theoretical Complexity</p>
              <h3 className="text-base font-semibold text-atlas-text">{theoretical.name || 'Algorithm Analysis'}</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <MetricCard label="Best Case Time" value={theoretical.bestTime || report.estimatedTime} color="text-emerald-400" />
            <MetricCard label="Average Case Time" value={theoretical.avgTime || report.estimatedTime} color="text-atlas-brand" />
            <MetricCard label="Worst Case Time" value={theoretical.worstTime || report.estimatedTime} color="text-amber-400" />
            <MetricCard label="Auxiliary Space" value={theoretical.space || report.estimatedSpace} color="text-purple-400" />
          </div>

          {theoretical.recurrence && (
            <div className="mt-3 rounded-xl border border-atlas-brand/30 bg-atlas-brand/10 p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-atlas-brand mb-1">
                <Zap size={14} />
                <span>Recurrence Relation</span>
              </div>
              <p className="font-mono text-sm font-bold text-atlas-text">{theoretical.recurrence}</p>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-atlas-muted/25 bg-atlas-bg0/70 p-3 text-xs leading-relaxed text-atlas-muted font-mono">
          <p className="font-semibold text-atlas-text mb-1.5 flex items-center gap-1.5">
            <Layers size={14} className="text-atlas-brand" />
            Theoretical Explanation:
          </p>
          {theoretical.explanation || report.reasoning}
        </div>
      </section>

      {/* Right Column: Empirical Big-O Regression Plot */}
      <section className="atlas-surface flex flex-col p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-atlas-text font-semibold text-sm">
            <TrendingUp size={16} className="text-atlas-brand" />
            <span>Empirical Big-O Scaling Plot (Ops vs N)</span>
          </div>
          <span className="rounded-md border border-atlas-muted/30 bg-atlas-bg0/60 px-2.5 py-1 text-xs text-atlas-brand font-mono font-semibold">
            R² = {((report.rSquared || 0.98) * 100).toFixed(1)}% Fit
          </span>
        </div>

        <div className="atlas-elevated relative flex flex-1 flex-col items-center justify-center p-6 min-h-[220px]">
          <svg viewBox="0 0 400 200" className="h-64 w-full overflow-visible">
            {/* Grid Lines */}
            <line x1="40" y1="20" x2="40" y2="170" stroke="rgba(143,124,255,0.2)" strokeWidth="1" />
            <line x1="40" y1="170" x2="380" y2="170" stroke="rgba(143,124,255,0.2)" strokeWidth="1" />

            {/* Regression Curve */}
            {points.length > 1 && (
              <path
                d={points
                  .map((p, idx) => {
                    const x = 40 + (idx / (points.length - 1)) * 320
                    const y = 170 - (p.ops / maxOps) * 140
                    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`
                  })
                  .join(' ')}
                fill="none"
                stroke="rgba(76,125,255,0.9)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            )}

            {/* Data Points */}
            {points.map((p, idx) => {
              const x = 40 + (idx / (points.length - 1)) * 320
              const y = 170 - (p.ops / maxOps) * 140
              return (
                <g key={`pt-${p.n}`}>
                  <circle cx={x} cy={y} r="5" className="fill-atlas-brand stroke-atlas-bg0" strokeWidth="2" />
                  <text x={x} y={y - 10} textAnchor="middle" className="fill-atlas-text text-[10px] font-mono font-semibold">
                    {p.ops} ops
                  </text>
                  <text x={x} y="188" textAnchor="middle" className="fill-atlas-muted text-[10px] font-mono">
                    N={p.n}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-atlas-muted font-mono">
          <span>Formula: {report.empiricalFormula || 'f(N) ≈ O(N)'}</span>
          <span>X: Input Size N | Y: Operations</span>
        </div>
      </section>
    </div>
  )
}

export default AtlasComplexityScene
