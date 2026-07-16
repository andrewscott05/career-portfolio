export interface ExperienceItem {
  company: string
  role: string
  period: string
  bullets: string[]
}

/* Claims kept in sync with the resume (public/resume.pdf). */
export const experience: ExperienceItem[] = [
  {
    company: 'Arrive Logistics',
    role: 'Senior Technical Product Manager · promoted 2022',
    period: '2021–Present',
    bullets: [
      'Lead product management for AI and automation: 10+ products and integrations spanning pricing, booking, CRM, and APIs, plus an AI voice agent',
      'Scaled segment revenue 2.3x, from ~$170M to a $400M+ run rate, by launching the first automated ML-driven pricing capability — now ~10% of total company revenue',
      'Established the company\'s first AI voice agent and its roadmap: 10+ automated workflows across tracking, document collection, and inbound call handling; automated the two highest-volume request types, cutting manual workload ~20% and advancing 24/7 coverage',
      'Built an Agentic Decision-Making Framework with build-versus-partner criteria and an Agent Impact Score to standardize when to embed AI into products',
      'Created a tool-agnostic AI enablement standard (shared context, connector-based workflows) adopted by 10+ Product Managers',
      'Co-led a shared Design System and revamped the Jira SDLC and PRD standard, cutting SDLC time 20% and project turnaround 15%',
      'Partnered with SRE and Platform Engineering to optimize the User Management platform, improving auth and access control and reducing user-related incidents 30%',
      'Deployed a batch-processing workflow that lifted transaction acceptance rate and daily operational efficiency 20%',
    ],
  },
  {
    company: 'Global Resale',
    role: 'Manager of PMO → Program Manager',
    period: '2019–2021',
    bullets: [
      'Direct report to the CEO, running the PMO with 3 team members and 3 consultants',
      'Owned the strategic roadmap for automation, tools, operations, and business processes, giving 75+ stakeholders priority and visibility',
      'Led an automated quality-control and imaging process, lifting cycle time 20%',
      'Standardized operating procedures and end-to-end workflows for 100+ staff, lifting output 30%',
      'Built a knowledge-management system housing operations documentation for 250+ users',
      'As Program Manager: ran asset-management services for the largest client, covering 90K+ IT assets and $6M+ in annual revenue',
    ],
  },
  {
    company: 'General Motors',
    role: 'IT Project Manager, Storage Engineering PMO',
    period: '2014–2019',
    bullets: [
      'Coordinated a Backup and Recovery rollout across 16 global manufacturing plants',
      'Drove initiatives across 68 plants, migrating 1.02 PB of data off legacy storage and saving $7M',
    ],
  },
]

export const education = {
  school: 'Penn State, Smeal College of Business',
  degree: 'BS, Management Information Systems',
  year: '2015',
}
