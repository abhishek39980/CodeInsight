export const ACHIEVEMENTS = [
  {
    id: 'first-solve',
    icon: '🎯',
    title: 'First Blood',
    desc: 'Solve your very first problem',
    rarity: 'common',
    rarityColor: '#9aa7b7',
  },
  {
    id: 'five-problems',
    icon: '⭐',
    title: 'Getting Started',
    desc: 'Solve 5 problems',
    rarity: 'common',
    rarityColor: '#9aa7b7',
  },
  {
    id: 'ten-problems',
    icon: '🔥',
    title: 'On Fire',
    desc: 'Solve 10 problems',
    rarity: 'uncommon',
    rarityColor: '#10b981',
  },
  {
    id: 'twenty-five',
    icon: '💎',
    title: 'Consistent Coder',
    desc: 'Solve 25 problems',
    rarity: 'rare',
    rarityColor: '#3b82f6',
  },
  {
    id: 'streak-3',
    icon: '📅',
    title: 'Habit Builder',
    desc: '3-day solving streak',
    rarity: 'common',
    rarityColor: '#9aa7b7',
  },
  {
    id: 'streak-7',
    icon: '🗓️',
    title: 'Week Warrior',
    desc: '7-day solving streak',
    rarity: 'uncommon',
    rarityColor: '#10b981',
  },
  {
    id: 'xp-100',
    icon: '🌱',
    title: 'Rising Up',
    desc: 'Earn 100 XP',
    rarity: 'common',
    rarityColor: '#9aa7b7',
  },
  {
    id: 'xp-500',
    icon: '🏆',
    title: 'XP Grinder',
    desc: 'Earn 500 XP',
    rarity: 'epic',
    rarityColor: '#8b5cf6',
  },
]

export function getAchievementById(id) {
  return ACHIEVEMENTS.find(a => a.id === id) ?? null
}
