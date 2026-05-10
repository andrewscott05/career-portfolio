import { motion } from 'framer-motion'
import { AnimatedSection } from './AnimatedSection'

const EASE = [0.22, 1, 0.36, 1] as const

const testimonials = [
  {
    quote:
      "He is a huge reason why I have the job I have. He will help his coworkers regardless of what he has on his plate.",
    attribution: "Peer, Arrive Logistics",
  },
  {
    quote:
      "He has no real responsibility to do that; he just wants to help us all learn and get better at our roles.",
    attribution: "Peer, Arrive Logistics",
  },
  {
    quote:
      "Andrew exemplifies leadership through action, consistently setting a standard of excellence that others aspire to emulate.",
    attribution: "Peer, Arrive Logistics",
  },
]

export function Testimonials() {
  return (
    <AnimatedSection id="testimonials" className="py-16 sm:py-24 px-6 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-[1200px] mx-auto w-full">
        <div className="md:grid md:grid-cols-[140px_1fr] md:gap-16">
          <div>
            <h2 className="section-label">What peers say</h2>
          </div>
          <div className="mt-8 md:mt-0 max-w-3xl">
            <div className="grid gap-8 sm:grid-cols-3">
              {testimonials.map((t, i) => (
                <motion.blockquote
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
                  className="border-l-2 border-[var(--color-primary)] pl-5"
                >
                  <p className="text-[var(--color-text)] text-sm leading-relaxed mb-3 italic">
                    "{t.quote}"
                  </p>
                  <cite className="text-xs text-[var(--color-text-muted)] not-italic font-mono">
                    {t.attribution}
                  </cite>
                </motion.blockquote>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
