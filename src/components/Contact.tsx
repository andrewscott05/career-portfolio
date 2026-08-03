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

/* The page signs off in green: a plain invitation, the email address as the
   single big move, then a true footer rule with the practical links. No
   eyebrow label, no two-tone headline, nothing that reads like a template. */

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
    <footer
      id="contact"
      className="bg-[var(--color-primary)] border-t-[3px] border-[var(--color-ink)]"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55, ease: EASE }}
        className="max-w-[1100px] mx-auto w-full px-6 sm:px-10 md:px-14 pt-14 sm:pt-16 pb-8 sm:pb-9"
      >
        <h2 className="font-display text-[clamp(1.5rem,3.5vw,2.25rem)] text-[var(--color-bg)] leading-[1.05] max-w-[24ch]">
          Let&apos;s build something people rely on.
        </h2>

        <div className="mt-7 sm:mt-8">
          <a
            href={`mailto:${EMAIL}`}
            onClick={handleEmailClick}
            className="group inline-block"
          >
            <span className="inline-block font-display text-[clamp(1.05rem,3vw,1.8rem)] leading-tight pb-1.5 text-[var(--color-bg)] border-b-[4px] border-[var(--color-bg)] group-hover:text-[var(--color-secondary)] group-hover:border-[var(--color-secondary)] transition-colors break-all">
              {EMAIL}
            </span>
          </a>
          {/* Confirmation sits beside the address, so the big type never jumps */}
          <span
            aria-live="polite"
            className={`block sm:inline-block sm:ml-5 mt-2 sm:mt-0 font-display text-[12px] uppercase text-[var(--color-secondary)] transition-opacity duration-300 ${copied ? 'opacity-100' : 'opacity-0'}`}
          >
            copied to your clipboard
          </span>
        </div>

        {/* One quiet closing line under a rule */}
        <div className="mt-10 sm:mt-12 pt-5 border-t-[3px] border-[var(--color-bg)]/25">
          <p className="font-serif text-[14px] text-[var(--color-bg)]/70">
            Andrew Scott · Austin, Texas
          </p>
        </div>
      </motion.div>
    </footer>
  )
}
