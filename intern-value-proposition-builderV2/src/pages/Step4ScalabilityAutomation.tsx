import { useNavigate } from 'react-router-dom'
import { useAppData } from '../AppContext'
import StepProgress from '../components/StepProgress'
import GuidancePanel from '../components/GuidancePanel'
import ExampleToggle from '../components/ExampleToggle'
import Navigation from '../components/Navigation'
import { step4Example, automationMatrixNote, automationSuggestionCards } from '../config/examples'

const TIPS = [
  'Leadership loves hearing that a project can scale — it shows strategic thinking',
  "Even if YOUR project can't scale, the methodology or learnings might",
  "Automation doesn't have to mean complex tech — even a template or checklist is a form of automation",
]

const SCALE_CHECKLIST = [
  'Other teams in my org',
  'Other regions (EMEA, APAC, Americas)',
  'Other business units at Dell',
  "The methodology could be reused even if the specific project can't",
  'Other (specify)',
]

export default function Step4ScalabilityAutomation() {
  const { data, setData, save } = useAppData()
  const navigate = useNavigate()
  const step4 = data.step4

  const update = (patch: Partial<typeof step4>) => setData((prev) => ({ ...prev, step4: { ...prev.step4, ...patch } }))

  const toggleScaleItem = (item: string) => {
    const has = step4.scaleChecklist.includes(item)
    update({ scaleChecklist: has ? step4.scaleChecklist.filter((i) => i !== item) : [...step4.scaleChecklist, item] })
    save()
  }

  const showScaleFields = step4.isScalable === 'Yes' || step4.isScalable === 'Not Sure'
  const showAutomationFields = step4.isAutomatable === 'Yes' || step4.isAutomatable === 'Not Sure'

  const handleNext = () => { setData((prev) => ({ ...prev, currentStep: 5 })); save(); navigate('/builder/step-5') }
  const handleBack = () => { save(); navigate('/builder/step-3') }

  return (
    <div>
      <StepProgress current={4} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
        <div>
          <h1 className="text-2xl font-bold text-dell-gray">Can This Go Bigger?</h1>

          <ExampleToggle>
            <p><strong>Scalability:</strong> {step4Example.scalability}</p>
            <p className="mt-1"><strong>Automation:</strong> {step4Example.automation}</p>
          </ExampleToggle>

          <div className="mt-4 rounded-md bg-dell-gray-light p-3 text-xs text-gray-500">{automationMatrixNote}</div>

          <div className="mt-6 rounded-lg border border-gray-200 p-4">
            <h2 className="mb-2 text-sm font-bold text-dell-gray">Is this project scalable to other teams, regions, or business units?</h2>
            <div className="flex gap-2">
              {(['Yes', 'No', 'Not Sure'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => { update({ isScalable: opt }); save() }}
                  className={`rounded-md border px-4 py-1.5 text-sm font-semibold ${step4.isScalable === opt ? 'border-dell-blue bg-dell-tip text-dell-blue' : 'border-gray-300 text-gray-500 hover:border-dell-blue/50'}`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {showScaleFields && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="field-label">Where could this scale?</label>
                  <textarea className="field-input min-h-[70px]" maxLength={300} value={step4.scaleWhere} onChange={(e) => update({ scaleWhere: e.target.value })} onBlur={save} />
                  <div className="mt-1 text-right text-xs text-gray-400">{step4.scaleWhere.length}/300</div>
                </div>
                <div>
                  <span className="field-label">Quick select</span>
                  <div className="space-y-1.5">
                    {SCALE_CHECKLIST.map((item) => (
                      <label key={item} className="flex cursor-pointer items-start gap-2 text-sm text-dell-gray">
                        <input type="checkbox" checked={step4.scaleChecklist.includes(item)} onChange={() => toggleScaleItem(item)} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-dell-blue focus:ring-dell-blue" />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-lg border border-gray-200 p-4">
            <h2 className="mb-2 text-sm font-bold text-dell-gray">Are there parts of this project that could be automated?</h2>
            <div className="flex gap-2">
              {(['Yes', 'No', 'Not Sure'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => { update({ isAutomatable: opt }); save() }}
                  className={`rounded-md border px-4 py-1.5 text-sm font-semibold ${step4.isAutomatable === opt ? 'border-dell-blue bg-dell-tip text-dell-blue' : 'border-gray-300 text-gray-500 hover:border-dell-blue/50'}`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {showAutomationFields && (
              <div className="mt-4">
                <label className="field-label">What could be automated and how?</label>
                <textarea className="field-input min-h-[70px]" maxLength={300} value={step4.automationDetails} onChange={(e) => update({ automationDetails: e.target.value })} onBlur={save} />
                <div className="mt-1 text-right text-xs text-gray-400">{step4.automationDetails.length}/300</div>
              </div>
            )}

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {automationSuggestionCards.map((c) => (
                <div key={c.title} className="rounded-md bg-dell-gray-light p-3">
                  <p className="text-sm font-semibold text-dell-gray">{c.title}</p>
                  <p className="mt-1 text-xs text-gray-500">{c.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="field-label">What would it take to scale or automate this?</label>
            <p className="mb-1 text-xs text-gray-500">Tools, people, budget, access, or approvals needed.</p>
            <textarea className="field-input min-h-[70px]" maxLength={300} value={step4.resourcesNeeded} onChange={(e) => update({ resourcesNeeded: e.target.value })} onBlur={save} />
            <div className="mt-1 text-right text-xs text-gray-400">{step4.resourcesNeeded.length}/300</div>
          </div>

          <Navigation onBack={handleBack} onNext={handleNext} onSave={save} saved={!!data.lastSaved} />
        </div>

        <div className="order-first lg:order-none"><GuidancePanel tips={TIPS} /></div>
      </div>
    </div>
  )
}
