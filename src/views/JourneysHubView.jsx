import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Compass,
  ArrowRight,
  Globe,
  Brain,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react'
import { TECHNOLOGY_JOURNEYS } from '../data/journeysRegistry'
import { cn } from '../utils/cn'

export default function JourneysHubView() {
  return (
    <div className="mx-auto max-w-[1580px] px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-atlas-brand">
          <Compass size={16} />
          <span>Interactive Technology Journeys</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-atlas-text">
          Follow End-to-End System Walkthroughs
        </h1>
        <p className="text-sm text-atlas-muted leading-relaxed">
          Step-by-step interactive journeys connecting multiple technologies together into complete real-world pipelines. Watch every protocol, packet, and memory frame transition in sequence.
        </p>
      </div>

      {/* Journeys Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TECHNOLOGY_JOURNEYS.map(journey => (
          <Link
            key={journey.id}
            to={`/journeys/${journey.id}`}
            className="group rounded-3xl border border-atlas-muted/20 bg-atlas-surface/80 p-6 space-y-6 hover:border-atlas-brand hover:bg-atlas-elev transition-all duration-300 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-atlas-brand bg-atlas-brand/10 border border-atlas-brand/20 px-2.5 py-1 rounded-full">
                  {journey.badge}
                </span>
                <span className="text-xs font-mono text-atlas-muted flex items-center gap-1">
                  <Clock size={12} /> {journey.estimatedTime}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-atlas-text group-hover:text-atlas-brand transition">
                  {journey.title}
                </h2>
                <p className="text-xs text-atlas-muted mt-1 leading-relaxed">
                  {journey.subtitle}
                </p>
              </div>

              {/* Stages Pill Sequence */}
              <div className="space-y-2 pt-2 border-t border-atlas-muted/15">
                <span className="text-[11px] font-mono text-atlas-muted font-semibold block">
                  {journey.stages.length} Connected Stages:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {journey.stages.map((stage, idx) => (
                    <span
                      key={stage.id}
                      className="px-2 py-1 rounded-md bg-atlas-bg0 text-[10px] font-mono text-atlas-muted border border-atlas-muted/15"
                    >
                      {idx + 1}. {stage.name.split('.')[1]?.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-atlas-muted/15 font-semibold text-xs text-atlas-text group-hover:text-atlas-brand">
              <span>Launch Interactive Walkthrough</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
