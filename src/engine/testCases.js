/**
 * Test cases for the Live Code Judge.
 * fnNames: exact function names used in dsaProblems.js (checked against source).
 * The worker also auto-detects any function if none of these match (fallback).
 * compareMode: 'exact' | 'sort' | 'number'
 */

export const problemTestCases = {
  'two-sum': {
    fnNames: ['twoSumOptimal', 'twoSumBetter', 'twoSumBrute', 'twoSum'],
    compareMode: 'sort',
    cases: [
      { label: 'Basic case',        args: [[2, 7, 11, 15], 9],  expected: [0, 1] },
      { label: 'Middle pair',       args: [[3, 2, 4], 6],       expected: [1, 2] },
      { label: 'Duplicate values',  args: [[3, 3], 6],          expected: [0, 1] },
      { label: 'Negative numbers',  args: [[-3, 4, 3, 90], 0],  expected: [0, 2] },
    ],
  },

  'maximum-subarray': {
    // Actual function names from dsaProblems.js: maxSubArrayBrute / maxSubArrayOptimal
    fnNames: ['maxSubArrayOptimal', 'maxSubArrayBrute', 'maxSubArray', 'maxSubarray', 'maxSubarrayKadane'],
    compareMode: 'exact',
    cases: [
      { label: 'Mixed values',   args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { label: 'Single element', args: [[1]],                              expected: 1 },
      { label: 'All positive',   args: [[5, 4, -1, 7, 8]],                expected: 23 },
      { label: 'All negative',   args: [[-3, -1, -2]],                    expected: -1 },
    ],
  },

  'valid-parentheses': {
    // Actual function names: isValidBrute / isValidOptimal
    fnNames: ['isValidOptimal', 'isValidBrute', 'isValid', 'validParentheses', 'matchBrackets'],
    compareMode: 'exact',
    cases: [
      { label: 'Simple valid',        args: ['()'],     expected: true },
      { label: 'Multiple valid',      args: ['()[]{}'], expected: true },
      { label: 'Simple invalid',      args: ['(]'],     expected: false },
      { label: 'Interleaved invalid', args: ['([)]'],   expected: false },
      { label: 'Nested valid',        args: ['{[]}'],   expected: true },
      { label: 'Empty string',        args: [''],       expected: true },
    ],
  },

  'best-time-to-buy-stock': {
    // Actual function names: maxProfitBrute / maxProfitOptimal
    fnNames: ['maxProfitOptimal', 'maxProfitBrute', 'maxProfit', 'bestTimeToBuyStock'],
    compareMode: 'exact',
    cases: [
      { label: 'Classic case',  args: [[7, 1, 5, 3, 6, 4]], expected: 5 },
      { label: 'Decreasing',    args: [[7, 6, 4, 3, 1]],    expected: 0 },
      { label: 'Single element', args: [[1]],                expected: 0 },
    ],
  },

  'valid-anagram': {
    // Actual function names: isAnagramBrute / isAnagramOptimal
    fnNames: ['isAnagramOptimal', 'isAnagramBrute', 'isAnagram', 'validAnagram'],
    compareMode: 'exact',
    cases: [
      { label: 'Is anagram',       args: ['anagram', 'nagaram'], expected: true },
      { label: 'Not anagram',      args: ['rat', 'car'],         expected: false },
      { label: 'Different length', args: ['ab', 'abc'],          expected: false },
      { label: 'Same chars',       args: ['listen', 'silent'],   expected: true },
    ],
  },

  'contains-duplicate': {
    fnNames: ['containsDuplicateOptimal', 'containsDuplicateBrute', 'containsDuplicate', 'hasDuplicate'],
    compareMode: 'exact',
    cases: [
      { label: 'Has duplicate',  args: [[1, 2, 3, 1]],       expected: true },
      { label: 'No duplicate',   args: [[1, 2, 3, 4]],       expected: false },
      { label: 'Single element', args: [[1]],                 expected: false },
      { label: 'All same',       args: [[1, 1, 1, 3, 3, 4]], expected: true },
    ],
  },

  'binary-search': {
    // Actual function names: searchBrute / searchOptimal
    fnNames: ['searchOptimal', 'searchBrute', 'binarySearch', 'search'],
    compareMode: 'exact',
    cases: [
      { label: 'Found (index 4)',   args: [[-1, 0, 3, 5, 9, 12], 9],  expected: 4 },
      { label: 'Not found',         args: [[-1, 0, 3, 5, 9, 12], 2],  expected: -1 },
      { label: 'Single found',      args: [[5], 5],                    expected: 0 },
      { label: 'Single not found',  args: [[5], 2],                    expected: -1 },
      { label: 'First element',     args: [[1, 3, 5, 7, 9], 1],       expected: 0 },
    ],
  },

  'climbing-stairs': {
    // Actual function names: climbStairsBrute / climbStairsOptimal
    fnNames: ['climbStairsOptimal', 'climbStairsBrute', 'climbStairs', 'climbingStairs'],
    compareMode: 'exact',
    cases: [
      { label: '2 steps',   args: [2],  expected: 2 },
      { label: '3 steps',   args: [3],  expected: 3 },
      { label: '5 steps',   args: [5],  expected: 8 },
      { label: '10 steps',  args: [10], expected: 89 },
    ],
  },

  'product-of-array-except-self': {
    fnNames: ['productExceptSelfOptimal', 'productExceptSelf', 'productOfArray'],
    compareMode: 'exact',
    cases: [
      { label: 'Basic',      args: [[1, 2, 3, 4]],       expected: [24, 12, 8, 6] },
      { label: 'With zero',  args: [[-1, 1, 0, -3, 3]],  expected: [0, 0, 9, 0, 0] },
    ],
  },

  'merge-intervals': {
    fnNames: ['mergeOptimal', 'mergeBrute', 'merge', 'mergeIntervals'],
    compareMode: 'exact',
    cases: [
      { label: 'Overlapping',  args: [[[1,3],[2,6],[8,10],[15,18]]],  expected: [[1,6],[8,10],[15,18]] },
      { label: 'Touch',        args: [[[1,4],[4,5]]],                 expected: [[1,5]] },
      { label: 'No overlap',   args: [[[1,2],[3,4]]],                 expected: [[1,2],[3,4]] },
    ],
  },

  'number-of-islands': {
    // Actual function names: numIslandsWithVisited / numIslandsOptimal
    fnNames: ['numIslandsOptimal', 'numIslandsWithVisited', 'numIslands', 'numberOfIslands'],
    compareMode: 'exact',
    cases: [
      { label: 'Three islands', args: [[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]], expected: 3 },
      { label: 'One island',    args: [[["1","1","1"],["0","1","0"],["1","1","1"]]],                                             expected: 1 },
      { label: 'No islands',    args: [[["0","0","0"],["0","0","0"]]],                                                          expected: 0 },
    ],
  },

  'coin-change': {
    // Actual function names: coinChangeBrute / coinChangeOptimal
    fnNames: ['coinChangeOptimal', 'coinChangeBrute', 'coinChange'],
    compareMode: 'exact',
    cases: [
      { label: 'Standard',     args: [[1, 2, 5], 11],  expected: 3 },
      { label: 'Impossible',   args: [[2], 3],          expected: -1 },
      { label: 'Zero amount',  args: [[1], 0],          expected: 0 },
    ],
  },

  'longest-substring-without-repeating': {
    // Actual function names: lengthOfLongestSubstringBrute / lengthOfLongestSubstringOptimal
    fnNames: ['lengthOfLongestSubstringOptimal', 'lengthOfLongestSubstringBrute', 'lengthOfLongestSubstring', 'longestSubstringWithoutRepeating'],
    compareMode: 'exact',
    cases: [
      { label: 'Mixed',      args: ['abcabcbb'],  expected: 3 },
      { label: 'All same',   args: ['bbbbb'],     expected: 1 },
      { label: 'Classic',    args: ['pwwkew'],    expected: 3 },
      { label: 'Empty',      args: [''],          expected: 0 },
    ],
  },

  'reverse-linked-list': {
    // Actual function names: reverseListBrute / reverseListOptimal
    fnNames: ['reverseListOptimal', 'reverseListBrute', 'reverseList', 'reverseLinkedList'],
    compareMode: 'exact',
    cases: [
      { label: 'Five nodes',   args: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
      { label: 'Two nodes',    args: [[1, 2]],          expected: [2, 1] },
      { label: 'Single node',  args: [[1]],             expected: [1] },
    ],
    wrapper: `
function ListNode(val, next) { this.val = val; this.next = next ?? null; }
function arrayToList(arr) {
  if (!arr || !arr.length) return null;
  const head = new ListNode(arr[0]);
  let cur = head;
  for (let i = 1; i < arr.length; i++) { cur.next = new ListNode(arr[i]); cur = cur.next; }
  return head;
}
function listToArray(head) {
  const out = [];
  while (head) { out.push(head.val); head = head.next; }
  return out;
}`,
    // wrapCall is a function that returns the expression to evaluate
    wrapCall: (fnName, args) =>
      `listToArray(${fnName}(arrayToList(${JSON.stringify(args[0])})))`,
  },

  'find-minimum-in-rotated-array': {
    fnNames: ['findMinOptimal', 'findMinBrute', 'findMin', 'findMinimum'],
    compareMode: 'exact',
    cases: [
      { label: 'Rotated at 3',  args: [[3, 4, 5, 1, 2]],      expected: 1 },
      { label: 'Rotated at 0',  args: [[4, 5, 6, 7, 0, 1, 2]], expected: 0 },
      { label: 'No rotation',   args: [[11, 13, 15, 17]],      expected: 11 },
    ],
  },
}
