import type { PromptCardData } from '../types'

// All content for the AI Prompt Library page. These are static, pre-written
// starter prompts interns can copy into an approved external AI tool —
// this app never calls an AI API itself.
export const promptLibrary: PromptCardData[] = [
  {
    category: 'Project Framing',
    icon: '🧭',
    note: 'Use this first, before you\u2019ve settled on how to describe your project.',
    prompts: [
      "I completed [project description]. Help me explain how this adds value to a Fortune 500 technology company's business strategy.",
      'Rewrite this project description to sound more strategic and executive-ready: [paste description]',
    ],
  },
  {
    category: 'LCI / Strategy Alignment',
    icon: '🏛️',
    note: 'Use this while working through Step 2 if you\u2019re stuck on the articulation.',
    prompts: [
      'Here is Dell\u2019s strategic framework: [paste summary]. How does my project on [topic] align with these priorities?',
      'Help me articulate how [my project] supports [strategic priority] in 2-3 sentences.',
    ],
  },
  {
    category: 'ROI and Impact',
    icon: '📈',
    note: 'Use this in Step 3 if you have rough numbers but aren\u2019t sure how to frame them.',
    prompts: [
      'My project saved approximately [X hours/dollars]. Help me frame this as a business ROI statement for a leadership presentation.',
      "I don't have exact numbers, but my project improved [process]. Help me estimate the potential quantitative impact.",
      'My project was [research / an AI pilot / a proof of concept] on [topic]. It has no before-and-after numbers yet. Help me describe its value in terms of what we learned, what decision it informs, what risk it reduced, and what it would deliver if adopted.',
    ],
  },
  {
    category: 'Scalability',
    icon: '🌐',
    note: 'Use this in Step 4 to stress-test how far your project could realistically go.',
    prompts: [
      'Can you help me think through whether my project on [topic] could be scaled across multiple teams or geographies? What would need to be true?',
      'What are the key considerations for scaling a [type of project] across a global organization?',
    ],
  },
  {
    category: 'Automation',
    icon: '⚙️',
    note: 'Use this in Step 4 if you\u2019re not sure what could be automated.',
    prompts: [
      'What parts of my process for [project] could potentially be automated? What tools or approaches would you recommend?',
      'Help me describe the automation potential of [process] for a non-technical leadership audience.',
    ],
  },
  {
    category: 'Presentation Structure',
    icon: '🗂️',
    note: 'Use this once you\u2019ve exported your deck and are planning how to deliver it.',
    prompts: [
      'Help me create a 5-slide outline for my internship project presentation to senior leadership.',
      'I need to present [project] in 10 minutes to a VP. Help me structure my talking points.',
    ],
  },
  {
    category: 'Executive Summary',
    icon: '📝',
    note: 'Use this to tighten your opening before you present.',
    prompts: [
      'Write a 3-sentence executive summary of my project that a VP would find compelling: [paste details]',
    ],
  },
  {
    category: 'Q&A Prep',
    icon: '❓',
    note: 'Use this the night before your presentation.',
    prompts: [
      'What tough questions might a senior leader ask about my project on [topic]? Help me prepare answers.',
      'What are potential objections or risks a leader might raise about [project]? How should I respond?',
    ],
  },
  {
    category: 'Storytelling',
    icon: '🎤',
    note: 'Use this to make your data land with a non-technical audience.',
    prompts: [
      'Help me turn this data [paste data] into a compelling narrative for a non-technical audience.',
      'Help me write an opening hook for my presentation about [project] that grabs attention.',
    ],
  },
]
