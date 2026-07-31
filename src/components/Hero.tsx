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

/* The signature moment: the page opens with hard-edged pieces tumbled across
   the viewport. As you scroll, the hero pins and the pieces travel, straighten,
   and land into an ascending bar chart on a shared baseline. While flying,
   each piece is a bordered chip; the moment its bar completes, the per-piece
   borders and shadows dissolve and a single outline wraps the whole bar, so
   every bar reads as one solid slab. A thick cased trend line then draws up
   across the tops and fires a solid arrowhead: chaos, systems, scale. */

type Coords = { tx: number; ty: number; w: number; h: number }

type BlockCfg = {
  sx: number // scatter x (vw)
  sy: number // scatter y (vh)
  rot: number // scatter rotation (deg)
  desktop: Coords
  mobile: Coords
  fill: 'surface' | 'ink' | 'green' | 'ochre'
  from: number // progress where this piece starts converging
  to: number // progress where it locks in
  fade: [number, number] // window where its chip border/shadow dissolves
  mobileHidden?: boolean // thinned out so phone bars stay legible
}

/* Desktop: 11 bars, 3.3vw wide on a 4.1vw pitch, shared baseline at 80vh.
   Mobile: thinned to 5 bars at 13vw on an 18vw pitch, baseline 91vh,
   sitting below the headline. */
const DESK = { x0: 50, pitch: 4.1, w: 3.3, base: 80 }
const MOB = { x0: 6, pitch: 18, w: 13, base: 91 }

/* Pieces overlap the piece below by this much once landed. Same fill, no
   border, so the overlap is invisible; it exists to swallow the sub-pixel
   cracks that fractional viewport units leave between separate divs. */
const PIECE_OVERLAP_VH = 0.8

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

const BLOCKS: BlockCfg[] = []

/* One outline per bar, fading in as that bar's last piece lands */
type BarOutlineCfg = {
  desktop: Coords
  mobile: Coords
  fade: [number, number]
  mobileHidden?: boolean
}
const BAR_OUTLINES: BarOutlineCfg[] = []

BARS.forEach((bar, i) => {
  const mobileIndex = BARS.slice(0, i).filter((b) => !b.mobileHidden).length
  const segs = Math.min(5, 1 + Math.floor(i / 2)) // taller bars, more pieces
  const dSeg = bar.h / segs
  const mSeg = bar.mh / segs
  const barStart = 0.06 + i * 0.024
  const barEnd = 0.44 + i * 0.032
  const lastTo = barEnd + (segs === 1 ? 0 : 0.055)
  const fade: [number, number] = [lastTo, Math.min(lastTo + 0.04, 0.86)]

  for (let s = 0; s < segs; s++) {
    // s = 0 is the bottom piece of the bar and lands first; pieces above it
    // run slightly tall so they overlap downward into the piece below
    const t = segs === 1 ? 0 : s / (segs - 1)
    const overlap = s > 0 ? PIECE_OVERLAP_VH : 0
    const pt = scatter(!bar.mobileHidden)
    BLOCKS.push({
      sx: pt.x,
      sy: pt.y,
      rot: (s % 2 === 0 ? 1 : -1) * (8 + ((i * 7 + s * 13) % 16)),
      fill: bar.fill,
      mobileHidden: bar.mobileHidden,
      fade,
      desktop: {
        tx: DESK.x0 + i * DESK.pitch,
        ty: DESK.base - dSeg * (s + 1),
        w: DESK.w,
        h: dSeg + overlap,
      },
      mobile: {
        tx: MOB.x0 + mobileIndex * MOB.pitch,
        ty: MOB.base - mSeg * (s + 1),
        w: MOB.w,
        h: mSeg + overlap,
      },
      from: barStart + t * 0.045,
      to: barEnd + t * 0.055,
    })
  }

  BAR_OUTLINES.push({
    desktop: { tx: DESK.x0 + i * DESK.pitch, ty: DESK.base - bar.h, w: DESK.w, h: bar.h },
    mobile: { tx: MOB.x0 + mobileIndex * MOB.pitch, ty: MOB.base - bar.mh, w: MOB.w, h: bar.mh },
    fade,
    mobileHidden: bar.mobileHidden,
  })
})

/* Trend line traced across the bar tops, plus where the arrowhead lands */
const LAST = BARS.length - 1
const TALLEST = BARS[LAST]
const TALLEST_MOBILE_INDEX = BARS.filter((b) => !b.mobileHidden).length - 1

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
/* Final climb of the line, in viewport units, per breakpoint. The real
   screen angle depends on the viewport's aspect, so it is computed at
   runtime from these plus the measured container size. */
const CLIMB_DESKTOP = { dxVw: DESK.pitch, dyVh: (DESK.base - BARS[LAST - 1].h) - (DESK.base - TALLEST.h) }
const CLIMB_MOBILE = { dxVw: MOB.pitch, dyVh: (MOB.base - BARS[7].mh) - (MOB.base - TALLEST.mh) }

const FILLS: Record<BlockCfg['fill'], string> = {
  surface: 'var(--color-surface)',
  ink: 'var(--color-ink)',
  green: 'var(--color-primary)',
  ochre: 'var(--color-secondary)',
}
/* One shadow for everything: the chart reads as a single printed object */
const HARD_SHADOW = '5px 5px 0 var(--color-ink)'

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
  // Chip chrome (border + shadow) dissolves once this piece's bar is whole
  const chipOpacity = useTransform(progress, cfg.fade, [1, 0])

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
        className="relative w-full h-full"
        style={
          reduced
            ? { background: FILLS[cfg.fill] }
            : { x, y, rotate, background: FILLS[cfg.fill] }
        }
      >
        {!reduced && (
          <motion.div
            className="absolute inset-0 border-[3px] border-[var(--color-ink)]"
            style={{ opacity: chipOpacity, boxShadow: HARD_SHADOW }}
          />
        )}
      </motion.div>
    </div>
  )
}

function BarOutline({
  cfg,
  progress,
  reduced,
  isMobile,
}: {
  cfg: BarOutlineCfg
  progress: MotionValue<number>
  reduced: boolean
  isMobile: boolean
}) {
  const opacity = useTransform(progress, cfg.fade, [0, 1])
  const target = isMobile ? cfg.mobile : cfg.desktop

  if (isMobile && cfg.mobileHidden) return null

  return (
    <motion.div
      className="absolute border-[3px] border-[var(--color-ink)] pointer-events-none"
      style={{
        left: `${target.tx}vw`,
        top: `${target.ty}vh`,
        width: `${target.w}vw`,
        height: `${target.h}vh`,
        boxShadow: HARD_SHADOW,
        zIndex: 1,
        opacity: reduced ? 1 : opacity,
      }}
    />
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
  const stageRef = useRef<HTMLDivElement>(null)
  const blockRefs = useRef<(HTMLDivElement | null)[]>([])
  const reduced = useReducedMotion() ?? false
  const [isMobile, setIsMobile] = useState(false)
  const [arrowRot, setArrowRot] = useState(-50)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // The arrowhead's rotation must match the final climb in *screen* pixels,
  // which depends on the viewport aspect, so measure rather than guess.
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const climb = isMobile ? CLIMB_MOBILE : CLIMB_DESKTOP
    const measure = () => {
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) return
      const dx = (climb.dxVw / 100) * r.width
      const dy = (climb.dyVh / 100) * r.height
      setArrowRot(-(Math.atan2(dy, dx) * 180) / Math.PI)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [isMobile])

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
  const arrowOpacity = useTransform(scrollYProgress, [0.91, 0.96], [0, 1])
  const arrowScale = useTransform(scrollYProgress, [0.91, 0.96], [0.4, 1])

  // The toy: pieces shy away from the cursor while they are still chaos, and
  // stop responding as the bars assemble, so a finished bar never tears apart.
  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced || isMobile || e.pointerType !== 'mouse') return
    const damp = Math.max(0, 1 - scrollYProgress.get() / 0.45)
    if (damp === 0) {
      handlePointerLeave()
      return
    }
    for (const el of blockRefs.current) {
      if (!el) continue
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = cx - e.clientX
      const dy = cy - e.clientY
      const d = Math.hypot(dx, dy)
      const strength = Math.max(0, 1 - d / 240) * 16 * damp
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
  const trendEnd = isMobile ? TREND_END_MOBILE : TREND_END_DESKTOP

  return (
    <header
      id="top"
      ref={trackRef}
      className={reduced ? 'relative' : `relative ${trackHeight}`}
    >
      <div
        ref={stageRef}
        className={
          'top-0 overflow-hidden ' +
          (reduced ? 'relative min-h-[70vh]' : 'sticky h-screen')
        }
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {/* The pieces: chaos on arrival, a rising chart by the time you leave */}
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

          {/* Once a bar is whole, one outline and one shadow wrap it */}
          {BAR_OUTLINES.map((cfg, i) => (
            <BarOutline
              key={i}
              cfg={cfg}
              progress={scrollYProgress}
              reduced={reduced}
              isMobile={isMobile}
            />
          ))}

          {/* The trend line rides above the bars, cased in the page colour so
              it stays readable across ink, ochre and white alike */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 2 }}
          >
            <motion.path
              d={isMobile ? TREND_MOBILE : TREND_DESKTOP}
              fill="none"
              stroke="var(--color-bg)"
              strokeWidth="15"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              style={
                reduced ? {} : { opacity: trendOpacity, pathLength: trendDraw }
              }
            />
            <motion.path
              d={isMobile ? TREND_MOBILE : TREND_DESKTOP}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              style={
                reduced ? {} : { opacity: trendOpacity, pathLength: trendDraw }
              }
            />
          </svg>

          {/* Solid stock-chart arrowhead, base tucked under the line end,
              extending onward along the measured direction of the climb */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              left: `${trendEnd.x}vw`,
              top: `${trendEnd.y}vh`,
              zIndex: 3,
              ...(reduced ? {} : { opacity: arrowOpacity, scale: arrowScale }),
            }}
          >
            <svg
              width="58"
              height="58"
              viewBox="0 0 24 24"
              style={{
                transform: `translate(-50%, -50%) rotate(${arrowRot}deg)`,
              }}
            >
              <polygon
                points="11,5.5 23,12 11,18.5"
                fill="var(--color-primary)"
                stroke="var(--color-bg)"
                strokeWidth="1.6"
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
