import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers,
  Server,
  Database,
  Cpu,
  Globe,
  Radio,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HardDrive,
  Activity,
  Trash2,
  Plus,
  ShieldAlert,
  ArrowRight
} from 'lucide-react'
import { cn } from '../utils/cn'

const INITIAL_NODES = [
  { id: 'client', type: 'client', label: 'Web & Mobile Clients', icon: Globe, status: 'healthy', x: 50, y: 180, color: '#38BDF8' },
  { id: 'lb', type: 'lb', label: 'Load Balancer (NGINX)', icon: Radio, status: 'healthy', x: 280, y: 180, color: '#818CF8' },
  { id: 'srv1', type: 'server', label: 'App Server #1', icon: Server, status: 'healthy', x: 520, y: 80, color: '#34D399' },
  { id: 'srv2', type: 'server', label: 'App Server #2', icon: Server, status: 'healthy', x: 520, y: 280, color: '#34D399' },
  { id: 'cache', type: 'cache', label: 'Redis Distributed Cache', icon: Layers, status: 'healthy', x: 760, y: 80, color: '#FBBF24' },
  { id: 'db', type: 'database', label: 'PostgreSQL Database', icon: Database, status: 'healthy', x: 760, y: 280, color: '#F472B6' }
]

export default function ArchitectureBuilderView() {
  const [nodes, setNodes] = useState(INITIAL_NODES)
  const [trafficRps, setTrafficRps] = useState(850)
  const [isTrafficLive, setIsTrafficLive] = useState(true)
  const [activeChaos, setActiveChaos] = useState(null) // 'server-down' | 'cache-down' | 'high-latency'
  
  // Real-time calculated metrics
  const [metrics, setMetrics] = useState({
    avgLatencyMs: 24,
    cacheHitRatio: 88,
    errorRate: 0.1,
    dbConnections: 45
  })

  // Recalculate metrics when chaos or traffic changes
  useEffect(() => {
    if (!isTrafficLive) {
      setMetrics({ avgLatencyMs: 0, cacheHitRatio: 0, errorRate: 0, dbConnections: 0 })
      return
    }

    if (activeChaos === 'cache-down') {
      // Cache outage -> 100% cache misses, huge DB load and latency spike
      setMetrics({
        avgLatencyMs: Math.round(180 + trafficRps * 0.15),
        cacheHitRatio: 0,
        errorRate: 4.8,
        dbConnections: Math.min(300, Math.round(trafficRps * 0.25))
      })
    } else if (activeChaos === 'server-down') {
      // Server 2 down -> higher load on Server 1
      setMetrics({
        avgLatencyMs: Math.round(45 + trafficRps * 0.04),
        cacheHitRatio: 86,
        errorRate: 1.2,
        dbConnections: 65
      })
    } else if (activeChaos === 'high-latency') {
      setMetrics({
        avgLatencyMs: 450,
        cacheHitRatio: 84,
        errorRate: 2.5,
        dbConnections: 120
      })
    } else {
      // Healthy
      setMetrics({
        avgLatencyMs: Math.max(12, Math.round(18 + trafficRps * 0.008)),
        cacheHitRatio: 88,
        errorRate: 0.05,
        dbConnections: Math.min(100, Math.round(20 + trafficRps * 0.03))
      })
    }
  }, [trafficRps, isTrafficLive, activeChaos])

  // Chaos triggers
  const triggerChaos = (type) => {
    if (activeChaos === type) {
      // Toggle off
      setActiveChaos(null)
      setNodes(prev => prev.map(n => ({ ...n, status: 'healthy' })))
      return
    }

    setActiveChaos(type)
    if (type === 'server-down') {
      setNodes(prev => prev.map(n => n.id === 'srv2' ? { ...n, status: 'failed' } : { ...n, status: 'healthy' }))
    } else if (type === 'cache-down') {
      setNodes(prev => prev.map(n => n.id === 'cache' ? { ...n, status: 'failed' } : { ...n, status: 'healthy' }))
    } else {
      setNodes(prev => prev.map(n => ({ ...n, status: 'degraded' })))
    }
  }

  const handleReset = () => {
    setActiveChaos(null)
    setNodes(INITIAL_NODES)
    setTrafficRps(850)
    setIsTrafficLive(true)
  }

  return (
    <div className="mx-auto max-w-[1580px] px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl border border-atlas-brand/30 bg-gradient-to-br from-atlas-surface via-atlas-elev to-atlas-surface p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-atlas-brand">
            <Layers size={18} className="text-atlas-brand" />
            <span>Interactive Distributed Systems Studio</span>
          </div>
          <h1 className="mt-1 text-xl font-bold text-atlas-text">Architecture Builder & Chaos Simulator</h1>
          <p className="text-xs text-atlas-muted mt-0.5 max-w-2xl">
            Construct distributed topologies, stream live request traffic, inject chaos faults (server crashes, cache outages), and observe real-time backpressure and cascading failure.
          </p>
        </div>

        {/* Live Traffic Toggle */}
        <div className="flex items-center gap-3 bg-atlas-bg0/80 p-3 rounded-2xl border border-atlas-muted/20">
          <div className="text-center px-2 font-mono">
            <span className="text-[10px] text-atlas-muted uppercase block">Incoming Traffic</span>
            <span className="text-sm font-bold text-cyan-300">{isTrafficLive ? `${trafficRps} RPS` : '0 RPS'}</span>
          </div>
          <div className="h-7 w-px bg-atlas-muted/20" />
          <button
            onClick={() => setIsTrafficLive(!isTrafficLive)}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition flex items-center gap-1.5 shadow',
              isTrafficLive
                ? 'bg-emerald-500 text-white animate-pulse'
                : 'bg-atlas-elev text-atlas-muted'
            )}
          >
            {isTrafficLive ? <Pause size={13} /> : <Play size={13} />}
            {isTrafficLive ? 'Live Stream' : 'Paused'}
          </button>
        </div>
      </div>

      {/* Control Strip & Chaos Toolbar */}
      <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-surface/80 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Traffic RPS Slider */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-atlas-muted">Traffic Rate:</span>
            <input
              type="range"
              min={100}
              max={3500}
              step={50}
              value={trafficRps}
              onChange={e => setTrafficRps(Number(e.target.value))}
              className="w-36 accent-atlas-brand cursor-pointer"
            />
            <span className="text-atlas-text font-bold">{trafficRps} reqs / sec</span>
          </div>

          {/* Chaos Injection Triggers */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-atlas-muted font-medium mr-1">Chaos Injections:</span>
            <button
              onClick={() => triggerChaos('server-down')}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition border flex items-center gap-1.5',
                activeChaos === 'server-down'
                  ? 'bg-rose-500 text-white border-rose-400 shadow-md'
                  : 'bg-atlas-elev text-rose-300 border-rose-500/30 hover:bg-rose-500/10'
              )}
            >
              <AlertTriangle size={13} />
              {activeChaos === 'server-down' ? 'Server #2 Down (Active)' : 'Kill Server #2'}
            </button>
            <button
              onClick={() => triggerChaos('cache-down')}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition border flex items-center gap-1.5',
                activeChaos === 'cache-down'
                  ? 'bg-amber-500 text-white border-amber-400 shadow-md'
                  : 'bg-atlas-elev text-amber-300 border-amber-500/30 hover:bg-amber-500/10'
              )}
            >
              <Zap size={13} />
              {activeChaos === 'cache-down' ? 'Cache Outage (Active)' : 'Crash Redis Cache'}
            </button>
            <button
              onClick={() => triggerChaos('high-latency')}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition border flex items-center gap-1.5',
                activeChaos === 'high-latency'
                  ? 'bg-purple-500 text-white border-purple-400 shadow-md'
                  : 'bg-atlas-elev text-purple-300 border-purple-500/30 hover:bg-purple-500/10'
              )}
            >
              <Activity size={13} />
              {activeChaos === 'high-latency' ? 'Latency Spike (Active)' : 'Network Jitter'}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 rounded-lg bg-atlas-elev hover:bg-atlas-bg0 border border-atlas-muted/20 px-3 py-1.5 text-xs font-medium text-atlas-muted hover:text-atlas-text transition"
            >
              <RotateCcw size={13} /> Reset Topology
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Studio Canvas & Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Architectural Canvas */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-6 min-h-[440px] relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-atlas-text">Live Architecture Topology & Request Flight</h4>
              <span className="text-xs font-mono text-atlas-muted">Physical Routing Map</span>
            </div>

            {/* Visual Node Graph on Canvas */}
            <div className="relative h-80 w-full my-auto flex items-center justify-between px-4">
              {/* Client */}
              <div className="flex flex-col items-center space-y-2 z-10">
                <div className="h-16 w-16 rounded-2xl border-2 border-sky-400 bg-sky-500/15 flex items-center justify-center text-sky-300 shadow-lg shadow-sky-500/10">
                  <Globe size={28} />
                </div>
                <div className="text-center font-mono">
                  <span className="text-xs font-bold text-atlas-text block">Clients</span>
                  <span className="text-[10px] text-atlas-muted">Web / iOS / Android</span>
                </div>
              </div>

              <div className="text-atlas-muted/40 font-mono text-xl animate-pulse">➔</div>

              {/* Load Balancer */}
              <div className="flex flex-col items-center space-y-2 z-10">
                <div className="h-16 w-16 rounded-2xl border-2 border-indigo-400 bg-indigo-500/15 flex items-center justify-center text-indigo-300 shadow-lg shadow-indigo-500/10">
                  <Radio size={28} />
                </div>
                <div className="text-center font-mono">
                  <span className="text-xs font-bold text-atlas-text block">Load Balancer</span>
                  <span className="text-[10px] text-atlas-muted">Round Robin Routing</span>
                </div>
              </div>

              <div className="text-atlas-muted/40 font-mono text-xl animate-pulse">➔</div>

              {/* Server Fleet (Column) */}
              <div className="flex flex-col gap-6 z-10">
                {/* Server 1 */}
                <div className={cn(
                  'rounded-xl border-2 p-2.5 flex items-center gap-2.5 transition shadow',
                  nodes.find(n => n.id === 'srv1')?.status === 'healthy'
                    ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300'
                    : 'border-rose-500 bg-rose-500/20 text-rose-400 animate-pulse'
                )}>
                  <Server size={18} />
                  <div className="font-mono text-left">
                    <span className="text-[11px] font-bold text-atlas-text block">Server #1</span>
                    <span className="text-[9px] text-atlas-muted">CPU: {activeChaos === 'server-down' ? '92%' : '48%'}</span>
                  </div>
                </div>

                {/* Server 2 */}
                <div className={cn(
                  'rounded-xl border-2 p-2.5 flex items-center gap-2.5 transition shadow',
                  nodes.find(n => n.id === 'srv2')?.status === 'healthy'
                    ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300'
                    : 'border-rose-500 bg-rose-500/20 text-rose-400 animate-pulse'
                )}>
                  <Server size={18} />
                  <div className="font-mono text-left">
                    <span className="text-[11px] font-bold text-atlas-text block">Server #2</span>
                    <span className="text-[9px] text-atlas-muted">
                      {nodes.find(n => n.id === 'srv2')?.status === 'failed' ? 'CRASHED (503)' : 'CPU: 46%'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-atlas-muted/40 font-mono text-xl animate-pulse">➔</div>

              {/* Data Layer (Cache + DB) */}
              <div className="flex flex-col gap-6 z-10">
                {/* Redis Cache */}
                <div className={cn(
                  'rounded-xl border-2 p-2.5 flex items-center gap-2.5 transition shadow',
                  nodes.find(n => n.id === 'cache')?.status === 'healthy'
                    ? 'border-amber-400 bg-amber-500/15 text-amber-300'
                    : 'border-rose-500 bg-rose-500/20 text-rose-400 animate-pulse'
                )}>
                  <Layers size={18} />
                  <div className="font-mono text-left">
                    <span className="text-[11px] font-bold text-atlas-text block">Redis Cache</span>
                    <span className="text-[9px] text-atlas-muted">
                      {nodes.find(n => n.id === 'cache')?.status === 'failed' ? 'OFFLINE (Miss 100%)' : 'Hit Rate: 88%'}
                    </span>
                  </div>
                </div>

                {/* PostgreSQL Database */}
                <div className="rounded-xl border-2 border-pink-400 bg-pink-500/15 p-2.5 flex items-center gap-2.5 text-pink-300 shadow">
                  <Database size={18} />
                  <div className="font-mono text-left">
                    <span className="text-[11px] font-bold text-atlas-text block">PostgreSQL DB</span>
                    <span className="text-[9px] text-atlas-muted">Active Conns: {metrics.dbConnections}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Status Toast */}
            {activeChaos && (
              <div className="rounded-xl bg-rose-500/15 border border-rose-500/30 p-3 text-xs text-rose-200 flex items-center gap-2">
                <ShieldAlert size={16} className="text-rose-400 flex-shrink-0" />
                <span>
                  {activeChaos === 'server-down' && 'Server #2 failure injected! NGINX load balancer detecting health check drops and shifting 100% of traffic to Server #1.'}
                  {activeChaos === 'cache-down' && 'Redis Cache crash injected! 100% of read traffic bypassing cache, flooding PostgreSQL database with direct disk queries and spiking latency.'}
                  {activeChaos === 'high-latency' && 'Network packet degradation injected! Increased transport RTT causing request buffer queues to fill up across API instances.'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Cols: Live Telemetry Dashboard */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-4 font-mono">
            <h4 className="text-sm font-bold text-atlas-text font-sans">Real-Time Cluster Telemetry</h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-atlas-elev p-3 border border-atlas-muted/15">
                <span className="text-[10px] text-atlas-muted uppercase block">Average Latency</span>
                <span className={cn(
                  'text-lg font-bold',
                  metrics.avgLatencyMs > 100 ? 'text-rose-400' : 'text-emerald-400'
                )}>
                  {metrics.avgLatencyMs} ms
                </span>
              </div>

              <div className="rounded-xl bg-atlas-elev p-3 border border-atlas-muted/15">
                <span className="text-[10px] text-atlas-muted uppercase block">Cache Hit Rate</span>
                <span className={cn(
                  'text-lg font-bold',
                  metrics.cacheHitRatio > 50 ? 'text-amber-400' : 'text-rose-400'
                )}>
                  {metrics.cacheHitRatio}%
                </span>
              </div>

              <div className="rounded-xl bg-atlas-elev p-3 border border-atlas-muted/15">
                <span className="text-[10px] text-atlas-muted uppercase block">DB Active Connections</span>
                <span className="text-lg font-bold text-pink-400">{metrics.dbConnections}</span>
              </div>

              <div className="rounded-xl bg-atlas-elev p-3 border border-atlas-muted/15">
                <span className="text-[10px] text-atlas-muted uppercase block">Error Rate</span>
                <span className={cn(
                  'text-lg font-bold',
                  metrics.errorRate > 1 ? 'text-rose-400' : 'text-cyan-300'
                )}>
                  {metrics.errorRate}%
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-atlas-bg0/60 p-3 text-xs text-atlas-muted space-y-1 border border-atlas-muted/10 font-sans">
              <span className="font-semibold text-atlas-text block">Architectural Takeaway:</span>
              <p className="text-[11px] leading-relaxed">
                Caching serves as a critical protective shield for relational databases. When in-memory caches fail, database connection pool exhaustion is the #1 cause of catastrophic cascade failure in high-scale web systems.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
