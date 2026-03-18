import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Panel from './Panel'

const buildSeries = (steps, stepIndex) => {
  const upto = steps.slice(0, stepIndex + 1)
  const seriesMap = new Map()
  const numericPattern = /^-?\d+(\.\d+)?$/

  upto.forEach((step, index) => {
    step.callStack?.forEach((frame) => {
      frame.vars?.forEach((entry) => {
        if (!numericPattern.test(entry.label)) {
          return
        }
        const key = `${frame.name}:${entry.name}`
        if (!seriesMap.has(key)) {
          seriesMap.set(key, [])
        }
        seriesMap.get(key).push({ step: index, value: Number(entry.label) })
      })
    })
  })

  return [...seriesMap.entries()].map(([id, points]) => ({ id, label: id, points }))
}

const VariableTrendPanel = ({ steps, stepIndex }) => {
  const series = useMemo(() => buildSeries(steps, stepIndex), [steps, stepIndex])
  const [selectedId, setSelectedId] = useState('')

  const active = series.find((item) => item.id === selectedId) || series[0]

  const points = active?.points || []
  const width = 420
  const height = 160
  
  const paddedMax = points.length ? Math.max(...points.map((point) => point.value)) * 1.1 : 1
  const paddedMin = points.length ? Math.min(...points.map((point) => point.value)) * 0.9 : 0
  
  const max = points.length ? Math.max(...points.map((p) => p.value)) : 10
  const min = points.length ? Math.min(...points.map((p) => p.value)) : 0
  
  const spread = Math.max(paddedMax - paddedMin, 1)

  const getCoordinates = (index, value) => {
    const x = points.length === 1 ? width / 2 : (index / (points.length - 1)) * width
    const y = height - ((value - paddedMin) / spread) * height
    return { x, y }
  }

  // Smooth curve instead of straight lines using bezier
  const createSmoothLine = () => {
    if (points.length === 0) return ''
    if (points.length === 1) return `M ${getCoordinates(0, points[0].value).x} ${getCoordinates(0, points[0].value).y}`
    
    let path = `M ${getCoordinates(0, points[0].value).x} ${getCoordinates(0, points[0].value).y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
        const curr = getCoordinates(i, points[i].value)
        const next = getCoordinates(i + 1, points[i + 1].value)
        const cpX = (curr.x + next.x) / 2
        path += ` C ${cpX} ${curr.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`
    }
    return path
  }

  const pathData = createSmoothLine()
  const areaData = points.length > 0 ? `${pathData} L ${width} ${height} L 0 ${height} Z` : ''

  return (
    <Panel title="Variable Evolution" subtitle="Track value changes over execution" accent>
      {series.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-zinc-500">
          No numeric variables to plot yet.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-zinc-400">Inspect sequence</span>
            <div className="relative">
              <select
                value={active?.id || ''}
                onChange={(event) => setSelectedId(event.target.value)}
                className="appearance-none rounded-xl border border-sky-500/30 bg-[#0a0d13]/90 px-4 py-2 pr-8 text-xs font-bold tracking-wider text-sky-100 shadow-[0_0_15px_rgba(56,189,248,0.1)] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
              >
                {series.map((entry) => (
                  <option key={entry.id} value={entry.id}>{entry.label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 px-1">
                ▼
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#050608]/90 p-4 shadow-inner">
            <svg viewBox={`0 0 ${width} ${height}`} className="h-44 w-full overflow-visible">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(56, 189, 248, 0.4)" />
                  <stop offset="100%" stopColor="rgba(56, 189, 248, 0.0)" />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(56, 189, 248, 0.8)" />
                  <stop offset="100%" stopColor="rgba(192, 132, 252, 1)" />
                </linearGradient>
              </defs>

              {/* Area map */}
              <AnimatePresence>
                {points.length > 1 && (
                  <motion.path 
                    key={`${active?.id}-area-${points.length}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    d={areaData} 
                    fill="url(#areaGradient)" 
                  />
                )}
              </AnimatePresence>

              {/* The Line */}
              <motion.path 
                key={`${active?.id}-line-${points.length}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                d={pathData} 
                fill="none" 
                stroke="url(#lineGradient)" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                style={{ filter: "drop-shadow(0px 4px 6px rgba(56, 189, 248, 0.4))" }}
              />

              {/* Data points */}
              {points.map((point, index) => {
                const { x, y } = getCoordinates(index, point.value)
                const isLatest = index === points.length - 1
                return (
                  <motion.g key={`${active.id}-${point.step}-${index}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring" }}>
                    <circle cx={x} cy={y} r={isLatest ? "5" : "3.5"} fill="#0a0d13" stroke={isLatest ? "rgba(192, 132, 252, 1)" : "rgba(56, 189, 248, 0.95)"} strokeWidth={isLatest ? "3" : "2"} />
                    {isLatest && (
                      <motion.circle cx={x} cy={y} r="12" fill="none" stroke="rgba(192, 132, 252, 0.4)" strokeWidth="2" animate={{ scale: [1, 2], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} />
                    )}
                  </motion.g>
                )
              })}
            </svg>
            
            {/* Grid Lines (Visual) */}
            <div className="absolute inset-x-0 bottom-4 border-b border-white/5" />
            <div className="absolute inset-x-0 top-1/2 border-b border-white/5" />
            <div className="absolute inset-x-0 top-4 border-b border-white/5" />
          </div>

          <div className="flex justify-between items-center rounded-xl bg-white/5 px-4 py-2 mt-2">
            <span className="text-xs uppercase tracking-widest text-zinc-500">Current Value</span>
            <motion.span 
              key={points[points.length - 1]?.value}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="font-mono text-lg font-bold text-white shadow-sky-500/50 text-sky-200"
            >
              {points[points.length - 1]?.value ?? 'N/A'}
            </motion.span>
          </div>
        </div>
      )}
    </Panel>
  )
}

export default VariableTrendPanel
