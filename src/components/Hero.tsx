import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { useRef, type PointerEvent } from 'react'

const LINK = {
  linkedin: 'https://linkedin.com/in/andrew-john-scott',
  resume: '/resume.pdf',
}

const EASE = [0.22, 1, 0.36, 1] as const

/* The signature moment: the page opens with hard-edged slabs tumbled across
   the viewport. As you scroll, the hero pins and the slabs travel, straighten,
   and stack one after another into a clean tower: operational chaos becoming
   a system, in the site's own shape language. Scroll-driven and reversible.
   The slabs also shy away from the cursor, because a site can be a toy. */

type BlockCfg = {
  sx: number // scatter x (vw)
  sy: number // scatter y (vh)
  rot: number // scatter rotation (deg)
  tx: number // target x (vw)
  ty: number // target y (vh)
  w: number // width (vw)
  h: number // height (vh)
  fill: 'surface' | 'ink' | 'green' | 'ochre'
  from: number // progress where this block starts converging
  to: number // progress where it locks in
  desktopOnly?: boolean
  cap?: boolean
}

/* The slabs assemble into an ascending bar chart on a shared baseline:
   systems that scale, drawn in the site's own shape language. Bars land
   left to right, shortest first, and the green block arrives last as the
   data point crowning the tallest bar. */

const BLOCKS: BlockCfg[] = [
  { sx: 8,  sy: 12, rot: -18, tx: 54,    ty: 68,   w: 5.5, h: 10, fill: 'surface', from: 0.08, to: 0.5,  desktopOnly: true },
  { sx: 38, sy: 6,  rot: 12,  tx: 60.8,  ty: 62,   w: 5.5, h: 16, fill: 'ink',     from: 0.12, to: 0.55, desktopOnly: true },
  { sx: 72, sy: 8,  rot: -9,  tx: 67.6,  ty: 54,   w: 5.5, h: 24, fill: 'surface', from: 0.16, to: 0.6 },
  { sx: 85, sy: 32, rot: 18,  tx: 74.4,  ty: 45,   w: 5.5, h: 33, fill: 'ochre',   from: 0.2,  to: 0.65 },
  { sx: 12, sy: 70, rot: 14,  tx: 81.2,  ty: 35,   w: 5.5, h: 43, fill: 'surface', from: 0.24, to: 0.7 },
  { sx: 46, sy: 76, rot: -13, tx: 88,    ty: 24,   w: 5.5, h: 54, fill: 'surface', from: 0.28, to: 0.75 },
  { sx: 26, sy: 38, rot: -24, tx: 88.25, ty: 16.8, w: 5,   h: 6,  fill: 'green',   from: 0.34, to: 0.8, cap: true },
]

const FILLS: Record<BlockCfg['fill'], { bg: string; shadow: string }> = {
  surface: { bg: 'var(--color-surface)', shadow: '6px 6px 0 var(--color-ink)' },
  ink: { bg: 'var(--color-ink)', shadow: '6px 6px 0 var(--color-secondary)' },
  green: { bg: 'var(--color-primary)', shadow: '6px 6px 0 var(--color-ink)' },
  ochre: { bg: 'var(--color-secondary)', shadow: '6px 6px 0 var(--color-ink)' },
}

function Block({
  cfg,
  progress,
  reduced,
  refFn,
  cap = false,
}: {
  cfg: BlockCfg
  progress: MotionValue<number>
  reduced: boolean
  refFn: (el: HTMLDivElement | null) => void
  cap?: boolean
}) {
  const x = useTransform(progress, [cfg.from, cfg.to], ['0vw', `${cfg.tx - cfg.sx}vw`])
  const y = useTransform(progress, [cfg.from, cfg.to], ['0vh', `${cfg.ty - cfg.sy}vh`])
  const rotate = useTransform(progress, [cfg.from, cfg.to], [cfg.rot, 0])
  // The completion click: once the chart locks, the cap pops its asterisk
  const capOpacity = useTransform(progress, [0.8, 0.86], [0, 1])
  const capScale = useTransform(progress, [0.8, 0.86], [0.3, 1])
  const fill = FILLS[cfg.fill]

  return (
    <div
      ref={refFn}
      className={
        'absolute transition-transform duration-300 ease-out' +
        (cfg.desktopOnly ? ' hidden md:block' : '')
      }
      style={{
        left: reduced ? `${cfg.tx}vw` : `${cfg.sx}vw`,
        top: reduced ? `${cfg.ty}vh` : `${cfg.sy}vh`,
        width: `${cfg.w}vw`,
        height: `${cfg.h}vh`,
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
        {cap && (
          <motion.span
            style={reduced ? {} : { opacity: capOpacity, scale: capScale }}
            className="absolute inset-0 flex items-center justify-center font-display text-[clamp(1.25rem,3.2vh,2rem)] text-[var(--color-bg)] leading-none"
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

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])
  // After the chart locks, it settles downward and hands off into the page
  const settleY = useTransform(scrollYProgress, [0.88, 1], ['0vh', '9vh'])
  // A rubber-stamp across the finished chart: the payoff for the assembly
  const stampOpacity = useTransform(scrollYProgress, [0.82, 0.875], [0, 1])
  const stampScale = useTransform(scrollYProgress, [0.82, 0.875], [1.6, 1])

  // The toy: slabs shy away from the cursor. Direct DOM writes, no re-renders.
  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced) return
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

  return (
    <header
      id="top"
      ref={trackRef}
      className={reduced ? 'relative' : 'relative h-[230vh]'}
    >
      <div
        className={
          'top-0 overflow-hidden ' +
          (reduced ? 'relative min-h-[70vh]' : 'sticky h-screen')
        }
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {/* The slabs: chaos on arrival, a tower by the time you leave */}
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
              cap={cfg.cap}
              refFn={(el) => (blockRefs.current[i] = el)}
            />
          ))}

          <motion.div
            style={
              reduced
                ? { rotate: -8 }
                : { opacity: stampOpacity, scale: stampScale, rotate: -8 }
            }
            className="absolute left-[59vw] top-[29vh] border-[3px] border-[var(--color-secondary)] px-3 py-1.5 bg-[var(--color-bg)]"
          >
            <span className="font-mono font-medium text-[12px] sm:text-[13px] tracking-[0.14em] text-[var(--color-secondary)]">
              OPERATIONAL
            </span>
          </motion.div>
        </motion.div>

        <div className="relative z-10 h-full flex items-center px-6 sm:px-10 md:px-14 pointer-events-none">
          <div className="max-w-[1100px] mx-auto w-full">
            <h1 className="font-display text-[clamp(2.75rem,9vw,5.25rem)] text-[var(--color-ink)] leading-[0.98] tracking-[-0.01em] mb-9 sm:mb-10 max-w-[13ch]">
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
