import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, FlaskConical, ArrowRight, Tag } from 'lucide-react'
import { TECHNOLOGY_DOMAINS, TECHNOLOGY_LABS } from '../data/technologyRegistry'
import { cn } from '../utils/cn'

export default function LabsHubView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('all')

  const filteredLabs = useMemo(() => {
    return TECHNOLOGY_LABS.filter(lab => {
      const matchDomain = selectedDomain === 'all' || lab.domainId === selectedDomain
      const q = searchQuery.toLowerCase().trim()
      const matchSearch =
        !q ||
        lab.title.toLowerCase().includes(q) ||
        lab.summary.toLowerCase().includes(q) ||
        lab.tags.some(t => t.toLowerCase().includes(q))
      return matchDomain && matchSearch
    })
  }, [searchQuery, selectedDomain])

  return (
    <div className="mx-auto max-w-[1580px] px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-atlas-brand">
          <FlaskConical size={16} />
          <span>Interactive Technology Laboratories</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-atlas-text">
          Explore Individual System Simulations
        </h1>
        <p className="text-sm text-atlas-muted leading-relaxed">
          Hands-on laboratories simulating core computer science, networking, distributed systems, database indexing, and operating system mechanics.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative max-w-md w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-atlas-muted" />
          <input
            type="text"
            placeholder="Search interactive labs (e.g. TCP, B-Tree, Neural Net, LRU)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-atlas-muted/20 bg-atlas-surface pl-9 pr-4 py-2.5 text-xs text-atlas-text placeholder-atlas-muted/60 focus:outline-none focus:border-atlas-brand transition"
          />
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setSelectedDomain('all')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition border',
              selectedDomain === 'all'
                ? 'bg-atlas-brand text-white border-atlas-brand'
                : 'bg-atlas-surface text-atlas-muted border-atlas-muted/20 hover:text-atlas-text'
            )}
          >
            All Domains ({TECHNOLOGY_LABS.length})
          </button>
          {TECHNOLOGY_DOMAINS.map(d => {
            const count = TECHNOLOGY_LABS.filter(l => l.domainId === d.id).length
            if (count === 0) return null
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDomain(d.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition border flex items-center gap-1.5',
                  selectedDomain === d.id
                    ? 'bg-atlas-elev text-atlas-text border-atlas-brand ring-1 ring-atlas-brand'
                    : 'bg-atlas-surface text-atlas-muted border-atlas-muted/20 hover:text-atlas-text'
                )}
              >
                <span>{d.icon}</span>
                <span>{d.name.split('&')[0].trim()}</span>
                <span className="text-[10px] text-atlas-muted/60">({count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLabs.map(lab => {
          const domain = TECHNOLOGY_DOMAINS.find(d => d.id === lab.domainId)
          return (
            <Link
              key={lab.id}
              to={`/labs/${lab.id}`}
              className="group rounded-3xl border border-atlas-muted/20 bg-atlas-surface/80 p-5 space-y-4 hover:border-atlas-brand hover:bg-atlas-elev transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-atlas-brand bg-atlas-brand/10 border border-atlas-brand/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <span>{domain?.icon}</span>
                    <span>{domain?.name.split('&')[0].trim()}</span>
                  </span>
                  <span className={cn(
                    'text-[10px] font-mono font-semibold px-2 py-0.5 rounded',
                    lab.level === 'Beginner' ? 'bg-emerald-500/15 text-emerald-300' :
                    lab.level === 'Advanced' ? 'bg-rose-500/15 text-rose-300' :
                    'bg-amber-500/15 text-amber-300'
                  )}>
                    {lab.level}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-atlas-text group-hover:text-atlas-brand transition">
                    {lab.title}
                  </h3>
                  <p className="text-xs text-atlas-muted mt-1 leading-relaxed line-clamp-2">
                    {lab.summary}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {lab.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] font-mono text-atlas-muted/70 bg-atlas-bg0 px-2 py-0.5 rounded border border-atlas-muted/10">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-atlas-muted/15 font-semibold text-xs text-atlas-text group-hover:text-atlas-brand">
                <span>Launch Laboratory</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
