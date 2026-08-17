import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  Zap,
  Info,
  CheckCircle2,
  TrendingUp,
  Layers
} from 'lucide-react'
import { cn } from '../../../utils/cn'

export default function TCPCongestionLab() {
  const [cwnd, setCwnd] = useState(1) // Congestion window in MSS packets
  const [ssthresh, setSsthresh] = useState(16) // Slow start threshold
  const [phase, setPhase] = useState('Slow Start') // 'Slow Start' | 'Congestion Avoidance' | 'Fast Recovery'
  const [rttTick, setRttTick] = useState(1)
  const [isPlaying, setIsPlaying] = useState(true)
  const [history, setHistory] = useState([{ rtt: 1, cwnd: 1, phase: 'Slow Start' }])

  // Step 1 RTT round
  const stepRtt = (isPacketDropped = false) => {
    if (isPacketDropped) {
      // Packet drop event -> Multiplicative decrease
      const newSsthresh = Math.max(2, Math.floor(cwnd / 2))
      const newCwnd = 1
      const newPhase = 'Slow Start'

      setCwnd(newCwnd)
      setSsthresh(newSsthresh)
      setPhase(newPhase)
      setRttTick(t => t + 1)
      setHistory(prev => [...prev.slice(-20), { rtt: rttTick + 1, cwnd: newCwnd, phase: newPhase }])
      return
    }

    // Normal ACK received
    let nextCwnd = cwnd
    let nextPhase = phase

    if (cwnd < ssthresh) {
      // Slow Start (Exponential: doubles every RTT)
      nextCwnd = Math.min(32, cwnd * 2)
      nextPhase = nextCwnd >= ssthresh ? 'Congestion Avoidance' : 'Slow Start'
    } else {
      // Congestion Avoidance (Additive Increase: +1 per RTT)
      nextCwnd = Math.min(32, cwnd + 1)
      nextPhase = 'Congestion Avoidance'
    }

    setCwnd(nextCwnd)
    setPhase(nextPhase)
    setRttTick(t => t + 1)
    setHistory(prev => [...prev.slice(-20), { rtt: rttTick + 1, cwnd: nextCwnd, phase: nextPhase }])
  }

  // Auto-play interval
  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      // Auto drop packet occasionally when window reaches 24+ to demonstrate sawtooth
      const shouldDrop = cwnd >= 24 && Math.random() < 0.35
      stepRtt(shouldDrop)
    }, 1000)
    return () => clearInterval(timer)
  }, [isPlaying, cwnd, ssthresh, phase, rttTick])

  const handleReset = () => {
    setCwnd(1)
    setSsthresh(16)
    setPhase('Slow Start')
    setRttTick(1)
    setHistory([{ rtt: 1, cwnd: 1, phase: 'Slow Start' }])
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-atlas-surface via-atlas-elev to-atlas-surface p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Activity size={18} className="text-cyan-400" />
            <span>TCP Congestion Control & Buffer Flow Simulator</span>
          </div>
          <h3 className="mt-1 text-xl font-bold text-atlas-text">TCP Congestion Avoidance & Sliding Window (AIMD)</h3>
          <p className="text-xs text-atlas-muted mt-0.5 max-w-2xl">
            Simulates TCP Reno/CUBIC Additive Increase Multiplicative Decrease (AIMD). Watch how Slow Start exponentially ramps up throughput until packet loss triggers backoff.
          </p>
        </div>

        {/* Telemetry Metrics */}
        <div className="flex items-center gap-3 bg-atlas-bg0/80 p-3 rounded-2xl border border-atlas-muted/20">
          <div className="text-center px-2 font-mono">
            <span className="text-[10px] text-atlas-muted uppercase block">Congestion Window (cwnd)</span>
            <span className="text-lg font-bold text-cyan-300">{cwnd} MSS Packets</span>
          </div>
          <div className="h-7 w-px bg-atlas-muted/20" />
          <div className="text-center px-2 font-mono">
            <span className="text-[10px] text-atlas-muted uppercase block">Algorithm Phase</span>
            <span className={cn(
              'text-xs font-bold',
              phase === 'Slow Start' ? 'text-amber-400' : 'text-emerald-400'
            )}>
              {phase}
            </span>
          </div>
        </div>
      </div>

      {/* Control Strip */}
      <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-surface/80 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-bold transition border shadow',
              isPlaying ? 'bg-amber-500 text-white border-amber-400' : 'bg-cyan-500 text-slate-950 border-cyan-400'
            )}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            {isPlaying ? 'Pause Simulation' : 'Auto Stream'}
          </button>

          <button
            onClick={() => stepRtt(false)}
            disabled={isPlaying}
            className="rounded-lg bg-atlas-elev hover:bg-atlas-bg0 border border-atlas-muted/20 px-3.5 py-1.5 text-atlas-text transition disabled:opacity-40"
          >
            Step 1 RTT ➔
          </button>

          <button
            onClick={() => stepRtt(true)}
            className="flex items-center gap-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 px-3.5 py-1.5 font-bold transition"
          >
            <AlertTriangle size={13} /> Inject Packet Drop (RTO)
          </button>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1 rounded-lg bg-atlas-elev hover:bg-atlas-bg0 border border-atlas-muted/20 px-3 py-1.5 text-xs font-medium text-atlas-muted hover:text-atlas-text transition"
        >
          <RotateCcw size={13} /> Reset cwnd
        </button>
      </div>

      {/* Live Sawtooth Graph & Sliding Window Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 cols: cwnd Sawtooth Graph */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-3xl border border-atlas-muted/25 bg-atlas-surface/90 p-6 space-y-6 min-h-[380px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-atlas-text">Live Congestion Window (cwnd) Evolution</h4>
              <span className="text-xs font-mono text-atlas-muted">Threshold ssthresh = {ssthresh}</span>
            </div>

            {/* Sawtooth Bar Chart */}
            <div className="flex items-end gap-2 h-48 bg-atlas-bg0/80 p-4 rounded-2xl border border-atlas-muted/20 overflow-x-auto">
              {history.map((h, idx) => {
                const heightPercent = (h.cwnd / 32) * 100
                return (
                  <motion.div
                    key={idx}
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    className={cn(
                      'w-6 rounded-t-lg transition flex flex-col justify-between text-center pb-1 shadow-md',
                      h.phase === 'Slow Start' ? 'bg-amber-400 text-slate-950' : 'bg-cyan-400 text-slate-950'
                    )}
                  >
                    <span className="text-[9px] font-bold font-mono">{h.cwnd}</span>
                  </motion.div>
                )
              })}
            </div>

            {/* Sliding Window Packet Blocks */}
            <div className="space-y-2 pt-2 border-t border-atlas-muted/15">
              <span className="text-xs font-bold text-atlas-text font-mono block">
                Sliding Window Packets in Flight ({cwnd} Segments Active):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: cwnd }).map((_, i) => (
                  <span
                    key={i}
                    className="h-8 w-8 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center font-mono text-xs font-bold text-cyan-300"
                  >
                    P{i + 1}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 cols: AIMD Mathematics Inspector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-4 font-mono text-xs">
            <h4 className="text-sm font-bold text-atlas-text font-sans">TCP AIMD Mathematical Model</h4>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-atlas-elev border border-amber-500/30">
                <span className="font-bold text-amber-300 block">1. Slow Start (cwnd &lt; ssthresh)</span>
                <span className="text-[10px] text-atlas-muted">cwnd = cwnd × 2 per RTT (Exponential)</span>
              </div>

              <div className="p-2.5 rounded-xl bg-atlas-elev border border-cyan-500/30">
                <span className="font-bold text-cyan-300 block">2. Congestion Avoidance</span>
                <span className="text-[10px] text-atlas-muted">cwnd = cwnd + 1 per RTT (Linear Probe)</span>
              </div>

              <div className="p-2.5 rounded-xl bg-atlas-elev border border-rose-500/30">
                <span className="font-bold text-rose-300 block">3. Multiplicative Decrease (Drop)</span>
                <span className="text-[10px] text-atlas-muted">ssthresh = cwnd / 2, cwnd = 1</span>
              </div>
            </div>

            <div className="rounded-xl bg-atlas-bg0/60 p-3 text-[11px] text-atlas-muted space-y-1 border border-atlas-muted/10 font-sans">
              <span className="font-semibold text-atlas-text block">Network Stability:</span>
              <p className="leading-relaxed">
                AIMD is mathematically proven to converge on optimal, fair bandwidth allocation among competing flows sharing a bottleneck network router without causing bufferbloat collapse.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
