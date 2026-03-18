import { AnimatePresence, motion } from 'framer-motion'

const AppShell = ({ children, showHint, onDismissHint }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-vantablack text-zinc-100 font-mono">
      {/* Base global background overlays */}
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-10" />
      <div className="blueprint-crosshairs pointer-events-none absolute inset-0 opacity-10" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(188,19,254,0.06),transparent_40%),radial-gradient(circle_at_85%_25%,rgba(191,255,0,0.04),transparent_40%)]" />
      <div className="noise-overlay pointer-events-none absolute inset-0 z-[100]" />
      <div className="crt-scanlines pointer-events-none absolute inset-0 z-[100]" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1700px] flex-col px-4 pb-6 pt-4 sm:px-5 lg:px-8">
        {children}
      </main>

      <AnimatePresence>
        {showHint ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-5 left-1/2 z-40 w-[min(560px,92vw)] -translate-x-1/2 rounded-2xl border border-white/10 bg-[#0a0d13]/90 px-4 py-3 backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-zinc-300">
                Start with <span className="text-zinc-100">Step Forward</span> to inspect each state transition, then increase speed.
              </p>
              <button
                type="button"
                className="rounded-lg border border-white/10 px-2 py-1 text-xs text-zinc-300 transition hover:bg-white/[0.05]"
                onClick={onDismissHint}
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default AppShell

