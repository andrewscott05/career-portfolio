/* Case studies follow a narrative skeleton: summary → roles/team → sections.
   Claims kept in sync with the resume (public/resume.pdf).

   ADDING AN ARTIFACT: drop the file in public/work/ and set `artifact` on the
   section — no component changes needed. Sections render narrative-only until
   an artifact is present, so nothing looks unfinished in the meantime.

     artifact: { src: '/work/agent-architecture.png', alt: '…', caption: '…' } */

export interface Artifact {
  src: string
  alt: string
  caption?: string
}

export interface CaseStudySection {
  heading: string
  body: string
  artifact?: Artifact
}

export interface CaseStudy {
  id: string
  title: string
  tag: string
  /** One-line opener + the home-page card blurb. Carries the headline number. */
  summary: string
  roles: string[]
  /** Team composition, e.g. "9 Product Designers, 16 Front-End Engineers". */
  team?: string
  /** Optional home-card thumbnail, once artwork exists. */
  thumbnail?: Artifact
  sections: CaseStudySection[]
}

export interface SecondaryProject {
  id: string
  title: string
  description: string
  href: string
}

export const projects: CaseStudy[] = [
  {
    id: 'bob-ai-voice',
    title: 'A voice agent answers the routine calls',
    tag: 'VOICE AUTOMATION',
    summary:
      "The company's first AI voice agent: 10+ automated workflows that took the two highest-volume request types off people entirely, cutting manual workload ~20%.",
    roles: ['Product Manager', 'Roadmap & strategy', 'Build-vs-partner framework'],
    sections: [
      {
        heading: 'The problem',
        body: 'The highest-volume inbound requests all landed on a person. Status checks, document chasing, routine questions — every one of them interrupted someone, and none of them got answered outside business hours. The work was repetitive enough to be automated and voluminous enough that automating it mattered.',
      },
      {
        heading: 'Creating the agent',
        body: "This was the company's first AI voice agent, so there was no roadmap to inherit. I owned it from concept through launch: 10+ automated workflows spanning status tracking, document collection, and inbound call handling, wired through the integration platform so the agent could actually read and write to the systems of record rather than just talk.",
      },
      {
        heading: 'Deciding what to automate',
        body: 'The harder product question was not "can an LLM do this" but "should it." I built an agentic decision-making framework with explicit build-versus-partner criteria and an Agent Impact Score — cost per completed workflow plus completion rate — so teams had a shared, numeric way to decide when to embed an agent and when deterministic automation was the more reliable answer.',
      },
      {
        heading: 'The outcome',
        body: 'The two highest-volume request types are now fully automated, cutting manual workload by an estimated 20% and moving the team toward 24/7 coverage. Just as durable: the decision framework outlived this project and now governs how other teams scope agent work.',
      },
    ],
  },
  {
    id: 'spot-quoting',
    title: 'Pricing that writes itself',
    tag: 'PRICING AUTOMATION',
    summary:
      'Launched the first automated, ML-driven pricing capability and led its GTM — scaling segment revenue 2.3x, from ~$170M to a $400M+ run rate.',
    roles: ['Product Manager', 'GTM lead', 'Pricing & integration APIs'],
    sections: [
      {
        heading: 'The problem',
        body: 'Pricing was manual, which made it slow, and slow pricing is lost business. Every quote consumed a person, so throughput was capped by headcount rather than demand — the segment could only grow as fast as people could be hired to price it.',
      },
      {
        heading: 'Building the capability',
        body: "This was the business's first automated, ML-driven pricing capability. The product surface was a set of pricing and integration APIs that could price without a human in the loop, which meant the model, the data pipeline, and the integration path all had to be right before anyone would trust it with real revenue.",
      },
      {
        heading: 'The go-to-market',
        body: 'Technology was only half of it. I led GTM sitting between sales and engineering for roughly three years — earning trust with the people whose commissions depended on pricing being right, and feeding what they found straight back into the roadmap. Adoption, not accuracy alone, is what turned this into revenue.',
      },
      {
        heading: 'The outcome',
        body: 'Segment revenue scaled 2.3x, from roughly $170M to a $400M+ run rate. The segment now accounts for about 10% of total company revenue, priced by a system rather than a person.',
      },
    ],
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
