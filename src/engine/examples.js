export const supportedLanguages = [
  { id: 'javascript', label: 'JavaScript (ES2024 Native AST)' },
]

export const codeExamples = [
  // ---------------------------------------------------------------------------
  // 1. SORTING ALGORITHMS
  // ---------------------------------------------------------------------------
  {
    id: 'js-merge-sort',
    language: 'javascript',
    title: 'Merge Sort (Recursive)',
    label: 'Merge Sort (Recursive)',
    subtitle: 'O(N log N) divide & conquer array sorting',
    category: 'sorting',
    defaultInput: 'numbers = [38, 27, 43, 3, 9, 82, 10]',
    description: 'Recursively splits an array into halves, sorts sub-arrays, and merges them in O(N log N) time.',
    code: `function merge(left, right) {
  let result = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i = i + 1;
    } else {
      result.push(right[j]);
      j = j + 1;
    }
  }
  while (i < left.length) {
    result.push(left[i]);
    i = i + 1;
  }
  while (j < right.length) {
    result.push(right[j]);
    j = j + 1;
  }
  return result;
}

function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  let mid = Math.floor(arr.length / 2);
  let left = arr.slice(0, mid);
  let right = arr.slice(mid);
  return merge(mergeSort(left), mergeSort(right));
}

let numbers = [38, 27, 43, 3, 9, 82, 10];
let sorted = mergeSort(numbers);
console.log(sorted[0]);`,
  },
  {
    id: 'js-quick-sort',
    language: 'javascript',
    title: 'Quick Sort (Lomuto Partition)',
    label: 'Quick Sort (Lomuto Partition)',
    subtitle: 'Pivot partitioning & recursive sorting',
    category: 'sorting',
    defaultInput: 'numbers = [10, 80, 30, 90, 40, 50, 70]',
    description: 'Selects a pivot element, partitions elements into smaller/larger sub-arrays, and recursively sorts.',
    code: `function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  let pivot = arr[arr.length - 1];
  let left = [];
  let right = [];
  for (let i = 0; i < arr.length - 1; i = i + 1) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  let sortedLeft = quickSort(left);
  let sortedRight = quickSort(right);
  return sortedLeft.concat([pivot], sortedRight);
}

let numbers = [10, 80, 30, 90, 40, 50, 70];
let sorted = quickSort(numbers);
console.log(sorted[0]);`,
  },
  {
    id: 'js-insertion-sort',
    language: 'javascript',
    title: 'Insertion Sort',
    subtitle: 'In-place shift & insert sorting',
    category: 'sorting',
    defaultInput: 'arr = [12, 11, 13, 5, 6]',
    description: 'Builds the sorted array one item at a time by shifting larger elements right.',
    code: `let arr = [12, 11, 13, 5, 6];
let n = arr.length;

for (let i = 1; i < n; i = i + 1) {
  let key = arr[i];
  let j = i - 1;
  while (j >= 0 && arr[j] > key) {
    arr[j + 1] = arr[j];
    j = j - 1;
  }
  arr[j + 1] = key;
}

console.log(arr[0]);`,
  },
  {
    id: 'js-selection-sort',
    language: 'javascript',
    title: 'Selection Sort',
    subtitle: 'Minimum element finding & swapping',
    category: 'sorting',
    defaultInput: 'arr = [64, 25, 12, 22, 11]',
    description: 'Repeatedly finds the minimum element from the unsorted section and puts it at the beginning.',
    code: `let arr = [64, 25, 12, 22, 11];
let n = arr.length;

for (let i = 0; i < n - 1; i = i + 1) {
  let minIdx = i;
  for (let j = i + 1; j < n; j = j + 1) {
    if (arr[j] < arr[minIdx]) {
      minIdx = j;
    }
  }
  let temp = arr[i];
  arr[i] = arr[minIdx];
  arr[minIdx] = temp;
}

console.log(arr[0]);`,
  },
  {
    id: 'js-bubble-sort',
    language: 'javascript',
    title: 'Bubble Sort',
    subtitle: 'Nested loop adjacent comparisons & swaps',
    category: 'sorting',
    defaultInput: 'arr = [5, 2, 8, 1, 9]',
    description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if out of order.',
    code: `let arr = [5, 2, 8, 1, 9];
let n = arr.length;
for (let i = 0; i < n - 1; i = i + 1) {
  for (let j = 0; j < n - i - 1; j = j + 1) {
    if (arr[j] > arr[j + 1]) {
      let temp = arr[j];
      arr[j] = arr[j + 1];
      arr[j + 1] = temp;
    }
  }
}
console.log(arr[0]);`,
  },

  // ---------------------------------------------------------------------------
  // 2. SEARCHING & TWO POINTERS
  // ---------------------------------------------------------------------------
  {
    id: 'js-binary-search-iter',
    language: 'javascript',
    title: 'Binary Search (Iterative)',
    label: 'Binary Search (Iterative)',
    subtitle: 'O(log N) divide & conquer search',
    category: 'searching',
    defaultInput: 'arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], target = 23',
    description: 'Halves the search space on each iteration by comparing the target with the middle element.',
    code: `let arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
let target = 23;

let low = 0;
let high = arr.length - 1;
let index = -1;

while (low <= high) {
  let mid = Math.floor((low + high) / 2);
  let val = arr[mid];
  
  if (val === target) {
    index = mid;
    break;
  }
  if (val < target) {
    low = mid + 1;
  } else {
    high = mid - 1;
  }
}

console.log(index);`,
  },
  {
    id: 'js-binary-search-rec',
    language: 'javascript',
    title: 'Binary Search (Recursive)',
    label: 'Binary Search (Recursive)',
    subtitle: 'Recursive call stack divide & conquer',
    category: 'searching',
    defaultInput: 'nums = [1, 3, 5, 7, 9, 11, 13, 15], target = 9',
    description: 'Recursively narrows the search range until the target element is found.',
    code: `function binarySearch(arr, target, low, high) {
  if (low > high) {
    return -1;
  }
  let mid = Math.floor((low + high) / 2);
  if (arr[mid] === target) {
    return mid;
  }
  if (arr[mid] > target) {
    return binarySearch(arr, target, low, mid - 1);
  }
  return binarySearch(arr, target, mid + 1, high);
}

let nums = [1, 3, 5, 7, 9, 11, 13, 15];
let result = binarySearch(nums, 9, 0, nums.length - 1);
console.log(result);`,
  },
  {
    id: 'js-two-sum-pointers',
    language: 'javascript',
    title: 'Two Sum (Two Pointers)',
    label: 'Two Sum (Two Pointers)',
    subtitle: 'O(N) search on sorted array',
    category: 'searching',
    defaultInput: 'numbers = [2, 7, 11, 15], target = 9',
    description: 'Uses left and right pointers moving inwards on a sorted array to find a pair summing to target.',
    code: `let numbers = [2, 7, 11, 15];
let target = 9;

let left = 0;
let right = numbers.length - 1;
let foundPair = [-1, -1];

while (left < right) {
  let currentSum = numbers[left] + numbers[right];
  if (currentSum === target) {
    foundPair = [left, right];
    break;
  }
  if (currentSum < target) {
    left = left + 1;
  } else {
    right = right - 1;
  }
}

console.log(foundPair[0]);
console.log(foundPair[1]);`,
  },
  {
    id: 'js-container-most-water',
    language: 'javascript',
    title: 'Container With Most Water',
    label: 'Container With Most Water',
    subtitle: 'Two-pointer greedy area maximization',
    category: 'searching',
    defaultInput: 'heights = [1, 8, 6, 2, 5, 4, 8, 3, 7]',
    description: 'Finds two lines that together with the x-axis form a container holding the maximum area of water.',
    code: `let heights = [1, 8, 6, 2, 5, 4, 8, 3, 7];
let left = 0;
let right = heights.length - 1;
let maxWater = 0;

while (left < right) {
  let h = heights[left] < heights[right] ? heights[left] : heights[right];
  let width = right - left;
  let area = h * width;
  if (area > maxWater) {
    maxWater = area;
  }
  if (heights[left] < heights[right]) {
    left = left + 1;
  } else {
    right = right - 1;
  }
}

console.log(maxWater);`,
  },
  {
    id: 'js-sliding-window-sum',
    language: 'javascript',
    title: 'Sliding Window Maximum Sum',
    label: 'Sliding Window Maximum Sum',
    subtitle: 'Fixed-size window sliding sum',
    category: 'searching',
    defaultInput: 'arr = [2, 1, 5, 1, 3, 2], k = 3',
    description: 'Calculates the maximum sum of contiguous sub-arrays of fixed size K using a sliding window.',
    code: `let arr = [2, 1, 5, 1, 3, 2];
let k = 3;
let windowSum = 0;
let maxSum = 0;

for (let i = 0; i < k; i = i + 1) {
  windowSum = windowSum + arr[i];
}
maxSum = windowSum;

for (let i = k; i < arr.length; i = i + 1) {
  windowSum = windowSum + arr[i] - arr[i - k];
  if (windowSum > maxSum) {
    maxSum = windowSum;
  }
}

console.log(maxSum);`,
  },

  // ---------------------------------------------------------------------------
  // 3. LINKED LISTS
  // ---------------------------------------------------------------------------
  {
    id: 'js-reverse-linked-list-iter',
    language: 'javascript',
    title: 'Reverse Linked List (Iterative)',
    label: 'Reverse Linked List (Iterative)',
    subtitle: 'In-place pointer reversal loop',
    category: 'linked-lists',
    defaultInput: 'head = { value: 10, next: { value: 20, next: { value: 30, next: null } } }',
    description: 'Reverses a singly linked list in-place using prev, curr, and nextNode pointers.',
    code: `let n3 = { value: 30, next: null };
let n2 = { value: 20, next: n3 };
let head = { value: 10, next: n2 };

let prev = null;
let curr = head;

while (curr !== null) {
  let nextNode = curr.next;
  curr.next = prev;
  prev = curr;
  curr = nextNode;
}

let newHead = prev;
console.log(newHead.value);`,
  },
  {
    id: 'js-reverse-linked-list-rec',
    language: 'javascript',
    title: 'Reverse Linked List (Recursive)',
    label: 'Reverse Linked List (Recursive)',
    subtitle: 'Call stack recursive pointer reversal',
    category: 'linked-lists',
    defaultInput: 'head = { value: 10, next: { value: 20, next: { value: 30, next: null } } }',
    description: 'Recursively walks to the tail of the list and flips link pointers on call stack return.',
    code: `function reverseList(node) {
  if (node === null || node.next === null) {
    return node;
  }
  let newHead = reverseList(node.next);
  node.next.next = node;
  node.next = null;
  return newHead;
}

let n3 = { value: 30, next: null };
let n2 = { value: 20, next: n3 };
let head = { value: 10, next: n2 };

let reversedHead = reverseList(head);
console.log(reversedHead.value);`,
  },
  {
    id: 'js-detect-cycle',
    language: 'javascript',
    title: 'Detect Cycle (Floyd\'s Tortoise & Hare)',
    label: 'Detect Cycle (Floyd\'s Tortoise & Hare)',
    subtitle: 'Two-pointer slow/fast cycle detection',
    category: 'linked-lists',
    defaultInput: 'node4.next = node2 (Cycle created)',
    description: 'Detects if a linked list has a cycle using slow and fast pointers.',
    code: `let node4 = { value: 4, next: null };
let node3 = { value: 3, next: node4 };
let node2 = { value: 2, next: node3 };
let head = { value: 1, next: node2 };
node4.next = node2;

let slow = head;
let fast = head;
let hasCycle = false;

while (fast !== null && fast.next !== null) {
  slow = slow.next;
  fast = fast.next.next;
  if (slow === fast) {
    hasCycle = true;
    break;
  }
}

console.log(hasCycle);`,
  },
  {
    id: 'js-merge-sorted-lists',
    language: 'javascript',
    title: 'Merge Two Sorted Lists',
    label: 'Merge Two Sorted Lists',
    subtitle: 'Recursive sorted list splicing',
    category: 'linked-lists',
    defaultInput: 'l1 = [1,3,5], l2 = [2,4,6]',
    description: 'Combines two sorted linked lists into one single sorted linked list.',
    code: `let l1 = { value: 1, next: { value: 3, next: { value: 5, next: null } } };
let l2 = { value: 2, next: { value: 4, next: { value: 6, next: null } } };

function mergeLists(a, b) {
  if (a === null) return b;
  if (b === null) return a;
  if (a.value < b.value) {
    a.next = mergeLists(a.next, b);
    return a;
  } else {
    b.next = mergeLists(a, b.next);
    return b;
  }
}

let merged = mergeLists(l1, l2);
console.log(merged.value);
console.log(merged.next.value);`,
  },

  // ---------------------------------------------------------------------------
  // 4. TREES & RECURSION
  // ---------------------------------------------------------------------------
  {
    id: 'js-bst-operations',
    language: 'javascript',
    title: 'Binary Search Tree (Insert & Search)',
    label: 'Binary Search Tree (Insert & Search)',
    subtitle: 'Recursive BST node insertion and lookup',
    category: 'trees-recursion',
    defaultInput: 'keys = [50, 30, 70, 20]',
    description: 'Builds a Binary Search Tree by inserting nodes and searches for a specific key.',
    code: `function insert(root, val) {
  if (root === null) {
    return { value: val, left: null, right: null };
  }
  if (val < root.value) {
    root.left = insert(root.left, val);
  } else {
    root.right = insert(root.right, val);
  }
  return root;
}

function search(root, val) {
  if (root === null || root.value === val) {
    return root;
  }
  if (val < root.value) {
    return search(root.left, val);
  }
  return search(root.right, val);
}

let bst = insert(null, 50);
bst = insert(bst, 30);
bst = insert(bst, 70);
bst = insert(bst, 20);

let found = search(bst, 30);
console.log(found.value);`,
  },
  {
    id: 'js-max-depth-tree',
    language: 'javascript',
    title: 'Maximum Depth of Binary Tree',
    label: 'Maximum Depth of Binary Tree',
    subtitle: 'Recursive depth calculation',
    category: 'trees-recursion',
    defaultInput: 'root = { value: 3, left: { value: 9 }, right: { value: 20, left: 15, right: 7 } }',
    description: 'Calculates the height (maximum depth) of a binary tree recursively.',
    code: `let left = { value: 9, left: null, right: null };
let rightRight = { value: 7, left: null, right: null };
let rightLeft = { value: 15, left: null, right: null };
let right = { value: 20, left: rightLeft, right: rightRight };
let root = { value: 3, left: left, right: right };

function maxDepth(node) {
  if (node === null) {
    return 0;
  }
  let leftDepth = maxDepth(node.left);
  let rightDepth = maxDepth(node.right);
  let depth = leftDepth > rightDepth ? leftDepth : rightDepth;
  return depth + 1;
}

console.log(maxDepth(root));`,
  },
  {
    id: 'js-fibonacci-memo',
    language: 'javascript',
    title: 'Fibonacci (Memoized DP)',
    label: 'Fibonacci (Memoized DP)',
    subtitle: 'Top-down memoized call stack',
    category: 'trees-recursion',
    defaultInput: 'n = 6',
    description: 'Computes the Nth Fibonacci number using top-down recursion with array memoization.',
    code: `function fibMemo(n, memo) {
  if (n <= 1) return n;
  if (memo[n] !== undefined) return memo[n];
  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}

let memo = [];
let result = fibMemo(6, memo);
console.log(result);`,
  },
  {
    id: 'js-subsets-backtracking',
    language: 'javascript',
    title: 'Subsets (Backtracking)',
    label: 'Subsets (Backtracking)',
    subtitle: 'Recursive power set generation',
    category: 'trees-recursion',
    defaultInput: 'nums = [1, 2, 3]',
    description: 'Generates all possible subsets (power set) of an array using backtracking recursion.',
    code: `function generateSubsets(nums, index, current, subsets) {
  if (index === nums.length) {
    subsets.push(current.slice());
    return;
  }
  current.push(nums[index]);
  generateSubsets(nums, index + 1, current, subsets);
  current.pop();
  generateSubsets(nums, index + 1, current, subsets);
}

let nums = [1, 2, 3];
let subsets = [];
generateSubsets(nums, 0, [], subsets);
console.log(subsets.length);`,
  },

  // ---------------------------------------------------------------------------
  // 5. GRAPHS & 2D MATRIX / GRID
  // ---------------------------------------------------------------------------
  {
    id: 'js-grid-bfs-path',
    language: 'javascript',
    title: '2D Grid BFS Walk',
    label: '2D Grid BFS Walk',
    subtitle: 'Row/col matrix traversal',
    category: 'graphs-matrix',
    defaultInput: 'grid = 3x3 binary matrix',
    description: 'Traverses a 2D matrix grid using nested loops, updating coordinates and cell values.',
    code: `let grid = [
  [1, 1, 0],
  [1, 1, 0],
  [0, 0, 1]
];

let rows = grid.length;
let cols = grid[0].length;
let visitedCount = 0;

for (let r = 0; r < rows; r = r + 1) {
  for (let c = 0; c < cols; c = c + 1) {
    if (grid[r][c] === 1) {
      visitedCount = visitedCount + 1;
    }
  }
}

console.log(visitedCount);`,
  },
  {
    id: 'js-dfs-graph',
    language: 'javascript',
    title: 'DFS Graph Traversal (Adjacency List)',
    label: 'DFS Graph Traversal (Adjacency List)',
    subtitle: 'Recursive depth-first graph walk',
    category: 'graphs-matrix',
    defaultInput: 'graph = { 0:[1,2], 1:[2], 2:[0,3], 3:[3] }',
    description: 'Traverses an adjacency list graph depth-first, tracking visited vertices.',
    code: `let graph = {
  0: [1, 2],
  1: [2],
  2: [0, 3],
  3: [3]
};

let visited = [false, false, false, false];

function dfs(node) {
  visited[node] = true;
  let neighbors = graph[node];
  for (let i = 0; i < neighbors.length; i = i + 1) {
    let nextNode = neighbors[i];
    if (!visited[nextNode]) {
      dfs(nextNode);
    }
  }
}

dfs(2);
console.log(visited[0]);`,
  },
  {
    id: 'js-grid-dp-minpath',
    language: 'javascript',
    title: 'Minimum Path Sum (2D Grid DP Table)',
    label: 'Minimum Path Sum (2D Grid DP Table)',
    subtitle: '2D dynamic programming grid table fill',
    category: 'graphs-matrix',
    defaultInput: 'grid = [[1,3,1],[1,5,1],[4,2,1]]',
    description: 'Finds a path from top-left to bottom-right minimizing path sum using a 2D DP table.',
    code: `let grid = [
  [1, 3, 1],
  [1, 5, 1],
  [4, 2, 1]
];

let dp = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
];

dp[0][0] = grid[0][0];

for (let c = 1; c < 3; c = c + 1) {
  dp[0][c] = dp[0][c - 1] + grid[0][c];
}

for (let r = 1; r < 3; r = r + 1) {
  dp[r][0] = dp[r - 1][0] + grid[r][0];
}

for (let r = 1; r < 3; r = r + 1) {
  for (let c = 1; c < 3; c = c + 1) {
    let minPrev = dp[r - 1][c] < dp[r][c - 1] ? dp[r - 1][c] : dp[r][c - 1];
    dp[r][c] = grid[r][c] + minPrev;
  }
}

console.log(dp[2][2]);`,
  },

  // ---------------------------------------------------------------------------
  // 6. STACKS & QUEUES
  // ---------------------------------------------------------------------------
  {
    id: 'js-valid-parentheses',
    language: 'javascript',
    title: 'Valid Parentheses (Stack)',
    label: 'Valid Parentheses (Stack)',
    subtitle: 'Stack-based symbol matching',
    category: 'stacks-queues',
    defaultInput: 'expression = "({[]})"',
    description: 'Uses a stack to verify that brackets are opened and closed in the correct order.',
    code: `function isValid(s) {
  let stack = [];
  for (let i = 0; i < s.length; i = i + 1) {
    let char = s[i];
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.length === 0) return false;
      let top = stack.pop();
      if (char === ')' && top !== '(') return false;
      if (char === '}' && top !== '{') return false;
      if (char === ']' && top !== '[') return false;
    }
  }
  return stack.length === 0;
}

let expression = "({[]})";
let valid = isValid(expression);
console.log(valid);`,
  },
  {
    id: 'js-queue-operations',
    language: 'javascript',
    title: 'Queue Operations (FIFO)',
    label: 'Queue Operations (FIFO)',
    subtitle: 'Enqueue push and dequeue shift',
    category: 'stacks-queues',
    defaultInput: 'queue = ["Task1", "Task2", "Task3"]',
    description: 'Simulates a First-In First-Out queue data structure using push and shift array operations.',
    code: `let queue = [];
queue.push("Task1");
queue.push("Task2");
queue.push("Task3");

let first = queue.shift();
let second = queue.shift();

console.log(first);
console.log(queue.length);`,
  },
  {
    id: 'js-min-stack',
    language: 'javascript',
    title: 'Min Stack Implementation',
    label: 'Min Stack Implementation',
    subtitle: 'O(1) minimum value retrieval stack',
    category: 'stacks-queues',
    defaultInput: 'push(5, 2, 8, 1)',
    description: 'Supports push, pop, top, and retrieving the minimum element in O(1) time using an auxiliary stack.',
    code: `let stack = [];
let minStack = [];

function pushVal(val) {
  stack.push(val);
  if (minStack.length === 0 || val <= minStack[minStack.length - 1]) {
    minStack.push(val);
  } else {
    minStack.push(minStack[minStack.length - 1]);
  }
}

function popVal() {
  stack.pop();
  minStack.pop();
}

function getMin() {
  return minStack[minStack.length - 1];
}

pushVal(5);
pushVal(2);
pushVal(8);
pushVal(1);

let min1 = getMin();
popVal();
let min2 = getMin();

console.log(min1);
console.log(min2);`,
  },

  // ---------------------------------------------------------------------------
  // 7. DYNAMIC PROGRAMMING
  // ---------------------------------------------------------------------------
  {
    id: 'js-knapsack-tabulation',
    language: 'javascript',
    title: '0/1 Knapsack (Tabulation)',
    label: '0/1 Knapsack (Tabulation)',
    subtitle: '2D DP table knapsack optimization',
    category: 'dp',
    defaultInput: 'weights = [1, 2, 3], values = [60, 100, 120], capacity = 5',
    description: 'Solves the 0/1 Knapsack problem using a 2D dynamic programming tabulation table.',
    code: `let weights = [1, 2, 3];
let values = [60, 100, 120];
let capacity = 5;
let n = weights.length;

let dp = [];
for (let i = 0; i <= n; i = i + 1) {
  let row = [];
  for (let w = 0; w <= capacity; w = w + 1) {
    row.push(0);
  }
  dp.push(row);
}

for (let i = 1; i <= n; i = i + 1) {
  for (let w = 1; w <= capacity; w = w + 1) {
    if (weights[i - 1] <= w) {
      let include = values[i - 1] + dp[i - 1][w - weights[i - 1]];
      let exclude = dp[i - 1][w];
      dp[i][w] = include > exclude ? include : exclude;
    } else {
      dp[i][w] = dp[i - 1][w];
    }
  }
}

console.log(dp[n][capacity]);`,
  },
  {
    id: 'js-lcs-dp',
    language: 'javascript',
    title: 'Longest Common Subsequence (LCS)',
    label: 'Longest Common Subsequence (LCS)',
    subtitle: '2D DP grid string matching',
    category: 'dp',
    defaultInput: 'text1 = "abcde", text2 = "ace"',
    description: 'Finds the length of the longest subsequence common to two strings using 2D DP tabulation.',
    code: `let text1 = "abcde";
let text2 = "ace";
let m = text1.length;
let n = text2.length;

let dp = [];
for (let i = 0; i <= m; i = i + 1) {
  let row = [];
  for (let j = 0; j <= n; j = j + 1) {
    row.push(0);
  }
  dp.push(row);
}

for (let i = 1; i <= m; i = i + 1) {
  for (let j = 1; j <= n; j = j + 1) {
    if (text1[i - 1] === text2[j - 1]) {
      dp[i][j] = dp[i - 1][j - 1] + 1;
    } else {
      let top = dp[i - 1][j];
      let left = dp[i][j - 1];
      dp[i][j] = top > left ? top : left;
    }
  }
}

console.log(dp[m][n]);`,
  },
  {
    id: 'js-climbing-stairs',
    language: 'javascript',
    title: 'Climbing Stairs (Tabulation)',
    label: 'Climbing Stairs (Tabulation)',
    subtitle: '1D DP tabulation array',
    category: 'dp',
    defaultInput: 'n = 5',
    description: 'Calculates the number of distinct ways to climb N steps when taking 1 or 2 steps at a time.',
    code: `function climbStairs(n) {
  if (n <= 2) return n;
  let dp = [];
  dp[1] = 1;
  dp[2] = 2;
  for (let i = 3; i <= n; i = i + 1) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

let ways = climbStairs(5);
console.log(ways);`,
  },
]

export const compareExamplePair = {
  leftId: 'js-quick-sort',
  rightId: 'js-bubble-sort',
}

export const defaultExampleId = codeExamples[0].id
