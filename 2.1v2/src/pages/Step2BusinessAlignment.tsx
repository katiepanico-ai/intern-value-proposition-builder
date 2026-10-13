import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppData } from '../AppContext'
import StepProgress from '../components/StepProgress'
import ProgressBar from '../components/ProgressBar'
import GuidancePanel from '../components/GuidancePanel'
import ExampleToggle from '../components/ExampleToggle'
import PriorityCard from '../components/PriorityCard'
import FillInTemplate from '../components/FillInTemplate'
import Navigation from '../components/Navigation'
import { lciPriorities } from '../config/lciPriorities'
import { step2Example, connectionPrompts } from '../config/examples'
import { step2Percent } from '../lib/completion'

const TIPS = [
  "Every project connects to the business — even if it's not obvious at first",
  'Pick the strategic priority that BEST fits, not all of them',
  'Think about how your work helps Dell win in the market',
]

export default function Step2BusinessAlignment() {
  const { data, setData, save } = useAppData()
  const navigate = useNavigate()
  const step2 = data.step2
  const [openPrompt, setOpenPrompt] = useState<number | null>(null)

  const update = (patch: Partial<typeof step2>) => {
    setData((prev) => ({ ...prev, step2: { ...prev.step2, ...patch } }))
  }

  const togglePriority = (id: string) => {
    const selected = step2.selectedPriorities.includes(id)
    let next: string[]
    if (selected) {
      next = step2.selectedPriorities.filter((p) => p !== id)
    } else {
      if (step2.selectedPriorities.length >= 3) return
      next = [...step2.selectedPriorities, id]
    }
    update({ selectedPriorities: next })
    save()
  }

  const selectedNames = step2.selectedPriorities.map((id) =>
    id === 'other' ? (step2.customPriority || 'Other') : lciPriorities.find((p) => p.id === id)?.name || id
  )

  const canProceed = step2.selectedPriorities.length > 0

  const handleNext = () => {
    setData((prev) => ({ ...prev, currentStep: 3 }))
    save()
    navigate('/builder/step-3')
  }

  const handleBack = () => {
    save()
    navigate('/builder/step-1')
  }

  return (
    <div>
      <StepProgress title="How Does This Connect to Dell's Strategy?" subtitle="Step 2 of 5 — Business Alignment" percent={step2Percent(data)} />
      <ProgressBar />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
        <div>
          <ExampleToggle>
            <p><strong>Selected priority:</strong> {step2Example.selectedPriority}</p>
            <p className="mt-1"><strong>Articulation:</strong> {step2Example.articulation}</p>
          </ExampleToggle>

          <h2 className="mt-6 mb-2 text-sm font-bold text-dell-gray">Select 1–3 priorities that fit best</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {lciPriorities.map((p) => (
              <PriorityCard
                key={p.id}
                priority={p}
                selected={step2.selectedPriorities.includes(p.id)}
                disabled={step2.selectedPriorities.length >= 3}
                onToggle={() => togglePriority(p.id)}
              />
            ))}
          </div>

          {step2.selectedPriorities.includes('other') && (
            <div className="mt-3">
              <label className="field-label">Describe your priority</label>
              <input className="field-input" value={step2.customPriority} onChange={(e) => update({ customPriority: e.target.value })} onBlur={save} />
            </div>
          )}

          {selectedNames.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-2 text-sm font-bold text-dell-gray">Starter template</h2>
              <FillInTemplate
                parts={[
                  'My project on ',
                  data.step1.projectTitle || '[project title]',
                  ' supports Dell\u2019s ',
                  selectedNames.join(' / '),
                  ' strategy by ',
                  { blank: true },
                  '. This matters because ',
                  { blank: true },
                  '.',
                ]}
              />
            </div>
          )}

          <div className="accent-card mt-4">
            <label className="field-label">Your full articulation</label>
            <textarea
              className="field-input min-h-[110px]"
              maxLength={400}
              value={step2.articulation}
              onChange={(e) => update({ articulation: e.target.value })}
              onBlur={save}
            />
            <div className="mt-1 text-right text-xs text-gray-400">{step2.articulation.length}/400</div>
          </div>

          <div className="quiet-panel mt-6">
            <h2 className="mb-2 text-sm font-bold text-dell-gray">Connection Prompter</h2>
            <ul className="space-y-1">
              {connectionPrompts.map((cp, i) => (
                <li key={cp.question}>
                  <button
                    className="w-full text-left text-sm text-dell-gray hover:text-dell-blue"
                    onClick={() => setOpenPrompt(openPrompt === i ? null : i)}
                  >
                    <span className="text-dell-blue">?</span> {cp.question}
                  </button>
                  {openPrompt === i && <p className="ml-4 mt-1 text-xs text-gray-500">{cp.explanation}</p>}
                </li>
              ))}
            </ul>
          </div>

          <Navigation onBack={handleBack} onNext={handleNext} onSave={save} saved={!!data.lastSaved} />
          {!canProceed && <p className="mt-2 text-xs text-gray-400">Select at least one priority to continue.</p>}
        </div>

        <div className="order-first lg:order-none"><GuidancePanel tips={TIPS} /></div>
      </div>
    </div>
  )
}
