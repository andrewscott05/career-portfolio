import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

export function Contact() {
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
          <h2 className="font-display text-[clamp(1.75rem,5vw,2.375rem)] text-[var(--color-bg)] leading-[1.05] mb-4">
            Let&apos;s build something{' '}
            <span className="text-[var(--color-secondary)]">people rely on.</span>
          </h2>
          <p className="font-mono text-sm text-[var(--color-bg)] max-w-[500px] mx-auto leading-[1.8] mb-7">
            I&apos;m especially drawn to products people depend on every day.
            Monarch Money and Life360 are two I use and admire.
          </p>
          <a
            href="mailto:ascott1296@gmail.com"
            className="press inline-block font-display text-xl text-[var(--color-ink)] bg-[var(--color-secondary)] px-7 py-3.5 border-[3px] border-[var(--color-ink)]"
          >
            ascott1296@gmail.com
          </a>
        </motion.div>
      </div>
    </section>
  )
}
