import { useState, type ReactNode } from 'react'

export default function GuidancePanel({ tips, extra }: { tips: string[]; extra?: ReactNode }) {
  const [open, setOpen] = useState(false)

  const content = (
    <div className="quiet-panel">
      <h3 className="mb-2 text-sm font-bold text-ink">Tips for This Section</h3>
      <ul className="space-y-1.5 text-sm text-ink">
        {tips.map((tip) => (
          <li key={tip} className="flex gap-2">
            <span className="text-amber-dark">•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
      {extra}
    </div>
  )

  return (
    <>
      {/* Desktop: always visible on the right */}
      <div className="hidden lg:block">{content}</div>

      {/* Mobile/tablet: collapsible */}
      <div className="lg:hidden">
        <button
          onClick={() => setOpen((o) => !o)}
          className="quiet-panel mb-2 flex w-full items-center justify-between px-4 py-3 text-sm font-bold text-ink"
        >
          Tips for This Section
          <span className="text-amber-dark">{open ? '▲' : '▼'}</span>
        </button>
        {open && content}
      </div>
    </>
  )
}
