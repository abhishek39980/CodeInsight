import { useEffect, useMemo, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Editor from '@monaco-editor/react'
import { motionTokens } from '../../atlas/motion'
import { cn } from '../../utils/cn'

const THEME_ID = 'atlas-editor-theme'

const eventTone = {
  call: 'bg-atlas-call/20 text-atlas-call',
  return: 'bg-atlas-loop/20 text-atlas-loop',
  heap: 'bg-atlas-mutation/20 text-atlas-mutation',
  loop: 'bg-atlas-loop/20 text-atlas-loop',
  branch: 'bg-atlas-ref/20 text-atlas-ref',
  error: 'bg-atlas-error/25 text-atlas-error',
  reference: 'bg-atlas-ref/20 text-atlas-ref',
  output: 'bg-atlas-brand/20 text-atlas-brand',
  async: 'bg-atlas-ref/20 text-atlas-ref',
  scope: 'bg-atlas-muted/20 text-atlas-muted',
  execution: 'bg-atlas-muted/15 text-atlas-muted',
  declare: 'bg-atlas-muted/15 text-atlas-muted',
}

const atlasEditorTheme = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '78879B' },
    { token: 'keyword', foreground: '7EA2FF' },
    { token: 'number', foreground: 'FF9F75' },
    { token: 'string', foreground: '6FD2A8' },
    { token: 'identifier', foreground: 'EAF0F8' },
  ],
  colors: {
    'editor.background': '#00000000',
    'editor.foreground': '#EAF0F8',
    'editorLineNumber.foreground': '#607186',
    'editorLineNumber.activeForeground': '#B9C8DB',
    'editorGutter.background': '#00000000',
    'editorCursor.foreground': '#7EA2FF',
    'editor.selectionBackground': '#4C7DFF4D',
    'editor.inactiveSelectionBackground': '#4C7DFF25',
    'editor.lineHighlightBackground': '#202b3833',
  },
}

const compactValue = (value) => (value.length > 18 ? `${value.slice(0, 18)}...` : value)

const AtlasTimelineScene = ({
  code,
  onCodeChange,
  language,
  loadingExample,
  currentStep,
  previousStep,
  nextStep,
  selectedEntity,
  astHighlightedLine,
  focusMode,
  onSelectEntity,
  onHoverEntity,
}) => {
  const editorRef = useRef(null)
  const decorationsRef = useRef([])

  const topFrame = currentStep?.callStack?.[currentStep.callStack.length - 1] || null
  const orderedFrames = useMemo(() => [...(currentStep?.callStack || [])].reverse(), [currentStep?.callStack])
  const visibleFrames = orderedFrames.slice(0, 3)
  const hiddenFrames = Math.max(0, orderedFrames.length - visibleFrames.length)

  useEffect(() => {
    const editor = editorRef.current
    if (!editor || !currentStep) return

    const mutationLines = (currentStep.updates || []).map(() => currentStep.line).filter(Boolean)
    const mutatedDecorations = mutationLines.map((line) => ({
      range: {
        startLineNumber: line,
        startColumn: 1,
        endLineNumber: line,
        endColumn: 1,
      },
      options: {
        isWholeLine: true,
        className: 'atlas-mutated-line',
      },
    }))

    const activeDecoration = currentStep.line
      ? [{
          range: {
            startLineNumber: currentStep.line,
            startColumn: 1,
            endLineNumber: currentStep.line,
            endColumn: 1,
          },
          options: { isWholeLine: true, className: currentStep.eventType === 'error' ? 'atlas-error-line' : 'atlas-active-line' },
        }]
      : []

    const ghostDecorations = [previousStep?.line, nextStep?.line]
      .filter(Boolean)
      .map((line) => ({
        range: {
          startLineNumber: line,
          startColumn: 1,
          endLineNumber: line,
          endColumn: 1,
        },
        options: { isWholeLine: true, className: 'atlas-ghost-line' },
      }))

    const astDecoration = astHighlightedLine
      ? [{
          range: {
            startLineNumber: astHighlightedLine,
            startColumn: 1,
            endLineNumber: astHighlightedLine,
            endColumn: 1,
          },
          options: { isWholeLine: true, className: 'atlas-ast-line' },
        }]
      : []

    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      [...ghostDecorations, ...mutatedDecorations, ...astDecoration, ...activeDecoration],
    )

    if (currentStep.line) {
      editor.revealLineInCenterIfOutsideViewport(currentStep.line, 0)
    }
  }, [astHighlightedLine, currentStep, previousStep?.line, nextStep?.line])

  const handleBeforeMount = (monaco) => {
    monaco.editor.defineTheme(THEME_ID, atlasEditorTheme)
  }

  const selectedTone = currentStep?.eventType ? eventTone[currentStep.eventType] || eventTone.execution : eventTone.execution

  return (
    <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="atlas-surface flex min-h-[520px] flex-col p-3">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-atlas-muted">Execution Scene</p>
            <h2 className="text-lg font-semibold">Live Code Timeline</h2>
          </div>
          {currentStep ? (
            <span className={cn('rounded-full px-3 py-1 text-xs', selectedTone)}>
              {currentStep.event}
            </span>
          ) : null}
        </div>
        <div className="atlas-elevated relative flex-1 overflow-hidden p-2">
          <Editor
            value={code}
            onChange={(value) => onCodeChange(value || '')}
            language={language}
            theme={THEME_ID}
            beforeMount={handleBeforeMount}
            onMount={(editor) => {
              editorRef.current = editor
            }}
            options={{
              minimap: { enabled: false },
              smoothScrolling: true,
              glyphMargin: false,
              scrollBeyondLastLine: false,
              lineHeight: 22,
              fontSize: 14,
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              padding: { top: 14, bottom: 18 },
            }}
          />
          <AnimatePresence>
            {loadingExample && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 grid place-items-center bg-atlas-bg0/70 backdrop-blur-sm"
              >
                <div className="rounded-xl border border-atlas-brand/30 bg-atlas-brand/12 px-4 py-2 text-sm text-atlas-text">
                  Loading example...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="atlas-surface flex h-full flex-col p-3">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Frame & Variable Focus</h3>
          {hiddenFrames > 0 ? <span className="text-xs text-atlas-muted">+{hiddenFrames} collapsed</span> : null}
        </div>

        <div className="atlas-scrollbar flex-1 space-y-2 overflow-auto pr-1">
          {visibleFrames.map((frame, idx) => {
            const depth = visibleFrames.length - idx
            const isTop = idx === 0
            return (
              <motion.div
                key={frame.id}
                layout
                layoutId={`frame:${frame.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: focusMode && !isTop ? 0.35 : 1, y: 0 }}
                transition={motionTokens.sceneSpring}
                className={cn(
                  'rounded-2xl border border-atlas-muted/25 bg-atlas-surface/70 p-3',
                  isTop && 'border-atlas-brand/40 bg-atlas-brand/10',
                )}
                style={{ transform: `translateY(${-depth * 3}px)` }}
              >
                <p className="mb-2 text-xs font-medium text-atlas-text">{frame.name}</p>
                <div className="flex flex-wrap gap-1.5">
                  {frame.vars.map((entry) => {
                    const entityId = `var:${frame.name}:${entry.name}`
                    const active = selectedEntity === entityId
                    return (
                      <motion.button
                        key={`${frame.id}:${entry.name}`}
                        layoutId={entityId}
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        onMouseEnter={() => onHoverEntity(entityId)}
                        onMouseLeave={() => onHoverEntity(null)}
                        onClick={() =>
                          onSelectEntity({
                            type: 'variable',
                            scope: frame.name,
                            name: entry.name,
                            label: `${frame.name}.${entry.name}`,
                            entityId,
                          })
                        }
                        className={cn(
                          'rounded-full border px-2.5 py-1 text-[11px] transition',
                          active
                            ? 'border-atlas-brand/65 bg-atlas-brand/25 text-atlas-text'
                            : 'border-atlas-muted/30 bg-atlas-surface text-atlas-muted hover:border-atlas-muted/60 hover:text-atlas-text',
                        )}
                      >
                        {entry.name}: <span className="font-mono">{compactValue(entry.label)}</span>
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-3 atlas-elevated p-3">
          <p className="text-xs text-atlas-muted">Ghost States</p>
          <div className="mt-1 space-y-1 text-xs">
            <p className="text-atlas-muted">
              Previous: <span className="text-atlas-text">{previousStep?.event || 'None'}</span>
            </p>
            <p className="text-atlas-muted">
              Next: <span className="text-atlas-text">{nextStep?.event || 'None'}</span>
            </p>
            {topFrame ? (
              <p className="text-atlas-muted">
                Active frame: <span className="text-atlas-text">{topFrame.name}</span>
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AtlasTimelineScene
