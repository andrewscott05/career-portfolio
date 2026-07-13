import { motion } from 'framer-motion'

const LINK = {
  linkedin: 'https://linkedin.com/in/andrew-john-scott',
  resume: '/resume.pdf',
}

const EASE = [0.22, 1, 0.36, 1] as const

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: EASE, delay },
})

export function Hero() {
  return (
    <header id="top" className="px-6 sm:px-10 md:px-14">
      <div className="max-w-[1100px] mx-auto w-full pt-20 pb-16 sm:pt-24 sm:pb-20">
        <motion.p
          {...fade(0)}
          className="font-mono text-[13px] tracking-[0.12em] uppercase text-[var(--color-text-secondary)] mb-6 sm:mb-7"
        >
          Andrew Scott · Technical Product Leader · Austin, TX
        </motion.p>
        <motion.h1
          {...fade(0.08)}
          className="font-display text-[clamp(2.75rem,10vw,5.5rem)] text-[var(--color-ink)] leading-[0.98] tracking-[-0.01em] mb-6 sm:mb-7"
        >
          Turning operational
          <br />
          chaos into systems
          <br />
          that <span className="text-[var(--color-primary)]">scale.</span>
        </motion.h1>
        <motion.p
          {...fade(0.16)}
          className="font-mono text-[15px] sm:text-base text-[var(--color-text-secondary)] max-w-[600px] leading-[1.8] mb-9 sm:mb-10"
        >
          A decade turning manual operations into automated systems — the phone
          calls, spreadsheets, and 2am fire drills replaced by software, with AI
          handling the work that used to need a person.
        </motion.p>
        <motion.div {...fade(0.24)} className="flex flex-wrap gap-4 sm:gap-[18px]">
          <a
            href={LINK.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="press font-display text-sm text-[var(--color-bg)] bg-[var(--color-ink)] px-6 py-[15px] border-[3px] border-[var(--color-ink)]"
            style={{ boxShadow: '6px 6px 0 var(--color-primary)' }}
          >
            Download resume
          </a>
          <a
            href={LINK.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="press font-display text-sm text-[var(--color-ink)] bg-[var(--color-bg)] px-6 py-[15px] border-[3px] border-[var(--color-ink)]"
            style={{ boxShadow: '6px 6px 0 var(--color-ink)' }}
          >
            LinkedIn
          </a>
        </motion.div>
      </div>
    </header>
  )
}
