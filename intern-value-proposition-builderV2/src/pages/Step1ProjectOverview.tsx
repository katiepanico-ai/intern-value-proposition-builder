import { useNavigate } from 'react-router-dom'
import { useAppData } from '../AppContext'
import StepProgress from '../components/StepProgress'
import GuidancePanel from '../components/GuidancePanel'
import ExampleToggle from '../components/ExampleToggle'
import StrengthChecker from '../components/StrengthChecker'
import Navigation from '../components/Navigation'
import { translationPairs } from '../config/examples'
import { projectTypes, exampleFor } from '../config/projectTypes'

const TIPS = [
  'Focus on the WHAT and WHY, not the how',
  'Think about who benefits from your work',
  'Lead with the outcome, not the process',
]

const CHECKLIST_ITEMS = [
  'I stated the problem or opportunity clearly',
  'I identified who benefits from this work',
  'I mentioned a result (a number, a finding, or a decision it enables)',
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
  const example = exampleFor(step1.projectType).step1

  const canProceed = step1.projectTitle.trim() !== '' && step1.stakeholder.trim() !== ''

  const handleNext = () => {
    setData((prev) => ({ ...prev, currentStep: 2 }))
    save()
    navigate('/builder/step-2')
  }

  return (
    <div>
      <StepProgress current={1} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
        <div>
          <h1 className="text-2xl font-bold text-dell-gray">What Did You Work On?</h1>

          <ExampleToggle>
            <p><strong>Project Title:</strong> {example.projectTitle}</p>
            <p className="mt-1"><strong>Description:</strong> {example.description}</p>
            <p className="mt-1"><strong>Stakeholder:</strong> {example.stakeholder}</p>
            <p className="mt-1"><strong>Key Outcome:</strong> {example.keyOutcome}</p>
            <div className="mt-3 border-t border-dell-blue/20 pt-3">
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-500">Don't list activities — translate them:</p>
              {translationPairs.map((p) => (
                <p key={p.novice} className="mt-1 text-xs">
                  <span className="text-gray-400">"{p.novice}"</span> → <span className="font-semibold text-dell-blue">"{p.executive}"</span>
                </p>
              ))}
            </div>
          </ExampleToggle>

          <div className="mt-6 space-y-5">
            <div>
              <span className="field-label">What kind of project is this?</span>
              <p className="mb-2 text-xs text-gray-500">This tailors the examples and how Step 3 asks about value. Pick the closest fit.</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {projectTypes.map((t) => {
                  const selected = step1.projectType === t.id
                  return (
                    <button
                      key={t.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => { update({ projectType: t.id }); save() }}
                      className={`rounded-md border p-3 text-left ${selected ? 'border-dell-blue bg-dell-tip' : 'border-gray-300 hover:border-dell-blue/50'}`}
                    >
                      <span className={`block text-sm font-semibold ${selected ? 'text-dell-blue' : 'text-dell-gray'}`}>{t.label}</span>
                      <span className="mt-0.5 block text-xs text-gray-500">{t.hint}</span>
                    </button>
                  )
                })}
              </div>
            </div>

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
