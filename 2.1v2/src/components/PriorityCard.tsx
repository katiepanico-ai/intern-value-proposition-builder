import type { LciPriority } from '../types'

interface Props {
  priority: LciPriority
  selected: boolean
  disabled: boolean
  onToggle: () => void
}

export default function PriorityCard({ priority, selected, disabled, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled && !selected}
      className={`flex flex-col items-start gap-1 rounded-xl border-2 p-4 text-left transition-all ${
        selected ? 'border-amber bg-amber/10' : 'border-gray-200 bg-white hover:border-amber/40'
      } ${disabled && !selected ? 'cursor-not-allowed opacity-40' : ''}`}
    >
      <span className="text-2xl">{priority.icon}</span>
      <span className="text-sm font-bold text-ink">{priority.name}</span>
      <span className="text-xs text-muted">{priority.description}</span>
    </button>
  )
}
