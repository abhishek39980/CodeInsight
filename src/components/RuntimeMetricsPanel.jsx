import Panel from './Panel'

const RuntimeMetricsPanel = ({ metrics }) => {
  const entries = [
    ['Total Steps', metrics.totalExecutionSteps],
    ['Function Calls', metrics.functionCallCount],
    ['Recursion Depth', metrics.recursionDepth],
    ['Loop Iterations', metrics.loopIterations],
    ['Peak Stack', metrics.peakStackDepth],
    ['Heap Objects', metrics.heapObjectCount],
    ['Output Count', metrics.outputCount],
    ['Hot Lines', metrics.hotLineCount],
    ['Complexity', metrics.estimatedComplexity],
  ]

  return (
    <Panel title="Runtime Metrics" subtitle="Execution profile and heuristic complexity" accent>
      <div className="grid grid-cols-2 gap-2">
        {entries.map(([label, value]) => (
          <div key={label} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-500">{label}</p>
            <p className="mt-1 text-lg font-medium text-zinc-100">{value}</p>
          </div>
        ))}
      </div>
    </Panel>
  )
}

export default RuntimeMetricsPanel
