import { motion, AnimatePresence } from 'framer-motion'
import Panel from './Panel'

const createLayout = (nodes = []) => {
  const levels = new Map()

  nodes.forEach((node) => {
    if (!levels.has(node.depth)) {
      levels.set(node.depth, [])
    }
    levels.get(node.depth).push(node)
  })

  const positioned = new Map()
  const verticalGap = 80
  const width = 800

  Array.from(levels.entries())
    .sort((a, b) => a[0] - b[0])
    .forEach(([depth, levelNodes]) => {
      const gap = width / (levelNodes.length + 1)
      levelNodes.forEach((node, index) => {
        positioned.set(node.id, {
          ...node,
          x: gap * (index + 1),
          y: 40 + depth * verticalGap,
        })
      })
    })

  return positioned
}

const depthColors = [
  { fill: 'rgba(59,130,246,0.15)', stroke: 'rgba(59,130,246,0.5)', text: 'rgb(147,197,253)', glow: 'rgba(59,130,246,0.3)' }, // blue
  { fill: 'rgba(168,85,247,0.15)', stroke: 'rgba(168,85,247,0.5)', text: 'rgb(216,180,254)', glow: 'rgba(168,85,247,0.3)' }, // purple
  { fill: 'rgba(236,72,153,0.15)', stroke: 'rgba(236,72,153,0.5)', text: 'rgb(249,168,212)', glow: 'rgba(236,72,153,0.3)' }, // pink
  { fill: 'rgba(245,158,11,0.15)', stroke: 'rgba(245,158,11,0.5)', text: 'rgb(253,230,138)', glow: 'rgba(245,158,11,0.3)' }, // amber
  { fill: 'rgba(6,182,212,0.15)',  stroke: 'rgba(6,182,212,0.5)',  text: 'rgb(103,232,249)', glow: 'rgba(6,182,212,0.3)' }, // cyan
]

const getColors = (depth, status) => {
  if (status === 'returned') {
    return { fill: 'rgba(16,185,129,0.15)', stroke: 'rgba(16,185,129,0.5)', text: 'rgb(110,231,183)', glow: 'rgba(16,185,129,0.2)' } // emerald
  }
  return depthColors[depth % depthColors.length]
}

const RecursionTree = ({ tree }) => {
  const nodes = tree?.nodes || []
  const edges = tree?.edges || []
  const layout = createLayout(nodes)

  return (
    <Panel title="Recursion Tree" subtitle="Depth-colored call expansion" className="h-full" accent>
      {nodes.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 px-3 py-6 text-center text-sm text-zinc-500">
          Recursion graph appears when recursive calls are executed.
        </p>
      ) : (
        <div className="h-[280px] overflow-auto rounded-2xl border border-white/5 bg-[#0a0d13]/60 shadow-inner backdrop-blur-md">
          <svg viewBox="0 0 860 320" className="h-full w-full">
            {/* Draw Edges */}
            <AnimatePresence>
              {edges.map((edge) => {
                const from = layout.get(edge.from)
                const to = layout.get(edge.to)
                if (!from || !to) return null
                
                const midY = (from.y + to.y) / 2
                const d = `M ${from.x} ${from.y + 18} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y - 18}`
                
                return (
                  <motion.path
                    key={`edge-${edge.from}-${edge.to}`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    d={d}
                    stroke="rgba(255, 255, 255, 0.15)"
                    fill="none"
                    strokeWidth="2"
                  />
                )
              })}
            </AnimatePresence>

            {/* Draw Nodes */}
            <AnimatePresence>
              {nodes.map((node) => {
                const point = layout.get(node.id)
                if (!point) return null
                
                const colors = getColors(node.depth, node.status)
                
                return (
                  <motion.g
                    key={`node-${node.id}`}
                    initial={{ opacity: 0, scale: 0.4, x: point.x, y: point.y - 20 }}
                    animate={{ opacity: 1, scale: 1, x: point.x, y: point.y }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    {/* Glow effect */}
                    {node.status !== 'returned' && (
                      <motion.rect
                        x={-74} y={-20} width={148} height={40} rx={12}
                        fill="none"
                        stroke={colors.glow}
                        strokeWidth="8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        style={{ filter: "blur(4px)" }}
                      />
                    )}

                    <rect
                      x={-74}
                      y={-20}
                      width={148}
                      height={40}
                      rx={12}
                      fill={colors.fill}
                      stroke={colors.stroke}
                      strokeWidth="1.5"
                      style={{ backdropFilter: "blur(4px)" }}
                    />
                    <text
                      x="0"
                      y="-2"
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="600"
                      fill={colors.text}
                      style={{ letterSpacing: '0.04em' }}
                    >
                      {node.label}
                    </text>
                    <text 
                      x="0" 
                      y="12" 
                      textAnchor="middle" 
                      fontSize="9" 
                      fill="rgba(255,255,255,0.6)"
                      className="font-mono"
                    >
                      {node.returnValue ? `return ${node.returnValue}` : 'pending'}
                    </text>
                  </motion.g>
                )
              })}
            </AnimatePresence>
          </svg>
        </div>
      )}
    </Panel>
  )
}

export default RecursionTree

