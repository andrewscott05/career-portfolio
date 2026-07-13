import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

const testimonials = [
  {
    quote:
      'He is a huge reason why I have the job I have. He will help his coworkers regardless of what he has on his plate.',
    attribution: 'Peer, Arrive Logistics',
  },
  {
    quote:
      'He has no real responsibility to do that; he just wants to help us all learn and get better at our roles.',
    attribution: 'Peer, Arrive Logistics',
  },
  {
    quote:
      'Andrew exemplifies leadership through action, consistently setting a standard of excellence that others aspire to emulate.',
    attribution: 'Peer, Arrive Logistics',
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="px-6 sm:px-10 md:px-14 pb-16 sm:pb-20">
      <div className="max-w-[1100px] mx-auto w-full">
        <p className="section-label mb-5">// What peers say</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-[22px]">
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
              className="bg-[var(--color-surface)] border-[3px] border-[var(--color-ink)] p-6 flex flex-col justify-between"
              style={{ boxShadow: '6px 6px 0 var(--color-ink)' }}
            >
              <p className="font-mono text-[13px] text-[var(--color-ink)] leading-[1.7] mb-5">
                &ldquo;{t.quote}&rdquo;
              </p>
              <cite className="font-mono text-[11px] tracking-[0.08em] uppercase text-[var(--color-primary)] not-italic">
                {t.attribution}
              </cite>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
