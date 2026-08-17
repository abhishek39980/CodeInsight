import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Compass,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  Info,
  CheckCircle2,
  Trash2,
  Sliders,
  Layers
} from 'lucide-react'
import { cn } from '../../utils/cn'

const GRID_ROWS = 15
const GRID_COLS = 25

export default function PathfindingVisualizer() {
  const [algo, setAlgo] = useState('astar') // 'dijkstra' | 'astar'
  const [heuristic, setHeuristic] = useState('manhattan') // 'manhattan' | 'euclidean'
  
  // Grid state
  const [startNode, setStartNode] = useState({ r: 7, c: 3 })
  const [targetNode, setTargetNode] = useState({ r: 7, c: 21 })
  const [walls, setWalls] = useState(() => {
    const w = new Set()
    // Initial interesting obstacle wall
    for (let r = 3; r <= 11; r++) w.add(`${r},12`)
    return w
  })
  const [weights, setWeights] = useState(() => new Set())

  // Tool mode: 'wall' | 'weight' | 'erase' | 'start' | 'target'
  const [activeTool, setActiveTool] = useState('wall')
  const [isMouseDown, setIsMouseDown] = useState(false)

  // Execution state
  const [visitedNodes, setVisitedNodes] = useState([])
  const [shortestPath, setShortestPath] = useState([])
  const [pqSnapshot, setPqSnapshot] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [speed, setSpeed] = useState(25) // ms per step

  // Heuristic calculation
  const getHeuristic = (r1, c1, r2, c2) => {
    if (algo === 'dijkstra') return 0
    const dr = Math.abs(r1 - r2)
    const dc = Math.abs(c1 - c2)
    if (heuristic === 'euclidean') {
      return Math.sqrt(dr * dr + dc * dc)
    }
    return dr + dc // Manhattan
  }

  // Run pathfinding search (BFS with Min-Heap)
  const runSearch = () => {
    setIsRunning(true)
    setIsFinished(false)
    setVisitedNodes([])
    setShortestPath([])

    // Grid distances
    const distances = {}
    const previous = {}
    const openSet = [] // Priority queue items: { r, c, g, h, f }
    const visitedSet = new Set()

    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        distances[`${r},${c}`] = Infinity
      }
    }

    const startKey = `${startNode.r},${startNode.c}`
    distances[startKey] = 0
    const startH = getHeuristic(startNode.r, startNode.c, targetNode.r, targetNode.c)
    openSet.push({
      r: startNode.r,
      c: startNode.c,
      g: 0,
      h: startH,
      f: startH
    })

    const visitedHistory = []
    const pqSnapshots = []
    let foundTarget = false

    while (openSet.length > 0) {
      // Sort openSet by f cost (Min-Heap behavior)
      openSet.sort((a, b) => a.f - b.f)
      const current = openSet.shift()
      const currKey = `${current.r},${current.c}`

      if (visitedSet.has(currKey)) continue
      visitedSet.add(currKey)
      visitedHistory.push(current)

      // Snapshot top of PQ
      pqSnapshots.push(openSet.slice(0, 6))

      if (current.r === targetNode.r && current.c === targetNode.c) {
        foundTarget = true
        break
      }

      // 4-directional neighbors
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
      for (const [dr, dc] of directions) {
        const nr = current.r + dr
        const nc = current.c + dc
        const neighborKey = `${nr},${nc}`

        if (nr >= 0 && nr < GRID_ROWS && nc >= 0 && nc < GRID_COLS) {
          if (walls.has(neighborKey)) continue

          const edgeCost = weights.has(neighborKey) ? 5 : 1
          const tentativeG = current.g + edgeCost

          if (tentativeG < (distances[neighborKey] ?? Infinity)) {
            distances[neighborKey] = tentativeG
            previous[neighborKey] = current
            const h = getHeuristic(nr, nc, targetNode.r, targetNode.c)
            openSet.push({
              r: nr,
              c: nc,
              g: tentativeG,
              h: Math.round(h * 10) / 10,
              f: Math.round((tentativeG + h) * 10) / 10
            })
          }
        }
      }
    }

    // Reconstruct path
    const path = []
    if (foundTarget) {
      let curr = { r: targetNode.r, c: targetNode.c }
      while (curr && !(curr.r === startNode.r && curr.c === startNode.c)) {
        path.push(curr)
        curr = previous[`${curr.r},${curr.c}`]
      }
      path.push(startNode)
      path.reverse()
    }

    // Animate search
    let step = 0
    const interval = setInterval(() => {
      if (step < visitedHistory.length) {
        setVisitedNodes(visitedHistory.slice(0, step + 1))
        setPqSnapshot(pqSnapshots[step] || [])
        step++
      } else {
        clearInterval(interval)
        setIsRunning(false)
        setIsFinished(true)
        if (foundTarget) {
          setShortestPath(path)
        }
      }
    }, speed)
  }

  // Handle cell click / drag
  const handleCellInteract = (r, c) => {
    if (isRunning) return
    const key = `${r},${c}`

    if (activeTool === 'start') {
      if (!walls.has(key) && (r !== targetNode.r || c !== targetNode.c)) {
        setStartNode({ r, c })
      }
    } else if (activeTool === 'target') {
      if (!walls.has(key) && (r !== startNode.r || c !== startNode.c)) {
        setTargetNode({ r, c })
      }
    } else if (activeTool === 'wall') {
      if ((r !== startNode.r || c !== startNode.c) && (r !== targetNode.r || c !== targetNode.c)) {
        setWalls(prev => {
          const next = new Set(prev)
          next.add(key)
          return next
        })
        setWeights(prev => {
          const next = new Set(prev)
          next.delete(key)
          return next
        })
      }
    } else if (activeTool === 'weight') {
      if ((r !== startNode.r || c !== startNode.c) && (r !== targetNode.r || c !== targetNode.c)) {
        setWeights(prev => {
          const next = new Set(prev)
          next.add(key)
          return next
        })
        setWalls(prev => {
          const next = new Set(prev)
          next.delete(key)
          return next
        })
      }
    } else if (activeTool === 'erase') {
      setWalls(prev => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
      setWeights(prev => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
    }
  }

  const handleClearWalls = () => {
    setWalls(new Set())
    setWeights(new Set())
    setVisitedNodes([])
    setShortestPath([])
    setIsFinished(false)
  }

  const handleRandomMaze = () => {
    const w = new Set()
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if ((r === startNode.r && c === startNode.c) || (r === targetNode.r && c === targetNode.c)) continue
        if (Math.random() < 0.28) {
          w.add(`${r},${c}`)
        }
      }
    }
    setWalls(w)
    setVisitedNodes([])
    setShortestPath([])
    setIsFinished(false)
  }

  const visitedSet = new Set(visitedNodes.map(n => `${n.r},${n.c}`))
  const pathSet = new Set(shortestPath.map(n => `${n.r},${n.c}`))

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-atlas-brand/30 bg-gradient-to-br from-atlas-surface via-atlas-elev to-atlas-surface p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-atlas-brand">
            <Compass size={18} className="text-atlas-brand" />
            <span>Graph Traversal & Heuristic Pathfinding</span>
          </div>
          <h3 className="mt-1 text-xl font-bold text-atlas-text">Dijkstra & A* Shortest Pathfinding Lab</h3>
          <p className="text-xs text-atlas-muted mt-0.5 max-w-2xl">
            Interactive 2D obstacle canvas with real-time <strong>Min-Heap Priority Queue ($f = g + h$)</strong> telemetry and neighbor relaxation.
          </p>
        </div>

        {/* Algorithm Switcher */}
        <div className="flex items-center gap-2 bg-atlas-bg0/60 p-1.5 rounded-xl border border-atlas-muted/20">
          <button
            onClick={() => setAlgo('astar')}
            className={cn(
              'px-3 py-1.5 text-xs font-semibold rounded-lg transition',
              algo === 'astar'
                ? 'bg-atlas-brand text-white shadow'
                : 'text-atlas-muted hover:text-atlas-text'
            )}
          >
            A* Search (Informed)
          </button>
          <button
            onClick={() => setAlgo('dijkstra')}
            className={cn(
              'px-3 py-1.5 text-xs font-semibold rounded-lg transition',
              algo === 'dijkstra'
                ? 'bg-atlas-brand text-white shadow'
                : 'text-atlas-muted hover:text-atlas-text'
            )}
          >
            Dijkstra's (Uninformed)
          </button>
        </div>
      </div>

      {/* Control Strip */}
      <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-surface/80 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Drawing Tools */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-atlas-muted font-medium mr-1">Drawing Tool:</span>
            {[
              { id: 'wall', label: 'Draw Wall', color: 'bg-slate-700 text-white' },
              { id: 'weight', label: 'Weighted Swamp (Cost 5)', color: 'bg-amber-900/60 text-amber-200' },
              { id: 'erase', label: 'Eraser', color: 'bg-atlas-elev text-atlas-text' },
              { id: 'start', label: 'Move Start (S)', color: 'bg-emerald-600 text-white' },
              { id: 'target', label: 'Move Target (T)', color: 'bg-rose-600 text-white' }
            ].map(tool => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={cn(
                  'rounded-lg px-2.5 py-1 text-xs font-medium transition border',
                  activeTool === tool.id
                    ? 'border-atlas-brand ring-2 ring-atlas-brand/50 text-white bg-atlas-brand'
                    : 'border-atlas-muted/20 bg-atlas-elev text-atlas-muted hover:text-atlas-text'
                )}
              >
                {tool.label}
              </button>
            ))}
          </div>

          {/* Action Triggers */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={runSearch}
              disabled={isRunning}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white px-3.5 py-1.5 text-xs font-bold transition shadow disabled:opacity-50"
            >
              <Play size={13} /> {isRunning ? 'Searching...' : 'Visualize Search'}
            </button>
            <button
              onClick={handleRandomMaze}
              disabled={isRunning}
              className="flex items-center gap-1 rounded-lg bg-atlas-elev hover:bg-atlas-brand hover:text-white border border-atlas-muted/20 px-3 py-1.5 text-xs font-medium text-atlas-text transition disabled:opacity-40"
            >
              <Sparkles size={13} /> Random Maze
            </button>
            <button
              onClick={handleClearWalls}
              disabled={isRunning}
              className="flex items-center gap-1 rounded-lg bg-atlas-elev hover:bg-rose-500/20 text-atlas-muted hover:text-rose-300 border border-atlas-muted/20 px-3 py-1.5 text-xs font-medium transition disabled:opacity-40"
            >
              <Trash2 size={13} /> Clear Board
            </button>
          </div>
        </div>

        {/* Legend strip */}
        <div className="flex items-center gap-4 text-[11px] font-mono text-atlas-muted flex-wrap pt-1 border-t border-atlas-muted/10">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-emerald-500" /> Start Node (S)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-rose-500" /> Target Node (T)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-slate-700 border border-slate-600" /> Wall Obstacle
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-amber-900/80 border border-amber-600/40" /> Weighted Mud (Cost 5)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-cyan-500/40" /> Visited Node
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-amber-400" /> Shortest Path
          </span>
        </div>
      </div>

      {/* Grid Canvas + Min-Heap Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 2D Grid Board */}
        <div className="lg:col-span-8 space-y-4">
          <div
            className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-4 select-none overflow-x-auto flex justify-center"
            onMouseDown={() => setIsMouseDown(true)}
            onMouseUp={() => setIsMouseDown(false)}
            onMouseLeave={() => setIsMouseDown(false)}
          >
            <div
              className="grid gap-[2px] bg-atlas-bg0 p-2 rounded-xl border border-atlas-muted/20"
              style={{
                gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`
              }}
            >
              {Array.from({ length: GRID_ROWS }).map((_, r) => (
                Array.from({ length: GRID_COLS }).map((_, c) => {
                  const key = `${r},${c}`
                  const isStart = r === startNode.r && c === startNode.c
                  const isTarget = r === targetNode.r && c === targetNode.c
                  const isWall = walls.has(key)
                  const isWeight = weights.has(key)
                  const isVisited = visitedSet.has(key)
                  const isPath = pathSet.has(key)

                  return (
                    <div
                      key={key}
                      onMouseDown={() => handleCellInteract(r, c)}
                      onMouseEnter={() => { if (isMouseDown) handleCellInteract(r, c) }}
                      className={cn(
                        'h-6 w-6 sm:h-7 sm:w-7 rounded-sm flex items-center justify-center font-mono text-[10px] font-bold cursor-pointer transition-all duration-150',
                        isStart
                          ? 'bg-emerald-500 text-white ring-2 ring-emerald-300 shadow-md scale-105 z-10'
                          : isTarget
                          ? 'bg-rose-500 text-white ring-2 ring-rose-300 shadow-md scale-105 z-10'
                          : isPath
                          ? 'bg-amber-400 text-amber-950 ring-1 ring-amber-200 shadow-sm scale-95'
                          : isWall
                          ? 'bg-slate-700 border border-slate-600'
                          : isWeight
                          ? 'bg-amber-900/60 text-amber-300 border border-amber-600/30'
                          : isVisited
                          ? 'bg-cyan-500/30 border border-cyan-500/20'
                          : 'bg-atlas-elev/60 hover:bg-atlas-brand/20 border border-atlas-muted/10'
                      )}
                    >
                      {isStart ? 'S' : isTarget ? 'T' : isWeight ? '5' : ''}
                    </div>
                  )
                })
              ))}
            </div>
          </div>
        </div>

        {/* Right: Min-Heap Priority Queue Telemetry */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-atlas-text">Min-Heap Priority Queue</h4>
              <span className="text-xs font-mono text-cyan-300 font-bold">
                {algo === 'astar' ? 'f = g + h' : 'f = g'}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
              <div className="rounded-xl bg-atlas-elev/80 p-2.5 border border-atlas-muted/15">
                <span className="text-[10px] text-atlas-muted uppercase block">Visited Nodes</span>
                <span className="text-base font-bold text-cyan-300">{visitedNodes.length}</span>
              </div>
              <div className="rounded-xl bg-atlas-elev/80 p-2.5 border border-atlas-muted/15">
                <span className="text-[10px] text-atlas-muted uppercase block">Path Length</span>
                <span className="text-base font-bold text-amber-400">{shortestPath.length}</span>
              </div>
            </div>

            {/* Min Heap Top Elements */}
            <div className="space-y-2 pt-2 border-t border-atlas-muted/15">
              <span className="text-xs font-bold text-atlas-text block">Top Nodes in Priority Queue</span>
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto font-mono text-[11px] pr-1">
                {pqSnapshot.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-atlas-elev/80 border border-atlas-muted/20 flex items-center justify-between"
                  >
                    <span className="font-bold text-atlas-text">({item.r}, {item.c})</span>
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="text-emerald-400">g:{item.g}</span>
                      <span className="text-cyan-400">h:{item.h}</span>
                      <span className="font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded">
                        f:{item.f}
                      </span>
                    </div>
                  </div>
                ))}
                {pqSnapshot.length === 0 && (
                  <div className="text-xs text-atlas-muted py-6 text-center font-sans">
                    Queue idle. Click "Visualize Search" to trace priority queue extractions.
                  </div>
                )}
              </div>
            </div>

            {/* Explainer */}
            <div className="rounded-xl bg-atlas-bg0/60 p-3 text-xs text-atlas-muted space-y-1 border border-atlas-muted/10">
              <div className="font-semibold text-atlas-text flex items-center gap-1.5">
                <Info size={13} className="text-atlas-brand" />
                <span>Heuristic Search Advantage:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                <strong>A* Search</strong> uses $h(n)$ (estimated Manhattan/Euclidean distance to target) to prioritize frontier nodes pointing towards the goal, visiting far fewer nodes than Dijkstra's radial expansion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
