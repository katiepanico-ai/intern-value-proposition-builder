import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppData } from '../AppContext'
import { hasSavedProgress } from '../lib/storage'

const BULLETS = [
  "Walk through 5 guided steps to build your project's value proposition",
  'Get built-in tips and examples to strengthen your story at each step',
  "Export a ready-to-use PowerPoint slide deck when you're done",
  'No training required — just follow the steps.',
]

export default function Landing() {
  const { data, setData, save, startFresh } = useAppData()
  const navigate = useNavigate()
  const [showResumeBanner, setShowResumeBanner] = useState(hasSavedProgress())

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

  return (
    <div className="mx-auto max-w-2xl">
      {showResumeBanner && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dell-blue/30 bg-dell-tip px-4 py-3">
          <span className="text-sm font-semibold text-dell-gray">Welcome back! You have saved progress.</span>
          <div className="flex gap-2">
            <button onClick={handleResume} className="btn-primary py-1.5 text-xs">Resume</button>
            <button onClick={handleStartFresh} className="btn-secondary py-1.5 text-xs">Start Fresh</button>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-dell-gray sm:text-4xl">Build Your Value Story</h1>
      <p className="mt-3 text-base text-gray-600">
        This tool helps you map your internship project to Dell's business strategy so you can
        present with impact.
      </p>

      <ul className="mt-6 space-y-3">
        {BULLETS.map((b) => (
          <li key={b} className="flex gap-2 text-sm text-dell-gray">
            <span className="mt-0.5 text-dell-blue">✓</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="card mt-8 space-y-4">
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
        <button className="btn-primary w-full" onClick={handleGetStarted} disabled={!canStart}>
          Get Started
        </button>
      </div>
    </div>
  )
}
