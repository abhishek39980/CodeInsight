import Editor from '@monaco-editor/react'
import Panel from './Panel'

const CompareModePanel = ({
  enabled,
  onToggle,
  leftSummary,
  rightSummary,
  leftOutput,
  rightOutput,
  rightCode,
  onCodeChange,
  onRun,
}) => {
  return (
    <Panel
      title="Compare Two Executions"
      subtitle="Behavioral diff between two snippets"
      rightSlot={
        <button
          type="button"
          onClick={onToggle}
          className="rounded-lg border border-white/10 px-2 py-1 text-[10px] tracking-[0.1em] text-zinc-300 transition hover:bg-white/[0.06]"
        >
          {enabled ? 'DISABLE' : 'ENABLE'}
        </button>
      }
      accent
    >
      {!enabled ? (
        <p className="rounded-xl border border-dashed border-white/10 px-3 py-4 text-xs text-zinc-500">Enable compare mode to evaluate two execution traces side by side.</p>
      ) : (
        <div className="space-y-3 text-xs">
          <div className="overflow-hidden rounded-xl border border-white/10">
            <Editor
              language="javascript"
              value={rightCode}
              height="180px"
              onChange={(value) => onCodeChange(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                lineHeight: 22,
                scrollBeyondLastLine: false,
              }}
              theme="vs-dark"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onRun}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-[11px] tracking-[0.1em] text-zinc-300 transition hover:bg-white/[0.06]"
            >
              Run Compare
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <p className="mb-2 text-zinc-300">Primary</p>
              <p className="text-zinc-500">Steps: {leftSummary.totalExecutionSteps}</p>
              <p className="text-zinc-500">Calls: {leftSummary.functionCallCount}</p>
              <p className="text-zinc-500">Peak Stack: {leftSummary.peakStackDepth}</p>
              <p className="text-zinc-500">Output: {leftOutput.join(' | ') || 'none'}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <p className="mb-2 text-zinc-300">Comparison</p>
              <p className="text-zinc-500">Steps: {rightSummary.totalExecutionSteps}</p>
              <p className="text-zinc-500">Calls: {rightSummary.functionCallCount}</p>
              <p className="text-zinc-500">Peak Stack: {rightSummary.peakStackDepth}</p>
              <p className="text-zinc-500">Output: {rightOutput.join(' | ') || 'none'}</p>
            </div>
          </div>
        </div>
      )}
    </Panel>
  )
}

export default CompareModePanel
