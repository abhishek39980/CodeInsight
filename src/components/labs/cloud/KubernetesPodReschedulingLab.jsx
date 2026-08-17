import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Server,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Activity,
  ShieldCheck,
  Info
} from 'lucide-react'
import { cn } from '../../../utils/cn'

const INITIAL_NODES = [
  { id: 'node-1', name: 'Worker Node #1', cpu: '4 vCPU', ram: '16 GB', status: 'ready', pods: ['pod-1', 'pod-2'] },
  { id: 'node-2', name: 'Worker Node #2', cpu: '4 vCPU', ram: '16 GB', status: 'ready', pods: ['pod-3'] },
  { id: 'node-3', name: 'Worker Node #3', cpu: '4 vCPU', ram: '16 GB', status: 'ready', pods: ['pod-4'] }
]

export default function KubernetesPodReschedulingLab() {
  const [nodes, setNodes] = useState(INITIAL_NODES)
  const [eventLog, setEventLog] = useState([
    { id: 1, text: 'Cluster initialized: 3 Nodes Ready, 4 Pod replicas running (Deployment: web-api)', type: 'info' }
  ])

  const addLog = (text, type = 'info') => {
    setEventLog(prev => [{ id: Date.now() + Math.random(), text, type }, ...prev.slice(0, 10)])
  }

  // Chaos: Kill Node 1
  const handleKillNode = (nodeId) => {
    const target = nodes.find(n => n.id === nodeId)
    if (!target || target.status === 'not-ready') return

    addLog(`CHAOS INJECTION: ${target.name} power failure! Kubelet heartbeat lost.`, 'error')

    // 1. Mark node NotReady
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, status: 'not-ready' } : n))

    // 2. Controller Manager triggers rescheduling after delay
    setTimeout(() => {
      addLog(`Kube-Controller-Manager detected desired replicas (4) != actual replicas. Triggering eviction of [${target.pods.join(', ')}].`, 'warn')

      setNodes(prev => {
        const podsToReschedule = target.pods
        const healthyNodes = prev.filter(n => n.id !== nodeId && n.status === 'ready')

        if (healthyNodes.length === 0) return prev

        const updated = prev.map(n => {
          if (n.id === nodeId) return { ...n, pods: [] }
          return { ...n }
        })

        // Distribute evicted pods onto healthy nodes
        podsToReschedule.forEach((pod, idx) => {
          const destNode = healthyNodes[idx % healthyNodes.length]
          const targetInUpdated = updated.find(n => n.id === destNode.id)
          if (targetInUpdated) {
            targetInUpdated.pods.push(pod)
          }
        })

        return updated
      })

      addLog(`Kube-Scheduler successfully bound all evicted pods onto healthy worker nodes. Cluster back at 100% replica health!`, 'success')
    }, 1200)
  }

  const handleReset = () => {
    setNodes(INITIAL_NODES)
    setEventLog([{ id: Date.now(), text: 'Cluster reset to default state: 3 Nodes Ready, 4 Pods.', type: 'info' }])
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-atlas-surface via-atlas-elev to-atlas-surface p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <Layers size={18} className="text-blue-400" />
            <span>Kubernetes Cluster & Orchestration Simulator</span>
          </div>
          <h3 className="mt-1 text-xl font-bold text-atlas-text">Kubernetes Pod Rescheduling & Failure Recovery</h3>
          <p className="text-xs text-atlas-muted mt-0.5 max-w-2xl">
            Simulates the Kubernetes Reconciliation Loop. Kill a worker node and observe how <code>kube-controller-manager</code> and <code>kube-scheduler</code> automatically evict and reschedule container pods.
          </p>
        </div>

        {/* Replica Health Badge */}
        <div className="flex items-center gap-3 bg-atlas-bg0/80 p-3 rounded-2xl border border-atlas-muted/20">
          <div className="text-center px-2 font-mono">
            <span className="text-[10px] text-atlas-muted uppercase block">Desired Replicas</span>
            <span className="text-base font-bold text-blue-300">4 / 4 Pods</span>
          </div>
          <div className="h-7 w-px bg-atlas-muted/20" />
          <div className="text-center px-2 font-mono">
            <span className="text-[10px] text-atlas-muted uppercase block">Reconciliation</span>
            <span className="text-xs font-bold text-emerald-400">Active Loop</span>
          </div>
        </div>
      </div>

      {/* Control Strip */}
      <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-surface/80 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-atlas-muted font-medium mr-1">Chaos Injections:</span>
          {nodes.map(n => (
            <button
              key={n.id}
              onClick={() => handleKillNode(n.id)}
              disabled={n.status === 'not-ready'}
              className={cn(
                'px-3.5 py-1.5 text-xs font-mono font-semibold rounded-lg transition border flex items-center gap-1.5',
                n.status === 'not-ready'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 opacity-60'
                  : 'bg-atlas-elev hover:bg-rose-500/20 border-atlas-muted/30 text-rose-300 hover:border-rose-500/40'
              )}
            >
              <AlertTriangle size={13} />
              {n.status === 'not-ready' ? `${n.name} (Dead)` : `Crash ${n.name}`}
            </button>
          ))}
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1 rounded-lg bg-atlas-elev hover:bg-atlas-bg0 border border-atlas-muted/20 px-3 py-1.5 text-xs font-medium text-atlas-muted hover:text-atlas-text transition"
        >
          <RotateCcw size={13} /> Heal All Nodes
        </button>
      </div>

      {/* Cluster Nodes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 cols: Nodes & Pods */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-3xl border border-atlas-muted/25 bg-atlas-surface/90 p-6 space-y-6">
            <h4 className="text-sm font-bold text-atlas-text">Cluster Worker Nodes & Pod Allocations</h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {nodes.map(n => {
                const isReady = n.status === 'ready'
                return (
                  <div
                    key={n.id}
                    className={cn(
                      'rounded-2xl border-2 p-4 space-y-3 transition shadow-lg flex flex-col justify-between min-h-[220px]',
                      isReady
                        ? 'border-blue-500/30 bg-atlas-elev/80'
                        : 'border-rose-500 bg-rose-500/10 animate-pulse'
                    )}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Server size={20} className={isReady ? 'text-blue-400' : 'text-rose-400'} />
                        <span className={cn(
                          'text-[10px] font-mono font-bold px-2 py-0.5 rounded',
                          isReady ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        )}>
                          {isReady ? 'Ready' : 'NotReady'}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-atlas-text block font-mono">{n.name}</span>
                      <span className="text-[10px] text-atlas-muted font-mono">{n.cpu} · {n.ram}</span>
                    </div>

                    {/* Running Pods */}
                    <div className="space-y-1.5 pt-2 border-t border-atlas-muted/15">
                      <span className="text-[10px] text-atlas-muted font-mono block uppercase">
                        Active Pods ({n.pods.length}):
                      </span>
                      <div className="space-y-1">
                        <AnimatePresence>
                          {n.pods.map(pod => (
                            <motion.div
                              key={pod}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="rounded-lg bg-blue-500/20 border border-blue-400/40 px-2.5 py-1 text-[11px] font-mono text-blue-200 flex items-center justify-between shadow-sm"
                            >
                              <span>{pod}</span>
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        {n.pods.length === 0 && (
                          <span className="text-[10px] text-atlas-muted font-mono italic block py-2 text-center">
                            No active pods
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="rounded-xl bg-atlas-bg0/60 p-3 text-xs text-atlas-muted space-y-1 border border-atlas-muted/10">
              <div className="font-semibold text-atlas-text flex items-center gap-1.5">
                <Info size={13} className="text-blue-400" />
                <span>The Kubernetes Reconciliation Loop:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Kubernetes operates on a declarative model: <code>Loop: observe() ➔ diff(desired, actual) ➔ act()</code>. When a node dies, the controller manager notices that actual replicas (2) are less than desired replicas (4), and instructs the scheduler to instantiate pods on healthy nodes.
              </p>
            </div>
          </div>
        </div>

        {/* Right 4 cols: Kubelet Audit Log */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-4 font-mono text-xs">
            <h4 className="text-sm font-bold text-atlas-text font-sans">Kube-Apiserver Event Stream</h4>

            <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
              {eventLog.map(e => (
                <div
                  key={e.id}
                  className={cn(
                    'p-2 rounded text-[10px] leading-tight',
                    e.type === 'success' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20' :
                    e.type === 'warn' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20' :
                    e.type === 'error' ? 'bg-rose-500/15 text-rose-300 border border-rose-500/20' :
                    'bg-atlas-elev text-atlas-muted'
                  )}
                >
                  {e.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
