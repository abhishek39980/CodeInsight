import { motion } from 'framer-motion'
import { motionTokens } from '../../atlas/motion'

const QueueColumn = ({ title, tasks, tone }) => (
  <div className="rounded-2xl border border-atlas-muted/30 bg-atlas-surface/65 p-3">
    <div className="mb-2 flex items-center justify-between">
      <p className="text-xs font-medium text-atlas-text">{title}</p>
      <span className="text-[11px] text-atlas-muted">{tasks.length}</span>
    </div>
    <div className="space-y-1.5">
      {tasks.length ? (
        tasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={motionTokens.microSpring}
            className={`rounded-lg border px-2.5 py-2 text-xs ${tone}`}
          >
            <p className="font-mono text-atlas-text">{task.label}</p>
            <p className="mt-0.5 text-[10px] text-atlas-muted">{task.kind}</p>
          </motion.div>
        ))
      ) : (
        <p className="rounded-lg border border-dashed border-atlas-muted/25 px-2 py-3 text-[11px] text-atlas-muted">Empty</p>
      )}
    </div>
  </div>
)

const AtlasEventLoopScene = ({ currentStep }) => {
  const eventLoop = currentStep?.eventLoop || {
    webApis: [],
    microtaskQueue: [],
    macrotaskQueue: [],
    activeTask: null,
    transitions: [],
  }

  const transitions = (eventLoop.transitions || []).slice(-8).reverse()

  return (
    <div className="grid h-full grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="atlas-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">JavaScript Event Loop Visualizer</h3>
            <p className="text-xs text-atlas-muted">Call stack handoff, Web API timers, and microtask priority simulation</p>
          </div>
          <span className="rounded-full border border-atlas-loop/40 bg-atlas-loop/15 px-3 py-1 text-xs text-atlas-text">
            Priority: Microtasks &gt; Macrotasks
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <QueueColumn title="Web APIs / Timer Zone" tasks={eventLoop.webApis || []} tone="border-atlas-muted/25 bg-atlas-bg0/40" />
          <QueueColumn title="Call Stack Task" tasks={eventLoop.activeTask ? [eventLoop.activeTask] : []} tone="border-atlas-call/35 bg-atlas-call/10" />
          <QueueColumn title="Microtask Queue" tasks={eventLoop.microtaskQueue || []} tone="border-atlas-brand/35 bg-atlas-brand/10" />
          <QueueColumn title="Macrotask Queue" tasks={eventLoop.macrotaskQueue || []} tone="border-atlas-ember/35 bg-atlas-ember/10" />
        </div>
      </section>

      <aside className="atlas-surface p-3">
        <h4 className="mb-2 text-sm font-semibold">Task Movement</h4>
        <div className="atlas-scrollbar h-[560px] space-y-2 overflow-auto pr-1">
          {transitions.length ? (
            transitions.map((transition) => (
              <motion.div
                key={transition.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-xl border border-atlas-muted/25 bg-atlas-surface/70 px-3 py-2 text-xs"
              >
                <p className="text-atlas-text">{transition.label}</p>
                <p className="mt-1 text-atlas-muted">
                  {transition.from} ? {transition.to}
                </p>
                {transition.reason ? <p className="mt-1 text-[10px] text-atlas-muted">{transition.reason}</p> : null}
              </motion.div>
            ))
          ) : (
            <p className="rounded-xl border border-dashed border-atlas-muted/35 px-3 py-4 text-xs text-atlas-muted">
              Async transitions appear as you step through setTimeout, Promise, and async/await flows.
            </p>
          )}
        </div>
      </aside>
    </div>
  )
}

export default AtlasEventLoopScene
