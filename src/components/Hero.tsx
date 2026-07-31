import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { useEffect, useRef, useState, type PointerEvent } from 'react'

const LINK = {
  linkedin: 'https://linkedin.com/in/andrew-john-scott',
  resume: '/resume.pdf',
}

const EASE = [0.22, 1, 0.36, 1] as const

/* The signature moment: the page opens with hard-edged slabs tumbled across
   the viewport. As you scroll, the hero pins and the slabs travel, straighten,
   and land one after another into an ascending bar chart on a shared baseline:
   operational chaos becoming systems that scale, in the site's own shape
   language. Scroll-driven and reversible. The slabs also shy away from the
   cursor, because a site can be a toy.

   Desktop puts the chart beside the headline; mobile stacks it underneath,
   with fewer, wider bars so it still reads at phone width. */

type Coords = { tx: number; ty: number; w: number; h: number }

type BlockCfg = {
  sx: number // scatter x (vw)
  sy: number // scatter y (vh)
  rot: number // scatter rotation (deg)
  desktop: Coords
  mobile: Coords
  fill: 'surface' | 'ink' | 'green' | 'ochre'
  from: number // progress where this block starts converging
  to: number // progress where it locks in
  mobileHidden?: boolean // thinned out so phone bars stay legible
  cap?: boolean
}

/* Desktop: 9 bars, 4vw wide on a 5vw pitch, shared baseline at 80vh.
   Mobile: every other bar drops out, leaving 5 at 13vw on an 18vw pitch,
   baseline 91vh, sitting below the headline. */
const BARS: Array<{
  h: number
  mh: number
  fill: BlockCfg['fill']
  sx: number
  sy: number
  rot: number
  mobileHidden?: boolean
}> = [
  { h: 8,  mh: 5,  fill: 'surface', sx: 6,  sy: 14, rot: -18 },
  { h: 12, mh: 7,  fill: 'ink',     sx: 30, sy: 5,  rot: 13, mobileHidden: true },
  { h: 17, mh: 8,  fill: 'surface', sx: 52, sy: 9,  rot: -9 },
  { h: 22, mh: 10, fill: 'ochre',   sx: 78, sy: 4,  rot: 16, mobileHidden: true },
  { h: 28, mh: 12, fill: 'surface', sx: 88, sy: 28, rot: -14 },
  { h: 35, mh: 15, fill: 'ink',     sx: 14, sy: 66, rot: 12, mobileHidden: true },
  { h: 43, mh: 18, fill: 'surface', sx: 42, sy: 74, rot: -11, mobileHidden: true },
  { h: 52, mh: 22, fill: 'ochre',   sx: 68, sy: 70, rot: 9 },
  { h: 62, mh: 27, fill: 'surface', sx: 34, sy: 40, rot: -22 },
]

/* Each bar is built from stacked segments rather than one slab, so the chart
   reads as assembling piece by piece. Segments in a bar land bottom-up. */
const SEG_GAP = 0.5 // vh between segments, so the seams stay visible

const BLOCKS: BlockCfg[] = []

BARS.forEach((bar, i) => {
  const mobileIndex = BARS.slice(0, i).filter((b) => !b.mobileHidden).length
  const segs = Math.min(4, 1 + Math.floor(i / 2)) // taller bars, more pieces
  const dSeg = (bar.h - SEG_GAP * (segs - 1)) / segs
  const mSeg = (bar.mh - SEG_GAP * (segs - 1)) / segs
  const barStart = 0.08 + i * 0.028
  const barEnd = 0.46 + i * 0.036

  for (let s = 0; s < segs; s++) {
    // s = 0 is the bottom segment of the bar and lands first
    const t = segs === 1 ? 0 : s / (segs - 1)
    BLOCKS.push({
      sx: (bar.sx + s * 21) % 92,
      sy: (bar.sy + s * 17) % 82,
      rot: bar.rot + (s % 2 === 0 ? 9 : -12) * (s + 1) * 0.5,
      fill: bar.fill,
      mobileHidden: bar.mobileHidden,
      desktop: {
        tx: 50 + i * 5,
        ty: 80 - dSeg * (s + 1) - SEG_GAP * s,
        w: 4,
        h: dSeg,
      },
      mobile: {
        tx: 6 + mobileIndex * 18,
        ty: 91 - mSeg * (s + 1) - SEG_GAP * s,
        w: 13,
        h: mSeg,
      },
      from: barStart + t * 0.05,
      to: barEnd + t * 0.06,
    })
  }
})

// The data point that crowns the tallest bar, landing last
const TALLEST = BARS[BARS.length - 1]
const TALLEST_MOBILE_INDEX = BARS.filter((b) => !b.mobileHidden).length - 1
BLOCKS.push({
  sx: 60,
  sy: 34,
  rot: -26,
  fill: 'green',
  desktop: { tx: 50 + 8 * 5 + 0.5, ty: 80 - TALLEST.h - 4.4, w: 3, h: 3.2 },
  mobile: {
    tx: 6 + TALLEST_MOBILE_INDEX * 18 + 3.5,
    ty: 91 - TALLEST.mh - 5,
    w: 6,
    h: 3.6,
  },
  from: 0.36,
  to: 0.82,
  cap: true,
})

const FILLS: Record<BlockCfg['fill'], { bg: string; shadow: string }> = {
  surface: { bg: 'var(--color-surface)', shadow: '5px 5px 0 var(--color-ink)' },
  ink: { bg: 'var(--color-ink)', shadow: '5px 5px 0 var(--color-secondary)' },
  green: { bg: 'var(--color-primary)', shadow: '5px 5px 0 var(--color-ink)' },
  ochre: { bg: 'var(--color-secondary)', shadow: '5px 5px 0 var(--color-ink)' },
}

function Block({
  cfg,
  progress,
  reduced,
  isMobile,
  refFn,
}: {
  cfg: BlockCfg
  progress: MotionValue<number>
  reduced: boolean
  isMobile: boolean
  refFn: (el: HTMLDivElement | null) => void
}) {
  const target = isMobile ? cfg.mobile : cfg.desktop
  const x = useTransform(progress, [cfg.from, cfg.to], ['0vw', `${target.tx - cfg.sx}vw`])
  const y = useTransform(progress, [cfg.from, cfg.to], ['0vh', `${target.ty - cfg.sy}vh`])
  const rotate = useTransform(progress, [cfg.from, cfg.to], [cfg.rot, 0])
  // The completion click: once the chart locks, the cap pops its asterisk
  const capOpacity = useTransform(progress, [0.82, 0.88], [0, 1])
  const capScale = useTransform(progress, [0.82, 0.88], [0.3, 1])
  const fill = FILLS[cfg.fill]

  if (isMobile && cfg.mobileHidden) return null

  return (
    <div
      ref={refFn}
      className="absolute transition-transform duration-300 ease-out"
      style={{
        left: reduced ? `${target.tx}vw` : `${cfg.sx}vw`,
        top: reduced ? `${target.ty}vh` : `${cfg.sy}vh`,
        width: `${target.w}vw`,
        height: `${target.h}vh`,
      }}
    >
      <motion.div
        className="relative w-full h-full border-[3px] border-[var(--color-ink)]"
        style={
          reduced
            ? { background: fill.bg, boxShadow: fill.shadow }
            : { x, y, rotate, background: fill.bg, boxShadow: fill.shadow }
        }
      >
        {cfg.cap && (
          <motion.span
            style={reduced ? {} : { opacity: capOpacity, scale: capScale }}
            className="absolute inset-0 flex items-center justify-center font-display text-[clamp(1rem,2.6vh,1.6rem)] text-[var(--color-bg)] leading-none"
          >
            *
          </motion.span>
        )}
      </motion.div>
    </div>
  )
}

function Word({
  children,
  i,
  className = '',
}: {
  children: string
  i: number
  className?: string
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE, delay: 0.05 * i }}
      className={'inline-block' + (className ? ' ' + className : '')}
    >
      {children}
    </motion.span>
  )
}

export function Hero() {
  const trackRef = useRef<HTMLDivElement>(null)
  const blockRefs = useRef<(HTMLDivElement | null)[]>([])
  const reduced = useReducedMotion() ?? false
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])
  // After the chart locks it eases down a touch, so the release feels handed off
  const settleY = useTransform(scrollYProgress, [0.9, 1], ['0vh', '4vh'])
  // The trend line draws itself up across the finished bars
  const trendDraw = useTransform(scrollYProgress, [0.78, 0.93], [0, 1])
  const trendOpacity = useTransform(scrollYProgress, [0.76, 0.82], [0, 1])

  // The toy: slabs shy away from the cursor. Direct DOM writes, no re-renders.
  // Pointer-driven only, so it never fights a touch scroll.
  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced || isMobile || e.pointerType !== 'mouse') return
    for (const el of blockRefs.current) {
      if (!el) continue
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = cx - e.clientX
      const dy = cy - e.clientY
      const d = Math.hypot(dx, dy)
      const strength = Math.max(0, 1 - d / 240) * 16
      el.style.transform =
        strength > 0.5
          ? `translate(${(dx / d) * strength}px, ${(dy / d) * strength}px)`
          : ''
    }
  }

  const handlePointerLeave = () => {
    for (const el of blockRefs.current) {
      if (el) el.style.transform = ''
    }
  }

  const trackHeight = isMobile ? 'h-[190vh]' : 'h-[230vh]'

  return (
    <header
      id="top"
      ref={trackRef}
      className={reduced ? 'relative' : `relative ${trackHeight}`}
    >
      <div
        className={
          'top-0 overflow-hidden ' +
          (reduced ? 'relative min-h-[70vh]' : 'sticky h-screen')
        }
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {/* The slabs: chaos on arrival, a rising chart by the time you leave */}
        <motion.div
          className="absolute inset-0"
          style={reduced ? {} : { y: settleY }}
          aria-hidden
        >
          {BLOCKS.map((cfg, i) => (
            <Block
              key={i}
              cfg={cfg}
              progress={scrollYProgress}
              reduced={reduced}
              isMobile={isMobile}
              refFn={(el) => (blockRefs.current[i] = el)}
            />
          ))}

          {/* The trend line: draws up and to the right once the bars are in */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <motion.g
              style={reduced ? {} : { opacity: trendOpacity }}
              vectorEffect="non-scaling-stroke"
            >
              <motion.path
                d={
                  isMobile
                    ? 'M 12.5 86 L 30.5 83 L 48.5 79 L 66.5 69 L 84.5 64'
                    : 'M 52 72 L 57 68 L 62 63 L 67 58 L 72 52 L 77 45 L 82 37 L 87 28 L 92 18'
                }
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="0.55"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                style={reduced ? {} : { pathLength: trendDraw }}
              />
              <motion.path
                d={
                  isMobile
                    ? 'M 78.5 61 L 84.5 64 L 81.5 70'
                    : 'M 86 14 L 92 18 L 89 25'
                }
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="0.55"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                style={reduced ? {} : { pathLength: trendDraw }}
              />
            </motion.g>
          </svg>
        </motion.div>

        <div className="relative z-10 h-full flex items-start md:items-center pt-[14vh] md:pt-0 px-6 sm:px-10 md:px-14 pointer-events-none">
          <div className="max-w-[1100px] mx-auto w-full">
            <h1 className="font-display text-[clamp(2.25rem,8vw,5.25rem)] text-[var(--color-ink)] leading-[0.98] tracking-[-0.01em] mb-7 sm:mb-9 max-w-[11ch] md:max-w-[13ch]">
              <Word i={0}>Turning</Word> <Word i={1}>operational</Word>{' '}
              <Word i={2}>chaos</Word> <Word i={3}>into</Word>{' '}
              <Word i={4}>systems</Word> <Word i={5}>that</Word>{' '}
              <Word i={6} className="text-[var(--color-primary)]">
                scale.
              </Word>
            </h1>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.5 }}
              className="flex flex-wrap gap-4 sm:gap-[18px] pointer-events-auto"
            >
              <a
                href={LINK.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="press font-display text-sm text-[var(--color-bg)] bg-[var(--color-ink)] px-6 py-[15px] border-[3px] border-[var(--color-ink)]"
                style={{ boxShadow: '6px 6px 0 var(--color-primary)' }}
              >
                Resume
              </a>
              <a
                href={LINK.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="press font-display text-sm text-[var(--color-ink)] bg-[var(--color-bg)] px-6 py-[15px] border-[3px] border-[var(--color-ink)]"
                style={{ boxShadow: '6px 6px 0 var(--color-ink)' }}
              >
                LinkedIn
              </a>
            </motion.div>
          </div>
        </div>

        {!reduced && (
          <motion.p
            style={{ opacity: hintOpacity }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-[0.12em] text-[var(--color-text-muted)]"
          >
            SCROLL
          </motion.p>
        )}
      </div>
    </header>
  )
}
