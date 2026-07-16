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

/* Featured case studies — "Built & shipped" cards.
   Claims kept in sync with the resume (public/resume.pdf). */
export const projects: CaseStudy[] = [
  {
    id: 'bob-ai-voice',
    title: 'A voice agent answers the routine calls',
    tag: 'VOICE AUTOMATION',
    problem:
      'The highest-volume inbound requests all landed on a person, with no coverage outside business hours.',
    build:
      "The company's first AI voice agent, from roadmap to launch — 10+ automated workflows across status tracking, document collection, and inbound call handling.",
    result:
      'The two highest-volume request types fully automated, cutting manual workload ~20% and moving the team toward 24/7 coverage.',
  },
  {
    id: 'spot-quoting',
    title: 'Pricing that writes itself',
    tag: 'PRICING AUTOMATION',
    problem:
      'Manual pricing was slow and capped how much business the team could win.',
    build:
      "Launched the business's first automated, ML-driven pricing capability, leading GTM close to both sales and engineering.",
    result:
      'Segment revenue scaled 2.3x, from ~$170M to a $400M+ run rate — now ~10% of total company revenue.',
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
