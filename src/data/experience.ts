export interface ExperienceItem {
  company: string
  role: string
  period: string
  bullets: string[]
}

export const experience: ExperienceItem[] = [
  {
    company: 'Arrive Logistics',
    role: 'Senior Technical Product Manager',
    period: '2021–Present',
    bullets: [
      'Lead Product Management for AI & Automation: roadmap, platform reliability, and end-to-end delivery across internal and external applications',
      'AI Agent Roadmap: 20K+ tracking tasks/mo, 5K+ POD collection/mo, plus active expansion into carrier sourcing, coverage, scheduling, and inquiry reduction (7.5K+ monthly accounting/payment calls)',
      'Spot Quoting GTM: drove revenue from $180M to $300M+ annually, with $227M from automation contributing ~10% of total company revenue',
      'Co-led strategy for an internal Design System used across Product and Engineering, cutting SDLC time by 20%',
      'Built and rolled out AI enablement guides (Cursor, Gemini) adopted by 10+ PMs',
      'Optimized User Management platform with SRE and Platform Engineering, reducing user-related incidents 30%',
      'Revamped the PRD template and Jira SDLC across the org, cutting project turnaround 15%',
    ],
  },
  {
    company: 'Global Resale',
    role: 'Manager of PMO → Program Manager',
    period: '2019–2021',
    bullets: [
      'Direct report to CEO, ran the PMO with 3 team members and 3 consultants',
      'Owned strategic roadmap and visibility for 75+ stakeholders across automation, tools, and operations',
      'Built an automated QC/Imaging process, lifting cycle time 20%',
      'Standardized operating procedures across 100+ staff, lifting output 30%',
      'As Program Manager: ran ITAD services for largest client, covering 90K+ IT assets and $6M+ annual revenue',
    ],
  },
  {
    company: 'General Motors',
    role: 'IT Project Manager, Storage Engineering',
    period: '2014–2019',
    bullets: [
      'Coordinated Backup and Recovery rollout across 16 global manufacturing plants',
      'Migrated 1.02 PB of data off legacy storage across 68 plants, saving $7M',
    ],
  },
]

export const education = {
  school: 'Penn State, Smeal College of Business',
  degree: 'BS, Management Information Systems',
  year: '2015',
}
