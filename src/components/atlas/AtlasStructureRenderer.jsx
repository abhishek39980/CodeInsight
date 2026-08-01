import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Network, GitBranch, Layers } from 'lucide-react'

// Detect tree structure recursively from heap object
const buildTreeNodes = (obj, x = 200, y = 40, spread = 80, level = 0, nodes = [], edges = []) => {
  if (!obj || typeof obj !== 'object') return { nodes, edges }

  const id = obj.__refId || `node-${x}-${y}`
  const val = obj.value !== undefined ? String(obj.value) : 'node'
  nodes.push({ id, val, x, y, level, raw: obj })

  if (obj.left && typeof obj.left === 'object') {
    const leftX = x - spread
    const leftY = y + 60
    edges.push({ fromX: x, fromY: y, toX: leftX, toY: leftY })
    buildTreeNodes(obj.left, leftX, leftY, spread / 1.8, level + 1, nodes, edges)
  }

  if (obj.right && typeof obj.right === 'object') {
    const rightX = x + spread
    const rightY = y + 60
    edges.push({ fromX: x, fromY: y, toX: rightX, toY: rightY })
    buildTreeNodes(obj.right, rightX, rightY, spread / 1.8, level + 1, nodes, edges)
  }

  return { nodes, edges }
}

// Detect linked list chain from heap object
const buildListNodes = (obj, nodes = []) => {
  let curr = obj
  let depth = 0

  while (curr && typeof curr === 'object' && depth < 10) {
    const id = curr.__refId || `list-${depth}`
    const val = curr.value !== undefined ? String(curr.value) : 'node'
    nodes.push({ id, val, raw: curr })
    curr = curr.next
    depth += 1
  }

  return nodes
}

export default function AtlasStructureRenderer({ currentStep }) {
  const heap = currentStep?.heap || []
  const topFrame = currentStep?.callStack?.[currentStep.callStack.length - 1] || null
  const activeVars = topFrame?.vars || []

  // Auto-detect structure type from active heap objects or scope variables
  const detected = useMemo(() => {
    let treeRoot = null
    let listHead = null
    let graphObj = null

    // Inspect variables in active scope frame first
    activeVars.forEach((v) => {
      if (v.value && typeof v.value === 'object') {
        if (v.value.left !== undefined || v.value.right !== undefined) {
          treeRoot = v.value
        } else if (v.value.next !== undefined) {
          listHead = v.value
        }
      }
    })

    // Inspect heap objects if scope didn't match directly
    if (!treeRoot && !listHead) {
      heap.forEach((h) => {
        if (h && typeof h === 'object') {
          if (h.left !== undefined || h.right !== undefined) {
            treeRoot = h
          } else if (h.next !== undefined) {
            listHead = h
          } else if (h[0] && Array.isArray(h[0])) {
            graphObj = h
          }
        }
      })
    }

    if (treeRoot) {
      const treeData = buildTreeNodes(treeRoot)
      return { type: 'tree', ...treeData }
    }

    if (listHead) {
      const listData = buildListNodes(listHead)
      return { type: 'list', nodes: listData }
    }

    return { type: 'none' }
  }, [activeVars, heap])

  // Active highlighted node check
  const activeValSet = new Set(activeVars.map((v) => String(v.value)))

  return (
    <div className="atlas-surface flex h-full flex-col p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-atlas-brand/40 bg-atlas-brand/15 p-2 text-atlas-brand">
            <Network size={18} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-atlas-muted">Auto-Layout Diagram</p>
            <h3 className="text-base font-semibold text-atlas-text">Data Structure Renderer</h3>
          </div>
        </div>

        <span className="rounded-full border border-atlas-muted/30 bg-atlas-surface px-3 py-1 text-xs text-atlas-brand font-mono">
          {detected.type === 'tree' ? '🌲 Binary Tree' : detected.type === 'list' ? '🔗 Linked List' : '📦 Memory Graph'}
        </span>
      </div>

      <div className="atlas-elevated relative flex flex-1 items-center justify-center p-6 min-h-[360px] overflow-auto">
        {detected.type === 'tree' && (
          <svg viewBox="0 0 400 280" className="h-full w-full max-w-[500px]">
            {/* Tree Edges */}
            {detected.edges.map((e, idx) => (
              <line
                key={`edge-${idx}`}
                x1={e.fromX}
                y1={e.fromY}
                x2={e.toX}
                y2={e.toY}
                stroke="rgba(76,125,255,0.6)"
                strokeWidth="2.5"
              />
            ))}

            {/* Tree Nodes */}
            {detected.nodes.map((n) => {
              const isActive = activeValSet.has(n.val)
              return (
                <g key={n.id}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r="18"
                    className={isActive ? 'fill-atlas-brand stroke-white' : 'fill-atlas-surface stroke-atlas-brand/70'}
                    strokeWidth={isActive ? '3' : '2'}
                  />
                  <text
                    x={n.x}
                    y={n.y + 4}
                    textAnchor="middle"
                    className={`text-xs font-mono font-bold ${isActive ? 'fill-white' : 'fill-atlas-text'}`}
                  >
                    {n.val}
                  </text>
                </g>
              )
            })}
          </svg>
        )}

        {detected.type === 'list' && (
          <div className="flex items-center gap-4 overflow-x-auto p-4">
            {detected.nodes.map((node, idx) => {
              const isActive = activeValSet.has(node.val)
              return (
                <div key={node.id} className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-16 items-center justify-center rounded-xl border font-mono font-bold text-sm shadow-md transition ${
                      isActive
                        ? 'border-atlas-brand bg-atlas-brand/25 text-atlas-text shadow-atlas-brand/30'
                        : 'border-atlas-muted/30 bg-atlas-surface text-atlas-muted'
                    }`}
                  >
                    {node.val}
                  </div>
                  {idx < detected.nodes.length - 1 && (
                    <div className="flex items-center text-atlas-brand font-bold">
                      →
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {detected.type === 'none' && (
          <div className="text-center text-xs text-atlas-muted space-y-2">
            <GitBranch size={32} className="mx-auto text-atlas-muted/50 mb-2" />
            <p className="font-semibold text-atlas-text text-sm">No Tree or Linked List Detected</p>
            <p>Select a Tree or Linked List algorithm (e.g. BST Insert, Reverse Linked List) to render interactive node diagrams.</p>
          </div>
        )}
      </div>
    </div>
  )
}
