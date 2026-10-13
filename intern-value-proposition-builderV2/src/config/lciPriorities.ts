import type { LciPriority } from '../types'

// Editable list of Dell LCI (business ambition) priorities shown as
// selectable cards on Step 2. Update this file to change what interns
// can map their project to — nothing else needs to change.
export const lciPriorities: LciPriority[] = [
  {
    id: 'infrastructure-edge',
    name: 'Intelligent Infrastructure and Edge Solutions',
    description: 'Building the foundation for modern IT',
    icon: '🖥️',
  },
  {
    id: 'ai-data',
    name: 'AI and Data-Driven Innovation',
    description: 'Using data and AI to drive smarter decisions',
    icon: '🤖',
  },
  {
    id: 'multicloud',
    name: 'Multi-Cloud and As-a-Service',
    description: 'Flexible consumption and cloud solutions',
    icon: '☁️',
  },
  {
    id: 'security',
    name: 'Security and Zero Trust',
    description: 'Protecting data and operations everywhere',
    icon: '🔒',
  },
  {
    id: 'workforce',
    name: 'Workforce Transformation and Productivity',
    description: 'Empowering people to do their best work',
    icon: '🚀',
  },
  {
    id: 'supply-chain',
    name: 'Supply Chain Optimization',
    description: 'Making our supply chain faster and smarter',
    icon: '📦',
  },
  {
    id: 'sustainability',
    name: 'Sustainability and ESG',
    description: 'Driving positive environmental and social impact',
    icon: '🌱',
  },
  {
    id: 'customer-experience',
    name: 'Customer Experience and Growth',
    description: 'Winning and keeping customers',
    icon: '🤝',
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Doesn\u2019t fit neatly above? Describe it in your own words',
    icon: '✏️',
  },
]
