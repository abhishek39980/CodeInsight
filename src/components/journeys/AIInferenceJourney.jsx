import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Database,
  Cpu,
  Layers,
  Zap,
  Info
} from 'lucide-react'
import { cn } from '../../utils/cn'

const AI_STAGES = [
  {
    id: 'tokenization',
    title: 'Stage 1: Byte-Pair Encoding (BPE) Tokenization',
    subtitle: 'Deconstructing raw prompt text into vocabulary IDs',
    tech: 'BPE · Tiktoken Vocabulary',
    icon: Sparkles,
    color: 'text-purple-400',
    details: [
      '1. User types prompt: "Why is the sky blue?"',
      '2. BPE Tokenizer breaks string into subwords: ["Why", " is", " the", " sky", " blue", "?"]',
      '3. Maps subwords to integer token IDs: [10452, 318, 262, 6766, 4171, 30]'
    ],
    output: 'Token IDs: [10452, 318, 262, 6766, 4171, 30] (Length: 6)'
  },
  {
    id: 'embeddings',
    title: 'Stage 2: High-Dimensional Vector Embeddings',
    subtitle: 'Projecting token IDs into dense mathematical semantic space',
    tech: 'd_model = 4096 dimensions + RoPE Positional Encodings',
    icon: Layers,
    color: 'text-indigo-400',
    details: [
      '1. Token IDs lookup dense 4096-dimensional vectors in embedding matrix.',
      '2. Rotary Position Embeddings (RoPE) inject relative word order geometry.',
      '3. Resulting tensor: Shape (Batch=1, SeqLen=6, Dim=4096).'
    ],
    output: 'Tensor: (1, 6, 4096) with float16 weights'
  },
  {
    id: 'rag',
    title: 'Stage 3: RAG Retrieval & Vector Database Search',
    subtitle: 'Querying vector index with Cosine Similarity',
    tech: 'HNSW Index · Cosine Similarity = 0.892',
    icon: Database,
    color: 'text-cyan-400',
    details: [
      '1. Question vector queried against Pinecone / Milvus vector index.',
      '2. Nearest neighbor search retrieves physics textbook passage on Rayleigh Scattering.',
      '3. Retrieved context injected into prompt prefix before model inference.'
    ],
    output: 'Retrieved Context: "Rayleigh scattering of sunlight by atmosphere molecules..."'
  },
  {
    id: 'attention',
    title: 'Stage 4: Multi-Head Self-Attention',
    subtitle: 'Computing Q, K, V scaled dot-product attention heatmaps',
    tech: 'Softmax(QK^T / sqrt(d_k)) * V · 32 Attention Heads',
    icon: Brain,
    color: 'text-amber-400',
    details: [
      '1. Linear projections compute Query (Q), Key (K), and Value (V) tensors.',
      '2. Dot product QK^T computes semantic relationship score between all token pairs.',
      '3. Softmax normalizes weights into an attention probability matrix.'
    ],
    output: 'Attention Weight("sky", "blue") = 0.941 · Strong semantic link'
  },
  {
    id: 'kv-cache',
    title: 'Stage 5: KV-Cache in GPU High-Bandwidth Memory (HBM)',
    subtitle: 'Eliminating redundant O(N^2) recomputations during generation',
    tech: 'GPU VRAM · FlashAttention-2',
    icon: Cpu,
    color: 'text-emerald-400',
    details: [
      '1. Past Key and Value tensors cached in GPU High-Bandwidth Memory (HBM3).',
      '2. Future token generation steps only compute attention against the cached KV store.',
      '3. Reduces decoding latency from quadratic O(N^2) to linear O(1) per token!'
    ],
    output: 'KV-Cache Occupancy: 12.4 MB in VRAM · 100% compute reuse'
  },
  {
    id: 'generation',
    title: 'Stage 6: Autoregressive Token Sampling & Streaming',
    subtitle: 'Logits distribution, Softmax, Temperature & Top-p sampling',
    tech: 'Temperature = 0.7 · Top-p = 0.9 · Next Token Stream',
    icon: Zap,
    color: 'text-pink-400',
    details: [
      '1. Final layer outputs logits across 32,000 vocabulary words.',
      '2. Temperature scaling (T=0.7) and Top-p (0.9) nucleus sampling select next token: "Rayleigh".',
      '3. Server-Sent Events (SSE) stream token to browser in real-time.'
    ],
    output: 'Stream Output: "The sky appears blue due to Rayleigh scattering..."'
  }
]

export default function AIInferenceJourney() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const activeStage = AI_STAGES[currentStageIndex]

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-atlas-surface via-atlas-elev to-atlas-surface p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
            <Brain size={18} className="text-purple-400" />
            <span>AI Systems & Large Language Model Journey</span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-atlas-text">What Happens When an AI Chatbot Answers You?</h2>
          <p className="text-xs text-atlas-muted mt-0.5 max-w-2xl">
            Explore the internal inference pipeline of an LLM: subword tokenization, high-dimensional vector embeddings, RAG similarity search, multi-head attention, and GPU KV-Cache autoregressive token streaming.
          </p>
        </div>

        {/* Progress Pill */}
        <div className="flex items-center gap-2 bg-atlas-bg0/80 px-3.5 py-2 rounded-xl border border-atlas-muted/20 text-xs font-mono">
          <span className="text-atlas-muted">Stage</span>
          <span className="text-purple-400 font-bold">{currentStageIndex + 1} / {AI_STAGES.length}</span>
        </div>
      </div>

      {/* Stage Stepper Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {AI_STAGES.map((s, idx) => {
          const Icon = s.icon
          const isActive = idx === currentStageIndex
          const isPassed = idx < currentStageIndex
          return (
            <button
              key={s.id}
              onClick={() => setCurrentStageIndex(idx)}
              className={cn(
                'p-3 rounded-xl border text-left transition relative font-mono text-xs space-y-1',
                isActive
                  ? 'border-purple-400 bg-purple-500/15 shadow-md ring-1 ring-purple-400'
                  : isPassed
                  ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300'
                  : 'border-atlas-muted/20 bg-atlas-surface/60 text-atlas-muted hover:bg-atlas-elev'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-atlas-muted">Stage {idx + 1}</span>
                {isPassed && <CheckCircle2 size={12} className="text-emerald-400" />}
              </div>
              <span className="font-bold text-atlas-text block truncate">{s.id.toUpperCase()}</span>
            </button>
          )
        })}
      </div>

      {/* Active Stage Simulation Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 cols: Interactive Stage Graphic */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-6 space-y-6 min-h-[380px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <activeStage.icon size={18} className={activeStage.color} />
                <h3 className="text-base font-bold text-atlas-text">{activeStage.title}</h3>
              </div>
              <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                {activeStage.tech}
              </span>
            </div>

            {/* Visual Flow Animation */}
            <div className="p-6 bg-atlas-bg0/80 rounded-2xl border border-atlas-muted/20 space-y-4">
              <div className="font-mono text-xs text-atlas-muted font-bold uppercase tracking-wider">
                Transformer Tensor Transformation
              </div>
              <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-3 font-mono text-xs text-purple-300 flex items-center gap-2">
                <Zap size={14} className="text-purple-400 flex-shrink-0" />
                <span>{activeStage.output}</span>
              </div>
              <div className="space-y-2 pt-2">
                {activeStage.details.map((d, i) => (
                  <div key={i} className="text-xs font-mono text-atlas-text/90 flex items-start gap-2">
                    <ArrowRight size={13} className="text-purple-400 mt-0.5 flex-shrink-0" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stepper Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-atlas-muted/15">
              <button
                onClick={() => setCurrentStageIndex(prev => Math.max(0, prev - 1))}
                disabled={currentStageIndex === 0}
                className="flex items-center gap-1.5 rounded-lg bg-atlas-elev hover:bg-atlas-bg0 border border-atlas-muted/20 px-3.5 py-1.5 text-xs font-medium text-atlas-text transition disabled:opacity-40"
              >
                <ArrowLeft size={13} /> Previous Stage
              </button>
              <button
                onClick={() => setCurrentStageIndex(prev => Math.min(AI_STAGES.length - 1, prev + 1))}
                disabled={currentStageIndex === AI_STAGES.length - 1}
                className="flex items-center gap-1.5 rounded-lg bg-atlas-brand hover:bg-atlas-brand/90 text-white px-4 py-1.5 text-xs font-bold transition shadow disabled:opacity-40"
              >
                Next Stage <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Right 4 cols: AI Infrastructure Insights */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-4">
            <h4 className="text-sm font-bold text-atlas-text font-sans">AI Infrastructure Insights</h4>

            <div className="space-y-2 text-xs text-atlas-muted leading-relaxed">
              <p>
                Modern 70B parameter models require <strong>140 GB of GPU High-Bandwidth Memory (HBM)</strong> in float16 precision across cluster nodes.
              </p>
              <p>
                Techniques like <strong>PagedAttention</strong>, <strong>FlashAttention</strong>, and <strong>speculative decoding</strong> maximize memory bandwidth to achieve generation speeds of 100+ tokens per second.
              </p>
            </div>

            <div className="rounded-xl bg-purple-500/10 border border-purple-500/30 p-3 text-xs text-purple-200 space-y-1">
              <span className="font-bold block">Next in Pipeline:</span>
              <span>{currentStageIndex < AI_STAGES.length - 1 ? AI_STAGES[currentStageIndex + 1].title : 'Pipeline Complete!'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
