import { useState, useMemo } from 'react'
import { Search, ArrowRight, Compass, Bookmark, BookmarkCheck, CheckCircle2, ChevronRight } from 'lucide-react'
import Fuse from 'fuse.js'
import { dsaCategories, dsaProblems } from '../../engine/dsaProblems'
import { useProgressStore, getDailyChallengeId } from '../../store/useProgressStore'
import { cn } from '../../utils/cn'

const fuse = new Fuse(dsaProblems, {
  keys: ['title', 'tags', 'problemStatement.description', 'category'],
  threshold: 0.35,
  includeScore: true,
})

const DIFFICULTY_COLOR = {
  Easy:   'text-emerald-400',
  Medium: 'text-amber-400',
  Hard:   'text-rose-400',
}

export default function DSACatalogHome({ onSelectProblem, onViewRoadmap }) {
  const [searchQuery, setSearchQuery]           = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const { problemStatus, bookmarks, toggleBookmark, getSolvedCount } = useProgressStore()
  const solved = getSolvedCount()

  const dailyId = useMemo(() => getDailyChallengeId(dsaProblems), [])

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
    <div className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8 space-y-10">

      {/* Hero */}
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-atlas-text">
          Learn algorithms<br />through visualization
        </h1>
        <p className="text-base text-atlas-muted leading-relaxed">
          Step through data structures interactively. Understand the why behind every approach — from brute force to optimal.
        </p>
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={onViewRoadmap}
            className="inline-flex items-center gap-2 rounded-lg bg-atlas-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-atlas-brand/90"
          >
            <Compass size={14} />
            Topic Roadmap
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-atlas-muted" />
        <input
          id="catalog-search"
          type="text"
          placeholder="Search problems…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-atlas-muted/20 bg-atlas-surface pl-9 pr-4 py-2.5 text-sm text-atlas-text placeholder-atlas-muted outline-none transition focus:border-atlas-muted/40"
        />
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-widest text-atlas-muted font-semibold">Filter by pattern</p>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-medium transition border',
              selectedCategory === 'all'
                ? 'border-atlas-muted/40 bg-atlas-elev text-atlas-text'
                : 'border-transparent text-atlas-muted hover:text-atlas-text'
            )}
          >
            All
          </button>
          {dsaCategories.map(cat => {
            const total    = dsaProblems.filter(p => p.category === cat.id).length
            const catSolved = dsaProblems.filter(p => p.category === cat.id && problemStatus[p.id] === 'solved').length
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition border',
                  selectedCategory === cat.id
                    ? 'border-atlas-muted/40 bg-atlas-elev text-atlas-text'
                    : 'border-transparent text-atlas-muted hover:text-atlas-text'
                )}
              >
                {cat.label}
                {catSolved > 0 && (
                  <span className="ml-1.5 text-atlas-muted/60">{catSolved}/{total}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Problem count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-atlas-muted">
          {filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''}
          {selectedCategory !== 'all' && ` in ${dsaCategories.find(c => c.id === selectedCategory)?.label}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
        {(searchQuery || selectedCategory !== 'all') && (
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all') }}
            className="text-xs text-atlas-muted hover:text-atlas-text transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* Problem Grid */}
      {filteredProblems.length === 0 ? (
        <div className="py-16 text-center text-atlas-muted text-sm">
          No problems match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-atlas-muted/10 border border-atlas-muted/10 rounded-xl overflow-hidden">
          {filteredProblems.map(problem => {
            const cat         = dsaCategories.find(c => c.id === problem.category)
            const status      = problemStatus[problem.id]
            const isBookmarked = Boolean(bookmarks[problem.id])
            const isSolved    = status === 'solved'
            const isInProgress = status === 'in_progress'
            const isDaily     = problem.id === dailyId

            return (
              <div
                key={problem.id}
                onClick={() => onSelectProblem(problem.id)}
                className="group relative flex flex-col bg-atlas-bg0 p-5 cursor-pointer hover:bg-atlas-surface/60 transition"
              >
                {/* Top row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-[11px] text-atlas-muted">
                    <span>{cat?.label ?? problem.category}</span>
                    {isDaily && <span className="text-atlas-brand/70">· Today</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    {isSolved && <CheckCircle2 size={13} className="text-emerald-500" />}
                    {isInProgress && !isSolved && (
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400/80" />
                    )}
                    <span className={cn('text-[11px] font-medium', DIFFICULTY_COLOR[problem.difficulty])}>
                      {problem.difficulty}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-atlas-text group-hover:text-white transition leading-snug">
                  {problem.title}
                </h3>

                {/* Description */}
                <p className="mt-1.5 text-xs text-atlas-muted line-clamp-2 leading-relaxed flex-1">
                  {problem.problemStatement.description}
                </p>

                {/* Bottom row */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-1.5 flex-wrap">
                    {problem.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] font-mono text-atlas-muted/60">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={e => { e.stopPropagation(); toggleBookmark(problem.id) }}
                      className={cn(
                        'p-1 rounded transition opacity-0 group-hover:opacity-100',
                        isBookmarked && 'opacity-100 text-atlas-text',
                        !isBookmarked && 'text-atlas-muted hover:text-atlas-text'
                      )}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                    >
                      {isBookmarked ? <BookmarkCheck size={12} /> : <Bookmark size={12} />}
                    </button>
                    <ChevronRight size={13} className="text-atlas-muted/40 group-hover:text-atlas-muted transition" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
