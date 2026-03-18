import { motion } from 'framer-motion'

const ArrayVisualizer = ({ node }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#07090d] p-3">
      <div className="flex min-w-max gap-2">
        {node.entries.map((entry) => (
          <motion.div
            key={`${node.id}-${entry.key}`}
            layout
            className="min-w-16 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-2 text-center"
          >
            <p className="text-[10px] text-zinc-500">{entry.key}</p>
            <p className="mt-1 font-mono text-xs text-zinc-200">{entry.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ArrayVisualizer
