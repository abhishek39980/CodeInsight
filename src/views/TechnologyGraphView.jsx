import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Share2,
  Compass,
  ArrowRight,
  Sparkles,
  Info,
  Layers,
  FlaskConical
} from 'lucide-react'
import { cn } from '../utils/cn'

const GRAPH_NODES = [
  { id: 'cs', label: 'Computer Science', domain: 'Algorithms & Data Structures', x: 400, y: 50, color: '#818CF8', labId: 'dynamic-programming' },
  { id: 'os', label: 'Operating Systems', domain: 'Kernel & Memory', x: 200, y: 160, color: '#34D399', labId: 'memory-profiler' },
  { id: 'net', label: 'Networking', domain: 'TCP/IP & Web Protocols', x: 600, y: 160, color: '#38BDF8', labId: 'tcp-handshake' },
  { id: 'db', label: 'Databases', domain: 'Storage & B-Tree Indexing', x: 120, y: 300, color: '#FBBF24', labId: 'btree-index' },
  { id: 'dist', label: 'Distributed Systems', domain: 'Consensus & Caching', x: 400, y: 280, color: '#38BDF8', labId: 'consistent-hashing' },
  { id: 'sec', label: 'Cybersecurity', domain: 'Cryptography & TLS', x: 680, y: 300, color: '#FB7185', labId: 'rsa-encryption' },
  { id: 'ai', label: 'Artificial Intelligence', domain: 'Deep Learning & LLMs', x: 400, y: 410, color: '#C084FC', labId: 'neural-net' }
]

const GRAPH_EDGES = [
  { from: 'cs', to: 'os', label: 'Memory & Stacks' },
  { from: 'cs', to: 'net', label: 'Packet Graph Routing' },
  { from: 'os', to: 'db', label: 'Disk Page Blocks & Buffer Pool' },
  { from: 'os', to: 'dist', label: 'Concurrency & Sockets' },
  { from: 'net', to: 'dist', label: 'RPC & Replication' },
  { from: 'net', to: 'sec', label: 'TLS Cryptography' },
  { from: 'dist', to: 'db', label: 'Sharding & Raft Leader' },
  { from: 'dist', to: 'ai', label: 'GPU Clusters & Inference Serving' },
  { from: 'cs', to: 'ai', label: 'Tensor Matrix Math' }
]

export default function TechnologyGraphView() {
  const [selectedNode, setSelectedNode] = useState(GRAPH_NODES[0])

  return (
    <div className="mx-auto max-w-[1580px] px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-atlas-brand">
          <Share2 size={16} />
          <span>Relational Knowledge Map</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-atlas-text">
          Interactive Technology Relationship Graph
        </h1>
        <p className="text-sm text-atlas-muted leading-relaxed">
          Explore how computing concepts interconnect. Click any node on the graph to inspect its architectural dependencies and jump directly into the corresponding interactive laboratory.
        </p>
      </div>

      {/* Graph Stage & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 cols: Interactive SVG Node Graph */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-3xl border border-atlas-muted/25 bg-atlas-surface/90 p-6 min-h-[500px] relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-atlas-text">Computer Science Relationship Topology</h3>
              <span className="text-xs font-mono text-atlas-muted">Click node to inspect</span>
            </div>

            {/* SVG Relational Graph */}
            <div className="relative flex items-center justify-center py-4">
              <svg width="780" height="460" viewBox="0 0 800 480" className="overflow-visible max-w-full">
                {/* Edges */}
                {GRAPH_EDGES.map((edge, idx) => {
                  const src = GRAPH_NODES.find(n => n.id === edge.from)
                  const dst = GRAPH_NODES.find(n => n.id === edge.to)
                  if (!src || !dst) return null
                  const isHighlighted = selectedNode.id === src.id || selectedNode.id === dst.id

                  return (
                    <g key={idx}>
                      <line
                        x1={src.x}
                        y1={src.y}
                        x2={dst.x}
                        y2={dst.y}
                        stroke={isHighlighted ? '#4C7DFF' : '#232C38'}
                        strokeWidth={isHighlighted ? 2.5 : 1.5}
                        strokeDasharray={isHighlighted ? 'none' : '4 4'}
                        className="transition-all duration-300"
                      />
                    </g>
                  )
                })}

                {/* Nodes */}
                {GRAPH_NODES.map(node => {
                  const isSelected = selectedNode.id === node.id
                  return (
                    <g
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className="cursor-pointer group"
                    >
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isSelected ? 26 : 20}
                        fill={node.color}
                        fillOpacity={isSelected ? 0.9 : 0.25}
                        stroke={node.color}
                        strokeWidth={isSelected ? 3 : 1.5}
                        className="transition-all duration-200"
                      />
                      <text
                        x={node.x}
                        y={node.y + 36}
                        textAnchor="middle"
                        fill="#EAF0F8"
                        fontSize="11"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        fontFamily="monospace"
                      >
                        {node.label}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Right 4 cols: Node Inspector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl border border-atlas-muted/25 bg-atlas-surface/90 p-6 space-y-5">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-atlas-brand bg-atlas-brand/10 border border-atlas-brand/20 px-2 py-0.5 rounded-md">
                Selected Domain
              </span>
              <h2 className="text-xl font-bold text-atlas-text mt-2" style={{ color: selectedNode.color }}>
                {selectedNode.label}
              </h2>
              <p className="text-xs text-atlas-muted mt-1 font-mono">
                {selectedNode.domain}
              </p>
            </div>

            {/* Connected Dependencies */}
            <div className="space-y-2 pt-3 border-t border-atlas-muted/15">
              <span className="text-xs font-bold text-atlas-text font-mono block">
                Connected Systems & Interfaces:
              </span>
              <div className="space-y-1.5">
                {GRAPH_EDGES.filter(e => e.from === selectedNode.id || e.to === selectedNode.id).map((e, idx) => {
                  const peerId = e.from === selectedNode.id ? e.to : e.from
                  const peer = GRAPH_NODES.find(n => n.id === peerId)
                  return (
                    <div
                      key={idx}
                      onClick={() => peer && setSelectedNode(peer)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-atlas-elev/70 hover:bg-atlas-elev border border-atlas-muted/15 text-xs font-mono cursor-pointer transition"
                    >
                      <span className="font-bold text-atlas-text">{peer?.label}</span>
                      <span className="text-[10px] text-atlas-muted">{e.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Launch Lab CTA */}
            {selectedNode.labId && (
              <div className="pt-3 border-t border-atlas-muted/15">
                <Link
                  to={`/labs/${selectedNode.labId}`}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-atlas-brand hover:bg-atlas-brand/90 text-white p-3 text-xs font-bold transition shadow"
                >
                  <FlaskConical size={14} />
                  <span>Launch {selectedNode.label} Lab</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
