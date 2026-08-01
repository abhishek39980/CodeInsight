import { cn } from '../../utils/cn'

const tabs = [
  { id: 'visualizer', label: '🎬 Algorithm Visualizer & Learning Mode' },
  { id: 'optimization', label: '💡 Optimization & Pattern Coach' },
  { id: 'complexity', label: '📈 Visual Complexity & Space Coach' },
  { id: 'compare', label: '⚔️ Compare Solutions' },
  { id: 'dashboard', label: '📊 Complexity Dashboard' },
]

export default function DSATabNavigation({ activeTab, onTabChange }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-atlas-muted/25 bg-atlas-surface/80 p-2">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onTabChange(t.id)}
          className={cn(
            'rounded-xl px-4 py-2.5 text-xs font-semibold transition flex items-center gap-2',
            activeTab === t.id
              ? 'border border-atlas-brand/60 bg-atlas-brand/25 text-atlas-text shadow-md'
              : 'border border-transparent text-atlas-muted hover:bg-atlas-elev hover:text-atlas-text'
          )}
        >
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  )
}
