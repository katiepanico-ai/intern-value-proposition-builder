import type { ProjectType, ValueLensId } from '../types'
import { step1Example, step3Example, step5Example } from './examples'

// Project types an intern picks in Step 1. The choice tailors examples and
// decides how Step 3 asks about value (see ValueLens below).
export interface ProjectTypeOption {
  id: Exclude<ProjectType, ''>
  label: string
  hint: string
  // Value lenses suggested first for this type. "delivery" projects lead with
  // the before/after ROI calculator instead, so they get none by default.
  suggestedLenses: ValueLensId[]
}

export const projectTypes: ProjectTypeOption[] = [
  { id: 'delivery', label: 'Built or improved a process or tool', hint: 'You delivered something that is in use or ready to use.', suggestedLenses: [] },
  { id: 'research', label: 'Research or evaluation', hint: 'You investigated a question, compared options, or assessed something.', suggestedLenses: ['learning', 'decision', 'risk'] },
  { id: 'ai', label: 'AI or automation pilot', hint: 'You prototyped or tested an AI or automation idea.', suggestedLenses: ['capability', 'projected', 'risk'] },
  { id: 'analytics', label: 'Analytics or reporting', hint: 'You built a dashboard, analysis, model, or report.', suggestedLenses: ['decision', 'capability', 'projected'] },
  { id: 'testing', label: 'Testing or proof of concept', hint: 'You tested whether something works before a bigger investment.', suggestedLenses: ['risk', 'learning', 'decision'] },
]

export function projectTypeFor(id: ProjectType): ProjectTypeOption {
  return projectTypes.find((t) => t.id === id) || projectTypes[0]
}

// Alternative ROI framework for work without hard before/after numbers.
// Each lens is a different, legitimate kind of business value.
export interface ValueLens {
  id: ValueLensId
  question: string
  hint: string
  deckLabel: string // heading used on slide 4 and in the review
}

export const valueLenses: ValueLens[] = [
  { id: 'learning', question: 'What did we learn?', hint: 'What question did this answer, or what do we now know that we didn’t before?', deckLabel: 'What We Learned' },
  { id: 'decision', question: 'What decision does this inform?', hint: 'Which decision can leadership now make faster or with more confidence?', deckLabel: 'Decision Informed' },
  { id: 'risk', question: 'What risk did this reduce?', hint: 'Did it catch a problem early, rule out a costly option, or reduce uncertainty before a bigger investment?', deckLabel: 'Risk Reduced' },
  { id: 'capability', question: 'What capability did this build?', hint: 'A new tool, dataset, model, method, or skill the team can reuse.', deckLabel: 'Capability Built' },
  { id: 'projected', question: 'What impact is expected if this is adopted?', hint: 'Your best estimate of the impact if this moves forward. Say clearly that it’s an estimate.', deckLabel: 'Expected Impact if Adopted' },
]

// ---------- Examples tailored to each project type ----------
// Illustrative only: names and figures are invented to show the style.

export interface TypedExample {
  step1: { projectTitle: string; description: string; stakeholder: string; keyOutcome: string }
  step3: {
    metrics?: { metric: string; before: string; after: string; impact: string }[]
    lenses?: Partial<Record<ValueLensId, string>>
    impactStatement: string
  }
  step5: { recommendation: string; ownership: string; closingStatement: string }
}

export const examplesByType: Record<Exclude<ProjectType, ''>, TypedExample> = {
  delivery: {
    step1: step1Example,
    step3: { metrics: step3Example.metrics, impactStatement: step3Example.impactStatement },
    step5: step5Example,
  },
  research: {
    step1: {
      projectTitle: 'Evaluation of Supplier Risk Scoring Approaches',
      description: 'Compared three approaches for scoring supplier risk using 18 months of Global Ops data, and identified which signals best predict late deliveries.',
      stakeholder: 'Global Supply Chain Risk team',
      keyOutcome: 'A recommendation on which scoring approach to pilot, backed by a side-by-side comparison of all three.',
    },
    step3: {
      lenses: {
        learning: 'Two of the five signals the team relied on had little predictive value; lead-time variability and on-time history were the strongest.',
        decision: 'Gives the risk team the evidence to choose one approach for a Q1 pilot instead of building all three.',
        risk: 'Avoids investing in a full build of an approach that underperformed in testing.',
      },
      impactStatement: 'This evaluation narrowed three options to one evidence-backed choice, so the Supply Chain Risk team can launch a focused pilot in Q1 instead of spending months building and comparing all three.',
    },
    step5: {
      recommendation: 'I recommend the Supply Chain Risk team pilot the lead-time-variability approach with 50 strategic suppliers in Q1, measuring prediction accuracy against actual late deliveries.',
      ownership: 'The Supply Chain Risk analytics lead is the natural owner; the analysis and documentation are ready to hand off.',
      closingStatement: 'We now know which signal actually predicts supplier risk. The next step is proving it at scale.',
    },
  },
  ai: {
    step1: {
      projectTitle: 'AI Assistant Pilot for Order Status Inquiries',
      description: 'Built and tested a prototype AI assistant, using approved internal tools, that drafts replies to common order-status questions for the support team.',
      stakeholder: 'Customer Support Operations',
      keyOutcome: 'A working prototype tested on 200 past inquiries, with accuracy results and a list of question types it handles well.',
    },
    step3: {
      lenses: {
        capability: 'A tested prompt set and evaluation method the team can reuse for future AI use cases.',
        projected: 'If adopted for the top three inquiry types, testing suggests agents could save a few minutes per ticket (estimate, to be confirmed in a live pilot).',
        risk: 'Identified the question types where the assistant made errors, so a pilot can exclude them from day one.',
      },
      impactStatement: 'This pilot showed where AI can reliably speed up order-status replies, and where it shouldn’t be used yet, giving Customer Support a low-risk path to a live trial.',
    },
    step5: {
      recommendation: 'I recommend a 6-week supervised pilot with one support team, limited to the three inquiry types where the prototype performed best, with agents reviewing every draft.',
      ownership: 'Owner not yet confirmed: the Support Operations tooling team or the AI enablement team are the likely owners. The decision needed is which team sponsors the pilot.',
      closingStatement: 'The prototype proved where AI helps. A supervised pilot will prove how much.',
    },
  },
  analytics: {
    step1: {
      projectTitle: 'Regional Fulfillment Performance Dashboard',
      description: 'Combined fulfillment data from three regional reports into one Power BI dashboard showing on-time performance by site and carrier.',
      stakeholder: 'Regional Fulfillment Managers',
      keyOutcome: 'One shared view of fulfillment performance, replacing three separately maintained spreadsheets.',
    },
    step3: {
      lenses: {
        decision: 'Managers can now spot underperforming carriers each week instead of at month-end review.',
        capability: 'A reusable data model other regions can connect to.',
        projected: 'Retiring the three manual reports could free an estimated 6 hours per week of analyst time (estimate).',
      },
      impactStatement: 'This dashboard gives fulfillment managers a weekly, shared view of carrier performance, so issues get addressed in days rather than at month-end.',
    },
    step5: {
      recommendation: 'I recommend the fulfillment team adopt the dashboard as the standard weekly review and retire the three legacy spreadsheets by end of quarter.',
      ownership: 'The Fulfillment Analytics team should own the data refresh; they would need edit access to the workspace and about 2 hours of handoff training.',
      closingStatement: 'One dashboard, three reports retired, and carrier issues caught weeks sooner.',
    },
  },
  testing: {
    step1: {
      projectTitle: 'Proof of Concept: Automated Order Entry Testing',
      description: 'Built a proof of concept that runs 40 of the most common order-entry test cases automatically, to check whether automation is viable before the next system release.',
      stakeholder: 'Order Management QA team',
      keyOutcome: 'Proof that 40 core test cases can run automatically, plus a list of the cases that can’t yet.',
    },
    step3: {
      lenses: {
        risk: 'Found 2 defects in the test environment before the release cycle started.',
        learning: 'Confirmed which test cases are stable enough to automate and which still depend on manual setup.',
        decision: 'Gives QA the evidence to decide whether to fund full test automation for the next release.',
      },
      impactStatement: 'This proof of concept showed that core order-entry testing can be automated, giving QA the evidence to decide on full automation before the next release.',
    },
    step5: {
      recommendation: 'I recommend QA expand automation to the full regression suite for the next release, starting with the 40 proven cases.',
      ownership: 'The QA automation lead should own the scripts; the code and setup guide are documented in the team repository.',
      closingStatement: '40 test cases proven and 2 defects caught early. Automation is ready for the next release.',
    },
  },
}

export function exampleFor(type: ProjectType): TypedExample {
  return examplesByType[type || 'delivery']
}
