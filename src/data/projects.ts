/* Case studies follow a narrative skeleton: summary, role/team, sections.
   Claims kept in sync with the resume (public/resume.pdf).

   ADDING AN ARTIFACT: drop the file in public/work/ and set `artifact` on the
   section, no component changes needed. Sections render narrative-only until
   an artifact is present, so nothing looks unfinished in the meantime.

     artifact: { src: '/work/agent-architecture.png', alt: '...', caption: '...' } */

export interface Artifact {
  src: string
  alt: string
  caption?: string
}

/** Scannable list item: a bold label plus a one-line description. */
export interface CriteriaItem {
  label: string
  description: string
}

export interface CaseStudySection {
  heading: string
  body: string
  artifact?: Artifact
  criteria?: CriteriaItem[]
  /** Shadow accent for the criteria block. Use 'ochre' to make one stand out. */
  criteriaAccent?: 'ink' | 'ochre'
}

export interface CaseStudy {
  id: string
  title: string
  tag: string
  /** One-line opener + the home-page card blurb. Carries the headline number. */
  summary: string
  /** Single title, e.g. "Product Manager". */
  role: string
  /** Who the work was done with, e.g. "Product leaders, PMs, and IT". */
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
    id: 'ai-product-standard',
    title: 'A standard for how Product decides to build with AI',
    tag: 'AI PRODUCT STANDARDS',
    summary:
      'How Product decides when to build with AI, and how we tell whether each agent is worth running. It set the ground rules the voice agent below was built on.',
    role: 'Product Manager',
    team: 'Product leaders, PMs, and IT',
    sections: [
      {
        heading: 'The problem',
        body: 'Two problems with the same root. There was no real way to decide whether an agent belonged in a workflow, so every AI idea landed on the same outside vendor whether it fit or not. At the same time, PMs were picking up AI tools on their own with no shared setup, so the quality of what came out swung from person to person.',
      },
      {
        heading: 'Building the decision framework',
        body: 'A model can handle a lot of this work. The real question is whether it should be the one handling it. I put together a short checklist a team runs through before building anything, so the decision rests on the work itself and not on who happens to be in the room.',
        criteria: [
          {
            label: 'Volume',
            description: 'It happens often enough that the time it saves adds up to real money.',
          },
          {
            label: 'Clear workflow',
            description: 'You can lay it out start to finish, edge cases and all.',
          },
          {
            label: 'Low-stakes judgment',
            description: 'If the agent gets it wrong, the fix is cheap. Updating a load status, not approving a disputed invoice.',
          },
          {
            label: 'Predictable steps',
            description: 'The work follows the same logic each time instead of needing a fresh judgment call at every turn.',
          },
        ],
      },
      {
        heading: "Measuring what it's worth",
        body: 'Deciding to build is the easy part. What mattered more was proving each agent earned its keep, so I built the Agent Impact Score: a plain read on what a workflow costs against what it returns. It weighs two things, because a cheap agent that keeps failing is a waste, and a dependable one that costs a fortune is not much better.',
        criteria: [
          {
            label: 'Cost per completed workflow',
            description: 'What one finished run actually costs, model, infrastructure, and evaluation included.',
          },
          {
            label: 'Completion rate',
            description: 'How often the agent finishes the job on its own, with no one stepping in.',
          },
        ],
        criteriaAccent: 'ochre',
      },
      {
        heading: 'Proving it, then standardizing the tooling',
        body: 'To pressure-test the framework I ran a proof of concept on real rate confirmation email chains, anonymized. The agent handled the whole thing on its own, wrote sensible load updates, and knew when to escalate. It also settled one question fast: models are not interchangeable, so each workflow gets benchmarked before we pick one. Alongside that, I set up a four-layer context system (org, pillar, team, and individual) kept in Confluence and fed into the shared AI tools automatically, so no PM rebuilds it from scratch.',
      },
      {
        heading: 'The outcome',
        body: 'The framework is now how other product teams decide where agents fit, including the voice agent below. The tooling standard is in pilot with a cross-functional group keeping it current before it rolls out more widely.',
      },
    ],
  },
  {
    id: 'bob-ai-voice',
    title: 'A voice agent answers the routine calls',
    tag: 'VOICE AUTOMATION',
    summary:
      "The company's first AI voice agent: 10+ automated workflows that took the two highest-volume request types off people entirely, cutting manual workload ~20%.",
    role: 'Product Manager',
    sections: [
      {
        heading: 'The problem',
        body: 'The highest-volume inbound requests all landed on a person. Status checks, document chasing, routine questions: every one of them interrupted someone, and none got answered outside business hours. The work was repetitive enough to automate and frequent enough that automating it mattered.',
      },
      {
        heading: 'Creating the agent',
        body: "This was the company's first AI voice agent, so there was no roadmap to inherit. I owned it from concept through launch: 10+ automated workflows spanning status tracking, document collection, and inbound call handling, wired through the integration platform so the agent could actually read and write to the systems of record instead of just talking.",
      },
      {
        heading: 'Deciding what to automate',
        body: 'The harder question was never whether an LLM could do the work, but whether it should. I built a decision framework with clear criteria for when to hand a workflow to an agent, backed by an Agent Impact Score that weighs cost per completed workflow against how often the agent finishes the job. It gave teams an honest way to tell real automation from hype.',
      },
      {
        heading: 'The outcome',
        body: 'The two highest-volume request types are now fully automated, cutting manual workload by an estimated 20% and moving the team toward 24/7 coverage. Just as important, the framework outlived the project and now shapes how other teams scope agent work.',
      },
    ],
  },
  {
    id: 'spot-quoting',
    title: 'Pricing that writes itself',
    tag: 'PRICING AUTOMATION',
    summary:
      'Launched the first automated, ML-driven pricing capability and led its go-to-market, scaling segment revenue 2.3x from roughly $170M to a $400M+ run rate.',
    role: 'Product Manager',
    team: 'Sales and Engineering',
    sections: [
      {
        heading: 'The problem',
        body: 'Pricing was manual, which made it slow, and slow pricing is lost business. Every quote tied up a person, so throughput was capped by headcount instead of demand. The segment could only grow as fast as we could hire people to price it.',
      },
      {
        heading: 'Building the capability',
        body: "This was the business's first automated, ML-driven pricing capability. The product surface was a set of pricing and integration APIs that could price without a human in the loop, which meant the model, the data pipeline, and the integration path all had to be right before anyone would trust it with real revenue.",
      },
      {
        heading: 'The go-to-market',
        body: 'Technology was only half of it. I led go-to-market sitting between sales and engineering for about three years, earning trust with the people whose commissions rode on pricing being right, and feeding what they found straight back into the roadmap. Adoption, not accuracy alone, is what turned this into revenue.',
      },
      {
        heading: 'The outcome',
        body: 'Segment revenue scaled 2.3x, from roughly $170M to a $400M+ run rate. The segment now accounts for about 10% of total company revenue, priced by a system rather than a person.',
      },
    ],
  },
]

/* Secondary project, dark ink strip. */
export const developerPortal: SecondaryProject = {
  id: 'developer-portal',
  title: 'Developer Portal',
  description:
    'External APIs from concept to launch, the pricing engine behind the automation above.',
  href: 'https://developer.arrivenow.com/',
}
