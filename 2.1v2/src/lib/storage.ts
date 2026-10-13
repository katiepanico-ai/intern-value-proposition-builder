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
    step1: { projectTitle: '', description: '', stakeholder: '', keyOutcome: '', strengthChecklist: [false, false, false, false, false] },
    step2: { selectedPriorities: [], customPriority: '', articulation: '' },
    step3: { metrics: [emptyMetric()], qualitativeImpact: '', impactStatement: '' },
    step4: {
      isScalable: '',
      scaleWhere: '',
      scaleChecklist: [],
      scaleRequirements: '',
      isAutomatable: '',
      automationDetails: '',
      resourcesNeeded: '',
    },
    step5: { recommendation: '', ownership: '', closingStatement: '', strengthChecklist: [false, false, false, false, false] },
    lastSaved: '',
    currentStep: 1,
  }
}

export function loadProgress(): AppData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AppData
    // Guard against a corrupted or partial record from an older version.
    return { ...emptyAppData(), ...parsed }
  } catch {
    return null
  }
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

// ---------- Export / Import (portable backup, works across devices/browsers) ----------

const EXPORT_SCHEMA = 'ivpb-progress-export-v1'

interface ExportedFile {
  schema: typeof EXPORT_SCHEMA
  exportedAt: string
  data: AppData
}

function safeFileNamePart(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return 'intern'
  return trimmed.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '') || 'intern'
}

/**
 * Triggers a browser download of the current progress as a small .json file
 * the intern can keep, email to themselves, or re-import later — the only
 * way to carry progress between devices/browsers since everything else is
 * localStorage-only.
 */
export function exportProgressToFile(data: AppData): void {
  const payload: ExportedFile = {
    schema: EXPORT_SCHEMA,
    exportedAt: new Date().toISOString(),
    data,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const dateStr = new Date().toISOString().slice(0, 10)
  const fileName = `${safeFileNamePart(data.internInfo.name)}_VP_progress_${dateStr}.json`

  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export interface ImportResult {
  ok: boolean
  data?: AppData
  error?: string
}

/**
 * Parses a previously exported .json file's text content back into AppData.
 * Deliberately forgiving: as long as it's valid JSON with a data object, it's
 * merged over a fresh emptyAppData() so a partial/older file doesn't crash
 * the app — same defensive pattern as loadProgress().
 */
export function parseImportedProgress(fileText: string): ImportResult {
  try {
    const parsed = JSON.parse(fileText)
    const data: AppData | undefined = parsed?.data ?? (parsed?.internInfo ? parsed : undefined)
    if (!data || typeof data !== 'object') {
      return { ok: false, error: "That file doesn't look like a Value Proposition progress export." }
    }
    return { ok: true, data: { ...emptyAppData(), ...data } }
  } catch {
    return { ok: false, error: "Couldn't read that file — make sure it's the .json file exported from this app." }
  }
}
