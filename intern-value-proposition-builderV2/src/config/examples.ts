// All static example/tip content for the guidance panels, example toggles,
// and translation call-outs across the 5 steps. Centralized here so the
// coaching language can be updated without touching component code.

export const step1Example = {
  projectTitle: 'Global Ops Invoice Processing Automation',
  description:
    'Designed and tested an automated workflow to reduce manual invoice processing steps for the EMEA procurement team, cutting average processing time from 5 days to 2 days.',
  stakeholder: 'EMEA Procurement Team',
  keyOutcome: 'Reduced invoice processing time by 60% and eliminated 3 manual handoff steps.',
}

// "Novice Pitch vs. Executive Translation" — the core reframe interns need
// to internalize before writing anything: don't list activities, translate them.
export const translationPairs = [
  { novice: 'I cleaned 10,000 rows of data.', executive: 'I created a real-time visibility tool that eliminates manual reporting.' },
  { novice: 'I finished my assigned project on time.', executive: 'I automated a data pipeline, saving the team 10 hours per week.' },
  { novice: 'Here is the dashboard I built.', executive: 'I built a scalable framework ready for the Q3 rollout.' },
]

export const step2Example = {
  selectedPriority: 'Supply Chain Optimization',
  articulation:
    "By automating invoice processing for the EMEA procurement team, this project directly supports Dell's supply chain optimization efforts by reducing cycle times and freeing up procurement staff to focus on strategic vendor relationships.",
}

export const connectionPrompts = [
  { question: 'Does your project make something faster, cheaper, or more reliable?', explanation: 'Efficiency gains are one of the clearest ways leadership sees strategic value.' },
  { question: 'Does it help Dell serve customers better?', explanation: 'Anything that touches customer experience ladders straight up to a business ambition.' },
  { question: 'Does it reduce risk or improve compliance?', explanation: 'Risk reduction is quiet value — it rarely gets noticed unless you name it.' },
  { question: 'Does it free up people to work on higher-value tasks?', explanation: "This is the essence of workforce transformation — automation isn't about replacing people, it's about redirecting them." },
  { question: 'Could leadership point to your project as proof of this strategic priority in action?', explanation: 'If you can answer yes here, you\u2019ve found your strongest angle.' },
]

export const step3Example = {
  metrics: [
    { metric: 'Processing Time', before: '5 days', after: '2 days', impact: '60% reduction' },
    { metric: 'Manual Steps', before: '8 steps', after: '3 steps', impact: '5 steps eliminated' },
  ],
  impactStatement:
    'This automation reduced invoice processing time by 60% and eliminated 5 manual steps, saving the EMEA procurement team an estimated 15 hours per week.',
}

// The ROI formula from the Executive Impact Blueprint: ROI isn't just
// dollars — it's time saved + resources optimized, multiplied by strategic
// impact. Surfaced as a small reminder near the ROI calculator.
export const roiFormulaNote =
  'ROI is not just dollars. It is time, efficiency, and risk mitigation — time saved plus resources optimized, multiplied by strategic impact.'

export const qualitativePrompts = [
  'Did you improve team morale or collaboration?',
  "Did you create a new process that didn't exist before?",
  'Did you build a tool or resource others will use going forward?',
  'Did you uncover insights that changed how the team thinks about something?',
]

export const step4Example = {
  scalability:
    'This invoice automation workflow was built for EMEA procurement, but the same logic could be applied to APAC and Americas teams, potentially saving 45+ hours per week globally.',
  automation:
    'The manual data validation step could be fully automated using Power Automate, eliminating the need for human review on standard invoices.',
}

// The Automation Matrix from the Blueprint: the goal is to push a project
// into "highly automated & highly scalable" — system-agnostic, ready for
// enterprise rollout, not just a one-off manual task.
export const automationMatrixNote =
  'The strongest projects are both automated and scalable — not just a one-off manual task, but something that could run without you and expand beyond your team.'

export const automationSuggestionCards = [
  { title: 'Recurring manual tasks', detail: 'Any step you did repeatedly could potentially be automated with tools like Power Automate, scripts, or macros.' },
  { title: 'Data collection and reporting', detail: 'If you gathered data manually, consider dashboards (Power BI) or automated data pulls.' },
  { title: 'Notifications and approvals', detail: 'Manual email chains or approval processes can often be automated with workflow tools.' },
  { title: 'Templates and checklists', detail: 'Even creating a standardized template is a form of automation — it removes the need to start from scratch.' },
]

export const step5Example = {
  recommendation:
    'I recommend the EMEA procurement team formally adopt this automated workflow and assign a process owner to maintain it. With an estimated 2 weeks of additional configuration, it could be deployed to APAC by Q4.',
  ownership:
    'The EMEA Procurement Operations Manager should own the ongoing maintenance. They would need access to the Power Automate license and approximately 4 hours for training.',
  closingStatement: "A $0 intern project that saves $50K annually in processing time — and it's ready to scale globally.",
}

// The Blueprint's 3-step Implementation Roadmap — used as helper prompts
// on Step 5 so interns think about handoff, integration, and expansion,
// not just "it went well."
export const implementationRoadmapPrompts = [
  { stage: 'The Handoff', detail: 'Is your documentation, training material, or codebase ready to transition to someone else?' },
  { stage: 'The Integration', detail: 'Which team should own this, and how does it fit into their current workflow?' },
  { stage: 'The Expansion', detail: 'What\u2019s the next logical step to scale this — a new region, a new data stream, a Q4 rollout?' },
]
