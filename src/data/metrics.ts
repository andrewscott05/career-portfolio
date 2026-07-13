export interface Metric {
  value: string
  label: string
}

/* "By the numbers" — copy verbatim from #3a. */
export const metrics: Metric[] = [
  {
    value: '20K+',
    label: 'operational tasks automated every month, no human in the loop.',
  },
  {
    value: '$227M',
    label: 'revenue generated through fully automated workflows.',
  },
  {
    value: '40%',
    label: 'faster service levels once the repetitive work was automated.',
  },
]
