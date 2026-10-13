import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppData } from '../AppContext'
import { hasSavedProgress, parseImportedProgress } from '../lib/storage'
import JourneyMap, { type JourneyStep } from '../components/JourneyMap'
import { step1Percent, step2Percent, step3Percent, step4Percent, step5Percent } from '../lib/completion'

const BULLETS = [
  "Walk through 5 guided steps to build your project's value proposition",
  'Get built-in tips and examples to strengthen your story at each step',
  "Export a ready-to-use PowerPoint slide deck when you're done",
  'No training required — just follow the steps.',
]

export default function Landing() {
  const { data, setData, save, startFresh, importProgress } = useAppData()
  const navigate = useNavigate()
  const [showResumeBanner, setShowResumeBanner] = useState(hasSavedProgress())
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importError, setImportError] = useState('')

  const canStart = data.internInfo.name.trim() !== '' && data.internInfo.team.trim() !== ''

  const handleField = (field: 'name' | 'team' | 'manager', value: string) => {
    setData((prev) => ({ ...prev, internInfo: { ...prev.internInfo, [field]: value } }))
  }

  const handleGetStarted = () => {
    save()
    navigate('/builder/step-1')
  }

  const handleResume = () => {
    setShowResumeBanner(false)
    navigate(`/builder/step-${Math.min(Math.max(data.currentStep || 1, 1), 5)}`)
  }

  const handleStartFresh = () => {
    startFresh()
    setShowResumeBanner(false)
  }

  const handleImportClick = () => {
    setImportError('')
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const text = await file.text()
    const result = parseImportedProgress(text)
    if (!result.ok || !result.data) {
      setImportError(result.error || 'Could not import that file.')
      return
    }
    importProgress(result.data)
    setShowResumeBanner(false)
    navigate(`/builder/step-${Math.min(Math.max(result.data.currentStep || 1, 1), 5)}`)
  }

  const journeySteps: JourneyStep[] = [
    { label: '1', title: 'Project Overview', subLabel: 'What you worked on', percent: step1Percent(data), route: '/builder/step-1' },
    { label: '2', title: 'Business Alignment', subLabel: 'Dell strategy fit', percent: step2Percent(data), route: '/builder/step-2' },
    { label: '3', title: 'Value & ROI', subLabel: 'The numbers', percent: step3Percent(data), route: '/builder/step-3' },
    { label: '4', title: 'Scalability', subLabel: 'Going bigger', percent: step4Percent(data), route: '/builder/step-4' },
    { label: '5', title: 'Recommendation', subLabel: 'Next steps', percent: step5Percent(data), route: '/builder/step-5' },
  ]

  return (
    <div className="mx-auto max-w-4xl">
      {showResumeBanner && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dell-blue/30 bg-dell-tip px-4 py-3">
          <span className="text-sm font-semibold text-ink">Welcome back! You have saved progress.</span>
          <div className="flex gap-2">
            <button onClick={handleResume} className="btn-primary py-1.5 text-xs">Resume</button>
            <button onClick={handleStartFresh} className="btn-secondary py-1.5 text-xs">Start Fresh</button>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold leading-tight text-ink sm:text-4xl">Build Your Value Story</h1>
      <p className="mt-3 max-w-2xl text-base text-muted">
        Your internship, as a case for impact. Find one way your project strengthens Dell's
        business — supply chain, customer experience, or operational effectiveness — and leave
        with a presentation that proves it.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="field-label">Your name<span className="text-red-500"> *</span></label>
          <input className="field-input" value={data.internInfo.name} onChange={(e) => handleField('name', e.target.value)} required />
        </div>
        <div>
          <label className="field-label">Team or organization<span className="text-red-500"> *</span></label>
          <input className="field-input" value={data.internInfo.team} onChange={(e) => handleField('team', e.target.value)} required />
        </div>
        <div>
          <label className="field-label">Manager name <span className="font-normal text-gray-400">(optional)</span></label>
          <input className="field-input" value={data.internInfo.manager} onChange={(e) => handleField('manager', e.target.value)} />
        </div>
      </div>

      <div className="mt-8">
        <JourneyMap steps={journeySteps} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button className="btn-primary px-8" onClick={handleGetStarted} disabled={!canStart}>
          {hasSavedProgress() ? 'Continue Your Journey' : 'Get Started'}
        </button>
        {!canStart && <span className="text-xs text-gray-400">Add your name and team above to begin.</span>}
      </div>

      <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {BULLETS.map((b) => (
          <li key={b} className="flex gap-2 text-sm text-ink">
            <span className="mt-0.5 text-amber-dark">✓</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-panel p-4 text-center">
        <p className="text-xs text-muted">
          Your progress is only saved on this device and browser. Working on a different computer
          than before, or your progress didn't carry over?
        </p>
        <button onClick={handleImportClick} className="mt-1 text-xs font-semibold text-dell-blue hover:underline">
          Import a progress backup file
        </button>
        <input ref={fileInputRef} type="file" accept="application/json,.json" onChange={handleFileChange} className="hidden" />
        {importError && <p className="mt-1 text-xs text-red-600">{importError}</p>}
      </div>
    </div>
  )
}
