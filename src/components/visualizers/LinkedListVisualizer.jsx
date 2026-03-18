import { motion } from 'framer-motion'

const LinkedListVisualizer = ({ node }) => {
  const sequence = node.entries.filter((entry) => entry.key === 'value' || entry.key === 'next')

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#07090d] p-3">
      <div className="flex min-w-max items-center gap-2">
        {sequence.map((entry, index) => (
          <motion.div key={`${node.id}-${entry.key}-${index}`} className="flex items-center gap-2" layout>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-2 text-xs">
              <p className="text-zinc-500">{entry.key}</p>
              <p className="font-mono text-zinc-200">{entry.label}</p>
            </div>
            {index < sequence.length - 1 ? <span className="text-zinc-500">{'->'}</span> : null}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default LinkedListVisualizer
