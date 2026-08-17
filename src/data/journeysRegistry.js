/**
 * Central Journeys Registry for CodeInsight
 * Multi-stage, end-to-end interactive systems walkthroughs.
 */

export const TECHNOLOGY_JOURNEYS = [
  {
    id: 'open-website',
    title: 'What Happens When You Open an HTTPS Website?',
    subtitle: 'From typing the URL in the address bar to the final pixel painted on screen.',
    domain: 'Networking & Web Engineering',
    badge: 'Flagship Journey',
    color: 'text-cyan-400',
    borderColor: 'border-cyan-400/30',
    estimatedTime: '8 min interactive walkthrough',
    stages: [
      { id: 'dns', name: '1. DNS Resolution', description: 'Recursive DNS query resolving domain name to IP address through Root, TLD, and Authoritative servers.', tech: 'DNS · UDP 53' },
      { id: 'tcp', name: '2. TCP 3-Way Handshake', description: 'Synchronizing sequence numbers between Client and Server over TCP (SYN, SYN-ACK, ACK).', tech: 'TCP · RFC 793' },
      { id: 'tls', name: '3. TLS 1.3 Cryptographic Handshake', description: 'Certificate verification, Diffie-Hellman key exchange, and establishing an encrypted session channel.', tech: 'TLS 1.3 · AES-GCM' },
      { id: 'http', name: '4. HTTP/2 Request & Reverse Proxy', description: 'Multiplexed binary frame transmission through edge Load Balancers and Cloudflare CDN caches.', tech: 'HTTP/2 · NGINX' },
      { id: 'backend', name: '5. Backend Cache & Database Query', description: 'API routing, Redis cache hit/miss evaluation, and B-Tree index scan on PostgreSQL.', tech: 'Redis · PostgreSQL' },
      { id: 'render', name: '6. Browser DOM & CSSOM Paint', description: 'Parsing HTML tokens, constructing DOM tree, CSS layout calculations, and raster painting.', tech: 'Blink / WebKit' }
    ]
  },
  {
    id: 'ai-inference',
    title: 'What Happens When an AI Chatbot Answers You?',
    subtitle: 'Inside the lifecycle of a modern Large Language Model (LLM) query.',
    domain: 'Artificial Intelligence',
    badge: 'Flagship AI Journey',
    color: 'text-purple-400',
    borderColor: 'border-purple-400/30',
    estimatedTime: '7 min interactive walkthrough',
    stages: [
      { id: 'tokenization', name: '1. Subword Tokenization', description: 'Splitting input text string into token identifiers using Byte-Pair Encoding (BPE).', tech: 'BPE Tokenizer' },
      { id: 'embeddings', name: '2. High-Dimensional Vector Embeddings', description: 'Mapping integer token IDs into dense numerical vector spaces with positional encodings.', tech: 'Embedding Layer' },
      { id: 'rag', name: '3. RAG Retrieval & Vector Search', description: 'Querying Vector Database (HNSW index) using Cosine Similarity to retrieve knowledge context.', tech: 'Vector DB · Cosine Similarity' },
      { id: 'attention', name: '4. Transformer Multi-Head Attention', description: 'Computing Query (Q), Key (K), Value (V) scaled dot-product attention heatmaps across all tokens.', tech: 'Transformer Attention' },
      { id: 'kv-cache', name: '5. KV-Cache & Autoregressive Decoding', description: 'Caching Key-Value vectors in GPU VRAM to avoid redundant O(N^2) calculations during token generation.', tech: 'KV-Cache · GPU VRAM' },
      { id: 'sampling', name: '6. Logits & Top-p / Temperature Sampling', description: 'Softmax probability distribution over vocabulary, selecting next token and streaming back to user.', tech: 'Softmax · Top-p Sampling' }
    ]
  },
  {
    id: 'photo-upload',
    title: 'What Happens When You Upload a Photo?',
    subtitle: 'Asynchronous distributed media ingestion, presigned S3 URLs, queue processing, and CDN distribution.',
    domain: 'Distributed Systems & Cloud',
    badge: 'Media Infrastructure',
    color: 'text-blue-400',
    borderColor: 'border-blue-400/30',
    estimatedTime: '6 min interactive walkthrough',
    stages: [
      { id: 'presigned', name: '1. Presigned S3 URL Generation', description: 'App server authorizes upload and returns signed direct-to-S3 HTTPS URL.', tech: 'AWS S3 · IAM' },
      { id: 'direct-upload', name: '2. Direct Multi-Part Upload', description: 'Browser uploads binary image stream directly to Cloud Object Store bypassing application servers.', tech: 'HTTP PUT · Multipart' },
      { id: 'event-bridge', name: '3. ObjectCreated S3 Event Notification', description: 'S3 publishes event to RabbitMQ / Apache Kafka message queue.', tech: 'Kafka · S3 Event' },
      { id: 'worker-pool', name: '4. Asynchronous Worker Processing', description: 'Worker instances consume queue message, generate thumbnail resolutions, and extract EXIF metadata.', tech: 'Worker Pool · Libvips' },
      { id: 'db-metadata', name: '5. Database Transaction', description: 'Storing processed asset URIs in PostgreSQL media table.', tech: 'PostgreSQL · ACID' },
      { id: 'cdn-cache', name: '6. Edge CDN Invalidation & Caching', description: 'Cloudflare CDN distributes edge cached copies across global PoPs.', tech: 'Cloudflare CDN' }
    ]
  },
  {
    id: 'db-query',
    title: 'What Happens When You Execute an SQL Query?',
    subtitle: 'From SQL text parsing to disk buffer pool and ACID transaction commit.',
    domain: 'Databases & Storage',
    badge: 'Database Internals',
    color: 'text-amber-400',
    borderColor: 'border-amber-400/30',
    estimatedTime: '6 min interactive walkthrough',
    stages: [
      { id: 'sql-parse', name: '1. SQL Lexing & AST Query Parsing', description: 'Parsing raw SQL text into Abstract Syntax Tree syntax nodes.', tech: 'SQL Parser · AST' },
      { id: 'query-optimizer', name: '2. Cost-Based Query Optimizer', description: 'Evaluating relational algebra plans: Sequential Scan vs B-Tree Index Scan.', tech: 'Cost Model · Statistics' },
      { id: 'lock-manager', name: '3. Lock Manager & MVCC Snapshot', description: 'Acquiring table/row intention shared locks and establishing transaction snapshot.', tech: 'MVCC · 2PL Locks' },
      { id: 'buffer-pool', name: '4. Buffer Pool Disk Cache Check', description: 'Looking up 8KB page frame in shared RAM buffer: Cache Hit vs Direct Disk Seek.', tech: 'Shared Buffer Pool' },
      { id: 'wal-log', name: '5. Write-Ahead Logging (WAL)', description: 'Writing immutable transaction delta to append-only WAL disk log before updating dirty memory pages.', tech: 'WAL · fsync()' },
      { id: 'return-result', name: '6. Result Set Tuple Serialization', description: 'Serializing row records into binary wire format and streaming back to client driver.', tech: 'Postgres Wire Protocol' }
    ]
  }
]

export function getJourneyById(journeyId) {
  return TECHNOLOGY_JOURNEYS.find(j => j.id === journeyId)
}
