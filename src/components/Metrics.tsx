import { motion } from 'framer-motion'
import { metrics } from '../data/metrics'

const EASE = [0.22, 1, 0.36, 1] as const

export function Metrics() {
  return (
    <section className="px-6 sm:px-10 md:px-14 pb-16 sm:pb-20">
      <div className="max-w-[1100px] mx-auto w-full">
        <p className="section-label mb-5">// By the numbers</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-[22px]">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.value}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
              className="bg-[var(--color-surface)] border-[3px] border-[var(--color-ink)] p-[30px]"
              style={{ boxShadow: '6px 6px 0 var(--color-ink)' }}
            >
              <p className="font-display text-[44px] text-[var(--color-primary)] leading-none">
                {metric.value}
              </p>
              <p className="font-mono text-xs text-[var(--color-ink)] mt-3 leading-[1.65]">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
