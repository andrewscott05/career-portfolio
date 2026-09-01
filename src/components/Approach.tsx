import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

/* The quiet moment. Every other section on this page is at full volume:
   the hero assembles, the numbers count, the cards tilt and peek. This one
   is type on cream and nothing else. No heading, no border, no shadow, no
   kicker, no link. It exists so the loud parts have something to be loud
   against, and so someone reading the page meets a person somewhere in it. */

export function Approach() {
  return (
    <section className="px-6 sm:px-10 md:px-14 py-24 sm:py-36">
      <div className="max-w-[1100px] mx-auto w-full">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="font-serif text-[clamp(1.15rem,2.6vw,1.5rem)] text-[var(--color-text-secondary)] leading-[1.75] max-w-[44ch]"
        >
          I work best where the process is broken and nobody has written it down
          yet. Most of what I&apos;ve built started as someone else&apos;s
          workaround. I care more about whether a thing still runs a year later
          than whether it launched on time.
        </motion.p>
      </div>
    </section>
  )
}
