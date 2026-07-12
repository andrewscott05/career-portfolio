import { motion } from 'framer-motion'
import { experience } from '../data/experience'

const EASE = [0.22, 1, 0.36, 1] as const

export function Experience() {
  return (
    <section id="experience" className="px-6 sm:px-10 md:px-14 pb-16 sm:pb-20">
      <div className="max-w-[1100px] mx-auto w-full">
        <p className="section-label mb-5">// Experience</p>
        <div className="border-t-[3px] border-[var(--color-ink)]">
          {experience.map((job, i) => (
            <motion.div
              key={job.company}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}
              className="flex justify-between items-baseline gap-4 py-5 border-b-[3px] border-[var(--color-ink)]"
            >
              <div>
                <p className="font-display text-[17px] text-[var(--color-ink)]">
                  {job.company}
                </p>
                <p className="font-mono text-[13px] text-[var(--color-text-secondary)] mt-1">
                  {job.role}
                </p>
              </div>
              <p className="font-mono text-xs text-[var(--color-text-secondary)] whitespace-nowrap">
                {job.period}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
