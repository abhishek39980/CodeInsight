import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowRight, Brain, ChevronRight, Sparkles } from 'lucide-react'
import Fuse from 'fuse.js'
import { dsaCategories, dsaProblems } from '../engine/dsaProblems'
import { cn } from '../utils/cn'

const fuse = new Fuse(dsaProblems, {
  keys: ['title', 'tags', 'problemStatement.description', 'category'],
  threshold: 0.35,
  includeScore: true
})

export default function AlgorithmExplorerView() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredProblems = useMemo(() => {
    let list = dsaProblems
    if (searchQuery.trim()) {
      list = fuse.search(searchQuery).map(r => r.item)
    }
    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category === selectedCategory)
    }
    return list
  }, [searchQuery, selectedCategory])

  return (
    <div className="mx-auto max-w-[1580px] px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-atlas-brand">
          <Brain size={16} />
          <span>Computer Science & Algorithms</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-atlas-text">
          Interactive Algorithm & Complexity Explorer
        </h1>
        <p className="text-sm text-atlas-muted leading-relaxed">
          Explore over 100 core algorithms and data structures through interactive state step-scrubbing, time/space complexity derivations, and memory layout models.
        </p>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-atlas-muted" />
          <input
            type="text"
            placeholder="Search algorithms (e.g. Merge Sort, Dijkstra, Trie)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-atlas-muted/20 bg-atlas-surface pl-9 pr-4 py-2.5 text-xs text-atlas-text placeholder-atlas-muted/60 focus:outline-none focus:border-atlas-brand transition"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition border',
              selectedCategory === 'all'
                ? 'bg-atlas-brand text-white border-atlas-brand'
                : 'bg-atlas-surface text-atlas-muted border-atlas-muted/20 hover:text-atlas-text'
            )}
          >
            All Categories ({dsaProblems.length})
          </button>
          {dsaCategories.slice(0, 7).map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition border',
                selectedCategory === cat.name
                  ? 'bg-atlas-elev text-atlas-text border-atlas-brand ring-1 ring-atlas-brand'
                  : 'bg-atlas-surface text-atlas-muted border-atlas-muted/20 hover:text-atlas-text'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Problems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProblems.map(p => (
          <div
            key={p.id}
            onClick={() => navigate(`/problem/${p.id}`)}
            className="group rounded-2xl border border-atlas-muted/20 bg-atlas-surface/80 p-5 space-y-3 hover:border-atlas-brand hover:bg-atlas-elev transition-all cursor-pointer shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-atlas-muted uppercase">
                  {p.category}
                </span>
                <span className={cn(
                  'text-[10px] font-mono font-semibold px-2 py-0.5 rounded',
                  p.difficulty === 'Easy' ? 'bg-emerald-500/15 text-emerald-300' :
                  p.difficulty === 'Hard' ? 'bg-rose-500/15 text-rose-300' :
                  'bg-amber-500/15 text-amber-300'
                )}>
                  {p.difficulty}
                </span>
              </div>

              <h3 className="text-sm font-bold text-atlas-text group-hover:text-atlas-brand transition">
                {p.title}
              </h3>
              <p className="text-xs text-atlas-muted line-clamp-2 leading-relaxed">
                {p.problemStatement?.description || 'Interactive algorithm model.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-atlas-muted/15 font-mono text-[11px] text-atlas-muted group-hover:text-atlas-brand">
              <span>Time: {p.optimalSolution?.timeComplexity || 'O(N)'}</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
