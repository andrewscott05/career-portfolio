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
  seamOffset?: number // segment index, used to overlap borders into one rule
  cap?: boolean
}

/* Desktop: 11 bars, 3.3vw wide on a 4.1vw pitch, shared baseline at 80vh.
   Mobile: thinned to 5 bars at 13vw on an 18vw pitch, baseline 91vh,
   sitting below the headline. */
const DESK = { x0: 50, pitch: 4.1, w: 3.3, base: 80 }
const MOB = { x0: 6, pitch: 18, w: 13, base: 91 }

const BARS: Array<{
  h: number
  mh: number
  fill: BlockCfg['fill']
  mobileHidden?: boolean
}> = [
  { h: 6,  mh: 5,  fill: 'surface' },
  { h: 9,  mh: 0,  fill: 'ink',     mobileHidden: true },
  { h: 12, mh: 8,  fill: 'surface' },
  { h: 16, mh: 0,  fill: 'ochre',   mobileHidden: true },
  { h: 20, mh: 12, fill: 'surface' },
  { h: 25, mh: 0,  fill: 'ink',     mobileHidden: true },
  { h: 30, mh: 0,  fill: 'surface', mobileHidden: true },
  { h: 37, mh: 18, fill: 'ochre' },
  { h: 44, mh: 0,  fill: 'surface', mobileHidden: true },
  { h: 52, mh: 0,  fill: 'ink',     mobileHidden: true },
  { h: 62, mh: 27, fill: 'surface' },
]

/* Scatter positions are generated deterministically and kept clear of the
   copy, so the pieces are actually visible while they are still in chaos. */
const makeRand = (() => {
  let s = 20260731
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
})()

function scatter(mobileVisible: boolean) {
  for (let k = 0; k < 60; k++) {
    const x = 2 + makeRand() * 92
    const y = 3 + makeRand() * 90
    // desktop copy occupies the left half, middle band
    const overDesktopCopy = x < 50 && y > 18 && y < 76
    if (overDesktopCopy) continue
    if (mobileVisible) {
      // mobile copy runs across the top two thirds
      const overMobileCopy = y > 8 && y < 60
      if (overMobileCopy) continue
    }
    return { x, y }
  }
  return { x: 62 + makeRand() * 30, y: 78 + makeRand() * 14 }
}

/* Each bar is built from stacked segments rather than one slab, so the chart
   reads as assembling piece by piece. Segments land bottom-up and butt
   together into one solid bar: adjacent 3px borders are overlapped in px so
   the seam reads as a single rule, not a gap. */
const BLOCKS: BlockCfg[] = []

BARS.forEach((bar, i) => {
  const mobileIndex = BARS.slice(0, i).filter((b) => !b.mobileHidden).length
  const segs = Math.min(5, 1 + Math.floor(i / 2)) // taller bars, more pieces
  const dSeg = bar.h / segs
  const mSeg = bar.mh / segs
  const barStart = 0.06 + i * 0.024
  const barEnd = 0.44 + i * 0.032

  for (let s = 0; s < segs; s++) {
    // s = 0 is the bottom segment of the bar and lands first
    const t = segs === 1 ? 0 : s / (segs - 1)
    const pt = scatter(!bar.mobileHidden)
    BLOCKS.push({
      sx: pt.x,
      sy: pt.y,
      rot: (s % 2 === 0 ? 1 : -1) * (8 + ((i * 7 + s * 13) % 16)),
      fill: bar.fill,
      mobileHidden: bar.mobileHidden,
      seamOffset: s, // shifts down 3px per segment so borders overlap
      desktop: { tx: DESK.x0 + i * DESK.pitch, ty: DESK.base - dSeg * (s + 1), w: DESK.w, h: dSeg },
      mobile: { tx: MOB.x0 + mobileIndex * MOB.pitch, ty: MOB.base - mSeg * (s + 1), w: MOB.w, h: mSeg },
      from: barStart + t * 0.045,
      to: barEnd + t * 0.055,
    })
  }
})

// The data point that crowns the tallest bar, landing last
const LAST = BARS.length - 1
const TALLEST = BARS[LAST]
const TALLEST_MOBILE_INDEX = BARS.filter((b) => !b.mobileHidden).length - 1
BLOCKS.push({
  sx: 58,
  sy: 12,
  rot: -26,
  fill: 'green',
  desktop: {
    tx: DESK.x0 + LAST * DESK.pitch + (DESK.w - 2.6) / 2,
    ty: DESK.base - TALLEST.h - 4.4,
    w: 2.6,
    h: 3.2,
  },
  mobile: {
    tx: MOB.x0 + TALLEST_MOBILE_INDEX * MOB.pitch + (MOB.w - 6) / 2,
    ty: MOB.base - TALLEST.mh - 5,
    w: 6,
    h: 3.6,
  },
  from: 0.34,
  to: 0.8,
  cap: true,
})

/* Trend line traced across the bar tops, plus where the arrowhead lands */
const trendPath = (m: boolean) => {
  const cfg = m ? MOB : DESK
  return BARS.map((b, i) => {
    if (m && b.mobileHidden) return null
    const mi = BARS.slice(0, i).filter((x) => !x.mobileHidden).length
    const x = cfg.x0 + (m ? mi : i) * cfg.pitch + cfg.w / 2
    const y = cfg.base - (m ? b.mh : b.h)
    return `${x.toFixed(2)} ${y.toFixed(2)}`
  })
    .filter(Boolean)
    .map((p, idx) => (idx === 0 ? `M ${p}` : `L ${p}`))
    .join(' ')
}

const TREND_DESKTOP = trendPath(false)
const TREND_MOBILE = trendPath(true)
const TREND_END_DESKTOP = {
  x: DESK.x0 + LAST * DESK.pitch + DESK.w / 2,
  y: DESK.base - TALLEST.h,
}
const TREND_END_MOBILE = {
  x: MOB.x0 + TALLEST_MOBILE_INDEX * MOB.pitch + MOB.w / 2,
  y: MOB.base - TALLEST.mh,
}

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
  // Each segment sits 3px lower than the one below it, so their borders
  // overlap into a single rule and the bar reads as solid, not stacked.
  const seam = (cfg.seamOffset ?? 0) * 3
  const x = useTransform(progress, [cfg.from, cfg.to], ['0vw', `${target.tx - cfg.sx}vw`])
  const y = useTransform(
    progress,
    [cfg.from, cfg.to],
    ['0vh', `calc(${target.ty - cfg.sy}vh + ${seam}px)`],
  )
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
        top: reduced ? `calc(${target.ty}vh + ${seam}px)` : `${cfg.sy}vh`,
        width: `${target.w}vw`,
        height: `calc(${target.h}vh + 3px)`,
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
  // The trend line draws itself up across the finished bars, arrowhead last
  const trendDraw = useTransform(scrollYProgress, [0.78, 0.93], [0, 1])
  const trendOpacity = useTransform(scrollYProgress, [0.76, 0.82], [0, 1])
  const arrowOpacity = useTransform(scrollYProgress, [0.9, 0.95], [0, 1])
  const arrowScale = useTransform(scrollYProgress, [0.9, 0.95], [0.5, 1])

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

          {/* The trend line: draws up and to the right once the bars are in.
              The stretched viewBox would distort an arrowhead drawn inside it,
              so the head is a separate fixed-size element at the line's end. */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <motion.path
              d={isMobile ? TREND_MOBILE : TREND_DESKTOP}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              style={
                reduced ? {} : { opacity: trendOpacity, pathLength: trendDraw }
              }
            />
          </svg>

          <motion.div
            className="absolute pointer-events-none"
            style={{
              left: `${(isMobile ? TREND_END_MOBILE : TREND_END_DESKTOP).x}vw`,
              top: `${(isMobile ? TREND_END_MOBILE : TREND_END_DESKTOP).y}vh`,
              ...(reduced ? {} : { opacity: arrowOpacity, scale: arrowScale }),
            }}
          >
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              className="-translate-x-1/2 -translate-y-1/2"
            >
              {/* A corner chevron: vertex up-right, matching the line's climb */}
              <path
                d="M 7 5 L 19 5 L 19 17"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
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
