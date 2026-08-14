import { cn } from '../../utils/cn'

const tabs = [
  { id: 'visualizer',   label: 'Visualizer' },
  { id: 'optimization', label: 'Optimization' },
  { id: 'complexity',   label: 'Complexity' },
  { id: 'compare',      label: 'Compare' },
  { id: 'dashboard',    label: 'Dashboard' },
]

export default function DSATabNavigation({ activeTab, onTabChange }) {
  return (
    <div className="flex items-center gap-0.5 border-b border-atlas-muted/15">
      {tabs.map((t) => (
        <button
          key={t.id}
          id={`tab-${t.id}`}
          onClick={() => onTabChange(t.id)}
          className={cn(
            'px-4 py-2.5 text-xs font-medium transition border-b-2 -mb-px',
            activeTab === t.id
              ? 'border-atlas-brand text-atlas-text'
              : 'border-transparent text-atlas-muted hover:text-atlas-text'
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
