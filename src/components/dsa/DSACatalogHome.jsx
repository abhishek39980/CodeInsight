import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Sparkles, BookOpen, ArrowRight, CheckCircle2, ChevronRight, Compass } from 'lucide-react'
import { dsaCategories, dsaProblems } from '../../engine/dsaProblems'
import { cn } from '../../utils/cn'

export default function DSACatalogHome({ onSelectProblem, onViewRoadmap }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredProblems = dsaProblems.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      !query ||
      p.title.toLowerCase().includes(query) ||
      p.tags.some((t) => t.toLowerCase().includes(query)) ||
      p.problemStatement.description.toLowerCase().includes(query)
    return matchesCat && matchesSearch
  })

  return (
    <div className="mx-auto max-w-[1520px] px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-atlas-brand/30 bg-gradient-to-br from-atlas-surface/90 via-atlas-elev to-atlas-surface p-8 shadow-2xl backdrop-blur-md lg:p-12">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-atlas-brand/40 bg-atlas-brand/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-atlas-text">
            <Sparkles size={14} className="text-atlas-brand" />
            <span>Interactive DSA Learning Platform</span>
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
            Master Data Structures & <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Algorithms</span> Visually
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-atlas-muted">
            Understand <strong className="text-atlas-text">how</strong> an algorithm works, <strong className="text-atlas-text">why</strong> it works, where time & space complexity come from, and how to optimize from brute force to the optimal solution.
          </p>

          <div className="pt-2">
            <button
              onClick={onViewRoadmap}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:scale-105"
            >
              <Compass size={18} />
              <span>Explore 120+ Topic Interview Roadmap (221 Topics)</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-atlas-muted" />
          <input
            type="text"
            placeholder="Search problems by name, tag, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-atlas-muted/30 bg-atlas-surface/80 pl-10 pr-4 py-3 text-sm text-atlas-text placeholder-atlas-muted outline-none transition focus:border-atlas-brand/60 focus:bg-atlas-elev"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-atlas-muted">
          <span>Viewing <strong className="text-atlas-text font-mono">{filteredProblems.length}</strong> canonical problems across <strong className="text-atlas-text font-mono">{dsaCategories.length}</strong> categories</span>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-atlas-muted mb-3">
          Explore by Algorithmic Pattern ({dsaCategories.length} Categories)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              'flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-xs font-medium transition',
              selectedCategory === 'all'
                ? 'border-atlas-brand bg-atlas-brand/20 text-atlas-text shadow-md'
                : 'border-atlas-muted/20 bg-atlas-surface/60 text-atlas-muted hover:border-atlas-muted/40 hover:bg-atlas-elev hover:text-atlas-text'
            )}
          >
            <span className="text-base">🌟</span>
            <span className="truncate">All Categories</span>
          </button>
          {dsaCategories.map((cat) => {
            const count = dsaProblems.filter((p) => p.category === cat.id).length
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-xs font-medium transition',
                  selectedCategory === cat.id
                    ? 'border-atlas-brand bg-atlas-brand/20 text-atlas-text shadow-md'
                    : 'border-atlas-muted/20 bg-atlas-surface/60 text-atlas-muted hover:border-atlas-muted/40 hover:bg-atlas-elev hover:text-atlas-text'
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-base">{cat.icon}</span>
                  <span className="truncate">{cat.label}</span>
                </div>
                {count > 0 && (
                  <span className="ml-1.5 rounded-full bg-atlas-brand/30 px-1.5 py-0.5 text-[10px] font-mono text-atlas-text">
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Problems List */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-atlas-text mb-4">
          {selectedCategory === 'all'
            ? 'All Interactive Problems'
            : `${dsaCategories.find((c) => c.id === selectedCategory)?.label || ''} Problems`}
        </h2>

        {filteredProblems.length === 0 ? (
          <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-surface/50 p-12 text-center text-atlas-muted">
            <p className="text-base">No problems matched your filter.</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-atlas-brand/40 bg-atlas-brand/20 px-4 py-2 text-xs font-medium text-atlas-text hover:bg-atlas-brand/30"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProblems.map((problem) => {
              const categoryObj = dsaCategories.find((c) => c.id === problem.category) || {}
              return (
                <motion.div
                  key={problem.id}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  onClick={() => onSelectProblem(problem.id)}
                  className="group relative flex flex-col justify-between rounded-2xl border border-atlas-muted/25 bg-gradient-to-b from-atlas-surface/90 to-atlas-surface p-6 transition hover:border-atlas-brand/50 hover:shadow-xl cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-atlas-muted">
                        <span>{categoryObj.icon || '📦'}</span>
                        <span>{categoryObj.label || problem.category}</span>
                      </span>
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                          problem.difficulty === 'Easy' && 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
                          problem.difficulty === 'Medium' && 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
                          problem.difficulty === 'Hard' && 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        )}
                      >
                        {problem.difficulty}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-atlas-text group-hover:text-cyan-300 transition">
                      {problem.title}
                    </h3>
                    <p className="mt-2 text-xs text-atlas-muted line-clamp-3 leading-relaxed">
                      {problem.problemStatement.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-atlas-muted/15 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {problem.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg bg-atlas-elev/80 px-2 py-0.5 text-[10px] font-mono text-atlas-muted"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-atlas-brand group-hover:translate-x-1 transition">
                      <span>Learn</span>
                      <ChevronRight size={14} />
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
