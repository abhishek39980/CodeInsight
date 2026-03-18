import Panel from './Panel'

const toPoints = (values, width, height, maxValue) => {
  if (values.length === 1) {
    const y = height - (values[0] / (maxValue || 1)) * height
    return `0,${y} ${width},${y}`
  }

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width
      const y = height - (value / (maxValue || 1)) * height
      return `${x},${y}`
    })
    .join(' ')
}

const ValueTrendPanel = ({ trends }) => {
  return (
    <Panel title="Value Trends" subtitle="Numeric variable trajectories" className="h-full">
      <div className="space-y-2">
        {trends.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/10 px-3 py-4 text-xs text-zinc-500">
            No numeric series yet.
          </p>
        ) : (
          trends.map((trend) => {
            const width = 220
            const height = 50
            const maxValue = Math.max(...trend.values.map((item) => Math.abs(item))) || 1
            const normalized = trend.values.map((value) => Math.abs(value))
            const points = toPoints(normalized, width, height, maxValue)

            return (
              <div key={trend.id} className="rounded-lg border border-white/10 bg-white/[0.02] p-2">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-zinc-300">{trend.label}</span>
                  <span className="font-mono text-zinc-500">{trend.latest}</span>
                </div>
                <svg viewBox={`0 0 ${width} ${height}`} className="h-12 w-full">
                  <polyline points={points} fill="none" stroke="rgba(96,165,250,0.75)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
              </div>
            )
          })
        )}
      </div>
    </Panel>
  )
}

export default ValueTrendPanel

