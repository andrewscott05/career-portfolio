import { motion } from 'framer-motion'

const LINK = {
  linkedin: 'https://linkedin.com/in/andrew-john-scott',
  email: 'mailto:ascott1296@gmail.com',
  resume: '/resume.pdf',
}

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const EASE = [0.22, 1, 0.36, 1] as const

const stagger = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: EASE },
}

export function Hero() {
  return (
    <header className="relative flex flex-col justify-center pt-20 pb-16 sm:pt-28 sm:pb-20 px-6 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-[1200px] mx-auto w-full">
        <div className="max-w-4xl">
          <motion.p
            initial={stagger.hidden}
            animate={stagger.visible}
            transition={{ ...stagger.transition, delay: 0 }}
            className="section-label mb-6"
          >
            Austin, TX
          </motion.p>
          <motion.h1
            initial={stagger.hidden}
            animate={stagger.visible}
            transition={{ ...stagger.transition, delay: 0.1 }}
            className="text-[3rem] sm:text-[5rem] md:text-[6rem] lg:text-[7rem] font-bold tracking-tight text-[var(--color-text)] leading-[0.95] mb-6"
          >
            Andrew Scott
          </motion.h1>
          <motion.p
            initial={stagger.hidden}
            animate={stagger.visible}
            transition={{ ...stagger.transition, delay: 0.2 }}
            className="text-xl sm:text-2xl font-medium text-[var(--color-text)] mb-3"
          >
            Technical Product Leader
          </motion.p>
          <motion.p
            initial={stagger.hidden}
            animate={stagger.visible}
            transition={{ ...stagger.transition, delay: 0.3 }}
            className="text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-lg mb-12"
          >
            Building technology that moves freight.
          </motion.p>
          <motion.nav
            initial={stagger.hidden}
            animate={stagger.visible}
            transition={{ ...stagger.transition, delay: 0.45 }}
            className="flex flex-wrap items-center gap-6"
            aria-label="Primary"
          >
            <a
              href={LINK.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline font-mono text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={LINK.email}
              className="link-underline font-mono text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
            >
              Email
            </a>
            <a
              href={LINK.resume}
              download
              className="font-mono text-sm inline-flex items-center gap-2.5 px-5 py-2.5 border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] transition-all duration-200 rounded-lg"
            >
              <DownloadIcon />
              Resume
            </a>
          </motion.nav>
        </div>
      </div>
      {/* Gradient fade at bottom into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, var(--color-bg) 100%)',
        }}
        aria-hidden
      />
    </header>
  )
}
