import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Share2, CheckCircle2, Sparkles, Info, FlaskConical, ExternalLink } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function LabLayout({
  title,
  domain,
  category,
  level = 'Intermediate',
  summary,
  children
}) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="mx-auto max-w-[1580px] px-4 py-6 sm:px-6 lg:px-8 space-y-6"
    >
      {/* Top Breadcrumb & Metadata Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-atlas-muted/15 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-atlas-muted hover:text-atlas-text hover:bg-atlas-elev transition border border-atlas-muted/15"
            title="Go back"
          >
            <ArrowLeft size={15} />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-atlas-brand bg-atlas-brand/10 border border-atlas-brand/20 px-2 py-0.5 rounded-md">
                <FlaskConical size={11} />
                {domain || 'Interactive Lab'}
              </span>
              {category && (
                <span className="text-[10px] font-mono text-atlas-muted/70">
                  / {category}
                </span>
              )}
              <span className={cn(
                'text-[10px] font-mono font-semibold px-2 py-0.5 rounded',
                level === 'Beginner' ? 'bg-emerald-500/15 text-emerald-300' :
                level === 'Advanced' ? 'bg-rose-500/15 text-rose-300' :
                'bg-amber-500/15 text-amber-300'
              )}>
                {level}
              </span>
            </div>
            <h1 className="text-xl font-bold text-atlas-text mt-1">{title}</h1>
            {summary && (
              <p className="text-xs text-atlas-muted mt-0.5 max-w-3xl leading-relaxed">
                {summary}
              </p>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to="/labs"
            className="rounded-lg bg-atlas-elev hover:bg-atlas-surface border border-atlas-muted/20 px-3 py-1.5 text-xs text-atlas-muted hover:text-atlas-text transition font-medium"
          >
            Browse All Labs
          </Link>
          <Link
            to="/builder"
            className="rounded-lg bg-atlas-brand hover:bg-atlas-brand/90 text-white px-3 py-1.5 text-xs font-semibold transition flex items-center gap-1.5 shadow"
          >
            <Sparkles size={12} /> System Designer
          </Link>
        </div>
      </div>

      {/* Main Simulation Stage & Controls */}
      <div className="space-y-6">
        {children}
      </div>
    </motion.div>
  )
}
