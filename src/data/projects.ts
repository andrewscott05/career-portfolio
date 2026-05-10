export interface Project {
  id: string
  title: string
  subtitle?: string
  description: string
  href?: string
  external?: boolean
  metrics?: string
}

export const projects: Project[] = [
  {
    id: 'bob-ai-voice',
    title: 'Bob',
    subtitle: 'AI Voice & Communications Agent',
    description:
      'Production AI agent handling carrier workflows like tracking updates, appointment scheduling, and check calls. Integrated via the Agent Integration Service (AGIS) I own.',
    metrics: '20K+ automated tasks/month and scaling.',
  },
  {
    id: 'developer-portal',
    title: 'Arrive Developer Portal',
    subtitle: 'External API platform',
    description:
      'External-facing API platform I PMed from concept to launch. Includes the Rate API powering automated spot quoting and the Carrier Available Loads API.',
    href: 'https://developer.arrivenow.com/',
    external: true,
  },
  {
    id: 'spot-quoting',
    title: 'Spot Quoting & Automation Platform',
    subtitle: 'GTM & revenue growth',
    description:
      'Led GTM strategy across 2 to 3 years. Revenue grew from $180M to $300M+, with $227M from automated processes contributing 10% of total company revenue.',
  },
  {
    id: 'ai-agent-expansion',
    title: 'AI Agent Expansion',
    subtitle: 'Active initiatives',
    description:
      'Initiatives across inbound inquiry reduction (7,500+ monthly accounting/carrier calls), carrier sourcing, coverage, and scheduling automation.',
  },
  {
    id: 'ai-enablement',
    title: 'AI Enablement Program',
    subtitle: 'Generative AI adoption',
    description:
      'Built and rolled out generative AI user guides (Cursor, Gemini) adopted by 10+ PMs for self-serve data exploration and AI-augmented workflows.',
  },
]
