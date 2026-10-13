const STEP_LABELS = ['Project Overview', 'Business Alignment', 'Value & ROI', 'Scalability', 'Recommendation']

export default function StepProgress({ current }: { current: number }) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-gray-500">
        <span>Step {current} of 5</span>
        <span>{STEP_LABELS[current - 1]}</span>
      </div>
      <div className="flex gap-1.5">
        {STEP_LABELS.map((label, i) => {
          const step = i + 1
          const state = step < current ? 'done' : step === current ? 'active' : 'todo'
          return (
            <div
              key={label}
              className={`h-2 flex-1 rounded-full transition-colors ${
                state === 'done' ? 'bg-dell-blue' : state === 'active' ? 'bg-dell-blue' : 'bg-gray-200'
              }`}
            />
          )
        })}
      </div>
    </div>
  )
}
