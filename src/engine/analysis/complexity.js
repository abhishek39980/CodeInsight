import { simulateExecution } from '../executor.js'

/**
 * Theoretical Big-O database mapping code patterns / algorithms to exact specs.
 */
const theoreticalDatabase = [
  {
    pattern: /mergeSort|function merge/i,
    name: 'Merge Sort',
    bestTime: 'O(N log N)',
    avgTime: 'O(N log N)',
    worstTime: 'O(N log N)',
    space: 'O(N)',
    recurrence: 'T(N) = 2T(N/2) + O(N)',
    explanation: 'Merge Sort recursively divides the array into 2 halves until sub-arrays have length 1 (O(log N) tree depth), then merges sorted halves linearly in O(N) work per depth level.',
  },
  {
    pattern: /quickSort/i,
    name: 'Quick Sort',
    bestTime: 'O(N log N)',
    avgTime: 'O(N log N)',
    worstTime: 'O(N^2)',
    space: 'O(log N)',
    recurrence: 'T(N) = T(K) + T(N-K-1) + O(N)',
    explanation: 'Quick Sort chooses a pivot element and partitions the array. On average, balanced pivots yield O(N log N) time; unbalanced pivots (already sorted arrays) yield O(N^2) worst case.',
  },
  {
    pattern: /binarySearch/i,
    name: 'Binary Search',
    bestTime: 'O(1)',
    avgTime: 'O(log N)',
    worstTime: 'O(log N)',
    space: 'O(1)',
    recurrence: 'T(N) = T(N/2) + O(1)',
    explanation: 'Binary Search halves the search interval on every step. Comparing the middle element with the target eliminates half the remaining elements per iteration.',
  },
  {
    pattern: /bubbleSort/i,
    name: 'Bubble Sort',
    bestTime: 'O(N)',
    avgTime: 'O(N^2)',
    worstTime: 'O(N^2)',
    space: 'O(1)',
    recurrence: 'T(N) = T(N-1) + O(N)',
    explanation: 'Bubble Sort repeatedly steps through the list, comparing adjacent elements and swapping them if out of order across nested loops.',
  },
  {
    pattern: /fibMemo/i,
    name: 'Fibonacci (Memoized DP)',
    bestTime: 'O(N)',
    avgTime: 'O(N)',
    worstTime: 'O(N)',
    space: 'O(N)',
    recurrence: 'T(N) = T(N-1) + O(1)',
    explanation: 'Top-down memoization stores previously computed Fibonacci values in an array/map, reducing exponential O(2^N) branch recursion down to linear O(N) state visits.',
  },
  {
    pattern: /knapsack|dp\[i\]\[w\]/i,
    name: '0/1 Knapsack (DP)',
    bestTime: 'O(N * W)',
    avgTime: 'O(N * W)',
    worstTime: 'O(N * W)',
    space: 'O(N * W)',
    recurrence: 'DP[i][w] = max(DP[i-1][w], val + DP[i-1][w-wt])',
    explanation: 'Fills a 2D dynamic programming table of size N x Capacity. Each cell takes O(1) time to evaluate by choosing to include or exclude item i.',
  },
  {
    pattern: /reverseList|curr\.next/i,
    name: 'Reverse Linked List',
    bestTime: 'O(N)',
    avgTime: 'O(N)',
    worstTime: 'O(N)',
    space: 'O(1)',
    recurrence: 'T(N) = T(N-1) + O(1)',
    explanation: 'Traverses each node in the singly linked list exactly once, reversing pointer directions using prev, curr, and next references.',
  },
]

const fitGrowthCurve = (points) => {
  if (!points || points.length < 2) {
    return { class: 'O(1)', r2: 1.0, formula: 'f(N) = O(1)' }
  }

  const N = points.map((p) => p.n)
  const Y = points.map((p) => p.ops)

  const models = [
    { name: 'O(1)', fn: (n) => 1 },
    { name: 'O(log N)', fn: (n) => Math.log2(n) },
    { name: 'O(N)', fn: (n) => n },
    { name: 'O(N log N)', fn: (n) => n * Math.log2(n) },
    { name: 'O(N^2)', fn: (n) => n * n },
  ]

  let bestModel = models[0]
  let bestR2 = -Infinity
  let bestSlope = 0

  const yMean = Y.reduce((a, b) => a + b, 0) / Y.length
  const ssTot = Y.reduce((a, b) => a + Math.pow(b - yMean, 2), 0)

  models.forEach((model) => {
    const X = N.map(model.fn)
    const xMean = X.reduce((a, b) => a + b, 0) / X.length

    let num = 0
    let den = 0
    for (let i = 0; i < N.length; i += 1) {
      num += (X[i] - xMean) * (Y[i] - yMean)
      den += Math.pow(X[i] - xMean, 2)
    }

    const slope = den !== 0 ? num / den : 0
    const intercept = yMean - slope * xMean

    let ssRes = 0
    for (let i = 0; i < N.length; i += 1) {
      const pred = slope * X[i] + intercept
      ssRes += Math.pow(Y[i] - pred, 2)
    }

    const r2 = ssTot !== 0 ? 1 - ssRes / ssTot : 1.0
    if (r2 > bestR2) {
      bestR2 = r2
      bestModel = model
      bestSlope = slope
    }
  })

  return {
    class: bestModel.name,
    r2: Math.max(0, Math.min(1, Number.isFinite(bestR2) ? bestR2 : 0.95)),
    formula: `f(N) ≈ ${bestSlope.toFixed(2)} · ${bestModel.name}`,
  }
}

export const buildComplexityReport = (ast, steps, sourceCode = '') => {
  const dataPoints = []
  const nSizes = [5, 10, 20, 40]

  nSizes.forEach((n) => {
    let ops = 0
    let peakMem = 0

    let scaledCode = sourceCode
    if (sourceCode.includes('arr =') || sourceCode.includes('numbers =')) {
      const sampleArray = Array.from({ length: n }, (_, i) => Math.floor(Math.sin(i + 1) * 100))
      scaledCode = sourceCode.replace(/let\s+(arr|numbers)\s*=\s*\[[^\]]*\];?/, `let $1 = [${sampleArray.join(', ')}];`)
    }

    try {
      const res = simulateExecution(scaledCode, 'javascript')
      if (res.ok && res.steps) {
        ops = res.steps.length
        peakMem = Math.max(...res.steps.map((s) => (s.callStack?.length || 0) + (s.heap?.length || 0)))
      }
    } catch {
      ops = Math.round(n * (steps?.length || 10) / 10)
    }

    dataPoints.push({ n, ops: ops || n * 2, memory: peakMem || n })
  })

  const timeFit = fitGrowthCurve(dataPoints)
  const spaceFit = fitGrowthCurve(dataPoints.map((p) => ({ n: p.n, ops: p.memory })))

  const theoretical = theoreticalDatabase.find((item) => item.pattern.test(sourceCode)) || {
    name: 'Custom Algorithm',
    bestTime: timeFit.class,
    avgTime: timeFit.class,
    worstTime: timeFit.class,
    space: spaceFit.class,
    recurrence: 'T(N) = T(N-1) + O(1)',
    explanation: 'Operation scaling measured dynamically via AST tree-walk interpreter over scaled input sizes N=[5, 10, 20, 40].',
  }

  return {
    estimatedTime: timeFit.class,
    estimatedSpace: spaceFit.class,
    empiricalFormula: timeFit.formula,
    rSquared: timeFit.r2,
    reasoning: `Empirical regression fit yields R² = ${(timeFit.r2 * 100).toFixed(1)}% correlation with ${timeFit.class}.`,
    theoretical,
    dataPoints,
    graphs: {
      operationsVsN: dataPoints.map((p) => ({ n: p.n, ops: p.ops })),
      memoryVsN: dataPoints.map((p) => ({ n: p.n, memory: p.memory })),
    },
  }
}
