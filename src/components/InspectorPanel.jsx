import Panel from './Panel'

const InspectorPanel = ({ selection, context, onClear }) => {
  return (
    <Panel
      title="Context Inspector"
      subtitle="Why is this happening?"
      rightSlot={
        <button
          type="button"
          onClick={onClear}
          className="rounded-lg border border-white/10 px-2 py-1 text-[10px] text-zinc-400 transition hover:bg-white/[0.06]"
        >
          CLEAR
        </button>
      }
    >
      {selection ? (
        <div className="space-y-2 text-xs">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-zinc-300">Selected: {selection.label}</div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-zinc-400">Reason: {context?.reason || 'No reasoning available.'}</div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-zinc-400">Last modified at step: {context?.stepId ?? 'N/A'} line {context?.line ?? 'N/A'}</div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-zinc-400">Event: {context?.event || 'N/A'}</div>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-white/10 px-3 py-4 text-xs text-zinc-500">Click a variable, frame or heap node to inspect its origin.</p>
      )}
    </Panel>
  )
}

export default InspectorPanel
