export const supportedLanguages = [
  { id: 'javascript', label: 'JavaScript (Native AST Engine)' },
]

export const codeExamples = [
  {
    id: 'js-merge-sort',
    language: 'javascript',
    label: 'Merge Sort',
    subtitle: 'O(N log N) divide & conquer sorting',
    category: 'sorting',
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
console.log(sorted[0]);
console.log(sorted[6]);`,
  },
  {
    id: 'js-quick-sort',
    language: 'javascript',
    label: 'Quick Sort',
    subtitle: 'pivot partition & recursive sorting',
    category: 'sorting',
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
console.log(sorted[0]);
console.log(sorted[6]);`,
  },
  {
    id: 'js-bubble-sort',
    language: 'javascript',
    label: 'Bubble Sort',
    subtitle: 'nested loop adjacent swaps',
    category: 'sorting',
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
console.log(arr[0]);
console.log(arr[4]);`,
  },
  {
    id: 'js-binary-search',
    language: 'javascript',
    label: 'Binary Search',
    subtitle: 'O(log N) divide and conquer',
    category: 'searching',
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
    id: 'js-stack-ds',
    language: 'javascript',
    label: 'Stack Operations',
    subtitle: 'LIFO push and pop',
    category: 'stacks-queues',
    code: `let stack = [];
stack.push(10);
stack.push(20);
stack.push(30);

let topItem = stack[stack.length - 1];
let popped = stack.pop();

console.log(topItem);
console.log(popped);
console.log(stack.length);`,
  },
  {
    id: 'js-queue-ds',
    language: 'javascript',
    label: 'Queue Operations',
    subtitle: 'FIFO push and shift',
    category: 'stacks-queues',
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
    id: 'js-reverse-linked-list',
    language: 'javascript',
    label: 'Reverse Linked List',
    subtitle: 'in-place pointer reversal',
    category: 'linked-lists-trees',
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
console.log(newHead.value);
console.log(newHead.next.value);`,
  },
  {
    id: 'js-bst-insert',
    language: 'javascript',
    label: 'Binary Search Tree Insert',
    subtitle: 'recursive BST node insertion',
    category: 'linked-lists-trees',
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

let bst = insert(null, 50);
bst = insert(bst, 30);
bst = insert(bst, 70);
bst = insert(bst, 20);

console.log(bst.value);
console.log(bst.left.value);
console.log(bst.left.left.value);`,
  },
  {
    id: 'js-rec-factorial',
    language: 'javascript',
    label: 'Recursive Factorial',
    subtitle: 'call stack recursion tree',
    category: 'recursion',
    code: `function factorial(n) {
  if (n <= 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

const result = factorial(5);
console.log(result);`,
  },
]

export const compareExamplePair = {
  leftId: 'js-quick-sort',
  rightId: 'js-bubble-sort',
}

export const defaultExampleId = codeExamples[0].id
