import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Grid3X3, Layers, Navigation } from 'lucide-react'
import { motionTokens } from '../../atlas/motion'
import { cn } from '../../utils/cn'

export default function AtlasGridScene({ currentStep, selectedEntity, onSelectEntity }) {
  // Extract 2D array / grid candidate from heap or variables
  const gridData = useMemo(() => {
    if (!currentStep) return null

    // Look for heap node that is a 2D array
    const heap = currentStep.heap || []
    const twoDNode = heap.find((node) => {
      const isArray = Array.isArray(node.value) || node.shape === 'array' || node.structureSubtype === 'array-2d'
      if (!isArray) return false
      const raw = node.value || []
      return raw.length > 0 && Array.isArray(raw[0])
    })

    if (twoDNode) {
      return {
        id: twoDNode.id,
        label: `Grid #${twoDNode.id}`,
        matrix: twoDNode.value,
        type: 'heap',
      }
    }

    // Look in top callstack frame variables for 2D array or object
    const topFrame = currentStep.callStack?.[currentStep.callStack.length - 1]
    if (topFrame?.vars) {
      for (const entry of topFrame.vars) {
        if (Array.isArray(entry.value) && entry.value.length > 0 && Array.isArray(entry.value[0])) {
          return {
            id: entry.name,
            label: entry.name,
            matrix: entry.value,
            type: 'variable',
          }
        }
      }
    }

    // Fallback default sample grid if no 2D array found in step
    return {
      id: 'default-grid',
      label: 'Sample Matrix (Run grid code example to inspect live)',
      matrix: [
        [1, 1, 0, 0, 1],
        [1, 1, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 1],
      ],
      type: 'sample',
    }
  }, [currentStep])

  const matrix = gridData?.matrix || []
  const rows = matrix.length
  const cols = rows > 0 ? matrix[0].length : 0

  // Track active row/col pointers from current step updates or variables
  const activePointers = useMemo(() => {
    if (!currentStep) return {}
    const topFrame = currentStep.callStack?.[currentStep.callStack.length - 1]
    const vars = topFrame?.vars || []

    let r = null
    let c = null

    vars.forEach((v) => {
      const name = v.name.toLowerCase()
      if (name === 'r' || name === 'row' || name === 'i') r = Number(v.value)
      if (name === 'c' || name === 'col' || name === 'j') c = Number(v.value)
    })

    return { r: Number.isInteger(r) ? r : null, c: Number.isInteger(c) ? c : null }
  }, [currentStep])

  return (
    <div className="atlas-surface flex min-h-[520px] flex-col p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-atlas-brand/40 bg-atlas-brand/15 p-2 text-atlas-brand">
            <Grid3X3 size={18} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-atlas-muted">Visual Canvas</p>
            <h2 className="text-lg font-semibold text-atlas-text">2D Matrix & Grid Explorer</h2>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-atlas-muted">
          <span className="rounded-full border border-atlas-muted/30 bg-atlas-surface/80 px-3 py-1 font-mono">
            {rows} × {cols} Grid
          </span>
          <span className="truncate max-w-[200px] text-atlas-text font-medium">{gridData?.label}</span>
        </div>
      </div>

      <div className="atlas-elevated relative flex flex-1 flex-col items-center justify-center overflow-auto p-6">
        {matrix.length > 0 ? (
          <div className="flex flex-col gap-2">
            {/* Column Header */}
            <div className="flex gap-2 pl-8">
              {Array.from({ length: cols }).map((_, cIdx) => (
                <div
                  key={`col-hdr-${cIdx}`}
                  className="w-14 text-center font-mono text-[11px] text-atlas-muted"
                >
                  c{cIdx}
                </div>
              ))}
            </div>

            {matrix.map((row, rIdx) => (
              <div key={`row-${rIdx}`} className="flex items-center gap-2">
                {/* Row Header */}
                <div className="w-6 text-right font-mono text-[11px] text-atlas-muted">r{rIdx}</div>

                {/* Row Cells */}
                <div className="flex gap-2">
                  {row.map((cellValue, cIdx) => {
                    const isActive = activePointers.r === rIdx && activePointers.c === cIdx
                    const isVisited = cellValue === 1 || cellValue === 'visited' || cellValue === true
                    const isObstacle = cellValue === 0 || cellValue === 'obstacle' || cellValue === '#'

                    return (
                      <motion.button
                        key={`cell-${rIdx}-${cIdx}`}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          onSelectEntity?.({
                            type: 'grid-cell',
                            label: `Cell [${rIdx}][${cIdx}] = ${cellValue}`,
                            entityId: `cell:${rIdx}:${cIdx}`,
                          })
                        }
                        className={cn(
                          'relative flex h-14 w-14 flex-col items-center justify-center rounded-xl border text-sm transition',
                          isActive
                            ? 'border-atlas-brand bg-atlas-brand/35 text-atlas-text shadow-[0_0_16px_rgba(76,125,255,0.75)]'
                            : isVisited
                              ? 'border-atlas-loop/50 bg-atlas-loop/20 text-atlas-text'
                              : isObstacle
                                ? 'border-atlas-muted/20 bg-atlas-bg0/80 text-atlas-muted/60'
                                : 'border-atlas-muted/30 bg-atlas-surface text-atlas-text hover:border-atlas-brand/40',
                        )}
                      >
                        <span className="font-mono font-semibold">{String(cellValue)}</span>
                        <span className="text-[9px] text-atlas-muted">
                          ({rIdx},{cIdx})
                        </span>

                        {isActive && (
                          <motion.div
                            layoutId="activeHead"
                            className="absolute -top-2 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-atlas-brand text-atlas-bg0 shadow"
                          >
                            <Navigation size={10} className="rotate-45 fill-current" />
                          </motion.div>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-atlas-muted">
            No 2D array or matrix active in current step state. Select a Grid/Matrix example to view.
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-atlas-muted/20 pt-3 text-xs text-atlas-muted">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md border border-atlas-brand bg-atlas-brand/40" /> Active Pointer Head (r, c)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md border border-atlas-loop/50 bg-atlas-loop/25" /> Visited / Reached Cell
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md border border-atlas-muted/20 bg-atlas-bg0" /> Unvisited / Obstacle Cell
          </span>
        </div>
        <span className="font-mono text-atlas-text">
          {activePointers.r !== null ? `Current Focus: (${activePointers.r}, ${activePointers.c})` : 'Step through execution to trace matrix updates.'}
        </span>
      </div>
    </div>
  )
}
