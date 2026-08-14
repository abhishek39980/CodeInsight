import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Link2 } from "lucide-react";

// Linked list node values: [1, 2, 3, 4, 5, null]
const LIST_VALUES = [1, 2, 3, 4, 5];

// For "Reverse Linked List" pattern:
// At step i, prev points to node (i-1), curr points to node i
// Nodes [0..i-1] are reversed (shown in atlas-loop green)
// Step 0: prev=null, curr=0     => nothing reversed yet
// Step 1: prev=0,   curr=1      => node 0 reversed
// Step 2: prev=1,   curr=2      => nodes 0,1 reversed
// ...
// Step 5: prev=4,   curr=null   => all reversed, done

const TOTAL_STEPS = 6; // 0..5

function getStepDescription(step) {
  if (step === 0) return "Initialize: prev = null, curr = head (1)";
  if (step >= TOTAL_STEPS) return "Done! List fully reversed: [5 → 4 → 3 → 2 → 1]";
  const curr = LIST_VALUES[step] ?? "null";
  const prev = LIST_VALUES[step - 1] ?? "null";
  return `Step ${step}: curr.next = prev (${prev}), advance pointers`;
}

export default function LinkedListVisualizer({ stepIndex = 0, steps = [], problem }) {
  const safeStep = Math.max(0, Math.min(stepIndex, TOTAL_STEPS));

  // prev pointer index (node index, or -1 = null)
  const prevIdx = safeStep - 1;  // -1 means null
  // curr pointer index (node index, or 5 = null/done)
  const currIdx = safeStep;       // 5 means null

  const isDone  = safeStep >= TOTAL_STEPS;

  // Node styling
  function nodeStyle(i) {
    if (i < safeStep)  return { fill: "#2FBF8F", stroke: "#2FBF8F", text: "#0F1217" }; // reversed
    if (i === currIdx) return { fill: "#4C7DFF", stroke: "#4C7DFF", text: "#EAF0F8" }; // current
    return { fill: "#1B222C", stroke: "#9AA7B7", text: "#9AA7B7" };                    // unvisited
  }

  const BOX_W   = 60;
  const BOX_H   = 44;
  const ARROW_W = 28;
  const GAP      = BOX_W + ARROW_W;
  const TOTAL_W  = LIST_VALUES.length * GAP + ARROW_W + 40; // extra for "null"
  const BOX_Y    = 70;  // y for the node boxes
  const PTR_Y    = 22;  // y for pointer labels

  return (
    <div className="flex flex-col items-center gap-4 p-4 rounded-xl bg-[#0F1217] border border-[#232C38] w-full">

      {/* Header */}
      <div className="flex items-center gap-2 self-start">
        <Link2 className="text-[#4C7DFF] w-4 h-4" />
        <span className="text-[#EAF0F8] text-sm font-semibold tracking-wide">Linked List — Reverse Pattern</span>
      </div>

      {/* SVG canvas */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${TOTAL_W} 160`}
          className="w-full"
          style={{ minWidth: TOTAL_W, height: 160 }}
        >
          {/* ── Pointer labels: prev and curr ── */}

          {/* prev pointer */}
          <AnimatePresence>
            {prevIdx >= 0 && !isDone && (
              <motion.g
                key={`prev-${prevIdx}`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                {/* Label */}
                <text
                  x={22 + prevIdx * GAP + BOX_W / 2}
                  y={PTR_Y}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight="700"
                  fill="#2FBF8F"
                >
                  prev
                </text>
                {/* Arrow down */}
                <line
                  x1={22 + prevIdx * GAP + BOX_W / 2}
                  y1={PTR_Y + 4}
                  x2={22 + prevIdx * GAP + BOX_W / 2}
                  y2={BOX_Y - 2}
                  stroke="#2FBF8F"
                  strokeWidth={1.5}
                  markerEnd="url(#arrowGreen)"
                />
              </motion.g>
            )}
          </AnimatePresence>

          {/* curr pointer */}
          <AnimatePresence>
            {!isDone && (
              <motion.g
                key={`curr-${currIdx}`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                <text
                  x={22 + currIdx * GAP + BOX_W / 2}
                  y={PTR_Y}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight="700"
                  fill="#4C7DFF"
                >
                  curr
                </text>
                <line
                  x1={22 + currIdx * GAP + BOX_W / 2}
                  y1={PTR_Y + 4}
                  x2={22 + currIdx * GAP + BOX_W / 2}
                  y2={BOX_Y - 2}
                  stroke="#4C7DFF"
                  strokeWidth={1.5}
                  markerEnd="url(#arrowBlue)"
                />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Arrowhead markers */}
          <defs>
            <marker id="arrowGreen" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#2FBF8F" />
            </marker>
            <marker id="arrowBlue" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#4C7DFF" />
            </marker>
            <marker id="arrowMuted" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#9AA7B7" />
            </marker>
          </defs>

          {/* ── List nodes ── */}
          {LIST_VALUES.map((val, i) => {
            const { fill, stroke, text } = nodeStyle(i);
            const nx = 22 + i * GAP;

            return (
              <motion.g
                key={i}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {/* Node box */}
                <motion.rect
                  x={nx}
                  y={BOX_Y}
                  width={BOX_W}
                  height={BOX_H}
                  rx={8}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2}
                  animate={{ fill, stroke }}
                  transition={{ duration: 0.35 }}
                />
                {/* Value */}
                <text
                  x={nx + BOX_W / 2}
                  y={BOX_Y + BOX_H / 2 + 5}
                  textAnchor="middle"
                  fontSize={16}
                  fontWeight="700"
                  fill={text}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {val}
                </text>

                {/* Arrow to next */}
                {i < LIST_VALUES.length - 1 && (
                  <line
                    x1={nx + BOX_W + 2}
                    y1={BOX_Y + BOX_H / 2}
                    x2={nx + BOX_W + ARROW_W - 4}
                    y2={BOX_Y + BOX_H / 2}
                    stroke={i < safeStep - 1 ? "#2FBF8F" : "#9AA7B7"}
                    strokeWidth={1.8}
                    markerEnd={i < safeStep - 1 ? "url(#arrowGreen)" : "url(#arrowMuted)"}
                    style={{ transition: "stroke 0.35s ease" }}
                  />
                )}
              </motion.g>
            );
          })}

          {/* "null" terminal node */}
          <text
            x={22 + LIST_VALUES.length * GAP + 6}
            y={BOX_Y + BOX_H / 2 + 5}
            fontSize={12}
            fontWeight="600"
            fill={isDone ? "#2FBF8F" : "#9AA7B7"}
            style={{ transition: "fill 0.3s" }}
          >
            null
          </text>
          {/* Arrow to null */}
          <line
            x1={22 + (LIST_VALUES.length - 1) * GAP + BOX_W + 2}
            y1={BOX_Y + BOX_H / 2}
            x2={22 + LIST_VALUES.length * GAP + 2}
            y2={BOX_Y + BOX_H / 2}
            stroke="#9AA7B7"
            strokeWidth={1.8}
            markerEnd="url(#arrowMuted)"
          />

          {/* curr = null label when done */}
          {isDone && (
            <text
              x={22 + LIST_VALUES.length * GAP + 10}
              y={PTR_Y}
              fontSize={11}
              fontWeight="700"
              fill="#4C7DFF"
              textAnchor="middle"
            >
              curr
            </text>
          )}
        </svg>
      </div>

      {/* Step description */}
      <div className="w-full px-3 py-2 rounded-lg bg-[#1B222C] border border-[#232C38]">
        <p className="text-[#EAF0F8] text-xs font-mono leading-relaxed">
          {getStepDescription(safeStep)}
        </p>
      </div>

      {/* Step counter */}
      <div className="text-[#9AA7B7] text-xs font-mono self-start">
        Step {safeStep} / {TOTAL_STEPS}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5">
        {[
          { fill: "#1B222C", stroke: "#9AA7B7", label: "Unvisited"  },
          { fill: "#4C7DFF", stroke: "#4C7DFF", label: "curr node"  },
          { fill: "#2FBF8F", stroke: "#2FBF8F", label: "Reversed"   },
        ].map(({ fill, stroke, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div
              className="w-3.5 h-3.5 rounded"
              style={{ backgroundColor: fill, border: `1.5px solid ${stroke}` }}
            />
            <span className="text-[#9AA7B7] text-xs">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

