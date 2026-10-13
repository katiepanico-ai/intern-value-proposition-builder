import type { AppData } from '../types'

// Shared 0-100 completion scoring per step, used by both the journey map
// (Landing) and each step page's "% complete" readout, so the two always
// agree with each other and with the Review page's own checks.

export function step1Percent(d: AppData): number {
  const checks = [d.step1.projectTitle.trim(), d.step1.description.trim(), d.step1.stakeholder.trim(), d.step1.keyOutcome.trim()]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

export function step2Percent(d: AppData): number {
  const hasPriority = d.step2.selectedPriorities.length > 0
  const hasArticulation = d.step2.articulation.trim() !== ''
  return Math.round(((hasPriority ? 1 : 0) + (hasArticulation ? 1 : 0)) / 2 * 100)
}

export function step3Percent(d: AppData): number {
  const hasMetric = d.step3.metrics.some((m) => m.before !== '' && m.after !== '')
  const hasQualitative = d.step3.qualitativeImpact.trim() !== ''
  const hasData = hasMetric || hasQualitative
  const hasStatement = d.step3.impactStatement.trim() !== ''
  return Math.round(((hasData ? 1 : 0) + (hasStatement ? 1 : 0)) / 2 * 100)
}

export function step4Percent(d: AppData): number {
  const checks = [d.step4.isScalable !== '', d.step4.isAutomatable !== '', d.step4.resourcesNeeded.trim() !== '']
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

export function step5Percent(d: AppData): number {
  const checks = [d.step5.recommendation.trim(), d.step5.ownership.trim(), d.step5.closingStatement.trim()]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

export function allStepPercents(d: AppData): number[] {
  return [step1Percent(d), step2Percent(d), step3Percent(d), step4Percent(d), step5Percent(d)]
}

export function overallPercent(d: AppData): number {
  const pcts = allStepPercents(d)
  return Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length)
}
