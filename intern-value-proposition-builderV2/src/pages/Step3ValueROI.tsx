import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppData } from '../AppContext'
import StepProgress from '../components/StepProgress'
import GuidancePanel from '../components/GuidancePanel'
import ExampleToggle from '../components/ExampleToggle'
import MetricRow from '../components/MetricRow'
import Navigation from '../components/Navigation'
import { emptyMetric } from '../lib/storage'
import { computeImpact } from '../lib/metrics'
import { roiFormulaNote, qualitativePrompts } from '../config/examples'
import { projectTypeFor, valueLenses, exampleFor } from '../config/projectTypes'
import type { Metric, ValueLensId } from '../types'

const TIPS = [
  'Even rough estimates are better than no numbers at all, as long as you label them as estimates',
  'No hard numbers? Describe what was learned, decided, de-risked, or built. That is real value',
  'If the impact is still emerging, say what you expect and what would confirm it',
]

export default function Step3ValueROI() {
  const { data, setData, save } = useAppData()
  const navigate = useNavigate()
  const step3 = data.step3
  const type = projectTypeFor(data.step1.projectType)
  const example = exampleFor(data.step1.projectType).step3
  const leadsWithLenses = type.suggestedLenses.length > 0
  const isExpected = step3.impactStage === 'expected'

  const otherLensIds = valueLenses.map((l) => l.id).filter((id) => !type.suggestedLenses.includes(id))
  const [showMoreLenses, setShowMoreLenses] = useState(() =>
    otherLensIds.some((id) => (step3.valueLenses[id] || '').trim() !== '')
  )

  const update = (patch: Partial<typeof step3>) => {
    setData((prev) => ({ ...prev, step3: { ...prev.step3, ...patch } }))
  }

  const updateLens = (id: ValueLensId, value: string) => {
    setData((prev) => ({ ...prev, step3: { ...prev.step3, valueLenses: { ...prev.step3.valueLenses, [id]: value } } }))
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
    const stakeholder = data.step1.stakeholder || 'the team'
    if (firstValidMetric && firstImpact) {
      const verb = isExpected ? 'is expected to reduce/improve' : 'reduced/improved'
      const est = firstValidMetric.isEstimate ? ' (estimated)' : ''
      return `This project ${verb} ${firstImpact.metricLabel} from ${firstValidMetric.before} to ${firstValidMetric.after}${est}, resulting in ${firstImpact.label}. This means ${stakeholder} can now ___________.`
    }
    return isExpected
      ? `If adopted, this project is expected to ___________, which would let ${stakeholder} ___________.`
      : `This project gives ${stakeholder} ___________, so they can now ___________.`
  }

  const handleGenerate = () => {
    update({ impactStatement: buildStatement() })
    save()
  }

  const handleNext = () => {
    setData((prev) => ({ ...prev, currentStep: 4 }))
    save()
    navigate('/builder/step-4')
  }
  const handleBack = () => { save(); navigate('/builder/step-2') }

  const lensField = (id: ValueLensId) => {
    const lens = valueLenses.find((l) => l.id === id)!
    const value = step3.valueLenses[id] || ''
    return (
      <div key={id}>
        <label className="field-label" htmlFor={`lens-${id}`}>{lens.question}</label>
        <p className="mb-1 text-xs text-gray-500">{lens.hint}</p>
        <textarea
          id={`lens-${id}`}
          className="field-input min-h-[60px]"
          maxLength={250}
          value={value}
          onChange={(e) => updateLens(id, e.target.value)}
          onBlur={save}
        />
        <div className="mt-1 text-right text-xs text-gray-400">{value.length}/250</div>
      </div>
    )
  }

  const valueSection = (
    <div className="mt-6 rounded-lg border border-gray-200 p-4">
      <h2 className="mb-1 text-sm font-bold text-dell-gray">
        {leadsWithLenses ? 'Describe the value' : 'Value the numbers don’t capture (optional)'}
      </h2>
      <p className="mb-3 text-xs text-gray-500">
        {leadsWithLenses
          ? 'Projects like yours often don’t have before-and-after numbers yet. Answer the questions that fit; skip the rest.'
          : 'Add any value that doesn’t show up in your metrics.'}
      </p>
      <div className="space-y-4">
        {type.suggestedLenses.map(lensField)}
        {showMoreLenses && otherLensIds.map(lensField)}
        <button className="text-xs font-semibold text-dell-blue hover:underline" onClick={() => setShowMoreLenses((s) => !s)}>
          {showMoreLenses ? 'Show fewer questions' : '+ More ways to describe value'}
        </button>
        <div>
          <label className="field-label" htmlFor="other-impact">Any other impact?</label>
          <textarea
            id="other-impact"
            className="field-input min-h-[60px]"
            maxLength={400}
            value={step3.qualitativeImpact}
            onChange={(e) => update({ qualitativeImpact: e.target.value })}
            onBlur={save}
          />
          <div className="mt-1 text-right text-xs text-gray-400">{step3.qualitativeImpact.length}/400</div>
          <ul className="mt-1 space-y-0.5 text-xs text-gray-500">
            {qualitativePrompts.map((p) => (<li key={p}>• {p}</li>))}
          </ul>
        </div>
      </div>
    </div>
  )

  const calculatorSection = (
    <div className="mt-6">
      <h2 className="mb-1 text-sm font-bold text-dell-gray">
        {leadsWithLenses ? 'Have any numbers? Add them (optional)' : 'ROI Calculator'}
      </h2>
      <p className="mb-2 text-xs text-gray-500">Rows left blank won't appear in your deck.</p>
      <div className="space-y-3">
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
      </div>
      {step3.metrics.length < 5 && (
        <button className="btn-secondary mt-3" onClick={addMetric}>+ Add Another Metric</button>
      )}
    </div>
  )

  return (
    <div>
      <StepProgress current={3} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
        <div>
          <h1 className="text-2xl font-bold text-dell-gray">What's the Impact?</h1>

          <ExampleToggle>
            {example.metrics && (
              <table className="w-full text-xs">
                <thead><tr className="text-left text-gray-500"><th className="pb-1">Metric</th><th className="pb-1">Before</th><th className="pb-1">After</th><th className="pb-1">Impact</th></tr></thead>
                <tbody>
                  {example.metrics.map((m) => (
                    <tr key={m.metric}><td className="pr-2 font-semibold">{m.metric}</td><td className="pr-2">{m.before}</td><td className="pr-2">{m.after}</td><td>{m.impact}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
            {example.lenses && valueLenses.filter((l) => example.lenses?.[l.id]).map((l) => (
              <p key={l.id} className="mt-1"><strong>{l.deckLabel}:</strong> {example.lenses?.[l.id]}</p>
            ))}
            <p className="mt-2"><strong>Impact statement:</strong> {example.impactStatement}</p>
          </ExampleToggle>

          <div className="mt-4 rounded-md bg-dell-gray-light p-3 text-xs text-gray-500">{roiFormulaNote}</div>

          <div className="mt-6 rounded-lg border border-gray-200 p-4">
            <h2 className="mb-2 text-sm font-bold text-dell-gray">Has the impact been measured yet?</h2>
            <div className="flex flex-wrap gap-2">
              {([['measured', 'Yes, it’s measurable now'], ['expected', 'Not yet, it’s still emerging']] as const).map(([value, label]) => (
                <button
                  key={value}
                  aria-pressed={step3.impactStage === value}
                  onClick={() => { update({ impactStage: value }); save() }}
                  className={`rounded-md border px-4 py-1.5 text-sm font-semibold ${step3.impactStage === value ? 'border-dell-blue bg-dell-tip text-dell-blue' : 'border-gray-300 text-gray-500 hover:border-dell-blue/50'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            {isExpected && (
              <p className="mt-2 text-xs text-gray-500">Your deck will present this as <strong>expected impact</strong>. Use estimates where you can, mark them as estimates, and say what would confirm them.</p>
            )}
          </div>

          {leadsWithLenses ? (<>{valueSection}{calculatorSection}</>) : (<>{calculatorSection}{valueSection}</>)}

          <div className="mt-6 rounded-lg border border-gray-200 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-bold text-dell-gray">Impact Statement</h2>
              <button className="text-xs font-semibold text-dell-blue hover:underline" onClick={handleGenerate}>
                {firstValidMetric ? 'Auto-fill from metrics' : 'Start from a template'}
              </button>
            </div>
            <p className="mb-2 text-xs text-gray-500">One or two sentences that sum up the value. This is the headline on your impact slide.</p>
            <textarea
              className="field-input min-h-[90px]"
              value={step3.impactStatement}
              onChange={(e) => update({ impactStatement: e.target.value })}
              onBlur={save}
              placeholder={isExpected
                ? 'If adopted, this project is expected to [impact], which would let [stakeholder] ...'
                : 'This project [reduced/improved/enabled] [what], resulting in [impact]. This means [stakeholder] can now ...'}
            />
          </div>

          <Navigation onBack={handleBack} onNext={handleNext} onSave={save} saved={!!data.lastSaved} />
        </div>

        <div className="order-first lg:order-none"><GuidancePanel tips={TIPS} /></div>
      </div>
    </div>
  )
}
