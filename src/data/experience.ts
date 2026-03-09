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
      'Own AI & Automation product area: agent roadmap, platform reliability, end-to-end delivery',
      'Key outcomes: 20K+ tasks/mo automated, $300M+ revenue via spot quoting platform, 40% SLA improvement',
    ],
  },
  {
    company: 'Global Resale',
    role: 'Manager of PMO',
    period: '2019–2021',
    bullets: [
      'Direct report to CEO, team of 6. Owned strategic roadmap for 75+ stakeholders',
      'Automated QC/Imaging boosting cycle time 20%',
    ],
  },
  {
    company: 'General Motors',
    role: 'IT Project Manager, Storage Engineering',
    period: '2014–2019',
    bullets: [
      'Migrated 1.02 PB across 16 global plants, saved $7M',
    ],
  },
]

export const education = {
  school: 'Penn State, Smeal College of Business',
  degree: 'BS, MIS',
  year: '2015',
}
