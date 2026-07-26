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
  /** Defaults to full width. Use 'small' for icon-like diagrams rather than screenshots. */
  size?: 'full' | 'small'
}

/** Embedded deck, e.g. a public Google Slides link (use the /embed URL, not /edit). */
export interface Embed {
  src: string
  title: string
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
  /** Optional embedded deck, rendered once above the sections. */
  embed?: Embed
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
        body: 'Every AI workflow in Product Engineering ran through the same outside vendor by default, and there was no process to decide if an agent even belonged in a given application in the first place. The plan was to prove the pattern internally first, then hand off a working playbook so other teams could run it themselves.',
        artifact: {
          src: '/work/agentic-situation.png',
          alt: 'A slide describing the situation before the framework: workflows reliant on a vendor by default, no process to decide when to build an agent internally, and a plan to prove the pattern before handing it off.',
          caption: 'Where things stood before the framework existed.',
        },
      },
      {
        heading: 'Setting the bar to build',
        body: 'A model can handle a lot of this work. The real question is whether it should be the one handling it. I put together a short checklist a team runs through before building anything, so the decision rests on the work itself and not on who happens to be in the room.',
        artifact: {
          src: '/work/agentic-criteria-table.png',
          alt: 'A table of criteria for deciding whether to build an agentic workflow: volume, clear workflow, level of judgment needed, deterministic, and reason plus acting, each with a description and a real example.',
          caption: 'The actual criteria table, with the real examples we scored workflows against.',
        },
      },
      {
        heading: 'Measuring the impact',
        body: "Clearing the bar to build is only half of it. What actually matters is whether the thing you built is worth what it costs to run, so I built the Agent Impact Score: cost per completed workflow combined with completion rate, one operational scorecard instead of a gut feeling. Cost without quality misleads, and completion without cost misleads just as badly, so the score has to weigh both.",
        artifact: {
          src: '/work/agentic-impact-economics.png',
          alt: 'A slide on measuring impact and unit economics: cost per completed workflow, completion rate, and the Agent Impact Score combining both into one operational scorecard.',
          caption: "How the Agent Impact Score combines cost and completion rate into one read.",
        },
      },
      {
        heading: 'The outcome',
        body: "The plan from here follows the same three moves: iterate by proving the pattern on real internal workflows, formalize it by documenting the standards as we build, and hand it off so other product teams can own their own domain instead of waiting on us. The framework is already how other teams decide if and when to build with agents, including the voice agent program below.",
        artifact: {
          src: '/work/agentic-next-steps.png',
          alt: 'A slide outlining next steps: iterate by proving the pattern internally, formalize by documenting the standards, and hand off so other product teams build on the same foundation.',
          caption: 'The plan to formalize the framework and hand it to other product teams.',
        },
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
        body: 'Leadership had aligned on using AI as part of PM work, but there was no shared operating structure behind it. PMs were improvising their own setups, outputs drifted, and one team\'s judgment never compounded to help another.',
        artifact: {
          src: '/work/ai-standard-situation.png',
          alt: 'A slide describing the situation: leadership has aligned on AI tooling for PM work, but there is no shared operating structure, and the plan is to refine the structure and run a pilot before broader rollout.',
          caption: 'Where things stood before the standard existed.',
        },
      },
      {
        heading: 'Building the standard',
        body: "I designed the standard around four layers: shared context, best practices, connectors, and governance. The context layer itself breaks into four levels, org, pillar, team, and individual, hosted in Confluence and loaded into Claude or Gemini automatically, so a PM only has to think about their own team and themselves while the org and pillar context load on their own.",
        artifact: {
          src: '/work/ai-standard-operating-structure.png',
          alt: 'A slide outlining the four-layer operating structure: shared context, best practices, connectors, and governance.',
          caption: 'The four layers the whole standard is built on.',
        },
      },
      {
        heading: 'Rolling it out',
        body: 'A cross-functional governance team, PMs, product leaders, and IT, built the standards with the pilot cohort instead of handing them down, and refines them quarterly as tools and workflows change. The connectors came online the same way: Atlassian first since it was already in use, then Snowflake, Pendo, Google Suite, Miro, Figma, and Postman as the pilot asked for them.',
        artifact: {
          src: '/work/ai-standard-governance.png',
          alt: 'A slide on governance: a cross-functional team of PMs, product leaders, and IT meets regularly to iterate on standards, with a governance lead coordinating the team and keeping the cadence moving.',
          caption: 'The governance model that keeps the standard from drifting.',
        },
      },
      {
        heading: 'The outcome',
        body: 'The standard is now used by 10+ Product Managers across the org, plugged into one connected workspace instead of jumping between Jira, Snowflake, and Google Drive on their own. Governance keeps it current as the toolset evolves.',
        artifact: {
          src: '/work/ai-standard-connectors.png',
          alt: 'A slide showing the connectors live today: Atlassian, Snowflake, Pendo, Google Suite, Miro, Figma, and Postman, pulled into one connected workspace.',
          caption: 'The connectors PMs use today instead of jumping between tools.',
        },
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
        body: "Pricing was slow and manual, and every quote tied up a person, so throughput was capped by headcount instead of demand. Our own tooling made it worse: configurations lived in PowerApps, which was hard to use and had no version control, we only had limited data coming in from shippers, and the backend wasn't built to scale past where we already were.",
      },
      {
        heading: 'Building the Rate API',
        body: "We built the Rate API from the ground up: an automated quoting engine plus a configuration UI so the Client Solutions team could set margins, overrides, and quoting rules themselves instead of filing a ticket for every change. It replaced the old PowerApps setup entirely and gave every customer configuration a real audit trail.",
        artifact: {
          src: '/work/pricing-rate-api-config.png',
          alt: 'The Rate API configuration dashboard, showing a list of customer configurations with margin percentages by lead time.',
          caption: 'The configuration dashboard that replaced PowerApps for the Client Solutions team.',
        },
      },
      {
        heading: 'Normalizing the data',
        body: "Rate API wasn't the only source feeding pricing. LTL, AVRL, and a cost-prediction tool all had their own formats, and the old database wasn't built to hold any of them consistently. We rebuilt it as the Integrated Pricing Database: one operational table for quote management, one raw table storing every source's data in its native format, normalized enough to report on without losing anything in translation.",
        artifact: {
          src: '/work/pricing-database-schema.png',
          alt: 'An entity relationship diagram for the Integrated Pricing Database, showing tables for quote details, load quoting, load tenders, bids, stops, and opportunity management.',
          caption: 'The Integrated Pricing Database schema, built to hold every pricing source consistently.',
        },
      },
      {
        heading: 'Getting more quotes out',
        body: "None of it mattered if reps couldn't actually get a quote out the door. The Spot Quote Tool let reps generate and log quotes manually when they needed to, and we rebuilt its layout around what a rep actually needed first, cost history, market capacity, and risk, instead of a wall of numbers. More quotes moving through the system, faster, is what actually drove the revenue.",
        artifact: {
          src: '/work/pricing-spot-quote-before-after.png',
          alt: 'A before and after comparison of the Spot Quote Tool: the original layout is dense and hard to scan, the redesigned layout leads with rate calculator, cost history, and market capacity.',
          caption: 'The Spot Quote Tool before and after: same data, reordered around what a rep needs first.',
        },
      },
      {
        heading: 'Closing the loop with Client Solutions',
        body: "A saved quote still needed a human to review it before it turned into a real rate. The Quote Activity Board gave account teams a searchable log of every quote, automated or manual, with a details panel showing the load, pricing, and surcharge breakdown behind it. Client Solutions could pull that up, make an adjustment, and hand it back, instead of digging through email threads to find what a quote was even based on.",
        artifact: {
          src: '/work/pricing-quote-activity-board.png',
          alt: 'The Quote Activity Board, a searchable table of quotes with an expandable details panel showing load, pricing, and surcharge information for a selected quote.',
          caption: 'The Quote Activity Board: every quote logged and searchable, with the full pricing breakdown one click away.',
        },
      },
      {
        heading: 'The outcome',
        body: "Segment revenue scaled 2.3x, from roughly $170M to a $400M+ run rate, about 10% of total company revenue, priced by a system built from 0 to 1 instead of a person. I led the go-to-market alongside building it, sitting between sales and engineering to get it adopted. Years later, it's still the same core architecture: one Rate API, one pricing database, and the tools built on top of it.",
        artifact: {
          src: '/work/pricing-ecosystem.png',
          alt: 'An architecture diagram showing the full pricing ecosystem: API Gateway, Rate API, Quoting Service, a config sync service, the Integrated Pricing Database, Snowflake, and the Rate API Configs and Quote Activity Board UIs.',
          caption: 'The full system, years later: one Rate API and one pricing database underneath everything.',
        },
      },
    ],
  },
  {
    id: 'design-system',
    title: 'A shared design system for the whole org',
    tag: 'DESIGN SYSTEMS',
    summary:
      "Co-led Arrive's first company-wide design system with a team of 9 designers and 16 engineers, cutting the time to design a component 63% in a controlled test.",
    embed: {
      src: 'https://docs.google.com/presentation/d/1nahouLLB7zNwfTwIN8gfQwEBqheDGoDK/embed?start=false&loop=false&delayms=3000',
      title: 'Design Systems at Arrive Logistics: the evolution of the Product Design team',
      caption: 'The full story of how DOT-UI came together, from the problem through impact.',
    },
    sections: [
      {
        heading: 'The problem',
        body: 'Every team was building interfaces from scratch. Design and engineering worked off different sources of truth, so the same component got rebuilt a dozen different ways across the product, and every rebuild ate into the schedule.',
        artifact: {
          src: '/work/dot-ui-audit-before.jpg',
          alt: 'An audit board showing dozens of inconsistent component variations built across the product before the design system.',
          caption: 'A 2022 audit of the same components, rebuilt a different way in nearly every feature.',
        },
      },
      {
        heading: 'The process',
        body: "The design work was our lead designer's: she and the design team built the tokens and components that became DOT-UI. What it still needed was an operating process, so we set up the DOT-UI board in Jira and an intake flow any team across the org could use to request or track a component. A request finally had one place to live instead of a Slack thread nobody could find again.",
        artifact: {
          src: '/work/dot-ui-kanban-board.png',
          alt: 'The DOT-UI Jira board with columns for intake, backlog, ready for design, design in progress, ready for engineering, engineering in progress, done, and declined.',
          caption: 'The DOT-UI board we set up in Jira, tracking every request from intake through done.',
        },
      },
      {
        heading: 'Building a sustainable model',
        body: 'A shared library falls apart fast if requests aren\'t reviewed the same way twice in a row. We mapped a review lifecycle for every request, start to finish: design peer review, a junior or mid-level pass, a senior review, then a final sign-off from Product, Design, and Engineering together before anything shipped.',
        artifact: {
          src: '/work/dot-ui-review-lifecycle.png',
          alt: 'A flowchart showing the DOT-UI request lifecycle: intake, design, peer review, junior and senior review, Triforce review, engineering review, and UAT before a request is marked done.',
          caption: 'The review lifecycle we mapped for every DOT-UI request, from intake to shipped.',
        },
      },
      {
        heading: 'The outcome',
        body: "The system now runs across a team of 9 product designers and 16 front-end engineers. In a controlled test of the same design task, DOT-UI cut the time to design it from 26 minutes to 17, a 63% jump in speed. The board and review process still hold: it's how Product, Design, and Engineering keep the system accountable together.",
        artifact: {
          src: '/work/dot-ui-ownership-model.png',
          alt: 'A diagram showing Product, Design, and Engineering at the center of the design system, connected to multiple product teams as contributors and consumers.',
          caption: 'How contributor and consumer product teams connect back to Product, Design, and Engineering.',
        },
      },
    ],
  },
  {
    id: 'process-standardization',
    title: 'Standardizing how Product ships',
    tag: 'PROCESS STANDARDIZATION',
    summary:
      'Rebuilt the Jira workflow with other Staff PMs and led the PRD template refresh, cutting SDLC time 20% and project turnaround 15%.',
    sections: [
      {
        heading: 'The problem',
        body: 'Every team ran Jira differently: too many statuses, confusing names, tickets that got stuck with no way out and no way to close what we would never actually do. PRDs had the same problem from the other direction. No shared structure, so reviews dragged and sign-off depended on who was asking.',
        artifact: {
          src: '/work/jira-workflow-problem.png',
          alt: 'A slide listing common team complaints about the Jira workflow: too many statuses and transitions, tickets that get stuck, and inconsistent process across teams.',
          caption: 'The complaints we kept hearing, gathered straight from the teams.',
        },
      },
      {
        heading: 'Rebuilding the Jira workflow',
        body: "A few of us at the Staff level took this on together. We simplified the choices in each status, made sure a ticket could never get permanently stuck, and gave every team two honest ways to close a story out: Done for what shipped, Archived for what we won't do. Then we rebuilt the workflow for every issue type, stories, bugs, tasks, sub-tasks, spikes, and design work, and rolled it out everywhere.",
        artifact: {
          src: '/work/jira-workflow-before-after.png',
          alt: 'A before-and-after comparison of the Jira story workflow: the old version has tangled, redundant statuses, the new version is a cleaner path from open to done with a closed state added at the front.',
          caption: 'The story workflow before and after: fewer dead ends, two honest ways to close something out.',
        },
      },
      {
        heading: 'Refreshing the PRD process',
        body: "The PRD template had the same problem from the other direction. I led that refresh: fewer sections, less redundancy, and a document built to actually be read by stakeholders rather than just filled out by a PM. I also stood up a dedicated #prd-reviews Slack channel with a standard message format, so every reviewer knew what was being asked of them and by when, and we audit the template with Product and Engineering monthly to keep it from drifting.",
        artifact: {
          src: '/work/prd-template-steps.png',
          alt: 'A slide showing the steps to access the new PRD template in Confluence, from creating a page to selecting the Product Requirements template.',
          caption: 'How any PM finds and starts the new PRD template.',
        },
      },
      {
        heading: 'The outcome',
        body: 'Both efforts shipped together and cut SDLC time 20% and project turnaround 15%. The Jira workflow is still what every team builds on, and PRDs move through the same channel and format we set up, with a monthly audit keeping the process honest instead of letting it drift back to how things were.',
        artifact: {
          src: '/work/prd-slack-format.png',
          alt: 'A standardized Slack message format for posting a PRD to the #prd-reviews channel, showing the PRD link, reviewers needed, and where to leave comments.',
          caption: 'The standard message format that made every PRD review request easy to scan.',
        },
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
