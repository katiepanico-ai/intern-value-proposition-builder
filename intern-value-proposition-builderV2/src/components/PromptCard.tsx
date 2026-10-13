import { useState } from 'react'
import type { PromptCardData } from '../types'
import { copyToClipboard } from '../lib/copyToClipboard'

export default function PromptCard({ data }: { data: PromptCardData }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = async (prompt: string, i: number) => {
    const ok = await copyToClipboard(prompt)
    if (ok) {
      setCopiedIndex(i)
      setTimeout(() => setCopiedIndex(null), 1500)
    }
  }

  return (
    <div className="card flex h-full flex-col">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-2xl">{data.icon}</span>
        <h3 className="text-sm font-bold text-dell-gray">{data.category}</h3>
      </div>
      <div className="flex-1 space-y-3">
        {data.prompts.map((prompt, i) => (
          <div key={i} className="rounded-md bg-dell-gray-light p-3">
            <p className="text-xs leading-relaxed text-dell-gray">{prompt}</p>
            <button
              onClick={() => handleCopy(prompt, i)}
              className="mt-2 text-xs font-semibold text-dell-blue hover:underline"
            >
              {copiedIndex === i ? 'Copied!' : 'Copy'}
            </button>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs italic text-gray-500">{data.note}</p>
    </div>
  )
}
