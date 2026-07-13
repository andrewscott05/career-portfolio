import { motion } from 'framer-motion'
import { skillGroups } from '../data/skills'

const EASE = [0.22, 1, 0.36, 1] as const

export function Skills() {
  return (
    <section id="skills" className="px-6 sm:px-10 md:px-14 pb-16 sm:pb-20">
      <div className="max-w-[1100px] mx-auto w-full">
        <p className="section-label mb-5">// Skills &amp; tools</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-[22px]">
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}
              className="bg-[var(--color-surface)] border-[3px] border-[var(--color-ink)] p-6"
              style={{ boxShadow: '6px 6px 0 var(--color-ink)' }}
            >
              <p className="font-display text-xs text-[var(--color-primary)] mb-3">
                {group.label}
              </p>
              <p className="font-mono text-[13px] text-[var(--color-text-secondary)] leading-[1.8]">
                {group.items.join(' · ')}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
