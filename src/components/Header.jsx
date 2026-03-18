import { motion } from 'framer-motion'

const Header = () => {
  return (
    <header className="relative z-10 flex items-end justify-between border-b border-white/10 px-6 pb-5 pt-6">
      <div>
        <motion.h1
          className="text-[1.35rem] font-semibold tracking-[0.2em] text-zinc-100"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          CODEINSIGHT
        </motion.h1>
        <motion.p
          className="mt-1 text-xs tracking-[0.12em] text-zinc-400"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.05 }}
        >
          See how code thinks
        </motion.p>
      </div>

      <div className="hidden items-center gap-4 text-[0.7rem] tracking-[0.08em] text-zinc-500 md:flex">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-sky-400/90 shadow-[0_0_14px_rgba(56,189,248,0.9)]" />
          JavaScript Runtime View
        </span>
      </div>
    </header>
  )
}

export default Header

