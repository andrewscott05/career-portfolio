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
      'Thousands of routine status calls a month, every one landing on a human.',
    build:
      'A voice agent wired through the integration platform I own, handling updates, check-ins, and scheduling end to end.',
    result:
      '20K+ tasks a month handled without a person, freeing the team for the calls that need judgment.',
  },
  {
    id: 'spot-quoting',
    title: 'Quotes that write themselves',
    tag: 'PRICING AUTOMATION',
    problem:
      'Manual pricing was slow and capped how much business the team could win.',
    build:
      'Three years leading GTM for an automated quoting platform, close to both sales and engineering.',
    result:
      'Revenue grew from $180M to $300M+, with $227M of it flowing through fully automated quotes.',
  },
]

/* Secondary project — dark ink strip. */
export const developerPortal: SecondaryProject = {
  id: 'developer-portal',
  title: 'Developer Portal',
  description:
    'External APIs from concept to launch. The Rate API is the engine behind the automated quoting above.',
  href: 'https://developer.arrivenow.com/',
}
