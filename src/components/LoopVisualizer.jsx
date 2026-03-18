import Panel from './Panel'

const LoopVisualizer = ({ loopMeta }) => {
  return (
    <Panel title="Loop Visualizer" subtitle="Iteration and condition flow">
      {loopMeta ? (
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
            <span className="text-zinc-400">Type</span>
            <span className="text-zinc-200">{loopMeta.loopType || 'loop'}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
            <span className="text-zinc-400">Iteration</span>
            <span className="font-mono text-zinc-100">{loopMeta.iteration ?? 0}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
            <span className="text-zinc-400">Condition</span>
            <span className={loopMeta.condition ? 'text-emerald-300' : 'text-rose-300'}>{String(loopMeta.condition)}</span>
          </div>
          {loopMeta.loopVariable ? (
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
              <span className="text-zinc-400">{loopMeta.loopVariable}</span>
              <span className="font-mono text-zinc-100">{String(loopMeta.loopValue)}</span>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-white/10 px-3 py-4 text-xs text-zinc-500">No active loop in this step.</p>
      )}
    </Panel>
  )
}

export default LoopVisualizer
