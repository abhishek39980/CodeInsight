import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, BookOpen, Trophy, ArrowLeft, Terminal, LayoutGrid, Compass } from 'lucide-react'
import DSACatalogHome from './components/dsa/DSACatalogHome'
import DSARoadmapView from './components/dsa/DSARoadmapView'
import DSAProblemHeader from './components/dsa/DSAProblemHeader'
import DSATabNavigation from './components/dsa/DSATabNavigation'
import DSALearningVisualizer from './components/dsa/DSALearningVisualizer'
import DSAOptimizationCoach from './components/dsa/DSAOptimizationCoach'
import DSAVisualComplexityCoach from './components/dsa/DSAVisualComplexityCoach'
import DSACompareSolutions from './components/dsa/DSACompareSolutions'
import DSAComplexityDashboard from './components/dsa/DSAComplexityDashboard'
import { dsaProblems, getProblemById } from './engine/dsaProblems'
import { simulateExecution } from './engine/executor'
import { cn } from './utils/cn'

export default function App() {
  const [currentView, setCurrentView] = useState('catalog') // 'catalog' | 'roadmap' | 'problem'
  const [selectedProblemId, setSelectedProblemId] = useState('two-sum')
  const [activeTab, setActiveTab] = useState('visualizer')
  const [code, setCode] = useState('')
  const [steps, setSteps] = useState([])
  const [stepIndex, setStepIndex] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(1)

  const currentProblem = getProblemById(selectedProblemId)

  // Initialize code when problem changes
  useEffect(() => {
    if (currentProblem) {
      const defaultCode = currentProblem.optimalSolution?.code || currentProblem.bruteForce?.code || ''
      setCode(defaultCode)
      setStepIndex(0)
      setIsRunning(false)
      // Simulate execution steps for the visualizer
      try {
        const fullSource = `${defaultCode}\n// Execution trace`
        const res = simulateExecution(fullSource, {})
        if (res?.steps && res.steps.length > 0) {
          setSteps(res.steps)
        } else {
          setSteps([{ event: 'Algorithm Initialized', explanation: 'Ready to run interactive algorithm execution.' }])
        }
      } catch (err) {
        setSteps([{ event: 'Ready', explanation: 'Interactive learning mode ready.' }])
      }
    }
  }, [selectedProblemId, currentProblem])

  // Playback timer for visualizer
  useEffect(() => {
    if (!isRunning || steps.length <= 1) return
    const ms = Math.max(150, Math.floor(1000 / speed))
    const timer = window.setInterval(() => {
      setStepIndex((prev) => {
        if (prev + 1 >= steps.length) {
          setIsRunning(false)
          return prev
        }
        return prev + 1
      })
    }, ms)
    return () => clearInterval(timer)
  }, [isRunning, speed, steps.length])

  const handleSelectProblem = (id) => {
    setSelectedProblemId(id)
    setActiveTab('visualizer')
    setCurrentView('problem')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRun = () => {
    if (stepIndex >= steps.length - 1) {
      setStepIndex(0)
    }
    setIsRunning(true)
  }

  const handleStepForward = () => {
    setIsRunning(false)
    setStepIndex((prev) => Math.min(prev + 1, Math.max(0, steps.length - 1)))
  }

  const handleStepBack = () => {
    setIsRunning(false)
    setStepIndex((prev) => Math.max(0, prev - 1))
  }

  const handleReset = () => {
    setIsRunning(false)
    setStepIndex(0)
  }

  return (
    <div className="min-h-screen bg-atlas-bg0 text-atlas-text flex flex-col font-sans selection:bg-atlas-brand/30 selection:text-atlas-text">
      {/* Universal Top Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-atlas-muted/20 bg-atlas-bg0/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1580px] items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('catalog')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-500 text-white shadow-lg shadow-cyan-500/25 transition group-hover:scale-105">
                <Sparkles size={20} />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-widest text-atlas-muted block font-semibold">
                  Visual DSA Platform
                </span>
                <span className="font-display text-lg font-bold text-atlas-text group-hover:text-cyan-300 transition">
                  CodeInsight
                </span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('catalog')}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition',
                currentView === 'catalog'
                  ? 'border border-atlas-brand/60 bg-atlas-brand/20 text-atlas-text shadow-sm'
                  : 'border border-atlas-muted/20 bg-atlas-surface/60 text-atlas-muted hover:bg-atlas-elev hover:text-atlas-text'
              )}
            >
              <LayoutGrid size={14} />
              <span className="hidden sm:inline">Problem Catalog</span>
            </button>

            <button
              onClick={() => setCurrentView('roadmap')}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition',
                currentView === 'roadmap'
                  ? 'border border-cyan-500/60 bg-cyan-500/20 text-cyan-300 shadow-sm'
                  : 'border border-atlas-muted/20 bg-atlas-surface/60 text-atlas-muted hover:bg-atlas-elev hover:text-atlas-text'
              )}
            >
              <Compass size={14} />
              <span className="hidden sm:inline">120+ Topic Roadmap</span>
            </button>

            {currentView === 'problem' && currentProblem && (
              <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-mono text-emerald-300">
                <span>Learning:</span>
                <strong className="font-bold">{currentProblem.title}</strong>
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentView === 'catalog' && (
            <motion.div
              key="catalog"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <DSACatalogHome onSelectProblem={handleSelectProblem} onViewRoadmap={() => setCurrentView('roadmap')} />
            </motion.div>
          )}

          {currentView === 'roadmap' && (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <DSARoadmapView onSelectProblem={handleSelectProblem} />
            </motion.div>
          )}

          {currentView === 'problem' && (
            <motion.div
              key="problem"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="mx-auto max-w-[1580px] px-4 py-6 sm:px-6 lg:px-8 space-y-6"
            >
              {/* Problem Top Header */}
              <DSAProblemHeader
                problem={currentProblem}
                onBackToCatalog={() => setCurrentView('catalog')}
              />

              {/* Navigation Tabs */}
              <DSATabNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />

              {/* Active Tab View */}
              <div className="min-h-[580px]">
                {activeTab === 'visualizer' && (
                  <DSALearningVisualizer
                    problem={currentProblem}
                    code={code}
                    onCodeChange={setCode}
                    currentStep={steps[stepIndex] || steps[0]}
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
                  />
                )}

                {activeTab === 'optimization' && (
                  <DSAOptimizationCoach problem={currentProblem} />
                )}

                {activeTab === 'complexity' && (
                  <DSAVisualComplexityCoach problem={currentProblem} />
                )}

                {activeTab === 'compare' && (
                  <DSACompareSolutions problem={currentProblem} />
                )}

                {activeTab === 'dashboard' && (
                  <DSAComplexityDashboard
                    problem={currentProblem}
                    stepIndex={stepIndex}
                    steps={steps}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-atlas-muted/15 bg-atlas-bg0/90 py-6 mt-12">
        <div className="mx-auto max-w-[1580px] px-4 text-center text-xs text-atlas-muted sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            <strong className="text-atlas-text">CodeInsight</strong> — Visual DSA Algorithm Learning & Optimization Platform.
          </p>
          <div className="flex items-center gap-4 text-atlas-muted">
            <span>24 DSA Categories</span>
            <span>•</span>
            <span>Interactive Visualizations</span>
            <span>•</span>
            <span>Brute Force ➔ Optimal Coach</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
