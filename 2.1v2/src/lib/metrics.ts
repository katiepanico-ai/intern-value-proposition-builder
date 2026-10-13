import type { Metric, MetricType } from '../types'

// Auto-suggested unit per metric type, shown next to Before/After inputs.
export const unitForType: Record<MetricType, string> = {
  'Time Saved (hours/days)': 'hours',
  'Cost Reduced ($)': 'dollars',
  'Revenue Influenced ($)': 'dollars',
  'Error Rate Reduced (%)': 'percent',
  'Process Steps Eliminated (#)': 'steps',
  'People or Teams Impacted (#)': 'people',
  'Other (specify)': 'units',
}

export interface MetricImpact {
  hasValues: boolean
  diff: number
  percent: number | null
  isImprovement: boolean
  label: string // e.g. "3 days saved (60% reduction)"
  metricLabel: string
}

export function computeImpact(m: Metric): MetricImpact {
  const before = parseFloat(m.before)
  const after = parseFloat(m.after)
  const metricLabel = m.type === 'Other (specify)' ? (m.customName || 'Metric') : m.type.replace(/\s*\([^)]*\)/, '')

  if (isNaN(before) || isNaN(after)) {
    return { hasValues: false, diff: 0, percent: null, isImprovement: true, label: '', metricLabel }
  }

  const diff = after - before
  const percent = before !== 0 ? Math.round((Math.abs(diff) / Math.abs(before)) * 100) : null

  // For most metric types "improvement" means the number went down
  // (time, cost, errors, steps). For revenue and people impacted, up is better.
  const higherIsBetter = m.type === 'Revenue Influenced ($)' || m.type === 'People or Teams Impacted (#)'
  const isImprovement = higherIsBetter ? diff >= 0 : diff <= 0

  const direction = diff === 0 ? 'no change' : isImprovement ? (higherIsBetter ? 'increase' : 'reduction') : (higherIsBetter ? 'decrease' : 'increase')
  const absDiff = Math.abs(diff)
  const unit = m.unit || unitForType[m.type]
  const pctPart = percent !== null ? ` (${percent}% ${direction})` : ''
  const label = `${absDiff} ${unit} ${higherIsBetter ? 'gained' : 'saved'}${pctPart}`

  return { hasValues: true, diff, percent, isImprovement, label, metricLabel }
}
