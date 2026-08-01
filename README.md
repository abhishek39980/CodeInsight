# CodeInsight | AST Execution & Memory Visualizer

CodeInsight is a 100% client-side frontend code execution visualizer that converts JavaScript source code into step-by-step visual snapshot timelines, call-stack trees, and reachability-based heap graphs.

Built for engineers learning Data Structures & Algorithms (DSA) and for live technical interviewing.

---

## 🛠️ Tech Stack

Every technology listed below is genuinely integrated into the codebase with evidence in dependencies, configuration, or source code:

- **Core UI & Build Engine:**
  - **React (v19.2.4):** Frontend UI library for rendering application state, scene canvases, and interactive controls (`src/App.jsx`, `src/main.jsx`).
  - **Vite (v8.0.0):** High-performance local development server and production bundler (`vite.config.js`).

- **Code Editing & Parsing:**
  - **Monaco Editor (`@monaco-editor/react` v4.7.0):** VS Code-powered browser editor component for syntax highlighting and code editing (`src/components/EditorPanel.jsx`).
  - **Acorn (v8.16.0) & Acorn-Walk (v8.3.5):** JavaScript Abstract Syntax Tree (AST) parser and walker driving the step-by-step interpreter (`src/engine/executor.js`).

- **Styling, Icons & Animations:**
  - **Tailwind CSS (v3.4.17), PostCSS & Autoprefixer:** Utility-first design system (`tailwind.config.js`, `postcss.config.js`, `src/index.css`).
  - **clsx (v2.1.1) & tailwind-merge (v3.5.0):** Utility for conditional class merging (`src/utils/cn.js`).
  - **Framer Motion (v12.37.0):** Animation library for smooth timeline scrubbing, scene transitions, and UI motion (`src/components/atlas/AtlasTimeRail.jsx`).
  - **Lucide React (v0.577.0):** Icon suite for UI command rails, navigation, and state inspection (`src/components/atlas/AtlasCommandRail.jsx`).

- **Utilities & Testing:**
  - **LZ-String (v1.5.0):** Compression utility for encoding code state and step indices into shareable URL permalinks (`src/utils/permalink.js`).
  - **Vitest (v4.1.10):** Unit testing framework for verifying AST tree-walk evaluation, GC reachability, and complexity curve fitting (`src/engine/__tests__/`).

---

## ✨ Core Features

- **Real AST Step-Walk Interpreter:** Parses JavaScript source code with Acorn and executes statements sequentially, capturing full state snapshots at every line.
- **Reachability-Based Garbage Collection:** Live heap node analysis classifying memory as **Active** (on call stack), **Closure** (scoped environment), or **Unreachable** (garbage collection candidate).
- **Empirical Big-O Complexity Engine:** Measures actual operation counts across scaled input sizes ($N = 5, 10, 20, 40$) and derives Big-O growth curves empirically via least-squares curve fitting.
- **Execution Safeguards:** Enforces an explicit 1,000-step loop cap and a 100-frame recursion stack depth limit to prevent browser freezes.
- **Synchronized Scrubber:** Scrub backward and forward through execution history with keyboard hotkey support (`Space`, `Right Arrow`, `Left Arrow`, `R`).
- **Permalink Sharing:** Share execution states, custom inputs, and precise step indices via LZ-string compressed URL hash links.
- **Comprehensive DSA Suite:** 27 runnable canonical JavaScript algorithms categorized across 7 core categories.

---

## 🏗️ Architecture

```text
[Monaco Editor / Custom Input]
       │
       ▼
[Acorn AST Engine]
       │
       ▼
[Tree-Walk Interpreter] ──► [Step Cap (1000 max) & Recursion Guard (100 frames)]
       │
       ▼
[Snapshot Builder] ──► [Call Stack + Reachability GC Engine (Active / Closure / Unreachable)]
       │
       ▼
[Visual Scenes: Timeline | Memory Graph | Call Tree | AST | Empirical Complexity | Scopes]
```

---

## 🌐 Supported Languages

- **JavaScript (ES2024):** Fully supported via native AST parser and tree-walk interpreter engine.

*Note: C++, Java, and Python transpilation layers were intentionally omitted to guarantee 100% accurate, un-simulated AST state execution without fake regex string replacements.*

---

## 📚 Preset Algorithm Suite (27 Canonical JS Algorithms)

1. **Sorting Algorithms:** Merge Sort, Quick Sort (Lomuto), Insertion Sort, Selection Sort, Bubble Sort
2. **Searching & Two Pointers:** Binary Search (Iterative & Recursive), Two Sum, Container With Most Water, Sliding Window Max Sum
3. **Linked Lists:** Reverse Linked List (Iterative & Recursive), Cycle Detection (Floyd's Tortoise & Hare), Merge Two Sorted Lists
4. **Trees & Recursion:** Binary Search Tree (Insert & Search), Max Depth of Binary Tree, Fibonacci (Memoized DP), Subsets Backtracking
5. **Graphs & 2D Matrix:** 2D Grid BFS Walk, DFS Graph Traversal (Adjacency List), Minimum Path Sum (2D Grid DP Table)
6. **Stacks & Queues:** Valid Parentheses, Queue Operations (FIFO), Min Stack
7. **Dynamic Programming:** 0/1 Knapsack (Tabulation), Longest Common Subsequence (LCS), Climbing Stairs

---

## 🚀 Local Setup & Development

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher

### Installation & Execution

```bash
# Clone the repository
git clone https://github.com/abhishek39980/CodeInsight.git
cd CodeInsight

# Install dependencies
npm install

# Start local development server
npm run dev

# Run Vitest unit test suite
npm run test

# Build production bundle
npm run build
```

---

## 🎯 Technical Interview Defense Brief

When explaining CodeInsight in a technical interview, focus on these three core engineering challenges:

1. **Heap Reachability from Live Call Stack Frames:**
   > *"Instead of relying on browser DevTools, I built a custom mark-and-sweep analyzer in `runtime.js`. During AST step execution, the engine traverses active environment scopes from top-of-stack down to global scope, marks reachable heap references, detects closures, and flags unreferenced object IDs as garbage collection candidates in real time."*

2. **Step-Indexed Immutable Snapshotting:**
   > *"To support reverse stepping without re-running the interpreter, every statement evaluation creates an immutable snapshot of variable bindings, call-stack frames, and heap object states. To optimize memory footprint during deep execution runs, structural cloning isolates only mutated references between consecutive steps."*

3. **Empirical Big-O Analysis via Operation Counting:**
   > *"Rather than using regex pattern matching or static AST loop counting—which breaks easily on complex code—I implemented an empirical execution analyzer. The engine runs the AST against increasing input sizes ($N$), counts primitive runtime operations (reads, writes, comparisons), and applies linear least-squares regression to determine time and space complexity dynamically."*

---

## 📊 Documentation Changes Summary

| Added | Removed | Verified |
| --- | --- | --- |
| Explicit **Tech Stack** section detailing React 19, Vite 8, Monaco Editor, Acorn & Acorn Walk, Framer Motion, Tailwind CSS, Lucide React, LZ-String, and Vitest | Pyodide WASM Python runtime & C++/Java regex transpilers (omitted to guarantee 100% real execution) | **Acorn AST Tree-Walk Interpreter** (`src/engine/executor.js`) |
| Documented 27 canonical algorithms across 7 structured DSA categories in `examples.js` | Static loop-depth Big-O heuristics & arbitrary "Confidence: Low" badges | **Reachability-Based GC Engine** (Active / Closure / Unreachable in `src/engine/runtime.js`) |
| Vitest test suite (`npm run test`) execution instructions and test setup details | Unused backend server frameworks, external databases, or third-party AI APIs | **Empirical Big-O Regression Engine** (`src/engine/analysis/complexity.js`) |
| Environment prerequisites (Node.js & npm version requirements) | Gamified flame streak counters & non-functional scene theater | **LZ-String Compressed Permalinks** (`src/utils/permalink.js`) |
| | | **Monaco Code Editor Component** (`src/components/EditorPanel.jsx`) |
