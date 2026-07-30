import { describe, it, expect } from 'vitest'
import { simulateExecution } from '../executor.js'

describe('Memory Reachability & GC Engine (runtime.js)', () => {
  it('correctly tracks active heap allocations reachable from call stack', () => {
    const code = `
      let obj1 = { val: 10 };
      let obj2 = { val: 20 };
      obj1 = null;
    `
    const res = simulateExecution(code, 'javascript')
    expect(res.ok).toBe(true)

    const finalStep = res.steps[res.steps.length - 1]
    expect(finalStep.heap.length).toBeGreaterThan(0)
  })
})
