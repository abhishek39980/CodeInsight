# CodeInsight: Visual Storytelling Engine for Code

CodeInsight is a high-fidelity, frontend-only execution visualizer and cyber-engineering simulator designed to visually explain algorithms, memory management, and code execution. Rather than being a simple debugger, it treats code execution as a narrative storytelling experience.

## ✨ Features and Functionality

CodeInsight is built to make abstract code tangible with an array of premium, interactive visualizations:

*   **Multi-Language Support & 35+ Built-in Examples:** 
    *   Comes pre-loaded with **37 advanced examples** spanning arrays, recursion, tree traversal, graph traversal, and mathematical algorithms.
    *   Supports execution visualization for **JavaScript, Python, Java, and C++**.
*   **Narrative Interactive Timeline:** 
    *   **Live Code Timeline:** A Monaco-based editor that visually steps through your code, line-by-line, highlighting the active execution path.
    *   **Time Rail & Step Scrubber:** A scrubbable timeline at the bottom allowing you to jump forward, backward, or fast-forward through the entire execution history.
*   **Deep Memory & Structural Visualizers:**
    *   **Memory Graph & Heap/Stack Panels:** Visualizes the heap and stack in real-time. See pointers move and objects mutate as your code runs.
    *   **Call Tree & Recursion Tree:** A dynamic visualization of the call stack, making recursive functions incredibly easy to understand.
    *   **Control Flow & Loop Visualizer:** Traces loops and branches logically, providing clear paths of execution.
    *   **Energy Wires & Glitch Effects:** Visualizes data passing between variables and functions via "Energy Wires" mimicking cyber-engineering UI styles.
    *   **Variable Trend & Trace Panels:** Track exactly how a variable changes over time and inspect its lifecycle.
    *   **Event Loop:** Watch how asynchronous code, promises, and events are queued and executed.
*   **Advanced Control & Modes:**
    *   **Compare Mode:** Analyze two different executions side-by-side.
    *   **Runtime Metrics & Insights:** Generates real-time analysis of runtime performance (time/space complexity) based on execution structures.
    *   **Focus, Narrative, and Beginner Modes:** Toggle the density of information presented. Provides textual context on *why* the code acts the way it does.

## 🏗️ Project Structure

The architecture is entirely frontend-driven, utilizing custom AST parsing, runtime snapshots, and transpilation to simulate code execution without needing a backend environment. 

```text
CodeInsight/
├── index.html                 # Main entry point
├── package.json               # Dependencies (React, Vite, Framer Motion, Monaco)
├── tailwind.config.js         # Custom Tailwind theme and Cyber-aesthetic tokens
├── src/
│   ├── main.jsx               # React application mounting
│   ├── App.jsx                # Core application layout and state management 
│   ├── components/            # UI Components & Overlays
│   │   ├── AppShell.jsx       # Layout orchestrator for the simulation
│   │   ├── EditorPanel.jsx    # Live code editor using Monaco
│   │   ├── ControlBar.jsx     # Execution timeline playback controls
│   │   ├── MemoryPanel.jsx    # Visualizes variables in memory
│   │   ├── StackPanel.jsx     # Visualizes the execution call stack
│   │   ├── HeapPanel.jsx      # Visualizes complex objects/arrays
│   │   ├── ControlFlowPanel.jsx # Traces execution branching & loops
│   │   ├── TimelinePanel.jsx  # History of execution steps
│   │   ├── CompareModePanel.jsx# Side-by-side execution comparison view
│   │   ├── RecursionTree.jsx  # Visualization wrapper for recursive calls
│   │   ├── TracePanel.jsx     # High-level tracking of active code paths
│   │   ├── VariableTrendPanel.jsx # Graphs variable mutation over time
│   │   ├── LineHeatmapPanel.jsx # Visualizes code hot-paths by execution count
│   │   ├── RuntimeMetricsPanel.jsx# Live complexity (Big O) and execution stats
│   │   ├── IntroOverlay.jsx   # Simulator onboarding and splash screen
│   │   ├── EnergyWires.jsx    # Cyber-aesthetic visual connecting elements
│   │   ├── LoopVisualizer.jsx # Tracks iteration depths and details
│   │   ├── Panel.jsx          # Reusable cyber-styled panel wrapper
│   │   ├── atlas/             # Specialized narrative visualizers
│   │   └── visualizers/       # Reusable visualization primitives
│   ├── engine/                # The Execution & Simulation Engine
│   │   ├── executor.js        # Core logic generating execution timelines
│   │   ├── runtime.js         # Emulated application memory and state runtime
│   │   ├── snapshotBuilder.js # Constructs discrete steps of the execution history
│   │   ├── scopeTracker.js    # Manages lexical scopes and closures
│   │   ├── structureDetector.js# Analyzes logic for specific structural patterns
│   │   ├── examples.js        # 37 built-in algorithmic examples across 4 languages
│   │   ├── eventLoop.js       # Asynchronous execution emulator
│   │   ├── transpilers.js     # Light transpilers mapping Python/Java/C++ to JS AST
│   │   └── metrics.js         # Computes execution analytics
│   ├── utils/                 # General utility functions
│   └── hooks/                 # Custom React hooks
└── public/                    # Static assets
```

## 🚀 Getting Started

To run CodeInsight locally and interact with the visualizer:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/CodeInsight.git
   cd CodeInsight
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   *(This project uses Vite, React 19, TailwindCSS, Monaco Editor, and Framer Motion).*

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Launch the app:**
   Open your browser and navigate to `http://localhost:5173/`. 
   
## 🛠️ Technology Stack
*   **Framework:** React 19 + Vite
*   **Styling:** TailwindCSS (Custom "Atlas" dark theme with glassmorphism) + Framer Motion (Animations)
*   **Icons & Utilities:** Lucide React (`lucide-react`), `clsx`, and `tailwind-merge`
*   **Editor:** Monaco Editor (`@monaco-editor/react`)
*   **Engine Parsing:** Acorn (`acorn`, `acorn-walk`) for generating the Abstract Syntax Tree.
