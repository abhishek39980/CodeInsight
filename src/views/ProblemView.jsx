import { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Bookmark, BookmarkCheck, Share2, CheckCircle2, Copy } from 'lucide-react'
import DSATabNavigation from '../components/dsa/DSATabNavigation'
import DSALearningVisualizer from '../components/dsa/DSALearningVisualizer'
import DSAOptimizationCoach from '../components/dsa/DSAOptimizationCoach'
import DSAVisualComplexityCoach from '../components/dsa/DSAVisualComplexityCoach'
import DSACompareSolutions from '../components/dsa/DSACompareSolutions'
import DSAComplexityDashboard from '../components/dsa/DSAComplexityDashboard'
import { getProblemById } from '../engine/dsaProblems'
import { simulateExecution } from '../engine/executor'
import { useProgressStore } from '../store/useProgressStore'
import { cn } from '../utils/cn'



export default function ProblemView() {
  const { problemId, tab } = useParams()
  const navigate = useNavigate()
  const problem = getProblemById(problemId)

  const [activeTab, setActiveTab] = useState(tab ?? 'visualizer')
  const [code, setCode] = useState('')
  const [steps, setSteps] = useState([])
  const [stepIndex, setStepIndex] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [language, setLanguage] = useState({ id: 'javascript' })
  const [copied, setCopied] = useState(false)

  const { problemStatus, bookmarks, toggleBookmark, markInProgress } = useProgressStore()
  const isSolved = problemStatus[problemId] === 'solved'
  const isBookmarked = Boolean(bookmarks[problemId])

  // Sync URL tab param
  useEffect(() => {
    if (tab && tab !== activeTab) setActiveTab(tab)
  }, [tab])

  // Initialize code + steps when problem changes
  useEffect(() => {
    if (!problem) return
    const defaultCode = problem.optimalSolution?.code ?? problem.bruteForce?.code ?? ''
    setCode(defaultCode)
    setStepIndex(0)
    setIsRunning(false)
    try {
      const res = simulateExecution(`${defaultCode}\n// Execution trace`, {})
      setSteps(res?.steps?.length > 0 ? res.steps : [{ event: 'Ready', explanation: 'Ready to run.' }])
    } catch {
      setSteps([{ event: 'Ready', explanation: 'Interactive learning mode ready.' }])
    }
    markInProgress(problemId)
  }, [problemId]) // eslint-disable-line

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      const isMonaco = document.activeElement?.closest('.monaco-editor')
      if (isMonaco) return

      if (e.code === 'Space') { e.preventDefault(); isRunning ? setIsRunning(false) : handleRun() }
      if (e.code === 'ArrowRight') { e.preventDefault(); handleStepForward() }
      if (e.code === 'ArrowLeft') { e.preventDefault(); handleStepBack() }
      if (e.code === 'KeyR' && !e.ctrlKey && !e.metaKey) { e.preventDefault(); handleReset() }
      if (e.code === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        document.getElementById('code-judge-run-btn')?.click()
      }
      if (e.code === 'Escape') navigate('/')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isRunning, steps.length, stepIndex]) // eslint-disable-line

  // Auto-play timer
  useEffect(() => {
    if (!isRunning || steps.length <= 1) return
    const ms = Math.max(150, Math.floor(1000 / speed))
    const timer = setInterval(() => {
      setStepIndex(prev => {
        if (prev + 1 >= steps.length) { setIsRunning(false); return prev }
        return prev + 1
      })
    }, ms)
    return () => clearInterval(timer)
  }, [isRunning, speed, steps.length])

  const handleRun = () => { if (stepIndex >= steps.length - 1) setStepIndex(0); setIsRunning(true) }
  const handleStepForward = () => { setIsRunning(false); setStepIndex(p => Math.min(p + 1, Math.max(0, steps.length - 1))) }
  const handleStepBack = () => { setIsRunning(false); setStepIndex(p => Math.max(0, p - 1)) }
  const handleReset = () => { setIsRunning(false); setStepIndex(0) }

  const handleShare = () => {
    const url = `${window.location.origin}/problem/${problemId}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (!problem) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-xl font-bold text-atlas-text">Problem not found</p>
          <button onClick={() => navigate('/')} className="text-sm text-atlas-brand hover:underline">
            ← Back to Catalog
          </button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="mx-auto max-w-[1580px] px-4 py-6 sm:px-6 lg:px-8 space-y-6"
    >
      {/* Problem Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-atlas-muted/15 pb-5">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate('/')}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-atlas-muted hover:text-atlas-text hover:bg-atlas-elev transition"
          >
            <ArrowLeft size={15} />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-base font-semibold text-atlas-text truncate">{problem.title}</h1>
              <span className={cn(
                'text-xs font-medium',
                problem.difficulty === 'Easy' ? 'text-emerald-400' :
                problem.difficulty === 'Medium' ? 'text-amber-400' : 'text-rose-400'
              )}>{problem.difficulty}</span>
              {isSolved && (
                <span className="flex items-center gap-1 text-[11px] text-emerald-500">
                  <CheckCircle2 size={11} /> Solved
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {problem.tags.slice(0, 4).map(t => (
                <span key={t} className="text-[10px] font-mono text-atlas-muted/60">#{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 ml-11 sm:ml-0">
          <button
            onClick={() => toggleBookmark(problemId)}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg transition',
              isBookmarked ? 'text-atlas-text' : 'text-atlas-muted hover:text-atlas-text'
            )}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
          >
            {isBookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
          </button>
          <button
            onClick={handleShare}
            className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs text-atlas-muted hover:text-atlas-text transition"
          >
            {copied ? <><CheckCircle2 size={13} className="text-emerald-400" /> Copied</> : <><Share2 size={13} /> Share</>}
          </button>
        </div>
      </div>

      {/* Keyboard hints */}
      <div className="flex flex-wrap gap-3 text-[10px] text-atlas-muted/60 font-mono">
        {[['Space','Play/Pause'],['← →','Step'],['R','Reset'],['Ctrl+Enter','Run Judge'],['Esc','Back']].map(([key, label]) => (
          <span key={key}><kbd>{key}</kbd> {label}</span>
        ))}
      </div>

      {/* Tab Navigation */}
      <DSATabNavigation activeTab={activeTab} onTabChange={t => { setActiveTab(t); navigate(`/problem/${problemId}/${t}`, { replace: true }) }} />

      {/* Tab Content */}
      <div className="min-h-[580px]">
        <AnimatePresence mode="wait">
          {activeTab === 'visualizer' && (
            <motion.div key="visualizer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DSALearningVisualizer
                problem={problem}
                code={code}
                onCodeChange={setCode}
                currentStep={steps[stepIndex] ?? steps[0]}
                stepIndex={stepIndex}
                steps={steps}
                isRunning={isRunning}
                onRun={handleRun}
                onPause={() => setIsRunning(false)}
                onStep={handleStepForward}
                onStepBack={handleStepBack}
                onReset={handleReset}
                speed={speed}
                onSpeedChange={setSpeed}
                language={language}
                onLanguageChange={setLanguage}
              />
            </motion.div>
          )}
          {activeTab === 'optimization' && (
            <motion.div key="opt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DSAOptimizationCoach problem={problem} />
            </motion.div>
          )}
          {activeTab === 'complexity' && (
            <motion.div key="comp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DSAVisualComplexityCoach problem={problem} />
            </motion.div>
          )}
          {activeTab === 'compare' && (
            <motion.div key="cmp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DSACompareSolutions problem={problem} />
            </motion.div>
          )}
          {activeTab === 'dashboard' && (
            <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DSAComplexityDashboard problem={problem} stepIndex={stepIndex} steps={steps} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
