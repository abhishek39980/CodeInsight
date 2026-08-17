import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe,
  Radio,
  Lock,
  ArrowRight,
  ArrowLeft,
  Server,
  Database,
  Layers,
  CheckCircle2,
  Sparkles,
  Info,
  Laptop,
  Zap,
  Activity
} from 'lucide-react'
import { cn } from '../../utils/cn'

const STAGES = [
  {
    id: 'dns',
    title: 'Stage 1: DNS Name Resolution',
    subtitle: 'Resolving domain name to physical IP address',
    tech: 'DNS · UDP 53',
    icon: Globe,
    color: 'text-cyan-400',
    details: [
      '1. Browser checks local cache and OS hosts file.',
      '2. Query sent to ISP Recursive Resolver (e.g. 1.1.1.1).',
      '3. Resolver queries Root Server (.) ➔ TLD Server (.com) ➔ Authoritative Name Server (Cloudflare).',
      '4. Final IP Address returned: 104.21.4.12'
    ],
    packet: 'Query: example.com ➔ A Record: 104.21.4.12'
  },
  {
    id: 'tcp',
    title: 'Stage 2: TCP 3-Way Handshake',
    subtitle: 'Synchronizing sequence numbers over transport layer',
    tech: 'TCP · RFC 793',
    icon: Radio,
    color: 'text-sky-400',
    details: [
      '1. Client sends [SYN] packet (ISN = 1000).',
      '2. Server responds with [SYN, ACK] (Server ISN = 5000, ACK = 1001).',
      '3. Client acknowledges with [ACK] (ACK = 5001).',
      '4. Full-duplex connection established in 1 RTT.'
    ],
    packet: '[SYN] ➔ [SYN, ACK] ➔ [ACK] (1 RTT Elapsed)'
  },
  {
    id: 'tls',
    title: 'Stage 3: TLS 1.3 Cryptographic Handshake',
    subtitle: 'Securing the channel with ephemeral key exchange',
    tech: 'TLS 1.3 · ECDHE + AES-256-GCM',
    icon: Lock,
    color: 'text-emerald-400',
    details: [
      '1. ClientHello sent with supported cipher suites & key shares.',
      '2. ServerHello returns certificate and ECDHE public key share.',
      '3. Both sides calculate shared symmetric session master key.',
      '4. Zero-round-trip or 1-RTT encrypted tunnel active.'
    ],
    packet: 'Encrypted Tunnel Active · Session Key: 0x9f4a...e1'
  },
  {
    id: 'http',
    title: 'Stage 4: HTTP/2 Binary Request Multiplexing',
    subtitle: 'Sending binary request frames across single connection',
    tech: 'HTTP/2 · HPACK Compression',
    icon: Zap,
    color: 'text-amber-400',
    details: [
      '1. Client sends HEADERS frame (GET /index.html) with compressed headers.',
      '2. Edge CDN checks cache: Cache Miss ➔ Proxies to origin load balancer.',
      '3. Load balancer forwards request to healthy application worker.'
    ],
    packet: 'HEADERS frame stream_id=1 :method=GET :path=/'
  },
  {
    id: 'backend',
    title: 'Stage 5: Backend Cache & Database Lookup',
    subtitle: 'Resolving dynamic data through Redis and PostgreSQL',
    tech: 'Redis (Cache) · PostgreSQL (B-Tree)',
    icon: Database,
    color: 'text-purple-400',
    details: [
      '1. App server queries Redis cache for user session.',
      '2. Cache HIT: returns session token in 0.8ms.',
      '3. App server performs indexed B-Tree query on PostgreSQL DB.',
      '4. JSON response rendered and streamed back to client.'
    ],
    packet: 'HTTP 200 OK · Content-Type: text/html · Transfer: Chunked'
  },
  {
    id: 'render',
    title: 'Stage 6: Browser Critical Rendering Path',
    subtitle: 'Constructing DOM, CSSOM, Layout, and Raster Painting',
    tech: 'DOM Tree · CSSOM · Skia / GPU Rasterizer',
    icon: Laptop,
    color: 'text-pink-400',
    details: [
      '1. Browser parser converts raw HTML bytes into tokens and DOM Tree.',
      '2. CSS parser builds CSSOM tree and combines with DOM into Render Tree.',
      '3. Layout engine computes exact geometry coordinates for every node.',
      '4. GPU composites and paints pixels onto screen at 60fps!'
    ],
    packet: 'First Contentful Paint (FCP): 320ms · DOMContentLoaded'
  }
]

export default function WebsiteJourney() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const activeStage = STAGES[currentStageIndex]

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-atlas-surface via-atlas-elev to-atlas-surface p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Globe size={18} className="text-cyan-400" />
            <span>End-to-End Technology Journey</span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-atlas-text">What Happens When You Open an HTTPS Website?</h2>
          <p className="text-xs text-atlas-muted mt-0.5 max-w-2xl">
            Trace the complete lifecycle of entering <code className="text-cyan-300 font-mono">https://example.com</code>: DNS resolution, TCP handshake, TLS 1.3 cryptography, HTTP/2 multiplexing, backend caching, and browser GPU rasterization.
          </p>
        </div>

        {/* Progress Pill */}
        <div className="flex items-center gap-2 bg-atlas-bg0/80 px-3.5 py-2 rounded-xl border border-atlas-muted/20 text-xs font-mono">
          <span className="text-atlas-muted">Stage</span>
          <span className="text-cyan-400 font-bold">{currentStageIndex + 1} / {STAGES.length}</span>
        </div>
      </div>

      {/* Stage Stepper Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {STAGES.map((s, idx) => {
          const Icon = s.icon
          const isActive = idx === currentStageIndex
          const isPassed = idx < currentStageIndex
          return (
            <button
              key={s.id}
              onClick={() => setCurrentStageIndex(idx)}
              className={cn(
                'p-3 rounded-xl border text-left transition relative font-mono text-xs space-y-1',
                isActive
                  ? 'border-cyan-400 bg-cyan-500/15 shadow-md ring-1 ring-cyan-400'
                  : isPassed
                  ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300'
                  : 'border-atlas-muted/20 bg-atlas-surface/60 text-atlas-muted hover:bg-atlas-elev'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-atlas-muted">Stage {idx + 1}</span>
                {isPassed && <CheckCircle2 size={12} className="text-emerald-400" />}
              </div>
              <span className="font-bold text-atlas-text block truncate">{s.id.toUpperCase()}</span>
            </button>
          )
        })}
      </div>

      {/* Active Stage Simulation Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 cols: Interactive Stage Graphic */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-6 space-y-6 min-h-[380px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <activeStage.icon size={18} className={activeStage.color} />
                <h3 className="text-base font-bold text-atlas-text">{activeStage.title}</h3>
              </div>
              <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                {activeStage.tech}
              </span>
            </div>

            {/* Visual Flow Animation */}
            <div className="p-6 bg-atlas-bg0/80 rounded-2xl border border-atlas-muted/20 space-y-4">
              <div className="font-mono text-xs text-atlas-muted font-bold uppercase tracking-wider">
                Physical Protocol Data Transmission
              </div>
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3 font-mono text-xs text-cyan-300 flex items-center gap-2">
                <Zap size={14} className="text-cyan-400 flex-shrink-0" />
                <span>{activeStage.packet}</span>
              </div>
              <div className="space-y-2 pt-2">
                {activeStage.details.map((d, i) => (
                  <div key={i} className="text-xs font-mono text-atlas-text/90 flex items-start gap-2">
                    <ArrowRight size={13} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stepper Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-atlas-muted/15">
              <button
                onClick={() => setCurrentStageIndex(prev => Math.max(0, prev - 1))}
                disabled={currentStageIndex === 0}
                className="flex items-center gap-1.5 rounded-lg bg-atlas-elev hover:bg-atlas-bg0 border border-atlas-muted/20 px-3.5 py-1.5 text-xs font-medium text-atlas-text transition disabled:opacity-40"
              >
                <ArrowLeft size={13} /> Previous Stage
              </button>
              <button
                onClick={() => setCurrentStageIndex(prev => Math.min(STAGES.length - 1, prev + 1))}
                disabled={currentStageIndex === STAGES.length - 1}
                className="flex items-center gap-1.5 rounded-lg bg-atlas-brand hover:bg-atlas-brand/90 text-white px-4 py-1.5 text-xs font-bold transition shadow disabled:opacity-40"
              >
                Next Stage <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Right 4 cols: Computer Science Insights */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-4">
            <h4 className="text-sm font-bold text-atlas-text font-sans">Engineering Insights</h4>

            <div className="space-y-2 text-xs text-atlas-muted leading-relaxed">
              <p>
                Modern browsers execute this entire 6-stage pipeline in under <strong>400 milliseconds</strong> across thousands of miles of submarine fiber-optic cables.
              </p>
              <p>
                Techniques like <strong>TCP Fast Open</strong>, <strong>TLS 1.3 0-RTT</strong>, and <strong>HTTP/3 QUIC (UDP)</strong> eliminate latency round-trips to make page loads virtually instantaneous.
              </p>
            </div>

            <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/30 p-3 text-xs text-cyan-200 space-y-1">
              <span className="font-bold block">Next in Pipeline:</span>
              <span>{currentStageIndex < STAGES.length - 1 ? STAGES[currentStageIndex + 1].title : 'Pipeline Complete!'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
