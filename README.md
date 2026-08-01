# CodeInsight — Interactive Visual DSA Learning & Optimization Platform

CodeInsight is a modern, visually appealing **DSA Algorithm Learning Platform** designed to help engineers and students master canonical Data Structures and Algorithms visually.

The platform focuses on teaching:
- **How** an algorithm works step-by-step
- **Why** it works correctly
- **Where** time & space complexity come from via visual growth models
- **How** to optimize from brute force ➔ intermediate ➔ optimal interview solution
- **When** to recognize algorithmic patterns in technical coding interviews

> **Live Demo:** [codeinsight.vercel.app](https://codeinsight.vercel.app)

---

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| **UI Framework** | React 19.2.4 |
| **Build Tool** | Vite 8.0.0 |
| **Code Editor** | Monaco Editor (`@monaco-editor/react` v4.7.0) |
| **Styling** | Tailwind CSS v3.4 + PostCSS (Glassmorphism & dark mode) |
| **Animations** | Framer Motion v12.37.0 |
| **Icons** | Lucide React v0.577.0 |
| **Testing** | Vitest v4.1.10 |

---

## ✨ Key Features & Vision

### 🌟 1. Comprehensive Problem Catalog (~100 Canonical Problems across 24 Categories)
Structured interactive interview problems categorized across:
- **Arrays & Strings:** Two Sum, Best Time to Buy/Sell Stock, Maximum Subarray (Kadane's), Valid Anagram, etc.
- **Sliding Window & Two Pointers:** Longest Substring Without Repeating Characters, Container With Most Water.
- **Binary Search & Sorting:** Monotonic Search Space Bisection, Merge Sort, Quick Sort, Insertion Sort, Selection Sort, Bubble Sort.
- **Linked Lists & Trees:** In-place Pointer Reversal, Cycle Detection (Floyd's), Binary Search Trees, LCA.
- **Stacks & Queues:** LIFO Bracket Matching (Valid Parentheses), Min Stack, Monotonic Stacks.
- **Dynamic Programming & Graphs:** 1D/2D Tabulation (Climbing Stairs, Knapsack, LCS), Number of Islands (Grid Flood Fill DFS/BFS).

---

### 🎬 2. Algorithm Visualizer & Learning Mode
- **Interactive Visual Canvas:** Watch array elements, pointers, and variables update smoothly in real time.
- **Learning Mode Coach:** Continuous human-readable explanation of **WHY** each step works (e.g., *"Why we move the left pointer"*, *"Why the complement was found in O(1) time"*).
- **Interactive Monaco Editor:** Read, modify, and test optimal JavaScript (ES2024) solutions with live input editing.

---

### 💡 3. Optimization Coach & Pattern Recognition
- **Brute Force ➔ Better ➔ Optimal Progression:** Every problem includes complete explanations, code, time/space complexity, pros, and cons for each approach.
- **Optimization Coach:** Automatically explains **WHY** the brute force approach is slow (e.g., $O(N^2)$ nested loops) and visually demonstrates the key insight that transforms it into the optimal solution (e.g., $O(N)$ HashMap complement lookup or $O(N)$ Kadane scan).
- **Pattern Recognition Coach:** Identifies the algorithmic pattern used (Sliding Window, Two Pointers, Hashing, Divide & Conquer, Dynamic Programming) and teaches **WHEN** to apply it in interviews.

---

### 📈 4. Visual Complexity & Space Coach
- **Time Complexity Visualizer:** Animated visual breakdowns showing why $N \times N \to O(N^2)$, why Binary Search halving $N \to N/2 \to \log N$, and Merge Sort recurrence trees.
- **Space Complexity Visualizer:** Tracks auxiliary memory allocations (HashMaps, recursion call stacks, visited arrays) with memory growth curves.

---

### ⚔️ 5. Side-by-Side Solution Comparison
- Split-screen comparison of Brute Force vs. Optimal solutions.
- Compares simulated operation counts, memory usage, and structural tradeoffs side by side.

---

### 📊 6. Telemetry & Complexity Dashboard
- Real-time counting of primitive DSA operations:
  - **Comparisons** (`==`, `<`, `>`)
  - **Assignments & Writes**
  - **HashMap / Set Lookups**
  - **Maximum Call Stack Depth**

---

## 🚀 Local Development & Setup

```bash
# Clone the repository
git clone https://github.com/abhishek39980/CodeInsight.git
cd CodeInsight

# Install dependencies
npm install

# Start local development server (http://localhost:5173 or 3000)
npm run dev

# Run Vitest test suite
npm run test

# Build production bundle
npm run build
```

---

## 🎯 Designed for Technical Interview Preparation

CodeInsight bridges the gap between static code solutions and intuitive visual understanding. Every feature is crafted to make Data Structures and Algorithms intuitive, visual, and memorable.
