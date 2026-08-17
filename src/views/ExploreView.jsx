import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Layers,
  ArrowRight,
  Compass,
  Sparkles,
  FlaskConical,
  Radio,
  Server,
  Database,
  Cpu,
  Brain,
  ShieldCheck,
  Globe
} from 'lucide-react'
import { TECHNOLOGY_DOMAINS, TECHNOLOGY_LABS } from '../data/technologyRegistry'
import { cn } from '../utils/cn'

export default function ExploreView() {
  return (
    <div className="mx-auto max-w-[1580px] px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-atlas-brand">
          <Compass size={16} />
          <span>Technology Domains & Systems Matrix</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-atlas-text">
          Explore the Machinery Behind Modern Computing
        </h1>
        <p className="text-sm text-atlas-muted leading-relaxed">
          Navigate computer science, software engineering, and infrastructure across fundamental domains. Every domain contains interactive simulations and visual execution models.
        </p>
      </div>

      {/* Domains Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TECHNOLOGY_DOMAINS.map(domain => {
          const domainLabs = TECHNOLOGY_LABS.filter(l => l.domainId === domain.id)
          return (
            <div
              key={domain.id}
              className="rounded-3xl border border-atlas-muted/20 bg-atlas-surface/80 p-6 space-y-6 hover:border-atlas-brand/60 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{domain.icon}</span>
                    <h2 className="text-lg font-bold text-atlas-text">{domain.name}</h2>
                  </div>
                  <span className="text-[10px] font-mono text-atlas-brand bg-atlas-brand/10 border border-atlas-brand/20 px-2 py-0.5 rounded-full font-bold">
                    {domainLabs.length} {domainLabs.length === 1 ? 'Lab' : 'Labs'}
                  </span>
                </div>

                <p className="text-xs text-atlas-muted leading-relaxed">
                  {domain.summary}
                </p>

                {/* Sub-labs Quick Links */}
                {domainLabs.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-atlas-muted/15">
                    <span className="text-[10px] font-mono text-atlas-muted uppercase font-semibold block">
                      Interactive Laboratories:
                    </span>
                    <div className="space-y-1.5">
                      {domainLabs.map(lab => (
                        <Link
                          key={lab.id}
                          to={`/labs/${lab.id}`}
                          className="flex items-center justify-between p-2 rounded-xl bg-atlas-bg0/60 hover:bg-atlas-elev text-xs font-mono text-atlas-text/90 border border-atlas-muted/10 hover:border-atlas-brand/40 transition group"
                        >
                          <span className="truncate">{lab.title}</span>
                          <ArrowRight size={12} className="text-atlas-muted group-hover:text-atlas-brand group-hover:translate-x-0.5 transition flex-shrink-0 ml-2" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
