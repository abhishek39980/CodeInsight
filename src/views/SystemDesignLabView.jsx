import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Server,
  Layers,
  Activity,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Sparkles,
  Database,
  Cpu,
  Clock,
  ShieldAlert
} from 'lucide-react'
import LRUCacheVisualizer from '../components/systemdesign/LRUCacheVisualizer'
import RateLimiterVisualizer from '../components/systemdesign/RateLimiterVisualizer'
import ConsistentHashingVisualizer from '../components/systemdesign/ConsistentHashingVisualizer'
import CircuitBreakerVisualizer from '../components/systemdesign/CircuitBreakerVisualizer'
import { cn } from '../utils/cn'

const LABS = [
  {
    id: 'lru-cache',
    title: 'LRU Cache Lab',
    subtitle: 'Doubly Linked List + Hash Map',
    icon: Database,
    badge: 'In-Memory / $O(1)$',
    color: 'text-amber-400'
  },
  {
    id: 'rate-limiter',
    title: 'Rate Limiter Lab',
    subtitle: 'Token Bucket & Leaky Bucket',
    icon: Activity,
    badge: 'API Gateway / Traffic Shaping',
    color: 'text-cyan-400'
  },
  {
    id: 'consistent-hashing',
    title: 'Consistent Hashing Lab',
    subtitle: 'Virtual Nodes & Distributed Sharding',
    icon: Server,
    badge: 'Horizontal Scaling / Distributed',
    color: 'text-emerald-400'
  },
  {
    id: 'circuit-breaker',
    title: 'Circuit Breaker Lab',
    subtitle: 'Hystrix 3-State Fault Tolerance',
    icon: ShieldAlert,
    badge: 'Microservices / Resilience',
    color: 'text-rose-400'
  }
]

export default function SystemDesignLabView() {
  const { lab } = useParams()
  const navigate = useNavigate()
  const [activeLab, setActiveLab] = useState(lab ?? 'lru-cache')

  const handleLabChange = (newLab) => {
    setActiveLab(newLab)
    navigate(`/system-design/${newLab}`, { replace: true })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="mx-auto max-w-[1580px] px-4 py-6 sm:px-6 lg:px-8 space-y-6"
    >
      {/* Top Breadcrumbs & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-atlas-muted/15 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-atlas-muted hover:text-atlas-text hover:bg-atlas-elev transition"
          >
            <ArrowLeft size={15} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-atlas-text">Interactive System Design & Distributed Systems Lab</h1>
              <span className="text-[10px] font-mono font-bold text-atlas-brand bg-atlas-brand/10 border border-atlas-brand/20 px-2 py-0.5 rounded-full">
                LIVE SIMULATION
              </span>
            </div>
            <p className="text-xs text-atlas-muted mt-0.5">
              Hands-on interactive simulations of core distributed architecture, caching, and traffic throttling primitives.
            </p>
          </div>
        </div>
      </div>

      {/* Lab Cards Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {LABS.map(item => {
          const Icon = item.icon
          const isActive = activeLab === item.id
          return (
            <button
              key={item.id}
              onClick={() => handleLabChange(item.id)}
              className={cn(
                'flex items-start gap-3 p-4 rounded-2xl border text-left transition relative overflow-hidden',
                isActive
                  ? 'border-atlas-brand bg-atlas-elev shadow-lg ring-1 ring-atlas-brand/50'
                  : 'border-atlas-muted/20 bg-atlas-surface/70 hover:bg-atlas-elev/80'
              )}
            >
              <div className={cn('p-2.5 rounded-xl bg-atlas-bg0/80 border border-atlas-muted/20', item.color)}>
                <Icon size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-atlas-text truncate">{item.title}</h3>
                </div>
                <p className="text-xs text-atlas-muted mt-0.5">{item.subtitle}</p>
                <span className="inline-block mt-2 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-atlas-bg0 text-atlas-muted/80 border border-atlas-muted/10">
                  {item.badge}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Lab Simulation View */}
      <div className="min-h-[580px]">
        <AnimatePresence mode="wait">
          {activeLab === 'lru-cache' && (
            <motion.div key="lru" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LRUCacheVisualizer />
            </motion.div>
          )}
          {activeLab === 'rate-limiter' && (
            <motion.div key="rate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <RateLimiterVisualizer />
            </motion.div>
          )}
          {activeLab === 'consistent-hashing' && (
            <motion.div key="hash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ConsistentHashingVisualizer />
            </motion.div>
          )}
          {activeLab === 'circuit-breaker' && (
            <motion.div key="breaker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CircuitBreakerVisualizer />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
