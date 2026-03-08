import { motion } from 'framer-motion'
import { AnimatedSection } from './AnimatedSection'
import { skillGroups } from '../data/skills'

export function Skills() {
  return (
    <AnimatedSection id="skills" className="py-[140px] sm:py-[160px] px-6 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-mono text-sm text-[var(--color-muted)] tracking-[0.2em] uppercase mb-10">
          Skills & Tools
        </h2>
        <div className="grid gap-10 sm:grid-cols-2">
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-wider mb-2">
                {group.label}
              </p>
              <p className="text-sm text-[var(--color-foreground-dim)] font-normal leading-relaxed">
                {group.items.join(' · ')}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
