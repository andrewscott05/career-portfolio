export interface Metric {
  value: string
  label: string
}

/* "By the numbers" — copy verbatim from #3a. */
export const metrics: Metric[] = [
  {
    value: '20K+',
    label: 'tasks a month that used to be phone calls. Now automated.',
  },
  {
    value: '$227M',
    label: 'revenue through quotes no human ever touched.',
  },
  {
    value: '40%',
    label: 'SLA improvement after automating the repetitive work.',
  },
]
