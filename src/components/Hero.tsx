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
  scatterScale: number // size while scattered, resolving to 1 on landing
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
const COPY_DESKTOP: Rect = { x: 0, y: 20, w: 54, h: 60 }
const COPY_MOBILE: Rect = { x: 0, y: 5, w: 100, h: 54 }

/* The sticky nav is an opaque bar roughly 7vh tall; pieces that scatter
   underneath it look sliced off. The field starts below it and stops short
   of the SCROLL hint at the bottom edge. */
const SCATTER_TOP = 11
const SCATTER_BOTTOM = 92

/** Separation between two boxes; negative means they overlap. */
function gap(a: Rect, b: Rect) {
  const dx = Math.max(b.x - (a.x + a.w), a.x - (b.x + b.w))
  const dy = Math.max(b.y - (a.y + a.h), a.y - (b.y + b.h))
  return Math.max(dx, dy)
}

/* The copy zone is a rectangle but the headline is ragged, so a piece sitting
   a hair off the box edge still crowds the longest line. Clearing the copy
   vertically only needs a small margin; sitting beside it needs real air. */
const COPY_SIDE_CLEAR = 5
const COPY_STACK_CLEAR = 1.5

function clearsCopy(box: Rect, copy: Rect) {
  const dx = Math.max(copy.x - (box.x + box.w), box.x - (copy.x + copy.w))
  const dy = Math.max(copy.y - (box.y + box.h), box.y - (copy.y + copy.h))
  if (dy >= COPY_STACK_CLEAR) return true
  return dx >= COPY_SIDE_CLEAR
}

/* Each breakpoint gets its own scatter. Sharing one set meant reserving the
   wide mobile footprint on desktop too, which shoved everything into a corner.

   Placement deliberately mixes two behaviours. Most pieces take the best of
   many candidates, which spreads them out; a minority take the first legal
   spot they find, which lets them fall near a neighbour. Even spacing alone
   reads as a pattern, and the point is spill, not confetti. */
const placedDesktop: Rect[] = []
const placedMobile: Rect[] = []

function scatterIn(
  w: number,
  h: number,
  copy: Rect,
  placed: Rect[],
  clumpy: boolean,
  zone: 'left' | 'any' = 'any',
) {
  // The copy blocks most of the left half, so an unbiased sampler drifts
  // right. A share of pieces are made to take a legal left spot (the band
  // above the copy or the strip below it), keeping the frame balanced.
  let best: { x: number; y: number } | null = null
  let bestScore = -Infinity
  const tries = clumpy ? 40 : 400
  // A clumping piece only needs to avoid burying another, not stand apart
  const enough = clumpy ? -Math.min(w, h) * 0.35 : 4

  // Legal bands beside the copy; uniform sampling would practically never
  // land in them, since the strip below the copy can be a fraction of a vh
  const topBandMax = copy.y - COPY_STACK_CLEAR - h
  const botBandMin = copy.y + copy.h + COPY_STACK_CLEAR
  const canTop = topBandMax >= SCATTER_TOP
  const canBot = SCATTER_BOTTOM - h >= botBandMin

  for (let k = 0; k < tries; k++) {
    const xMax = zone === 'left' ? 48 - w : 97 - w
    const x = 1.5 + makeRand() * Math.max(1, xMax)
    let y: number
    if (zone === 'left' && (canTop || canBot)) {
      const useTop = canTop && (!canBot || makeRand() < 0.45)
      y = useTop
        ? SCATTER_TOP + makeRand() * Math.max(0.1, topBandMax - SCATTER_TOP)
        : botBandMin + makeRand() * Math.max(0.1, SCATTER_BOTTOM - h - botBandMin)
    } else {
      y = SCATTER_TOP + makeRand() * Math.max(1, SCATTER_BOTTOM - SCATTER_TOP - h)
    }
    const box = { x, y, w, h }
    if (!clearsCopy(box, copy)) continue

    let nearest = Infinity
    for (const p of placed) nearest = Math.min(nearest, gap(box, p))
    if (nearest > bestScore) {
      bestScore = nearest
      best = { x, y }
      if (nearest > enough) break
    }
  }

  // Nothing legal turned up: park it clear of the copy rather than at a fixed
  // point, which stacked pieces on each other and pushed them off the frame
  if (!best) {
    best = {
      x: Math.min(copy.x + copy.w + COPY_SIDE_CLEAR, 97 - w),
      y: SCATTER_TOP + ((placed.length * 13) % Math.max(1, SCATTER_BOTTOM - SCATTER_TOP - h)),
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
  // Assembly is packed into the first ~48% of the track, leaving room for
  // the line to climb slowly and for the finished chart to hold afterwards
  const barStart = 0.04 + i * 0.014
  const barEnd = 0.25 + i * 0.017
  const lastTo = barEnd + (segs === 1 ? 0 : 0.033)
  const fade: [number, number] = [lastTo, Math.min(lastTo + 0.025, 0.5)]

  for (let s = 0; s < segs; s++) {
    // s = 0 is the bottom piece of the bar and lands first; pieces above it
    // run slightly tall so they overlap downward into the piece below
    const t = segs === 1 ? 0 : s / (segs - 1)
    const overlap = s > 0 ? PIECE_OVERLAP_VH : 0
    // Roughly a third of the pieces are allowed to settle near a neighbour,
    // so the field has clusters and clearings rather than even spacing
    const clumpy = makeRand() < 0.34
    const dPt = scatterIn(
      DESK.w,
      dSeg + overlap,
      COPY_DESKTOP,
      placedDesktop,
      clumpy,
      // Only short pieces can legally fit beside the copy (the band above it
      // or the strip below); tall ones would have nowhere to go on the left
      placedDesktop.length % 4 === 0 && dSeg + overlap <= 10.4 ? 'left' : 'any',
    )
    const mPt = bar.mobileHidden
      ? dPt
      : scatterIn(MOB.w, mSeg + overlap, COPY_MOBILE, placedMobile, clumpy)
    BLOCKS.push({
      sx: dPt.x,
      sy: dPt.y,
      msx: mPt.x,
      msy: mPt.y,
      // Wide rotation range: a narrow one left everything leaning the same way
      rot: (makeRand() < 0.5 ? 1 : -1) * (5 + makeRand() * 36),
      // Scattered pieces read at slightly different sizes, then resolve to
      // exact bar dimensions as they land
      scatterScale: 0.82 + makeRand() * 0.5,
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
      from: barStart + t * 0.032,
      to: barEnd + t * 0.04,
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
  const scale = useTransform(progress, [cfg.from, cfg.to], [cfg.scatterScale, 1])
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
            : { x, y, rotate, scale, background: FILLS[cfg.fill] }
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
  const settleY = useTransform(scrollYProgress, [0.93, 1], ['0vh', '4vh'])
  // Bars are solid by ~0.5 of the track; the line then gets a long, slow
  // climb across the bars before the arrowhead lands and the chart holds.
  const trendDraw = useTransform(scrollYProgress, [0.53, 0.84], [0, 1])
  const trendOpacity = useTransform(scrollYProgress, [0.48, 0.53], [0, 1])
  const arrowOpacity = useTransform(scrollYProgress, [0.84, 0.89], [0, 1])
  const arrowScale = useTransform(scrollYProgress, [0.84, 0.89], [0.4, 1])

  // The toy: pieces shy away from the cursor while they are still chaos, and
  // stop responding as the bars assemble, so a finished bar never tears apart.
  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced || isMobile || e.pointerType !== 'mouse') return
    const damp = Math.max(0, 1 - scrollYProgress.get() / 0.32)
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
