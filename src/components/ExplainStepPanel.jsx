import Panel from './Panel'

const ExplainStepPanel = ({ step }) => {
  return (
    <Panel title="Explain This Step" subtitle="Deterministic runtime explanation" accent>
      <div className="rounded-xl border border-sky-300/20 bg-sky-400/10 px-3 py-3 text-sm leading-relaxed text-zinc-200">
        {step?.explanation || 'Select or run a step to see what happened.'}
      </div>
      <p className="mt-2 text-xs text-zinc-500">Event: {step?.event || 'N/A'}</p>
    </Panel>
  )
}

export default ExplainStepPanel
