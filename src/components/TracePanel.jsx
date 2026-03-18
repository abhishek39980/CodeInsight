import { motion } from 'framer-motion'
import Panel from './Panel'

const TracePanel = ({ trace = [], currentEvent }) => {
  const recent = trace.slice(-8).reverse()

  return (
    <Panel title="Execution Timeline" subtitle="Recent runtime events">
      <div className="space-y-2">
        <div className="rounded-xl border border-sky-300/20 bg-sky-500/10 px-3 py-2 text-xs text-sky-100/90">
          {currentEvent || 'No active event'}
        </div>

        <div className="max-h-48 space-y-1 overflow-auto pr-1">
          {recent.length === 0 ? (
            <p className="text-xs text-zinc-500">Run code to generate a trace.</p>
          ) : (
            recent.map((entry, idx) => (
              <motion.div
                key={`${entry}-${idx}`}
                className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-zinc-300"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {entry}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </Panel>
  )
}

export default TracePanel

