import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const EASE = [0.22, 1, 0.36, 1] as const
const STAGGER = 0.18 // seconds between each stat starting, left to right

const STATS = [
  { target: 400, prefix: '$', suffix: 'M+', label: 'Pricing run rate scaled 2.3x' },
  { target: 20, suffix: '%', label: 'Manual tracking workload cut' },
  { target: 63, suffix: '%', label: 'Faster build time' },
  { target: 15, suffix: '%', label: 'Faster project turnaround' },
]

function CountUp({
  target,
  prefix = '',
  suffix = '',
  duration = 1.2,
  startDelay = 0,
}: {
  target: number
  prefix?: string
  suffix?: string
  duration?: number
  startDelay?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf = 0
    let cancelled = false
    const timeout = setTimeout(() => {
      const start = performance.now()
      const tick = (now: number) => {
        if (cancelled) return
        const t = Math.min((now - start) / (duration * 1000), 1)
        const eased = 1 - Math.pow(1 - t, 3)
        setValue(Math.round(target * eased))
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, startDelay * 1000)
    return () => {
      cancelled = true
      clearTimeout(timeout)
      cancelAnimationFrame(raf)
    }
  }, [inView, target, duration, startDelay])

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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, ease: EASE, delay: i * STAGGER }}
              className="border-t-[3px] border-[var(--color-ink)] pt-4"
            >
              <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-[var(--color-text-muted)] leading-snug min-h-[2.6em]">
                {stat.label}
              </p>
              <p className="font-display text-[clamp(2.25rem,6vw,3.5rem)] text-[var(--color-ink)] leading-none mt-3">
                <CountUp
                  target={stat.target}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  startDelay={i * STAGGER}
                />
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
