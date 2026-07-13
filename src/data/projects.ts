export interface CaseStudy {
  id: string
  title: string
  tag: string
  problem: string
  build: string
  result: string
}

export interface SecondaryProject {
  id: string
  title: string
  description: string
  href: string
}

/* Featured case studies — "Built & shipped" cards (copy verbatim from #3a). */
export const projects: CaseStudy[] = [
  {
    id: 'bob-ai-voice',
    title: 'Bob answers the routine calls',
    tag: 'VOICE AUTOMATION',
    problem:
      'Thousands of routine status requests a month, every one landing on a person.',
    build:
      'A voice agent wired through a custom integration platform, handling updates, check-ins, and scheduling end to end.',
    result:
      '20K+ tasks a month handled without a person, freeing the team for the conversations that need judgment.',
  },
  {
    id: 'spot-quoting',
    title: 'Quotes that write themselves',
    tag: 'PRICING AUTOMATION',
    problem:
      'Manual pricing was slow and capped how much business the team could win.',
    build:
      'Three years leading GTM for an automated pricing platform, close to both sales and engineering.',
    result:
      'Revenue grew from $180M to $300M+, with $227M of it flowing through fully automated pricing.',
  },
]

/* Secondary project — dark ink strip. */
export const developerPortal: SecondaryProject = {
  id: 'developer-portal',
  title: 'Developer Portal',
  description:
    'External APIs from concept to launch — the pricing engine behind the automation above.',
  href: 'https://developer.arrivenow.com/',
}
