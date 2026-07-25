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
      <div className="max-w-[1100px] mx-auto w-full pt-14 pb-16 sm:pt-16 sm:pb-20">
        <motion.h1
          {...fade(0)}
          className="font-display text-[clamp(2.75rem,10vw,5.5rem)] text-[var(--color-ink)] leading-[0.98] tracking-[-0.01em] mb-9 sm:mb-10"
        >
          Turning operational
          <br />
          chaos into systems
          <br />
          that <span className="text-[var(--color-primary)]">scale.</span>
        </motion.h1>
        <motion.div {...fade(0.16)} className="flex flex-wrap gap-4 sm:gap-[18px]">
          <a
            href={LINK.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="press font-display text-sm text-[var(--color-bg)] bg-[var(--color-ink)] px-6 py-[15px] border-[3px] border-[var(--color-ink)]"
            style={{ boxShadow: '6px 6px 0 var(--color-primary)' }}
          >
            Resume
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
