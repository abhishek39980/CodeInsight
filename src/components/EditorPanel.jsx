import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Editor from '@monaco-editor/react'
import Panel from './Panel'

const EDITOR_THEME = 'codeinsight-cyber'

const EditorPanel = ({ code, onCodeChange, activeLine, loadingExample, language, hotLines = [], errorLine, isComplete }) => {
  const editorRef = useRef(null)
  const decorationRef = useRef([])
  const [scrollTop, setScrollTop] = useState(0)

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) {
      return
    }

    const heatDecorations = hotLines.map((item) => ({
      range: {
        startLineNumber: item.line,
        startColumn: 1,
        endLineNumber: item.line,
        endColumn: 1,
      },
      options: {
        isWholeLine: true,
        className: item.intensity > 0.66 ? 'codeinsight-heat-hot' : item.intensity > 0.33 ? 'codeinsight-heat-warm' : 'codeinsight-heat-cool',
      },
    }))

    const activeDecoration = activeLine
      ? [{
          range: {
            startLineNumber: activeLine,
            startColumn: 1,
            endLineNumber: activeLine,
            endColumn: 1,
          },
          options: {
            isWholeLine: true,
            className: 'codeinsight-active-line',
            // removed glyph margin since we are using the 3D Cursor Drone
          },
        }]
      : []

    const errorDecoration = errorLine
      ? [{
          range: {
            startLineNumber: errorLine,
            startColumn: 1,
            endLineNumber: errorLine,
            endColumn: 1,
          },
          options: {
            isWholeLine: true,
            className: 'codeinsight-error-line',
          },
        }]
      : []

    decorationRef.current = editor.deltaDecorations(decorationRef.current, [...heatDecorations, ...activeDecoration, ...errorDecoration])
    
    // Smooth scroll to active line
    if (activeLine) {
      editor.revealLineInCenterIfOutsideViewport(activeLine, 0) // 0 = Smooth scrolling animation
    }
  }, [activeLine, hotLines, errorLine])

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor
    editor.onDidScrollChange((e) => {
      setScrollTop(e.scrollTop)
    })
  }

  const handleBeforeMount = (monaco) => {
    monaco.editor.defineTheme(EDITOR_THEME, {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '5B6270' },
        { token: 'keyword', foreground: 'BC13FE' },
        { token: 'number', foreground: 'BFFF00' },
        { token: 'string', foreground: '8CD9A5' },
        { token: 'identifier', foreground: 'D4D8DE' },
      ],
      colors: {
        'editor.background': '#00000000', // transparent so panel background shows
        'editor.foreground': '#CED2DA',
        'editorLineNumber.foreground': '#464B56',
        'editorLineNumber.activeForeground': '#bfff00',
        'editorGutter.background': '#00000000',
        'editorCursor.foreground': '#bfff00',
        'editor.selectionBackground': '#bc13fe4D',
        'editor.inactiveSelectionBackground': '#bc13fe22',
        'editor.lineHighlightBackground': '#1117224D',
      },
    })
  }

  // Calculate the vertical position of the drone: Base Padding (16) + (Line Index * Line Height 24) - Scroll
  const droneY = activeLine ? 16 + (activeLine - 1) * 24 - scrollTop : null

  return (
    <Panel title="Code Trace" subtitle="Monaco editor with synchronized execution overlays" className="h-[540px] xl:h-full">
      <motion.div 
        animate={{ 
          boxShadow: (isComplete && !errorLine) ? "0 0 30px rgba(188, 19, 254, 0.15)" : "0 0 0px rgba(188, 19, 254, 0)",
          borderColor: (isComplete && !errorLine) ? "rgba(188, 19, 254, 0.4)" : "rgba(255, 255, 255, 0.1)"
        }}
        transition={{ duration: 1 }}
        className="relative h-full overflow-hidden rounded-md border"
      >
        <Editor
          value={code}
          onChange={(value) => onCodeChange(value || '')}
          language={language}
          theme={EDITOR_THEME}
          beforeMount={handleBeforeMount}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontFamily: "'JetBrains Mono', monospace",
            fontLigatures: true,
            fontSize: 14,
            lineHeight: 24,
            smoothScrolling: true,
            padding: { top: 16, bottom: 20 },
            glyphMargin: false,
            scrollBeyondLastLine: false,
            renderLineHighlight: 'all',
          }}
        />

        {/* The Execution Ghost / Cursor Drone */}
        {activeLine && (
          <div
            className="absolute left-2 top-0 z-[25] pointer-events-none text-[#bfff00] drop-shadow-[0_0_8px_rgba(191,255,0,0.8)] transition-transform duration-200 ease-out will-change-transform"
            style={{ transform: `translateY(${droneY}px)` }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
        )}

        <AnimatePresence>
          {loadingExample && (
            <motion.div
              className="absolute inset-0 z-10 grid place-items-center bg-[#08090f]/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="rounded-xl border border-sky-400/30 bg-sky-500/10 px-4 py-2 text-xs tracking-[0.14em] text-sky-200"
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.98, opacity: 0 }}
              >
                LOADING EXAMPLE
              </motion.div>
            </motion.div>
          )}

          {isComplete && !errorLine && !loadingExample && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col items-center justify-center gap-2 rounded-xl bg-[#050505]/90 border border-[#bfff00]/30 px-8 py-6 shadow-[0_0_60px_rgba(191,255,0,0.2)] backdrop-blur-xl"
            >
              <div className="text-4xl mb-2 flex gap-3 text-[#bfff00]">
                <motion.svg animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></motion.svg>
              </div>
              <h2 className="text-xl font-bold font-mono tracking-widest text-[#bc13fe]">SYSTEM RUN COMPLETE</h2>
              <p className="text-sm font-medium text-[#bfff00]/80 uppercase tracking-widest mt-1">NO ANOMALIES DETECTED</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Panel>
  )
}

export default EditorPanel
