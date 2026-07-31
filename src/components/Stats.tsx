import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const EASE = [0.22, 1, 0.36, 1] as const

const STATS = [
  { target: 400, prefix: '$', suffix: 'M+', label: 'Pricing run rate scaled 2.3x' },
  { target: 20, suffix: '%', label: 'Manual tracking workload cut' },
  { target: 63, suffix: '%', label: 'Faster component design time' },
]

function CountUp({
  target,
  prefix = '',
  suffix = '',
  duration = 1.4,
}: {
  target: number
  prefix?: string
  suffix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf: number
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(target * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, target, duration])

  return (
    <span ref={ref}>
      {prefix}
      {value}
      {suffix}
    </span>
  )
}

export function Stats() {
  return (
    <section className="px-6 sm:px-10 md:px-14 pb-16 sm:pb-20">
      <div className="max-w-[1100px] mx-auto w-full">
        <p className="section-label mb-6 sm:mb-7">By the numbers</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
              className="bg-[var(--color-surface)] border-[3px] border-[var(--color-ink)] px-7 py-8"
              style={{ boxShadow: '8px 8px 0 var(--color-ink)' }}
            >
              <p className="font-display text-[clamp(2rem,5vw,2.75rem)] text-[var(--color-primary)] leading-none mb-3">
                <CountUp target={stat.target} prefix={stat.prefix} suffix={stat.suffix} />
              </p>
              <p className="font-mono text-[13px] text-[var(--color-text-secondary)]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
