import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Server,
  Plus,
  Minus,
  RotateCcw,
  Sparkles,
  Zap,
  Info,
  CheckCircle2,
  Trash2,
  Share2,
  Cpu
} from 'lucide-react'
import { cn } from '../../utils/cn'

// Simple deterministic string hash into [0, 359] degrees
function hashStringToAngle(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) % 360
}

const SERVER_COLORS = [
  { id: 'node-A', name: 'Server Alpha', color: '#38BDF8', border: 'border-sky-400', bg: 'bg-sky-400/20' },
  { id: 'node-B', name: 'Server Beta', color: '#34D399', border: 'border-emerald-400', bg: 'bg-emerald-400/20' },
  { id: 'node-C', name: 'Server Gamma', color: '#FBBF24', border: 'border-amber-400', bg: 'bg-amber-400/20' },
  { id: 'node-D', name: 'Server Delta', color: '#F472B6', border: 'border-pink-400', bg: 'bg-pink-400/20' },
  { id: 'node-E', name: 'Server Epsilon', color: '#A78BFA', border: 'border-violet-400', bg: 'bg-violet-400/20' }
]

export default function ConsistentHashingVisualizer() {
  const [servers, setServers] = useState([
    { id: 'node-A', name: 'Server Alpha', color: '#38BDF8', angle: 45 },
    { id: 'node-B', name: 'Server Beta', color: '#34D399', angle: 160 },
    { id: 'node-C', name: 'Server Gamma', color: '#FBBF24', angle: 280 }
  ])
  const [vnodesMultiplier, setVnodesMultiplier] = useState(1) // 1x, 3x, 5x
  const [keys, setKeys] = useState([
    { id: 'k1', key: 'user_101', angle: 20 },
    { id: 'k2', key: 'user_204', angle: 80 },
    { id: 'k3', key: 'session_881', angle: 150 },
    { id: 'k4', key: 'order_992', angle: 210 },
    { id: 'k5', key: 'profile_330', angle: 315 },
    { id: 'k6', key: 'cart_771', angle: 350 }
  ])
  const [inputKey, setInputKey] = useState('')
  const [selectedKey, setSelectedKey] = useState(null)
  const [lastEvent, setLastEvent] = useState('Initialized 3 servers on consistent hash ring.')

  // Compute all virtual node points on ring
  const allVnodes = useMemo(() => {
    const list = []
    servers.forEach(server => {
      for (let v = 0; v < vnodesMultiplier; v++) {
        const vAngle = (server.angle + (v * (360 / (servers.length * vnodesMultiplier)))) % 360
        list.push({
          id: `${server.id}-v${v}`,
          serverId: server.id,
          serverName: server.name,
          color: server.color,
          angle: vAngle
        })
      }
    })
    return list.sort((a, b) => a.angle - b.angle)
  }, [servers, vnodesMultiplier])

  // Map each key to its clockwise owning server
  const keyAssignments = useMemo(() => {
    if (allVnodes.length === 0) return []
    return keys.map(k => {
      // Find first vnode with angle >= key.angle (or wrap to first)
      const target = allVnodes.find(vn => vn.angle >= k.angle) || allVnodes[0]
      return {
        ...k,
        assignedServerId: target.serverId,
        assignedServerName: target.serverName,
        assignedColor: target.color,
        targetAngle: target.angle
      }
    })
  }, [keys, allVnodes])

  // Server load distribution stats
  const serverLoads = useMemo(() => {
    const counts = {}
    servers.forEach(s => { counts[s.id] = 0 })
    keyAssignments.forEach(k => {
      if (counts[k.assignedServerId] !== undefined) {
        counts[k.assignedServerId]++
      }
    })
    return counts
  }, [servers, keyAssignments])

  // Add custom key
  const handleAddKey = () => {
    const kStr = inputKey.trim() || `key_${Math.floor(Math.random() * 900 + 100)}`
    const angle = hashStringToAngle(kStr)
    const newKey = { id: `key-${Date.now()}`, key: kStr, angle }
    setKeys(prev => [newKey, ...prev])
    setSelectedKey(newKey)
    setInputKey('')
    setLastEvent(`Added key "${kStr}" at hash angle ${angle}°`)
  }

  // Add batch random keys
  const handleAddRandomBatch = (count = 5) => {
    const newBatch = Array.from({ length: count }, () => {
      const num = Math.floor(Math.random() * 9000 + 1000)
      const kStr = `user_${num}`
      return {
        id: `key-${Date.now()}-${Math.random()}`,
        key: kStr,
        angle: hashStringToAngle(kStr)
      }
    })
    setKeys(prev => [...newBatch, ...prev])
    setLastEvent(`Injected batch of ${count} distributed request keys onto hash ring.`)
  }

  // Add a server
  const handleAddServer = () => {
    if (servers.length >= SERVER_COLORS.length) return
    const nextConfig = SERVER_COLORS[servers.length]
    const newAngle = Math.floor(Math.random() * 360)
    setServers([...servers, { ...nextConfig, angle: newAngle }])
    setLastEvent(`Spawned ${nextConfig.name} at ${newAngle}°. Rebalanced minimal key partition!`)
  }

  // Remove a server
  const handleRemoveServer = (serverId) => {
    if (servers.length <= 1) return
    const removed = servers.find(s => s.id === serverId)
    setServers(servers.filter(s => s.id !== serverId))
    setLastEvent(`Decommissioned ${removed?.name}. Affected keys migrated clockwise without complete reshuffling.`)
  }

  const handleReset = () => {
    setServers([
      { id: 'node-A', name: 'Server Alpha', color: '#38BDF8', angle: 45 },
      { id: 'node-B', name: 'Server Beta', color: '#34D399', angle: 160 },
      { id: 'node-C', name: 'Server Gamma', color: '#FBBF24', angle: 280 }
    ])
    setKeys([
      { id: 'k1', key: 'user_101', angle: 20 },
      { id: 'k2', key: 'user_204', angle: 80 },
      { id: 'k3', key: 'session_881', angle: 150 },
      { id: 'k4', key: 'order_992', angle: 210 },
      { id: 'k5', key: 'profile_330', angle: 315 },
      { id: 'k6', key: 'cart_771', angle: 350 }
    ])
    setVnodesMultiplier(1)
    setSelectedKey(null)
    setLastEvent('Reset hash ring to default topology.')
  }

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="rounded-3xl border border-atlas-brand/30 bg-gradient-to-br from-atlas-surface via-atlas-elev to-atlas-surface p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-atlas-brand">
            <Server size={18} className="text-atlas-brand" />
            <span>Distributed Systems & Horizontal Scaling</span>
          </div>
          <h3 className="mt-1 text-xl font-bold text-atlas-text">Consistent Hashing & Dynamic Sharding</h3>
          <p className="text-xs text-atlas-muted mt-0.5 max-w-2xl">
            Simulates distributed hash rings ($0 \to 2^{32}-1$). Adding or removing nodes migrates only $K/N$ keys on average, avoiding catastrophic cluster-wide cache invalidation.
          </p>
        </div>

        {/* Virtual Nodes Selector */}
        <div className="flex items-center gap-2 bg-atlas-bg0/60 p-2 rounded-xl border border-atlas-muted/20">
          <span className="text-xs text-atlas-muted font-medium">Virtual Nodes (Vnodes):</span>
          {[1, 3, 5].map(v => (
            <button
              key={v}
              onClick={() => setVnodesMultiplier(v)}
              className={cn(
                'px-2.5 py-1 text-xs font-bold rounded-lg transition border',
                vnodesMultiplier === v
                  ? 'bg-atlas-brand text-white border-atlas-brand'
                  : 'bg-atlas-elev text-atlas-muted border-atlas-muted/20 hover:text-atlas-text'
              )}
            >
              {v}x
            </button>
          ))}
        </div>
      </div>

      {/* Control Strip */}
      <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-surface/80 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Server Management */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-atlas-muted font-medium">Live Cluster ({servers.length} Nodes):</span>
            <button
              onClick={handleAddServer}
              disabled={servers.length >= SERVER_COLORS.length}
              className="flex items-center gap-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold transition disabled:opacity-40"
            >
              <Plus size={13} /> Add Server Node
            </button>
          </div>

          {/* Key Injection Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Key (e.g. user_991)"
              value={inputKey}
              onChange={e => setInputKey(e.target.value)}
              className="h-8 w-36 rounded-lg bg-atlas-bg0 border border-atlas-muted/30 px-2.5 text-xs text-atlas-text placeholder:text-atlas-muted/50 font-mono focus:outline-none focus:border-atlas-brand"
            />
            <button
              onClick={handleAddKey}
              className="flex items-center gap-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30 px-3 py-1.5 text-xs font-semibold transition"
            >
              <Plus size={13} /> Hash Key
            </button>
            <button
              onClick={() => handleAddRandomBatch(5)}
              className="flex items-center gap-1 rounded-lg bg-atlas-elev hover:bg-atlas-brand hover:text-white border border-atlas-muted/20 px-3 py-1.5 text-xs font-medium text-atlas-text transition"
            >
              <Sparkles size={13} /> +5 Random Keys
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 rounded-lg bg-atlas-elev hover:bg-atlas-bg0 border border-atlas-muted/20 px-3 py-1.5 text-xs font-medium text-atlas-muted hover:text-atlas-text transition"
            >
              <RotateCcw size={13} /> Reset
            </button>
          </div>
        </div>

        {/* Live event toast */}
        <div className="text-[11px] font-mono text-cyan-300 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20 flex items-center gap-2">
          <Zap size={12} className="text-cyan-400 flex-shrink-0" />
          <span>{lastEvent}</span>
        </div>
      </div>

      {/* Visual Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 360° Circular Ring Canvas / SVG */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-atlas-text">Hash Ring Topology (0° ➔ 360°)</h4>
              <span className="text-xs font-mono text-atlas-muted">Clockwise Search (↻)</span>
            </div>

            {/* Circular Ring SVG */}
            <div className="relative flex items-center justify-center py-4">
              <svg width="340" height="340" viewBox="0 0 340 340" className="overflow-visible">
                {/* Background Ring */}
                <circle
                  cx="170"
                  cy="170"
                  r="130"
                  fill="none"
                  stroke="#232C38"
                  strokeWidth="6"
                  strokeDasharray="4 4"
                />

                {/* Clockwise Direction Arrows */}
                <path
                  d="M 170 30 A 140 140 0 0 1 310 170"
                  fill="none"
                  stroke="#4C7DFF"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  opacity="0.4"
                />

                {/* Center Core Display */}
                <circle cx="170" cy="170" r="48" fill="#151A21" stroke="#334155" strokeWidth="1.5" />
                <text x="170" y="165" textAnchor="middle" fill="#9AA7B7" fontSize="10" fontFamily="monospace">
                  TOTAL KEYS
                </text>
                <text x="170" y="185" textAnchor="middle" fill="#EAF0F8" fontSize="18" fontWeight="bold" fontFamily="monospace">
                  {keys.length}
                </text>

                {/* Render Virtual Nodes on Ring */}
                {allVnodes.map(vn => {
                  const rad = ((vn.angle - 90) * Math.PI) / 180
                  const x = 170 + 130 * Math.cos(rad)
                  const y = 170 + 130 * Math.sin(rad)
                  return (
                    <g key={vn.id}>
                      <circle
                        cx={x}
                        cy={y}
                        r="10"
                        fill={vn.color}
                        stroke="#0F1217"
                        strokeWidth="3"
                        className="transition-all duration-300"
                      />
                      <text
                        x={x}
                        y={y - 14}
                        textAnchor="middle"
                        fill={vn.color}
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {vn.serverName.split(' ')[1]} ({Math.round(vn.angle)}°)
                      </text>
                    </g>
                  )
                })}

                {/* Render Keys on Ring */}
                {keyAssignments.map(k => {
                  const rad = ((k.angle - 90) * Math.PI) / 180
                  const x = 170 + 130 * Math.cos(rad)
                  const y = 170 + 130 * Math.sin(rad)
                  const isSelected = selectedKey?.id === k.id
                  return (
                    <g key={k.id} onClick={() => setSelectedKey(k)} className="cursor-pointer">
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? "6" : "4"}
                        fill={isSelected ? "#FFF" : k.assignedColor}
                        stroke="#0F1217"
                        strokeWidth="1.5"
                      />
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Architecture Explainer */}
            <div className="rounded-xl bg-atlas-bg0/60 p-3 text-xs text-atlas-muted space-y-1 border border-atlas-muted/10">
              <div className="font-semibold text-atlas-text flex items-center gap-1.5">
                <Info size={13} className="text-atlas-brand" />
                <span>Modulo Hashing vs Consistent Hashing:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                In traditional <code className="text-rose-400 font-mono">hash(key) % N</code>, adding or removing a node causes nearly <strong>100% of all cache keys to reshuffle</strong>. Consistent Hashing limits remapping to only <code className="text-emerald-400 font-mono">K / N</code> keys ($K=$ total keys, $N=$ total servers).
              </p>
            </div>
          </div>
        </div>

        {/* Right: Server Clusters & Key Load Distribution */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-4">
            <h4 className="text-sm font-bold text-atlas-text">Server Nodes & Key Distribution</h4>

            {/* Server List Cards */}
            <div className="space-y-2.5">
              {servers.map(s => {
                const count = serverLoads[s.id] || 0
                const percent = keys.length > 0 ? Math.round((count / keys.length) * 100) : 0
                return (
                  <div
                    key={s.id}
                    className="rounded-xl border border-atlas-muted/20 bg-atlas-elev/60 p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="font-semibold text-xs text-atlas-text">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-atlas-text font-bold">
                          {count} keys ({percent}%)
                        </span>
                        {servers.length > 1 && (
                          <button
                            onClick={() => handleRemoveServer(s.id)}
                            className="text-atlas-muted hover:text-rose-400 p-1 transition"
                            title="Simulate Server Crash / Decommission"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 w-full rounded-full bg-atlas-bg0 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${percent}%`, backgroundColor: s.color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Key Routing Inspector */}
            <div className="space-y-2 pt-3 border-t border-atlas-muted/15">
              <span className="text-xs font-bold text-atlas-text block">Key Routing Registry</span>
              <div className="space-y-1.5 max-h-[180px] overflow-y-auto font-mono text-[11px] pr-1">
                {keyAssignments.map(k => (
                  <div
                    key={k.id}
                    onClick={() => setSelectedKey(k)}
                    className={cn(
                      'p-2 rounded-lg flex items-center justify-between cursor-pointer transition',
                      selectedKey?.id === k.id
                        ? 'bg-atlas-brand/20 text-white ring-1 ring-atlas-brand'
                        : 'bg-atlas-bg0/60 text-atlas-muted hover:bg-atlas-bg0'
                    )}
                  >
                    <span className="text-cyan-300 font-semibold">{k.key} ({k.angle}°)</span>
                    <span className="flex items-center gap-1.5 text-[10px]">
                      <span>➔</span>
                      <strong style={{ color: k.assignedColor }}>{k.assignedServerName}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
