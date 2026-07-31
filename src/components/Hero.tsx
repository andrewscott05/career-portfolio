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
}

const TOWER_X = 64

const BLOCKS: BlockCfg[] = [
  // Converge windows are staggered so the tower assembles top-down, one landing after another.
  { sx: 26, sy: 36, rot: -24, tx: TOWER_X, ty: 9,  w: 5,  h: 6, fill: 'green',   from: 0.06, to: 0.5 },
  { sx: 6,  sy: 10, rot: -16, tx: TOWER_X, ty: 17, w: 20, h: 8, fill: 'surface', from: 0.1,  to: 0.54 },
  { sx: 40, sy: 5,  rot: 12,  tx: TOWER_X, ty: 26.6, w: 13, h: 8, fill: 'ink',   from: 0.14, to: 0.58 },
  { sx: 74, sy: 9,  rot: -9,  tx: TOWER_X, ty: 36.2, w: 22, h: 8, fill: 'surface', from: 0.18, to: 0.62 },
  { sx: 85, sy: 34, rot: 18,  tx: TOWER_X, ty: 45.8, w: 9,  h: 8, fill: 'ochre', from: 0.22, to: 0.66 },
  { sx: 10, sy: 68, rot: 14,  tx: TOWER_X, ty: 55.4, w: 17, h: 8, fill: 'surface', from: 0.26, to: 0.7, desktopOnly: true },
  { sx: 46, sy: 76, rot: -13, tx: TOWER_X, ty: 65,  w: 11, h: 8, fill: 'ink',    from: 0.3,  to: 0.74, desktopOnly: true },
  { sx: 74, sy: 64, rot: 8,   tx: TOWER_X, ty: 74.6, w: 20, h: 8, fill: 'surface', from: 0.34, to: 0.78, desktopOnly: true },
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
}: {
  cfg: BlockCfg
  progress: MotionValue<number>
  reduced: boolean
  refFn: (el: HTMLDivElement | null) => void
}) {
  const x = useTransform(progress, [cfg.from, cfg.to], ['0vw', `${cfg.tx - cfg.sx}vw`])
  const y = useTransform(progress, [cfg.from, cfg.to], ['0vh', `${cfg.ty - cfg.sy}vh`])
  const rotate = useTransform(progress, [cfg.from, cfg.to], [cfg.rot, 0])
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
        className="w-full h-full border-[3px] border-[var(--color-ink)]"
        style={
          reduced
            ? { background: fill.bg, boxShadow: fill.shadow }
            : { x, y, rotate, background: fill.bg, boxShadow: fill.shadow }
        }
      />
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
        <div className="absolute inset-0" aria-hidden>
          {BLOCKS.map((cfg, i) => (
            <Block
              key={i}
              cfg={cfg}
              progress={scrollYProgress}
              reduced={reduced}
              refFn={(el) => (blockRefs.current[i] = el)}
            />
          ))}
        </div>

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
