// Compact "X% complete" readout shown at the top of each step page —
// replaces the old segmented bar. The big blue number is the focal point,
// matching how the journey map reports progress per milestone.
export default function StepProgress({ title, subtitle, percent }: { title: string; subtitle: string; percent: number }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      </div>
      <div className="flex-shrink-0 text-right">
        <div className="font-display text-3xl font-bold text-dell-blue">{percent}%</div>
        <div className="text-xs text-muted">complete</div>
      </div>
    </div>
  )
}
