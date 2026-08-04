import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Sparkles,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  PlayCircle,
  Trophy,
  Target,
  Zap,
  Filter,
  Layers,
  Flame,
  Star,
  Compass,
} from 'lucide-react'
import {
  dsaRoadmapCategories,
  dsaTopics,
  mustMasterPatterns,
  priorityOrder,
} from '../../engine/dsaTopicsRoadmap'
import { cn } from '../../utils/cn'

export default function DSARoadmapView({ onSelectProblem }) {
  const [activeTab, setActiveTab] = useState('topics') // 'topics' | 'patterns' | 'priority'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all')
  const [visualizerOnlyFilter, setVisualizerOnlyFilter] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState('complexity')

  // Search & filter logic across all 221 topics
  const filteredTopics = useMemo(() => {
    return dsaTopics.filter((topic) => {
      const matchesSearch =
        !searchQuery ||
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (topic.pattern && topic.pattern.toLowerCase().includes(searchQuery.toLowerCase())) ||
        topic.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategoryFilter === 'all' || topic.categoryId === selectedCategoryFilter

      const matchesVisualizer = !visualizerOnlyFilter || Boolean(topic.linkedProblemId)

      return matchesSearch && matchesCategory && matchesVisualizer
    })
  }, [searchQuery, selectedCategoryFilter, visualizerOnlyFilter])

  const interactiveTopicsCount = useMemo(() => {
    return dsaTopics.filter((t) => Boolean(t.linkedProblemId)).length
  }, [])

  const toggleCategoryExpand = (catId) => {
    setExpandedCategory((prev) => (prev === catId ? null : catId))
  }

  return (
    <div className="mx-auto max-w-[1520px] px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-atlas-surface/95 via-atlas-elev to-atlas-surface p-8 shadow-2xl backdrop-blur-md lg:p-12">
        <div className="absolute -right-16 -top-16 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -left-16 -bottom-16 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 space-y-6 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-300">
              <Sparkles size={14} className="text-cyan-400" />
              <span>Interview-Ready DSA Roadmap</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/40 bg-indigo-400/15 px-3 py-1.5 text-xs font-mono font-medium text-indigo-300">
              <Trophy size={13} />
              <span>FAANG / Top Tech Tier</span>
            </span>
          </div>

          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white leading-tight">
            Comprehensive <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">120+ Essential DSA Topics</span> & Interview Roadmap
          </h1>

          <p className="text-sm sm:text-base leading-relaxed text-atlas-muted max-w-3xl">
            Master all <strong className="text-atlas-text font-mono">221 enumerated topics</strong> across <strong className="text-atlas-text font-mono">18 core categories</strong>, <strong className="text-atlas-text font-mono">20 must-master problem-solving patterns</strong>, and priority preparation tiers for companies like Google, Meta, Amazon, Microsoft, Uber, Atlassian, and Adobe.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-bg0/60 p-4 backdrop-blur-sm">
              <div className="text-xs text-atlas-muted font-medium">Total Enumerated Topics</div>
              <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">221</div>
            </div>
            <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-bg0/60 p-4 backdrop-blur-sm">
              <div className="text-xs text-atlas-muted font-medium">Primary DSA Categories</div>
              <div className="text-2xl font-bold font-mono text-indigo-300 mt-1">18</div>
            </div>
            <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-bg0/60 p-4 backdrop-blur-sm">
              <div className="text-xs text-atlas-muted font-medium">Must-Master Patterns</div>
              <div className="text-2xl font-bold font-mono text-emerald-300 mt-1">20</div>
            </div>
            <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-bg0/60 p-4 backdrop-blur-sm">
              <div className="text-xs text-atlas-muted font-medium">Interactive Visual Problems</div>
              <div className="text-2xl font-bold font-mono text-amber-300 mt-1">{interactiveTopicsCount}+</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Roadmap Sub-Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-atlas-muted/20 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('topics')}
            className={cn(
              'inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition',
              activeTab === 'topics'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                : 'border border-atlas-muted/20 bg-atlas-surface/60 text-atlas-muted hover:bg-atlas-elev hover:text-atlas-text'
            )}
          >
            <Layers size={16} />
            <span>All 221 Topics ({dsaTopics.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('patterns')}
            className={cn(
              'inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition',
              activeTab === 'patterns'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                : 'border border-atlas-muted/20 bg-atlas-surface/60 text-atlas-muted hover:bg-atlas-elev hover:text-atlas-text'
            )}
          >
            <Flame size={16} />
            <span>20 Must-Master Patterns</span>
          </button>

          <button
            onClick={() => setActiveTab('priority')}
            className={cn(
              'inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition',
              activeTab === 'priority'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                : 'border border-atlas-muted/20 bg-atlas-surface/60 text-atlas-muted hover:bg-atlas-elev hover:text-atlas-text'
            )}
          >
            <Compass size={16} />
            <span>Interview Priority Order</span>
          </button>
        </div>

        {activeTab === 'topics' && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setVisualizerOnlyFilter((prev) => !prev)}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition',
                visualizerOnlyFilter
                  ? 'border border-amber-500/60 bg-amber-500/20 text-amber-300'
                  : 'border border-atlas-muted/20 bg-atlas-surface/60 text-atlas-muted hover:bg-atlas-elev'
              )}
            >
              <PlayCircle size={14} className={visualizerOnlyFilter ? 'text-amber-400' : ''} />
              <span>Interactive Visualizer Ready</span>
            </button>
          </div>
        )}
      </div>

      {/* Tab 1: All 221 Topics by Category */}
      {activeTab === 'topics' && (
        <div className="space-y-6">
          {/* Search & Category Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-atlas-muted" />
              <input
                type="text"
                placeholder="Search topics by name (e.g. Kadane, KMP, Segment Tree, Dijkstra, Sieve)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-atlas-muted/30 bg-atlas-surface/80 pl-11 pr-4 py-3 text-sm text-atlas-text placeholder-atlas-muted outline-none transition focus:border-cyan-500/60 focus:bg-atlas-elev"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={16} className="text-atlas-muted shrink-0" />
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="w-full rounded-2xl border border-atlas-muted/30 bg-atlas-surface/80 px-4 py-3 text-sm text-atlas-text outline-none transition focus:border-cyan-500/60"
              >
                <option value="all">All 18 Categories</option>
                {dsaRoadmapCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.num}. {cat.title} ({cat.totalTopics} topics)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Summary Counter */}
          <div className="flex items-center justify-between text-xs text-atlas-muted font-medium px-1">
            <span>
              Showing <strong className="text-cyan-300 font-mono">{filteredTopics.length}</strong> of 221 topics
            </span>
            {(searchQuery || selectedCategoryFilter !== 'all' || visualizerOnlyFilter) && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategoryFilter('all')
                  setVisualizerOnlyFilter(false)
                }}
                className="text-cyan-400 hover:underline"
              >
                Reset All Filters
              </button>
            )}
          </div>

          {/* 18 Category Accordion Hubs */}
          <div className="space-y-4">
            {dsaRoadmapCategories.map((cat) => {
              const catTopics = filteredTopics.filter((t) => t.categoryId === cat.id)
              if (catTopics.length === 0 && (searchQuery || selectedCategoryFilter !== 'all')) {
                return null
              }

              const isExpanded = expandedCategory === cat.id || searchQuery.length > 0 || selectedCategoryFilter !== 'all'
              const visualCount = catTopics.filter((t) => Boolean(t.linkedProblemId)).length

              return (
                <div
                  key={cat.id}
                  className="rounded-3xl border border-atlas-muted/20 bg-atlas-surface/60 overflow-hidden transition"
                >
                  {/* Category Header Bar */}
                  <button
                    onClick={() => toggleCategoryExpand(cat.id)}
                    className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 text-left hover:bg-atlas-elev/60 transition"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-atlas-elev text-xl border border-atlas-muted/20">
                        {cat.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                            Category {cat.num}
                          </span>
                          {visualCount > 0 && (
                            <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                              {visualCount} Interactive Visualizer
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-atlas-text">{cat.title}</h3>
                        <p className="text-xs text-atlas-muted mt-0.5">{cat.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <span className="rounded-full bg-atlas-elev border border-atlas-muted/20 px-3 py-1 text-xs font-mono text-atlas-text">
                        {catTopics.length} / {cat.totalTopics} Topics
                      </span>
                      <div className="h-8 w-8 flex items-center justify-center rounded-full bg-atlas-elev/80 text-atlas-muted">
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Topic Cards */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="border-t border-atlas-muted/15 p-5 bg-atlas-bg0/40"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {catTopics.map((topic) => (
                            <div
                              key={topic.num}
                              className="group flex flex-col justify-between rounded-2xl border border-atlas-muted/20 bg-atlas-surface/80 p-4 transition hover:border-cyan-500/40 hover:bg-atlas-elev hover:shadow-lg"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-2">
                                  <span className="rounded-md bg-atlas-elev px-2 py-0.5 font-mono text-[11px] font-semibold text-cyan-300 border border-cyan-500/20">
                                    #{topic.num}
                                  </span>
                                  {topic.pattern && (
                                    <span className="truncate rounded-md bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-mono text-indigo-300">
                                      {topic.pattern}
                                    </span>
                                  )}
                                </div>

                                <h4 className="mt-2.5 text-base font-bold text-atlas-text group-hover:text-cyan-300 transition">
                                  {topic.title}
                                </h4>
                                <p className="mt-1.5 text-xs text-atlas-muted leading-relaxed line-clamp-3">
                                  {topic.description}
                                </p>
                              </div>

                              <div className="mt-4 pt-3 border-t border-atlas-muted/15 flex items-center justify-between">
                                <span className="text-[10px] font-mono text-atlas-muted">
                                  Priority Tier: #{topic.priorityTier}
                                </span>

                                {topic.linkedProblemId ? (
                                  <button
                                    onClick={() => onSelectProblem(topic.linkedProblemId)}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 transition shadow-sm"
                                  >
                                    <PlayCircle size={14} />
                                    <span>Visualize</span>
                                  </button>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[11px] text-atlas-muted italic">
                                    <CheckCircle2 size={12} className="text-cyan-400" />
                                    <span>Core Concept</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tab 2: 20 Must-Master Patterns */}
      {activeTab === 'patterns' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-6 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Flame className="text-amber-400" size={22} />
              <span>20 Must-Master Problem-Solving Patterns</span>
            </h2>
            <p className="text-xs sm:text-sm text-atlas-muted mt-1.5 leading-relaxed">
              These core algorithmic patterns recur across 85%+ of interview questions asked at Amazon, Google, Meta, Microsoft, Atlassian, and Uber.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mustMasterPatterns.map((pat, idx) => (
              <motion.div
                key={pat.id}
                whileHover={{ y: -4 }}
                className="flex flex-col justify-between rounded-2xl border border-atlas-muted/20 bg-atlas-surface/80 p-6 shadow-md transition hover:border-indigo-500/50 hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-2xl">{pat.icon}</span>
                    <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-indigo-300">
                      Pattern #{idx + 1}
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-bold text-white group-hover:text-cyan-300 transition">
                    {pat.name}
                  </h3>
                  <p className="mt-2 text-xs text-atlas-muted leading-relaxed">
                    {pat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-atlas-muted/15 space-y-2">
                  <div className="text-[11px] text-atlas-muted">
                    <span className="font-semibold text-atlas-text">Canonical Examples:</span> {pat.exampleProblem}
                  </div>
                  <div className="inline-block rounded-lg bg-atlas-elev px-2.5 py-1 text-[10px] font-mono font-medium text-cyan-300 border border-cyan-500/20">
                    {pat.priority}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Priority Interview Preparation Roadmap */}
      {activeTab === 'priority' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-6 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Compass className="text-cyan-400" size={22} />
              <span>Priority Order for Technical Interview Preparation</span>
            </h2>
            <p className="text-xs sm:text-sm text-atlas-muted mt-1.5 leading-relaxed">
              If you have limited time before coding interviews, focus on these 18 priority tiers in exact order to maximize topic coverage vs interview frequency.
            </p>
          </div>

          <div className="space-y-4">
            {priorityOrder.map((tier) => {
              const tierTopics = dsaTopics.filter((t) => tier.categories.includes(t.categoryId))
              const visualCount = tierTopics.filter((t) => Boolean(t.linkedProblemId)).length

              return (
                <div
                  key={tier.tier}
                  className="rounded-2xl border border-atlas-muted/20 bg-atlas-surface/70 p-5 backdrop-blur-sm transition hover:border-cyan-500/40"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-atlas-muted/15">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 font-mono text-sm font-bold text-white shadow-md">
                        P{tier.tier}
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-white">{tier.name}</h3>
                        <span className="text-xs text-atlas-muted">
                          Mapped to Categories: {tier.categories.join(', ')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs text-atlas-muted">
                      <span>{tierTopics.length} Topics</span>
                      <span>•</span>
                      <span className="text-emerald-300 font-semibold">{visualCount} Visualized</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {tierTopics.map((topic) => (
                      <div
                        key={topic.num}
                        className="flex items-center justify-between rounded-xl border border-atlas-muted/15 bg-atlas-bg0/60 px-3 py-2 text-xs transition hover:border-cyan-500/30"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-mono text-cyan-400 font-bold text-[11px]">#{topic.num}</span>
                          <span className="truncate text-atlas-text font-medium">{topic.title}</span>
                        </div>
                        {topic.linkedProblemId && (
                          <button
                            onClick={() => onSelectProblem(topic.linkedProblemId)}
                            className="ml-2 text-emerald-400 hover:text-emerald-300"
                            title="Visualize on CodeInsight"
                          >
                            <PlayCircle size={15} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
