# CodeInsight — Visual Code Execution Engine

CodeInsight is a 100% client-side JavaScript execution visualizer that converts source code into step-by-step interactive timelines, AST-driven state snapshots, and empirical Big-O complexity reports.

Built for engineers learning Data Structures & Algorithms (DSA) and for live technical interview preparation.

> **Live Demo:** [codeinsight.vercel.app](https://codeinsight.vercel.app)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **UI Framework** | React 19.2.4 |
| **Build Tool** | Vite 8.0.0 |
| **Code Editor** | Monaco Editor (`@monaco-editor/react` v4.7.0) |
| **AST Parser** | Acorn v8.16.0 + Acorn-Walk v8.3.5 |
| **Styling** | Tailwind CSS v3.4 + PostCSS |
| **Animations** | Framer Motion v12.37.0 |
| **Icons** | Lucide React v0.577.0 |
| **URL Compression** | LZ-String v1.5.0 |
| **Testing** | Vitest v4.1.10 |

---

## ✨ Features

### 🎬 Timeline Execution View
- Step-by-step AST interpreter — every variable declaration, assignment, function call, loop iteration, and return is captured as an immutable snapshot
- Monaco Editor with live syntax highlighting, active line decoration, and **clickable gutter breakpoints**
- Playback controls: Run / Pause / Step Forward / Step Back / Reset with keyboard shortcuts (`Space`, `←`, `→`, `R`)
- Adjustable playback speed (0.25× – 2×)
- **Pinned Variable Watchlist** — pin variables to track step-by-step value progression and mutation deltas

### 📊 Complexity Analysis View
- Theoretical specs per algorithm: Best / Average / Worst time, Auxiliary Space, and Recurrence Relation
- Detailed human-readable explanation of _why_ the complexity is what it is
- Empirical growth curve estimated from captured execution steps via least-squares regression
- Supports: Merge Sort, Quick Sort, Binary Search, Bubble Sort, Fibonacci DP, Knapsack DP, and more

### ⚔️ Dual Algorithm Comparison View
- Executes two algorithms (QuickSort vs. BubbleSort by default) lazily in background workers
- Synchronized scrubber to compare operation counts and call stack depth side-by-side
- Line-level active highlighting on both algorithm source panels simultaneously

### 🌳 AST Explorer View
- Interactive syntax tree of the parsed source code
- Click any AST node to jump to the corresponding execution step
- Syncs bidirectionally with the Timeline scrubber

### 🔴 Breakpoints & Watchlist
- Click any line number gutter to toggle a breakpoint — playback auto-pauses when hit
- Type variable names into the Watchlist panel to monitor their live values

---

## 🏗️ Engine Architecture

```text
[Monaco Editor — source code input]
        │
        ▼
[Acorn AST Parser — builds full AST with node locations]
        │
        ▼
[Tree-Walk Interpreter]
  ├─ Supports: var/let/const, if/else, for, while, do-while,
  │            for-of, for-in, switch, break, continue,
  │            functions, closures, recursion, try/catch/finally
  ├─ Step Cap: 1,000 steps max
  └─ Recursion Guard: 100 call frames max
        │
        ▼
[Snapshot Builder]
  ├─ Immutable per-step state: call stack, heap, variable bindings
  └─ Reachability GC: Active / Closure / Unreachable classification
        │
        ▼
[Visual Scenes]
  Timeline │ Dual Comparison │ Complexity Analysis │ AST Explorer
```

---

## 📚 Algorithm Suite (27 Canonical JS Algorithms)

| # | Category | Algorithms |
|---|---|---|
| 1 | **Sorting** | Merge Sort, Quick Sort (Lomuto), Insertion Sort, Selection Sort, Bubble Sort |
| 2 | **Searching & Two Pointers** | Binary Search (Iterative & Recursive), Two Sum, Container With Most Water, Sliding Window Max Sum |
| 3 | **Linked Lists** | Reverse (Iterative & Recursive), Cycle Detection (Floyd's), Merge Two Sorted Lists |
| 4 | **Trees & Recursion** | BST Insert & Search, Max Depth of Binary Tree, Fibonacci (Memoized), Subsets Backtracking |
| 5 | **Graphs & Matrix** | 2D Grid BFS Walk, DFS Graph Traversal, Minimum Path Sum |
| 6 | **Stacks & Queues** | Valid Parentheses, Queue (FIFO), Min Stack |
| 7 | **Dynamic Programming** | 0/1 Knapsack (Tabulation), LCS, Climbing Stairs |

---

## 🚀 Local Setup

### Prerequisites
- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher

### Run Locally

```bash
# Clone the repository
git clone https://github.com/abhishek39980/CodeInsight.git
cd CodeInsight

# Install dependencies
npm install

# Start local development server (http://localhost:5173)
npm run dev

# Run unit tests
npm run test

# Build production bundle
npm run build
```

---

## 🎯 Technical Interview Defense

Three core engineering challenges worth explaining:

### 1. Reachability-Based GC in the AST Interpreter
> *"Instead of relying on browser DevTools, I built a custom mark-and-sweep analyzer in `runtime.js`. During each step, the engine traverses active environment scopes from top-of-stack down to global scope, marks all reachable heap references, detects closures, and flags unreferenced object IDs as garbage-collection candidates in real time."*

### 2. Step-Indexed Immutable Snapshotting
> *"To support reverse stepping without re-running the interpreter, every statement evaluation creates an immutable snapshot of variable bindings, call-stack frames, and heap object states. Structural cloning isolates only mutated references between consecutive steps to keep memory usage bounded."*

### 3. Non-blocking Big-O Estimation
> *"Rather than running 4 separate simulations to build complexity data points (which froze the browser), I rewrote the complexity engine to estimate growth curves from the single captured execution via step-density extrapolation, then apply linear least-squares regression to the synthetic data points. This reduces simulation overhead from 5× down to 1×."*

---

## 🌐 Language Support

- **JavaScript (ES2024):** Fully supported — `var`/`let`/`const`, arrow functions, closures, recursion, `break`/`continue`, `for...of`, `for...in`, `switch`, `try`/`catch`/`finally`, template literals, spread/rest operators.

*Python, C++, and Java stubs are intentionally omitted to guarantee 100% accurate, un-simulated AST state execution.*
