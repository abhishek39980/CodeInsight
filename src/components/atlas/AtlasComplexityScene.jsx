import { motion } from 'framer-motion'
import { Activity, TrendingUp, Cpu } from 'lucide-react'

const MetricCard = ({ label, value, subtext }) => (
  <div className="rounded-xl border border-atlas-muted/25 bg-atlas-surface/70 p-3">
    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-atlas-muted">{label}</p>
    <p className="mt-1 text-xl font-bold font-mono text-atlas-brand">{value}</p>
    {subtext && <p className="mt-0.5 text-[11px] text-atlas-muted font-mono">{subtext}</p>}
  </div>
)

const AtlasComplexityScene = ({ complexityReport }) => {
  const report = complexityReport || {
    estimatedTime: 'O(N)',
    estimatedSpace: 'O(1)',
    empiricalFormula: 'f(N) ≈ 2.10 · O(N)',
    rSquared: 0.98,
    reasoning: 'Empirical regression fit over N=[5, 10, 20, 40].',
    dataPoints: [
      { n: 5, ops: 10, memory: 5 },
      { n: 10, ops: 20, memory: 5 },
      { n: 20, ops: 40, memory: 5 },
      { n: 40, ops: 80, memory: 5 },
    ],
  }

  const points = report.dataPoints || []
  const maxOps = Math.max(...points.map((p) => p.ops), 10)

  return (
    <div className="grid h-full grid-cols-1 gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
      {/* Metrics Summary */}
      <section className="atlas-surface flex flex-col justify-between p-4">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-lg border border-atlas-brand/40 bg-atlas-brand/15 p-2 text-atlas-brand">
              <Cpu size={18} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-atlas-muted">Empirical Derivation</p>
              <h3 className="text-base font-semibold text-atlas-text">Big-O Regression Engine</h3>
            </div>
          </div>

          <div className="space-y-3">
            <MetricCard
              label="Empirical Time Complexity"
              value={report.estimatedTime}
              subtext={report.empiricalFormula}
            />
            <MetricCard
              label="Empirical Space Complexity"
              value={report.estimatedSpace}
            />
            <MetricCard
              label="Regression Correlation (R²)"
              value={`${((report.rSquared || 0.95) * 100).toFixed(1)}%`}
              subtext="Least-squares polynomial curve fit"
            />
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-atlas-muted/25 bg-atlas-bg0/60 p-3 text-xs leading-relaxed text-atlas-muted font-mono">
          <p className="font-semibold text-atlas-text mb-1">Empirical Analysis:</p>
          {report.reasoning}
        </div>
      </section>

      {/* Regression Chart */}
      <section className="atlas-surface flex flex-col p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-atlas-text font-semibold text-sm">
            <TrendingUp size={16} className="text-atlas-brand" />
            <span>Operation Scaling Plot (Ops vs Input Size N)</span>
          </div>
          <span className="text-xs text-atlas-muted font-mono">N = [5, 10, 20, 40]</span>
        </div>

        <div className="atlas-elevated relative flex flex-1 flex-col items-center justify-center p-6">
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
          <span>X-Axis: Scaled Input Size (N)</span>
          <span>Y-Axis: Atomic Runtime Operations</span>
        </div>
      </section>
    </div>
  )
}

export default AtlasComplexityScene
