import { useNavigate } from 'react-router-dom'
import { useAppData } from '../AppContext'
import StepProgress from '../components/StepProgress'
import ProgressBar from '../components/ProgressBar'
import GuidancePanel from '../components/GuidancePanel'
import ExampleToggle from '../components/ExampleToggle'
import MetricRow from '../components/MetricRow'
import Navigation from '../components/Navigation'
import { emptyMetric } from '../lib/storage'
import { computeImpact } from '../lib/metrics'
import { step3Example, roiFormulaNote, qualitativePrompts } from '../config/examples'
import { step3Percent } from '../lib/completion'
import type { Metric } from '../types'

const TIPS = [
  'Even rough estimates are better than no numbers at all',
  'Think in terms of: time, money, errors, steps, or people impacted',
  "If you can't quantify it, describe the qualitative impact — that still counts",
]

export default function Step3ValueROI() {
  const { data, setData, save } = useAppData()
  const navigate = useNavigate()
  const step3 = data.step3

  const update = (patch: Partial<typeof step3>) => {
    setData((prev) => ({ ...prev, step3: { ...prev.step3, ...patch } }))
  }

  const updateMetric = (index: number, next: Metric) => {
    const metrics = [...step3.metrics]
    metrics[index] = next
    update({ metrics })
  }

  const addMetric = () => {
    if (step3.metrics.length >= 5) return
    update({ metrics: [...step3.metrics, emptyMetric()] })
    save()
  }

  const removeMetric = (index: number) => {
    const metrics = step3.metrics.filter((_, i) => i !== index)
    update({ metrics })
    save()
  }

  const firstValidMetric = step3.metrics.find((m) => m.before !== '' && m.after !== '')
  const firstImpact = firstValidMetric ? computeImpact(firstValidMetric) : null

  const buildStatement = () => {
    if (!firstValidMetric || !firstImpact) return ''
    const stakeholder = data.step1.stakeholder || 'the team'
    return `This project reduced/improved ${firstImpact.metricLabel} from ${firstValidMetric.before} to ${firstValidMetric.after}, resulting in ${firstImpact.label}. This means ${stakeholder} can now ___________.`
  }

  const handleGenerate = () => {
    const generated = buildStatement()
    if (generated) update({ impactStatement: generated })
    save()
  }

  const handleNext = () => {
    setData((prev) => ({ ...prev, currentStep: 4 }))
    save()
    navigate('/builder/step-4')
  }
  const handleBack = () => { save(); navigate('/builder/step-2') }

  return (
    <div>
      <StepProgress title="What's the Impact — By the Numbers?" subtitle="Step 3 of 5 — Value &amp; ROI" percent={step3Percent(data)} />
      <ProgressBar />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
        <div>
          <ExampleToggle>
            <table className="w-full text-xs">
              <thead><tr className="text-left text-gray-500"><th className="pb-1">Metric</th><th className="pb-1">Before</th><th className="pb-1">After</th><th className="pb-1">Impact</th></tr></thead>
              <tbody>
                {step3Example.metrics.map((m) => (
                  <tr key={m.metric}><td className="pr-2 font-semibold">{m.metric}</td><td className="pr-2">{m.before}</td><td className="pr-2">{m.after}</td><td>{m.impact}</td></tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2"><strong>Impact statement:</strong> {step3Example.impactStatement}</p>
          </ExampleToggle>

          <div className="quiet-panel mt-4 text-xs text-muted">{roiFormulaNote}</div>

          <h2 className="mt-6 mb-2 text-sm font-bold text-dell-gray">ROI Calculator</h2>
          <div className="accent-card space-y-3">
            {step3.metrics.map((m, i) => (
              <MetricRow
                key={m.id}
                metric={m}
                index={i}
                canRemove={step3.metrics.length > 1}
                onChange={(next) => updateMetric(i, next)}
                onRemove={() => removeMetric(i)}
              />
            ))}
            {step3.metrics.length < 5 && (
              <button className="btn-secondary mt-1" onClick={addMetric}>+ Add Another Metric</button>
            )}
          </div>

          <div className="quiet-panel mt-6">
            <h2 className="mb-1 text-sm font-bold text-dell-gray">Can't quantify it? Describe the qualitative impact instead.</h2>
            <textarea
              className="field-input mt-2 min-h-[90px]"
              maxLength={400}
              value={step3.qualitativeImpact}
              onChange={(e) => update({ qualitativeImpact: e.target.value })}
              onBlur={save}
            />
            <div className="mt-1 text-right text-xs text-gray-400">{step3.qualitativeImpact.length}/400</div>
            <ul className="mt-2 space-y-1 text-xs text-gray-500">
              {qualitativePrompts.map((p) => (<li key={p}>• {p}</li>))}
            </ul>
          </div>

          <div className="accent-card mt-6">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-bold text-dell-gray">Impact Statement Builder</h2>
              <button className="text-xs font-semibold text-dell-blue hover:underline" onClick={handleGenerate}>Auto-fill from metrics</button>
            </div>
            <textarea
              className="field-input min-h-[90px]"
              value={step3.impactStatement}
              onChange={(e) => update({ impactStatement: e.target.value })}
              onBlur={save}
              placeholder="This project [reduced/improved/eliminated] [metric] from [before] to [after], resulting in [impact]. This means [stakeholder] can now ..."
            />
          </div>

          <Navigation onBack={handleBack} onNext={handleNext} onSave={save} saved={!!data.lastSaved} />
        </div>

        <div className="order-first lg:order-none"><GuidancePanel tips={TIPS} /></div>
      </div>
    </div>
  )
}
