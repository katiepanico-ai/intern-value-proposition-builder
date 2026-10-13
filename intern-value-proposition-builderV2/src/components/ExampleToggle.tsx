import { useState, type ReactNode } from 'react'

export default function ExampleToggle({ children }: { children: ReactNode }) {
  const [show, setShow] = useState(false)
  return (
    <div className="mb-4">
      <button
        onClick={() => setShow((s) => !s)}
        className="text-sm font-semibold text-dell-blue underline-offset-2 hover:underline"
      >
        {show ? 'Hide Example' : 'See an Example'}
      </button>
      {show && (
        <div className="mt-2 rounded-lg border border-dashed border-dell-blue/40 bg-dell-gray-light p-4 text-sm text-dell-gray">
          {children}
        </div>
      )}
    </div>
  )
}
