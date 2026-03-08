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
      'Key outcomes: 20K+ tasks/mo automated, $300M+ revenue via spot quoting platform, 40% SLA improvement, SDLC reduced 20% via Design System strategy',
      'Built AGIS, led Developer Portal launch, drove AI enablement org-wide',
    ],
  },
  {
    company: 'Global Resale',
    role: 'Manager of PMO',
    period: '2019–2021',
    bullets: [
      'Direct report to CEO. Managed PMO of 6, owned strategic roadmap for 75+ stakeholders',
      'Automated QC/Imaging boosting cycle time 20%, managed $6M+ ITAD client portfolio',
    ],
  },
  {
    company: 'General Motors',
    role: 'IT Project Manager, Storage Engineering',
    period: '2014–2019',
    bullets: [
      'Backup/recovery across 16 global plants, migrated 1.02 PB saving $7M',
    ],
  },
]
