import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  Zap,
  Play,
  Pause,
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Sliders,
  Sparkles,
  Info,
  Clock,
  Waves
} from 'lucide-react'
import { cn } from '../../utils/cn'

export default function RateLimiterVisualizer() {
  const [algo, setAlgo] = useState('token-bucket') // 'token-bucket' | 'leaky-bucket'
  
  // Token Bucket Parameters
  const [capacity, setCapacity] = useState(10)
  const [refillRate, setRefillRate] = useState(2) // tokens per second
  const [tokens, setTokens] = useState(10)

  // Leaky Bucket Parameters
  const [leakCapacity, setLeakCapacity] = useState(8)
  const [leakRate, setLeakRate] = useState(2) // reqs per second processed
  const [queuedRequests, setQueuedRequests] = useState([])

  // Traffic Generator
  const [isLiveTraffic, setIsLiveTraffic] = useState(false)
  const [trafficRps, setTrafficRps] = useState(4)

  // Statistics
  const [stats, setStats] = useState({
    passed: 18,
    throttled: 4,
    total: 22
  })

  // Traffic stream particles / history
  const [particles, setParticles] = useState([])

  // Token Refill Interval (Token Bucket)
  useEffect(() => {
    if (algo !== 'token-bucket') return
    const interval = setInterval(() => {
      setTokens(prev => Math.min(capacity, prev + refillRate / 2))
    }, 500)
    return () => clearInterval(interval)
  }, [algo, capacity, refillRate])

  // Leak Processing Interval (Leaky Bucket)
  useEffect(() => {
    if (algo !== 'leaky-bucket') return
    const interval = setInterval(() => {
      setQueuedRequests(prev => {
        if (prev.length === 0) return prev
        const countToProcess = Math.min(prev.length, Math.ceil(leakRate / 2))
        return prev.slice(countToProcess)
      })
    }, 500)
    return () => clearInterval(interval)
  }, [algo, leakRate])

  // Live Traffic Generator
  useEffect(() => {
    if (!isLiveTraffic) return
    const intervalMs = Math.max(100, Math.floor(1000 / trafficRps))
    const timer = setInterval(() => {
      handleIncomingRequest()
    }, intervalMs)
    return () => clearInterval(timer)
  }, [isLiveTraffic, trafficRps, algo, tokens, capacity, queuedRequests.length, leakCapacity])

  const handleIncomingRequest = () => {
    const id = Date.now() + Math.random()

    if (algo === 'token-bucket') {
      if (tokens >= 1) {
        setTokens(prev => Math.max(0, prev - 1))
        setStats(prev => ({ ...prev, passed: prev.passed + 1, total: prev.total + 1 }))
        addParticle(id, 'passed')
      } else {
        setStats(prev => ({ ...prev, throttled: prev.throttled + 1, total: prev.total + 1 }))
        addParticle(id, 'throttled')
      }
    } else {
      // Leaky bucket
      if (queuedRequests.length < leakCapacity) {
        setQueuedRequests(prev => [...prev, { id, time: Date.now() }])
        setStats(prev => ({ ...prev, passed: prev.passed + 1, total: prev.total + 1 }))
        addParticle(id, 'passed')
      } else {
        setStats(prev => ({ ...prev, throttled: prev.throttled + 1, total: prev.total + 1 }))
        addParticle(id, 'throttled')
      }
    }
  }

  const handleBurst = (count) => {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        handleIncomingRequest()
      }, i * 40)
    }
  }

  const addParticle = (id, status) => {
    setParticles(prev => [{ id, status, time: Date.now() }, ...prev.slice(0, 15)])
  }

  const handleReset = () => {
    setTokens(capacity)
    setQueuedRequests([])
    setStats({ passed: 0, throttled: 0, total: 0 })
    setParticles([])
    setIsLiveTraffic(false)
  }

  const passRate = stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 100

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="rounded-3xl border border-atlas-brand/30 bg-gradient-to-br from-atlas-surface via-atlas-elev to-atlas-surface p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-atlas-brand">
            <Activity size={18} className="text-atlas-brand" />
            <span>Traffic Shaping & API Gateway Defense</span>
          </div>
          <h3 className="mt-1 text-xl font-bold text-atlas-text">Rate Limiter & Traffic Flow Simulator</h3>
          <p className="text-xs text-atlas-muted mt-0.5 max-w-2xl">
            Simulates real-world high-throughput API protection algorithms with live bursts, continuous refill mechanics, and HTTP 429 Too Many Requests backpressure.
          </p>
        </div>

        {/* Algorithm Switcher */}
        <div className="flex items-center gap-2 bg-atlas-bg0/60 p-1.5 rounded-xl border border-atlas-muted/20">
          <button
            onClick={() => setAlgo('token-bucket')}
            className={cn(
              'px-3 py-1.5 text-xs font-semibold rounded-lg transition',
              algo === 'token-bucket'
                ? 'bg-atlas-brand text-white shadow'
                : 'text-atlas-muted hover:text-atlas-text'
            )}
          >
            Token Bucket
          </button>
          <button
            onClick={() => setAlgo('leaky-bucket')}
            className={cn(
              'px-3 py-1.5 text-xs font-semibold rounded-lg transition',
              algo === 'leaky-bucket'
                ? 'bg-atlas-brand text-white shadow'
                : 'text-atlas-muted hover:text-atlas-text'
            )}
          >
            Leaky Bucket
          </button>
        </div>
      </div>

      {/* Control Strip */}
      <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-surface/80 p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Controls based on Algorithm */}
          <div className="flex flex-wrap items-center gap-6">
            {algo === 'token-bucket' ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-atlas-muted">Bucket Capacity:</span>
                  <div className="flex items-center gap-1">
                    {[5, 10, 15, 20].map(c => (
                      <button
                        key={c}
                        onClick={() => { setCapacity(c); setTokens(c) }}
                        className={cn(
                          'h-7 px-2.5 rounded-lg text-xs font-mono font-bold transition border',
                          capacity === c
                            ? 'bg-atlas-brand text-white border-atlas-brand'
                            : 'bg-atlas-elev text-atlas-muted border-atlas-muted/20 hover:text-atlas-text'
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-atlas-muted">Refill Rate:</span>
                  <span className="font-mono text-xs font-bold text-cyan-300">{refillRate} tokens/sec</span>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={refillRate}
                    onChange={e => setRefillRate(Number(e.target.value))}
                    className="w-24 accent-atlas-brand cursor-pointer"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-atlas-muted">Buffer Queue Size:</span>
                  <div className="flex items-center gap-1">
                    {[4, 8, 12, 16].map(c => (
                      <button
                        key={c}
                        onClick={() => setLeakCapacity(c)}
                        className={cn(
                          'h-7 px-2.5 rounded-lg text-xs font-mono font-bold transition border',
                          leakCapacity === c
                            ? 'bg-atlas-brand text-white border-atlas-brand'
                            : 'bg-atlas-elev text-atlas-muted border-atlas-muted/20 hover:text-atlas-text'
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-atlas-muted">Leak / Process Rate:</span>
                  <span className="font-mono text-xs font-bold text-emerald-400">{leakRate} req/sec</span>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    value={leakRate}
                    onChange={e => setLeakRate(Number(e.target.value))}
                    className="w-24 accent-atlas-brand cursor-pointer"
                  />
                </div>
              </>
            )}
          </div>

          {/* Trigger Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleIncomingRequest()}
              className="flex items-center gap-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30 px-3 py-1.5 text-xs font-semibold transition"
            >
              <Zap size={13} /> Send 1 Request
            </button>
            <button
              onClick={() => handleBurst(5)}
              className="flex items-center gap-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 px-3 py-1.5 text-xs font-semibold transition"
            >
              <Sparkles size={13} /> Burst (5)
            </button>
            <button
              onClick={() => handleBurst(10)}
              className="flex items-center gap-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 px-3 py-1.5 text-xs font-semibold transition"
            >
              <Sparkles size={13} /> Heavy Burst (10)
            </button>
            <button
              onClick={() => setIsLiveTraffic(!isLiveTraffic)}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition border',
                isLiveTraffic
                  ? 'bg-emerald-500 text-white border-emerald-400 animate-pulse'
                  : 'bg-atlas-elev text-atlas-text border-atlas-muted/20 hover:bg-atlas-elev'
              )}
            >
              {isLiveTraffic ? <Pause size={13} /> : <Play size={13} />}
              {isLiveTraffic ? `Live Stream (${trafficRps} RPS)` : 'Live Stream'}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 rounded-lg bg-atlas-elev hover:bg-atlas-bg0 border border-atlas-muted/20 px-3 py-1.5 text-xs font-medium text-atlas-muted hover:text-atlas-text transition"
            >
              <RotateCcw size={13} /> Reset
            </button>
          </div>
        </div>

        {/* Live Traffic RPS slider when stream is on */}
        {isLiveTraffic && (
          <div className="flex items-center gap-3 pt-2 border-t border-atlas-muted/10 text-xs font-mono">
            <span className="text-atlas-muted">Incoming Simulated Load:</span>
            <input
              type="range"
              min={1}
              max={15}
              value={trafficRps}
              onChange={e => setTrafficRps(Number(e.target.value))}
              className="w-40 accent-emerald-400 cursor-pointer"
            />
            <span className="text-emerald-400 font-bold">{trafficRps} Requests / Second</span>
          </div>
        )}
      </div>

      {/* Visual Simulation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Bucket Container */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Waves size={16} className="text-cyan-400" />
                <h4 className="text-sm font-bold text-atlas-text">
                  {algo === 'token-bucket' ? 'Token Bucket Visual Container' : 'Leaky Bucket Request Queue'}
                </h4>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                {algo === 'token-bucket'
                  ? `${Math.floor(tokens)} / ${capacity} Tokens Available`
                  : `${queuedRequests.length} / ${leakCapacity} Buffer Occupancy`}
              </span>
            </div>

            {/* Bucket Graphic Rendering */}
            <div className="relative h-64 w-full rounded-2xl bg-atlas-bg0/80 border-2 border-atlas-muted/20 flex flex-col justify-end p-4 overflow-hidden">
              {/* Fill background gradient */}
              <motion.div
                className={cn(
                  'absolute bottom-0 left-0 right-0 transition-all duration-300 opacity-20',
                  algo === 'token-bucket' ? 'bg-gradient-to-t from-cyan-500 to-transparent' : 'bg-gradient-to-t from-emerald-500 to-transparent'
                )}
                style={{
                  height: algo === 'token-bucket'
                    ? `${(tokens / capacity) * 100}%`
                    : `${(queuedRequests.length / leakCapacity) * 100}%`
                }}
              />

              {/* Items Inside Bucket */}
              {algo === 'token-bucket' ? (
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 z-10">
                  {Array.from({ length: capacity }).map((_, i) => {
                    const isFilled = i < Math.floor(tokens)
                    return (
                      <motion.div
                        key={i}
                        initial={false}
                        animate={{ scale: isFilled ? 1 : 0.7, opacity: isFilled ? 1 : 0.2 }}
                        className={cn(
                          'h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition shadow',
                          isFilled
                            ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950 ring-1 ring-amber-200'
                            : 'bg-atlas-elev text-atlas-muted/30 border border-dashed border-atlas-muted/20'
                        )}
                      >
                        🪙
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div className="space-y-2 z-10 max-h-52 overflow-y-auto">
                  {queuedRequests.map((req, idx) => (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="rounded-lg bg-emerald-500/20 border border-emerald-500/30 p-2 text-xs font-mono text-emerald-300 flex items-center justify-between"
                    >
                      <span>Request #{idx + 1} (Queued)</span>
                      <span className="text-[10px] text-atlas-muted">Awaiting Leak processing</span>
                    </motion.div>
                  ))}
                  {queuedRequests.length === 0 && (
                    <div className="text-center py-12 text-xs font-mono text-atlas-muted/60">
                      Buffer queue is idle. Requests flow freely.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mechanics comparison note */}
            <div className="rounded-xl bg-atlas-bg0/60 p-3 text-xs text-atlas-muted space-y-1 border border-atlas-muted/10">
              <div className="font-semibold text-atlas-text flex items-center gap-1.5">
                <Info size={13} className="text-atlas-brand" />
                <span>{algo === 'token-bucket' ? 'Token Bucket Trait' : 'Leaky Bucket Trait'}</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {algo === 'token-bucket'
                  ? 'Permits instantaneous bursts of traffic up to the total token capacity without delay, then falls back strictly to the refill rate.'
                  : 'Enforces perfectly smoothed, constant-rate output processing. Bursts are buffered in the queue and drained at fixed intervals.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Real-time Telemetry & Stream Log */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-atlas-text">HTTP Response Telemetry</h4>
              <span className="text-xs font-mono text-emerald-400 font-bold">{passRate}% Success Rate</span>
            </div>

            {/* Metric Counters */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold">
                  <CheckCircle2 size={14} /> HTTP 200 OK
                </div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{stats.passed}</div>
                <div className="text-[10px] text-atlas-muted mt-0.5">Requests Allowed</div>
              </div>

              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3">
                <div className="flex items-center gap-1.5 text-xs text-rose-300 font-semibold">
                  <XCircle size={14} /> HTTP 429 Throttled
                </div>
                <div className="text-xl font-bold font-mono text-rose-400 mt-1">{stats.throttled}</div>
                <div className="text-[10px] text-atlas-muted mt-0.5">Rate Limit Exceeded</div>
              </div>
            </div>

            {/* Live Particle Stream */}
            <div className="space-y-2 pt-2 border-t border-atlas-muted/15">
              <span className="text-xs font-bold text-atlas-text block">Live Request Traffic Flow</span>
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto font-mono text-[11px] pr-1">
                {particles.map(p => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      'p-2 rounded-lg text-[11px] flex items-center justify-between',
                      p.status === 'passed'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                    )}
                  >
                    <span>{p.status === 'passed' ? '⚡ 200 OK — Request Processed' : '⛔ 429 Too Many Requests — Dropped'}</span>
                    <span className="text-[10px] text-atlas-muted">{(Date.now() - p.time)}ms ago</span>
                  </motion.div>
                ))}
                {particles.length === 0 && (
                  <div className="text-center py-8 text-xs text-atlas-muted font-mono">
                    Send requests or start live stream to inspect traffic.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
