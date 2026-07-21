/* Case studies follow a narrative skeleton: summary, sections.
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
    id: 'agentic-decision-framework',
    title: 'A framework for knowing when to build an agent',
    tag: 'AGENTIC DECISION FRAMEWORK',
    summary:
      "A framework for deciding when a workflow deserves an agent, and whether it's worth what it costs to run.",
    sections: [
      {
        heading: 'The problem',
        body: 'There was no consistent way to decide if a workflow was even worth handing to an agent. Decisions got made case by case, and once something was built, there was no good way to tell if it was actually pulling its weight.',
      },
      {
        heading: 'Setting the bar to build',
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
        heading: 'Measuring the impact',
        body: "Clearing the bar to build is only half of it. What actually matters is whether the thing you built is worth what it costs to run, so I built the Agent Impact Score: a plain read on cost against return. It weighs two things, because a cheap agent that keeps failing is a waste, and a dependable one that costs a fortune isn't much better either. I validated it on a real workflow, anonymized rate confirmation email chains, and it held up: the agent finished the job on its own, and the score gave us a real number to hold it to instead of a gut feeling.",
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
        heading: 'The outcome',
        body: 'The framework is now how other product teams decide if and when to build with agents, including the voice agent program below. It turned a subjective call into a repeatable one.',
      },
    ],
  },
  {
    id: 'ai-tooling-standard',
    title: 'One shared standard for how Product uses AI',
    tag: 'AI TOOLING STANDARD',
    summary:
      'A shared standard for how Product works with AI, adopted by 10+ Product Managers.',
    sections: [
      {
        heading: 'The problem',
        body: 'PMs were each picking up AI tools on their own, with no shared setup. Everyone was rebuilding the same context from scratch, and the quality of what came out swung from person to person depending on who wrote the best prompt that day.',
      },
      {
        heading: 'Building the standard',
        body: "I designed a four-layer context system, org, pillar, team, and individual, kept in Confluence and wired into the shared AI tools through connectors: Jira, Snowflake, Pendo, Google Suite. Context loads automatically instead of every PM rebuilding it from scratch, and it's tool-agnostic by design, so it travels if the underlying AI tool changes.",
      },
      {
        heading: 'Rolling it out',
        body: "The standard launched in pilot with a cross-functional governance group keeping it current as tools and workflows changed. From there it spread by word of mouth as much as by mandate: PMs who tried it kept using it because it saved them real setup time.",
      },
      {
        heading: 'The outcome',
        body: 'The standard is now used by 10+ Product Managers across the org, with governance in place to keep it current as the toolset evolves.',
      },
    ],
  },
  {
    id: 'bob-ai-voice',
    title: 'A voice agent answers the routine calls',
    tag: 'VOICE AUTOMATION',
    summary:
      "The company's first AI voice agent, automating the two highest-volume request types and cutting manual workload ~20%.",
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
    title: 'An automated, ML-driven pricing engine',
    tag: 'PRICING AUTOMATION',
    summary:
      'The company\'s first automated, ML-driven pricing capability, scaling segment revenue 2.3x to a $400M+ run rate.',
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
  {
    id: 'design-system',
    title: 'A shared design system for the whole org',
    tag: 'DESIGN SYSTEMS',
    summary:
      "Co-led Arrive's first company-wide design system with a team of 9 designers and 16 engineers, cutting SDLC time 20% and project turnaround 15%.",
    sections: [
      {
        heading: 'The problem',
        body: 'Every team was building interfaces from scratch. Design and engineering worked off different sources of truth, so the same component got rebuilt a dozen different ways across the product, and every rebuild ate into the schedule.',
      },
      {
        heading: 'Building the system',
        body: 'I co-led the effort with our lead designer: she drove the design work, I owned strategy, planning, and the roadmap. We converted the brand\'s colors and styles into tokens and built out the foundational components, then revamped the Jira SDLC and PRD standard so the system was built into how the team already worked instead of bolted on top of it.',
      },
      {
        heading: 'Scaling adoption',
        body: 'A design system nobody uses is just a wiki page. I built the intake model that let any team across the org request or contribute a component, tracked on a kanban board from request to shipped, so the system grew out of real product work instead of a roadmap nobody read.',
        criteria: [
          {
            label: 'Foundation',
            description: 'The core tokens, components, and patterns everyone builds from.',
          },
          {
            label: 'Adoption',
            description: 'Getting teams using it in real product work, not just referencing it.',
          },
          {
            label: 'Expansion',
            description: 'Growing the library as new product surfaces need it.',
          },
          {
            label: 'Customization',
            description: 'Letting teams adapt components without breaking the system underneath.',
          },
          {
            label: 'Evolution',
            description: 'Keeping it current as the product and the org keep changing.',
          },
        ],
      },
      {
        heading: 'The outcome',
        body: 'The system now runs across a team of 9 product designers and 16 front-end engineers, cutting SDLC time 20% and project turnaround 15%. Design and engineering work off one shared source of truth instead of nine different ones.',
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
