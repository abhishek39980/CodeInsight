import { motion } from "framer-motion";
import { GitBranch } from "lucide-react";

// Graph Configuration
// 8 nodes arranged in a circle layout within the SVG canvas
const SVG_W = 500;
const SVG_H = 340;
const CENTER_X = SVG_W / 2;
const CENTER_Y = SVG_H / 2 - 10;
const RADIUS = 120;
const NODE_R = 22;

// Compute node positions evenly around a circle
const NODES = Array.from({ length: 8 }, (_, i) => {
  const angle = (2 * Math.PI * i) / 8 - Math.PI / 2;
  return {
    id: i,
    x: CENTER_X + RADIUS * Math.cos(angle),
    y: CENTER_Y + RADIUS * Math.sin(angle),
    label: String(i),
  };
});

// Undirected edges between node pairs
const EDGES = [
  [0, 1], [0, 2],
  [1, 3], [1, 4],
  [2, 5],
  [3, 6],
  [4, 7],
  [5, 6],
];

// BFS visit order: node indices visited at each step
const BFS_ORDER = [0, 1, 2, 3, 4, 5, 6, 7];

// Color helpers (hex values for SVG fills following atlas theme)
const COLOR = {
  unvisited: { fill: "#1B222C", stroke: "#9AA7B7", text: "#9AA7B7" },
  visiting:  { fill: "#D97706", stroke: "#F59E0B", text: "#1B222C" },
  visited:   { fill: "#2FBF8F", stroke: "#2FBF8F", text: "#0F1217" },
};

function getNodeState(nodeId, stepIndex) {
  const visitedCount = Math.min(stepIndex, BFS_ORDER.length);
  const visitedNodes = BFS_ORDER.slice(0, visitedCount);
  const currentNode  = BFS_ORDER[visitedCount] ?? null;

  if (visitedNodes.includes(nodeId)) return "visited";
  if (nodeId === currentNode)        return "visiting";
  return "unvisited";
}

export default function GraphVisualizer({ stepIndex = 0, steps = [], problem }) {
  const safeStep   = Math.max(0, stepIndex);
  const totalNodes = BFS_ORDER.length;

  const visitedSet = new Set(BFS_ORDER.slice(0, Math.min(safeStep, totalNodes)));

  return (
    <div className="flex flex-col items-center gap-4 p-4 rounded-xl bg-[#0F1217] border border-[#232C38] w-full">

      {/* Header */}
      <div className="flex items-center gap-2 self-start">
        <GitBranch className="text-[#4C7DFF] w-4 h-4" />
        <span className="text-[#EAF0F8] text-sm font-semibold tracking-wide">Graph Traversal — BFS</span>
      </div>

      {/* SVG Canvas */}
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full max-w-lg"
        style={{ height: SVG_H }}
      >
        {/* Edges */}
        {EDGES.map(([a, b]) => {
          const na = NODES[a];
          const nb = NODES[b];
          const bothVisited = visitedSet.has(a) && visitedSet.has(b);
          return (
            <line
              key={`${a}-${b}`}
              x1={na.x} y1={na.y}
              x2={nb.x} y2={nb.y}
              stroke={bothVisited ? "#2FBF8F" : "#232C38"}
              strokeWidth={bothVisited ? 2.5 : 2}
              strokeLinecap="round"
              style={{ transition: "stroke 0.4s ease" }}
            />
          );
        })}

        {/* Nodes */}
        {NODES.map((node) => {
          const state     = getNodeState(node.id, safeStep);
          const colors    = COLOR[state];
          const isVisiting = state === "visiting";

          return (
            <motion.g
              key={node.id}
              initial={false}
              animate={{ scale: isVisiting ? 1.25 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              style={{ originX: node.x, originY: node.y }}
            >
              {/* Glow ring for visiting node */}
              {isVisiting && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={NODE_R + 7}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  opacity={0.45}
                />
              )}

              {/* Main circle */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={NODE_R}
                fill={colors.fill}
                stroke={colors.stroke}
                strokeWidth={2.5}
                animate={{ fill: colors.fill, stroke: colors.stroke }}
                transition={{ duration: 0.35 }}
              />

              {/* Node label */}
              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                fontSize={14}
                fontWeight="700"
                fill={colors.text}
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {node.label}
              </text>
            </motion.g>
          );
        })}

        {/* Visited array label */}
        <text x={10} y={SVG_H - 10} fontSize={11} fill="#9AA7B7">
          {`Visited: [${BFS_ORDER.slice(0, Math.min(safeStep, totalNodes)).join(", ")}]`}
        </text>
      </svg>

      {/* Step indicator */}
      <div className="text-[#9AA7B7] text-xs font-mono">
        Step {Math.min(safeStep, totalNodes)} / {totalNodes} —
        {safeStep < totalNodes
          ? ` Visiting node ${BFS_ORDER[safeStep] ?? "—"}`
          : " Traversal complete"}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-1">
        {[
          { color: "#9AA7B7", fill: "#1B222C", label: "Unvisited" },
          { color: "#F59E0B", fill: "#D97706", label: "Visiting"  },
          { color: "#2FBF8F", fill: "#2FBF8F", label: "Visited"   },
        ].map(({ color, fill, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <svg width={14} height={14}>
              <circle cx={7} cy={7} r={6} fill={fill} stroke={color} strokeWidth={1.5} />
            </svg>
            <span className="text-[#9AA7B7] text-xs">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
