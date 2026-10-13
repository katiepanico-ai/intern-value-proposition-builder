import { useNavigate } from 'react-router-dom'

export interface JourneyStep {
  label: string
  title: string
  subLabel: string
  percent: number
  route: string
}

// The hero of the Mission page: a dotted path connecting each step as a
// milestone, with a flag at the finish (the exported thesis/deck). Mirrors
// the "journey" framing the intern-facing reference design uses, while
// staying true to the app's actual 5-step structure and live progress.
export default function JourneyMap({ steps }: { steps: JourneyStep[] }) {
  const navigate = useNavigate()
  // Alternate labels above/below the path, like the reference's Q1..Q4 layout.
  const positions = steps.map((_, i) => (i % 2 === 0 ? 'above' : 'below'))

  // Node x-positions spread evenly 0-100, with a little padding on each side;
  // the flag sits just past the last node.
  const n = steps.length
  const xs = steps.map((_, i) => 6 + (i * (82 / (n - 1))))
  const flagX = 94
  const midY = 50

  // Simple alternating wave for the dotted connector line.
  const waveY = (i: number) => (positions[i] === 'above' ? 34 : 66)

  let pathD = `M ${xs[0]} ${waveY(0)}`
  for (let i = 1; i < n; i++) {
    const cx = (xs[i - 1] + xs[i]) / 2
    pathD += ` Q ${cx} ${midY} ${xs[i]} ${waveY(i)}`
  }
  pathD += ` Q ${(xs[n - 1] + flagX) / 2} ${midY} ${flagX} ${midY}`

  return (
    <div className="relative overflow-visible rounded-xl2 border border-gray-200 bg-white p-6 shadow-card sm:p-10">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {/* faint concentric guide rings, echoing a map/radar motif */}
        {[14, 24, 34].map((r) => (
          <ellipse key={r} cx={50} cy={midY} rx={46} ry={r} fill="none" stroke="#E3E8F0" strokeWidth="0.4" />
        ))}
        <path d={pathD} fill="none" stroke="#0076CE" strokeWidth="1" strokeDasharray="2.2 2.2" strokeLinecap="round" />
      </svg>

      <div className="relative" style={{ height: '18rem' }}>
        {steps.map((step, i) => {
          const isAbove = positions[i] === 'above'
          const done = step.percent >= 100
          return (
            <button
              key={step.title}
              onClick={() => navigate(step.route)}
              className="group absolute flex -translate-x-1/2 flex-col items-center text-center"
              style={{ left: `${xs[i]}%`, top: `${waveY(i)}%`, transform: 'translate(-50%, -50%)' }}
            >
              {isAbove && (
                <div className="mb-2 translate-y-[-100%]">
                  <div className="text-sm font-bold text-ink group-hover:text-dell-blue">{step.title}</div>
                  <div className="text-xs text-muted">{step.subLabel} · {step.percent}%</div>
                </div>
              )}
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 bg-white text-sm font-bold shadow-card transition-colors ${
                  done ? 'border-amber text-amber-dark' : 'border-dell-blue text-dell-blue'
                } group-hover:border-amber group-hover:text-amber-dark`}
              >
                {step.label}
              </div>
              {done && <span className="absolute -top-1 right-0 h-3 w-3 rounded-full bg-amber" aria-hidden="true" />}
              {!isAbove && (
                <div className="mt-2">
                  <div className="text-sm font-bold text-ink group-hover:text-dell-blue">{step.title}</div>
                  <div className="text-xs text-muted">{step.subLabel} · {step.percent}%</div>
                </div>
              )}
            </button>
          )
        })}

        {/* Flag at the finish line — the exported thesis/deck */}
        <button
          onClick={() => navigate('/review')}
          className="group absolute flex flex-col items-center text-center"
          style={{ left: `${flagX}%`, top: `${midY}%`, transform: 'translate(-50%, -50%)' }}
        >
          <span className="text-2xl leading-none text-amber-dark group-hover:scale-110 transition-transform">🏁</span>
          <span className="mt-1 text-xs font-bold text-ink group-hover:text-dell-blue">Review &amp; Export</span>
        </button>
      </div>
    </div>
  )
}
