# CodeInsight: Visual Storytelling Engine & Educational DSA Platform

CodeInsight is a high-fidelity, frontend-only execution visualizer, DSA educational platform, and cyber-engineering simulator designed to visually explain algorithms, memory management, and code execution. Rather than being a simple debugger, it treats code execution as an interactive narrative storytelling experience.

---

## ✨ Features & Functionality

CodeInsight makes abstract code tangible through an array of premium interactive visual scenes:

*   **🎓 Complete DSA Algorithm Suite & Categorized Library:**
    *   Pre-loaded with **50+ algorithmic examples** organized by category (*Stacks & Queues*, *Sorting Algorithms*, *Searching & Math*, *Linked Lists & Trees*, *Graphs & Traversals*).
    *   Includes **Merge Sort, Quick Sort, Bubble Sort, Insertion Sort, Selection Sort, Stack (LIFO), Queue (FIFO), Reverse Linked List, Binary Search Tree (BST), 2D Grid Matrix BFS, and DP Tables**.
    *   Supports execution visualization for **JavaScript, Python, Java, and C++**.
*   **🌐 2D Matrix & Grid Algorithm Canvas:**
    *   Dedicated visual canvas for 2D matrix algorithms (*Grid BFS/DFS Pathfinding*, *Min Path Sum DP Tables*, *Matrix Transformations*).
    *   Highlights cell coordinates $(r, c)$, active head vector pointers, visited cells, and dynamic programming table values.
*   **🧪 Interactive Challenge Arena ("Visual LeetCode"):**
    *   Includes interactive "Fill in the Blanks", "Spot the Bug", and "Predict Next Pointer" challenges.
    *   Real-time streak counter (`Flame`), automated answer verification, and hint explanations.
*   **♻️ Garbage Collection & Memory Lifecycle Visualizer:**
    *   Tracks memory node reachability from active call stack frames:
        *   🟢 **Active**: Reachable from active call stack.
        *   🟡 **Closure**: Reachable via closed-over function scope environments.
        *   🔴 **Unreachable / Garbage**: Unreferenced memory candidates.
    *   Includes a **Trigger GC Sweep** action that evaluates reachability and cleans up floating memory nodes.
*   **🐍 Pyodide WASM Python Runtime Engine:**
    *   Integrates Pyodide (Python in WebAssembly) for browser-side Python execution alongside high-speed AST snapshotting.
*   **🎹 Interactive Keyboard Hotkeys:**
    *   `Space`: Play / Pause execution
    *   `→` (Right Arrow): Step forward
    *   `←` (Left Arrow): Step backward
    *   `R`: Reset execution timeline
*   **Narrative Interactive Timeline:**
    *   **Live Code Timeline:** Monaco-based editor that visually steps through code line-by-line, highlighting active & mutated lines.
    *   **Cinematic Time Rail & Step Scrubber:** Bottom time scrubber allowing you to jump forward, backward, bookmark steps, or replay execution histories.
*   **Deep Memory & Structural Visualizers:**
    *   **Memory Graph & Stack Panels:** Real-time stack & heap visualization with pointer movement animations.
    *   **Call Tree & Recursion Tree:** Visualizes call stack recursion trees for algorithms like Factorial, Fibonacci, Merge Sort, and BST traversals.
    *   **Event Loop:** Watch how asynchronous callbacks, promises, microtasks, and macrotasks are queued and executed.
*   **Advanced Control & Analysis Modes:**
    *   **Compare Mode:** Analyze two different algorithm executions side-by-side.
    *   **Runtime Complexity (Big O) Reports:** Computes dynamic operation counts and time/space complexity estimations.

---

## 🏗️ Project Structure

```text
CodeInsight/
├── index.html                 # Main entry point
├── package.json               # Dependencies (React 19, Vite, Framer Motion, Monaco)
├── tailwind.config.js         # Custom Tailwind theme and Cyber-aesthetic tokens
├── src/
│   ├── main.jsx               # React application mounting
│   ├── App.jsx                # Core application layout, hotkeys & state management 
│   ├── components/            # UI Components & Overlays
│   │   ├── AppShell.jsx       # Layout orchestrator
│   │   ├── EditorPanel.jsx    # Live code editor using Monaco
│   │   ├── atlas/             # Specialized Atlas narrative visualizers
│   │   │   ├── AtlasCommandRail.jsx     # Navigation bar & grouped example selector
│   │   │   ├── AtlasSceneCanvas.jsx     # Scene switcher container
│   │   │   ├── AtlasTimelineScene.jsx   # Live code timeline scene
│   │   │   ├── AtlasMemoryGraphScene.jsx# Memory heap graph & GC sweep
│   │   │   ├── AtlasGridScene.jsx       # 2D Grid & Matrix algorithm canvas
│   │   │   ├── AtlasChallengePanel.jsx  # Interactive Challenge Arena
│   │   │   ├── AtlasCallTreeScene.jsx   # Dynamic recursion call tree
│   │   │   ├── AtlasEventLoopScene.jsx  # JS Event Loop queue state
│   │   │   ├── AtlasComplexityScene.jsx # Complexity Big-O report
│   │   │   ├── AtlasNarrativeDock.jsx   # Step caption narrator & cause chain
│   │   │   └── AtlasTimeRail.jsx        # Cinematic timeline scrubber
│   │   └── visualizers/       # Reusable visualization primitives
│   ├── engine/                # Execution & Simulation Engine
│   │   ├── executor.js        # Core logic generating execution timelines & built-ins
│   │   ├── runtime.js         # Memory runtime and heap manager
│   │   ├── snapshotBuilder.js # Constructs discrete execution steps
│   │   ├── scopeTracker.js    # Manages lexical scopes and closures
│   │   ├── structureDetector.js# Analyzes heap for arrays, trees, linked-lists
│   │   ├── examples.js        # 50+ built-in DSA algorithm examples
│   │   ├── eventLoop.js       # Asynchronous execution emulator
│   │   ├── transpilers.js     # Transpiles Python/Java/C++ to JS AST
│   │   ├── plugins/           # Pyodide WASM runtime plugins
│   │   └── metrics.js         # Computes complexity metrics
│   ├── utils/                 # General utility functions
│   └── hooks/                 # Custom React hooks
└── public/                    # Static assets
```

---

## 🚀 Getting Started

To run CodeInsight locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/abhishek39980/CodeInsight.git
   cd CodeInsight
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Launch the app:**
   Open your browser and navigate to `http://localhost:5173/`. 

---

## 🛠️ Technology Stack

*   **Framework:** React 19 + Vite
*   **Styling:** TailwindCSS (Custom "Atlas" dark theme with glassmorphism) + Framer Motion (Animations)
*   **Icons & Utilities:** Lucide React (`lucide-react`), `clsx`, and `tailwind-merge`
*   **Editor:** Monaco Editor (`@monaco-editor/react`)
*   **Engine Parsing:** Acorn (`acorn`, `acorn-walk`) for generating Abstract Syntax Trees.
*   **WASM Integration:** Pyodide WASM runtime bridge for Python.
