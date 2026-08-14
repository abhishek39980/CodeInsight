/**
 * codeRunner.worker.js
 * Runs user's JavaScript code in an isolated Web Worker against test cases.
 * Tries specified function names first, then auto-detects any declared function as fallback.
 */

/* global self */

function safeCompare(actual, expected, mode) {
  try {
    if (mode === 'sort') {
      const sortArr = (a) => Array.isArray(a) ? [...a].sort((x, y) => (x < y ? -1 : x > y ? 1 : 0)) : a
      return JSON.stringify(sortArr(actual)) === JSON.stringify(sortArr(expected))
    }
    if (mode === 'number') {
      return Math.abs(Number(actual) - Number(expected)) < 1e-9
    }
    return JSON.stringify(actual) === JSON.stringify(expected)
  } catch {
    return false
  }
}

/**
 * Try to find a callable function in the code.
 * 1. First tries each name in fnNames.
 * 2. Falls back to extracting the first function declaration from the code.
 */
function extractFunction(code, fnNames, wrapper) {
  const fullCode = (wrapper || '') + '\n' + code

  // 1. Try specified names
  for (const name of fnNames) {
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(`${fullCode}\nif (typeof ${name} === 'function') return ${name}; return null;`)()
      if (typeof fn === 'function') return { fn, foundName: name }
    } catch {
      // try next
    }
  }

  // 2. Auto-detect: find all function declarations in the code with regex
  const funcNames = []
  // function name() / async function name()
  const declMatches = [...code.matchAll(/(?:async\s+)?function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g)]
  declMatches.forEach(m => funcNames.push(m[1]))
  // const name = function / const name = () =>
  const constMatches = [...code.matchAll(/(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s+)?(?:function|\(|[a-zA-Z_$])/g)]
  constMatches.forEach(m => funcNames.push(m[1]))

  // Deduplicate and filter out helpers (inner functions nested inside others)
  const uniqueNames = [...new Set(funcNames)]

  for (const name of uniqueNames) {
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(`${fullCode}\nif (typeof ${name} === 'function') return ${name}; return null;`)()
      if (typeof fn === 'function') return { fn, foundName: name }
    } catch {
      // skip
    }
  }

  return null
}

self.onmessage = function (e) {
  const { code, testCases, fnNames, compareMode, wrapper, wrapCallTemplates } = e.data

  const extracted = extractFunction(code, fnNames || [], wrapper || '')

  if (!extracted) {
    self.postMessage({
      error: `Could not find a function to run. Expected one of: ${(fnNames || []).join(', ')}. Make sure your solution function is declared at the top level.`,
      results: [],
      allPassed: false,
    })
    return
  }

  const { fn, foundName } = extracted

  // Resolve wrapCalls using the actual detected function name
  const wrapCalls = wrapCallTemplates
    ? wrapCallTemplates.map(t => t.replace(/__FOUND_FN__/g, foundName))
    : null

  const results = []

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i]
    const t0 = performance.now()
    try {
      let actual

      if (wrapCalls && wrapCalls[i]) {
        // Linked-list / tree problems that need a wrapper
        // eslint-disable-next-line no-new-func
        actual = new Function(`${wrapper || ''}\n${code}\nreturn (${wrapCalls[i]})`)()
      } else {
        actual = fn(...tc.args)
      }

      const timeMs = Math.round((performance.now() - t0) * 100) / 100
      const passed = safeCompare(actual, tc.expected, compareMode || 'exact')

      results.push({
        label: tc.label,
        args: tc.args,
        expected: tc.expected,
        actual,
        passed,
        timeMs,
        error: null,
      })
    } catch (err) {
      results.push({
        label: tc.label,
        args: tc.args,
        expected: tc.expected,
        actual: null,
        passed: false,
        timeMs: 0,
        error: err.message,
      })
    }
  }

  const allPassed = results.length > 0 && results.every(r => r.passed)

  self.postMessage({ results, allPassed, foundName, error: null })
}

