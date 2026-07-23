import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import AtlasCommandRail from './components/atlas/AtlasCommandRail'
import AtlasInspectorOrb from './components/atlas/AtlasInspectorOrb'
import AtlasNarrativeDock from './components/atlas/AtlasNarrativeDock'
import AtlasSceneCanvas from './components/atlas/AtlasSceneCanvas'
import AtlasTimeRail from './components/atlas/AtlasTimeRail'
import { codeExamples, defaultExampleId, supportedLanguages } from './engine/examples'
import { buildInspectorContext } from './engine/explainers'
import { simulateExecution } from './engine/executor'
import { buildStepCaption, isLowSignalStep } from './engine/story'

const getExampleById = (id) => codeExamples.find((example) => example.id === id) || codeExamples[0]
const getFirstExampleByLanguage = (language) => codeExamples.find((example) => example.language === language)
const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

function App() {
  const initial = getExampleById(defaultExampleId)
  const runtimeRef = useRef(null)

  const [selectedLanguage, setSelectedLanguage] = useState(initial.language)
  const [selectedExample, setSelectedExample] = useState(initial.id)
  const [code, setCode] = useState(initial.code)
  const [steps, setSteps] = useState([])
  const [stepIndex, setStepIndex] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [error, setError] = useState(null)
  const [loadingExample, setLoadingExample] = useState(false)
  const [isDirty, setIsDirty] = useState(true)
  const [selection, setSelection] = useState(null)
  const [hoverEntity, setHoverEntity] = useState(null)
  const [bookmarks, setBookmarks] = useState(new Set())
  const [mode, setMode] = useState('explore')
  const [view, setView] = useState('timeline')
  const [focusMode, setFocusMode] = useState(false)
  const [beginnerMode, setBeginnerMode] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [variableHistoryIndex, setVariableHistoryIndex] = useState({})
  const [loopClusters, setLoopClusters] = useState([])
  const [astArtifacts, setAstArtifacts] = useState({
    rootId: null,
    root: null,
    nodesById: {},
    lineToNodeIds: {},
    orderedNodeIds: [],
  })
  const [complexityReport, setComplexityReport] = useState(null)
  const [synchronizationLayer, setSynchronizationLayer] = useState(null)
  const [runtimeMeta, setRuntimeMeta] = useState(null)
  const [pointerTags, setPointerTags] = useState(new Set())
  const [selectedAstNodeId, setSelectedAstNodeId] = useState(null)

  const filteredExamples = useMemo(
    () => codeExamples.filter((example) => example.language === selectedLanguage),
    [selectedLanguage],
  )

  const currentStep = steps[stepIndex] || null
  const previousStep = stepIndex > 0 ? steps[stepIndex - 1] : null
  const nextStep = stepIndex < steps.length - 1 ? steps[stepIndex + 1] : null

  const stepIndexById = useMemo(() => {
    const map = new Map()
    steps.forEach((step, index) => {
      map.set(step.id, index)
    })
    return map
  }, [steps])

  const compileCode = () => {
    const result = simulateExecution(code, selectedLanguage)
    runtimeRef.current = result
    setSteps(result.steps || [])
    setVariableHistoryIndex(result.variableHistoryIndex || {})
    setLoopClusters(result.loopClusters || [])
    setAstArtifacts(result.astArtifacts || {
      rootId: null,
      root: null,
      nodesById: {},
      lineToNodeIds: {},
      orderedNodeIds: [],
    })
    setComplexityReport(result.complexityReport || null)
    setSynchronizationLayer(result.synchronizationLayer || null)
    setRuntimeMeta(result.runtimeMeta || null)
    setStepIndex(0)
    setError(result.error)
    setBookmarks(new Set())
    setSelectedAstNodeId(null)
    setIsDirty(false)
    return result
  }

  const ensureCompiled = () => {
    if (!isDirty && runtimeRef.current) {
      return runtimeRef.current
    }
    return compileCode()
  }

  const findStepByDirection = useCallback((startIndex, direction) => {
    let cursor = startIndex + direction
    const shouldFilterLowSignal = mode === 'story' && beginnerMode

    while (cursor >= 0 && cursor < steps.length) {
      if (!shouldFilterLowSignal || !isLowSignalStep(steps[cursor])) {
        return cursor
      }
      cursor += direction
    }

    return clamp(cursor, 0, Math.max(0, steps.length - 1))
  }, [beginnerMode, mode, steps])

  const handleRun = (fromIndex = null) => {
    const result = ensureCompiled()
    if (!result.ok) {
      setIsRunning(false)
      return
    }

    if (typeof fromIndex === 'number') {
      setStepIndex(clamp(fromIndex, 0, result.steps.length - 1))
    }
    setIsRunning(true)
  }

  const handlePause = () => setIsRunning(false)

  const handleStep = () => {
    const result = ensureCompiled()
    if (!result.ok) return
    setStepIndex((prev) => findStepByDirection(prev, 1))
  }

  const handleStepBack = () => {
    ensureCompiled()
    setStepIndex((prev) => findStepByDirection(prev, -1))
  }

  const handleReset = () => {
    setIsRunning(false)
    setStepIndex(0)
  }

  const applyExample = (exampleId, language) => {
    setIsRunning(false)
    setLoadingExample(true)

    window.setTimeout(() => {
      const example = getExampleById(exampleId)
      setSelectedLanguage(language)
      setSelectedExample(exampleId)
      setCode(example.code)
      setSteps([])
      setVariableHistoryIndex({})
      setLoopClusters([])
      setAstArtifacts({
        rootId: null,
        root: null,
        nodesById: {},
        lineToNodeIds: {},
        orderedNodeIds: [],
      })
      setComplexityReport(null)
      setSynchronizationLayer(null)
      setRuntimeMeta(null)
      setPointerTags(new Set())
      setSelectedAstNodeId(null)
      setStepIndex(0)
      setError(null)
      runtimeRef.current = null
      setSelection(null)
      setHoverEntity(null)
      setBookmarks(new Set())
      setIsDirty(true)
      setLoadingExample(false)
    }, 240)
  }

  const handleLoadExample = (exampleId) => applyExample(exampleId, selectedLanguage)

  const handleLanguageChange = (language) => {
    const next = getFirstExampleByLanguage(language)
    if (!next) return
    applyExample(next.id, language)
  }

  useEffect(() => {
    if (!isRunning || steps.length === 0) {
      return undefined
    }

    const ms = Math.max(80, 680 / speed)
    const timer = window.setInterval(() => {
      setStepIndex((current) => {
        if (current >= steps.length - 1) {
          setIsRunning(false)
          return current
        }

        const nextPlayable = findStepByDirection(current, 1)
        if (nextPlayable <= current || nextPlayable >= steps.length - 1) {
          if (nextPlayable >= steps.length - 1) {
            setIsRunning(false)
          }
          return clamp(nextPlayable, 0, steps.length - 1)
        }
        return nextPlayable
      })
    }, ms)

    return () => window.clearInterval(timer)
  }, [findStepByDirection, isRunning, speed, steps])

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag) || document.activeElement?.classList.contains('inputarea')) {
        return
      }

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault()
        setIsRunning((prev) => !prev)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleStep()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handleStepBack()
      } else if (e.key === 'r' || e.key === 'R') {
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault()
          handleReset()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleStep, handleStepBack, isRunning])

  const selectedEntityId = selection?.entityId || null

  const selectedLifecycleIndices = useMemo(() => {
    if (!selectedEntityId) return []
    return (variableHistoryIndex[selectedEntityId] || [])
      .map((id) => stepIndexById.get(id))
      .filter((index) => Number.isInteger(index))
  }, [selectedEntityId, variableHistoryIndex, stepIndexById])

  const hoverLifecycleIndices = useMemo(() => {
    if (!hoverEntity) return []
    return (variableHistoryIndex[hoverEntity] || [])
      .map((id) => stepIndexById.get(id))
      .filter((index) => Number.isInteger(index))
  }, [hoverEntity, variableHistoryIndex, stepIndexById])

  const importantIndices = useMemo(
    () => steps.map((step, index) => (step.isImportant ? index : -1)).filter((index) => index >= 0),
    [steps],
  )

  const inspectorContext = useMemo(
    () => buildInspectorContext(steps, stepIndex, selection),
    [steps, stepIndex, selection],
  )

  const onSeekStepById = (id) => {
    const nextIndex = stepIndexById.get(id)
    if (nextIndex == null) return
    setIsRunning(false)
    setStepIndex(nextIndex)
  }

  const onSeekByAstNode = (nodeId) => {
    if (!nodeId) return
    const stepIds = synchronizationLayer?.nodeToStepIds?.[nodeId]
    if (!stepIds?.length) return
    onSeekStepById(stepIds[0])
  }

  const onTogglePointerTag = (entityId) => {
    setPointerTags((previous) => {
      const next = new Set(previous)
      if (next.has(entityId)) {
        next.delete(entityId)
      } else {
        next.add(entityId)
      }
      return next
    })
  }

  const handleToggleBookmark = (index) => {
    setBookmarks((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const handleFindVariable = () => {
    if (!searchValue.trim()) return
    const query = searchValue.trim().toLowerCase()
    const step = currentStep || steps[0]
    const frameMatch = step?.callStack?.find((frame) =>
      frame.vars.some((entry) => entry.name.toLowerCase().includes(query)),
    )
    const variableMatch = frameMatch?.vars.find((entry) => entry.name.toLowerCase().includes(query))

    if (frameMatch && variableMatch) {
      setSelection({
        type: 'variable',
        scope: frameMatch.name,
        name: variableMatch.name,
        label: `${frameMatch.name}.${variableMatch.name}`,
        entityId: `var:${frameMatch.name}:${variableMatch.name}`,
      })
      setView('timeline')
      setFocusMode(true)
      return
    }

    const heapMatch = step?.heap?.find((node) => String(node.id).toLowerCase() === query.replace('#', ''))
    if (heapMatch) {
      setSelection({
        type: 'heap',
        id: heapMatch.id,
        label: `#${heapMatch.id}`,
        entityId: `heap:${heapMatch.id}`,
      })
      setView('memory')
      setFocusMode(true)
    }
  }

  const milestone = useMemo(() => {
    if (!currentStep) return ''
    if (currentStep.eventType === 'loop' && currentStep.meta?.condition === false) {
      return `Milestone: loop completed after ${currentStep.meta.iteration || 0} iterations.`
    }
    if (currentStep.eventType === 'return' && currentStep.meta?.functionName) {
      return `Milestone: ${currentStep.meta.functionName} returned ${currentStep.meta.returnValue}.`
    }
    if (currentStep.eventType === 'heap') {
      return 'Milestone: mutation origin captured.'
    }
    if (stepIndex === steps.length - 1 && steps.length > 0) {
      return 'Milestone: execution reached final state.'
    }
    return ''
  }, [currentStep, stepIndex, steps.length])

  const runtimeBadge = runtimeMeta?.plugin ? ` - runtime ${runtimeMeta.plugin}` : ''
  const stepMeta = steps.length ? `Step ${stepIndex + 1} of ${steps.length}${runtimeBadge}` : 'Run code to begin.'
  const editorLanguage = selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage

  return (
    <div className="relative min-h-screen">
      <main className="mx-auto flex min-h-screen w-full max-w-[1720px] flex-col gap-4 px-4 pb-6 pt-5 lg:px-6">
        <div className="px-1">
          <p className="text-[11px] uppercase tracking-[0.18em] text-atlas-muted">CodeInsight</p>
          <h1 className="font-display text-[30px] font-semibold leading-[1.15]">
            Atlas: Visual Storytelling Engine for Code
          </h1>
          <p className="mt-1 text-sm text-atlas-muted">{stepMeta}</p>
        </div>

        <AtlasCommandRail
          isRunning={isRunning}
          canRun={code.trim().length > 0}
          speed={speed}
          onRun={() => handleRun()}
          onPause={handlePause}
          onStep={handleStep}
          onStepBack={handleStepBack}
          onReset={handleReset}
          onSpeedChange={setSpeed}
          mode={mode}
          onModeChange={setMode}
          view={view}
          onViewChange={setView}
          selectedLanguage={selectedLanguage}
          languages={supportedLanguages}
          onLanguageChange={handleLanguageChange}
          selectedExample={selectedExample}
          examples={filteredExamples}
          onLoadExample={handleLoadExample}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onFindVariable={handleFindVariable}
          focusMode={focusMode}
          onToggleFocusMode={() => setFocusMode((value) => !value)}
          beginnerMode={beginnerMode}
          onToggleBeginnerMode={() => setBeginnerMode((value) => !value)}
        />

        <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_370px]">
          <AtlasSceneCanvas
            view={view}
            code={code}
            onCodeChange={(value) => {
              setCode(value)
              setIsDirty(true)
              setIsRunning(false)
              setError(null)
            }}
            language={editorLanguage}
            loadingExample={loadingExample}
            currentStep={currentStep}
            previousStep={previousStep}
            nextStep={nextStep}
            selectedEntity={selectedEntityId}
            hoverEntity={hoverEntity}
            pointerTags={pointerTags}
            focusMode={focusMode}
            astArtifacts={astArtifacts}
            complexityReport={complexityReport}
            selectedAstNodeId={selectedAstNodeId}
            onSelectAstNode={setSelectedAstNodeId}
            onSeekByAstNode={onSeekByAstNode}
            onClearAstSelection={() => setSelectedAstNodeId(null)}
            onTogglePointerTag={onTogglePointerTag}
            onSelectEntity={setSelection}
            onHoverEntity={setHoverEntity}
          />

          <AtlasNarrativeDock
            mode={mode}
            beginnerMode={beginnerMode}
            currentStep={currentStep}
            stepIndex={stepIndex}
            totalSteps={steps.length}
            selected={selection}
            inspectorContext={inspectorContext}
            steps={steps}
            onSeekStep={onSeekStepById}
            onClearSelection={() => setSelection(null)}
            milestone={milestone}
          />
        </div>

        <AtlasTimeRail
          steps={steps}
          currentIndex={stepIndex}
          onSeek={(index) => {
            setIsRunning(false)
            setStepIndex(index)
          }}
          onReplayFrom={(index) => handleRun(index)}
          bookmarks={bookmarks}
          onToggleBookmark={handleToggleBookmark}
          loopClusters={loopClusters}
          lifecycleIndices={selectedLifecycleIndices}
          hoverLifecycleIndices={hoverLifecycleIndices}
          importantIndices={importantIndices}
        />
      </main>

      <AtlasInspectorOrb selected={selection} inspectorContext={inspectorContext} onSeekStep={onSeekStepById} />

      <AnimatePresence>
        {isDirty ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed right-6 top-6 rounded-xl border border-atlas-ember/35 bg-atlas-ember/20 px-3 py-2 text-xs text-atlas-text"
          >
            Code changed. Run to refresh Atlas execution.
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {error ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 left-1/2 z-50 w-[min(680px,90vw)] -translate-x-1/2 rounded-2xl border border-atlas-error/45 bg-atlas-error/20 px-4 py-3 text-sm text-atlas-text"
          >
            {buildStepCaption(currentStep, beginnerMode)}
            <p className="mt-1 text-xs text-atlas-muted">Error: {error}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default App
