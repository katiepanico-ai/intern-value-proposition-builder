// Core data model for the Intern Value Proposition Builder.
// This entire shape is what gets persisted to localStorage under one key
// (see lib/storage.ts) and is what pptxExport.ts reads to build the deck.

export interface InternInfo {
  name: string
  team: string
  manager: string
}

export interface Step1Data {
  projectTitle: string
  description: string
  stakeholder: string
  keyOutcome: string
  strengthChecklist: boolean[] // 5 items, see StrengthChecker
}

export interface Step2Data {
  selectedPriorities: string[] // ids of LciPriority
  customPriority: string
  articulation: string
}

export type MetricType =
  | 'Time Saved (hours/days)'
  | 'Cost Reduced ($)'
  | 'Revenue Influenced ($)'
  | 'Error Rate Reduced (%)'
  | 'Process Steps Eliminated (#)'
  | 'People or Teams Impacted (#)'
  | 'Other (specify)'

export interface Metric {
  id: string
  type: MetricType
  customName: string
  before: string
  after: string
  unit: string
}

export interface Step3Data {
  metrics: Metric[]
  qualitativeImpact: string
  impactStatement: string
}

export interface Step4Data {
  isScalable: 'Yes' | 'No' | 'Not Sure' | ''
  scaleWhere: string
  scaleChecklist: string[]
  scaleRequirements: string
  isAutomatable: 'Yes' | 'No' | 'Not Sure' | ''
  automationDetails: string
  resourcesNeeded: string
}

export interface Step5Data {
  recommendation: string
  ownership: string
  closingStatement: string
  strengthChecklist: boolean[] // 5 items
}

export interface AppData {
  internInfo: InternInfo
  step1: Step1Data
  step2: Step2Data
  step3: Step3Data
  step4: Step4Data
  step5: Step5Data
  lastSaved: string // ISO timestamp
  currentStep: number
}

export interface LciPriority {
  id: string
  name: string
  description: string
  icon: string
}

export interface PromptCardData {
  category: string
  icon: string
  prompts: string[]
  note: string
}
