export const supportedLanguages = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python (Subset)' },
  { id: 'java', label: 'Java (Subset)' },
  { id: 'cpp', label: 'C++ (Subset)' },
]

export const codeExamples = [
  {
    id: 'js-loop-accumulation',
    language: 'javascript',
    label: 'Loop Accumulation',
    subtitle: 'counter + branch + heatmap',
    category: 'loops',
    code: `let total = 0;
let even = 0;

for (let i = 1; i <= 10; i = i + 1) {
  total = total + i;
  if (i % 2 === 0) {
    even = even + 1;
  }
}

console.log(total);
console.log(even);`,
  },
  {
    id: 'js-rec-factorial',
    language: 'javascript',
    label: 'Recursive Factorial',
    subtitle: 'deep call stack + returns',
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
  {
    id: 'js-rec-fibonacci',
    language: 'javascript',
    label: 'Recursive Fibonacci',
    subtitle: 'branching recursion tree',
    category: 'recursion',
    code: `function fib(n) {
  if (n <= 1) {
    return n;
  }
  return fib(n - 1) + fib(n - 2);
}

console.log(fib(6));`,
  },
  {
    id: 'js-pointer-reference',
    language: 'javascript',
    label: 'Pointer Reference Demo',
    subtitle: 'shared object reference',
    category: 'references',
    code: `let box = { count: 1, note: "seed" };
let alias = box;
alias.count = alias.count + 3;
box.note = "updated";

console.log(box.count);
console.log(alias.note);`,
  },
  {
    id: 'js-object-mutation',
    language: 'javascript',
    label: 'Object Mutation',
    subtitle: 'nested object + array mutation',
    category: 'objects',
    code: `let state = {
  user: { name: "Ada", score: 0 },
  tags: ["new", "active"]
};

state.user.score = state.user.score + 10;
state.tags[1] = "power";

console.log(state.user.score);
console.log(state.tags[1]);`,
  },
  {
    id: 'js-linked-list',
    language: 'javascript',
    label: 'Linked List Traversal',
    subtitle: 'next-pointer walk',
    category: 'structures',
    code: `let n3 = { value: 9, next: null };
let n2 = { value: 4, next: n3 };
let head = { value: 1, next: n2 };

let cursor = head;
let total = 0;

while (cursor !== null) {
  total = total + cursor.value;
  cursor = cursor.next;
}

console.log(total);`,
  },
  {
    id: 'js-binary-tree',
    language: 'javascript',
    label: 'Binary Tree Path Sum',
    subtitle: 'left/right references',
    category: 'structures',
    code: `let left = { value: 4, left: null, right: null };
let right = { value: 9, left: null, right: null };
let root = { value: 7, left: left, right: right };

let sum = root.value + root.left.value + root.right.value;
console.log(sum);`,
  },
  {
    id: 'js-graph-adjacency',
    language: 'javascript',
    label: 'Graph Adjacency Walk',
    subtitle: 'graph-like object structure',
    category: 'structures',
    code: `let graph = {
  A: ["B", "C"],
  B: ["D"],
  C: ["D"],
  D: []
};

let frontier = graph.A;
console.log(frontier[0]);
console.log(frontier[1]);`,
  },
  {
    id: 'py-loop-score',
    language: 'python',
    label: 'Python Loop Score',
    subtitle: 'range + branch',
    category: 'loops',
    code: `score = 0
for i in range(1, 8):
    if i % 2 == 0:
        score = score + i
    else:
        score = score + 1

print(score)`,
  },
  {
    id: 'py-rec-fib',
    language: 'python',
    label: 'Python Fibonacci',
    subtitle: 'recursive stack growth',
    category: 'recursion',
    code: `def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

result = fib(5)
print(result)`,
  },
  {
    id: 'java-factorial',
    language: 'java',
    label: 'Java Factorial',
    subtitle: 'typed recursion subset',
    category: 'recursion',
    code: `int factorial(int n) {
  if (n <= 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

int result = factorial(5);
System.out.println(result);`,
  },
  {
    id: 'cpp-while-energy',
    language: 'cpp',
    label: 'C++ While Energy',
    subtitle: 'while loop convergence',
    category: 'loops',
    code: `int energy = 28;
int ticks = 0;

while (energy > 4) {
  energy = energy - 4;
  ticks = ticks + 1;
}

std::cout << ticks << std::endl;`,
  },
  {
    id: 'js-bubble-sort',
    language: 'javascript',
    label: 'Bubble Sort',
    subtitle: 'array operations + nested loops',
    category: 'algorithms',
    code: `let arr = [5, 2, 8, 1];
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
console.log(arr[3]);`,
  },
  {
    id: 'py-list-sum',
    language: 'python',
    label: 'Python List Sum',
    subtitle: 'accumulating list elements',
    category: 'loops',
    code: `scores = [10, 20, 30, 40]
total = 0
for i in range(0, 4):
    total = total + scores[i]

print(total)`,
  },
  {
    id: 'java-countdown',
    language: 'java',
    label: 'Java Countdown Simulation',
    subtitle: 'simple class instance',
    category: 'objects',
    code: `class Timer {
  int time;
}

Timer t = new Timer();
t.time = 5;

while (t.time > 0) {
  t.time = t.time - 1;
}

System.out.println(t.time);`,
  },
  {
    id: 'cpp-array-sum',
    language: 'cpp',
    label: 'C++ Array Sum',
    subtitle: 'array traversal sum',
    category: 'algorithms',
    code: `int arr[4] = {5, 10, 15, 20};
int sum = 0;

for (int i = 0; i < 4; i = i + 1) {
  sum = sum + arr[i];
}

std::cout << sum << std::endl;`,
  },
  {
    id: 'js-tree-depth',
    language: 'javascript',
    label: 'Tree Depth',
    subtitle: 'recursive tree traversal',
    category: 'recursion',
    code: `let left = { value: 2, left: null, right: null };
let right = { value: 3, left: null, right: null };
let root = { value: 1, left: left, right: right };

function getDepth(node) {
  if (node === null) {
    return 0;
  }
  let depth = 1;
  let leftDepth = getDepth(node.left);
  let rightDepth = getDepth(node.right);
  if (leftDepth > rightDepth) {
    depth = depth + leftDepth;
  } else {
    depth = depth + rightDepth;
  }
  return depth;
}

console.log(getDepth(root));`,
  },
  {
    id: 'py-string-reverse',
    language: 'python',
    label: 'Python String Reverse',
    subtitle: 'string traversal',
    category: 'algorithms',
    code: `text = "hello"
reversed_text = ""
length = 5

for i in range(0, length):
    char = text[length - 1 - i]
    reversed_text = reversed_text + char

print(reversed_text)`,
  },
  {
    id: 'java-fibonacci',
    language: 'java',
    label: 'Java Fibonacci',
    subtitle: 'iterative fibonacci sequence',
    category: 'algorithms',
    code: `int n = 7;
int a = 0;
int b = 1;

for (int i = 2; i <= n; i = i + 1) {
  int next = a + b;
  a = b;
  b = next;
}

System.out.println(b);`,
  },
  {
    id: 'cpp-factorial',
    language: 'cpp',
    label: 'C++ Factorial',
    subtitle: 'iterative factorial product',
    category: 'loops',
    code: `int n = 5;
int result = 1;

for (int i = 1; i <= n; i = i + 1) {
  result = result * i;
}

std::cout << result << std::endl;`,
  },
  {
    id: 'js-binary-search',
    language: 'javascript',
    label: 'Binary Search',
    subtitle: 'divide and conquer algorithm',
    category: 'algorithms',
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
    id: 'py-palindrome',
    language: 'python',
    label: 'Python Palindrome',
    subtitle: 'string matching from ends',
    category: 'algorithms',
    code: `word = "madam"
length = 5
is_palindrome = True

for i in range(0, 2):
    left = word[i]
    right = word[length - 1 - i]
    if left != right:
        is_palindrome = False

print(is_palindrome)`,
  },
  {
    id: 'java-matrix-sum',
    language: 'java',
    label: 'Java Matrix Sum',
    subtitle: 'nested loops on 2D arrays',
    category: 'loops',
    code: `int[][] matrix = {
  {1, 2, 3},
  {4, 5, 6},
  {7, 8, 9}
};

int sum = 0;

for (int i = 0; i < 3; i = i + 1) {
  for (int j = 0; j < 3; j = j + 1) {
    sum = sum + matrix[i][j];
  }
}

System.out.println(sum);`,
  },
  {
    id: 'cpp-max-element',
    language: 'cpp',
    label: 'C++ Max Array Element',
    subtitle: 'finding maximum value',
    category: 'algorithms',
    code: `int arr[5] = {12, 45, 7, 89, 23};
int max_val = arr[0];

for (int i = 1; i < 5; i = i + 1) {
  if (arr[i] > max_val) {
    max_val = arr[i];
  }
}

std::cout << max_val << std::endl;`,
  },
  {
    id: 'js-selection-sort',
    language: 'javascript',
    label: 'Selection Sort',
    subtitle: 'finding minimum and swapping',
    category: 'algorithms',
    code: `let arr = [29, 10, 14, 37, 13];
let n = arr.length;

for (let i = 0; i < n - 1; i = i + 1) {
  let min_idx = i;
  for (let j = i + 1; j < n; j = j + 1) {
    if (arr[j] < arr[min_idx]) {
      min_idx = j;
    }
  }
  let temp = arr[i];
  arr[i] = arr[min_idx];
  arr[min_idx] = temp;
}

console.log(arr[0]);
console.log(arr[n - 1]);`,
  },
  {
    id: 'py-list-reverse',
    language: 'python',
    label: 'Python List Reversal',
    subtitle: 'in-place array reversal',
    category: 'algorithms',
    code: `items = [1, 2, 3, 4, 5]
n = 5
half = int(n / 2)

for i in range(0, half):
    temp = items[i]
    items[i] = items[n - 1 - i]
    items[n - 1 - i] = temp

print(items[0])
print(items[4])`,
  },
  {
    id: 'java-prime-check',
    language: 'java',
    label: 'Java Prime Check',
    subtitle: 'testing exact divisors',
    category: 'algorithms',
    code: `int num = 29;
boolean isPrime = true;

for (int i = 2; i < num; i = i + 1) {
  if (num % i == 0) {
    isPrime = false;
    break;
  }
}

System.out.println(isPrime);`,
  },
  {
    id: 'cpp-min-element',
    language: 'cpp',
    label: 'C++ Min Array Element',
    subtitle: 'finding minimum value',
    category: 'algorithms',
    code: `int arr[5] = {42, 17, 8, 99, 23};
int min_val = arr[0];

for (int i = 1; i < 5; i = i + 1) {
  if (arr[i] < min_val) {
    min_val = arr[i];
  }
}

std::cout << min_val << std::endl;`,
  },
  {
    id: 'js-array-filter',
    language: 'javascript',
    label: 'Array Filter Iteration',
    subtitle: 'collecting matches',
    category: 'loops',
    code: `let source = [5, 12, 8, 130, 44, 2];
let evens = [];
let idx = 0;

for (let i = 0; i < source.length; i = i + 1) {
  if (source[i] % 2 === 0) {
    evens[idx] = source[i];
    idx = idx + 1;
  }
}

console.log(evens.length);`,
  },
  {
    id: 'py-power',
    language: 'python',
    label: 'Python Power Loop',
    subtitle: 'calculating exponent',
    category: 'loops',
    code: `base = 3
exponent = 4
result = 1

for i in range(0, exponent):
    result = result * base

print(result)`,
  },
  {
    id: 'java-digit-sum',
    language: 'java',
    label: 'Java Sum of Digits',
    subtitle: 'while loop math',
    category: 'loops',
    code: `int num = 12345;
int sum = 0;

while (num > 0) {
  int digit = num % 10;
  sum = sum + digit;
  num = num / 10;
}

System.out.println(sum);`,
  },
  {
    id: 'cpp-reverse-array',
    language: 'cpp',
    label: 'C++ Array Reversal',
    subtitle: 'in-place swap',
    category: 'algorithms',
    code: `int arr[5] = {1, 2, 3, 4, 5};
int n = 5;

for (int i = 0; i < n / 2; i = i + 1) {
  int temp = arr[i];
  arr[i] = arr[n - 1 - i];
  arr[n - 1 - i] = temp;
}

std::cout << arr[0] << std::endl;`,
  },
  {
    id: 'js-string-char',
    language: 'javascript',
    label: 'Character Count',
    subtitle: 'string traversal',
    category: 'loops',
    code: `let words = "hello world";
let count = 0;
let target = 'l';

for (let i = 0; i < words.length; i = i + 1) {
  if (words[i] === target) {
    count = count + 1;
  }
}

console.log(count);`,
  },
  {
    id: 'py-two-sum',
    language: 'python',
    label: 'Python Two Sum (Brute)',
    subtitle: 'nested loop search',
    category: 'algorithms',
    code: `nums = [2, 7, 11, 15]
target = 9
idx1 = -1
idx2 = -1

for i in range(0, 4):
    for j in range(i + 1, 4):
        if nums[i] + nums[j] == target:
            idx1 = i
            idx2 = j

print(idx1)
print(idx2)`,
  },
  {
    id: 'java-gcd',
    language: 'java',
    label: 'Java GCD (Euclidean)',
    subtitle: 'while loop modulo',
    category: 'algorithms',
    code: `int a = 48;
int b = 18;

while (b != 0) {
  int temp = b;
  b = a % b;
  a = temp;
}

System.out.println(a);`,
  },
  {
    id: 'cpp-fizzbuzz',
    language: 'cpp',
    label: 'C++ FizzBuzz Logic',
    subtitle: 'branching logic',
    category: 'loops',
    code: `int count = 0;

for (int i = 1; i <= 15; i = i + 1) {
  if (i % 3 == 0 && i % 5 == 0) {
    count = count + 1; // FizzBuzz
  } else if (i % 3 == 0) {
    count = count + 1; // Fizz
  } else if (i % 5 == 0) {
    count = count + 1; // Buzz
  }
}

std::cout << count << std::endl;`,
  },
  {
    id: 'js-object-keys',
    language: 'javascript',
    label: 'Object Navigation',
    subtitle: 'property access',
    category: 'objects',
    code: `let map = { x: 10, y: 20, z: 30 };
let total = 0;

total = total + map.x;
total = total + map.y;
total = total + map.z;
map.w = 40;

console.log(total);`,
  },
  {
    id: 'py-vowel-count',
    language: 'python',
    label: 'Python Vowel Counter',
    subtitle: 'if/else matching',
    category: 'algorithms',
    code: `text = "education"
vowels = 0
length = 9

for i in range(0, length):
    char = text[i]
    if char == 'a' or char == 'e' or char == 'i' or char == 'o' or char == 'u':
        vowels = vowels + 1

print(vowels)`,
  },
  {
    id: 'java-find-index',
    language: 'java',
    label: 'Java Array Find',
    subtitle: 'linear search',
    category: 'algorithms',
    code: `int[] arr = {10, 20, 30, 40, 50};
int target = 30;
int index = -1;

for (int i = 0; i < 5; i = i + 1) {
  if (arr[i] == target) {
    index = i;
    break;
  }
}

System.out.println(index);`,
  },
  {
    id: 'cpp-swap',
    language: 'cpp',
    label: 'C++ Variable Swap',
    subtitle: 'temporary variable swap',
    category: 'references',
    code: `int x = 15;
int y = 25;

int temp = x;
x = y;
y = temp;

std::cout << x << std::endl;
std::cout << y << std::endl;`,
  },
  {
    id: 'js-stack-ds',
    language: 'javascript',
    label: 'Stack (Push & Pop)',
    subtitle: 'LIFO data structure operations',
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
    label: 'Queue (Enqueue & Dequeue)',
    subtitle: 'FIFO data structure operations',
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
    id: 'js-insertion-sort',
    language: 'javascript',
    label: 'Insertion Sort',
    subtitle: 'in-place shift & insert sorting',
    category: 'sorting',
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

console.log(arr[0]);
console.log(arr[4]);`,
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
    subtitle: 'recursive tree node insertion',
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
    id: 'js-graph-bfs',
    language: 'javascript',
    label: 'Graph BFS Traversal',
    subtitle: 'queue-based breadth first walk',
    category: 'recursion-graphs',
    code: `let graph = {
  0: [1, 2],
  1: [2],
  2: [0, 3],
  3: [3]
};

let visited = [false, false, false, false];
let queue = [2];
visited[2] = true;
let count = 0;

while (queue.length > 0) {
  let node = queue.shift();
  count = count + 1;
  let neighbors = graph[node];
  for (let i = 0; i < neighbors.length; i = i + 1) {
    let neighbor = neighbors[i];
    if (!visited[neighbor]) {
      visited[neighbor] = true;
      queue.push(neighbor);
    }
  }
}

console.log(count);`,
  },
  {
    id: 'py-stack-ds',
    language: 'python',
    label: 'Python Stack Operations',
    subtitle: 'append & pop list stack',
    category: 'stacks-queues',
    code: `stack = []
stack.append(10)
stack.append(20)
stack.append(30)

top_item = stack[len(stack) - 1]
popped = stack.pop()

print(top_item)
print(popped)`,
  },
  {
    id: 'py-merge-sort',
    language: 'python',
    label: 'Python Merge Sort',
    subtitle: 'recursive list divide and conquer',
    category: 'sorting',
    code: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    result = []
    i = 0
    j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i = i + 1
        else:
            result.append(right[j])
            j = j + 1
    while i < len(left):
        result.append(left[i])
        i = i + 1
    while j < len(right):
        result.append(right[j])
        j = j + 1
    return result

numbers = [38, 27, 43, 3, 9]
sorted_nums = merge_sort(numbers)
print(sorted_nums[0])
print(sorted_nums[4])`,
  },
  {
    id: 'java-stack-ds',
    language: 'java',
    label: 'Java Stack Simulation',
    subtitle: 'array pointer stack push/pop',
    category: 'stacks-queues',
    code: `int[] stack = new int[5];
int top = -1;

top = top + 1;
stack[top] = 10;
top = top + 1;
stack[top] = 20;

int topValue = stack[top];
top = top - 1;

System.out.println(topValue);
System.out.println(top + 1);`,
  },
]

export const compareExamplePair = {
  leftId: 'js-loop-accumulation',
  rightId: 'js-rec-factorial',
}

export const defaultExampleId = codeExamples[0].id
