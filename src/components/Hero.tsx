import { useState } from 'react'
import { motion } from 'framer-motion'

const EMAIL = 'ascott1296@gmail.com'
const LINK = {
  linkedin: 'https://linkedin.com/in/andrew-john-scott',
  email: `mailto:${EMAIL}`,
  resume: '/resume.pdf',
}

function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text))
  } else {
    fallbackCopy(text)
  }
}

function fallbackCopy(text: string) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  try { document.execCommand('copy') } catch {}
  document.body.removeChild(ta)
}

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const ExternalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M7 17L17 7" />
    <polyline points="8 7 17 7 17 16" />
  </svg>
)

const EASE = [0.22, 1, 0.36, 1] as const

const stagger = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: EASE },
}

export function Hero() {
  const [copied, setCopied] = useState(false)

  const handleEmailClick = () => {
    copyToClipboard(EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <header className="relative flex flex-col justify-center pt-20 pb-16 sm:pt-28 sm:pb-20 px-6 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-[1200px] mx-auto w-full">
        <div className="max-w-4xl">
          <motion.h1
            initial={stagger.hidden}
            animate={stagger.visible}
            transition={{ ...stagger.transition, delay: 0.1 }}
            className="text-[2rem] sm:text-[2.75rem] md:text-[3.25rem] font-semibold tracking-tight text-[var(--color-text)] leading-[1.15] max-w-3xl mb-12"
          >
            Andrew Scott builds platforms, systems, and automation that turn complex operations into products people actually use.
          </motion.h1>
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
              className="font-mono text-sm inline-flex items-center gap-2.5 px-5 py-2.5 border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] transition-all duration-200 rounded-lg"
            >
              LinkedIn
              <ExternalIcon />
            </a>
            <a
              href={LINK.email}
              onClick={handleEmailClick}
              className="font-mono text-sm inline-flex items-center gap-2.5 px-5 py-2.5 border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] transition-all duration-200 rounded-lg"
            >
              {copied ? 'Copied!' : 'Email'}
              <ExternalIcon />
            </a>
            <a
              href={LINK.resume}
              target="_blank"
              rel="noopener noreferrer"
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
