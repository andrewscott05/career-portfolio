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
  /** Image revealed on card hover. Defaults to the first section artifact. */
  cardPeek?: Artifact
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
    id: 'bob-ai-voice',
    title: 'Freight Tracking AI Agent',
    tag: 'AI automation',
    summary:
      "The company's first AI agent, nicknamed Bob. Automates ~600 loads a day and cut manual tracking work 20% with no added headcount.",
    cardPeek: {
      src: '/work/bob-tracking-ui.png',
      alt: 'A Tracking panel entry showing a location update logged by the agent.',
    },
    sections: [
      {
        heading: 'The problem',
        body: "Every highest-volume tracking request landed on a person: status checks, location updates, delivery confirmations. Load volume kept climbing, and the default answer was always to hire more people onto Tracking to keep pace with it. Each of those requests interrupted someone, and the work was repetitive enough that headcount was never going to be a sustainable way to keep up.",
      },
      {
        heading: 'Creating the agent',
        body: "This was the company's first AI agent for tracking, so there was no roadmap to inherit. I owned it from concept through launch: 10+ automated workflows spanning status tracking, document collection, and carrier outreach across voice, text, and email, wired through the integration platform so the agent could read and write to the systems of record directly, no relay through a rep required. Every workflow runs the same core loop: a load gets flagged, the agent reaches out to the carrier by voice, text, or email, and anything with a real issue routes straight to a rep rather than getting pushed through automatically.",
        artifact: {
          src: '/work/bob-voice-workflows-overview.png',
          alt: 'A Miro board mapping over 10 of the agent\'s automated tracking workflows, including in-transit location updates, shipper arrival and departure confirmations, and an after-hours SOP.',
          caption: 'A portion of the workflow mapping behind the agent: every branch, confirmation, and fallback mapped before a line of it went live.',
        },
      },
      {
        heading: "Teaching the agent when it's allowed to act",
        body: "The agent didn't start with write access. In the first phase it could only call, text, and escalate; a rep still had to update the load themselves. Giving it permission to move a load status directly meant a bad write could do more damage than a missed call, so before that shipped I mapped every legal status transition end to end: what data was mandatory, which transitions could be trusted to tracking data alone versus always needing a live call, and the disqualifiers that blocked a write outright, an unresolved OS&D issue, an appointment window already missed, conflicting driver information. If a load didn't clear the bar, the agent left the status alone and escalated to a rep. Every failure mode got the same treatment too: retry once, then escalate with one consistent message rather than a dozen slightly different ones, with retries batched into a single clean comment so the load record didn't get spammed with noise. Full write access across every tracking task type is the next milestone, not something I'd have shipped on day one.",
        artifact: {
          src: '/work/bob-outreach-flow.svg',
          alt: 'A diagram showing a load flagged for tracking routed through the Bob outreach SOP across voice, text, and email, converging on a decision: no issue logs the update in ARRIVEnow, an issue escalates to the Arrive team.',
          caption: 'The decision behind every write: no issue logs the update, an issue hands the load to a rep instead.',
        },
      },
      {
        heading: 'Deciding what to automate',
        body: "The harder question was never whether an LLM could do the work. It was whether it should. I built a decision framework with clear criteria for when to hand a workflow to an agent, backed by an Agent Impact Score weighing cost per completed workflow against how often the agent finishes the job. It gave teams a straight way to separate real automation from hype. The scale made that discipline necessary: the same analysis sized roughly 18,000 automatable tasks a day across the org, more than any team could reasonably prioritize one workflow at a time.",
      },
      {
        heading: 'Measuring what the agent actually did',
        body: "Shipping the agent wasn't the finish line. Before launch I defined the reporting layer that would tell us whether it was working, not just running: every workflow tracked at the task level and the outreach level, broken out by contact channel, with failures grouped into a real taxonomy rather than one catch-all bucket.",
        criteria: [
          {
            label: 'Task and outreach metrics',
            description: 'Success, failure, and escalation rates for every workflow, broken out by contact channel: call, text, and email.',
          },
          {
            label: 'Failure taxonomy',
            description: 'Failures grouped by error type, channel, and task, so a bad phone number and a channel outage read as different problems instead of the same one.',
          },
          {
            label: 'Escalation to resolution',
            description: "The time between when the agent handed a task off and when a rep actually closed it, not just that it got handed off.",
          },
          {
            label: 'Full event timeline',
            description: 'A per-load log of every attempt the agent made, so the operations team could see what happened without needing direct access to the underlying platform.',
          },
        ],
      },
      {
        heading: 'The outcome',
        body: "The two highest-volume request types are now fully automated. Roughly 600 loads a day now route through the agent, with 27,500+ track-and-trace calls and 6,500+ emails sent on its behalf year-to-date, at a 90%+ SOP success rate. That's cut manual workload by an estimated 20% and let Tracking absorb rising load volume without hiring to match it. After-hours was the clearest case: the team there didn't need to grow headcount as volume climbed, because the agent was carrying the load alongside them. These numbers come straight off the task and outreach metrics built into the reporting layer, not a guess, and that same reporting model is now how other automation efforts on the team get measured.",
        artifact: {
          src: '/work/bob-tracking-ui.png',
          alt: "A real Tracking panel entry showing a Bob-logged location update for a load in Golden, CO, with the check call reason, timestamp, and drop trailer status.",
          caption: 'A live location update logged by the agent, same interface a rep would use, no handoff required.',
        },
      },
    ],
  },
  {
    id: 'spot-quoting',
    title: 'Automated Freight Pricing Engine',
    tag: 'Machine learning pricing',
    summary:
      'Built the ML-driven Rate API from 0 to 1. Scaled segment revenue 2.3x to a $400M+ run rate.',
    cardPeek: {
      src: '/work/pricing-ecosystem.png',
      alt: 'The full pricing ecosystem: Rate API, quoting service, pricing database and the tools built on top.',
    },
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
        body: "Rate API wasn't the only source feeding pricing. LTL, AVRL, and a cost-prediction tool all had their own formats, and the old database wasn't built to hold any of them consistently. We rebuilt it as the Integrated Pricing Database: one operational table for quote management, one raw table storing every source's data in its native format, normalized enough to report on without losing the original detail.",
        artifact: {
          src: '/work/pricing-database-schema.png',
          alt: 'An entity relationship diagram for the Integrated Pricing Database, showing tables for quote details, load quoting, load tenders, bids, stops, and opportunity management.',
          caption: 'The Integrated Pricing Database schema, built to hold every pricing source consistently.',
        },
      },
      {
        heading: 'The last piece: manual quotes',
        body: "Rate API and the database covered automated quoting, but not every request could go through it, reps still needed a way to quote manually. The Spot Quote Tool covered that gap, and we rebuilt its layout around what a rep needed first, cost history, market capacity, and risk, rather than a wall of numbers. A Quote Activity Board gave account teams a searchable log of every quote, automated or manual, so Client Solutions could pull one up and make an adjustment without digging through email threads to find what it was based on.",
        artifact: {
          src: '/work/pricing-spot-quote-before-after.png',
          alt: 'A before and after comparison of the Spot Quote Tool: the original layout is dense and hard to scan, the redesigned layout leads with rate calculator, cost history, and market capacity.',
          caption: 'The Spot Quote Tool before and after: same data, reordered around what a rep needs first.',
        },
      },
      {
        heading: 'The outcome',
        body: "Segment revenue scaled 2.3x, from roughly $170M to a $400M+ run rate, about 10% of total company revenue. More quotes moving through the system, automated and manual together, is what drove that, priced by a system built from 0 to 1 instead of a person. I led the go-to-market alongside building it, sitting between sales and engineering to get it adopted. Years later, it's still the same core architecture: one Rate API, one pricing database, and the tools built on top of it.",
        artifact: {
          src: '/work/pricing-ecosystem.png',
          alt: 'An architecture diagram showing the full pricing ecosystem: API Gateway, Rate API, Quoting Service, a config sync service, the Integrated Pricing Database, Snowflake, and the Rate API Configs and Quote Activity Board UIs.',
          caption: 'The full system, years later: one Rate API and one pricing database underneath everything.',
        },
      },
    ],
  },
  {
    id: 'agentic-decision-framework',
    title: 'When to Build an AI Agent',
    tag: 'AI governance',
    summary:
      "Criteria for when a workflow deserves an agent, and an Impact Score for whether it's worth what it costs to run.",
    cardPeek: {
      src: '/work/agentic-impact-economics.png',
      alt: 'A slide on measuring impact and unit economics, defining the Agent Impact Score.',
    },
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
        body: "Clearing the bar to build is only half of it. What matters is whether the thing you built is worth what it costs to run, so I built the Agent Impact Score: cost per completed workflow combined with completion rate, one operational scorecard instead of a gut feeling. Cost without quality misleads, and completion without cost misleads just as badly, so the score has to weigh both.",
        artifact: {
          src: '/work/agentic-impact-economics.png',
          alt: 'A slide on measuring impact and unit economics: cost per completed workflow, completion rate, and the Agent Impact Score combining both into one operational scorecard.',
          caption: "How the Agent Impact Score combines cost and completion rate into one read.",
        },
      },
      {
        heading: 'The outcome',
        body: "The plan from here follows the same three moves: iterate by proving the pattern on real internal workflows, formalize it by documenting the standards as we build, and hand it off so other product teams can own their own domain instead of waiting on us. The framework is already how other teams decide if and when to build with agents, including the tracking agent above.",
        artifact: {
          src: '/work/agentic-next-steps.png',
          alt: 'A slide outlining next steps: iterate by proving the pattern internally, formalize by documenting the standards, and hand off so other product teams build on the same foundation.',
          caption: 'The plan to formalize the framework and hand it to other product teams.',
        },
      },
      {
        heading: 'The adoption curve',
        body: "Zoom out and the trend backs it up. The share of loads touched by any automation grew from 4% in 2019 to 95%+ by 2025, and the average number of automation points per load nearly doubled between 2022 and 2024 alone. The framework didn't create that curve by itself, but it's part of how the org keeps climbing it on purpose instead of by accident.",
        artifact: {
          src: '/work/bob-automation-adoption.png',
          alt: 'A table showing the percentage of loads with any automation touchpoint growing from 4.0% in 2019 to 95.5% by 2025 YTD, and average automation points per load climbing from 0.04 to 2.34 over the same period.',
          caption: 'Company-wide automation adoption, 2019 through 2025 YTD.',
        },
      },
    ],
  },
  {
    id: 'ai-tooling-standard',
    title: 'AI Standard for Product Teams',
    tag: 'Team enablement',
    summary:
      'One shared standard for how Product works with AI. Adopted by 10+ Product Managers.',
    cardPeek: {
      src: '/work/ai-standard-connectors.png',
      alt: 'The connectors live today, pulled into one connected workspace.',
    },
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
    id: 'design-system',
    title: 'Company-Wide Design System',
    tag: 'Design systems',
    summary:
      "Co-led Arrive's first company-wide design system, DOT-UI, with 9 designers and 16 engineers. Cut component design time 63%.",
    cardPeek: {
      src: '/work/dot-ui-ownership-model.png',
      alt: 'Product, Design and Engineering at the centre of the design system, with contributor and consumer product teams around it.',
    },
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
    title: 'How Product Ships',
    tag: 'Ways of working',
    summary:
      'Rebuilt the Jira workflow and PRD template. Cut SDLC time 20%, project turnaround 15%.',
    cardPeek: {
      src: '/work/jira-workflow-before-after.png',
      alt: 'The Jira story workflow before and after: tangled redundant statuses replaced by a clean path from open to done.',
    },
    sections: [
      {
        heading: 'The problem',
        body: "Every team ran Jira differently: too many statuses, confusing names, tickets that got stuck with no way out and no way to close what we'd never do. PRDs had the same problem from the other direction. No shared structure, so reviews dragged and sign-off depended on who was asking.",
        artifact: {
          src: '/work/jira-workflow-problem.png',
          alt: 'A slide listing common team complaints about the Jira workflow: too many statuses and transitions, tickets that get stuck, and inconsistent process across teams.',
          caption: 'The complaints we kept hearing, gathered straight from the teams.',
        },
      },
      {
        heading: 'Rebuilding the Jira workflow',
        body: "A few of us at the Staff level took this on together. We simplified the choices in each status, made sure a ticket could never get permanently stuck, and gave every team two clear ways to close a story out: Done for what shipped, Archived for what we won't do. Then we rebuilt the workflow for every issue type, stories, bugs, tasks, sub-tasks, spikes, and design work, and rolled it out everywhere.",
        artifact: {
          src: '/work/jira-workflow-before-after.png',
          alt: 'A before-and-after comparison of the Jira story workflow: the old version has tangled, redundant statuses, the new version is a cleaner path from open to done with a closed state added at the front.',
          caption: 'The story workflow before and after: fewer dead ends, two clear ways to close something out.',
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
        body: 'Both efforts shipped together and cut SDLC time 20% and project turnaround 15%. The Jira workflow is still what every team builds on, and PRDs move through the same channel and format we set up, with a monthly audit keeping the process from drifting back to how things were.',
      },
    ],
  },
]

/* Secondary project, dark ink strip. */
export const developerPortal: SecondaryProject = {
  id: 'developer-portal',
  title: 'Developer Portal',
  description:
    'Built the external APIs, from concept to launch, powering the pricing engine above.',
  href: 'https://developer.arrivenow.com/',
}
