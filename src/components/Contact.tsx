import { useState } from 'react'
import { motion } from 'framer-motion'

const EMAIL = 'ascott1296@gmail.com'
const EASE = [0.22, 1, 0.36, 1] as const

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

export function Contact() {
  const [copied, setCopied] = useState(false)

  const handleEmailClick = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(EMAIL).catch(() => fallbackCopy(EMAIL))
    } else {
      fallbackCopy(EMAIL)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="contact" className="px-6 sm:px-10 md:px-14 pb-20">
      <div className="max-w-[1100px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: EASE }}
          className="bg-[var(--color-primary)] border-[3px] border-[var(--color-ink)] px-8 py-12 sm:p-14 text-center"
          style={{ boxShadow: '10px 10px 0 var(--color-ink)' }}
        >
          <h2 className="font-display text-[clamp(1.75rem,5vw,2.375rem)] text-[var(--color-bg)] leading-[1.05] mb-8">
            Let&apos;s build something{' '}
            <span className="text-[var(--color-secondary)]">people rely on.</span>
          </h2>
          <a
            href={`mailto:${EMAIL}`}
            onClick={handleEmailClick}
            className="press inline-flex items-center gap-2.5 font-display text-xl text-[var(--color-ink)] bg-[var(--color-secondary)] px-7 py-3.5 border-[3px] border-[var(--color-ink)]"
          >
            {copied ? 'Copied to clipboard!' : EMAIL}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              {copied ? (
                <polyline points="20 6 9 17 4 12" />
              ) : (
                <>
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </>
              )}
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
