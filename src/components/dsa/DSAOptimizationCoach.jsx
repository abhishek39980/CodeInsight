import { Lightbulb, ArrowRight, CheckCircle2, AlertTriangle, HelpCircle, Trophy } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function DSAOptimizationCoach({ problem }) {
  if (!problem) return null

  const { bruteForce, betterSolution, optimalSolution, interviewTips, patternRecognition, optimizationCoach } = problem

  return (
    <div className="space-y-8">
      {/* Optimization Coach Banner */}
      {optimizationCoach && (
        <div className="rounded-3xl border-2 border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent p-6 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 mb-3">
            <Lightbulb size={18} className="text-amber-300 animate-pulse" />
            <span>Optimization Coach — Why Brute Force is Slow & How to Optimize</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300">1. Brute Force Bottleneck</span>
              <p className="mt-2 text-xs leading-relaxed text-atlas-text">{optimizationCoach.bottleneck}</p>
            </div>
            <div className="flex flex-col items-center justify-center text-amber-300 font-bold text-sm">
              <span className="rounded-full bg-amber-500/20 px-3 py-1 border border-amber-500/30">
                Key Insight & Transformation
              </span>
              <p className="mt-2 text-xs text-center text-atlas-muted font-mono">{optimizationCoach.visualTransition}</p>
            </div>
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">2. Optimal Idea</span>
              <p className="mt-2 text-xs leading-relaxed text-atlas-text">{optimizationCoach.optimizationIdea}</p>
            </div>
          </div>
        </div>
      )}

      {/* Pattern Recognition & Interview Coach */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {patternRecognition && (
          <div className="rounded-2xl border border-atlas-brand/30 bg-atlas-surface/90 p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-atlas-brand">
              <Trophy size={16} className="text-atlas-brand" />
              <span>Pattern Recognition — What idea did we use?</span>
            </div>
            <h4 className="text-base font-bold text-atlas-text">{patternRecognition.patternName}</h4>
            <p className="text-xs leading-relaxed text-atlas-muted">{patternRecognition.whyThisPattern}</p>
          </div>
        )}

        {interviewTips && (
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-atlas-text">
              <HelpCircle size={16} className="text-atlas-brand" />
              <span>Interview Coach & Common Pitfalls</span>
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-bold text-emerald-300">When to think of this: </span>
                <span className="text-atlas-muted">{interviewTips.whenToThink}</span>
              </div>
              <div>
                <span className="font-bold text-rose-300">Common mistakes: </span>
                <span className="text-atlas-muted">{interviewTips.commonMistakes}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Brute Force / Better / Optimal Progression */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-atlas-text">Step-by-Step Solution Progression</h3>

        {/* Brute Force Card */}
        {bruteForce && (
          <div className="rounded-2xl border border-rose-500/30 bg-atlas-surface/90 p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-rose-300">
                <span>🐢 Brute Force Solution</span>
              </span>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="rounded-lg bg-rose-500/20 px-2.5 py-1 text-rose-300 border border-rose-500/30">
                  Time: {bruteForce.timeComplexity}
                </span>
                <span className="rounded-lg bg-atlas-elev px-2.5 py-1 text-atlas-muted">
                  Space: {bruteForce.spaceComplexity}
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-atlas-muted">{bruteForce.explanation}</p>
            <pre className="rounded-xl border border-atlas-muted/20 bg-atlas-bg0/60 p-4 font-mono text-xs text-atlas-text overflow-x-auto">
              <code>{bruteForce.code}</code>
            </pre>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-300">
                <span className="font-bold">Pros: </span> {bruteForce.pros}
              </div>
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-rose-300">
                <span className="font-bold">Cons: </span> {bruteForce.cons}
              </div>
            </div>
          </div>
        )}

        {/* Better Solution Card (if available) */}
        {betterSolution && (
          <div className="rounded-2xl border border-amber-500/30 bg-atlas-surface/90 p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-amber-300">
                <span>⚡ Better Solution (Intermediate Optimization)</span>
              </span>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="rounded-lg bg-amber-500/20 px-2.5 py-1 text-amber-300 border border-amber-500/30">
                  Time: {betterSolution.timeComplexity}
                </span>
                <span className="rounded-lg bg-atlas-elev px-2.5 py-1 text-atlas-muted">
                  Space: {betterSolution.spaceComplexity}
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-atlas-muted">{betterSolution.explanation}</p>
            <pre className="rounded-xl border border-atlas-muted/20 bg-atlas-bg0/60 p-4 font-mono text-xs text-atlas-text overflow-x-auto">
              <code>{betterSolution.code}</code>
            </pre>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-300">
                <span className="font-bold">Pros: </span> {betterSolution.pros}
              </div>
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-rose-300">
                <span className="font-bold">Cons: </span> {betterSolution.cons}
              </div>
            </div>
          </div>
        )}

        {/* Optimal Solution Card */}
        {optimalSolution && (
          <div className="rounded-2xl border-2 border-emerald-500/50 bg-atlas-surface/90 p-6 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-300">
                <span>🚀 Optimal Solution (Interview Standard)</span>
              </span>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-emerald-300 border border-emerald-500/40 font-bold">
                  Time: {optimalSolution.timeComplexity}
                </span>
                <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-emerald-300 border border-emerald-500/40 font-bold">
                  Space: {optimalSolution.spaceComplexity}
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-atlas-muted">{optimalSolution.explanation}</p>
            <pre className="rounded-xl border border-atlas-muted/20 bg-atlas-bg0/60 p-4 font-mono text-xs text-atlas-text overflow-x-auto">
              <code>{optimalSolution.code}</code>
            </pre>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-300">
                <span className="font-bold">Pros: </span> {optimalSolution.pros}
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-300">
                <span className="font-bold">Cons / Tradeoffs: </span> {optimalSolution.cons}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
