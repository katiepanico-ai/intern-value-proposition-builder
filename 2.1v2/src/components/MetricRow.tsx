import type { Metric, MetricType } from '../types'
import { unitForType, computeImpact } from '../lib/metrics'

const METRIC_TYPES: MetricType[] = [
  'Time Saved (hours/days)',
  'Cost Reduced ($)',
  'Revenue Influenced ($)',
  'Error Rate Reduced (%)',
  'Process Steps Eliminated (#)',
  'People or Teams Impacted (#)',
  'Other (specify)',
]

interface Props {
  metric: Metric
  index: number
  canRemove: boolean
  onChange: (next: Metric) => void
  onRemove: () => void
}

export default function MetricRow({ metric, index, canRemove, onChange, onRemove }: Props) {
  const impact = computeImpact(metric)

  const update = (patch: Partial<Metric>) => onChange({ ...metric, ...patch })

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Metric {index + 1}</span>
        {canRemove && (
          <button onClick={onRemove} className="text-xs font-semibold text-red-600 hover:underline">Remove</button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <label className="field-label">Metric type</label>
          <select
            className="field-input"
            value={metric.type}
            onChange={(e) => {
              const type = e.target.value as MetricType
              update({ type, unit: unitForType[type] })
            }}
          >
            {METRIC_TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
          </select>
        </div>
        <div>
          <label className="field-label">Before</label>
          <input type="number" className="field-input" value={metric.before} onChange={(e) => update({ before: e.target.value })} />
        </div>
        <div>
          <label className="field-label">After</label>
          <input type="number" className="field-input" value={metric.after} onChange={(e) => update({ after: e.target.value })} />
        </div>
      </div>
      {metric.type === 'Other (specify)' && (
        <div className="mt-3">
          <label className="field-label">Custom metric name</label>
          <input className="field-input" value={metric.customName} onChange={(e) => update({ customName: e.target.value })} placeholder="e.g. Support tickets deflected" />
        </div>
      )}
      <div className="mt-3">
        <label className="field-label">Unit</label>
        <input className="field-input max-w-xs" value={metric.unit} onChange={(e) => update({ unit: e.target.value })} />
      </div>
      {impact.hasValues && (
        <div className={`mt-3 inline-block rounded-md px-3 py-1.5 text-sm font-semibold ${impact.isImprovement ? 'bg-strength-green/10 text-strength-green' : 'bg-strength-red/10 text-strength-red'}`}>
          {impact.label}
        </div>
      )}
    </div>
  )
}
