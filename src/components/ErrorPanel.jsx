import Panel from './Panel'

const ErrorPanel = ({ error, failingStep }) => {
  return (
    <Panel title="Error Visualization" subtitle="Failure context and last valid state">
      {error ? (
        <div className="space-y-2 text-xs">
          <div className="rounded-lg border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-rose-200">{error}</div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-zinc-400">Failing line: {failingStep?.line || 'N/A'}</div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-zinc-400">Event: {failingStep?.event || 'N/A'}</div>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-white/10 px-3 py-4 text-xs text-zinc-500">No runtime errors in current execution.</p>
      )}
    </Panel>
  )
}

export default ErrorPanel
