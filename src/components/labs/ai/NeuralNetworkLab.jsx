import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Info,
  Sliders,
  Activity,
  CheckCircle2
} from 'lucide-react'
import { cn } from '../../../utils/cn'

export default function NeuralNetworkLab() {
  // Inputs
  const [x1, setX1] = useState(0.8)
  const [x2, setX2] = useState(-0.5)

  // Activation function: 'relu' | 'sigmoid' | 'tanh'
  const [activationFn, setActivationFn] = useState('relu')

  // Weights & Biases
  const [w1, setW1] = useState(1.2)
  const [w2, setW2] = useState(-0.8)
  const [bias, setBias] = useState(0.2)

  // Helper activation functions
  const activate = (z) => {
    if (activationFn === 'sigmoid') return 1 / (1 + Math.exp(-z))
    if (activationFn === 'tanh') return Math.tanh(z)
    return Math.max(0, z) // ReLU
  }

  // Forward calculations
  const { z1, h1, z2, h2, z3, h3, outZ, finalOutput } = useMemo(() => {
    // Hidden neuron 1
    const rawZ1 = x1 * w1 + x2 * 0.5 + bias
    const actH1 = activate(rawZ1)

    // Hidden neuron 2
    const rawZ2 = x1 * (-0.7) + x2 * w2 + bias
    const actH2 = activate(rawZ2)

    // Hidden neuron 3
    const rawZ3 = x1 * 0.9 + x2 * 1.1 + bias
    const actH3 = activate(rawZ3)

    // Output neuron
    const rawOutZ = actH1 * 0.8 + actH2 * (-1.1) + actH3 * 0.6 + bias
    const actOut = 1 / (1 + Math.exp(-rawOutZ)) // Sigmoid output for classification [0, 1]

    return {
      z1: rawZ1.toFixed(3),
      h1: actH1.toFixed(3),
      z2: rawZ2.toFixed(3),
      h2: actH2.toFixed(3),
      z3: rawZ3.toFixed(3),
      h3: actH3.toFixed(3),
      outZ: rawOutZ.toFixed(3),
      finalOutput: actOut.toFixed(3)
    }
  }, [x1, x2, w1, w2, bias, activationFn])

  const handleReset = () => {
    setX1(0.8)
    setX2(-0.5)
    setW1(1.2)
    setW2(-0.8)
    setBias(0.2)
    setActivationFn('relu')
  }

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-atlas-surface via-atlas-elev to-atlas-surface p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
            <Brain size={18} className="text-purple-400" />
            <span>Deep Learning & Neural Computation Simulation</span>
          </div>
          <h3 className="mt-1 text-xl font-bold text-atlas-text">Neural Network Forward Propagation & Activations</h3>
          <p className="text-xs text-atlas-muted mt-0.5 max-w-2xl">
            Tune inputs, synaptic connection weights (W), biases (b), and non-linear activation functions (ReLU, Sigmoid, Tanh) to watch tensor signal propagation in real time.
          </p>
        </div>

        {/* Prediction summary */}
        <div className="flex items-center gap-3 bg-atlas-bg0/80 p-3 rounded-2xl border border-atlas-muted/20">
          <div className="text-center px-2">
            <span className="text-[10px] text-atlas-muted uppercase block">Model Output (Y)</span>
            <span className="text-lg font-bold font-mono text-purple-300">{finalOutput}</span>
          </div>
          <div className="h-7 w-px bg-atlas-muted/20" />
          <div className="text-center px-2">
            <span className="text-[10px] text-atlas-muted uppercase block">Classification</span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {Number(finalOutput) > 0.5 ? 'Positive (Class 1)' : 'Negative (Class 0)'}
            </span>
          </div>
        </div>
      </div>

      {/* Control Strip */}
      <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-surface/80 p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Activation Function Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-atlas-muted font-medium">Activation Function σ(z):</span>
            <div className="flex items-center gap-1">
              {[
                { id: 'relu', label: 'ReLU (max(0,z))' },
                { id: 'sigmoid', label: 'Sigmoid' },
                { id: 'tanh', label: 'Tanh' }
              ].map(fn => (
                <button
                  key={fn.id}
                  onClick={() => setActivationFn(fn.id)}
                  className={cn(
                    'px-3 py-1 text-xs font-mono font-semibold rounded-lg transition border',
                    activationFn === fn.id
                      ? 'bg-purple-500 text-white border-purple-400'
                      : 'bg-atlas-elev text-atlas-muted border-atlas-muted/20 hover:text-atlas-text'
                  )}
                >
                  {fn.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 rounded-lg bg-atlas-elev hover:bg-atlas-bg0 border border-atlas-muted/20 px-3 py-1.5 text-xs font-medium text-atlas-muted hover:text-atlas-text transition"
          >
            <RotateCcw size={13} /> Reset Weights
          </button>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-2 border-t border-atlas-muted/15 text-xs font-mono">
          <div>
            <div className="flex justify-between text-atlas-muted">
              <span>Input x₁</span>
              <span className="text-cyan-300 font-bold">{x1}</span>
            </div>
            <input
              type="range"
              min={-2}
              max={2}
              step={0.1}
              value={x1}
              onChange={e => setX1(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-atlas-muted">
              <span>Input x₂</span>
              <span className="text-cyan-300 font-bold">{x2}</span>
            </div>
            <input
              type="range"
              min={-2}
              max={2}
              step={0.1}
              value={x2}
              onChange={e => setX2(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-atlas-muted">
              <span>Weight w₁</span>
              <span className="text-amber-300 font-bold">{w1}</span>
            </div>
            <input
              type="range"
              min={-3}
              max={3}
              step={0.1}
              value={w1}
              onChange={e => setW1(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-atlas-muted">
              <span>Weight w₂</span>
              <span className="text-amber-300 font-bold">{w2}</span>
            </div>
            <input
              type="range"
              min={-3}
              max={3}
              step={0.1}
              value={w2}
              onChange={e => setW2(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-atlas-muted">
              <span>Bias (b)</span>
              <span className="text-purple-300 font-bold">{bias}</span>
            </div>
            <input
              type="range"
              min={-1}
              max={1}
              step={0.05}
              value={bias}
              onChange={e => setBias(Number(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Visual Neural Network Architecture Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-6 space-y-6">
            <h4 className="text-sm font-bold text-atlas-text font-sans">Multi-Layer Forward Signal Flow</h4>

            {/* Visual Layers Grid */}
            <div className="grid grid-cols-3 gap-8 py-6 px-4 bg-atlas-bg0/60 rounded-2xl border border-atlas-muted/15 items-center">
              {/* Layer 1: Inputs */}
              <div className="space-y-6 text-center">
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">Input Layer (2)</span>
                <div className="space-y-4">
                  <div className="h-14 w-14 mx-auto rounded-2xl border-2 border-cyan-400 bg-cyan-500/20 flex flex-col items-center justify-center font-mono shadow-md">
                    <span className="text-[9px] text-atlas-muted">x₁</span>
                    <span className="text-xs font-bold text-cyan-300">{x1}</span>
                  </div>
                  <div className="h-14 w-14 mx-auto rounded-2xl border-2 border-cyan-400 bg-cyan-500/20 flex flex-col items-center justify-center font-mono shadow-md">
                    <span className="text-[9px] text-atlas-muted">x₂</span>
                    <span className="text-xs font-bold text-cyan-300">{x2}</span>
                  </div>
                </div>
              </div>

              {/* Layer 2: Hidden Neurons */}
              <div className="space-y-4 text-center">
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">Hidden Layer (3)</span>
                <div className="space-y-3">
                  <div className="h-14 w-14 mx-auto rounded-2xl border-2 border-amber-400 bg-amber-500/20 flex flex-col items-center justify-center font-mono shadow-md">
                    <span className="text-[9px] text-atlas-muted">h₁</span>
                    <span className="text-xs font-bold text-amber-300">{h1}</span>
                  </div>
                  <div className="h-14 w-14 mx-auto rounded-2xl border-2 border-amber-400 bg-amber-500/20 flex flex-col items-center justify-center font-mono shadow-md">
                    <span className="text-[9px] text-atlas-muted">h₂</span>
                    <span className="text-xs font-bold text-amber-300">{h2}</span>
                  </div>
                  <div className="h-14 w-14 mx-auto rounded-2xl border-2 border-amber-400 bg-amber-500/20 flex flex-col items-center justify-center font-mono shadow-md">
                    <span className="text-[9px] text-atlas-muted">h₃</span>
                    <span className="text-xs font-bold text-amber-300">{h3}</span>
                  </div>
                </div>
              </div>

              {/* Layer 3: Output Neuron */}
              <div className="space-y-6 text-center">
                <span className="text-[10px] font-mono text-purple-400 uppercase font-bold block">Output Layer (1)</span>
                <div className="h-16 w-16 mx-auto rounded-2xl border-2 border-purple-400 bg-purple-500/20 flex flex-col items-center justify-center font-mono shadow-lg shadow-purple-500/20 ring-2 ring-purple-400/40">
                  <span className="text-[9px] text-atlas-muted">σ(z)</span>
                  <span className="text-sm font-bold text-purple-300">{finalOutput}</span>
                </div>
              </div>
            </div>

            {/* Architecture Explanation */}
            <div className="rounded-xl bg-atlas-bg0/60 p-3 text-xs text-atlas-muted space-y-1 border border-atlas-muted/10">
              <div className="font-semibold text-atlas-text flex items-center gap-1.5">
                <Info size={13} className="text-purple-400" />
                <span>Non-Linearity & The Universal Approximation Theorem:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Without non-linear activations (like <strong>ReLU</strong> or <strong>Sigmoid</strong>), stacking multiple neural layers collapses mathematically into a single linear matrix multiplication. Non-linearities allow neural networks to approximate any continuous function and learn complex decision boundaries.
              </p>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Mathematical Equation Inspector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-4 font-mono text-xs">
            <h4 className="text-sm font-bold text-atlas-text font-sans">Neuron Mathematics Inspector</h4>

            <div className="rounded-xl bg-atlas-elev/70 p-3 border border-atlas-muted/15 space-y-1.5">
              <span className="text-[10px] text-atlas-muted uppercase block">Linear Transformation</span>
              <span className="text-cyan-300 block font-bold">z = ∑ (wᵢ · xᵢ) + b</span>
              <div className="text-[11px] text-atlas-text/80 pt-1 border-t border-atlas-muted/10">
                z₁ = ({x1} × {w1}) + ({x2} × 0.5) + {bias} = <strong className="text-amber-300">{z1}</strong>
              </div>
            </div>

            <div className="rounded-xl bg-atlas-elev/70 p-3 border border-atlas-muted/15 space-y-1.5">
              <span className="text-[10px] text-atlas-muted uppercase block">Non-Linear Activation</span>
              <span className="text-purple-300 block font-bold">h = {activationFn}(z)</span>
              <div className="text-[11px] text-atlas-text/80 pt-1 border-t border-atlas-muted/10">
                h₁ = {activationFn}({z1}) = <strong className="text-purple-300">{h1}</strong>
              </div>
            </div>

            <div className="rounded-xl bg-purple-500/10 p-3 border border-purple-500/30 space-y-1 text-purple-200">
              <span className="font-bold text-xs block">Final Sigmoid Output:</span>
              <span className="text-sm font-bold font-mono text-purple-300">
                ŷ = 1 / (1 + e^(-{outZ})) = {finalOutput}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
