import type { AppData, Metric } from '../types'

const STORAGE_KEY = 'ivpb:progress'

export function emptyMetric(): Metric {
  return {
    id: Math.random().toString(36).slice(2, 9),
    type: 'Time Saved (hours/days)',
    customName: '',
    before: '',
    after: '',
    unit: 'hours',
  }
}

export function emptyAppData(): AppData {
  return {
    internInfo: { name: '', team: '', manager: '' },
    step1: { projectType: '', projectTitle: '', description: '', stakeholder: '', keyOutcome: '', strengthChecklist: [false, false, false, false, false] },
    step2: { selectedPriorities: [], customPriority: '', articulation: '' },
    step3: { metrics: [emptyMetric()], valueLenses: {}, qualitativeImpact: '', impactStatement: '', impactStage: 'measured' },
    step4: {
      isScalable: '',
      scaleWhere: '',
      scaleChecklist: [],
      scaleRequirements: '',
      isAutomatable: '',
      automationDetails: '',
      resourcesNeeded: '',
    },
    step5: { recommendation: '', ownership: '', ownershipUndecided: false, closingStatement: '', strengthChecklist: [false, false, false, false, false] },
    lastSaved: '',
    currentStep: 1,
  }
}

export function loadProgress(): AppData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<AppData>
    return migrate(parsed)
  } catch {
    return null
  }
}

// Fill in any fields added since the intern's progress was saved, so older
// saved progress keeps working. Each step is merged separately because a
// top-level merge alone would drop new fields inside the steps.
export function migrate(parsed: Partial<AppData>): AppData {
  const base = emptyAppData()
  const data: AppData = {
    ...base,
    ...parsed,
    internInfo: { ...base.internInfo, ...parsed.internInfo },
    step1: { ...base.step1, ...parsed.step1 },
    step2: { ...base.step2, ...parsed.step2 },
    step3: { ...base.step3, ...parsed.step3 },
    step4: { ...base.step4, ...parsed.step4 },
    step5: { ...base.step5, ...parsed.step5 },
  }
  // Step 4 used to ask "What would need to happen to scale this?" separately
  // from "What resources would be needed?". They're now one question, so move
  // any earlier answer across instead of losing it.
  const req = data.step4.scaleRequirements.trim()
  if (req && !data.step4.resourcesNeeded.includes(req)) {
    data.step4.resourcesNeeded = [req, data.step4.resourcesNeeded.trim()].filter(Boolean).join(' ')
  }
  data.step4.scaleRequirements = ''
  return data
}

export function saveProgress(data: AppData): void {
  try {
    const withTimestamp: AppData = { ...data, lastSaved: new Date().toISOString() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(withTimestamp))
  } catch {
    // localStorage can fail (private browsing, quota, disabled) — fail silently,
    // the intern can still keep working and export at the end.
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function hasSavedProgress(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null
  } catch {
    return false
  }
}
