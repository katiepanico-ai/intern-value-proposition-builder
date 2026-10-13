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
      className={`flex flex-col items-start gap-1 rounded-lg border-2 p-4 text-left transition-all ${
        selected ? 'border-dell-blue bg-dell-tip' : 'border-gray-200 bg-white hover:border-dell-blue/40'
      } ${disabled && !selected ? 'cursor-not-allowed opacity-40' : ''}`}
    >
      <span className="text-2xl">{priority.icon}</span>
      <span className="text-sm font-bold text-dell-gray">{priority.name}</span>
      <span className="text-xs text-gray-500">{priority.description}</span>
    </button>
  )
}
