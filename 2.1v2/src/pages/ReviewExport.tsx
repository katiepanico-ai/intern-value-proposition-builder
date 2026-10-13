import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppData } from '../AppContext'
import { lciPriorities } from '../config/lciPriorities'
import { computeImpact } from '../lib/metrics'
import { copyToClipboard } from '../lib/copyToClipboard'
import { exportToPptx } from '../lib/pptxExport'

interface SectionCheck {
  title: string
  route: string
  complete: boolean
  render: () => React.ReactNode
}

export default function ReviewExport() {
  const { data, startFresh, exportProgress } = useAppData()
  const navigate = useNavigate()
  const [exporting, setExporting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [showBackupPrompt, setShowBackupPrompt] = useState(true)

  // Gently prompt once, on arrival, to back up progress before they leave —
  // this is the point where losing everything would hurt most.
  useEffect(() => {
    setShowBackupPrompt(true)
  }, [])

  const handleBackupNow = () => {
    exportProgress()
    setShowBackupPrompt(false)
  }

  const priorityNames = data.step2.selectedPriorities.map((id) =>
    id === 'other' ? (data.step2.customPriority || 'Other') : lciPriorities.find((p) => p.id === id)?.name || id
  )
  const validMetrics = data.step3.metrics.filter((m) => m.before !== '' && m.after !== '')

  const sections: SectionCheck[] = [
    {
      title: 'Step 1: Project Overview',
      route: '/builder/step-1',
      complete: data.step1.projectTitle.trim() !== '' && data.step1.stakeholder.trim() !== '',
      render: () => (
        <div className="space-y-1 text-sm text-gray-600">
          <p><strong className="text-dell-gray">{data.step1.projectTitle || 'Untitled project'}</strong></p>
          <p>{data.step1.description || '—'}</p>
          <p><span className="text-gray-400">Stakeholder:</span> {data.step1.stakeholder || '—'}</p>
          <p><span className="text-gray-400">Key outcome:</span> {data.step1.keyOutcome || '—'}</p>
        </div>
      ),
    },
    {
      title: 'Step 2: Business Alignment',
      route: '/builder/step-2',
      complete: data.step2.selectedPriorities.length > 0,
      render: () => (
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex flex-wrap gap-1.5">
            {priorityNames.length > 0 ? priorityNames.map((n) => (
              <span key={n} className="rounded-full border border-dell-blue/30 bg-dell-tip px-2.5 py-0.5 text-xs font-semibold text-dell-blue">{n}</span>
            )) : <span className="text-gray-400">—</span>}
          </div>
          <p>{data.step2.articulation || '—'}</p>
        </div>
      ),
    },
    {
      title: 'Step 3: Value and ROI',
      route: '/builder/step-3',
      complete: validMetrics.length > 0 || data.step3.qualitativeImpact.trim() !== '',
      render: () => (
        <div className="space-y-2 text-sm text-gray-600">
          {validMetrics.length > 0 ? (
            <table className="w-full text-xs">
              <thead><tr className="text-left text-gray-400"><th className="pb-1">Metric</th><th>Before</th><th>After</th><th>Impact</th></tr></thead>
              <tbody>
                {validMetrics.map((m) => {
                  const impact = computeImpact(m)
                  return (
                    <tr key={m.id}><td className="pr-2 font-semibold text-dell-gray">{impact.metricLabel}</td><td className="pr-2">{m.before} {m.unit}</td><td className="pr-2">{m.after} {m.unit}</td><td>{impact.label}</td></tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <p>{data.step3.qualitativeImpact || '—'}</p>
          )}
          <p className="italic">{data.step3.impactStatement || '—'}</p>
        </div>
      ),
    },
    {
      title: 'Step 4: Scalability and Automation',
      route: '/builder/step-4',
      complete: data.step4.isScalable !== '' && data.step4.isAutomatable !== '',
      render: () => (
        <div className="space-y-1 text-sm text-gray-600">
          <p><span className="text-gray-400">Scalable:</span> {data.step4.isScalable || '—'} {data.step4.scaleWhere && `— ${data.step4.scaleWhere}`}</p>
          <p><span className="text-gray-400">Automatable:</span> {data.step4.isAutomatable || '—'} {data.step4.automationDetails && `— ${data.step4.automationDetails}`}</p>
        </div>
      ),
    },
    {
      title: 'Step 5: Recommendation and Next Steps',
      route: '/builder/step-5',
      complete: data.step5.recommendation.trim() !== '' && data.step5.closingStatement.trim() !== '',
      render: () => (
        <div className="space-y-1 text-sm text-gray-600">
          <p>{data.step5.recommendation || '—'}</p>
          <p><span className="text-gray-400">Owner:</span> {data.step5.ownership || '—'}</p>
          <p className="font-semibold text-dell-gray">"{data.step5.closingStatement || '—'}"</p>
        </div>
      ),
    },
  ]

  const completePct = Math.round((sections.filter((s) => s.complete).length / sections.length) * 100)

  const handleExport = async () => {
    setExporting(true)
    try {
      await exportToPptx(data)
    } finally {
      setExporting(false)
    }
  }

  const handleCopyText = async () => {
    const lines = [
      `${data.step1.projectTitle || 'Internship Project'} — Value Proposition`,
      `Prepared by ${data.internInfo.name || 'Intern'}${data.internInfo.team ? ', ' + data.internInfo.team : ''}`,
      '',
      '1. Project Overview',
      data.step1.description,
      `Stakeholder: ${data.step1.stakeholder}`,
      `Key Outcome: ${data.step1.keyOutcome}`,
      '',
      '2. Business Alignment',
      `Priorities: ${priorityNames.join(', ')}`,
      data.step2.articulation,
      '',
      '3. Value and ROI',
      ...validMetrics.map((m) => {
        const impact = computeImpact(m)
        return `- ${impact.metricLabel}: ${m.before} ${m.unit} → ${m.after} ${m.unit} (${impact.label})`
      }),
      data.step3.qualitativeImpact,
      data.step3.impactStatement,
      '',
      '4. Scalability and Automation',
      `Scalable: ${data.step4.isScalable} — ${data.step4.scaleWhere}`,
      `Automatable: ${data.step4.isAutomatable} — ${data.step4.automationDetails}`,
      `Resources needed: ${data.step4.resourcesNeeded}`,
      '',
      '5. Recommendation and Next Steps',
      data.step5.recommendation,
      `Owner: ${data.step5.ownership}`,
      `Closing statement: ${data.step5.closingStatement}`,
    ]
    const ok = await copyToClipboard(lines.filter(Boolean).join('\n'))
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 1500) }
  }

  const handleStartOver = () => {
    startFresh()
    navigate('/')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Your Value Proposition — Review and Export</h1>
      <p className="mt-2 text-sm text-muted">Your story is <strong className="text-amber-dark">{completePct}%</strong> complete.</p>
      <div className="mt-2 h-2 w-full rounded-full bg-panel">
        <div className="h-2 rounded-full bg-amber transition-all" style={{ width: `${completePct}%` }} />
      </div>

      {showBackupPrompt && (
        <div className="quiet-panel mt-4 flex flex-wrap items-center justify-between gap-3 border-l-4 border-l-dell-blue">
          <span className="text-sm text-ink">
            Before you go further — your answers are only saved on this device and browser.
            Download a backup so you can pick up on another computer if you need to.
          </span>
          <div className="flex flex-shrink-0 gap-2">
            <button onClick={handleBackupNow} className="btn-primary py-1.5 text-xs">Download Backup</button>
            <button onClick={() => setShowBackupPrompt(false)} className="btn-tertiary py-1.5 text-xs">Dismiss</button>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {sections.map((s) => (
          <div key={s.title} className={s.complete ? 'accent-card' : 'card border-l-4 border-l-strength-yellow bg-strength-yellow/5'}>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-bold text-ink">{s.title}</h2>
              <button className="text-xs font-semibold text-dell-blue hover:underline" onClick={() => navigate(s.route)}>Edit</button>
            </div>
            {s.render()}
            {!s.complete && (
              <button className="mt-2 text-xs font-semibold text-strength-yellow hover:underline" onClick={() => navigate(s.route)}>Complete This Section →</button>
            )}
          </div>
        ))}
      </div>

      <div className="quiet-panel mt-8 text-center">
        <button onClick={handleExport} disabled={exporting} className="btn-primary w-full text-base sm:w-auto sm:px-10">
          {exporting ? 'Generating…' : 'Download PowerPoint'}
        </button>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          <button onClick={handleCopyText} className="btn-secondary">{copied ? 'Copied!' : 'Copy as Text'}</button>
          <button onClick={exportProgress} className="btn-secondary">Download Progress Backup</button>
          <button onClick={() => setConfirmReset(true)} className="btn-tertiary">Start Over</button>
        </div>
      </div>

      {confirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setConfirmReset(false)}>
          <div className="card max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-2 text-base font-bold text-ink">Are you sure?</h2>
            <p className="text-sm text-muted">This will clear all your progress. Consider downloading a backup first if you might want it later.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button className="btn-secondary" onClick={() => setConfirmReset(false)}>Cancel</button>
              <button className="btn-primary bg-red-600 hover:bg-red-700" onClick={handleStartOver}>Clear Progress</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
