import { ArrowLeft, BookOpen, Sparkles, Trophy } from 'lucide-react'
import { dsaCategories } from '../../engine/dsaProblems'
import { cn } from '../../utils/cn'

export default function DSAProblemHeader({ problem, onBackToCatalog }) {
  if (!problem) return null
  const categoryObj = dsaCategories.find((c) => c.id === problem.category) || {}

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-atlas-muted/25 bg-gradient-to-r from-atlas-surface/95 via-atlas-elev/90 to-atlas-surface/95 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onBackToCatalog}
          className="inline-flex items-center gap-1.5 rounded-xl border border-atlas-muted/30 bg-atlas-surface px-3 py-2 text-xs font-medium text-atlas-text hover:border-atlas-brand/50 hover:bg-atlas-elev transition"
        >
          <ArrowLeft size={14} />
          <span>Catalog</span>
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs text-atlas-muted font-medium">
              <span>{categoryObj.icon || '📦'}</span>
              <span>{categoryObj.label || problem.category}</span>
            </span>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                problem.difficulty === 'Easy' && 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
                problem.difficulty === 'Medium' && 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
                problem.difficulty === 'Hard' && 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              )}
            >
              {problem.difficulty}
            </span>
          </div>
          <h1 className="mt-0.5 font-display text-xl font-bold text-atlas-text">{problem.title}</h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {problem.tags?.map((tag) => (
          <span
            key={tag}
            className="rounded-lg border border-atlas-muted/20 bg-atlas-surface/70 px-2.5 py-1 text-[11px] font-mono text-atlas-muted"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  )
}
