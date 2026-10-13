export default function FillInTemplate({ parts }: { parts: (string | { blank: true })[] }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-dell-gray-light p-4 text-sm leading-relaxed text-dell-gray">
      {parts.map((p, i) =>
        typeof p === 'string' ? (
          <span key={i}>{p}</span>
        ) : (
          <span key={i} className="mx-1 inline-block border-b-2 border-dell-blue/50 px-2 text-gray-400">_______</span>
        )
      )}
    </div>
  )
}
