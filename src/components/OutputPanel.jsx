import { motion } from 'framer-motion'
import Panel from './Panel'

const OutputPanel = ({ outputs = [], error }) => {
  return (
    <Panel title="Output" subtitle="Console capture">
      <div className="terminal-panel max-h-[180px] space-y-1 overflow-auto rounded-xl border border-white/10 bg-[#050608] px-3 py-3 font-mono text-xs">
        {error ? (
          <motion.p
            className="text-rose-300"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
          >
            error: {error}
          </motion.p>
        ) : null}

        {outputs.length === 0 ? (
          <p className="text-zinc-500">No logs yet.</p>
        ) : (
          outputs.map((line, index) => (
            <motion.p
              key={`${line}-${index}`}
              className="text-zinc-200"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="mr-2 text-zinc-500">{index + 1}</span>
              {line}
            </motion.p>
          ))
        )}
      </div>
    </Panel>
  )
}

export default OutputPanel

