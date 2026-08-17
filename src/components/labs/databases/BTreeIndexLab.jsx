import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Database,
  Plus,
  Search,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  HardDrive,
  Layers,
  ArrowDown
} from 'lucide-react'
import { cn } from '../../../utils/cn'

// Simplified 2-3 / B-Tree Order M=3 data model
class BTreeNode {
  constructor(isLeaf = true) {
    this.keys = []
    this.children = []
    this.isLeaf = isLeaf
    this.id = `node-${Math.random().toString(36).substring(2, 7)}`
  }
}

export default function BTreeIndexLab() {
  const [inputVal, setInputVal] = useState('')
  const [searchTarget, setSearchTarget] = useState(null)
  const [visitedNodes, setVisitedNodes] = useState([])
  const [searchResult, setSearchResult] = useState(null)
  
  // Tree state represented as a structured node tree
  const [treeRoot, setTreeRoot] = useState(() => {
    const root = new BTreeNode(false)
    root.keys = [20]
    
    const leftChild = new BTreeNode(true)
    leftChild.keys = [5, 12]
    
    const rightChild = new BTreeNode(true)
    rightChild.keys = [28, 35]
    
    root.children = [leftChild, rightChild]
    return root
  })

  const [stats, setStats] = useState({
    totalKeys: 5,
    treeDepth: 2,
    diskPageReads: 2,
    splitsCount: 1
  })
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, text: 'B-Tree initialized with Order M=3 (Max 2 keys per page)', type: 'info' }
  ])

  const addLog = (text, type = 'info') => {
    setAuditLogs(prev => [{ id: Date.now() + Math.random(), text, type }, ...prev.slice(0, 15)])
  }

  // Search in B-Tree
  const handleSearch = (valToSearch = null) => {
    const val = Number(valToSearch !== null ? valToSearch : inputVal)
    if (isNaN(val)) return

    const visited = []
    let curr = treeRoot
    let found = false
    let depth = 1

    while (curr) {
      visited.push(curr.id)
      // Check if key is in current node
      if (curr.keys.includes(val)) {
        found = true
        break
      }
      if (curr.isLeaf) break

      // Find appropriate child branch
      let idx = 0
      while (idx < curr.keys.length && val > curr.keys[idx]) {
        idx++
      }
      curr = curr.children[idx]
      depth++
    }

    setVisitedNodes(visited)
    setStats(prev => ({ ...prev, diskPageReads: visited.length }))
    setSearchResult(found ? `Key ${val} found on disk page with ${visited.length} page reads.` : `Key ${val} NOT found (hit leaf).`)
    addLog(
      found
        ? `SEARCH(${val}) ➔ FOUND! Disk Page I/O Reads = ${visited.length} (Logarithmic O(log N)).`
        : `SEARCH(${val}) ➔ MISS! Scanned ${visited.length} pages. Key not in index.`,
      found ? 'success' : 'error'
    )
  }

  // Insert Key into B-Tree (Order M=3)
  const handleInsert = () => {
    const val = Number(inputVal)
    if (isNaN(val) || val <= 0) return

    // Add key and recalculate
    const cloned = JSON.parse(JSON.stringify(treeRoot))

    // Helper insert
    const insertNonFull = (node, k) => {
      if (node.isLeaf) {
        if (!node.keys.includes(k)) {
          node.keys.push(k)
          node.keys.sort((a, b) => a - b)
        }
      } else {
        let i = node.keys.length - 1
        while (i >= 0 && k < node.keys[i]) i--
        i++
        insertNonFull(node.children[i], k)
        // Check if child overflowed (> 2 keys)
        if (node.children[i].keys.length > 2) {
          splitChild(node, i)
        }
      }
    }

    const splitChild = (parent, childIdx) => {
      const child = parent.children[childIdx]
      const midKey = child.keys[1]
      
      const newSibling = {
        id: `node-${Math.random().toString(36).substring(2, 7)}`,
        isLeaf: child.isLeaf,
        keys: [child.keys[2]],
        children: child.isLeaf ? [] : child.children.slice(2)
      }
      
      child.keys = [child.keys[0]]
      if (!child.isLeaf) {
        child.children = child.children.slice(0, 2)
      }

      parent.keys.splice(childIdx, 0, midKey)
      parent.children.splice(childIdx + 1, 0, newSibling)
      setStats(s => ({ ...s, splitsCount: s.splitsCount + 1 }))
      addLog(`PAGE SPLIT! Node reached 3 keys. Middle key (${midKey}) promoted to parent.`, 'split')
    }

    // If root overflows
    if (cloned.keys.length > 2 || (cloned.isLeaf && cloned.keys.length >= 2 && !cloned.keys.includes(val))) {
      if (cloned.isLeaf) {
        cloned.keys.push(val)
        cloned.keys.sort((a, b) => a - b)
        const midKey = cloned.keys[1]
        const newRoot = {
          id: `node-root-${Date.now()}`,
          isLeaf: false,
          keys: [midKey],
          children: [
            { id: `node-l-${Date.now()}`, isLeaf: true, keys: [cloned.keys[0]], children: [] },
            { id: `node-r-${Date.now()}`, isLeaf: true, keys: [cloned.keys[2]], children: [] }
          ]
        }
        setTreeRoot(newRoot)
        setStats(s => ({ ...s, treeDepth: 2, totalKeys: s.totalKeys + 1, splitsCount: s.splitsCount + 1 }))
        addLog(`INSERT(${val}) ➔ Root Split! New root created with depth 2.`, 'split')
        setInputVal('')
        return
      }
    }

    insertNonFull(cloned, val)

    // Check if root split needed
    if (cloned.keys.length > 2) {
      const mid = cloned.keys[1]
      const newRoot = {
        id: `node-root-${Date.now()}`,
        isLeaf: false,
        keys: [mid],
        children: [
          {
            id: `node-l-${Date.now()}`,
            isLeaf: cloned.isLeaf,
            keys: [cloned.keys[0]],
            children: cloned.children.slice(0, 2)
          },
          {
            id: `node-r-${Date.now()}`,
            isLeaf: cloned.isLeaf,
            keys: [cloned.keys[2]],
            children: cloned.children.slice(2)
          }
        ]
      }
      setTreeRoot(newRoot)
      setStats(s => ({ ...s, treeDepth: s.treeDepth + 1, totalKeys: s.totalKeys + 1 }))
    } else {
      setTreeRoot(cloned)
      setStats(s => ({ ...s, totalKeys: s.totalKeys + 1 }))
      addLog(`INSERT(${val}) ➔ Inserted key into leaf page slot.`, 'info')
    }

    setInputVal('')
  }

  const handleReset = () => {
    const root = new BTreeNode(false)
    root.keys = [20]
    const l = new BTreeNode(true)
    l.keys = [5, 12]
    const r = new BTreeNode(true)
    r.keys = [28, 35]
    root.children = [l, r]
    setTreeRoot(root)
    setVisitedNodes([])
    setSearchResult(null)
    setStats({ totalKeys: 5, treeDepth: 2, diskPageReads: 2, splitsCount: 1 })
    setAuditLogs([{ id: Date.now(), text: 'B-Tree index reset to default state.', type: 'info' }])
  }

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-atlas-surface via-atlas-elev to-atlas-surface p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Database size={18} className="text-amber-400" />
            <span>Database Storage Engine & Indexing Simulation</span>
          </div>
          <h3 className="mt-1 text-xl font-bold text-atlas-text">B-Tree Database Index & Disk Page Traversal</h3>
          <p className="text-xs text-atlas-muted mt-0.5 max-w-2xl">
            Simulates self-balancing B-Tree disk page blocks (PostgreSQL / MySQL InnoDB style). Demonstrates how large fanouts reduce disk I/O to $\mathcal{O}(\log_M N)$ reads.
          </p>
        </div>

        {/* Telemetry metrics */}
        <div className="flex items-center gap-3 bg-atlas-bg0/80 p-3 rounded-2xl border border-atlas-muted/20">
          <div className="text-center px-2">
            <span className="text-[10px] text-atlas-muted uppercase block">Index Depth</span>
            <span className="text-base font-bold font-mono text-amber-400">{stats.treeDepth} Levels</span>
          </div>
          <div className="h-7 w-px bg-atlas-muted/20" />
          <div className="text-center px-2">
            <span className="text-[10px] text-atlas-muted uppercase block">Disk Page I/O</span>
            <span className="text-base font-bold font-mono text-cyan-300">{stats.diskPageReads} Reads</span>
          </div>
          <div className="h-7 w-px bg-atlas-muted/20" />
          <div className="text-center px-2">
            <span className="text-[10px] text-atlas-muted uppercase block">Node Splits</span>
            <span className="text-base font-bold font-mono text-emerald-400">{stats.splitsCount}</span>
          </div>
        </div>
      </div>

      {/* Control Strip */}
      <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-surface/80 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="number"
              placeholder="Key (e.g. 15)"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              className="h-8 w-28 rounded-lg bg-atlas-bg0 border border-atlas-muted/30 px-2.5 text-xs text-atlas-text font-mono focus:outline-none focus:border-amber-400"
            />
            <button
              onClick={() => handleSearch()}
              disabled={!inputVal}
              className="flex items-center gap-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30 px-3 py-1.5 text-xs font-semibold transition disabled:opacity-40"
            >
              <Search size={13} /> Search Key
            </button>
            <button
              onClick={handleInsert}
              disabled={!inputVal}
              className="flex items-center gap-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 px-3 py-1.5 text-xs font-semibold transition disabled:opacity-40"
            >
              <Plus size={13} /> Insert Key
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 rounded-lg bg-atlas-elev hover:bg-atlas-bg0 border border-atlas-muted/20 px-3 py-1.5 text-xs font-medium text-atlas-muted hover:text-atlas-text transition"
            >
              <RotateCcw size={13} /> Reset
            </button>
          </div>

          {searchResult && (
            <div className="text-[11px] font-mono text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/20 flex items-center gap-1.5">
              <CheckCircle2 size={13} />
              <span>{searchResult}</span>
            </div>
          )}
        </div>
      </div>

      {/* Visual B-Tree Hierarchical Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-6 space-y-8 min-h-[380px] flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-atlas-text">Hierarchical Disk Page Layout (Order M=3)</h4>
              <span className="text-xs font-mono text-atlas-muted">Page Capacity: 2 Keys / 3 Pointers</span>
            </div>

            {/* Root Page */}
            <div className="flex flex-col items-center space-y-6">
              <div
                className={cn(
                  'rounded-xl border-2 p-3 min-w-[140px] text-center transition shadow-lg',
                  visitedNodes.includes(treeRoot.id)
                    ? 'border-cyan-400 bg-cyan-500/20 ring-2 ring-cyan-400'
                    : 'border-amber-500/40 bg-atlas-elev'
                )}
              >
                <span className="text-[10px] text-atlas-muted font-mono uppercase block">Root Disk Page</span>
                <div className="flex items-center justify-center gap-2 mt-1">
                  {treeRoot.keys.map(k => (
                    <span
                      key={k}
                      onClick={() => handleSearch(k)}
                      className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold cursor-pointer hover:bg-amber-500/40 transition"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>

              {/* Child Pages (Level 2) */}
              {treeRoot.children && treeRoot.children.length > 0 && (
                <div className="w-full flex items-start justify-around gap-4 pt-2 relative">
                  {treeRoot.children.map((child, idx) => {
                    const isVisited = visitedNodes.includes(child.id)
                    return (
                      <motion.div
                        key={child.id || idx}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center space-y-2"
                      >
                        <ArrowDown size={14} className="text-atlas-muted/50" />
                        <div
                          className={cn(
                            'rounded-xl border-2 p-3 min-w-[120px] text-center transition shadow-md',
                            isVisited
                              ? 'border-cyan-400 bg-cyan-500/20 ring-2 ring-cyan-400'
                              : 'border-atlas-muted/30 bg-atlas-elev/80'
                          )}
                        >
                          <span className="text-[9px] text-atlas-muted font-mono uppercase block">
                            {child.isLeaf ? 'Leaf Page' : 'Internal Page'}
                          </span>
                          <div className="flex items-center justify-center gap-1.5 mt-1">
                            {child.keys.map(k => (
                              <span
                                key={k}
                                onClick={() => handleSearch(k)}
                                className="px-2 py-0.5 rounded bg-atlas-bg0 text-atlas-text font-mono text-xs font-semibold cursor-pointer hover:bg-amber-500/30 transition"
                              >
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Explainer note */}
            <div className="rounded-xl bg-atlas-bg0/60 p-3 text-xs text-atlas-muted space-y-1 border border-atlas-muted/10">
              <div className="font-semibold text-atlas-text flex items-center gap-1.5">
                <Info size={13} className="text-amber-400" />
                <span>Why Databases Use B-Trees over Binary Search Trees (BST):</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Binary trees have a fanout of 2, requiring deep levels and hundreds of separate random disk seeks. A <strong>B-Tree</strong> stores thousands of keys per page block (fanout $M \approx 1000$), allowing databases to search billions of rows in only <strong>3 to 4 disk page reads</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Storage Engine Audit Log */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-4">
            <h4 className="text-sm font-bold text-atlas-text font-sans">Storage Engine Operations</h4>

            <div className="space-y-1.5 max-h-[300px] overflow-y-auto font-mono text-[11px] pr-1">
              {auditLogs.map(l => (
                <div
                  key={l.id}
                  className={cn(
                    'p-2 rounded text-[10px] leading-tight',
                    l.type === 'success' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20' :
                    l.type === 'split' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20' :
                    l.type === 'error' ? 'bg-rose-500/15 text-rose-300 border border-rose-500/20' :
                    'bg-atlas-elev text-atlas-muted'
                  )}
                >
                  {l.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
