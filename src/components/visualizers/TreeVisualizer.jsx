import { motion } from "framer-motion";
import { GitMerge } from "lucide-react";

// Tree node structure for a 15-node BST (4 levels)
// Each node has: id, value, x, y (SVG coordinates), left/right child ids
//
// Tree layout:
//               10 (root)
//          5          15
//        2   8      12   20
//       1 3 7 9   11 14 18 22
//
const SVG_W = 560;
const SVG_H = 310;
const LEVEL_H = 68;
const START_Y = 36;

const TREE_NODES = [
  // Level 0 — root
  { id: 0,  val: 10, x: 280, y: START_Y,              left: 1,  right: 2  },
  // Level 1
  { id: 1,  val: 5,  x: 150, y: START_Y + LEVEL_H,    left: 3,  right: 4  },
  { id: 2,  val: 15, x: 410, y: START_Y + LEVEL_H,    left: 5,  right: 6  },
  // Level 2
  { id: 3,  val: 2,  x: 82,  y: START_Y + LEVEL_H * 2, left: 7, right: 8  },
  { id: 4,  val: 8,  x: 218, y: START_Y + LEVEL_H * 2, left: 9, right: 10 },
  { id: 5,  val: 12, x: 344, y: START_Y + LEVEL_H * 2, left: 11,right: 12 },
  { id: 6,  val: 20, x: 478, y: START_Y + LEVEL_H * 2, left: 13,right: 14 },
  // Level 3 — leaves
  { id: 7,  val: 1,  x: 44,  y: START_Y + LEVEL_H * 3, left: null, right: null },
  { id: 8,  val: 3,  x: 114, y: START_Y + LEVEL_H * 3, left: null, right: null },
  { id: 9,  val: 7,  x: 184, y: START_Y + LEVEL_H * 3, left: null, right: null },
  { id: 10, val: 9,  x: 252, y: START_Y + LEVEL_H * 3, left: null, right: null },
  { id: 11, val: 11, x: 314, y: START_Y + LEVEL_H * 3, left: null, right: null },
  { id: 12, val: 14, x: 374, y: START_Y + LEVEL_H * 3, left: null, right: null },
  { id: 13, val: 18, x: 444, y: START_Y + LEVEL_H * 3, left: null, right: null },
  { id: 14, val: 22, x: 512, y: START_Y + LEVEL_H * 3, left: null, right: null },
];

// Inorder traversal order (left -> root -> right): 1,2,3,5,7,8,9,10,11,12,14,15,18,20,22
// Expressed as TREE_NODES ids in inorder sequence
const INORDER = [7, 3, 8, 1, 9, 4, 10, 0, 11, 5, 12, 2, 13, 6, 14];

const NODE_R = 20;

export default function TreeVisualizer({ stepIndex = 0, steps = [], problem }) {
  const safeStep = Math.max(0, stepIndex);
  const total    = INORDER.length;

  // Nodes visited so far (fully traversed)
  const visitedIds  = new Set(INORDER.slice(0, safeStep));
  // Current node being highlighted
  const currentId   = INORDER[safeStep] ?? null;

  // Build edge list from parent -> child
  const edges = [];
  TREE_NODES.forEach((n) => {
    if (n.left  !== null) edges.push([n.id, n.left]);
    if (n.right !== null) edges.push([n.id, n.right]);
  });

  function nodeColor(id) {
    if (id === currentId)     return "#4C7DFF"; // atlas-brand (active)
    if (visitedIds.has(id))   return "#2FBF8F"; // atlas-loop  (visited)
    return "#1B222C";                           // atlas-surface (unvisited)
  }

  function nodeStroke(id) {
    if (id === currentId)     return "#4C7DFF";
    if (visitedIds.has(id))   return "#2FBF8F";
    return "#9AA7B7";
  }

  function textColor(id) {
    if (id === currentId)     return "#EAF0F8";
    if (visitedIds.has(id))   return "#0F1217";
    return "#9AA7B7";
  }

  const currentNode = TREE_NODES.find((n) => n.id === currentId);

  return (
    <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-[#0F1217] border border-[#232C38] w-full">

      {/* Header */}
      <div className="flex items-center gap-2 self-start">
        <GitMerge className="text-[#4C7DFF] w-4 h-4" />
        <span className="text-[#EAF0F8] text-sm font-semibold tracking-wide">Inorder Traversal</span>
      </div>

      {/* SVG Tree */}
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full max-w-xl" style={{ height: SVG_H }}>

        {/* Edges (lines between parent and child) */}
        {edges.map(([parentId, childId]) => {
          const p = TREE_NODES[parentId];
          const c = TREE_NODES[childId];
          const isVisited = visitedIds.has(childId) && visitedIds.has(parentId);
          return (
            <line
              key={`${parentId}-${childId}`}
              x1={p.x} y1={p.y + NODE_R}
              x2={c.x} y2={c.y - NODE_R}
              stroke={isVisited ? "#2FBF8F" : "#232C38"}
              strokeWidth={isVisited ? 2 : 1.5}
              style={{ transition: "stroke 0.3s ease" }}
            />
          );
        })}

        {/* Nodes */}
        {TREE_NODES.map((node) => {
          const isCurrent = node.id === currentId;
          return (
            <motion.g
              key={node.id}
              animate={{ scale: isCurrent ? 1.2 : 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
              style={{ originX: node.x, originY: node.y }}
            >
              {/* Blue glow for current node */}
              {isCurrent && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={NODE_R + 8}
                  fill="none"
                  stroke="#4C7DFF"
                  strokeWidth={2}
                  opacity={0.35}
                />
              )}

              <motion.circle
                cx={node.x}
                cy={node.y}
                r={NODE_R}
                fill={nodeColor(node.id)}
                stroke={nodeStroke(node.id)}
                strokeWidth={2}
                animate={{ fill: nodeColor(node.id), stroke: nodeStroke(node.id) }}
                transition={{ duration: 0.3 }}
              />

              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                fontSize={11}
                fontWeight="700"
                fill={textColor(node.id)}
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {node.val}
              </text>
            </motion.g>
          );
        })}
      </svg>

      {/* Inorder sequence display */}
      <div className="flex flex-wrap gap-1 justify-center max-w-xl">
        {INORDER.map((id, idx) => {
          const node = TREE_NODES[id];
          const done = idx < safeStep;
          const active = idx === safeStep;
          return (
            <motion.span
              key={id}
              animate={{
                backgroundColor: active ? "#4C7DFF" : done ? "#2FBF8F" : "#232C38",
                color: active || done ? "#0F1217" : "#9AA7B7",
              }}
              transition={{ duration: 0.3 }}
              className="text-xs font-mono px-2 py-0.5 rounded"
            >
              {node.val}
            </motion.span>
          );
        })}
      </div>

      {/* Step info */}
      <div className="text-[#9AA7B7] text-xs font-mono">
        Step {Math.min(safeStep + 1, total)} / {total}
        {currentNode ? ` — Visiting node ${currentNode.val}` : " — Traversal complete"}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5">
        {[
          { fill: "#1B222C", stroke: "#9AA7B7", label: "Unvisited" },
          { fill: "#4C7DFF", stroke: "#4C7DFF", label: "Current"   },
          { fill: "#2FBF8F", stroke: "#2FBF8F", label: "Visited"   },
        ].map(({ fill, stroke, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <svg width={14} height={14}>
              <circle cx={7} cy={7} r={6} fill={fill} stroke={stroke} strokeWidth={1.5} />
            </svg>
            <span className="text-[#9AA7B7] text-xs">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
