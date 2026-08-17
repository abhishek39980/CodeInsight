import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GitBranch,
  GitCommit,
  GitMerge,
  RotateCcw,
  Plus,
  Terminal,
  Sparkles,
  Info,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'
import { cn } from '../../../utils/cn'

const INITIAL_COMMITS = [
  { id: 'c0', hash: '8f2a1b', message: 'Initial commit', branch: 'main', parents: [] },
  { id: 'c1', hash: '3e4d9c', message: 'Add database schema', branch: 'main', parents: ['c0'] },
  { id: 'c2', hash: '5b1a7e', message: 'Implement auth middleware', branch: 'feature/auth', parents: ['c1'] },
  { id: 'c3', hash: '9c2f4d', message: 'Optimize API query latency', branch: 'main', parents: ['c1'] }
]

export default function GitGraphLab() {
  const [commits, setCommits] = useState(INITIAL_COMMITS)
  const [activeBranch, setActiveBranch] = useState('main') // 'main' | 'feature/auth'
  const [branches, setBranches] = useState(['main', 'feature/auth'])

  // Helper to add commit
  const handleCommit = () => {
    const parent = commits.filter(c => c.branch === activeBranch).slice(-1)[0] || commits.slice(-1)[0]
    const newHash = Math.random().toString(16).substring(2, 8)
    const newCommit = {
      id: `c${commits.length}`,
      hash: newHash,
      message: `Update on ${activeBranch}`,
      branch: activeBranch,
      parents: [parent.id]
    }
    setCommits(prev => [...prev, newCommit])
  }

  // 3-Way Merge
  const handleMerge = () => {
    if (activeBranch !== 'main') return
    const mainHead = commits.filter(c => c.branch === 'main').slice(-1)[0]
    const featHead = commits.filter(c => c.branch === 'feature/auth').slice(-1)[0]
    if (!mainHead || !featHead) return

    const newHash = Math.random().toString(16).substring(2, 8)
    const mergeCommit = {
      id: `c${commits.length}`,
      hash: newHash,
      message: `Merge branch 'feature/auth' into main`,
      branch: 'main',
      parents: [mainHead.id, featHead.id]
    }
    setCommits(prev => [...prev, mergeCommit])
  }

  const handleReset = () => {
    setCommits(INITIAL_COMMITS)
    setActiveBranch('main')
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-atlas-surface via-atlas-elev to-atlas-surface p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
            <GitBranch size={18} className="text-orange-400" />
            <span>Version Control & Directed Acyclic Graph (DAG) Simulator</span>
          </div>
          <h3 className="mt-1 text-xl font-bold text-atlas-text">Git Commit DAG & Branch Merge Engine</h3>
          <p className="text-xs text-atlas-muted mt-0.5 max-w-2xl">
            Explore how Git tracks history as an immutable Directed Acyclic Graph of SHA content-addressed snapshots, branch references, and 3-way merge commits.
          </p>
        </div>

        {/* Active HEAD pointer badge */}
        <div className="flex items-center gap-3 bg-atlas-bg0/80 p-3 rounded-2xl border border-atlas-muted/20">
          <div className="text-center px-2 font-mono">
            <span className="text-[10px] text-atlas-muted uppercase block">Active HEAD</span>
            <span className="text-xs font-bold text-orange-400">ref: refs/heads/{activeBranch}</span>
          </div>
          <div className="h-7 w-px bg-atlas-muted/20" />
          <div className="text-center px-2 font-mono">
            <span className="text-[10px] text-atlas-muted uppercase block">Total Commits</span>
            <span className="text-sm font-bold text-cyan-300">{commits.length}</span>
          </div>
        </div>
      </div>

      {/* Control Strip */}
      <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-surface/80 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
            <button
              onClick={handleCommit}
              className="flex items-center gap-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-white px-3.5 py-1.5 font-bold transition shadow"
            >
              <Plus size={13} /> git commit
            </button>

            <button
              onClick={() => setActiveBranch(activeBranch === 'main' ? 'feature/auth' : 'main')}
              className="flex items-center gap-1.5 rounded-lg bg-atlas-elev hover:bg-atlas-bg0 border border-atlas-muted/20 px-3.5 py-1.5 text-atlas-text transition"
            >
              <GitBranch size={13} className="text-orange-400" />
              git checkout {activeBranch === 'main' ? 'feature/auth' : 'main'}
            </button>

            <button
              onClick={handleMerge}
              disabled={activeBranch !== 'main'}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/40 px-3.5 py-1.5 font-bold transition disabled:opacity-40"
            >
              <GitMerge size={13} /> git merge feature/auth
            </button>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 rounded-lg bg-atlas-elev hover:bg-atlas-bg0 border border-atlas-muted/20 px-3 py-1.5 text-xs font-medium text-atlas-muted hover:text-atlas-text transition"
          >
            <RotateCcw size={13} /> Reset Repo
          </button>
        </div>
      </div>

      {/* Main Visual DAG Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 cols: Commit Graph Timeline */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-3xl border border-atlas-muted/25 bg-atlas-surface/90 p-6 space-y-6 min-h-[380px] flex flex-col justify-between">
            <h4 className="text-sm font-bold text-atlas-text">Interactive Commit Object DAG</h4>

            {/* Commit Nodes Timeline */}
            <div className="flex flex-wrap items-center gap-4 py-8 px-4 bg-atlas-bg0/80 rounded-2xl border border-atlas-muted/20 overflow-x-auto">
              {commits.map((c, idx) => {
                const isMain = c.branch === 'main'
                const isHead = (c.branch === activeBranch && idx === commits.map(x => x.branch).lastIndexOf(activeBranch))

                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      'p-3.5 rounded-2xl border-2 min-w-[130px] font-mono text-xs transition shadow-lg space-y-1',
                      isMain
                        ? 'border-orange-500/40 bg-orange-500/10'
                        : 'border-purple-500/40 bg-purple-500/10',
                      isHead && 'ring-2 ring-orange-400'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-atlas-muted font-bold">{c.hash}</span>
                      {isHead && (
                        <span className="text-[9px] bg-orange-500 text-slate-950 font-bold px-1.5 py-0.2 rounded">
                          HEAD
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-atlas-text block truncate">{c.message}</span>
                    <span className="text-[9px] text-atlas-muted block">{c.branch}</span>
                  </motion.div>
                )
              })}
            </div>

            <div className="rounded-xl bg-atlas-bg0/60 p-3 text-xs text-atlas-muted space-y-1 border border-atlas-muted/10">
              <div className="font-semibold text-atlas-text flex items-center gap-1.5">
                <Info size={13} className="text-orange-400" />
                <span>How Git Branches Actually Work:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                In Git, a branch is not a container of files—it is simply a lightweight 41-byte text file containing the 40-character SHA hash of its latest commit. Creating a branch is instantaneous ($\mathcal{O}(1)$).
              </p>
            </div>
          </div>
        </div>

        {/* Right 4 cols: Git Object Store Inspector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-4 font-mono text-xs">
            <h4 className="text-sm font-bold text-atlas-text font-sans">.git/refs/heads/ & Object Store</h4>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-atlas-elev border border-orange-500/30">
                <span className="font-bold text-orange-300 block">refs/heads/main</span>
                <span className="text-[10px] text-atlas-muted">
                  Points to: {commits.filter(c => c.branch === 'main').slice(-1)[0]?.hash}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-atlas-elev border border-purple-500/30">
                <span className="font-bold text-purple-300 block">refs/heads/feature/auth</span>
                <span className="text-[10px] text-atlas-muted">
                  Points to: {commits.filter(c => c.branch === 'feature/auth').slice(-1)[0]?.hash}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-orange-500/10 border border-orange-500/30 p-3 text-[11px] text-orange-200">
              <span className="font-bold block">Object Storage Model:</span>
              <span>Blobs (file data) ➔ Trees (directories) ➔ Commits (snapshots + author + parent SHA hashes).</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
