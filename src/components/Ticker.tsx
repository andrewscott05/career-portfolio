import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import { useRef } from 'react'

/* A thin ruled strip that drifts slowly on its own and surges with your
   scroll: drag the page and it drags with you, scroll back up and it
   reverses. Alive rather than decorative. */

const ITEMS = [
  'AI AGENTS',
  'ML PRICING',
  '0 TO 1 PLATFORMS',
  'PRODUCT STRATEGY',
  'UNIT ECONOMICS',
  'WORKFLOW AUTOMATION',
  'DESIGN SYSTEMS',
  'GO-TO-MARKET',
  'WAYS OF WORKING',
]

const wrap = (min: number, max: number, v: number) => {
  const range = max - min
  return min + (((v - min) % range) + range) % range
}

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((t) => (
        <span key={t} className="flex items-center">
          <span className="font-display text-sm sm:text-lg text-[var(--color-ink)] px-4 sm:px-7 whitespace-nowrap">
            {t}
          </span>
          <span className="font-display text-sm sm:text-lg text-[var(--color-primary)]">
            *
          </span>
        </span>
      ))}
    </div>
  )
}

export function Ticker() {
  const reduced = useReducedMotion() ?? false
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], {
    clamp: false,
  })
  const directionFactor = useRef(1)

  useAnimationFrame((_t, delta) => {
    if (reduced) return
    let moveBy = directionFactor.current * -1.2 * (delta / 1000)
    const vf = velocityFactor.get()
    if (vf < 0) directionFactor.current = -1
    else if (vf > 0) directionFactor.current = 1
    moveBy += directionFactor.current * moveBy * Math.abs(vf)
    baseX.set(wrap(-25, 0, baseX.get() + moveBy))
  })

  const x = useTransform(baseX, (v) => `${v}%`)

  return (
    <section
      aria-hidden
      className="border-y-[3px] border-[var(--color-ink)] py-3 sm:py-3.5 overflow-hidden bg-[var(--color-bg)]"
    >
      <motion.div style={reduced ? {} : { x }} className="flex w-max">
        <Row />
        <Row />
        <Row />
        <Row />
      </motion.div>
    </section>
  )
}
