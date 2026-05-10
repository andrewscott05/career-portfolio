import { motion } from 'framer-motion'
import { AnimatedSection } from './AnimatedSection'
import { experience, education } from '../data/experience'

const EASE = [0.22, 1, 0.36, 1] as const

export function Experience() {
  return (
    <AnimatedSection id="experience" className="py-16 sm:py-24 px-6 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-[1200px] mx-auto w-full">
        <div className="md:grid md:grid-cols-[140px_1fr] md:gap-16">
          <div>
            <h2 className="section-label">Experience</h2>
          </div>
          <div className="mt-8 md:mt-0 max-w-2xl">
            <div className="relative">
              <div
                className="absolute left-[7px] top-0 bottom-0 w-px"
                style={{
                  background: 'linear-gradient(to bottom, var(--color-primary) 0%, transparent 100%)',
                }}
                aria-hidden
              />
              <ul className="space-y-10">
                {experience.map((job, i) => (
                  <motion.li
                    key={job.company}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
                    className="relative pl-10"
                  >
                    <span
                      className="absolute left-0 w-3 h-3 rounded-full border-2 border-[var(--color-primary)] bg-[var(--color-bg)] -translate-x-[5px]"
                      aria-hidden
                    />
                    <p className="font-bold text-[var(--color-text)]">
                      {job.company}
                    </p>
                    <p className="text-sm text-[var(--color-primary)] font-medium">
                      {job.role}
                    </p>
                    <p className="font-mono text-xs text-[var(--color-text-muted)] mb-2">
                      {job.period}
                    </p>
                    <ul className="space-y-1 text-sm text-[var(--color-text-secondary)] list-disc list-inside">
                      {job.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
                className="relative pl-10 mt-8 pt-6 border-t border-[var(--color-border-subtle)]"
              >
                <span
                  className="absolute left-0 w-2 h-2 rounded-full bg-[var(--color-text-muted)] -translate-x-[4px] top-[22px]"
                  aria-hidden
                />
                <p className="font-mono text-xs text-[var(--color-text-muted)]">
                  {education.school}. {education.degree} ({education.year})
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
