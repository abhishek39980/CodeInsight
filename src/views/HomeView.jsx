import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  ArrowRight,
  FlaskConical,
  Compass,
  Layers,
  Code2,
  Share2,
  Globe,
  Radio,
  Server,
  Database,
  Brain,
  ShieldCheck,
  Cpu,
  Zap,
  Activity
} from 'lucide-react'
import { TECHNOLOGY_DOMAINS, TECHNOLOGY_LABS } from '../data/technologyRegistry'
import { TECHNOLOGY_JOURNEYS } from '../data/journeysRegistry'
import { cn } from '../utils/cn'

export default function HomeView() {
  const [heroPacketState, setHeroPacketState] = useState('idle') // 'idle' | 'client-to-lb' | 'lb-to-srv' | 'srv-to-db' | 'done'

  const triggerHeroPacket = () => {
    if (heroPacketState !== 'idle') return
    setHeroPacketState('client-to-lb')
    setTimeout(() => setHeroPacketState('lb-to-srv'), 600)
    setTimeout(() => setHeroPacketState('srv-to-db'), 1200)
    setTimeout(() => setHeroPacketState('done'), 1800)
    setTimeout(() => setHeroPacketState('idle'), 2600)
  }

  return (
    <div className="space-y-16 py-6 pb-20">
      {/* 1. HERO SECTION */}
      <section className="mx-auto max-w-[1580px] px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-atlas-muted/20 bg-gradient-to-b from-atlas-surface via-atlas-surface/90 to-atlas-bg0 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-atlas-brand/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Hero Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-atlas-brand/30 bg-atlas-brand/10 px-3.5 py-1 text-xs font-mono font-semibold text-atlas-brand">
                <Sparkles size={13} />
                <span>The Interactive Technology Museum & Laboratory</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-atlas-text leading-[1.15]">
                Understand Technology <br />
                <span className="bg-gradient-to-r from-atlas-brand via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  by Watching It Work.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-atlas-muted leading-relaxed max-w-xl">
                CodeInsight is a digital laboratory and visual playground for computer science, distributed systems, networking, databases, operating systems, AI, and cybersecurity.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/explore"
                  className="rounded-xl bg-atlas-brand hover:bg-atlas-brand/90 text-white px-5 py-3 text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-atlas-brand/20"
                >
                  <Compass size={16} />
                  <span>Explore All Domains</span>
                  <ArrowRight size={14} />
                </Link>

                <Link
                  to="/builder"
                  className="rounded-xl bg-atlas-elev hover:bg-atlas-surface border border-atlas-muted/25 px-5 py-3 text-xs sm:text-sm font-bold text-atlas-text transition flex items-center gap-2"
                >
                  <Layers size={16} className="text-cyan-400" />
                  <span>System Designer</span>
                </Link>

                <Link
                  to="/journeys/open-website"
                  className="rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-5 py-3 text-xs sm:text-sm font-bold text-cyan-300 transition flex items-center gap-2"
                >
                  <Globe size={16} />
                  <span>Open Website Journey</span>
                </Link>
              </div>
            </div>

            {/* Hero Right: Live Interactive Distributed Mini-Simulation */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-elev/80 p-6 space-y-5 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-cyan-400" />
                    <span className="text-xs font-bold text-atlas-text font-mono">Live Micro-System Simulator</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    Interactive
                  </span>
                </div>

                {/* Micro Pipeline Stage */}
                <div className="grid grid-cols-4 gap-2 py-6 px-2 bg-atlas-bg0/80 rounded-xl border border-atlas-muted/20 items-center text-center font-mono">
                  {/* Node 1: Client */}
                  <div className={cn(
                    'p-2.5 rounded-xl border transition',
                    heroPacketState === 'client-to-lb' ? 'border-cyan-400 bg-cyan-500/20' : 'border-atlas-muted/20 bg-atlas-elev/60'
                  )}>
                    <Globe size={18} className="mx-auto text-cyan-400" />
                    <span className="text-[10px] text-atlas-muted block mt-1">Client</span>
                  </div>

                  {/* Node 2: LB */}
                  <div className={cn(
                    'p-2.5 rounded-xl border transition',
                    heroPacketState === 'lb-to-srv' ? 'border-indigo-400 bg-indigo-500/20' : 'border-atlas-muted/20 bg-atlas-elev/60'
                  )}>
                    <Radio size={18} className="mx-auto text-indigo-400" />
                    <span className="text-[10px] text-atlas-muted block mt-1">Balancer</span>
                  </div>

                  {/* Node 3: Server */}
                  <div className={cn(
                    'p-2.5 rounded-xl border transition',
                    heroPacketState === 'srv-to-db' ? 'border-emerald-400 bg-emerald-500/20' : 'border-atlas-muted/20 bg-atlas-elev/60'
                  )}>
                    <Server size={18} className="mx-auto text-emerald-400" />
                    <span className="text-[10px] text-atlas-muted block mt-1">App Node</span>
                  </div>

                  {/* Node 4: Cache & DB */}
                  <div className={cn(
                    'p-2.5 rounded-xl border transition',
                    heroPacketState === 'done' ? 'border-amber-400 bg-amber-500/20' : 'border-atlas-muted/20 bg-atlas-elev/60'
                  )}>
                    <Database size={18} className="mx-auto text-amber-400" />
                    <span className="text-[10px] text-atlas-muted block mt-1">Cache/DB</span>
                  </div>
                </div>

                {/* Hero Simulation Button */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-atlas-muted font-mono">
                    {heroPacketState === 'idle' && 'Click button to route a request packet'}
                    {heroPacketState === 'client-to-lb' && '1. Client ➔ TLS encrypted TCP packet'}
                    {heroPacketState === 'lb-to-srv' && '2. Load Balancer ➔ Routed to healthy worker'}
                    {heroPacketState === 'srv-to-db' && '3. Worker ➔ Redis Cache & B-Tree DB lookup'}
                    {heroPacketState === 'done' && '4. HTTP 200 OK rendered in 18ms!'}
                  </span>
                  <button
                    onClick={triggerHeroPacket}
                    disabled={heroPacketState !== 'idle'}
                    className="flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3.5 py-1.5 text-xs font-bold font-mono transition shadow disabled:opacity-40"
                  >
                    <Zap size={13} />
                    <span>Send Packet</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED END-TO-END TECHNOLOGY JOURNEYS */}
      <section className="mx-auto max-w-[1580px] px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-atlas-brand">
              Multi-Stage Systems Walkthroughs
            </span>
            <h2 className="text-2xl font-bold text-atlas-text mt-0.5">Featured Technology Journeys</h2>
          </div>
          <Link to="/journeys" className="text-xs font-mono text-atlas-brand hover:underline flex items-center gap-1">
            <span>View All Journeys</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TECHNOLOGY_JOURNEYS.map(journey => (
            <Link
              key={journey.id}
              to={`/journeys/${journey.id}`}
              className="group rounded-3xl border border-atlas-muted/20 bg-atlas-surface/80 p-6 space-y-4 hover:border-atlas-brand hover:bg-atlas-elev transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-atlas-brand bg-atlas-brand/10 border border-atlas-brand/20 px-2.5 py-1 rounded-full">
                    {journey.badge}
                  </span>
                  <span className="text-xs font-mono text-atlas-muted">{journey.estimatedTime}</span>
                </div>
                <h3 className="text-lg font-bold text-atlas-text group-hover:text-atlas-brand transition">
                  {journey.title}
                </h3>
                <p className="text-xs text-atlas-muted leading-relaxed">
                  {journey.subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-atlas-muted/15 font-semibold text-xs text-atlas-text group-hover:text-atlas-brand">
                <span>Start Interactive Journey</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. EXPLORE BY TECHNOLOGY DOMAINS */}
      <section className="mx-auto max-w-[1580px] px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-atlas-brand">
              Technology Domains
            </span>
            <h2 className="text-2xl font-bold text-atlas-text mt-0.5">Explore by Computing Domain</h2>
          </div>
          <Link to="/explore" className="text-xs font-mono text-atlas-brand hover:underline flex items-center gap-1">
            <span>Explore All Domains</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TECHNOLOGY_DOMAINS.slice(0, 8).map(d => {
            const count = TECHNOLOGY_LABS.filter(l => l.domainId === d.id).length
            return (
              <Link
                key={d.id}
                to="/labs"
                className="rounded-3xl border border-atlas-muted/20 bg-atlas-surface/80 p-5 space-y-3 hover:border-atlas-brand/60 hover:bg-atlas-elev transition-all shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{d.icon}</span>
                    <span className="text-[10px] font-mono text-atlas-muted">{count} Labs</span>
                  </div>
                  <h3 className="text-sm font-bold text-atlas-text">{d.name}</h3>
                  <p className="text-xs text-atlas-muted line-clamp-2 leading-relaxed">
                    {d.summary}
                  </p>
                </div>
                <div className="text-[11px] font-mono font-semibold text-atlas-brand pt-2 flex items-center gap-1">
                  <span>Browse Simulations</span>
                  <ArrowRight size={11} />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 4. PREMIER INTERACTIVE LABS SHOWCASE */}
      <section className="mx-auto max-w-[1580px] px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-atlas-brand">
              Individual Experiments
            </span>
            <h2 className="text-2xl font-bold text-atlas-text mt-0.5">Popular Interactive Laboratories</h2>
          </div>
          <Link to="/labs" className="text-xs font-mono text-atlas-brand hover:underline flex items-center gap-1">
            <span>All {TECHNOLOGY_LABS.length} Labs</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TECHNOLOGY_LABS.slice(0, 6).map(lab => (
            <Link
              key={lab.id}
              to={`/labs/${lab.id}`}
              className="group rounded-3xl border border-atlas-muted/20 bg-atlas-surface/80 p-5 space-y-3 hover:border-atlas-brand hover:bg-atlas-elev transition-all shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-atlas-brand font-bold uppercase tracking-wider bg-atlas-brand/10 px-2 py-0.5 rounded">
                    {lab.category}
                  </span>
                  <span className="text-[10px] font-mono text-atlas-muted">{lab.level}</span>
                </div>
                <h3 className="text-base font-bold text-atlas-text group-hover:text-atlas-brand transition">
                  {lab.title}
                </h3>
                <p className="text-xs text-atlas-muted line-clamp-2 leading-relaxed">
                  {lab.summary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-atlas-muted/15 font-semibold text-xs text-atlas-text group-hover:text-atlas-brand">
                <span>Launch Simulation</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
