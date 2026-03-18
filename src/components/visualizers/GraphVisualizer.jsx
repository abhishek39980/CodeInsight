const GraphVisualizer = ({ node }) => {
  return (
    <div className="rounded-xl border border-white/10 bg-[#07090d] p-3">
      <svg viewBox="0 0 280 150" className="h-40 w-full">
        <circle cx="55" cy="70" r="18" fill="rgba(96,165,250,0.25)" stroke="rgba(147,197,253,0.8)" />
        <circle cx="140" cy="35" r="16" fill="rgba(96,165,250,0.18)" stroke="rgba(147,197,253,0.75)" />
        <circle cx="215" cy="72" r="16" fill="rgba(96,165,250,0.18)" stroke="rgba(147,197,253,0.75)" />
        <circle cx="145" cy="115" r="16" fill="rgba(96,165,250,0.18)" stroke="rgba(147,197,253,0.75)" />
        <line x1="72" y1="62" x2="126" y2="43" stroke="rgba(148,163,184,0.6)" />
        <line x1="157" y1="43" x2="199" y2="61" stroke="rgba(148,163,184,0.6)" />
        <line x1="202" y1="84" x2="160" y2="105" stroke="rgba(148,163,184,0.6)" />
        <line x1="127" y1="104" x2="69" y2="79" stroke="rgba(148,163,184,0.6)" />
      </svg>
      <p className="text-xs text-zinc-500">Detected graph-like adjacency structure in #{node.id}.</p>
    </div>
  )
}

export default GraphVisualizer
