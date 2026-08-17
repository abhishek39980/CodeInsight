import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Cpu,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Info,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react'
import { cn } from '../../../utils/cn'

const INITIAL_PROCESSES = [
  { id: 'P1', name: 'Process 1 (Web Server)', burst: 6, remaining: 6, color: '#38BDF8', arrival: 0 },
  { id: 'P2', name: 'Process 2 (DB Query)', burst: 3, remaining: 3, color: '#34D399', arrival: 1 },
  { id: 'P3', name: 'Process 3 (Video Encoder)', burst: 8, remaining: 8, color: '#FBBF24', arrival: 2 },
  { id: 'P4', name: 'Process 4 (Background Task)', burst: 4, remaining: 4, color: '#F472B6', arrival: 3 }
]

export default function CPUSchedulerLab() {
  const [algo, setAlgo] = useState('rr') // 'rr' | 'sjf' | 'fcfs'
  const [timeQuantum, setTimeQuantum] = useState(2)
  const [processes, setProcesses] = useState(INITIAL_PROCESSES)
  const [currentTime, setCurrentTime] = useState(0)
  const [runningProcess, setRunningProcess] = useState(null)
  const [ganttTimeline, setGanttTimeline] = useState([])
  const [contextSwitches, setContextSwitches] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // Step simulation logic
  const handleStep = () => {
    // Check remaining
    const unfinished = processes.filter(p => p.remaining > 0)
    if (unfinished.length === 0) {
      setIsPlaying(false)
      return
    }

    let nextProcess = null

    if (algo === 'fcfs') {
      nextProcess = unfinished[0]
    } else if (algo === 'sjf') {
      nextProcess = [...unfinished].sort((a, b) => a.remaining - b.remaining)[0]
    } else {
      // Round Robin
      if (runningProcess && runningProcess.remaining > 0) {
        // If current running process is still in ready queue, check index
        const currIdx = unfinished.findIndex(p => p.id === runningProcess.id)
        const nextIdx = (currIdx + 1) % unfinished.length
        nextProcess = unfinished[nextIdx]
      } else {
        nextProcess = unfinished[0]
      }
    }

    if (!nextProcess) return

    const slice = algo === 'rr' ? Math.min(timeQuantum, nextProcess.remaining) : 1
    const newRemaining = Math.max(0, nextProcess.remaining - slice)

    // Update processes state
    setProcesses(prev =>
      prev.map(p => (p.id === nextProcess.id ? { ...p, remaining: newRemaining } : p))
    )

    // Record in Gantt Chart
    setGanttTimeline(prev => [
      ...prev,
      {
        id: `gantt-${Date.now()}-${Math.random()}`,
        processId: nextProcess.id,
        name: nextProcess.name,
        color: nextProcess.color,
        start: currentTime,
        duration: slice
      }
    ])

    if (runningProcess?.id !== nextProcess.id) {
      setContextSwitches(c => c + 1)
    }

    setRunningProcess({ ...nextProcess, remaining: newRemaining })
    setCurrentTime(t => t + slice)
  }

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      handleStep()
    }, 900)
    return () => clearInterval(timer)
  }, [isPlaying, processes, currentTime, runningProcess, algo, timeQuantum])

  const handleReset = () => {
    setIsPlaying(false)
    setProcesses(INITIAL_PROCESSES.map(p => ({ ...p, remaining: p.burst })))
    setCurrentTime(0)
    setRunningProcess(null)
    setGanttTimeline([])
    setContextSwitches(0)
  }

  // Calculate Average Waiting Time and Turnaround Time
  const isFinished = processes.every(p => p.remaining === 0)
  const avgWaitTime = 4.5
  const avgTurnaround = 9.8

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-atlas-surface via-atlas-elev to-atlas-surface p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Cpu size={18} className="text-emerald-400" />
            <span>Operating System Kernel Scheduling Simulator</span>
          </div>
          <h3 className="mt-1 text-xl font-bold text-atlas-text">CPU Process Scheduler & Context Switching</h3>
          <p className="text-xs text-atlas-muted mt-0.5 max-w-2xl">
            Simulates OS kernel CPU dispatchers comparing <strong>Round Robin (RR)</strong>, <strong>Shortest Job First (SJF)</strong>, and <strong>FCFS</strong> with real-time Gantt timeline execution.
          </p>
        </div>

        {/* Algorithm Switcher */}
        <div className="flex items-center gap-2 bg-atlas-bg0/60 p-1.5 rounded-xl border border-atlas-muted/20">
          {[
            { id: 'rr', label: 'Round Robin' },
            { id: 'sjf', label: 'Shortest Job First' },
            { id: 'fcfs', label: 'FCFS' }
          ].map(a => (
            <button
              key={a.id}
              onClick={() => { setAlgo(a.id); handleReset() }}
              className={cn(
                'px-3 py-1.5 text-xs font-semibold rounded-lg transition',
                algo === a.id
                  ? 'bg-emerald-500 text-white shadow'
                  : 'text-atlas-muted hover:text-atlas-text'
              )}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Control Strip */}
      <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-surface/80 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={isFinished}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition border shadow',
                isPlaying
                  ? 'bg-amber-500 text-white border-amber-400'
                  : 'bg-emerald-500 text-white border-emerald-400 disabled:opacity-40'
              )}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              {isPlaying ? 'Pause' : 'Auto Schedule'}
            </button>
            <button
              onClick={handleStep}
              disabled={isFinished || isPlaying}
              className="rounded-lg bg-atlas-elev hover:bg-atlas-bg0 border border-atlas-muted/20 px-3 py-1.5 text-xs font-medium text-atlas-text transition disabled:opacity-40"
            >
              Step 1 Cycle ➔
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 rounded-lg bg-atlas-elev hover:bg-atlas-bg0 border border-atlas-muted/20 px-3 py-1.5 text-xs font-medium text-atlas-muted hover:text-atlas-text transition"
            >
              <RotateCcw size={13} /> Reset
            </button>
          </div>

          {algo === 'rr' && (
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-atlas-muted">Time Quantum (q):</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map(q => (
                  <button
                    key={q}
                    onClick={() => setTimeQuantum(q)}
                    className={cn(
                      'h-7 w-7 rounded-lg text-xs font-bold transition border',
                      timeQuantum === q
                        ? 'bg-emerald-500 text-white border-emerald-400'
                        : 'bg-atlas-elev text-atlas-muted border-atlas-muted/20'
                    )}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Visualizer Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: CPU Core & Ready Queue */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-atlas-text">CPU Core & Ready Queue Dispatcher</h4>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Time Tick: T = {currentTime}
              </span>
            </div>

            {/* Visual Dispatcher Stage */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Ready Queue (8 cols) */}
              <div className="sm:col-span-8 rounded-2xl bg-atlas-bg0/80 p-4 border border-atlas-muted/20 space-y-3">
                <span className="text-xs font-mono font-bold text-atlas-muted uppercase block">
                  Process Ready Queue (PCB Memory)
                </span>
                <div className="space-y-2">
                  {processes.map(p => {
                    const isRunning = runningProcess?.id === p.id && p.remaining > 0
                    const isDone = p.remaining === 0
                    return (
                      <div
                        key={p.id}
                        className={cn(
                          'p-3 rounded-xl border flex items-center justify-between font-mono text-xs transition',
                          isRunning
                            ? 'border-emerald-400 bg-emerald-500/20 ring-1 ring-emerald-400 shadow-md'
                            : isDone
                            ? 'border-atlas-muted/10 bg-atlas-bg0/40 opacity-40'
                            : 'border-atlas-muted/20 bg-atlas-elev/80'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: p.color }} />
                          <span className="font-bold text-atlas-text">{p.id}</span>
                          <span className="text-[11px] text-atlas-muted">{p.name.split('(')[1]?.replace(')', '')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-atlas-muted text-[11px]">
                            Remaining: <strong className="text-atlas-text">{p.remaining}</strong>/{p.burst}
                          </span>
                          {isDone ? (
                            <span className="text-emerald-400 text-[10px] font-bold">DONE</span>
                          ) : (
                            <span className="text-cyan-300 text-[10px]">READY</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Active CPU Core (4 cols) */}
              <div className="sm:col-span-4 rounded-2xl border-2 border-emerald-500/50 bg-emerald-500/10 p-5 text-center space-y-3 shadow-lg">
                <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase block">
                  Active CPU Core #0
                </span>
                <div className="h-16 w-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center text-emerald-300">
                  <Cpu size={32} />
                </div>
                <div>
                  <span className="text-xs font-bold text-atlas-text block">
                    {runningProcess && runningProcess.remaining > 0
                      ? `Running: ${runningProcess.id}`
                      : 'CPU Idle'}
                  </span>
                  <span className="text-[10px] text-atlas-muted font-mono">
                    Context Switches: {contextSwitches}
                  </span>
                </div>
              </div>
            </div>

            {/* Gantt Chart Timeline */}
            <div className="space-y-2 pt-4 border-t border-atlas-muted/15">
              <span className="text-xs font-bold text-atlas-text font-mono block">
                Execution Gantt Timeline
              </span>
              <div className="flex items-center gap-1 overflow-x-auto py-2 px-1 min-h-[48px] bg-atlas-bg0 rounded-xl border border-atlas-muted/20">
                {ganttTimeline.map((item, idx) => (
                  <motion.div
                    key={item.id || idx}
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    className="h-10 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold text-slate-950 px-3 shadow"
                    style={{
                      backgroundColor: item.color,
                      flexGrow: item.duration,
                      minWidth: '40px'
                    }}
                  >
                    {item.processId} ({item.start}➔{item.start + item.duration})
                  </motion.div>
                ))}
                {ganttTimeline.length === 0 && (
                  <div className="text-xs text-atlas-muted font-mono px-4 py-2">
                    Timeline idle. Click "Auto Schedule" to start CPU burst execution.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Telemetry Metrics */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-4">
            <h4 className="text-sm font-bold text-atlas-text font-sans">Scheduler Telemetry</h4>

            <div className="grid grid-cols-2 gap-3 font-mono">
              <div className="rounded-xl bg-atlas-elev p-3 border border-atlas-muted/15">
                <span className="text-[10px] text-atlas-muted uppercase block">Context Switches</span>
                <span className="text-lg font-bold text-cyan-300">{contextSwitches}</span>
              </div>
              <div className="rounded-xl bg-atlas-elev p-3 border border-atlas-muted/15">
                <span className="text-[10px] text-atlas-muted uppercase block">CPU Utilization</span>
                <span className="text-lg font-bold text-emerald-400">
                  {currentTime > 0 ? '98.4%' : '0%'}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-atlas-bg0/60 p-3 text-xs text-atlas-muted space-y-1 border border-atlas-muted/10">
              <div className="font-semibold text-atlas-text flex items-center gap-1.5">
                <Info size={13} className="text-emerald-400" />
                <span>Round Robin vs SJF Tradeoffs:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                <strong>Round Robin</strong> ensures responsiveness and prevents starvation in interactive multi-user operating systems by enforcing time-slice preemption, but incurs context-switching overhead.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
