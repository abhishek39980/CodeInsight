import { describe, it, expect } from 'vitest'
import { buildComplexityReport } from '../analysis/complexity.js'

describe('Empirical Big-O Derivation Engine (complexity.js)', () => {
  it('correctly derives empirical Big-O growth curves for sorting algorithms', () => {
    const code = `
      let arr = [5, 2, 8, 1];
      for (let i = 0; i < arr.length; i = i + 1) {
        for (let j = 0; j < arr.length; j = j + 1) {
          let temp = arr[i];
        }
      }
    `
    const report = buildComplexityReport(null, [], code)
    expect(report.estimatedTime).toBeDefined()
    expect(report.dataPoints.length).toBe(4)
    expect(report.rSquared).toBeGreaterThan(0.5)
  })
})
