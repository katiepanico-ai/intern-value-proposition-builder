import { useNavigate } from 'react-router-dom'
import { useAppData } from '../AppContext'
import StepProgress from '../components/StepProgress'
import ProgressBar from '../components/ProgressBar'
import GuidancePanel from '../components/GuidancePanel'
import ExampleToggle from '../components/ExampleToggle'
import StrengthChecker from '../components/StrengthChecker'
import Navigation from '../components/Navigation'
import { step5Example, implementationRoadmapPrompts } from '../config/examples'
import { step5Percent } from '../lib/completion'

const TIPS = [
  'A clear recommendation shows leadership you\u2019re thinking beyond the internship',
  'Be specific — WHO should do WHAT by WHEN',
  'End with your most compelling point — this is what leadership will remember',
]

const CHECKLIST_ITEMS = [
  "I made a specific recommendation (not just 'this should continue')",
  'I identified who should own this going forward',
  "I mentioned what resources or support they'd need",
  'I included a timeline or next milestone',
  'My closing statement is memorable and specific',
]

export default function Step5Recommendation() {
  const { data, setData, save } = useAppData()
  const navigate = useNavigate()
  const step5 = data.step5

  const update = (patch: Partial<typeof step5>) => setData((prev) => ({ ...prev, step5: { ...prev.step5, ...patch } }))

  const handleNext = () => { setData((prev) => ({ ...prev, currentStep: 5 })); save(); navigate('/review') }
  const handleBack = () => { save(); navigate('/builder/step-4') }

  return (
    <div>
      <StepProgress title="What Should Happen Next?" subtitle="Step 5 of 5 — Recommendation" percent={step5Percent(data)} />
      <ProgressBar />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
        <div>
          <ExampleToggle>
            <p><strong>Recommendation:</strong> {step5Example.recommendation}</p>
            <p className="mt-1"><strong>Ownership:</strong> {step5Example.ownership}</p>
            <p className="mt-1"><strong>Closing Statement:</strong> {step5Example.closingStatement}</p>
          </ExampleToggle>

          <div className="quiet-panel mt-4">
            <h2 className="mb-2 text-sm font-bold text-dell-gray">Think through the roadmap</h2>
            <ul className="space-y-2 text-sm text-dell-gray">
              {implementationRoadmapPrompts.map((r) => (
                <li key={r.stage}><span className="font-semibold text-dell-blue">{r.stage}:</span> {r.detail}</li>
              ))}
            </ul>
          </div>

          <div className="accent-card mt-6 space-y-5">
            <div>
              <label className="field-label">What is your recommendation to leadership?</label>
              <textarea className="field-input min-h-[90px]" maxLength={400} value={step5.recommendation} onChange={(e) => update({ recommendation: e.target.value })} onBlur={save} />
              <div className="mt-1 text-right text-xs text-gray-400">{step5.recommendation.length}/400</div>
              <ul className="mt-1 space-y-0.5 text-xs text-gray-500">
                <li>• Should this project continue? If so, who should own it?</li>
                <li>• Is there a next phase or expansion opportunity?</li>
                <li>• What decision are you asking leadership to make?</li>
              </ul>
            </div>

            <div>
              <label className="field-label">Who should own this work going forward, and what resources would they need?</label>
              <textarea className="field-input min-h-[80px]" maxLength={300} value={step5.ownership} onChange={(e) => update({ ownership: e.target.value })} onBlur={save} />
              <div className="mt-1 text-right text-xs text-gray-400">{step5.ownership.length}/300</div>
            </div>

            <div>
              <label className="field-label">Your Closing Statement — make it count</label>
              <textarea className="field-input min-h-[60px]" maxLength={200} value={step5.closingStatement} onChange={(e) => update({ closingStatement: e.target.value })} onBlur={save} />
              <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
                <span>The best closing statements are 1-2 sentences.</span>
                <span>{step5.closingStatement.length}/200</span>
              </div>
            </div>
          </div>

          <StrengthChecker
            title="Recommendation Strength"
            items={CHECKLIST_ITEMS}
            checked={step5.strengthChecklist}
            onChange={(next) => { update({ strengthChecklist: next }); save() }}
          />

          <Navigation onBack={handleBack} onNext={handleNext} onSave={save} nextLabel="Review and Export" saved={!!data.lastSaved} />
        </div>

        <div className="order-first lg:order-none"><GuidancePanel tips={TIPS} /></div>
      </div>
    </div>
  )
}
