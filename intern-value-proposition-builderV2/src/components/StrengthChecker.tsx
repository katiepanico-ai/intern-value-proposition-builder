interface Props {
  title: string
  items: string[]
  checked: boolean[]
  onChange: (next: boolean[]) => void
}

function badgeFor(count: number, total: number) {
  if (count >= total - 1) return { label: 'Strong — Ready for leadership.', className: 'bg-strength-green/10 text-strength-green border-strength-green/40' }
  if (count >= 2) return { label: 'Getting there — try adding more specifics.', className: 'bg-strength-yellow/10 text-strength-yellow border-strength-yellow/40' }
  return { label: 'Needs work — use the tips above.', className: 'bg-strength-red/10 text-strength-red border-strength-red/40' }
}

export default function StrengthChecker({ title, items, checked, onChange }: Props) {
  const count = checked.filter(Boolean).length
  const total = items.length
  const pct = total > 0 ? count / total : 0
  const badge = badgeFor(count, total)

  const radius = 22
  const circumference = 2 * Math.PI * radius

  const toggle = (i: number) => {
    const next = [...checked]
    next[i] = !next[i]
    onChange(next)
  }

  return (
    <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-start gap-4">
        <div className="flex flex-shrink-0 flex-col items-center">
          <svg width="56" height="56" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="5" />
            <circle
              cx="28" cy="28" r={radius} fill="none" stroke="#0076CE" strokeWidth="5"
              strokeDasharray={circumference} strokeDashoffset={circumference * (1 - pct)}
              strokeLinecap="round" transform="rotate(-90 28 28)"
            />
            <text x="28" y="32" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#444444">{count}/{total}</text>
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="mb-1 text-sm font-bold text-dell-gray">{title}</h4>
          <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badge.className}`}>
            {badge.label}
          </span>
        </div>
      </div>
      <ul className="mt-3 space-y-1.5">
        {items.map((item, i) => (
          <li key={item}>
            <label className="flex cursor-pointer items-start gap-2 text-sm text-dell-gray">
              <input type="checkbox" checked={checked[i] ?? false} onChange={() => toggle(i)} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-dell-blue focus:ring-dell-blue" />
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}
