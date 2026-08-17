# CodeInsight — Interactive Visual DSA & System Design Platform

CodeInsight is an advanced, interactive **Data Structures, Algorithms & Distributed System Design Learning Platform** designed to help software engineers, computer science students, and interview candidates master technical concepts visually.

---

## ✨ Key Highlights & Features

### 1. 🏗️ Interactive System Design & Distributed Systems Hub (`/system-design`)
- **LRU Cache Simulation Lab:** Interactive Doubly Linked List (`HEAD <-> Nodes <-> TAIL`) interleaved with a Hash Map for strict $O(1)$ lookups, `GET`/`PUT` step animations, capacity thresholds ($N = 2 \dots 6$), and tail evictions.
- **Rate Limiter Traffic Simulator:** Real-time visual comparison of **Token Bucket** (burst traffic + continuous token refill) vs. **Leaky Bucket** (queue buffering + constant leak drain) with HTTP 200 OK vs. HTTP 429 Too Many Requests backpressure telemetry.
- **Consistent Hashing & Dynamic Sharding:** 360° Circular Hash Ring ($0 \to 2^{32}-1$) with dynamic server node management, Virtual Nodes (Vnodes $1\times, 3\times, 5\times$) load balancing, key routing, and minimal $K/N$ rebalancing upon cluster topology changes.
- **Circuit Breaker Pattern Simulator:** Netflix Hystrix/Resilience4j 3-state machine (**CLOSED** ➔ **OPEN** ➔ **HALF-OPEN**), failure threshold trip controls, recovery cooldown timers, and live gateway telemetry.

---

### 2. 📊 Hardware Memory Profiler & Call Stack Depth Visualizer
- **Call Stack (LIFO Segment):** Active execution frames (`main()`, recursive calls) displaying local variables, parameters, and hex memory pointer addresses (`0x7F01`).
- **Heap Memory Space:** Dynamic heap memory chunk allocations (Arrays, HashMaps, TreeNodes, ListNodes) with byte-size footprints and reference tracking.
- **Interactive Pointer Links:** Hovering over stack reference variables highlights the exact allocated object block on the heap.
- **Mark & Sweep Garbage Collector (GC):** Visual GC reachability sweep identifying unreachable orphan nodes from root pointers and reclaiming heap memory.
- **Call Stack Depth Gauge & Recursion Overflow:** Real-time stack depth meter with an alert warning when recursion exceeds thresholds (`RangeError: Maximum call stack size exceeded`).

---

### 3. 🧩 2D Dynamic Programming Matrix & Cell Trace Lab
- **Canonical Problem Suite:** Step-by-step 2D memoization grids for **0/1 Knapsack**, **Longest Common Subsequence (LCS)**, and **Edit Distance (Levenshtein)**.
- **Predecessor Cell Dependency Tracing:** Hovering over any cell in the matrix illuminates the exact dependent precursor subproblems (e.g. $dp[i-1][w]$ vs $dp[i-1][w - \text{wt}[i]] + \text{val}[i]$) with step-by-step recurrence arithmetic.
- **Optimal Path Backtracking:** Glowing neon path reconstruction tracing optimal decisions from bottom-right back to base cases.

---

### 4. 🎯 Dijkstra & A* Pathfinding Lab
- **Interactive 2D Obstacle Canvas:** Click & drag to draw wall obstacles, erase, move Start ($S$) and Target ($T$) nodes, or paint weighted terrain (swamp cost: 5 vs normal: 1).
- **Informed vs. Uninformed Search:** Real-time visualization comparing **A\* Search** (Manhattan & Euclidean heuristics) against **Dijkstra’s Algorithm**.
- **Live Min-Heap Priority Queue Telemetry:** Live panel displaying active frontier nodes sorted by $f(n) = g(n) + h(n)$ with distance and heuristic scores.

---

### 5. ⚡ Live Sandboxed Code Judge & Multi-Language Execution
- **Isolated JavaScript Web Worker:** Sandboxed browser evaluation against hidden test suites with zero DOM access and infinite-loop timeout protection.
- **Multi-Language Support (Piston API):** Write and execute solutions in **JavaScript**, **Python**, **Java**, **C++**, **TypeScript**, and **Go**.
- **Monaco Code Editor:** VS Code-grade editing experience with syntax highlighting and custom test case runner.

---

### 6. 📚 Curated Problem Catalog & Fast Fuzzy Search
- **24 Algorithm Categories & ~100 Problems:** Arrays, Two Pointers, Sliding Window, Binary Search, Linked Lists, Trees, Graphs, Dynamic Programming, and System Design patterns.
- **Fuse.js Fuzzy Search:** Sub-millisecond search across problem titles, tags, and problem statements.
- **Topic Roadmap:** Structured learning pathways across beginner, intermediate, and advanced DSA topics.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19.2 + React Router v7 |
| **Build Tool & PWA** | Vite 8.0 + `vite-plugin-pwa` |
| **State Management** | Zustand 5.0 (localStorage persistence) |
| **Code Editor** | Monaco Editor (`@monaco-editor/react`) |
| **Execution Engine** | Isolated Web Worker Runner + Piston REST API |
| **Search Engine** | Fuse.js (Client-side Fuzzy Search) |
| **Styling & Motion** | Tailwind CSS + Framer Motion |
| **Icons** | Lucide React |

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/abhishek39980/CodeInsight.git
cd CodeInsight

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Run tests
npm test

# 5. Build for production & PWA bundle
npm run build
```

---

## 📜 License

MIT License © [Abhishek](https://github.com/abhishek39980)
