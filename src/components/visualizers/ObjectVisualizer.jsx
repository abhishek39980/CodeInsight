const ObjectVisualizer = ({ node }) => {
  return (
    <div className="space-y-1 rounded-xl border border-white/10 bg-[#07090d] p-3">
      {node.entries.map((entry) => (
        <div key={`${node.id}-${entry.key}`} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5 text-xs">
          <span className="text-zinc-400">{entry.key}</span>
          <span className="font-mono text-zinc-200">{entry.label}</span>
        </div>
      ))}
    </div>
  )
}

export default ObjectVisualizer
