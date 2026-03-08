import { motion } from 'framer-motion'
import { AnimatedSection } from './AnimatedSection'
import { experience } from '../data/experience'

const TRANSITION = { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }

export function Experience() {
  return (
    <AnimatedSection id="experience" className="py-[140px] sm:py-[160px] px-6 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-mono text-sm text-[var(--color-muted)] tracking-[0.2em] uppercase mb-14">
          Experience
        </h2>
        <div className="relative">
          {/* Vertical line with gradient: accent → transparent */}
          <div
            className="absolute left-[7px] top-0 bottom-0 w-px"
            style={{
              background: 'linear-gradient(to bottom, var(--color-accent) 0%, transparent 100%)',
            }}
            aria-hidden
          />
          <ul className="space-y-14">
            {experience.map((job, i) => (
              <motion.li
                key={job.company}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ ...TRANSITION, delay: i * 0.08 }}
                className="relative pl-10"
              >
                <span
                  className="absolute left-0 w-3 h-3 rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-surface)] -translate-x-[5px]"
                  aria-hidden
                />
                <div className="mb-2">
                  <p className="font-mono font-semibold text-[var(--color-foreground)]">
                    {job.company}
                  </p>
                  <p className="font-mono text-sm text-[var(--color-muted)]">
                    {job.role} · {job.period}
                  </p>
                </div>
                <ul className="space-y-1.5 text-sm text-[var(--color-foreground-dim)] list-disc list-inside">
                  {job.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </AnimatedSection>
  )
}
