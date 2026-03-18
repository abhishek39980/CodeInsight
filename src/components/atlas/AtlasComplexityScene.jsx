const toPoints = (series, width, height) => {
  if (!series.length) {
    return ''
  }

  const max = Math.max(...series.map((item) => item.value), 1)

  return series
    .map((item, index) => {
      const x = series.length === 1 ? width / 2 : (index / (series.length - 1)) * width
      const y = height - (item.value / max) * height
      return `${x},${y}`
    })
    .join(' ')
}

const MetricCard = ({ label, value }) => (
  <div className="rounded-xl border border-atlas-muted/25 bg-atlas-surface/70 px-3 py-2">
    <p className="text-[11px] uppercase tracking-[0.12em] text-atlas-muted">{label}</p>
    <p className="mt-1 text-sm font-semibold text-atlas-text">{value}</p>
  </div>
)

const AtlasComplexityScene = ({ complexityReport }) => {
  const report = complexityReport || {
    estimatedTime: 'O(1)',
    estimatedSpace: 'O(1)',
    confidence: 'Low',
    reasoning: 'Run code to compute complexity estimates.',
    graphs: {
      operationsVsSteps: [],
      memoryVsSteps: [],
    },
  }

  const opSeries = report.graphs?.operationsVsSteps || []
  const memSeries = report.graphs?.memoryVsSteps || []

  return (
    <div className="grid h-full grid-cols-1 gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
      <section className="atlas-surface p-3">
        <h3 className="mb-3 text-sm font-semibold">Complexity Analyzer</h3>
        <div className="space-y-2">
          <MetricCard label="Estimated Time" value={report.estimatedTime} />
          <MetricCard label="Estimated Space" value={report.estimatedSpace} />
          <MetricCard label="Confidence" value={report.confidence} />
        </div>

        <div className="mt-3 rounded-xl border border-atlas-muted/25 bg-atlas-surface/70 p-3 text-xs text-atlas-muted">
          {report.reasoning}
        </div>
      </section>

      <section className="atlas-surface p-3">
        <h3 className="mb-2 text-sm font-semibold">Operations and Memory Trends</h3>
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="rounded-xl border border-atlas-muted/25 bg-atlas-surface/70 p-3">
            <p className="mb-2 text-xs text-atlas-muted">Operations vs Steps</p>
            <svg viewBox="0 0 260 150" className="h-40 w-full">
              <polyline
                points={toPoints(opSeries, 260, 150)}
                fill="none"
                stroke="rgba(76,125,255,0.95)"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="rounded-xl border border-atlas-muted/25 bg-atlas-surface/70 p-3">
            <p className="mb-2 text-xs text-atlas-muted">Memory Usage vs Steps</p>
            <svg viewBox="0 0 260 150" className="h-40 w-full">
              <polyline
                points={toPoints(memSeries, 260, 150)}
                fill="none"
                stroke="rgba(255,122,69,0.95)"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AtlasComplexityScene
