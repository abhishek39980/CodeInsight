import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Bookmark, BookmarkCheck, ChevronRight } from 'lucide-react'
import { useProgressStore, getLevelFromXP } from '../store/useProgressStore'
import { dsaProblems, dsaCategories } from '../engine/dsaProblems'
import { cn } from '../utils/cn'
import { useNavigate } from 'react-router-dom'

function LinearProgress({ value, max }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px] text-atlas-muted">
        <span>{value} / {max}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1 rounded-full bg-atlas-muted/15 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn('h-full rounded-full', pct === 100 ? 'bg-emerald-500' : 'bg-atlas-brand')}
        />
      </div>
    </div>
  )
}

function XPBar({ xp }) {
  const level = getLevelFromXP(xp)
  const pct = level.next === Infinity
    ? 100
    : Math.round(((xp - level.current) / (level.next - level.current)) * 100)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-atlas-text">{level.name}</span>
        <span className="font-mono text-xs text-atlas-muted">
          {xp}{level.next !== Infinity ? ` / ${level.next} xp` : ' xp'}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-atlas-muted/15 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full bg-atlas-brand"
        />
      </div>
    </div>
  )
}

export default function ProgressDashboard() {
  const navigate  = useNavigate()
  const { problemStatus, bookmarks, xp, streak, lastSolveDate, getSolvedCount } = useProgressStore()

  const solved   = getSolvedCount()
  const total    = dsaProblems.length
  const today    = new Date().toDateString()
  const solvedToday = lastSolveDate === today

  const inProgress = useMemo(() =>
    Object.values(problemStatus).filter(s => s === 'in_progress').length, [problemStatus])

  const bookmarkCount = useMemo(() =>
    Object.values(bookmarks).filter(Boolean).length, [bookmarks])

  const categoryStats = useMemo(() =>
    dsaCategories.map(cat => {
      const catTotal  = dsaProblems.filter(p => p.category === cat.id).length
      const catSolved = dsaProblems.filter(p => p.category === cat.id && problemStatus[p.id] === 'solved').length
      return { ...cat, total: catTotal, solvedCount: catSolved }
    }), [problemStatus])

  const bookmarkedProblems = useMemo(() =>
    dsaProblems.filter(p => bookmarks[p.id]).slice(0, 10), [bookmarks])

  const recentlySolved = useMemo(() =>
    dsaProblems.filter(p => problemStatus[p.id] === 'solved').slice(-6), [problemStatus])

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-10 sm:px-8 space-y-8">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-atlas-text">Progress</h1>
        <p className="text-sm text-atlas-muted mt-1">Your DSA learning journey</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Solved',      value: solved,        note: `of ${total}` },
          { label: 'In Progress', value: inProgress,    note: 'problems' },
          { label: 'Streak',      value: streak,        note: solvedToday ? 'days · active today' : 'days' },
          { label: 'Bookmarks',   value: bookmarkCount, note: 'saved' },
        ].map((s, i) => (
          <div key={i} className="rounded-xl border border-atlas-muted/15 bg-atlas-surface p-4">
            <p className="text-[11px] uppercase tracking-widest text-atlas-muted font-semibold">{s.label}</p>
            <p className="mt-2 text-3xl font-bold text-atlas-text font-mono">{s.value}</p>
            <p className="mt-0.5 text-xs text-atlas-muted">{s.note}</p>
          </div>
        ))}
      </div>

      {/* XP Level */}
      <div className="rounded-xl border border-atlas-muted/15 bg-atlas-surface p-5">
        <p className="text-[11px] uppercase tracking-widest text-atlas-muted font-semibold mb-4">Experience</p>
        <XPBar xp={xp} />
      </div>

      {/* Overall progress */}
      <div className="rounded-xl border border-atlas-muted/15 bg-atlas-surface p-5">
        <p className="text-[11px] uppercase tracking-widest text-atlas-muted font-semibold mb-4">Overall</p>
        <LinearProgress value={solved} max={total} />
      </div>

      {/* Category Progress */}
      <div className="rounded-xl border border-atlas-muted/15 bg-atlas-surface p-5">
        <p className="text-[11px] uppercase tracking-widest text-atlas-muted font-semibold mb-5">By Category</p>
        <div className="space-y-4">
          {categoryStats.map(cat => (
            <div key={cat.id}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-atlas-text">{cat.label}</span>
                <span className="text-[11px] font-mono text-atlas-muted">{cat.solvedCount}/{cat.total}</span>
              </div>
              <div className="h-1 rounded-full bg-atlas-muted/15 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.total > 0 ? (cat.solvedCount / cat.total) * 100 : 0}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className={cn('h-full rounded-full', cat.solvedCount === cat.total && cat.total > 0 ? 'bg-emerald-500' : 'bg-atlas-brand')}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookmarks */}
        <div className="rounded-xl border border-atlas-muted/15 bg-atlas-surface p-5">
          <p className="text-[11px] uppercase tracking-widest text-atlas-muted font-semibold mb-4">Bookmarks</p>
          {bookmarkedProblems.length === 0 ? (
            <p className="text-sm text-atlas-muted py-6 text-center">No bookmarks yet.</p>
          ) : (
            <div className="divide-y divide-atlas-muted/10">
              {bookmarkedProblems.map(p => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/problem/${p.id}`)}
                  className="flex w-full items-center justify-between py-2.5 text-left group"
                >
                  <div>
                    <p className="text-xs font-medium text-atlas-text group-hover:text-white transition">{p.title}</p>
                    <p className="text-[11px] text-atlas-muted">{p.difficulty}</p>
                  </div>
                  <ChevronRight size={13} className="text-atlas-muted/40 group-hover:text-atlas-muted transition" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recently Solved */}
        <div className="rounded-xl border border-atlas-muted/15 bg-atlas-surface p-5">
          <p className="text-[11px] uppercase tracking-widest text-atlas-muted font-semibold mb-4">Recently Solved</p>
          {recentlySolved.length === 0 ? (
            <p className="text-sm text-atlas-muted py-6 text-center">No solved problems yet.</p>
          ) : (
            <div className="divide-y divide-atlas-muted/10">
              {recentlySolved.map(p => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/problem/${p.id}`)}
                  className="flex w-full items-center justify-between py-2.5 text-left group"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-xs font-medium text-atlas-text group-hover:text-white transition">{p.title}</span>
                  </div>
                  <span className="text-[11px] text-atlas-muted">{p.difficulty}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
