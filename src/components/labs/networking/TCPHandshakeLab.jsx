import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe,
  Server,
  Laptop,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle2,
  Info,
  Zap,
  Activity,
  Layers
} from 'lucide-react'
import { cn } from '../../../utils/cn'

const HANDSHAKE_STEPS = [
  {
    step: 0,
    title: 'Idle / Listening',
    sender: null,
    direction: 'none',
    packet: null,
    clientState: 'CLOSED',
    serverState: 'LISTEN',
    explanation: 'Server is bound to port 443 in LISTEN state. Client socket is CLOSED.'
  },
  {
    step: 1,
    title: 'Step 1: SYN (Synchronize)',
    sender: 'client',
    direction: 'forward',
    packet: {
      flags: ['SYN'],
      seq: 1000,
      ack: 0,
      win: 64240,
      mss: 1460,
      payload: 'SYN Packet (Initial Seq = 1000)'
    },
    clientState: 'SYN_SENT',
    serverState: 'LISTEN',
    explanation: 'Client sends SYN packet with randomly chosen Initial Sequence Number (ISN = 1000) and MSS parameters.'
  },
  {
    step: 2,
    title: 'Step 2: SYN-ACK (Synchronize-Acknowledge)',
    sender: 'server',
    direction: 'backward',
    packet: {
      flags: ['SYN', 'ACK'],
      seq: 5000,
      ack: 1001,
      win: 65535,
      mss: 1460,
      payload: 'SYN-ACK Packet (Server ISN = 5000, ACK = 1001)'
    },
    clientState: 'SYN_SENT',
    serverState: 'SYN_RCVD',
    explanation: 'Server acknowledges client ISN (ACK = 1000 + 1 = 1001) and generates its own ISN = 5000.'
  },
  {
    step: 3,
    title: 'Step 3: ACK (Acknowledge)',
    sender: 'client',
    direction: 'forward',
    packet: {
      flags: ['ACK'],
      seq: 1001,
      ack: 5001,
      win: 64240,
      mss: 1460,
      payload: 'ACK Packet (ACK = 5001)'
    },
    clientState: 'ESTABLISHED',
    serverState: 'ESTABLISHED',
    explanation: 'Client acknowledges server ISN (ACK = 5000 + 1 = 5001). Full duplex TCP socket is now ESTABLISHED!'
  },
  {
    step: 4,
    title: 'Step 4: Data Exchange (HTTP Request)',
    sender: 'client',
    direction: 'forward',
    packet: {
      flags: ['PSH', 'ACK'],
      seq: 1001,
      ack: 5001,
      win: 64240,
      mss: 1460,
      payload: 'GET /index.html HTTP/1.1 (Payload: 256 B)'
    },
    clientState: 'ESTABLISHED',
    serverState: 'ESTABLISHED',
    explanation: 'Client pushes HTTP payload. TCP tracks transmitted byte count in Sequence numbers.'
  },
  {
    step: 5,
    title: 'Step 5: Connection Teardown (FIN)',
    sender: 'client',
    direction: 'forward',
    packet: {
      flags: ['FIN', 'ACK'],
      seq: 1257,
      ack: 5001,
      win: 64240,
      mss: 1460,
      payload: 'FIN Packet (Graceful Socket Close)'
    },
    clientState: 'FIN_WAIT_1',
    serverState: 'CLOSE_WAIT',
    explanation: 'Client initiates graceful 4-way connection teardown by sending FIN flag.'
  }
]

export default function TCPHandshakeLab() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [packetLossSimulation, setPacketLossSimulation] = useState(false)
  const [rttLatencyMs, setRttLatencyMs] = useState(45)

  const activeStep = HANDSHAKE_STEPS[currentStepIndex]

  // Auto-play interval
  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev + 1 >= HANDSHAKE_STEPS.length) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 2400)
    return () => clearInterval(timer)
  }, [isPlaying])

  const handleNext = () => {
    setIsPlaying(false)
    setCurrentStepIndex(prev => Math.min(HANDSHAKE_STEPS.length - 1, prev + 1))
  }

  const handlePrev = () => {
    setIsPlaying(false)
    setCurrentStepIndex(prev => Math.max(0, prev - 1))
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStepIndex(0)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-atlas-surface via-atlas-elev to-atlas-surface p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Globe size={18} className="text-cyan-400" />
            <span>Transport Layer Protocol Simulation</span>
          </div>
          <h3 className="mt-1 text-xl font-bold text-atlas-text">TCP 3-Way Handshake & Connection Mechanics</h3>
          <p className="text-xs text-atlas-muted mt-0.5 max-w-2xl">
            Simulates RFC 793 sequence/acknowledgment number synchronization, state machines, and bidirectional packet transmission over unbuffered IP networks.
          </p>
        </div>

        {/* State Summary Badges */}
        <div className="flex items-center gap-3 bg-atlas-bg0/80 p-3 rounded-2xl border border-atlas-muted/20">
          <div className="text-center px-2">
            <span className="text-[10px] text-atlas-muted uppercase block">Client Socket</span>
            <span className="text-xs font-mono font-bold text-cyan-300">{activeStep.clientState}</span>
          </div>
          <div className="h-7 w-px bg-atlas-muted/20" />
          <div className="text-center px-2">
            <span className="text-[10px] text-atlas-muted uppercase block">Server Socket</span>
            <span className="text-xs font-mono font-bold text-emerald-400">{activeStep.serverState}</span>
          </div>
        </div>
      </div>

      {/* Control Strip */}
      <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-surface/80 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Playback Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition border',
                isPlaying
                  ? 'bg-amber-500 text-white border-amber-400'
                  : 'bg-atlas-brand text-white border-atlas-brand'
              )}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              {isPlaying ? 'Pause' : 'Auto Play'}
            </button>
            <button
              onClick={handlePrev}
              disabled={currentStepIndex <= 0}
              className="rounded-lg bg-atlas-elev hover:bg-atlas-bg0 border border-atlas-muted/20 px-3 py-1.5 text-xs font-medium text-atlas-text transition disabled:opacity-40"
            >
              Step Back
            </button>
            <button
              onClick={handleNext}
              disabled={currentStepIndex >= HANDSHAKE_STEPS.length - 1}
              className="rounded-lg bg-atlas-elev hover:bg-atlas-bg0 border border-atlas-muted/20 px-3 py-1.5 text-xs font-medium text-atlas-text transition disabled:opacity-40"
            >
              Next Step ➔
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 rounded-lg bg-atlas-elev hover:bg-atlas-bg0 border border-atlas-muted/20 px-3 py-1.5 text-xs font-medium text-atlas-muted hover:text-atlas-text transition"
            >
              <RotateCcw size={13} /> Reset
            </button>
          </div>

          {/* Network Parameter Dials */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-atlas-muted">Simulated RTT:</span>
              <span className="text-cyan-300 font-bold">{rttLatencyMs}ms</span>
              <input
                type="range"
                min={10}
                max={150}
                value={rttLatencyMs}
                onChange={e => setRttLatencyMs(Number(e.target.value))}
                className="w-24 accent-atlas-brand cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Transmission Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Packet Transmission Wire */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-6 space-y-8">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-atlas-text">Physical TCP Wire Simulation</h4>
              <span className="text-xs font-mono text-cyan-400">
                Phase {currentStepIndex + 1} of {HANDSHAKE_STEPS.length}
              </span>
            </div>

            {/* Endpoints & Transmission Line */}
            <div className="relative py-8 px-4 flex items-center justify-between">
              {/* Client Node */}
              <div className="flex flex-col items-center space-y-2 z-10">
                <div className="h-16 w-16 rounded-2xl border-2 border-cyan-400 bg-cyan-500/10 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/10">
                  <Laptop size={28} />
                </div>
                <div className="text-center font-mono">
                  <span className="text-xs font-bold text-atlas-text block">Client (Initiator)</span>
                  <span className="text-[10px] text-atlas-muted">192.168.1.50:52418</span>
                  <span className="text-[10px] text-cyan-400 font-semibold uppercase block mt-0.5">
                    {activeStep.clientState}
                  </span>
                </div>
              </div>

              {/* Cable Line */}
              <div className="absolute left-20 right-20 h-2 rounded-full bg-atlas-elev overflow-hidden flex items-center justify-center">
                {/* Packet In Flight Animation */}
                <AnimatePresence mode="wait">
                  {activeStep.packet && (
                    <motion.div
                      key={currentStepIndex}
                      initial={{
                        x: activeStep.direction === 'forward' ? '-140%' : '140%',
                        opacity: 0,
                        scale: 0.8
                      }}
                      animate={{
                        x: '0%',
                        opacity: 1,
                        scale: 1
                      }}
                      exit={{
                        x: activeStep.direction === 'forward' ? '140%' : '-140%',
                        opacity: 0
                      }}
                      transition={{ duration: 0.7, ease: 'easeInOut' }}
                      className="rounded-xl border border-cyan-400 bg-cyan-500 text-slate-950 font-mono text-[10px] font-bold px-3 py-1 shadow-lg shadow-cyan-500/50 flex items-center gap-1.5 z-20 whitespace-nowrap"
                    >
                      <span>{activeStep.packet.flags.join('+')}</span>
                      <span>(SEQ:{activeStep.packet.seq})</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Server Node */}
              <div className="flex flex-col items-center space-y-2 z-10">
                <div className="h-16 w-16 rounded-2xl border-2 border-emerald-400 bg-emerald-500/10 flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-500/10">
                  <Server size={28} />
                </div>
                <div className="text-center font-mono">
                  <span className="text-xs font-bold text-atlas-text block">Server (Listener)</span>
                  <span className="text-[10px] text-atlas-muted">104.21.4.12:443</span>
                  <span className="text-[10px] text-emerald-400 font-semibold uppercase block mt-0.5">
                    {activeStep.serverState}
                  </span>
                </div>
              </div>
            </div>

            {/* Step Explanation Card */}
            <div className="rounded-xl bg-atlas-bg0/80 p-4 border border-atlas-muted/15 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-xs text-atlas-text">
                <Info size={14} className="text-cyan-400" />
                <span>{activeStep.title}</span>
              </div>
              <p className="text-xs text-atlas-muted leading-relaxed">
                {activeStep.explanation}
              </p>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Live TCP Packet Header Inspector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-atlas-text font-sans">TCP Header Inspector</h4>
              <span className="text-[10px] text-cyan-300 uppercase">20 Bytes Header</span>
            </div>

            {activeStep.packet ? (
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-atlas-elev p-2.5 border border-atlas-muted/15">
                    <span className="text-[10px] text-atlas-muted uppercase block">Sequence (SEQ)</span>
                    <span className="text-sm font-bold text-cyan-300">{activeStep.packet.seq}</span>
                  </div>
                  <div className="rounded-lg bg-atlas-elev p-2.5 border border-atlas-muted/15">
                    <span className="text-[10px] text-atlas-muted uppercase block">Acknowledgment (ACK)</span>
                    <span className="text-sm font-bold text-emerald-300">{activeStep.packet.ack}</span>
                  </div>
                </div>

                <div className="rounded-lg bg-atlas-elev p-2.5 border border-atlas-muted/15 space-y-1">
                  <span className="text-[10px] text-atlas-muted uppercase block">Control Flags</span>
                  <div className="flex gap-1.5">
                    {['SYN', 'ACK', 'FIN', 'PSH', 'RST'].map(f => {
                      const isActive = activeStep.packet.flags.includes(f)
                      return (
                        <span
                          key={f}
                          className={cn(
                            'px-1.5 py-0.5 rounded text-[10px] font-bold',
                            isActive
                              ? 'bg-cyan-500 text-slate-950 shadow-sm'
                              : 'bg-atlas-bg0 text-atlas-muted/40'
                          )}
                        >
                          {f}
                        </span>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-atlas-elev p-2 border border-atlas-muted/15">
                    <span className="text-[10px] text-atlas-muted uppercase block">Window (WIN)</span>
                    <span className="font-bold text-atlas-text">{activeStep.packet.win} B</span>
                  </div>
                  <div className="rounded-lg bg-atlas-elev p-2 border border-atlas-muted/15">
                    <span className="text-[10px] text-atlas-muted uppercase block">Max Segment (MSS)</span>
                    <span className="font-bold text-atlas-text">{activeStep.packet.mss} B</span>
                  </div>
                </div>

                <div className="rounded-lg bg-cyan-500/10 border border-cyan-500/30 p-2.5 text-[11px] text-cyan-200">
                  <span className="font-bold block mb-0.5">Payload Summary:</span>
                  <span>{activeStep.packet.payload}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-atlas-muted font-sans">
                No packet in flight. Click "Next Step" to send SYN request.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
