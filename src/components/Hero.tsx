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
  sx: number // scatter x (vw), desktop
  sy: number // scatter y (vh), desktop
  msx: number // scatter x (vw), mobile
  msy: number // scatter y (vh), mobile
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

/* Scatter positions are generated deterministically, on the piece's real
   footprint rather than a bare point: kept inside the frame, clear of the
   copy, and spaced off each other so the chaos reads as strewn rather than
   piled. Best-candidate sampling gives an even spread without a grid. */
const makeRand = (() => {
  let s = 20260731
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
})()

type Rect = { x: number; y: number; w: number; h: number }

// Boxes the copy sits in, per breakpoint, in vw/vh
const COPY_DESKTOP: Rect = { x: 0, y: 15, w: 53, h: 68 }
const COPY_MOBILE: Rect = { x: 0, y: 5, w: 100, h: 54 }

/** Separation between two boxes; negative means they overlap. */
function gap(a: Rect, b: Rect) {
  const dx = Math.max(b.x - (a.x + a.w), a.x - (b.x + b.w))
  const dy = Math.max(b.y - (a.y + a.h), a.y - (b.y + b.h))
  return Math.max(dx, dy)
}

/* Each breakpoint gets its own scatter. Sharing one set meant reserving the
   wide mobile footprint on desktop too, which shoved everything into a corner. */
const placedDesktop: Rect[] = []
const placedMobile: Rect[] = []

function scatterIn(w: number, h: number, copy: Rect, placed: Rect[]) {
  let best = { x: 60, y: 80 }
  let bestScore = -Infinity

  for (let k = 0; k < 400; k++) {
    const x = 1.5 + makeRand() * Math.max(1, 97 - w)
    const y = 2 + makeRand() * Math.max(1, 94 - h)
    const box = { x, y, w, h }
    if (gap(box, copy) < 1.5) continue

    let nearest = Infinity
    for (const p of placed) nearest = Math.min(nearest, gap(box, p))
    if (nearest > bestScore) {
      bestScore = nearest
      best = { x, y }
      if (nearest > 4) break // comfortably clear, take it
    }
  }

  placed.push({ x: best.x, y: best.y, w, h })
  return best
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
    const dPt = scatterIn(DESK.w, dSeg + overlap, COPY_DESKTOP, placedDesktop)
    const mPt = bar.mobileHidden
      ? dPt
      : scatterIn(MOB.w, mSeg + overlap, COPY_MOBILE, placedMobile)
    BLOCKS.push({
      sx: dPt.x,
      sy: dPt.y,
      msx: mPt.x,
      msy: mPt.y,
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

/* The trend line floats clear above the bars rather than tracing their tops,
   and alternates its lift so it genuinely rises and falls on the way up, the
   way a real chart does. Every point is at least CLEAR above its own bar, and
   a pass afterwards raises any point whose segment would still clip a bar. */
const TREND_CLEAR = 3 // vh minimum air between the line and any bar top
const TREND_AMP = 4.5 // vh extra lift on alternating points, making the zigzag

const buildTrend = (m: boolean) => {
  const cfg = m ? MOB : DESK
  const bars = BARS.filter((b) => !(m && b.mobileHidden))
  const pts = bars.map((b, k) => {
    const top = cfg.base - (m ? b.mh : b.h)
    // The zigzag stops before the end: the last two points sit at plain
    // clearance, so the final leg is a clean steep climb that finishes just
    // above the tallest bar rather than shooting off toward the nav.
    const endRun = k >= bars.length - 2
    const lift = endRun
      ? TREND_CLEAR
      : TREND_CLEAR + (k % 2 === 1 ? TREND_AMP : 0)
    return { x: cfg.x0 + k * cfg.pitch + cfg.w / 2, top, y: top - lift }
  })

  // Nudge points up until no segment passes through a bar
  const half = cfg.w / 2
  for (let pass = 0; pass < 24; pass++) {
    let changed = false
    for (let k = 0; k < pts.length - 1; k++) {
      const a = pts[k]
      const b = pts[k + 1]
      for (let s = 0; s <= 24; s++) {
        const t = s / 24
        const x = a.x + (b.x - a.x) * t
        const y = a.y + (b.y - a.y) * t
        for (const p of pts) {
          if (Math.abs(x - p.x) > half) continue
          const limit = p.top - TREND_CLEAR
          if (y > limit) {
            const lift = y - limit
            if (a.y >= b.y) a.y -= lift
            else b.y -= lift
            changed = true
          }
        }
      }
    }
    if (!changed) break
  }
  return pts
}

const TREND_PTS_DESKTOP = buildTrend(false)
const TREND_PTS_MOBILE = buildTrend(true)

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
  const sx = isMobile ? cfg.msx : cfg.sx
  const sy = isMobile ? cfg.msy : cfg.sy
  const x = useTransform(progress, [cfg.from, cfg.to], ['0vw', `${target.tx - sx}vw`])
  const y = useTransform(progress, [cfg.from, cfg.to], ['0vh', `${target.ty - sy}vh`])
  const rotate = useTransform(progress, [cfg.from, cfg.to], [cfg.rot, 0])
  // Chip chrome (border + shadow) dissolves once this piece's bar is whole
  const chipOpacity = useTransform(progress, cfg.fade, [1, 0])

  if (isMobile && cfg.mobileHidden) return null

  return (
    <div
      ref={refFn}
      className="absolute transition-transform duration-300 ease-out"
      style={{
        left: reduced ? `${target.tx}vw` : `${sx}vw`,
        top: reduced ? `${target.ty}vh` : `${sy}vh`,
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
  const [stage, setStage] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // A refresh restores the old scroll position, which would drop you into the
  // middle of the assembly. Always start at the top, with the pieces scattered.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    if (!window.location.hash) window.scrollTo(0, 0)
  }, [])

  // The line is drawn in real pixels, not in a stretched viewBox: a squashed
  // coordinate system makes stroke-dasharray (which drives the draw-on) render
  // as dashes, which is what broke the line into segments.
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      // Fall back to the viewport if the box measures zero, so the line can
      // never silently vanish on an odd layout pass.
      const w = r.width || window.innerWidth
      const h = r.height || window.innerHeight
      if (w === 0 || h === 0) return
      setStage({ w, h })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
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

  // Trend geometry resolved into stage pixels
  const trendPts = isMobile ? TREND_PTS_MOBILE : TREND_PTS_DESKTOP
  const px = trendPts.map((p) => ({
    x: (p.x / 100) * stage.w,
    y: (p.y / 100) * stage.h,
  }))
  const trendD = px.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const tip = px[px.length - 1]
  const prev = px[px.length - 2]
  const arrowRot =
    tip && prev ? (Math.atan2(tip.y - prev.y, tip.x - prev.x) * 180) / Math.PI : 0
  const measured = stage.w > 0 && stage.h > 0

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

          {/* One continuous line, floating clear above the bars. Drawn in
              stage pixels so the draw-on dash maths stays undistorted. */}
          {measured && (
            <svg
              width={stage.w}
              height={stage.h}
              viewBox={`0 0 ${stage.w} ${stage.h}`}
              className="absolute inset-0 pointer-events-none"
              style={{ zIndex: 2 }}
            >
              <motion.path
                d={trendD}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth={9}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={
                  reduced ? {} : { opacity: trendOpacity, pathLength: trendDraw }
                }
              />
            </svg>
          )}

          {/* Solid stock-chart arrowhead, base tucked under the line end,
              angled along the real screen direction of the final climb */}
          {measured && (
            <motion.div
              className="absolute pointer-events-none"
              style={{
                left: tip.x,
                top: tip.y,
                zIndex: 3,
                ...(reduced ? {} : { opacity: arrowOpacity, scale: arrowScale }),
              }}
            >
              <svg
                width="52"
                height="52"
                viewBox="0 0 24 24"
                style={{
                  transform: `translate(-50%, -50%) rotate(${arrowRot}deg)`,
                }}
              >
                <polygon points="9,4.5 23,12 9,19.5" fill="var(--color-primary)" />
              </svg>
            </motion.div>
          )}
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
