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
  name: { opacity: 0, y: 20 },
  nameVisible: { opacity: 1, y: 0 },
  tagline: { opacity: 0, y: 20 },
  taglineVisible: { opacity: 1, y: 0 },
  links: { opacity: 0, y: 20 },
  linksVisible: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: EASE },
}

export function Hero() {
  return (
    <header className="min-h-screen flex flex-col justify-center pt-24 pb-24 px-6 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
          className="font-mono text-xs text-[var(--color-muted)] tracking-[0.2em] uppercase mb-6"
        >
          Austin, TX
        </motion.p>
        <motion.h1
          initial="name"
          animate="nameVisible"
          variants={stagger}
          transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
          className="font-mono text-[4rem] sm:text-[5rem] md:text-[6rem] font-bold tracking-[0.02em] text-[var(--color-foreground)] leading-[0.95] mb-6"
          style={{ letterSpacing: '0.02em' }}
        >
          Andrew Scott
        </motion.h1>
        <motion.p
          initial="tagline"
          animate="taglineVisible"
          variants={stagger}
          transition={{ duration: 0.5, ease: EASE, delay: 0.25 }}
          className="font-mono text-lg sm:text-xl text-[var(--color-muted)] mb-4"
        >
          AI Product Leader
        </motion.p>
        <motion.p
          initial="tagline"
          animate="taglineVisible"
          variants={stagger}
          transition={{ duration: 0.5, ease: EASE, delay: 0.35 }}
          className="text-xl sm:text-2xl text-[var(--color-foreground-dim)] max-w-lg mb-14"
        >
          Building AI agents that move freight.
        </motion.p>
        <motion.nav
          initial="links"
          animate="linksVisible"
          variants={stagger}
          transition={{ duration: 0.5, ease: EASE, delay: 0.5 }}
          className="flex flex-wrap items-center gap-6"
          aria-label="Primary"
        >
          <a
            href={LINK.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline font-mono text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={LINK.email}
            className="link-underline font-mono text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
          >
            Email
          </a>
          <a
            href={LINK.resume}
            download
            className="group font-mono text-sm inline-flex items-center gap-2.5 px-5 py-2.5 border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-surface)] transition-all duration-250"
          >
            <DownloadIcon />
            Resume
          </a>
        </motion.nav>
      </div>
    </header>
  )
}
