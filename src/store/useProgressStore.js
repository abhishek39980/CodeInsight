import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const XP_MAP = { Easy: 10, Medium: 25, Hard: 50 }

export function getLevelFromXP(xp) {
  if (xp >= 1500) return { name: 'Legend',     level: 5, next: Infinity, current: 1500 }
  if (xp >= 700)  return { name: 'Master',     level: 4, next: 1500,    current: 700  }
  if (xp >= 300)  return { name: 'Engineer',   level: 3, next: 700,     current: 300  }
  if (xp >= 100)  return { name: 'Apprentice', level: 2, next: 300,     current: 100  }
  return             { name: 'Novice',      level: 1, next: 100,     current: 0    }
}

export function getDailyChallengeId(problems) {
  const d = new Date()
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
  return problems[seed % problems.length]?.id ?? problems[0]?.id
}

export const useProgressStore = create(
  persist(
    (set, get) => ({
      problemStatus: {},  // { [id]: 'not_started' | 'in_progress' | 'solved' }
      bookmarks:     {},  // { [id]: true }
      xp:            0,
      streak:        0,
      lastSolveDate: null,

      markSolved: (problemId, difficulty) => {
        const { problemStatus, xp, streak, lastSolveDate } = get()
        if (problemStatus[problemId] === 'solved') return

        const today     = new Date().toDateString()
        const yesterday = new Date(Date.now() - 86_400_000).toDateString()
        const newStreak =
          lastSolveDate === today      ? streak
          : lastSolveDate === yesterday ? streak + 1
          : 1

        set({
          problemStatus: { ...problemStatus, [problemId]: 'solved' },
          xp:            xp + (XP_MAP[difficulty] ?? 10),
          streak:        newStreak,
          lastSolveDate: today,
        })
      },

      toggleBookmark: (problemId) => {
        const { bookmarks } = get()
        set({ bookmarks: { ...bookmarks, [problemId]: !bookmarks[problemId] } })
      },

      markInProgress: (problemId) => {
        const { problemStatus } = get()
        if (problemStatus[problemId] !== 'solved') {
          set({ problemStatus: { ...problemStatus, [problemId]: 'in_progress' } })
        }
      },

      getSolvedCount: () =>
        Object.values(get().problemStatus).filter(s => s === 'solved').length,

      getLevelInfo: () => getLevelFromXP(get().xp),
    }),
    { name: 'codeinsight-progress-v2' }
  )
)
