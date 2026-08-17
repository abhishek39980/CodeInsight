import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers,
  Database,
  Cpu,
  Trash2,
  AlertTriangle,
  Play,
  RotateCcw,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Info,
  CheckCircle2
} from 'lucide-react'
import { cn } from '../../utils/cn'

// Default presets for different data structure patterns
const PRESETS = {
  arrays: {
    name: 'Array & Hash Table (Two Sum)',
    description: 'Stack holds primitive loop counters & pointers; Heap holds dynamic Array buffer and Hash Table buckets.',
    stackFrames: [
      {
        id: 'frame-1',
        fn: 'twoSum(nums, target)',
        scope: 'Local Scope (Line 6)',
        vars: [
          { name: 'nums', type: 'ref', value: '0x7F01', refId: 'heap-1' },
          { name: 'target', type: 'primitive', value: '9' },
          { name: 'map', type: 'ref', value: '0x7F02', refId: 'heap-2' },
          { name: 'i', type: 'primitive', value: '1' },
          { name: 'complement', type: 'primitive', value: '7' }
        ]
      },
      {
        id: 'frame-0',
        fn: 'main()',
        scope: 'Global Scope',
        vars: [
          { name: 'result', type: 'ref', value: '0x7F03', refId: 'heap-3' }
        ]
      }
    ],
    heapObjects: [
      {
        id: 'heap-1',
        address: '0x7F01',
        label: 'Array (nums)',
        type: 'Array [4]',
        bytes: 64,
        reachable: true,
        data: '[2, 7, 11, 15]'
      },
      {
        id: 'heap-2',
        address: '0x7F02',
        label: 'Map (seen)',
        type: 'HashMap',
        bytes: 128,
        reachable: true,
        data: '{ 2 => 0 }'
      },
      {
        id: 'heap-3',
        address: '0x7F03',
        label: 'Array (result)',
        type: 'Array [2]',
        bytes: 32,
        reachable: true,
        data: '[0, 1]'
      },
      {
        id: 'heap-orphan',
        address: '0x7F99',
        label: 'Temporary Buffer',
        type: 'Object (Garbage)',
        bytes: 96,
        reachable: false,
        data: '{ tempKey: "unused" }'
      }
    ],
    stackDepth: 2,
    maxDepth: 12
  },
  'linked-lists': {
    name: 'Linked List Reversal',
    description: 'Stack stores pointer references (prev, curr, next); Heap stores detached/re-linked Node objects.',
    stackFrames: [
      {
        id: 'frame-1',
        fn: 'reverseList(head)',
        scope: 'Iteration #2',
        vars: [
          { name: 'prev', type: 'ref', value: '0x7A01', refId: 'node-1' },
          { name: 'curr', type: 'ref', value: '0x7A02', refId: 'node-2' },
          { name: 'next', type: 'ref', value: '0x7A03', refId: 'node-3' }
        ]
      },
      {
        id: 'frame-0',
        fn: 'main()',
        scope: 'Global Scope',
        vars: [
          { name: 'head', type: 'ref', value: '0x7A01', refId: 'node-1' }
        ]
      }
    ],
    heapObjects: [
      {
        id: 'node-1',
        address: '0x7A01',
        label: 'ListNode(val=1)',
        type: 'Node',
        bytes: 48,
        reachable: true,
        data: '{ val: 1, next: null }'
      },
      {
        id: 'node-2',
        address: '0x7A02',
        label: 'ListNode(val=2)',
        type: 'Node',
        bytes: 48,
        reachable: true,
        data: '{ val: 2, next: 0x7A01 }'
      },
      {
        id: 'node-3',
        address: '0x7A03',
        label: 'ListNode(val=3)',
        type: 'Node',
        bytes: 48,
        reachable: true,
        data: '{ val: 3, next: 0x7A04 }'
      },
      {
        id: 'node-orphan',
        address: '0x7A88',
        label: 'Severed Node (Orphan)',
        type: 'Node (Garbage)',
        bytes: 48,
        reachable: false,
        data: '{ val: 99, next: null }'
      }
    ],
    stackDepth: 2,
    maxDepth: 12
  },
  recursion: {
    name: 'Recursive Tree Traversal / Call Stack',
    description: 'Shows stacked function frames growing in call stack depth alongside heap-allocated Tree Nodes.',
    stackFrames: [
      {
        id: 'frame-3',
        fn: 'inorder(node.left)',
        scope: 'Depth 3 (Leaf node)',
        vars: [
          { name: 'node', type: 'ref', value: '0x7C03', refId: 'tree-3' },
          { name: 'depth', type: 'primitive', value: '3' }
        ]
      },
      {
        id: 'frame-2',
        fn: 'inorder(node.left)',
        scope: 'Depth 2 (Subtree)',
        vars: [
          { name: 'node', type: 'ref', value: '0x7C02', refId: 'tree-2' },
          { name: 'depth', type: 'primitive', value: '2' }
        ]
      },
      {
        id: 'frame-1',
        fn: 'inorder(root)',
        scope: 'Depth 1 (Root node)',
        vars: [
          { name: 'node', type: 'ref', value: '0x7C01', refId: 'tree-1' },
          { name: 'depth', type: 'primitive', value: '1' }
        ]
      },
      {
        id: 'frame-0',
        fn: 'main()',
        scope: 'Global Scope',
        vars: [
          { name: 'treeRoot', type: 'ref', value: '0x7C01', refId: 'tree-1' }
        ]
      }
    ],
    heapObjects: [
      {
        id: 'tree-1',
        address: '0x7C01',
        label: 'TreeNode(val=10)',
        type: 'TreeNode',
        bytes: 64,
        reachable: true,
        data: '{ val: 10, left: 0x7C02, right: 0x7C04 }'
      },
      {
        id: 'tree-2',
        address: '0x7C02',
        label: 'TreeNode(val=5)',
        type: 'TreeNode',
        bytes: 64,
        reachable: true,
        data: '{ val: 5, left: 0x7C03, right: null }'
      },
      {
        id: 'tree-3',
        address: '0x7C03',
        label: 'TreeNode(val=2)',
        type: 'TreeNode',
        bytes: 64,
        reachable: true,
        data: '{ val: 2, left: null, right: null }'
      }
    ],
    stackDepth: 4,
    maxDepth: 12
  }
}

export default function DSAMemoryProfiler({ problem }) {
  const categoryKey = problem?.category && PRESETS[problem.category] ? problem.category : 'arrays'
  const [selectedPreset, setSelectedPreset] = useState(categoryKey)
  const [stackFrames, setStackFrames] = useState(PRESETS[categoryKey].stackFrames)
  const [heapObjects, setHeapObjects] = useState(PRESETS[categoryKey].heapObjects)
  const [hoveredRef, setHoveredRef] = useState(null)
  const [gcState, setGcState] = useState('idle') // 'idle' | 'marking' | 'swept'
  const [sweptBytes, setSweptBytes] = useState(0)
  const [stackOverflowWarning, setStackOverflowWarning] = useState(false)
  const [maxStackLimit] = useState(10)

  // Reset when preset changes
  useEffect(() => {
    const p = PRESETS[selectedPreset] || PRESETS.arrays
    setStackFrames(JSON.parse(JSON.stringify(p.stackFrames)))
    setHeapObjects(JSON.parse(JSON.stringify(p.heapObjects)))
    setGcState('idle')
    setSweptBytes(0)
    setStackOverflowWarning(false)
  }, [selectedPreset])

  // Total allocated heap memory
  const totalHeapBytes = heapObjects.reduce((sum, o) => sum + o.bytes, 0)
  const maxHeapLimitBytes = 512

  // Interactive controls
  const handlePushFrame = () => {
    if (stackFrames.length >= maxStackLimit) {
      setStackOverflowWarning(true)
      return
    }
    setStackOverflowWarning(false)
    const depth = stackFrames.length
    const newFrame = {
      id: `frame-${Date.now()}`,
      fn: `recursiveCall(depth=${depth})`,
      scope: `Call Frame #${depth}`,
      vars: [
        { name: 'depth', type: 'primitive', value: String(depth) },
        { name: 'localData', type: 'ref', value: `0x7E${depth}0`, refId: heapObjects[0]?.id || '' }
      ]
    }
    setStackFrames([newFrame, ...stackFrames])
  }

  const handlePopFrame = () => {
    if (stackFrames.length <= 1) return
    setStackOverflowWarning(false)
    setStackFrames(stackFrames.slice(1))
  }

  const handleAllocateHeap = () => {
    const randId = `heap-${Date.now()}`
    const hex = `0x7E${Math.floor(Math.random() * 899 + 100)}`
    const newObj = {
      id: randId,
      address: hex,
      label: `Object (${hex})`,
      type: 'Dynamic Buffer',
      bytes: Math.floor(Math.random() * 32 + 32),
      reachable: false, // Unreferenced by default until linked
      data: '{ status: "allocated", refCount: 0 }'
    }
    setHeapObjects([...heapObjects, newObj])
    setGcState('idle')
  }

  const handleSeverReference = (refId) => {
    // Mark heap object as unreachable (orphan)
    setHeapObjects(prev => prev.map(obj => obj.id === refId ? { ...obj, reachable: false } : obj))
    // Also remove from stack refs
    setStackFrames(prev => prev.map(frame => ({
      ...frame,
      vars: frame.vars.map(v => v.refId === refId ? { ...v, value: 'null', refId: null } : v)
    })))
    setGcState('idle')
  }

  const handleTriggerGC = () => {
    setGcState('marking')
    setTimeout(() => {
      // Find all unreachable objects
      const unreachables = heapObjects.filter(o => !o.reachable)
      const freed = unreachables.reduce((acc, o) => acc + o.bytes, 0)
      setSweptBytes(freed)
      setHeapObjects(heapObjects.filter(o => o.reachable))
      setGcState('swept')
      setTimeout(() => setGcState('idle'), 3000)
    }, 900)
  }

  const handleSimulateOverflow = () => {
    setStackOverflowWarning(true)
    const overflowFrames = Array.from({ length: maxStackLimit }, (_, i) => ({
      id: `overflow-${i}`,
      fn: `recursiveInfinite(depth=${i + 1})`,
      scope: `Call Frame #${i + 1}`,
      vars: [
        { name: 'depth', type: 'primitive', value: String(i + 1) },
        { name: 'data', type: 'primitive', value: '42' }
      ]
    })).reverse()
    setStackFrames(overflowFrames)
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-atlas-brand/30 bg-gradient-to-br from-atlas-surface via-atlas-elev to-atlas-surface p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-atlas-brand">
            <Cpu size={18} className="text-atlas-brand" />
            <span>Hardware & Memory Profiler</span>
          </div>
          <h3 className="mt-1 text-xl font-bold text-atlas-text">Call Stack & Heap Memory Architecture</h3>
          <p className="text-xs text-atlas-muted mt-0.5 max-w-2xl">
            Simulates raw memory segmentation, stack frame lifetimes, heap pointer addresses, and Garbage Collection reachability sweeps.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          {Object.entries(PRESETS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setSelectedPreset(key)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium transition border',
                selectedPreset === key
                  ? 'bg-atlas-brand text-white border-atlas-brand'
                  : 'bg-atlas-surface text-atlas-muted border-atlas-muted/20 hover:text-atlas-text'
              )}
            >
              {val.name.split(' ')[0]} Mode
            </button>
          ))}
        </div>
      </div>

      {/* Stack Overflow Warning Alert */}
      <AnimatePresence>
        {stackOverflowWarning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-rose-500/40 bg-rose-500/15 p-4 flex items-center justify-between gap-3 text-rose-200"
          >
            <div className="flex items-center gap-3">
              <ShieldAlert size={20} className="text-rose-400 flex-shrink-0" />
              <div>
                <span className="font-bold text-sm text-rose-300">RangeError: Maximum call stack size exceeded</span>
                <p className="text-xs text-rose-200/80 mt-0.5">
                  Call stack reached threshold limit ({maxStackLimit} frames). Recursion must terminate with a valid base case to prevent stack frame overflow.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setStackOverflowWarning(false)
                setSelectedPreset(selectedPreset)
              }}
              className="rounded-lg bg-rose-500/30 px-3 py-1.5 text-xs font-semibold text-rose-100 hover:bg-rose-500/50 transition"
            >
              Reset Stack
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-atlas-muted/20 bg-atlas-surface/80 p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handlePushFrame}
            className="flex items-center gap-1.5 rounded-lg bg-atlas-elev hover:bg-atlas-brand hover:text-white px-3 py-1.5 text-xs font-medium text-atlas-text transition border border-atlas-muted/20"
          >
            <Plus size={13} /> Push Frame
          </button>
          <button
            onClick={handlePopFrame}
            disabled={stackFrames.length <= 1}
            className="flex items-center gap-1.5 rounded-lg bg-atlas-elev hover:bg-rose-500/80 hover:text-white px-3 py-1.5 text-xs font-medium text-atlas-text transition border border-atlas-muted/20 disabled:opacity-40"
          >
            <Minus size={13} /> Pop Frame
          </button>
          <div className="h-4 w-px bg-atlas-muted/20 mx-1" />
          <button
            onClick={handleAllocateHeap}
            className="flex items-center gap-1.5 rounded-lg bg-atlas-elev hover:bg-emerald-600 hover:text-white px-3 py-1.5 text-xs font-medium text-atlas-text transition border border-atlas-muted/20"
          >
            <Database size={13} /> Alloc Heap Block
          </button>
          <button
            onClick={handleTriggerGC}
            disabled={gcState === 'marking'}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition border',
              gcState === 'marking'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                : 'bg-atlas-elev hover:bg-amber-500/20 text-amber-400 border-amber-500/30'
            )}
          >
            <Trash2 size={13} /> {gcState === 'marking' ? 'Mark & Sweep...' : 'Run GC Sweep'}
          </button>
          <button
            onClick={handleSimulateOverflow}
            className="flex items-center gap-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 text-xs font-medium text-rose-400 transition border border-rose-500/30"
          >
            <AlertTriangle size={13} /> Trigger Recursion Overflow
          </button>
        </div>

        {/* GC Feedback Notification */}
        {gcState === 'swept' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30"
          >
            <CheckCircle2 size={13} /> Garbage Collected! Reclaimed {sweptBytes} bytes
          </motion.div>
        )}
      </div>

      {/* Main Memory Segmentation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Call Stack Segment */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-cyan-400" />
                <h4 className="text-sm font-bold text-atlas-text">Call Stack (LIFO Segment)</h4>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                Depth: {stackFrames.length} / {maxStackLimit}
              </span>
            </div>

            {/* Stack Depth Gauge */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-atlas-muted font-mono">
                <span>Call Stack Memory Usage</span>
                <span>{Math.round((stackFrames.length / maxStackLimit) * 100)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-atlas-elev overflow-hidden">
                <motion.div
                  className={cn(
                    'h-full transition-all duration-300',
                    stackFrames.length > 7 ? 'bg-rose-500' : stackFrames.length > 4 ? 'bg-amber-400' : 'bg-cyan-400'
                  )}
                  style={{ width: `${Math.min(100, (stackFrames.length / maxStackLimit) * 100)}%` }}
                />
              </div>
            </div>

            {/* Stack Frame Cards */}
            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
              <AnimatePresence>
                {stackFrames.map((frame, idx) => (
                  <motion.div
                    key={frame.id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={cn(
                      'rounded-xl border p-3.5 space-y-2 transition',
                      idx === 0
                        ? 'border-cyan-500/40 bg-cyan-500/10 shadow-md'
                        : 'border-atlas-muted/20 bg-atlas-elev/60'
                    )}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-atlas-text">
                        {idx === 0 && <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />}
                        <span>{frame.fn}</span>
                      </div>
                      <span className="text-[10px] text-atlas-muted font-mono">{frame.scope}</span>
                    </div>

                    {/* Frame Variables */}
                    <div className="space-y-1 pt-1 border-t border-atlas-muted/15">
                      {frame.vars.map(v => (
                        <div
                          key={v.name}
                          onMouseEnter={() => v.refId && setHoveredRef(v.refId)}
                          onMouseLeave={() => setHoveredRef(null)}
                          className={cn(
                            'flex items-center justify-between text-[11px] font-mono px-2 py-1 rounded transition cursor-pointer',
                            hoveredRef === v.refId && v.refId
                              ? 'bg-atlas-brand/30 text-white ring-1 ring-atlas-brand'
                              : 'bg-atlas-bg0/50 text-atlas-muted hover:bg-atlas-bg0'
                          )}
                        >
                          <span className="font-semibold text-atlas-text">{v.name}:</span>
                          <div className="flex items-center gap-1.5">
                            {v.type === 'ref' ? (
                              <span className="text-atlas-brand font-bold flex items-center gap-0.5">
                                ptr ➔ <span className="underline">{v.value}</span>
                              </span>
                            ) : (
                              <span className="text-emerald-400 font-bold">{v.value}</span>
                            )}
                            <span className="text-[9px] text-atlas-muted/60 uppercase">({v.type})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Column: Heap Memory Segment */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database size={16} className="text-amber-400" />
                <h4 className="text-sm font-bold text-atlas-text">Heap Memory Space (Dynamic Allocation)</h4>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Allocated: {totalHeapBytes} B / {maxHeapLimitBytes} B
              </span>
            </div>

            {/* Heap Usage Meter */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-atlas-muted font-mono">
                <span>Simulated Heap Saturation</span>
                <span>{Math.round((totalHeapBytes / maxHeapLimitBytes) * 100)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-atlas-elev overflow-hidden">
                <motion.div
                  className="h-full bg-amber-400 transition-all duration-300"
                  style={{ width: `${Math.min(100, (totalHeapBytes / maxHeapLimitBytes) * 100)}%` }}
                />
              </div>
            </div>

            {/* Heap Object Blocks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto pr-1">
              <AnimatePresence>
                {heapObjects.map(obj => {
                  const isReferenced = hoveredRef === obj.id
                  const isMarkingPhase = gcState === 'marking'
                  return (
                    <motion.div
                      key={obj.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      onMouseEnter={() => setHoveredRef(obj.id)}
                      onMouseLeave={() => setHoveredRef(null)}
                      className={cn(
                        'rounded-xl border p-4 space-y-2.5 transition relative',
                        isReferenced
                          ? 'border-atlas-brand bg-atlas-brand/15 shadow-lg ring-2 ring-atlas-brand'
                          : !obj.reachable
                          ? isMarkingPhase
                            ? 'border-rose-500 bg-rose-500/20 animate-pulse'
                            : 'border-rose-500/30 bg-rose-500/5'
                          : 'border-atlas-muted/20 bg-atlas-elev/50'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-amber-400">{obj.address}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={cn(
                            'text-[10px] font-mono px-1.5 py-0.5 rounded',
                            obj.reachable
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          )}>
                            {obj.reachable ? 'Reachable' : 'Orphan / GC candidate'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-atlas-text">{obj.label}</div>
                        <div className="text-[11px] text-atlas-muted font-mono mt-0.5">{obj.type} · {obj.bytes} Bytes</div>
                      </div>

                      <div className="rounded bg-atlas-bg0/80 p-2 font-mono text-[11px] text-atlas-text/90 break-all border border-atlas-muted/10">
                        {obj.data}
                      </div>

                      {/* Action buttons inside block */}
                      {obj.reachable && (
                        <button
                          onClick={() => handleSeverReference(obj.id)}
                          className="w-full text-center text-[10px] text-atlas-muted hover:text-rose-400 hover:bg-rose-500/10 py-1 rounded transition border border-dashed border-atlas-muted/20 hover:border-rose-500/30"
                        >
                          Sever Reference (Create Orphan)
                        </button>
                      )}
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Architecture Note */}
      <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-surface/60 p-4 text-xs text-atlas-muted space-y-2">
        <div className="flex items-center gap-2 font-semibold text-atlas-text">
          <Info size={14} className="text-atlas-brand" />
          <span>Core Computer Science Memory Mechanics:</span>
        </div>
        <p className="leading-relaxed">
          • <strong>Call Stack:</strong> Fast, contiguous LIFO memory frame allocation. Stores function execution contexts, return pointers, and primitive local values ($O(1)$ push/pop).
        </p>
        <p className="leading-relaxed">
          • <strong>Heap Memory:</strong> Dynamic, fragmented memory storage for dynamic data structures (Trees, Arrays, HashMaps). Accessed via pointer reference addresses.
        </p>
        <p className="leading-relaxed">
          • <strong>Mark-and-Sweep Garbage Collector:</strong> Traverses references originating from root pointers on the Call Stack. Unreachable heap nodes without an incoming path are swept and recycled.
        </p>
      </div>
    </div>
  )
}
