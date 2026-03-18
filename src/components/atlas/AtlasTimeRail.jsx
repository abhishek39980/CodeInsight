import { useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Bookmark, Minus, Plus } from 'lucide-react'
import { motionTokens } from '../../atlas/motion'
import { cn } from '../../utils/cn'

const stepTone = {
  call: 'bg-atlas-call',
  return: 'bg-atlas-loop',
  loop: 'bg-atlas-loop',
  heap: 'bg-atlas-mutation',
  branch: 'bg-atlas-ref',
  error: 'bg-atlas-error',
  reference: 'bg-atlas-ref',
  output: 'bg-atlas-brand',
  async: 'bg-atlas-ref',
  scope: 'bg-atlas-muted',
  declare: 'bg-atlas-muted',
  execution: 'bg-atlas-muted',
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const AtlasTimeRail = ({
  steps,
  currentIndex,
  onSeek,
  onReplayFrom,
  bookmarks,
  onToggleBookmark,
  loopClusters,
  lifecycleIndices,
  hoverLifecycleIndices,
  importantIndices,
}) => {
  const railRef = useRef(null)
  const [zoom, setZoom] = useState(1)
  const scrubX = useMotionValue(0)
  const pulseOpacity = useTransform(scrubX, [0, 1], [0.7, 1])

  const total = steps.length

  const windowSize = useMemo(() => {
    if (!total) return 0
    return Math.max(14, Math.round(total / zoom))
  }, [total, zoom])

  const windowRange = useMemo(() => {
    if (!total || !windowSize) return [0, 0]
    const half = Math.floor(windowSize / 2)
    const start = clamp(currentIndex - half, 0, Math.max(0, total - windowSize))
    return [start, Math.min(total - 1, start + windowSize - 1)]
  }, [currentIndex, total, windowSize])

  const [rangeStart, rangeEnd] = windowRange
  const visibleSteps = steps.slice(rangeStart, rangeEnd + 1)
  const visibleCount = visibleSteps.length

  const clusterOverlay = useMemo(
    () =>
      (loopClusters || []).filter(
        (cluster) => cluster.startIndex <= rangeEnd && cluster.endIndex >= rangeStart && cluster.count >= 3,
      ),
    [loopClusters, rangeEnd, rangeStart],
  )

  const indexToPercent = (index) => {
    if (visibleCount <= 1) return 0
    return ((index - rangeStart) / (visibleCount - 1)) * 100
  }

  const seekFromClientX = (clientX) => {
    if (!railRef.current || !total) return
    const rect = railRef.current.getBoundingClientRect()
    const x = clamp(clientX - rect.left, 0, rect.width)
    scrubX.set(rect.width ? x / rect.width : 0)
    const ratio = rect.width ? x / rect.width : 0
    const next = rangeStart + Math.round(ratio * (visibleCount - 1))

    const snapCandidates = [...bookmarks, ...importantIndices]
      .filter((index) => index >= rangeStart && index <= rangeEnd)
      .sort((a, b) => Math.abs(a - next) - Math.abs(b - next))

    const snapped = snapCandidates.length && Math.abs(snapCandidates[0] - next) <= 1 ? snapCandidates[0] : next
    onSeek(clamp(snapped, 0, total - 1))
  }

  return (
    <div className="atlas-surface px-4 py-3">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-atlas-muted">Cinematic Time Rail</p>
          <p className="text-xs text-atlas-muted">
            Step {total ? `${currentIndex + 1}/${total}` : '0/0'} • clustered loops • lifecycle overlays
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoom((value) => clamp(Number((value - 0.25).toFixed(2)), 1, 6))}
            className="rounded-lg border border-atlas-muted/35 bg-atlas-surface px-2 py-1 text-atlas-muted hover:text-atlas-text"
          >
            <Minus size={14} />
          </button>
          <span className="w-14 text-center text-xs text-atlas-muted">{zoom.toFixed(2)}x</span>
          <button
            type="button"
            onClick={() => setZoom((value) => clamp(Number((value + 0.25).toFixed(2)), 1, 6))}
            className="rounded-lg border border-atlas-muted/35 bg-atlas-surface px-2 py-1 text-atlas-muted hover:text-atlas-text"
          >
            <Plus size={14} />
          </button>
          <button
            type="button"
            className="rounded-lg border border-atlas-muted/35 bg-atlas-surface px-2.5 py-1 text-xs text-atlas-muted hover:text-atlas-text"
            onClick={() => onToggleBookmark(currentIndex)}
          >
            <span className="inline-flex items-center gap-1">
              <Bookmark size={12} />
              {bookmarks.has(currentIndex) ? 'Bookmarked' : 'Bookmark'}
            </span>
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        className="relative h-16 cursor-pointer rounded-2xl border border-atlas-muted/25 bg-atlas-bg0/35 px-2"
        onClick={(event) => seekFromClientX(event.clientX)}
        onMouseMove={(event) => {
          if (event.buttons === 1) seekFromClientX(event.clientX)
        }}
      >
        <div className="absolute left-2 right-2 top-1/2 h-2 -translate-y-1/2 rounded-full bg-atlas-surface/85" />

        {clusterOverlay.map((cluster) => {
          const left = indexToPercent(Math.max(cluster.startIndex, rangeStart))
          const right = indexToPercent(Math.min(cluster.endIndex, rangeEnd))
          return (
            <div
              key={cluster.id}
              className="absolute top-[19px] h-6 rounded-full border border-atlas-loop/35 bg-atlas-loop/18"
              style={{ left: `calc(${left}% + 8px)`, width: `calc(${Math.max(right - left, 1)}% - 2px)` }}
              title={`Loop cluster (${cluster.count} iterations)`}
            />
          )
        })}

        {visibleSteps.map((step, offset) => {
          const index = rangeStart + offset
          const left = visibleCount <= 1 ? 0 : (offset / (visibleCount - 1)) * 100
          const important = importantIndices.includes(index)
          const lifecycle = lifecycleIndices.includes(index)
          const hoverLifecycle = hoverLifecycleIndices.includes(index)
          return (
            <div
              key={step.id}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `calc(${left}% + 8px)` }}
            >
              <div
                className={cn(
                  'h-2 w-2 -translate-x-1/2 rounded-full opacity-65',
                  stepTone[step.eventType] || 'bg-atlas-muted',
                  important && 'h-2.5 w-2.5 opacity-100 shadow-[0_0_8px_rgba(91,140,255,0.55)]',
                )}
              />
              {lifecycle ? (
                <div className="absolute -top-2.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-atlas-brand shadow-[0_0_10px_rgba(76,125,255,0.85)]" />
              ) : null}
              {hoverLifecycle ? (
                <div className="absolute -bottom-2.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-atlas-ember shadow-[0_0_10px_rgba(255,122,69,0.85)]" />
              ) : null}
              {bookmarks.has(index) ? (
                <div className="absolute -top-5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-atlas-text" />
              ) : null}
            </div>
          )
        })}

        <motion.div
          drag="x"
          dragMomentum
          dragElastic={0.06}
          dragConstraints={railRef}
          onDrag={(event) => seekFromClientX(event.clientX)}
          onDragEnd={(event) => seekFromClientX(event.clientX)}
          transition={motionTokens.scrubFollow}
          className="absolute top-1/2 z-10 h-8 w-2 -translate-y-1/2 -translate-x-1/2 cursor-grab rounded-full bg-atlas-text shadow-[0_0_12px_rgba(234,240,248,0.7)] active:cursor-grabbing"
          style={{ left: `calc(${indexToPercent(currentIndex)}% + 8px)` }}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-atlas-brand blur-[5px]"
            style={{ opacity: pulseOpacity }}
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.3 }}
          />
        </motion.div>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-atlas-muted">
        <span>Window {rangeStart + 1}-{rangeEnd + 1}</span>
        <button
          type="button"
          onClick={() => onReplayFrom(currentIndex)}
          className="rounded-md border border-atlas-muted/30 bg-atlas-surface px-2.5 py-1 text-atlas-muted hover:text-atlas-text"
        >
          Replay from here
        </button>
      </div>
    </div>
  )
}

export default AtlasTimeRail
