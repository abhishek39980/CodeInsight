import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  Zap,
  Activity,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  Pause,
  Clock
} from 'lucide-react'
import { cn } from '../../utils/cn'

export default function CircuitBreakerVisualizer() {
  const [state, setState] = useState('CLOSED') // 'CLOSED' | 'OPEN' | 'HALF_OPEN'
  const [failureCount, setFailureCount] = useState(0)
  const [failureThreshold, setFailureThreshold] = useState(3)
  const [timeoutSeconds, setTimeoutSeconds] = useState(5)
  const [remainingTimeout, setRemainingTimeout] = useState(0)
  const [halfOpenSuccesses, setHalfOpenSuccesses] = useState(0)
  const [halfOpenRequired, setHalfOpenRequired] = useState(2)

  // Simulation controls
  const [isDownstreamDown, setIsDownstreamDown] = useState(false)
  const [isLiveTraffic, setIsLiveTraffic] = useState(false)

  // Telemetry
  const [stats, setStats] = useState({
    successful: 12,
    failed: 1,
    shortCircuited: 0,
    total: 13
  })
  const [logs, setLogs] = useState([
    { id: 1, text: 'Circuit Breaker initialized in CLOSED state (Healthy).', type: 'success' }
  ])

  const addLog = (text, type = 'info') => {
    setLogs(prev => [{ id: Date.now() + Math.random(), text, type }, ...prev.slice(0, 19)])
  }

  // Timer for OPEN -> HALF_OPEN
  useEffect(() => {
    if (state !== 'OPEN') return
    setRemainingTimeout(timeoutSeconds)

    const interval = setInterval(() => {
      setRemainingTimeout(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          setState('HALF_OPEN')
          setHalfOpenSuccesses(0)
          addLog(`Cooldown expired! Transitioning from OPEN ➔ HALF-OPEN. Sending probe canaries...`, 'half_open')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [state, timeoutSeconds])

  // Live Traffic Generator
  useEffect(() => {
    if (!isLiveTraffic) return
    const timer = setInterval(() => {
      handleSendRequest(isDownstreamDown ? 'error' : 'normal')
    }, 900)
    return () => clearInterval(timer)
  }, [isLiveTraffic, isDownstreamDown, state, failureCount, halfOpenSuccesses])

  const handleSendRequest = (forcedResult = null) => {
    setStats(prev => ({ ...prev, total: prev.total + 1 }))

    // CASE 1: Breaker is OPEN -> Short Circuit Fast
    if (state === 'OPEN') {
      setStats(prev => ({ ...prev, shortCircuited: prev.shortCircuited + 1 }))
      addLog(`[FAST-FAIL] Breaker is OPEN! Request short-circuited (HTTP 503 Fallback). Downstream shielded.`, 'short_circuit')
      return
    }

    const isFailure = forcedResult === 'error' || (forcedResult === null && isDownstreamDown)

    // CASE 2: Breaker is HALF-OPEN (Testing probe)
    if (state === 'HALF_OPEN') {
      if (isFailure) {
        // Probe failed -> trip right back to OPEN
        setState('OPEN')
        setFailureCount(failureThreshold)
        setHalfOpenSuccesses(0)
        setStats(prev => ({ ...prev, failed: prev.failed + 1 }))
        addLog(`[PROBE FAILED] Canary request received 500 error. Tripping back to OPEN!`, 'error')
      } else {
        const nextSuccess = halfOpenSuccesses + 1
        setHalfOpenSuccesses(nextSuccess)
        setStats(prev => ({ ...prev, successful: prev.successful + 1 }))
        addLog(`[PROBE SUCCESS] Canary probe ${nextSuccess}/${halfOpenRequired} succeeded (200 OK).`, 'success')

        if (nextSuccess >= halfOpenRequired) {
          // Full recovery -> back to CLOSED
          setState('CLOSED')
          setFailureCount(0)
          setHalfOpenSuccesses(0)
          addLog(`[RECOVERED] All canary probes succeeded! Circuit Breaker reset to CLOSED (Healthy).`, 'success')
        }
      }
      return
    }

    // CASE 3: Breaker is CLOSED (Normal operation)
    if (isFailure) {
      const nextFailures = failureCount + 1
      setFailureCount(nextFailures)
      setStats(prev => ({ ...prev, failed: prev.failed + 1 }))
      addLog(`[ERROR 500] Downstream failure detected (${nextFailures}/${failureThreshold}).`, 'error')

      if (nextFailures >= failureThreshold) {
        setState('OPEN')
        addLog(`[TRIPPED] Failure threshold reached (${failureThreshold} errors)! Circuit Breaker tripped to OPEN.`, 'error')
      }
    } else {
      setFailureCount(0) // reset consecutive failures on success
      setStats(prev => ({ ...prev, successful: prev.successful + 1 }))
      addLog(`[200 OK] Request handled successfully by downstream service.`, 'success')
    }
  }

  const handleReset = () => {
    setState('CLOSED')
    setFailureCount(0)
    setHalfOpenSuccesses(0)
    setRemainingTimeout(0)
    setIsDownstreamDown(false)
    setIsLiveTraffic(false)
    setStats({ successful: 0, failed: 0, shortCircuited: 0, total: 0 })
    setLogs([{ id: Date.now(), text: 'Circuit Breaker reset to CLOSED state.', type: 'info' }])
  }

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="rounded-3xl border border-atlas-brand/30 bg-gradient-to-br from-atlas-surface via-atlas-elev to-atlas-surface p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-atlas-brand">
            <ShieldAlert size={18} className="text-atlas-brand" />
            <span>Microservice Fault Tolerance & Cascade Prevention</span>
          </div>
          <h3 className="mt-1 text-xl font-bold text-atlas-text">Circuit Breaker State Machine Simulator</h3>
          <p className="text-xs text-atlas-muted mt-0.5 max-w-2xl">
            Simulates the 3-state Circuit Breaker pattern (Netflix Hystrix / Resilience4j). Protects upstream services by failing fast when downstream dependencies fail.
          </p>
        </div>

        {/* Current State Badge */}
        <div className="flex items-center gap-3 bg-atlas-bg0/80 p-3 rounded-2xl border border-atlas-muted/20">
          <div className="text-center px-2">
            <span className="text-[10px] text-atlas-muted uppercase block">Breaker State</span>
            <span className={cn(
              'text-sm font-bold font-mono px-2 py-0.5 rounded uppercase',
              state === 'CLOSED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
              state === 'OPEN' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse' :
              'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            )}>
              {state}
            </span>
          </div>
          {state === 'OPEN' && (
            <>
              <div className="h-7 w-px bg-atlas-muted/20" />
              <div className="text-center px-2">
                <span className="text-[10px] text-atlas-muted uppercase block">Cooldown</span>
                <span className="text-sm font-bold font-mono text-rose-400">{remainingTimeout}s</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Control Strip */}
      <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-surface/80 p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Threshold Parameters */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs text-atlas-muted">Failure Threshold:</span>
              <div className="flex items-center gap-1">
                {[2, 3, 5].map(t => (
                  <button
                    key={t}
                    onClick={() => setFailureThreshold(t)}
                    className={cn(
                      'h-7 px-2.5 rounded-lg text-xs font-mono font-bold transition border',
                      failureThreshold === t
                        ? 'bg-atlas-brand text-white border-atlas-brand'
                        : 'bg-atlas-elev text-atlas-muted border-atlas-muted/20 hover:text-atlas-text'
                    )}
                  >
                    {t} errors
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-atlas-muted">Reset Timeout:</span>
              <div className="flex items-center gap-1">
                {[3, 5, 8].map(s => (
                  <button
                    key={s}
                    onClick={() => setTimeoutSeconds(s)}
                    className={cn(
                      'h-7 px-2.5 rounded-lg text-xs font-mono font-bold transition border',
                      timeoutSeconds === s
                        ? 'bg-atlas-brand text-white border-atlas-brand'
                        : 'bg-atlas-elev text-atlas-muted border-atlas-muted/20 hover:text-atlas-text'
                    )}
                  >
                    {s}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleSendRequest('normal')}
              className="flex items-center gap-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold transition"
            >
              <CheckCircle2 size={13} /> Send 200 OK
            </button>
            <button
              onClick={() => handleSendRequest('error')}
              className="flex items-center gap-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 px-3 py-1.5 text-xs font-semibold transition"
            >
              <XCircle size={13} /> Inject 500 Error
            </button>
            <button
              onClick={() => setIsDownstreamDown(!isDownstreamDown)}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition border',
                isDownstreamDown
                  ? 'bg-rose-500 text-white border-rose-400 shadow-lg'
                  : 'bg-atlas-elev text-atlas-muted border-atlas-muted/20 hover:text-atlas-text'
              )}
            >
              <AlertTriangle size={13} />
              {isDownstreamDown ? 'Downstream Outage (ACTIVE)' : 'Simulate Outage'}
            </button>
            <button
              onClick={() => setIsLiveTraffic(!isLiveTraffic)}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition border',
                isLiveTraffic
                  ? 'bg-cyan-500 text-white border-cyan-400 animate-pulse'
                  : 'bg-atlas-elev text-atlas-text border-atlas-muted/20 hover:bg-atlas-elev'
              )}
            >
              {isLiveTraffic ? <Pause size={13} /> : <Play size={13} />}
              {isLiveTraffic ? 'Live Traffic' : 'Live Traffic'}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 rounded-lg bg-atlas-elev hover:bg-atlas-bg0 border border-atlas-muted/20 px-3 py-1.5 text-xs font-medium text-atlas-muted hover:text-atlas-text transition"
            >
              <RotateCcw size={13} /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* State Machine Diagram & Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 3-State Visual State Machine */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-atlas-text">Circuit Breaker Finite State Machine</h4>
              <span className="text-xs font-mono text-atlas-muted">Hystrix Pattern</span>
            </div>

            {/* 3 Interactive State Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* CLOSED State Card */}
              <div className={cn(
                'rounded-2xl border p-4 space-y-2 transition relative',
                state === 'CLOSED'
                  ? 'border-emerald-500 bg-emerald-500/15 shadow-lg ring-2 ring-emerald-500/40'
                  : 'border-atlas-muted/20 bg-atlas-elev/40 opacity-60'
              )}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-emerald-400">1. CLOSED</span>
                  <ShieldCheck size={16} className="text-emerald-400" />
                </div>
                <div className="text-xs font-semibold text-atlas-text">Normal Operation</div>
                <p className="text-[11px] text-atlas-muted leading-tight">
                  Passes all requests to downstream. Counts failures.
                </p>
                <div className="pt-2 border-t border-atlas-muted/10 text-[10px] font-mono text-emerald-300">
                  Failures: {state === 'CLOSED' ? failureCount : 0} / {failureThreshold}
                </div>
              </div>

              {/* OPEN State Card */}
              <div className={cn(
                'rounded-2xl border p-4 space-y-2 transition relative',
                state === 'OPEN'
                  ? 'border-rose-500 bg-rose-500/15 shadow-lg ring-2 ring-rose-500/40 animate-pulse'
                  : 'border-atlas-muted/20 bg-atlas-elev/40 opacity-60'
              )}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-rose-400">2. OPEN</span>
                  <ShieldOff size={16} className="text-rose-400" />
                </div>
                <div className="text-xs font-semibold text-atlas-text">Failing Fast</div>
                <p className="text-[11px] text-atlas-muted leading-tight">
                  Short-circuits calls (HTTP 503). Downstream is given time to recover.
                </p>
                <div className="pt-2 border-t border-atlas-muted/10 text-[10px] font-mono text-rose-300">
                  Cooldown: {state === 'OPEN' ? remainingTimeout : 0}s remaining
                </div>
              </div>

              {/* HALF-OPEN State Card */}
              <div className={cn(
                'rounded-2xl border p-4 space-y-2 transition relative',
                state === 'HALF_OPEN'
                  ? 'border-amber-500 bg-amber-500/15 shadow-lg ring-2 ring-amber-500/40'
                  : 'border-atlas-muted/20 bg-atlas-elev/40 opacity-60'
              )}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-amber-400">3. HALF-OPEN</span>
                  <ShieldAlert size={16} className="text-amber-400" />
                </div>
                <div className="text-xs font-semibold text-atlas-text">Trial Canaries</div>
                <p className="text-[11px] text-atlas-muted leading-tight">
                  Sends trial probes. If they succeed, resets to CLOSED.
                </p>
                <div className="pt-2 border-t border-atlas-muted/10 text-[10px] font-mono text-amber-300">
                  Probes Passed: {state === 'HALF_OPEN' ? halfOpenSuccesses : 0} / {halfOpenRequired}
                </div>
              </div>
            </div>

            {/* Architecture Explainer */}
            <div className="rounded-xl bg-atlas-bg0/60 p-3 text-xs text-atlas-muted space-y-1 border border-atlas-muted/10">
              <div className="font-semibold text-atlas-text flex items-center gap-1.5">
                <Info size={13} className="text-atlas-brand" />
                <span>Why Circuit Breakers are Essential in Distributed Systems:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Without a circuit breaker, a slow or crashing dependency exhausts thread pools and network sockets across the entire microservice fleet, causing <strong>cascading failure</strong>. Short-circuiting allows upstream services to serve cached fallbacks and recover gracefully.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Real-time Telemetry & Audit Log */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-4">
            <h4 className="text-sm font-bold text-atlas-text">Live Gateway Telemetry</h4>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5">
                <span className="text-[10px] text-emerald-300 font-bold block">200 OK</span>
                <span className="text-lg font-bold font-mono text-emerald-400">{stats.successful}</span>
              </div>
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2.5">
                <span className="text-[10px] text-rose-300 font-bold block">500 Error</span>
                <span className="text-lg font-bold font-mono text-rose-400">{stats.failed}</span>
              </div>
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5">
                <span className="text-[10px] text-amber-300 font-bold block">503 Fast-Fail</span>
                <span className="text-lg font-bold font-mono text-amber-400">{stats.shortCircuited}</span>
              </div>
            </div>

            {/* Audit Log Stream */}
            <div className="space-y-2 pt-2 border-t border-atlas-muted/15">
              <span className="text-xs font-bold text-atlas-text block">State Transition & Request Log</span>
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto font-mono text-[11px] pr-1">
                {logs.map(l => (
                  <div
                    key={l.id}
                    className={cn(
                      'p-2 rounded text-[10px] leading-tight',
                      l.type === 'success' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20' :
                      l.type === 'error' ? 'bg-rose-500/15 text-rose-300 border border-rose-500/20' :
                      l.type === 'short_circuit' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20' :
                      l.type === 'half_open' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20' :
                      'bg-atlas-elev text-atlas-muted'
                    )}
                  >
                    {l.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
