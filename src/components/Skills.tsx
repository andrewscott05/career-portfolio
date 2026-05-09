import { motion } from 'framer-motion'
import { AnimatedSection } from './AnimatedSection'
import { skillGroups } from '../data/skills'

const EASE = [0.22, 1, 0.36, 1] as const

export function Skills() {
  return (
    <AnimatedSection id="skills" className="py-16 sm:py-24 px-6 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-[1200px] mx-auto w-full">
        <div className="md:grid md:grid-cols-[140px_1fr] md:gap-16">
          <div>
            <h2 className="section-label">Skills & Tools</h2>
          </div>
          <div className="mt-6 md:mt-0 max-w-2xl">
            <div className="grid gap-7 sm:grid-cols-2">
              {skillGroups.map((group, i) => (
                <motion.div
                  key={group.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: EASE, delay: i * 0.06 }}
                >
                  <p className="section-label mb-2">{group.label}</p>
                  <p className="text-sm text-[var(--color-text-secondary)] font-normal leading-relaxed">
                    {group.items.join(' · ')}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
