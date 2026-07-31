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
  start,
}: {
  target: number
  prefix?: string
  suffix?: string
  duration?: number
  startDelay?: number
  start: boolean
}) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!start) return
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
  }, [start, target, duration, startDelay])

  return (
    <span>
      {prefix}
      {value}
      {suffix}
    </span>
  )
}

export function Stats() {
  const sectionRef = useRef<HTMLElement>(null)
  // One trigger for the whole section, and only once it is properly on
  // screen: per-number triggers fired as soon as the section clipped the
  // viewport edge, so the counting was over before you arrived.
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-20% 0px -25% 0px',
  })

  return (
    <section ref={sectionRef} className="px-6 sm:px-10 md:px-14 pb-16 sm:pb-20">
      <div className="max-w-[1100px] mx-auto w-full">
        <h2 className="font-display text-[clamp(1.5rem,4vw,2rem)] text-[var(--color-ink)] mb-8 sm:mb-10">
          By the numbers
        </h2>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-8 sm:gap-x-16 gap-y-9 sm:gap-y-10">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 1.05, y: -6 }}
              animate={inView ? { opacity: 1, scale: 1, y: 0 } : undefined}
              transition={{ duration: 0.45, ease: EASE, delay: i * STAGGER }}
            >
              <p className="font-display text-[clamp(2.25rem,7vw,4rem)] text-[var(--color-ink)] leading-none">
                <CountUp
                  target={stat.target}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  startDelay={i * STAGGER}
                  start={inView}
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
