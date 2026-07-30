# CodeInsight | AST Execution & Memory Visualizer

CodeInsight is a frontend code execution visualizer that converts JavaScript source code into step-by-step visual snapshot timelines, call-stack trees, and reachability-based heap graphs.

Built for engineers learning Data Structures & Algorithms (DSA) and for live technical interviewing.

---

## Core Features

- **Real AST Step-Walk Interpreter:** Parses source code with Acorn and executes statements sequentially, capturing full state snapshots at every line.
- **Reachability-Based Garbage Collection:** Live heap node analysis classifying memory as **Active** (on call stack), **Closure** (scoped environment), or **Unreachable** (garbage collection candidate).
- **Empirical Big-O Complexity:** Measures actual operation counts across scaled input sizes ($N$) and derives Big-O growth curves empirically via least-squares curve fitting.
- **Execution Safeguards:** Enforces an explicit 1,000-step loop cap and a 100-frame recursion stack depth limit to prevent browser freezes.
- **Synchronized Scrubber:** Scrub backward and forward through execution history with hotkey support (`Space`, `Right Arrow`, `Left Arrow`, `R`).
- **Permalink Sharing:** Share execution states, custom inputs, and precise step indices via LZ-string compressed URL hash links.

---

## Architecture

```text
[Monaco Editor / Custom Input]
       │
       ▼
[Acorn AST Engine]
       │
       ▼
[Tree-Walk Interpreter] ──► [Step Threshold (1000 max) & Recursion Safeguards (100 frames)]
       │
       ▼
[Snapshot Builder] ──► [Call Stack + Reachability GC Engine (Active / Closure / Unreachable)]
       │
       ▼
[Visual Scenes: Timeline | Memory Graph | Call Tree | AST | Empirical Complexity | Scopes]
```

---

## Supported Languages

- **JavaScript (ES2024):** Fully supported via native AST parser and tree-walk runtime engine.

*Note: C++, Java, and Python transpilation layers were intentionally omitted to guarantee 100% accurate, un-simulated state execution.*

---

## Local Setup

```bash
git clone https://github.com/abhishek39980/CodeInsight.git
cd CodeInsight
npm install
npm run dev
```

To run unit tests:
```bash
npm run test
```

---

## Technical Interview Defense Brief

When explaining CodeInsight in a technical interview, focus on these three core engineering challenges:

1. **Heap Reachability from Live Call Stack Frames:**
   > *"Instead of relying on browser DevTools, I built a custom mark-and-sweep analyzer in `runtime.js`. During AST step execution, the engine traverses active environment scopes from top-of-stack down to global scope, marks reachable heap references, detects closures, and flags unreferenced object IDs as garbage collection candidates in real time."*

2. **Step-Indexed Immutable Snapshotting:**
   > *"To support reverse stepping without re-running the interpreter, every statement evaluation creates an immutable snapshot of variable bindings, call-stack frames, and heap object states. To optimize memory footprint during deep execution runs, structural cloning isolates only mutated references between consecutive steps."*

3. **Empirical Big-O Analysis via Operation Counting:**
   > *"Rather than using regex pattern matching or static AST loop counting—which breaks easily on complex code—I implemented an empirical execution analyzer. The engine runs the AST against increasing input sizes ($N$), counts primitive runtime operations (reads, writes, comparisons), and applies linear least-squares regression to determine time and space complexity dynamically."*
