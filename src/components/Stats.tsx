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
        <h2 className="font-display text-[clamp(1.5rem,4vw,2rem)] text-[var(--color-ink)] mb-8 sm:mb-10">
          By the numbers{' '}
          <span className="font-mono text-[13px] font-medium text-[var(--color-text-muted)] align-middle">
            (0{STATS.length})
          </span>
        </h2>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-8 sm:gap-x-16 gap-y-9 sm:gap-y-10">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 1.05, y: -6 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, ease: EASE, delay: i * STAGGER }}
            >
              <p className="font-display text-[clamp(2.25rem,7vw,4rem)] text-[var(--color-ink)] leading-none">
                <CountUp
                  target={stat.target}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  startDelay={i * STAGGER}
                />
              </p>
              <p className="font-serif text-[15px] sm:text-base text-[var(--color-text-secondary)] leading-[1.5] mt-3 max-w-[22ch]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
