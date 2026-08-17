import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers,
  Database,
  ArrowRight,
  ArrowLeftRight,
  Plus,
  Search,
  RotateCcw,
  Sparkles,
  Zap,
  Info,
  CheckCircle2,
  XCircle,
  Trash2
} from 'lucide-react'
import { cn } from '../../utils/cn'

export default function LRUCacheVisualizer() {
  const [capacity, setCapacity] = useState(4)
  const [inputKey, setInputKey] = useState('')
  const [inputValue, setInputValue] = useState('')
  // Doubly Linked List represented as array ordered from MRU (head) to LRU (tail)
  const [cacheList, setCacheList] = useState([
    { key: 'A', value: '100', address: '0x01' },
    { key: 'B', value: '200', address: '0x02' },
    { key: 'C', value: '300', address: '0x03' }
  ])
  const [activeAction, setActiveAction] = useState(null)
  const [logs, setLogs] = useState([
    { id: 1, text: 'LRU Cache initialized with capacity = 4', type: 'info' }
  ])
  const [stats, setStats] = useState({ hits: 5, misses: 2, totalOps: 7, evictions: 0 })

  const addLog = (text, type = 'info') => {
    setLogs(prev => [{ id: Date.now(), text, type }, ...prev.slice(0, 19)])
  }

  // GET Operation
  const handleGet = (keyToGet = inputKey) => {
    const k = (keyToGet || '').trim().toUpperCase()
    if (!k) return

    const index = cacheList.findIndex(item => item.key === k)
    setStats(prev => ({ ...prev, totalOps: prev.totalOps + 1 }))

    if (index !== -1) {
      // Hit: Move to MRU (head of list)
      const hitItem = cacheList[index]
      const updatedList = [hitItem, ...cacheList.filter((_, i) => i !== index)]
      setCacheList(updatedList)
      setStats(prev => ({ ...prev, hits: prev.hits + 1 }))
      setActiveAction({ type: 'hit', key: k, value: hitItem.value, address: hitItem.address })
      addLog(`GET("${k}") ➔ HIT! Found value "${hitItem.value}". Splice node to HEAD (MRU).`, 'hit')
    } else {
      // Miss
      setStats(prev => ({ ...prev, misses: prev.misses + 1 }))
      setActiveAction({ type: 'miss', key: k })
      addLog(`GET("${k}") ➔ MISS! Key not present in HashMap lookup (null).`, 'miss')
    }
  }

  // PUT Operation
  const handlePut = () => {
    const k = inputKey.trim().toUpperCase()
    const v = inputValue.trim() || '1'
    if (!k) return

    setStats(prev => ({ ...prev, totalOps: prev.totalOps + 1 }))
    const existingIndex = cacheList.findIndex(item => item.key === k)

    if (existingIndex !== -1) {
      // Key already exists -> update value and move to MRU
      const updatedItem = { ...cacheList[existingIndex], value: v }
      const updatedList = [updatedItem, ...cacheList.filter((_, i) => i !== existingIndex)]
      setCacheList(updatedList)
      setActiveAction({ type: 'update', key: k, value: v, address: updatedItem.address })
      addLog(`PUT("${k}", "${v}") ➔ Key exists! Updated value and promoted to HEAD (MRU).`, 'update')
    } else {
      // New key
      let evicted = null
      let currentList = [...cacheList]

      if (currentList.length >= capacity) {
        // Evict LRU (tail element)
        evicted = currentList[currentList.length - 1]
        currentList = currentList.slice(0, currentList.length - 1)
        setStats(prev => ({ ...prev, evictions: prev.evictions + 1 }))
      }

      const newAddress = `0x0${Math.floor(Math.random() * 89 + 10)}`
      const newItem = { key: k, value: v, address: newAddress }
      setCacheList([newItem, ...currentList])

      if (evicted) {
        setActiveAction({ type: 'evict', key: k, evictedKey: evicted.key, address: newAddress })
        addLog(`PUT("${k}", "${v}") ➔ Capacity full (${capacity}). Evicted LRU TAIL ("${evicted.key}"). Inserted "${k}" at HEAD.`, 'evict')
      } else {
        setActiveAction({ type: 'insert', key: k, value: v, address: newAddress })
        addLog(`PUT("${k}", "${v}") ➔ Allocated node at HEAD (MRU) with pointer ${newAddress}.`, 'insert')
      }
    }

    setInputKey('')
    setInputValue('')
  }

  const handleReset = () => {
    setCacheList([
      { key: 'A', value: '100', address: '0x01' },
      { key: 'B', value: '200', address: '0x02' }
    ])
    setStats({ hits: 0, misses: 0, totalOps: 0, evictions: 0 })
    setActiveAction(null)
    setLogs([{ id: Date.now(), text: 'Cache reset to initial state', type: 'info' }])
  }

  const handleRandomOp = () => {
    const keys = ['A', 'B', 'C', 'D', 'E', 'F']
    const isGet = Math.random() > 0.4
    const randKey = keys[Math.floor(Math.random() * keys.length)]
    if (isGet) {
      handleGet(randKey)
    } else {
      setInputKey(randKey)
      setInputValue(String(Math.floor(Math.random() * 900 + 100)))
      setTimeout(() => {
        // Trigger put
        const k = randKey
        const v = String(Math.floor(Math.random() * 900 + 100))
        const existingIndex = cacheList.findIndex(item => item.key === k)
        setStats(prev => ({ ...prev, totalOps: prev.totalOps + 1 }))
        if (existingIndex !== -1) {
          const updatedItem = { ...cacheList[existingIndex], value: v }
          setCacheList([updatedItem, ...cacheList.filter((_, i) => i !== existingIndex)])
          addLog(`PUT("${k}", "${v}") ➔ Updated existing key & moved to HEAD.`, 'update')
        } else {
          let currentList = [...cacheList]
          let evicted = null
          if (currentList.length >= capacity) {
            evicted = currentList[currentList.length - 1]
            currentList = currentList.slice(0, currentList.length - 1)
            setStats(prev => ({ ...prev, evictions: prev.evictions + 1 }))
          }
          const newAddress = `0x0${Math.floor(Math.random() * 89 + 10)}`
          setCacheList([{ key: k, value: v, address: newAddress }, ...currentList])
          if (evicted) {
            addLog(`PUT("${k}", "${v}") ➔ Evicted LRU "${evicted.key}". Added "${k}".`, 'evict')
          } else {
            addLog(`PUT("${k}", "${v}") ➔ Added "${k}" to HEAD.`, 'insert')
          }
        }
      }, 50)
    }
  }

  const hitRatio = stats.totalOps > 0 ? Math.round((stats.hits / stats.totalOps) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="rounded-3xl border border-atlas-brand/30 bg-gradient-to-br from-atlas-surface via-atlas-elev to-atlas-surface p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-atlas-brand">
            <Database size={18} className="text-atlas-brand" />
            <span>Distributed Caching & In-Memory Storage</span>
          </div>
          <h3 className="mt-1 text-xl font-bold text-atlas-text">LRU Cache (Least Recently Used) Simulator</h3>
          <p className="text-xs text-atlas-muted mt-0.5 max-w-2xl">
            Simulates strictly $O(1)$ time complexity for both <code className="text-cyan-300">get(key)</code> and <code className="text-emerald-300">put(key, val)</code> operations by interleaving a <strong>Hash Map</strong> with a <strong>Doubly Linked List</strong>.
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-3 bg-atlas-bg0/60 p-3 rounded-2xl border border-atlas-muted/20">
          <div className="text-center px-2">
            <span className="text-[10px] text-atlas-muted uppercase block">Hit Rate</span>
            <span className="text-base font-bold font-mono text-emerald-400">{hitRatio}%</span>
          </div>
          <div className="h-7 w-px bg-atlas-muted/20" />
          <div className="text-center px-2">
            <span className="text-[10px] text-atlas-muted uppercase block">Hits / Misses</span>
            <span className="text-xs font-mono text-atlas-text">{stats.hits} / {stats.misses}</span>
          </div>
          <div className="h-7 w-px bg-atlas-muted/20" />
          <div className="text-center px-2">
            <span className="text-[10px] text-atlas-muted uppercase block">Evictions</span>
            <span className="text-xs font-mono text-rose-400">{stats.evictions}</span>
          </div>
        </div>
      </div>

      {/* Control Strip */}
      <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-surface/80 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Capacity Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-atlas-muted font-medium">Capacity (N):</span>
            <div className="flex items-center gap-1">
              {[2, 3, 4, 5, 6].map(c => (
                <button
                  key={c}
                  onClick={() => {
                    setCapacity(c)
                    if (cacheList.length > c) {
                      setCacheList(cacheList.slice(0, c))
                    }
                  }}
                  className={cn(
                    'h-7 w-7 rounded-lg text-xs font-mono font-bold transition border',
                    capacity === c
                      ? 'bg-atlas-brand text-white border-atlas-brand'
                      : 'bg-atlas-elev text-atlas-muted border-atlas-muted/20 hover:text-atlas-text'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Action Inputs */}
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="text"
              maxLength={2}
              placeholder="Key (e.g. D)"
              value={inputKey}
              onChange={e => setInputKey(e.target.value.toUpperCase())}
              className="h-8 w-24 rounded-lg bg-atlas-bg0 border border-atlas-muted/30 px-2.5 text-xs text-atlas-text placeholder:text-atlas-muted/50 font-mono focus:outline-none focus:border-atlas-brand"
            />
            <input
              type="text"
              placeholder="Val (e.g. 400)"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="h-8 w-24 rounded-lg bg-atlas-bg0 border border-atlas-muted/30 px-2.5 text-xs text-atlas-text placeholder:text-atlas-muted/50 font-mono focus:outline-none focus:border-atlas-brand"
            />
            <button
              onClick={() => handleGet()}
              disabled={!inputKey}
              className="flex items-center gap-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30 px-3 py-1.5 text-xs font-semibold transition disabled:opacity-40"
            >
              <Search size={13} /> GET(key)
            </button>
            <button
              onClick={handlePut}
              disabled={!inputKey}
              className="flex items-center gap-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold transition disabled:opacity-40"
            >
              <Plus size={13} /> PUT(key, val)
            </button>
            <button
              onClick={handleRandomOp}
              className="flex items-center gap-1 rounded-lg bg-atlas-elev hover:bg-atlas-brand hover:text-white border border-atlas-muted/20 px-3 py-1.5 text-xs font-medium text-atlas-text transition"
            >
              <Sparkles size={13} /> Random Op
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 rounded-lg bg-atlas-elev hover:bg-atlas-bg0 border border-atlas-muted/20 px-3 py-1.5 text-xs font-medium text-atlas-muted hover:text-atlas-text transition"
            >
              <RotateCcw size={13} /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Visual Workspace: Doubly Linked List + Hash Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Doubly Linked List View */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowLeftRight size={16} className="text-atlas-brand" />
                <h4 className="text-sm font-bold text-atlas-text">Doubly Linked List (Ordering Structure)</h4>
              </div>
              <span className="text-xs font-mono text-atlas-muted">
                Size: <strong className="text-atlas-text">{cacheList.length}</strong> / {capacity}
              </span>
            </div>

            {/* Visual Node Sequence */}
            <div className="flex items-center gap-2 overflow-x-auto py-6 px-2 min-h-[140px]">
              {/* Head Sentinel */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="rounded-xl border border-dashed border-atlas-brand/40 bg-atlas-brand/10 px-3 py-2 text-center text-xs font-mono font-bold text-atlas-brand">
                  HEAD (MRU)
                </div>
                <span className="text-[10px] text-atlas-muted/60 font-mono mt-1">prev: null</span>
              </div>

              <div className="flex-shrink-0 text-atlas-muted/40 font-mono">⇄</div>

              {/* Cache Nodes */}
              <AnimatePresence>
                {cacheList.map((item, idx) => {
                  const isMRU = idx === 0
                  const isLRU = idx === cacheList.length - 1
                  return (
                    <motion.div
                      key={item.key}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: -20 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      className="flex-shrink-0 flex items-center gap-2"
                    >
                      <div
                        onClick={() => handleGet(item.key)}
                        className={cn(
                          'cursor-pointer rounded-2xl border p-4 w-32 space-y-1.5 transition shadow-lg relative',
                          isMRU
                            ? 'border-emerald-500/50 bg-emerald-500/10 ring-1 ring-emerald-500/40'
                            : isLRU
                            ? 'border-rose-500/40 bg-rose-500/10'
                            : 'border-atlas-muted/20 bg-atlas-elev/80 hover:border-atlas-brand'
                        )}
                      >
                        {/* Tags */}
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-amber-400 font-bold">{item.address}</span>
                          <span className={cn(
                            'px-1.5 py-0.2 rounded font-bold uppercase',
                            isMRU ? 'text-emerald-400 bg-emerald-500/20' :
                            isLRU ? 'text-rose-400 bg-rose-500/20' : 'text-atlas-muted'
                          )}>
                            {isMRU ? 'MRU' : isLRU ? 'LRU' : `#${idx}`}
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between pt-1">
                          <span className="text-lg font-bold font-mono text-atlas-text">{item.key}</span>
                          <span className="text-xs font-mono text-cyan-300">val: {item.value}</span>
                        </div>

                        <div className="text-[9px] text-atlas-muted font-mono flex justify-between pt-1 border-t border-atlas-muted/10">
                          <span>prev: {idx > 0 ? cacheList[idx - 1].address : 'HEAD'}</span>
                          <span>next: {idx < cacheList.length - 1 ? cacheList[idx + 1].address : 'TAIL'}</span>
                        </div>
                      </div>

                      {/* Connector arrow */}
                      <div className="text-atlas-muted/40 font-mono">⇄</div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              {/* Tail Sentinel */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="rounded-xl border border-dashed border-rose-500/40 bg-rose-500/10 px-3 py-2 text-center text-xs font-mono font-bold text-rose-400">
                  TAIL (LRU)
                </div>
                <span className="text-[10px] text-atlas-muted/60 font-mono mt-1">next: null</span>
              </div>
            </div>

            {/* Explanation callout */}
            <div className="rounded-xl bg-atlas-bg0/60 p-3 text-xs text-atlas-muted space-y-1 border border-atlas-muted/10">
              <div className="font-semibold text-atlas-text flex items-center gap-1.5">
                <Info size={13} className="text-atlas-brand" />
                <span>Why Doubly Linked List?</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                A singly linked list cannot delete a node in $O(1)$ without scanning from head to find the previous pointer. A <strong>Doubly Linked List</strong> allows instant $O(1)$ detachment: <code className="text-cyan-300 font-mono">node.prev.next = node.next</code> and <code className="text-cyan-300 font-mono">node.next.prev = node.prev</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Hash Map Index View */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database size={16} className="text-amber-400" />
                <h4 className="text-sm font-bold text-atlas-text">Hash Map (Direct Pointers)</h4>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                O(1) Lookup
              </span>
            </div>

            {/* Hash Table Entries */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {cacheList.map(item => (
                <div
                  key={item.key}
                  onClick={() => handleGet(item.key)}
                  className="flex items-center justify-between rounded-xl bg-atlas-elev/70 hover:bg-atlas-elev p-2.5 font-mono text-xs border border-atlas-muted/15 cursor-pointer transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-300">"{item.key}"</span>
                    <span className="text-atlas-muted">➔</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-semibold">{item.address}</span>
                    <span className="text-[10px] text-atlas-muted">(Node ptr)</span>
                  </div>
                </div>
              ))}
              {cacheList.length === 0 && (
                <div className="text-center py-6 text-xs text-atlas-muted font-mono">
                  Cache is currently empty
                </div>
              )}
            </div>

            {/* Event Logs */}
            <div className="space-y-2 pt-2 border-t border-atlas-muted/15">
              <span className="text-xs font-bold text-atlas-text block">Operation Audit Log</span>
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto font-mono text-[11px] pr-1">
                {logs.map(log => (
                  <div
                    key={log.id}
                    className={cn(
                      'p-1.5 rounded text-[10px] leading-tight',
                      log.type === 'hit' ? 'bg-emerald-500/15 text-emerald-300' :
                      log.type === 'miss' ? 'bg-rose-500/15 text-rose-300' :
                      log.type === 'evict' ? 'bg-amber-500/15 text-amber-300' :
                      'bg-atlas-elev text-atlas-muted'
                    )}
                  >
                    {log.text}
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
