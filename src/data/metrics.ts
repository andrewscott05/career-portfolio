export interface Metric {
  value: string
  label: string
}

/* "By the numbers" — figures sourced from the resume (public/resume.pdf). */
export const metrics: Metric[] = [
  {
    value: '$400M+',
    label: 'run rate, scaled 2.3x from ~$170M by automated, ML-driven pricing.',
  },
  {
    value: '20%',
    label: 'less manual workload after automating the highest-volume requests.',
  },
  {
    value: '30%',
    label: 'fewer incidents after rebuilding platform access and auth.',
  },
]
