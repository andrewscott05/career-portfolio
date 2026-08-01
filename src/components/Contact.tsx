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

/* Full-bleed poster, not a banner in a box: the page itself turns green,
   type is left-aligned and oversized, and the email is a giant underlined
   link rather than a button. */

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
    <section
      id="contact"
      className="bg-[var(--color-primary)] border-t-[3px] border-[var(--color-ink)]"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55, ease: EASE }}
        className="max-w-[1100px] mx-auto w-full px-6 sm:px-10 md:px-14 py-20 sm:py-28"
      >
        <p className="font-mono text-[11px] tracking-[0.12em] text-[var(--color-ink-subtext)] mb-6">
          CONTACT
        </p>
        <h2 className="font-display text-[clamp(2.25rem,6.5vw,4.25rem)] text-[var(--color-bg)] leading-[1.0] mb-10 sm:mb-12 max-w-[16ch]">
          Let&apos;s build something{' '}
          <span className="text-[var(--color-secondary)]">people rely on.</span>
        </h2>
        <a
          href={`mailto:${EMAIL}`}
          onClick={handleEmailClick}
          className="group inline-block"
        >
          <span className="inline-block font-display text-[clamp(1.2rem,4.5vw,2.6rem)] leading-tight pb-1.5 text-[var(--color-bg)] border-b-[4px] border-[var(--color-bg)] group-hover:text-[var(--color-secondary)] group-hover:border-[var(--color-secondary)] transition-colors break-all">
            {copied ? 'Copied to clipboard!' : EMAIL}
          </span>
        </a>
      </motion.div>
    </section>
  )
}
