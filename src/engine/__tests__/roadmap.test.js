import { describe, it, expect } from 'vitest'
import {
  dsaRoadmapCategories,
  dsaTopics,
  mustMasterPatterns,
  priorityOrder,
  getTopicsByCategory,
  getTopicsByPriority,
} from '../dsaTopicsRoadmap.js'

describe('DSA Interview Topics & Roadmap Engine (dsaTopicsRoadmap.js)', () => {
  it('contains exactly 18 roadmap categories', () => {
    expect(dsaRoadmapCategories.length).toBe(18)
  })

  it('contains all 221 enumerated topics with valid metadata', () => {
    expect(dsaTopics.length).toBe(221)
    
    // Validate each topic has required fields
    dsaTopics.forEach((t, idx) => {
      expect(t.num).toBe(idx + 1)
      expect(t.title).toBeDefined()
      expect(t.categoryId).toBeDefined()
      expect(t.categoryName).toBeDefined()
      expect(t.priorityTier).toBeGreaterThanOrEqual(1)
      expect(t.priorityTier).toBeLessThanOrEqual(18)
      expect(t.description.length).toBeGreaterThan(10)
    })
  })

  it('contains all 20 Must-Master Problem Solving Patterns', () => {
    expect(mustMasterPatterns.length).toBe(20)
    mustMasterPatterns.forEach((p) => {
      expect(p.id).toBeDefined()
      expect(p.name).toBeDefined()
      expect(p.description).toBeDefined()
      expect(p.exampleProblem).toBeDefined()
    })
  })

  it('contains 18 Priority Tiers matching the interview preparation roadmap', () => {
    expect(priorityOrder.length).toBe(18)
  })

  it('correctly filters topics by category and priority tier', () => {
    const arrayTopics = getTopicsByCategory('arrays')
    expect(arrayTopics.length).toBe(15)

    const tier1Topics = getTopicsByPriority(1)
    expect(tier1Topics.length).toBeGreaterThan(0)
  })
})
