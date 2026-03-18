import { motion } from 'framer-motion'

const PointerOverlay = ({ links, frameOrder, heapOrder }) => {
  if (!links.length) {
    return null
  }

  const width = 460
  const rowHeight = 28
  const height = Math.max((Math.max(frameOrder.length, heapOrder.length) + 1) * rowHeight, 140)

  const frameIndex = Object.fromEntries(frameOrder.map((item, index) => [item.key, index]))
  const heapIndex = Object.fromEntries(heapOrder.map((item, index) => [item.id, index]))

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
      {links.map((link) => {
        const fromIdx = frameIndex[`${link.sourceFrame}:${link.sourceName}`]
        const toIdx = heapIndex[link.targetRefId]
        if (fromIdx === undefined || toIdx === undefined) {
          return null
        }

        const x1 = 96
        const y1 = 18 + fromIdx * rowHeight
        const x2 = 372
        const y2 = 18 + toIdx * rowHeight
        const c1 = x1 + 80
        const c2 = x2 - 80

        return (
          <motion.path
            key={`${link.sourceFrame}-${link.sourceName}-${link.targetRefId}`}
            d={`M ${x1} ${y1} C ${c1} ${y1}, ${c2} ${y2}, ${x2} ${y2}`}
            fill="none"
            stroke="rgba(96,165,250,0.55)"
            strokeWidth="1.4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.35 }}
          />
        )
      })}
    </svg>
  )
}

export default PointerOverlay
