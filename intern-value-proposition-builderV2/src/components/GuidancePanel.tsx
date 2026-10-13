import { useState, type ReactNode } from 'react'

export default function GuidancePanel({ tips, extra }: { tips: string[]; extra?: ReactNode }) {
  const [open, setOpen] = useState(false)

  const content = (
    <div className="rounded-lg border border-dell-blue/20 bg-dell-tip p-4">
      <h3 className="mb-2 text-sm font-bold text-dell-gray">Tips for This Section</h3>
      <ul className="space-y-1.5 text-sm text-dell-gray">
        {tips.map((tip) => (
          <li key={tip} className="flex gap-2">
            <span className="text-dell-blue">•</span>
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
          className="mb-2 flex w-full items-center justify-between rounded-lg border border-dell-blue/20 bg-dell-tip px-4 py-3 text-sm font-bold text-dell-gray"
        >
          Tips for This Section
          <span className="text-dell-blue">{open ? '▲' : '▼'}</span>
        </button>
        {open && content}
      </div>
    </>
  )
}
