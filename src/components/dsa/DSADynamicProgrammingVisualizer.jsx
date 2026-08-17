import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Grid,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  CornerDownRight,
  Zap,
  HelpCircle
} from 'lucide-react'
import { cn } from '../../utils/cn'

const DP_PROBLEMS = {
  knapsack: {
    id: 'knapsack',
    title: '0/1 Knapsack Problem',
    description: 'Maximize total item value without exceeding maximum backpack capacity.',
    items: [
      { name: 'Item 1', w: 1, v: 1 },
      { name: 'Item 2', w: 2, v: 4 },
      { name: 'Item 3', w: 3, v: 5 },
      { name: 'Item 4', w: 4, v: 7 }
    ],
    capacity: 6,
    formula: 'dp[i][w] = max(dp[i-1][w], dp[i-1][w - wt[i]] + val[i])'
  },
  lcs: {
    id: 'lcs',
    title: 'Longest Common Subsequence (LCS)',
    description: 'Find the length of the longest subsequence present in both strings in the same relative order.',
    str1: 'ABCDE',
    str2: 'ACE',
    formula: 'if (s1[i-1] == s2[j-1]) dp[i-1][j-1] + 1 else max(dp[i-1][j], dp[i][j-1])'
  },
  editDistance: {
    id: 'editDistance',
    title: 'Edit Distance (Levenshtein Distance)',
    description: 'Find minimum number of insert, delete, or replace operations to convert String 1 to String 2.',
    str1: 'HORSE',
    str2: 'ROS',
    formula: 'if match: dp[i-1][j-1] else: 1 + min(insert, delete, replace)'
  }
}

export default function DSADynamicProgrammingVisualizer() {
  const [selectedProblem, setSelectedProblem] = useState('knapsack')
  const problem = DP_PROBLEMS[selectedProblem]

  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hoveredCell, setHoveredCell] = useState(null)
  const [showBacktrack, setShowBacktrack] = useState(false)

  // Compute full DP matrix and step sequence
  const { rows, cols, rowLabels, colLabels, gridData, steps, optimalPath } = useMemo(() => {
    if (selectedProblem === 'knapsack') {
      const items = problem.items
      const W = problem.capacity
      const r = items.length + 1
      const c = W + 1
      const rLabels = ['0 (None)', ...items.map((it, i) => `${i+1} (w:${it.w}, v:${it.v})`)]
      const cLabels = Array.from({ length: c }, (_, i) => String(i))

      const dp = Array.from({ length: r }, () => Array(c).fill(0))
      const stepList = []

      // Fill base case
      for (let w = 0; w < c; w++) {
        stepList.push({ r: 0, c: w, val: 0, explanation: 'Base case: 0 items yields 0 value.', deps: [] })
      }

      for (let i = 1; i < r; i++) {
        const item = items[i - 1]
        for (let w = 0; w < c; w++) {
          if (w === 0) {
            dp[i][0] = 0
            stepList.push({ r: i, c: 0, val: 0, explanation: 'Base case: 0 capacity yields 0 value.', deps: [] })
            continue
          }

          const exclude = dp[i - 1][w]
          const deps = [{ r: i - 1, c: w, label: 'Exclude Item' }]

          if (item.w <= w) {
            const include = dp[i - 1][w - item.w] + item.v
            deps.push({ r: i - 1, c: w - item.w, label: `Include Item (+${item.v})` })
            dp[i][w] = Math.max(exclude, include)
            stepList.push({
              r: i,
              c: w,
              val: dp[i][w],
              explanation: `max(exclude: dp[${i-1}][${w}]=${exclude}, include: dp[${i-1}][${w - item.w}]+${item.v}=${include}) = ${dp[i][w]}`,
              deps
            })
          } else {
            dp[i][w] = exclude
            stepList.push({
              r: i,
              c: w,
              val: dp[i][w],
              explanation: `Item weight ${item.w} > capacity ${w}. Exclude item: dp[${i-1}][${w}] = ${exclude}`,
              deps
            })
          }
        }
      }

      // Backtrack optimal path
      const path = []
      let currR = r - 1
      let currW = c - 1
      while (currR > 0 && currW > 0) {
        path.push({ r: currR, c: currW })
        const item = items[currR - 1]
        if (dp[currR][currW] !== dp[currR - 1][currW]) {
          currW -= item.w
        }
        currR--
      }
      path.push({ r: 0, c: 0 })

      return { rows: r, cols: c, rowLabels: rLabels, colLabels: cLabels, gridData: dp, steps: stepList, optimalPath: path }
    } else if (selectedProblem === 'lcs') {
      const s1 = problem.str1
      const s2 = problem.str2
      const r = s1.length + 1
      const c = s2.length + 1
      const rLabels = ['""', ...s1.split('').map((ch, i) => `${ch} (${i+1})`)]
      const cLabels = ['""', ...s2.split('').map((ch, i) => `${ch} (${i+1})`)]

      const dp = Array.from({ length: r }, () => Array(c).fill(0))
      const stepList = []

      for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
          if (i === 0 || j === 0) {
            stepList.push({ r: i, c: j, val: 0, explanation: 'Base case: empty prefix has LCS = 0', deps: [] })
            continue
          }

          if (s1[i - 1] === s2[j - 1]) {
            dp[i][j] = dp[i - 1][j - 1] + 1
            stepList.push({
              r: i,
              c: j,
              val: dp[i][j],
              explanation: `Match '${s1[i-1]}' == '${s2[j-1]}'! dp[${i-1}][${j-1}] + 1 = ${dp[i][j]}`,
              deps: [{ r: i - 1, c: j - 1, label: 'Diagonal match' }]
            })
          } else {
            dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
            stepList.push({
              r: i,
              c: j,
              val: dp[i][j],
              explanation: `Mismatch '${s1[i-1]}' != '${s2[j-1]}'. max(top:${dp[i-1][j]}, left:${dp[i][j-1]}) = ${dp[i][j]}`,
              deps: [
                { r: i - 1, c: j, label: 'Top cell' },
                { r: i, c: j - 1, label: 'Left cell' }
              ]
            })
          }
        }
      }

      // Backtrack path
      const path = []
      let cr = r - 1, cj = c - 1
      while (cr > 0 && cj > 0) {
        path.push({ r: cr, c: cj })
        if (s1[cr - 1] === s2[cj - 1]) {
          cr--
          cj--
        } else if (dp[cr - 1][cj] >= dp[cr][cj - 1]) {
          cr--
        } else {
          cj--
        }
      }
      path.push({ r: 0, c: 0 })

      return { rows: r, cols: c, rowLabels: rLabels, colLabels: cLabels, gridData: dp, steps: stepList, optimalPath: path }
    } else {
      // Edit distance
      const s1 = problem.str1
      const s2 = problem.str2
      const r = s1.length + 1
      const c = s2.length + 1
      const rLabels = ['""', ...s1.split('').map((ch, i) => `${ch} (${i+1})`)]
      const cLabels = ['""', ...s2.split('').map((ch, i) => `${ch} (${i+1})`)]

      const dp = Array.from({ length: r }, () => Array(c).fill(0))
      const stepList = []

      for (let i = 0; i < r; i++) dp[i][0] = i
      for (let j = 0; j < c; j++) dp[0][j] = j

      for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
          if (i === 0 || j === 0) {
            stepList.push({ r: i, c: j, val: dp[i][j], explanation: `Base case: convert to/from empty string requires ${dp[i][j]} edits.`, deps: [] })
            continue
          }

          if (s1[i - 1] === s2[j - 1]) {
            dp[i][j] = dp[i - 1][j - 1]
            stepList.push({
              r: i,
              c: j,
              val: dp[i][j],
              explanation: `Match '${s1[i-1]}' == '${s2[j-1]}'! 0 cost from diagonal dp[${i-1}][${j-1}] = ${dp[i][j]}`,
              deps: [{ r: i - 1, c: j - 1, label: 'Match (0 cost)' }]
            })
          } else {
            const insertOp = dp[i][j - 1]
            const deleteOp = dp[i - 1][j]
            const replaceOp = dp[i - 1][j - 1]
            dp[i][j] = 1 + Math.min(insertOp, deleteOp, replaceOp)
            stepList.push({
              r: i,
              c: j,
              val: dp[i][j],
              explanation: `Mismatch '${s1[i-1]}' != '${s2[j-1]}'. 1 + min(ins:${insertOp}, del:${deleteOp}, rep:${replaceOp}) = ${dp[i][j]}`,
              deps: [
                { r: i, c: j - 1, label: 'Insert' },
                { r: i - 1, c: j, label: 'Delete' },
                { r: i - 1, c: j - 1, label: 'Replace' }
              ]
            })
          }
        }
      }

      return { rows: r, cols: c, rowLabels: rLabels, colLabels: cLabels, gridData: dp, steps: stepList, optimalPath: [] }
    }
  }, [selectedProblem, problem])

  // Reset steps when problem changes
  useEffect(() => {
    setCurrentStep(steps.length > 0 ? steps.length - 1 : 0)
    setIsPlaying(false)
    setShowBacktrack(false)
    setHoveredCell(null)
  }, [selectedProblem, steps.length])

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev + 1 >= steps.length) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 300)
    return () => clearInterval(timer)
  }, [isPlaying, steps.length])

  const activeStepObj = steps[currentStep] || steps[0]

  // Determine active dependencies for current step or hovered cell
  const activeDeps = useMemo(() => {
    if (hoveredCell) {
      const match = steps.find(s => s.r === hoveredCell.r && s.c === hoveredCell.c)
      return match?.deps || []
    }
    return activeStepObj?.deps || []
  }, [hoveredCell, activeStepObj, steps])

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="rounded-3xl border border-atlas-brand/30 bg-gradient-to-br from-atlas-surface via-atlas-elev to-atlas-surface p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-atlas-brand">
            <Grid size={18} className="text-atlas-brand" />
            <span>Optimal Substructure & Overlapping Subproblems</span>
          </div>
          <h3 className="mt-1 text-xl font-bold text-atlas-text">2D Dynamic Programming Grid & Cell Dependency Visualizer</h3>
          <p className="text-xs text-atlas-muted mt-0.5 max-w-2xl">
            Watch subproblem memoization step-by-step. Hover over any cell to illuminate the exact predecessor state dependencies and transition arithmetic.
          </p>
        </div>

        {/* Problem Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          {Object.entries(DP_PROBLEMS).map(([k, p]) => (
            <button
              key={k}
              onClick={() => setSelectedProblem(k)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium transition border',
                selectedProblem === k
                  ? 'bg-atlas-brand text-white border-atlas-brand'
                  : 'bg-atlas-surface text-atlas-muted border-atlas-muted/20 hover:text-atlas-text'
              )}
            >
              {p.title.split('(')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Control Strip */}
      <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-surface/80 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Progress & Stepper */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition border',
                isPlaying
                  ? 'bg-amber-500 text-white border-amber-400'
                  : 'bg-atlas-brand text-white border-atlas-brand'
              )}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              {isPlaying ? 'Pause' : 'Auto Fill'}
            </button>
            <button
              onClick={() => { setIsPlaying(false); setCurrentStep(prev => Math.max(0, prev - 1)) }}
              disabled={currentStep <= 0}
              className="rounded-lg bg-atlas-elev hover:bg-atlas-bg0 border border-atlas-muted/20 px-3 py-1.5 text-xs font-medium text-atlas-text transition disabled:opacity-40"
            >
              Step Back
            </button>
            <button
              onClick={() => { setIsPlaying(false); setCurrentStep(prev => Math.min(steps.length - 1, prev + 1)) }}
              disabled={currentStep >= steps.length - 1}
              className="rounded-lg bg-atlas-elev hover:bg-atlas-bg0 border border-atlas-muted/20 px-3 py-1.5 text-xs font-medium text-atlas-text transition disabled:opacity-40"
            >
              Next Step
            </button>
            <button
              onClick={() => { setIsPlaying(false); setCurrentStep(0); setShowBacktrack(false) }}
              className="flex items-center gap-1 rounded-lg bg-atlas-elev hover:bg-atlas-bg0 border border-atlas-muted/20 px-3 py-1.5 text-xs font-medium text-atlas-muted hover:text-atlas-text transition"
            >
              <RotateCcw size={13} /> Reset
            </button>
          </div>

          {/* Action Highlights */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowBacktrack(!showBacktrack)}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition border',
                showBacktrack
                  ? 'bg-emerald-500 text-white border-emerald-400'
                  : 'bg-atlas-elev text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/10'
              )}
            >
              <CornerDownRight size={13} />
              {showBacktrack ? 'Hide Backtrack Path' : 'Show Optimal Path'}
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[11px] font-mono text-atlas-muted">
            <span>Grid Computation Progress: {currentStep + 1} / {steps.length} cells filled</span>
            <span className="text-cyan-300 font-bold">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-atlas-elev overflow-hidden">
            <motion.div
              className="h-full bg-atlas-brand"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Visual DP Grid & Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 2D Matrix Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-4 overflow-x-auto">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-atlas-text">2D Memoization State Table ($dp[i][j]$)</h4>
              <span className="text-[11px] font-mono text-atlas-muted">Hover cells to trace vector dependencies</span>
            </div>

            {/* Grid Table */}
            <div className="inline-block min-w-full">
              <table className="border-collapse text-xs font-mono">
                <thead>
                  <tr>
                    <th className="p-2 border border-atlas-muted/20 bg-atlas-bg0/80 text-atlas-muted text-left">
                      i \ j
                    </th>
                    {colLabels.map((cl, colIdx) => (
                      <th key={colIdx} className="p-2 border border-atlas-muted/20 bg-atlas-bg0/80 text-cyan-300 text-center min-w-[52px]">
                        {cl}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: rows }).map((_, rIdx) => (
                    <tr key={rIdx}>
                      {/* Row Header */}
                      <td className="p-2 border border-atlas-muted/20 bg-atlas-bg0/80 font-bold text-amber-300 whitespace-nowrap">
                        {rowLabels[rIdx]}
                      </td>

                      {/* Cells */}
                      {Array.from({ length: cols }).map((_, cIdx) => {
                        const stepIndexForCell = steps.findIndex(s => s.r === rIdx && s.c === cIdx)
                        const isFilled = stepIndexForCell !== -1 && stepIndexForCell <= currentStep
                        const isCurrent = activeStepObj?.r === rIdx && activeStepObj?.c === cIdx
                        const isHovered = hoveredCell?.r === rIdx && hoveredCell?.c === cIdx
                        const isDep = activeDeps.some(d => d.r === rIdx && d.c === cIdx)
                        const isOptimal = showBacktrack && optimalPath.some(p => p.r === rIdx && p.c === cIdx)

                        const cellVal = isFilled ? gridData[rIdx][cIdx] : '·'

                        return (
                          <td
                            key={cIdx}
                            onMouseEnter={() => setHoveredCell({ r: rIdx, c: cIdx })}
                            onMouseLeave={() => setHoveredCell(null)}
                            className={cn(
                              'p-3 border text-center transition cursor-pointer relative',
                              isCurrent
                                ? 'bg-cyan-500/25 text-cyan-200 border-cyan-400 font-bold shadow-md ring-2 ring-cyan-400'
                                : isHovered
                                ? 'bg-atlas-brand/30 text-white border-atlas-brand ring-1 ring-atlas-brand'
                                : isDep
                                ? 'bg-amber-500/25 text-amber-200 border-amber-400 font-bold animate-pulse'
                                : isOptimal
                                ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400 font-bold shadow'
                                : isFilled
                                ? 'bg-atlas-elev/60 text-atlas-text border-atlas-muted/20 hover:bg-atlas-elev'
                                : 'bg-atlas-bg0/30 text-atlas-muted/30 border-atlas-muted/15'
                            )}
                          >
                            <span className="text-sm">{cellVal}</span>
                            {isOptimal && (
                              <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Formula Reference */}
            <div className="rounded-xl bg-atlas-bg0/60 p-3 text-xs font-mono text-atlas-muted space-y-1 border border-atlas-muted/10">
              <span className="text-atlas-text font-bold block">Recurrence Relation:</span>
              <span className="text-cyan-300 break-all">{problem.formula}</span>
            </div>
          </div>
        </div>

        {/* Right: State Transition & Dependency Inspector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-4">
            <h4 className="text-sm font-bold text-atlas-text">Cell Transition Inspector</h4>

            {/* Active Cell Breakdown */}
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 space-y-2 font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="text-atlas-muted">Evaluating Cell:</span>
                <span className="text-cyan-300 font-bold">
                  dp[{activeStepObj?.r}][{activeStepObj?.c}]
                </span>
              </div>
              <div className="text-lg font-bold text-atlas-text">
                Value = <span className="text-emerald-400">{activeStepObj?.val}</span>
              </div>
              <p className="text-[11px] text-atlas-text/90 leading-relaxed font-sans pt-1 border-t border-cyan-500/20">
                {activeStepObj?.explanation}
              </p>
            </div>

            {/* Direct Predecessor Dependencies */}
            <div className="space-y-2 pt-2 border-t border-atlas-muted/15">
              <span className="text-xs font-bold text-atlas-text block">Predecessor Subproblem Cells</span>
              <div className="space-y-2 font-mono text-xs">
                {activeDeps.map((dep, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-amber-300"
                  >
                    <span>dp[{dep.r}][{dep.c}]</span>
                    <span className="text-[10px] text-atlas-muted uppercase">{dep.label}</span>
                  </div>
                ))}
                {activeDeps.length === 0 && (
                  <div className="text-xs text-atlas-muted font-sans py-2">
                    Base case cell. No previous dependencies required.
                  </div>
                )}
              </div>
            </div>

            {/* Optimal Backtracking summary */}
            {showBacktrack && optimalPath.length > 0 && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 space-y-1.5 font-mono text-xs">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Optimal Path Cells:
                </span>
                <div className="text-[11px] text-atlas-muted flex flex-wrap gap-1">
                  {optimalPath.map((p, idx) => (
                    <span key={idx} className="bg-emerald-500/20 text-emerald-200 px-1.5 py-0.5 rounded">
                      ({p.r},{p.c}) {idx < optimalPath.length - 1 ? '➔' : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
