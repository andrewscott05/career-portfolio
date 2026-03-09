import { motion } from 'framer-motion'
import { AnimatedSection } from './AnimatedSection'
import { skillGroups } from '../data/skills'

const EASE = [0.22, 1, 0.36, 1] as const

export function Skills() {
  return (
    <AnimatedSection id="skills" className="py-[120px] sm:py-[160px] px-6 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-[1200px] mx-auto w-full">
        <div className="max-w-2xl">
          <h2 className="section-label mb-10">Skills & Tools</h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {skillGroups.map((group, i) => (
              <motion.div
                key={group.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}
              >
                <p className="section-label mb-2">{group.label}</p>
                <p className="text-sm text-[var(--color-text-secondary)] font-normal">
                  {group.items.join(' · ')}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
