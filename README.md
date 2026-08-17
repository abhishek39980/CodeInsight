# CodeInsight — Explore How Technology Works

> **A digital laboratory, 3D technology museum, and interactive visual playground for computer science, distributed systems, networking, databases, operating systems, artificial intelligence, and cloud infrastructure.**
>
> *"Don't just explain how technology works. Let the user interact with it and see it work."*

---

## 🌟 What is CodeInsight?

**CodeInsight** transforms complex engineering concepts into interactive, live-state simulations. Instead of reading static articles or looking at passive diagrams, users can:

* **Manipulate System Dials:** Adjust packet rates, cache capacities, neural network weights, CPU time quantums, and cryptographic keys.
* **Observe Internal State Transitions:** Step through AST execution trees, raw hex memory pointers, B-Tree disk page splits, and TCP sliding windows.
* **Inject Chaos Faults:** Crash worker nodes, sever database connections, drop network packets, and watch how distributed resilience mechanisms react in real-time.
* **Explore in 3D WebGL:** Inspect physical CPU-to-RAM memory buses and multi-layer neural network activation volumes.

---

## 🏛️ Core Platform Pillars

```text
                    CODEINSIGHT
                         │
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
       EXPLORE          LABS         JOURNEYS
          │              │              │
    20+ Technology   Individual      End-to-End
       Domains       Experiments      Systems
          │              │              │
          └──────────────┼──────────────┘
                         ↓
                 SYSTEM DESIGNER & CHAOS SIMULATOR
                         │
                         ↓
                CODE EXECUTION ENGINE (AST & MEMORY)
```

---

## 🧭 1. Flagship Multi-Stage Technology Journeys (`/journeys`)

End-to-end interactive pipelines connecting multiple technologies into coherent architectural walkthroughs:

* 🌐 **What Happens When You Open an HTTPS Website? (`/journeys/open-website`)**
  * *Stage 1: DNS Resolution* (Browser $\to$ Resolver $\to$ Root $\to$ TLD $\to$ Authoritative DNS)
  * *Stage 2: TCP 3-Way Handshake* (`SYN` $\to$ `SYN-ACK` $\to$ `ACK` with RFC 793 sequence numbers)
  * *Stage 3: TLS 1.3 Cryptographic Handshake* (ECDHE key exchange & AES-GCM session tunnel)
  * *Stage 4: HTTP/2 Binary Request Multiplexing* (Binary frames through edge load balancers)
  * *Stage 5: Backend Cache & Database Lookup* (Redis cache hit/miss & PostgreSQL B-Tree scan)
  * *Stage 6: Browser Critical Rendering Path* (DOM + CSSOM $\to$ Render Tree $\to$ Layout $\to$ GPU Paint)

* 🤖 **What Happens When an AI Chatbot Answers You? (`/journeys/ai-inference`)**
  * *Stage 1: Subword BPE Tokenization* (Converting strings to token vocabulary IDs)
  * *Stage 2: High-Dimensional Vector Embeddings* (Dense $4096$-dim semantic space + RoPE)
  * *Stage 3: RAG Retrieval & Vector Search* (Cosine similarity search on HNSW vector index)
  * *Stage 4: Transformer Multi-Head Attention* (Scaled dot-product attention heatmaps $QK^T$)
  * *Stage 5: GPU KV-Cache* (VRAM key-value caching eliminating quadratic $O(N^2)$ recomputation)
  * *Stage 6: Autoregressive Token Sampling* (Softmax distribution, Temperature & Top-p streaming)

* ☁️ **What Happens When You Upload a Photo? (`/journeys/photo-upload`)**
  * *Presigned S3 URLs $\to$ Direct Multipart Upload $\to$ Kafka Event Stream $\to$ Worker Pool Resizing $\to$ PostgreSQL Metadata $\to$ Edge CDN Invalidation.*

* 🗄️ **What Happens When You Execute an SQL Query? (`/journeys/db-query`)**
  * *SQL Lexing/AST $\to$ Cost-Based Query Optimizer $\to$ MVCC Locks $\to$ Shared Buffer Pool $\to$ Write-Ahead Log (WAL) $\to$ Postgres Wire Protocol.*

---

## 🔬 2. Interactive Technology Laboratories (`/labs`)

### 🖥️ 3D WebGL Simulations (Three.js)
* **3D CPU Memory & Cache Hierarchy Lab (`/labs/cpu-cache-3d`)**: Interactive 3D WebGL stage visualizing physical Core $\to$ L1 $\to$ L2 $\to$ L3 $\to$ Main RAM buses with real-time nanosecond access latency clocks ($1.1\text{ns} \to 96.5\text{ns}$) and animated data packet spheres.
* **3D Neural Network Volume Lab (`/labs/neural-net-3d`)**: 3D rotating multi-layer perceptron mesh with dynamic synaptic links, forward propagation wave pulses, and tensor dimensions.

### 🌐 Networking & Protocols
* **TCP 3-Way Handshake & Connection Lab (`/labs/tcp-handshake`)**: Bi-directional packet flight negotiating `SYN`, `SYN-ACK`, `ACK` with full 20-byte TCP header inspector.
* **TCP Congestion Control & Sliding Window (`/labs/tcp-congestion`)**: AIMD simulation with Slow Start exponential ramp, Congestion Avoidance ($cwnd$), and packet drop timeout (RTO) sawtooth charts.

### ☁️ Cloud & DevOps Infrastructure
* **Kubernetes Pod Rescheduling & Recovery (`/labs/kubernetes-cluster`)**: Simulates the Kubernetes Reconciliation Loop. Kill worker nodes and watch `kube-controller-manager` and `kube-scheduler` automatically evict and reschedule pods to healthy nodes with zero downtime.
* **Git Commit DAG & Branch Merge Engine (`/labs/git-graph`)**: Interactive Directed Acyclic Graph with commit snapshots, branch pointers (`HEAD`, `main`, `feature`), and 3-way merge commits.

### ☁️ Distributed Systems & Resilience
* **LRU Cache Simulation Lab (`/labs/lru-cache`)**: Doubly Linked List + Hash Map simulator demonstrating strict $O(1)$ access and tail evictions.
* **Rate Limiter Traffic Lab (`/labs/rate-limiter`)**: Real-time Token Bucket & Leaky Bucket traffic simulator with continuous token refill, request bursts, and HTTP 429 backpressure.
* **Consistent Hashing & Dynamic Sharding (`/labs/consistent-hashing`)**: 360° Circular Hash Ring simulating virtual nodes, key routing, and minimal $K/N$ key rebalancing.
* **Circuit Breaker Fault Tolerance (`/labs/circuit-breaker`)**: Netflix Hystrix-style 3-state machine (Closed, Open, Half-Open) with automated recovery timers.

### 🗄️ Databases & Storage
* **B-Tree Database Indexing & Page Splits (`/labs/btree-index`)**: Self-balancing B-Tree index simulator demonstrating disk page traversals, node splitting, and logarithmic key searches.

### ⚙️ Operating Systems & Memory
* **Hardware Memory Profiler (`/labs/memory-profiler`)**: Stack frames, dynamic heap allocations, hex pointer addresses (`0x7F01`), and Mark & Sweep Garbage Collection reachability sweep.
* **CPU Process Scheduler (`/labs/cpu-scheduler`)**: Compares Round Robin (configurable quantum), Shortest Job First (SJF), and FCFS with live Gantt timeline charts.

### 🔐 Cybersecurity & Cryptography
* **Public-Key RSA Cryptography Lab (`/labs/rsa-encryption`)**: Prime key generation ($p, q \to N, \phi, e, d$), live plaintext encryption ($C = M^e \bmod N$), unsecure wire transmission, and private key decryption ($M = C^d \bmod N$).

### 🧠 Computer Science & Algorithms
* **2D Dynamic Programming Grid (`/labs/dynamic-programming`)**: Interactive state matrix with dependency vector tracing and optimal path backtracking for Knapsack, LCS, and Edit Distance.
* **Dijkstra & A\* Pathfinding Lab (`/labs/pathfinding`)**: Interactive obstacle canvas with terrain weights and live Min-Heap priority queue telemetry ($f = g + h$).
* **Algorithm Explorer (`/algorithms`)**: Over 100 core algorithm models preserved with complexity derivations and state step-scrubbing.

---

## 🏗️ 3. Architecture Builder & Chaos Simulator (`/builder`)

An interactive system design studio where users can construct distributed architectures:
* **Components:** Clients, Load Balancer (NGINX), Application Servers, Redis Distributed Cache, PostgreSQL Database, Kafka Queues.
* **Live Traffic Generator:** Real-time request flow with adjustable rates (100 to 5,000 RPS).
* **Chaos Fault Injections:**
  * *Kill App Server #2* $\to$ Load balancer detects health check drops and shifts traffic to Server #1.
  * *Crash Redis Cache* $\to$ 100% cache miss rate floods PostgreSQL with direct disk queries and spikes latency.
  * *Network Jitter* $\to$ Increased transport RTT fills request buffers across API instances.

---

## 💻 4. Code Execution Engine (`/code-engine`)

* **Watch Your Code Execute:** Write or edit JavaScript code and step through Abstract Syntax Tree (AST) execution.
* **Inspect Internal States:** Live Call Stack frames, local variable scope transitions, loop counters, and heap object mutations.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Core Framework** | React 19, React Router v7, Vite 8 |
| **3D WebGL Engine** | Three.js |
| **Styling & Theme** | Tailwind CSS, Custom Atlas Precision Dark Theme |
| **Motion & Physics** | Framer Motion |
| **State Management** | Zustand |
| **Code Editor & AST** | Monaco Editor, Acorn AST Parser, Web Workers |
| **Testing** | Vitest |

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18.0.0 or higher)
* npm (v9.0.0 or higher)

### Installation & Local Run

```bash
# Clone repository
git clone https://github.com/abhishek39980/CodeInsight.git

# Navigate into directory
cd CodeInsight

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to explore the platform.

### Running Tests & Build

```bash
# Run unit test suite
npm test

# Build production bundle
npm run build
```

---

## 📄 License

MIT License. Designed and engineered for exploring the invisible machinery of modern computing.
