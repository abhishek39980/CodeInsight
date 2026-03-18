import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Play, Code2 } from 'lucide-react';

const seeded = (seed) => {
  const value = Math.sin((seed + 1) * 97.1313) * 10000;
  return value - Math.floor(value);
};

export default function IntroOverlay({ onComplete }) {
  // Background floating particles
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: seeded(i) * 100,
      y: seeded(i + 20) * 100,
      size: seeded(i + 40) * 4 + 1,
      duration: seeded(i + 60) * 20 + 10,
    }));
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#020202]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Dynamic Background Noise & Gradients */}
      <div className="absolute inset-0 noise-overlay opacity-30 select-none pointer-events-none" />
      <div className="absolute inset-0 grid-overlay opacity-20 select-none pointer-events-none" />
      
      {/* Ambient glowing orbs */}
      <div className="absolute top-1/4 left-1/4 h-[40vh] w-[40vh] rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 h-[30vh] w-[30vh] rounded-full bg-purple-600/20 blur-[100px]" />

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20 blur-[1px]"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{
            y: ['0%', '-50%', '0%'],
            opacity: [0.1, 0.5, 0.1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 flex max-w-4xl flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="mb-6 flex items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-4 shadow-[0_0_40px_rgba(76,201,240,0.1)] backdrop-blur-md"
        >
          <Code2 className="h-10 w-10 text-blue-400" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          className="bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl mb-4"
        >
          See Your Code <br className="hidden sm:block" /> Come Alive
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
          className="max-w-xl text-lg text-zinc-400 sm:text-xl mb-12"
        >
          Step through execution, visualize memory, and truly understand how code works interactively.
        </motion.p>

        {/* Mock Visualization Widget */}
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
          className="relative mb-12 flex h-32 w-full max-w-sm items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 opacity-50" />
          <div className="flex gap-4">
            <motion.div animate={{ height: [20, 40, 20] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-8 rounded bg-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
            <motion.div animate={{ height: [30, 60, 30] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-8 rounded bg-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]" />
            <motion.div animate={{ height: [40, 20, 40] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-8 rounded bg-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.3)]" />
            <motion.div animate={{ height: [50, 80, 50] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }} className="w-8 rounded bg-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <button
            onClick={onComplete}
            className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-blue-600 px-8 py-4 font-semibold text-white transition-all hover:scale-105 hover:bg-blue-500 active:scale-95 shadow-[0_0_30px_rgba(37,99,235,0.4)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <Sparkles className="h-5 w-5" />
            Start Exploring
          </button>
          <button
            onClick={onComplete}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 font-semibold text-white transition-all hover:bg-white/10 active:scale-95"
          >
            <Play className="h-5 w-5 fill-current" />
            Try Demo
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
