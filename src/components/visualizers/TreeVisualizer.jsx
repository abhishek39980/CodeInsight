const TreeVisualizer = ({ node }) => {
  const pick = (key) => node.entries.find((entry) => entry.key === key)?.label || 'null'

  return (
    <div className="rounded-xl border border-white/10 bg-[#07090d] p-4">
      <div className="grid place-items-center gap-4">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-200">value: {pick('value')}</div>
        <div className="flex items-center gap-8">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-300">left: {pick('left')}</div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-300">right: {pick('right')}</div>
        </div>
      </div>
    </div>
  )
}

export default TreeVisualizer
