import { useNavigate } from 'react-router-dom'
import { useAppData } from '../AppContext'
import StepProgress from '../components/StepProgress'
import ProgressBar from '../components/ProgressBar'
import GuidancePanel from '../components/GuidancePanel'
import ExampleToggle from '../components/ExampleToggle'
import StrengthChecker from '../components/StrengthChecker'
import Navigation from '../components/Navigation'
import { step1Example, translationPairs } from '../config/examples'
import { step1Percent } from '../lib/completion'

const TIPS = [
  'Focus on the WHAT and WHY, not the how',
  'Think about who benefits from your work',
  'Lead with the outcome, not the process',
]

const CHECKLIST_ITEMS = [
  'I stated the problem or opportunity clearly',
  'I identified who benefits from this work',
  'I mentioned a measurable outcome (numbers, percentages, time saved)',
  'I used business language (not just technical jargon)',
  'I kept it concise (2-3 sentences)',
]

export default function Step1ProjectOverview() {
  const { data, setData, save } = useAppData()
  const navigate = useNavigate()
  const step1 = data.step1

  const update = (patch: Partial<typeof step1>) => {
    setData((prev) => ({ ...prev, step1: { ...prev.step1, ...patch }, currentStep: Math.max(prev.currentStep, 1) }))
  }

  const handleBlur = () => save()

  const canProceed = step1.projectTitle.trim() !== '' && step1.stakeholder.trim() !== ''

  const handleNext = () => {
    setData((prev) => ({ ...prev, currentStep: 2 }))
    save()
    navigate('/builder/step-2')
  }

  return (
    <div>
      <StepProgress title="What Did You Work On?" subtitle="Step 1 of 5 — Project Overview" percent={step1Percent(data)} />
      <ProgressBar />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
        <div>
          <ExampleToggle>
            <p><strong>Project Title:</strong> {step1Example.projectTitle}</p>
            <p className="mt-1"><strong>Description:</strong> {step1Example.description}</p>
            <p className="mt-1"><strong>Stakeholder:</strong> {step1Example.stakeholder}</p>
            <p className="mt-1"><strong>Key Outcome:</strong> {step1Example.keyOutcome}</p>
            <div className="mt-3 border-t border-dell-blue/20 pt-3">
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-500">Don't list activities — translate them:</p>
              {translationPairs.map((p) => (
                <p key={p.novice} className="mt-1 text-xs">
                  <span className="text-gray-400">"{p.novice}"</span> → <span className="font-semibold text-dell-blue">"{p.executive}"</span>
                </p>
              ))}
            </div>
          </ExampleToggle>

          <div className="accent-card mt-6 space-y-5">
            <div>
              <label className="field-label">Project title<span className="text-red-500"> *</span></label>
              <input className="field-input" value={step1.projectTitle} onChange={(e) => update({ projectTitle: e.target.value })} onBlur={handleBlur} required />
            </div>

            <div>
              <label className="field-label">Brief project description</label>
              <textarea
                className="field-input min-h-[100px]"
                maxLength={500}
                value={step1.description}
                onChange={(e) => update({ description: e.target.value })}
                onBlur={handleBlur}
              />
              <div className="mt-1 text-right text-xs text-gray-400">{step1.description.length}/500</div>

              <div className="mt-3">
                <h3 className="mb-2 text-sm font-bold text-dell-gray">Strengthen Your Description</h3>
                <StrengthChecker
                  title="Description Strength"
                  items={CHECKLIST_ITEMS}
                  checked={step1.strengthChecklist}
                  onChange={(next) => { update({ strengthChecklist: next }); save() }}
                />
              </div>
            </div>

            <div>
              <label className="field-label">Who was your stakeholder or end user?<span className="text-red-500"> *</span></label>
              <input className="field-input" value={step1.stakeholder} onChange={(e) => update({ stakeholder: e.target.value })} onBlur={handleBlur} required />
            </div>

            <div>
              <label className="field-label">What was the key outcome or deliverable?</label>
              <textarea
                className="field-input min-h-[80px]"
                maxLength={300}
                value={step1.keyOutcome}
                onChange={(e) => update({ keyOutcome: e.target.value })}
                onBlur={handleBlur}
              />
              <div className="mt-1 text-right text-xs text-gray-400">{step1.keyOutcome.length}/300</div>
            </div>
          </div>

          <Navigation backDisabled onNext={handleNext} onSave={save} saved={!!data.lastSaved} />
          {!canProceed && <p className="mt-2 text-xs text-gray-400">Add a project title and stakeholder to continue.</p>}
        </div>

        <div className="order-first lg:order-none">
          <GuidancePanel tips={TIPS} />
        </div>
      </div>
    </div>
  )
}
