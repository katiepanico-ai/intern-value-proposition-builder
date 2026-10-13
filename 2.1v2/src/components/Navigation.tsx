interface Props {
  onBack?: () => void
  onNext?: () => void
  onSave?: () => void
  backDisabled?: boolean
  nextLabel?: string
  saved?: boolean
}

export default function Navigation({ onBack, onNext, onSave, backDisabled, nextLabel = 'Next', saved }: Props) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-6">
      <button className="btn-secondary" onClick={onBack} disabled={backDisabled}>Back</button>
      <div className="flex items-center gap-3">
        {saved && <span className="text-xs font-semibold text-strength-green">Saved</span>}
        <button className="btn-tertiary" onClick={onSave}>Save Progress</button>
        <button className="btn-primary" onClick={onNext}>{nextLabel}</button>
      </div>
    </div>
  )
}
