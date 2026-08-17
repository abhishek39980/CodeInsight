import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Database,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Layers,
  Zap,
  HardDrive,
  Lock
} from 'lucide-react'
import { cn } from '../../utils/cn'

const STAGES = [
  {
    id: 'sql-parse',
    title: 'Stage 1: SQL Lexing & Abstract Syntax Tree (AST)',
    subtitle: 'Lexer converts raw SQL text into tokens and grammar AST tree',
    tech: 'Lexer / Parser · PostgreSQL Gram.y',
    icon: Database,
    color: 'text-amber-400',
    details: [
      '1. Client driver sends: "SELECT id, email FROM users WHERE age > 21 ORDER BY id LIMIT 10;"',
      '2. Lexer splits query into tokens: [SELECT, IDENT("id"), COMMA, IDENT("email"), FROM, ...]',
      '3. Parser validates grammar rules and generates Abstract Syntax Tree (AST).'
    ],
    packet: 'AST: SelectStmt { targetList: [id, email], fromClause: [users], whereClause: (age > 21) }'
  },
  {
    id: 'query-optimizer',
    title: 'Stage 2: Cost-Based Query Optimizer (CBO)',
    subtitle: 'Generating candidate execution plans and picking lowest estimated disk page I/O cost',
    tech: 'Cost Model · Table Statistics pg_statistic',
    icon: Cpu,
    color: 'text-yellow-400',
    details: [
      '1. Optimizer inspects table row counts and histograms in pg_statistic.',
      '2. Compares Plan A: Sequential Scan (Cost: 450.00) vs Plan B: B-Tree Index Scan on idx_users_age (Cost: 12.40).',
      '3. Selects Index Scan Plan as lowest cost execution graph.'
    ],
    packet: 'Selected Plan: Index Scan using idx_users_age on users (cost=0.28..12.40 rows=10)'
  },
  {
    id: 'lock-manager',
    title: 'Stage 3: Lock Manager & MVCC Transaction Snapshot',
    subtitle: 'Acquiring table AccessShareLock and snapshotting xmin/xmax transaction IDs',
    tech: 'MVCC Snapshot · Row-level 2PL Locks',
    icon: Lock,
    color: 'text-rose-400',
    details: [
      '1. Acquires AccessShareLock on "users" table to prevent concurrent DDL schema drops.',
      '2. Generates Multi-Version Concurrency Control (MVCC) snapshot: Snapshot(10482:10482:).',
      '3. Guarantees non-blocking read: Readers never block Writers, Writers never block Readers!'
    ],
    packet: 'MVCC Snapshot ID: 10482 · Isolation: Read Committed'
  },
  {
    id: 'buffer-pool',
    title: 'Stage 4: Shared Buffer Pool & Disk Page Search',
    subtitle: 'Checking in-memory 8KB shared RAM cache before falling back to disk reads',
    tech: 'Shared Buffer Pool (RAM) · 8KB Pages',
    icon: Layers,
    color: 'text-emerald-400',
    details: [
      '1. Storage engine calculates target disk page ID = 418.',
      '2. Hashes page ID to look up in Shared Buffer Pool hash table.',
      '3. Cache HIT: 8KB page frame already resident in RAM buffer! Bypasses physical NVMe disk seek.'
    ],
    packet: 'Buffer Pool: Cache HIT (Page 418) · Latency: 0.04ms'
  },
  {
    id: 'wal-log',
    title: 'Stage 5: Write-Ahead Logging (WAL) & ACID Commit',
    subtitle: 'Writing transaction deltas to sequential append-only WAL before flushing dirty pages',
    tech: 'WAL Disk Log · fsync()',
    icon: HardDrive,
    color: 'text-cyan-400',
    details: [
      '1. (For write transactions) Postgres writes binary delta record to WAL segment in memory.',
      '2. Flushes WAL buffer to physical disk using synchronous fsync() call.',
      '3. ACID Durability guarantee: in the event of power crash, database recovers completely from WAL!'
    ],
    packet: 'WAL Record: LSN 0/1A4B820 written to disk · fsync() SUCCESS'
  },
  {
    id: 'return-result',
    title: 'Stage 6: Tuple Serialization & Driver Streaming',
    subtitle: 'Serializing row records into binary wire protocol and streaming to client',
    tech: 'Postgres Wire Protocol v3.0 · TCP Socket',
    icon: Zap,
    color: 'text-pink-400',
    details: [
      '1. Executor reads 10 matching row tuples from 8KB page frame.',
      '2. Serializes records into DataRow messages (Binary / Text format).',
      '3. Emits CommandComplete ("SELECT 10") and ReadyForQuery frame over TCP socket.'
    ],
    packet: 'DataRow (10 Tuples) ➔ CommandComplete "SELECT 10" ➔ ReadyForQuery'
  }
]

export default function DatabaseQueryJourney() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const activeStage = STAGES[currentStageIndex]

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-atlas-surface via-atlas-elev to-atlas-surface p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Database size={18} className="text-amber-400" />
            <span>Database Storage Engine & Transaction Lifecycle</span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-atlas-text">What Happens When You Execute an SQL Query?</h2>
          <p className="text-xs text-atlas-muted mt-0.5 max-w-2xl">
            Trace the internal lifecycle of an SQL statement in PostgreSQL/MySQL: AST parsing, cost-based optimizer, MVCC snapshots, shared buffer pools, WAL durability, and wire serialization.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-atlas-bg0/80 px-3.5 py-2 rounded-xl border border-atlas-muted/20 text-xs font-mono">
          <span className="text-atlas-muted">Stage</span>
          <span className="text-amber-400 font-bold">{currentStageIndex + 1} / {STAGES.length}</span>
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
                  ? 'border-amber-400 bg-amber-500/15 shadow-md ring-1 ring-amber-400'
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
              <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {activeStage.tech}
              </span>
            </div>

            <div className="p-6 bg-atlas-bg0/80 rounded-2xl border border-atlas-muted/20 space-y-4">
              <div className="font-mono text-xs text-atlas-muted font-bold uppercase tracking-wider">
                Database Engine Internals Execution
              </div>
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 font-mono text-xs text-amber-300 flex items-center gap-2">
                <Zap size={14} className="text-amber-400 flex-shrink-0" />
                <span>{activeStage.packet}</span>
              </div>
              <div className="space-y-2 pt-2">
                {activeStage.details.map((d, i) => (
                  <div key={i} className="text-xs font-mono text-atlas-text/90 flex items-start gap-2">
                    <ArrowRight size={13} className="text-amber-400 mt-0.5 flex-shrink-0" />
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
            <h4 className="text-sm font-bold text-atlas-text font-sans">Storage Engine Principles</h4>
            <div className="space-y-2 text-xs text-atlas-muted leading-relaxed">
              <p>
                <strong>Write-Ahead Logging (WAL)</strong> guarantees ACID Durability by turning random disk writes into sequential disk appends, allowing databases to perform high-frequency transactions safely at scale.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
