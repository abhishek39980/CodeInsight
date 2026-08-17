import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UploadCloud,
  HardDrive,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Database,
  Cpu,
  Layers,
  Zap,
  Globe,
  Radio
} from 'lucide-react'
import { cn } from '../../utils/cn'

const STAGES = [
  {
    id: 'presigned',
    title: 'Stage 1: Presigned S3 URL Authorization',
    subtitle: 'Generating short-lived secure IAM signature for direct browser-to-S3 upload',
    tech: 'AWS S3 · HMAC-SHA256 IAM Signature',
    icon: UploadCloud,
    color: 'text-blue-400',
    details: [
      '1. Client sends POST /api/upload-request (Filename: "vacation.jpg", Size: 4.2 MB).',
      '2. Application server validates user authentication & quota limits.',
      '3. Server uses AWS SDK to generate signed PUT URL with 5-minute expiration.',
      '4. Presigned URL returned to client with cryptographic signature.'
    ],
    packet: 'PUT https://s3.us-east-1.amazonaws.com/media/uploads/9f8a...jpg?X-Amz-Signature=...'
  },
  {
    id: 'direct-upload',
    title: 'Stage 2: Direct Binary S3 Object Ingestion',
    subtitle: 'Streaming image data directly to cloud storage without touching web servers',
    tech: 'HTTP/2 PUT · Multi-part Ingestion',
    icon: HardDrive,
    color: 'text-sky-400',
    details: [
      '1. Browser streams binary JPEG bytes directly to AWS S3 bucket over TLS.',
      '2. Application servers handle zero megabytes of bandwidth (prevents server saturation).',
      '3. S3 writes object across 3 availability zones and returns HTTP 200 ETag.'
    ],
    packet: 'HTTP 200 OK · ETag: "d41d8cd98f00b204e9800998ecf8427e"'
  },
  {
    id: 'event-bridge',
    title: 'Stage 3: S3 ObjectCreated Event & Message Queue',
    subtitle: 'Publishing asynchronous event to RabbitMQ / Kafka stream',
    tech: 'Apache Kafka · Topic: media.uploaded',
    icon: Radio,
    color: 'text-amber-400',
    details: [
      '1. S3 bucket emits s3:ObjectCreated:Put event JSON payload.',
      '2. Event published to Apache Kafka distributed commit log partition.',
      '3. Ensures guaranteed at-least-once delivery for asynchronous worker jobs.'
    ],
    packet: 'Event { bucket: "media", key: "uploads/9f8a.jpg", size: 4404019 }'
  },
  {
    id: 'worker-pool',
    title: 'Stage 4: Asynchronous Worker Image Processing',
    subtitle: 'Worker fleet resizes thumbnails and extracts EXIF metadata',
    tech: 'Go / Node Worker Pool · Libvips (C++)',
    icon: Cpu,
    color: 'text-purple-400',
    details: [
      '1. Background worker pulls message from Kafka partition.',
      '2. Downloads raw image and uses SIMD hardware acceleration to generate 3 thumbnails (256px, 1024px, 2048px WebP).',
      '3. Extracts camera EXIF data and strips sensitive GPS privacy coordinates.',
      '4. Uploads processed variants back to public S3 bucket.'
    ],
    packet: 'Processed in 42ms: [thumb_256.webp, thumb_1024.webp, thumb_2048.webp]'
  },
  {
    id: 'db-metadata',
    title: 'Stage 5: Relational Database Record Persistence',
    subtitle: 'Committing media metadata to PostgreSQL with ACID guarantees',
    tech: 'PostgreSQL · ACID Transaction',
    icon: Database,
    color: 'text-emerald-400',
    details: [
      '1. Worker executes INSERT INTO media_assets (user_id, s3_key, dimensions, status).',
      '2. PostgreSQL writes delta to Write-Ahead Log (WAL) and updates B-Tree user index.',
      '3. WebSocket notification sent to browser to display photo in UI!'
    ],
    packet: 'INSERT INTO media (id, status) VALUES (UUID, "READY") ➔ Commit'
  },
  {
    id: 'cdn-cache',
    title: 'Stage 6: Global Edge CDN Distribution',
    subtitle: 'Cloudflare CDN edge servers cache and serve WebP assets worldwide',
    tech: 'Cloudflare CDN · 300+ Edge PoPs',
    icon: Globe,
    color: 'text-pink-400',
    details: [
      '1. User requests image URL via nearest Cloudflare Anycast edge server.',
      '2. CDN caches media response at Edge POP in Tokyo / London / New York.',
      '3. Subsequent requests served with sub-10ms latency from Edge cache.'
    ],
    packet: 'CF-Cache-Status: HIT · Age: 124 · Latency: 8ms'
  }
]

export default function PhotoUploadJourney() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const activeStage = STAGES[currentStageIndex]

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-atlas-surface via-atlas-elev to-atlas-surface p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <UploadCloud size={18} className="text-blue-400" />
            <span>Distributed Cloud Media Ingestion Journey</span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-atlas-text">What Happens When You Upload a Photo?</h2>
          <p className="text-xs text-atlas-muted mt-0.5 max-w-2xl">
            Explore how modern cloud systems handle large media uploads: Presigned S3 URLs, direct multipart streams, Kafka event queues, worker image processing, and global CDN caching.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-atlas-bg0/80 px-3.5 py-2 rounded-xl border border-atlas-muted/20 text-xs font-mono">
          <span className="text-atlas-muted">Stage</span>
          <span className="text-blue-400 font-bold">{currentStageIndex + 1} / {STAGES.length}</span>
        </div>
      </div>

      {/* Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {STAGES.map((s, idx) => {
          const isActive = idx === currentStageIndex
          const isPassed = idx < currentStageIndex
          return (
            <button
              key={s.id}
              onClick={() => setCurrentStageIndex(idx)}
              className={cn(
                'p-3 rounded-xl border text-left transition relative font-mono text-xs space-y-1',
                isActive
                  ? 'border-blue-400 bg-blue-500/15 shadow-md ring-1 ring-blue-400'
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

      {/* Stage Graphic */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-6 space-y-6 min-h-[380px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <activeStage.icon size={18} className={activeStage.color} />
                <h3 className="text-base font-bold text-atlas-text">{activeStage.title}</h3>
              </div>
              <span className="text-xs font-mono text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                {activeStage.tech}
              </span>
            </div>

            <div className="p-6 bg-atlas-bg0/80 rounded-2xl border border-atlas-muted/20 space-y-4">
              <div className="font-mono text-xs text-atlas-muted font-bold uppercase tracking-wider">
                Cloud Pipeline Protocol Execution
              </div>
              <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 font-mono text-xs text-blue-300 flex items-center gap-2">
                <Zap size={14} className="text-blue-400 flex-shrink-0" />
                <span>{activeStage.packet}</span>
              </div>
              <div className="space-y-2 pt-2">
                {activeStage.details.map((d, i) => (
                  <div key={i} className="text-xs font-mono text-atlas-text/90 flex items-start gap-2">
                    <ArrowRight size={13} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-atlas-muted/15">
              <button
                onClick={() => setCurrentStageIndex(prev => Math.max(0, prev - 1))}
                disabled={currentStageIndex === 0}
                className="flex items-center gap-1.5 rounded-lg bg-atlas-elev hover:bg-atlas-bg0 border border-atlas-muted/20 px-3.5 py-1.5 text-xs font-medium text-atlas-text transition disabled:opacity-40"
              >
                <ArrowLeft size={13} /> Previous Stage
              </button>
              <button
                onClick={() => setCurrentStageIndex(prev => Math.min(STAGES.length - 1, prev + 1))}
                disabled={currentStageIndex === STAGES.length - 1}
                className="flex items-center gap-1.5 rounded-lg bg-atlas-brand hover:bg-atlas-brand/90 text-white px-4 py-1.5 text-xs font-bold transition shadow disabled:opacity-40"
              >
                Next Stage <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Right 4 cols */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-4">
            <h4 className="text-sm font-bold text-atlas-text font-sans">High-Scale Architecture Notes</h4>
            <div className="space-y-2 text-xs text-atlas-muted leading-relaxed">
              <p>
                Direct-to-S3 presigned URLs offload gigabytes of file upload bandwidth from application compute servers, preventing memory exhaustion and starvation of API request threads.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
