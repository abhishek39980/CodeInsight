import { describe, it, expect } from 'vitest'
import { simulateExecution } from '../executor.js'

describe('AST Tree-Walk Interpreter (executor.js)', () => {
  it('correctly parses and evaluates JavaScript loop accumulation', () => {
    const code = `
      let total = 0;
      for (let i = 1; i <= 5; i = i + 1) {
        total = total + i;
      }
    `
    const res = simulateExecution(code, 'javascript')
    expect(res.ok).toBe(true)
    expect(res.steps.length).toBeGreaterThan(5)

    const finalStep = res.steps[res.steps.length - 1]
    const totalVar = finalStep.callStack[0].vars.find((v) => v.name === 'total')
    expect(totalVar.value).toBe('15')
  })

  it('enforces infinite loop step threshold cap safeguard (max 1000 steps)', () => {
    const infiniteCode = `
      let i = 0;
      while (true) {
        i = i + 1;
      }
    `
    const res = simulateExecution(infiniteCode, 'javascript')
    expect(res.ok).toBe(false)
    expect(res.error).toContain('Loop step limit reached')
  })

  it('enforces maximum recursion depth cap safeguard (max 100 frames)', () => {
    const deepRecursionCode = `
      function overflow(n) {
        return overflow(n + 1);
      }
      overflow(1);
    `
    const res = simulateExecution(deepRecursionCode, 'javascript')
    expect(res.ok).toBe(false)
    expect(res.error).toContain('Maximum recursion depth exceeded')
  })
})
