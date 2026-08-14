import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, CheckCircle2, XCircle, Clock, AlertCircle, ChevronDown, ChevronUp, Terminal, Loader2, Plus, Trash2 } from 'lucide-react'
import { problemTestCases } from '../engine/testCases'
import { pistonExecute } from '../services/pistonService'
import { useProgressStore } from '../store/useProgressStore'
import { cn } from '../utils/cn'
import CodeRunnerWorker from '../workers/codeRunner.worker.js?worker'

function ResultRow({ result, idx }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className={cn(
        'rounded-xl border overflow-hidden',
        result.passed
          ? 'border-emerald-500/30 bg-emerald-500/8'
          : 'border-rose-500/30 bg-rose-500/8'
      )}
    >
      <button
        onClick={() => setExpanded(e => !e)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-left"
      >
        <div className="flex items-center gap-3">
          {result.passed
            ? <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
            : <XCircle size={15} className="text-rose-400 flex-shrink-0" />}
          <span className={cn('text-xs font-semibold', result.passed ? 'text-emerald-300' : 'text-rose-300')}>
            {result.label ?? `Test ${idx + 1}`}
          </span>
          {result.timeMs != null && (
            <span className="flex items-center gap-1 text-[10px] text-atlas-muted font-mono">
              <Clock size={10} /> {result.timeMs}ms
            </span>
          )}
        </div>
        {expanded ? <ChevronUp size={13} className="text-atlas-muted" /> : <ChevronDown size={13} className="text-atlas-muted" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="overflow-hidden border-t border-atlas-muted/15"
          >
            <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-3 text-xs font-mono">
              <div>
                <p className="text-atlas-muted mb-1 font-sans font-semibold text-[10px] uppercase">Input</p>
                <pre className="rounded-lg bg-atlas-bg0/60 p-2 text-atlas-text overflow-auto max-h-24 whitespace-pre-wrap">
                  {JSON.stringify(result.args ?? result.input, null, 2)}
                </pre>
              </div>
              <div>
                <p className="text-atlas-muted mb-1 font-sans font-semibold text-[10px] uppercase">Expected</p>
                <pre className="rounded-lg bg-atlas-bg0/60 p-2 text-emerald-300 overflow-auto max-h-24 whitespace-pre-wrap">
                  {JSON.stringify(result.expected, null, 2)}
                </pre>
              </div>
              <div>
                <p className="text-atlas-muted mb-1 font-sans font-semibold text-[10px] uppercase">Actual</p>
                <pre className={cn(
                  'rounded-lg bg-atlas-bg0/60 p-2 overflow-auto max-h-24 whitespace-pre-wrap',
                  result.passed ? 'text-emerald-300' : 'text-rose-300'
                )}>
                  {result.error
                    ? `Error: ${result.error}`
                    : result.actual !== undefined
                    ? JSON.stringify(result.actual, null, 2)
                    : '—'}
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function CodeJudgePanel({ problem, code, language }) {
  const [status, setStatus]       = useState('idle')  // idle | running | done | error
  const [results, setResults]     = useState([])
  const [allPassed, setAllPassed] = useState(false)
  const [judgeError, setJudgeError] = useState(null)
  const [stdout, setStdout]       = useState('')
  const [stderr, setStderr]       = useState('')
  const [customCases, setCustomCases] = useState([])
  const [newInput, setNewInput]   = useState('')
  const [newExpected, setNewExpected] = useState('')
  const workerRef = useRef(null)
  const markSolved = useProgressStore(s => s.markSolved)
  const tc = problem?.id ? problemTestCases[problem.id] : null

  const runJS = useCallback(() => {
    if (!tc) {
      setJudgeError('No test cases available for this problem yet.')
      setStatus('error')
      return
    }

    setStatus('running')
    setResults([])
    setAllPassed(false)
    setJudgeError(null)

    if (workerRef.current) workerRef.current.terminate()
    workerRef.current = new CodeRunnerWorker()

    // Build wrapCalls: generate template strings; the worker will substitute the found function name.
    // We use the placeholder string '__FOUND_FN__' which the worker replaces with the detected name.
    const wrapCallTemplates = tc.wrapper && tc.wrapCall
      ? tc.cases.map(c => tc.wrapCall('__FOUND_FN__', c.args))
      : null

    const allCases = [
      ...tc.cases,
      ...customCases.map(c => ({ ...c, compareMode: tc.compareMode ?? 'exact' })),
    ]

    workerRef.current.postMessage({
      code,
      fnNames: tc.fnNames,
      compareMode: tc.compareMode ?? 'exact',
      testCases: allCases,
      wrapper: tc.wrapper ?? '',
      wrapCallTemplates,
    })

    const timeout = setTimeout(() => {
      workerRef.current?.terminate()
      setJudgeError('Execution timed out (5s). Check for infinite loops.')
      setStatus('error')
    }, 6000)

    workerRef.current.onmessage = (e) => {
      clearTimeout(timeout)
      const { results: res, allPassed: ap, error } = e.data
      if (error) {
        setJudgeError(error)
        setStatus('error')
      } else {
        setResults(res)
        setAllPassed(ap)
        setStatus('done')
        if (ap) {
          markSolved(problem.id, problem.difficulty)
        }
      }
    }

    workerRef.current.onerror = (err) => {
      clearTimeout(timeout)
      setJudgeError(err.message)
      setStatus('error')
    }
  }, [code, tc, customCases, problem, markSolved])

  const runPiston = useCallback(async () => {
    setStatus('running')
    setStdout('')
    setStderr('')
    setJudgeError(null)
    const { stdout: out, stderr: err, exitCode, error } = await pistonExecute(
      language.piston, language.version, code
    )
    if (error) {
      setJudgeError(error)
      setStatus('error')
    } else {
      setStdout(out)
      setStderr(err)
      setStatus('done')
    }
  }, [code, language])

  const handleRun = () => {
    if (language?.id === 'javascript') runJS()
    else runPiston()
  }

  const addCustomCase = () => {
    if (!newInput.trim()) return
    try {
      const args = JSON.parse(`[${newInput}]`)
      const expected = newExpected.trim() ? JSON.parse(newExpected) : undefined
      setCustomCases(prev => [...prev, { args, expected, label: `Custom ${prev.length + 1}`, compareMode: tc?.compareMode ?? 'exact' }])
      setNewInput('')
      setNewExpected('')
    } catch {
      setJudgeError('Invalid JSON input. Use format: [2,7,11,15], 9')
    }
  }

  const isJS = language?.id === 'javascript'
  const passCount = results.filter(r => r.passed).length

  return (
    <div className="rounded-xl border border-atlas-muted/15 bg-atlas-surface overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-atlas-muted/10 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-atlas-muted" />
          <span className="text-xs font-medium text-atlas-text">Code Judge</span>
          {status === 'done' && isJS && (
            <span className={cn(
              'text-[11px] font-mono ml-1',
              allPassed ? 'text-emerald-400' : 'text-rose-400'
            )}>
              ({passCount}/{results.length} passed)
            </span>
          )}
        </div>
        <button
          id="code-judge-run-btn"
          onClick={handleRun}
          disabled={status === 'running'}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition',
            'bg-emerald-600 hover:bg-emerald-500',
            'disabled:opacity-40 disabled:cursor-not-allowed'
          )}
        >
          {status === 'running'
            ? <><Loader2 size={13} className="animate-spin" /> Running…</>
            : <><Play size={13} /> Run Code</>}
        </button>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {/* No test cases notice */}
        {!tc && isJS && (
          <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-300">
            <AlertCircle size={14} />
            <span>No automated test cases for this problem yet. Custom test cases coming soon!</span>
          </div>
        )}

        {/* Error */}
        {judgeError && (
          <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-300">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            <span>{judgeError}</span>
          </div>
        )}

        {/* JS Results */}
        {isJS && results.length > 0 && (
          <div className="space-y-2">
            {/* All passed banner */}
            {allPassed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/15 to-teal-500/10 p-4 text-center"
              >
                <p className="text-sm font-semibold text-emerald-400">All test cases passed</p>
                <p className="text-xs text-atlas-muted mt-1">
                  +{problem.difficulty === 'Hard' ? 50 : problem.difficulty === 'Medium' ? 25 : 10} XP earned
                </p>
              </motion.div>
            )}
            {results.map((r, i) => <ResultRow key={i} result={r} idx={i} />)}
          </div>
        )}

        {/* Piston stdout/stderr */}
        {!isJS && status === 'done' && (
          <div className="space-y-3">
            {stdout && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-atlas-muted mb-1.5">Output</p>
                <pre className="rounded-xl bg-atlas-bg0/60 border border-atlas-muted/15 p-4 text-xs font-mono text-emerald-300 overflow-auto max-h-48 whitespace-pre-wrap">
                  {stdout}
                </pre>
              </div>
            )}
            {stderr && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-1.5">Stderr</p>
                <pre className="rounded-xl bg-atlas-bg0/60 border border-rose-500/20 p-4 text-xs font-mono text-rose-300 overflow-auto max-h-32 whitespace-pre-wrap">
                  {stderr}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Custom test cases (JS only) */}
        {isJS && tc && (
          <details className="group">
            <summary className="cursor-pointer text-xs font-semibold text-atlas-muted hover:text-atlas-text transition list-none flex items-center gap-1.5 select-none">
              <Plus size={13} />
              <span>Add Custom Test Case</span>
            </summary>
            <div className="mt-3 space-y-2">
              {customCases.map((cc, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-mono text-atlas-muted">
                  <span className="flex-1 truncate">{JSON.stringify(cc.args)}</span>
                  <button onClick={() => setCustomCases(p => p.filter((_, j) => j !== i))}>
                    <Trash2 size={12} className="text-rose-400 hover:text-rose-300" />
                  </button>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={newInput}
                  onChange={e => setNewInput(e.target.value)}
                  placeholder="Args (JSON): [1,2,3], 5"
                  className="rounded-lg border border-atlas-muted/30 bg-atlas-bg0/60 px-3 py-2 text-xs font-mono text-atlas-text placeholder-atlas-muted outline-none focus:border-atlas-brand/50"
                />
                <input
                  value={newExpected}
                  onChange={e => setNewExpected(e.target.value)}
                  placeholder="Expected: [0,1]"
                  className="rounded-lg border border-atlas-muted/30 bg-atlas-bg0/60 px-3 py-2 text-xs font-mono text-atlas-text placeholder-atlas-muted outline-none focus:border-atlas-brand/50"
                />
              </div>
              <button
                onClick={addCustomCase}
                className="text-xs font-semibold text-atlas-brand hover:underline"
              >
                + Add Case
              </button>
            </div>
          </details>
        )}
      </div>
    </div>
  )
}
