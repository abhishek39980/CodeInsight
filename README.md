# CodeInsight — Interactive Visual DSA Learning & Optimization Platform

CodeInsight is a modern, visually clean **DSA Algorithm Learning Platform** designed to help engineers and students master Data Structures and Algorithms visually.

The platform focuses on:
- **Interactive Visualizations:** Graph, Tree, Linked List, and Array state animations
- **Live Code Judge:** Isolated Web Worker test runner for JavaScript and Piston API for multi-language execution
- **Pattern Optimization:** Step-by-step progression from Brute Force ➔ Optimal solutions
- **Progress Tracking:** Local persistence for XP, daily streaks, bookmarks, and solved status
- **Minimal & Performant:** Fast React 19 SPA powered by Vite, React Router v7, Zustand, and Tailwind CSS

---

## Tech Stack

| Component | Technology |
|---|---|
| **Framework & Router** | React 19.2 + React Router v7 |
| **Build & PWA** | Vite 8.0 + `vite-plugin-pwa` |
| **State Management** | Zustand 5.0 (localStorage persistence) |
| **Code Editor** | Monaco Editor (`@monaco-editor/react`) |
| **Judge & Worker Engine** | Web Worker JS Runner + Piston API |
| **Search** | Fuse.js (Fuzzy search) |
| **Styling & Motion** | Tailwind CSS + Framer Motion |
| **Icons** | Lucide React |

---

## Features

### 1. Interactive Visualizers & Canvas
- **Custom Data Structure Renderers:**
  - **Graphs:** BFS/DFS traversal step animations on 8-node graphs.
  - **Trees:** Inorder/Preorder/Postorder traversal on 15-node BSTs.
  - **Linked Lists:** Pointer reversal (`prev`/`curr`) step-by-step animations.
  - **Arrays & Matrices:** Real-time element highlight, swap, and comparison states.
- **Learning Mode Coach:** Real-time explanations explaining **WHY** each algorithmic step occurs.

### 2. Live Code Judge
- **JavaScript Web Worker:** Sandboxed browser execution against hidden test suites with zero DOM access and 5s timeout protection.
- **Custom Test Cases:** Add and run your own inputs directly in the editor.
- **Multi-Language Support (Piston API):** Write and execute solutions in **Python**, **Java**, **C++**, **TypeScript**, and **Go**.

### 3. Catalog & Fuzzy Search
- **24 Categories & ~100 Problems:** Arrays, Two Pointers, Sliding Window, Binary Search, Linked Lists, Trees, Graphs, Dynamic Programming, and System Design patterns.
- **Fuse.js Search:** Fast fuzzy search across problem titles, tags, and descriptions.
- **Daily Challenge:** Date-seeded daily challenge system.

### 4. Progress & Persistence
- **Progress Dashboard (`/progress`):** Track solved problems, current daily streak, XP level progression, and bookmarked problems across sessions using Zustand `localStorage` persistence.

### 5. Multi-View Coaching & Analysis
- **Optimization Coach:** Explains why brute force solutions bottleneck and shows the key transformation to optimal time complexities.
- **Visual Complexity & Space Coach:** Time recurrence visualizer and auxiliary space allocation curves.
- **Side-by-Side Solution Comparison:** Compare Brute Force vs. Optimal code, operation counts, and memory usage.

---

## Local Development Setup

```bash
# Clone the repository
git clone https://github.com/abhishek39980/CodeInsight.git
cd CodeInsight

# Install dependencies
npm install

# Start development server
npm run dev

# Build production & PWA bundle
npm run build
```

---

## License

MIT
