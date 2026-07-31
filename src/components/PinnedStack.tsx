import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

/* A pinned section: the panel sticks to the viewport while the layers below
   advance with scroll, then releases into "Built & shipped". Fully reversible,
   since everything is derived from scroll position rather than triggered once.

   Behind the text, a field of scattered particles converges into an ordered
   lattice as the sequence advances: operational chaos into systems that scale,
   drawn rather than said. */

const LAYERS = [
  { tag: 'AI AUTOMATION', line: 'An agent that works the queue' },
  { tag: 'ML PRICING', line: 'A pricing engine that quotes itself' },
  { tag: 'AI GOVERNANCE', line: 'A bar an agent has to clear first' },
  { tag: 'TEAM ENABLEMENT', line: 'One way the whole team works with AI' },
  { tag: 'DESIGN SYSTEMS', line: 'One library instead of a dozen rebuilds' },
  { tag: 'WAYS OF WORKING', line: 'A process that survives the quarter' },
]

const LAYERS_END = 0.82 // progress reserved for cycling layers; rest resolves
const SPAN = LAYERS_END / LAYERS.length
const OVERLAP = SPAN * 0.3 // layers crossfade through each other, never blank out

/* ------------------------------------------------------------------ */
/* Particle field: chaos -> lattice, driven directly by scroll         */
/* ------------------------------------------------------------------ */

type Particle = {
  sx: number
  sy: number
  tx: number
  ty: number
  size: number
  color: string
  alpha: number
  phase: number
  drift: number
}

function ParticleField({ progress }: { progress: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let particles: Particle[] = []
    let raf = 0

    // Deterministic PRNG so scatter positions are stable across rebuilds
    const makeRand = (seed: number) => () => {
      seed = (seed * 16807) % 2147483647
      return (seed - 1) / 2147483646
    }

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const rand = makeRand(1296)
      particles = []
      const margin = 26
      const cols = Math.max(10, Math.floor((rect.width - margin * 2) / 42))
      const rows = Math.max(5, Math.floor((rect.height - margin * 2) / 46))
      const gw = (rect.width - margin * 2) / (cols - 1)
      const gh = (rect.height - margin * 2) / (rows - 1)

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const accent = rand()
          particles.push({
            // chaos: scattered anywhere, with overscan so edges feel infinite
            sx: rand() * rect.width * 1.3 - rect.width * 0.15,
            sy: rand() * rect.height * 1.3 - rect.height * 0.15,
            // system: an even lattice
            tx: margin + c * gw,
            ty: margin + r * gh,
            size: 2 + rand() * 1.6,
            color:
              accent > 0.94 ? '#B07D3F' : accent > 0.88 ? '#5F8B6D' : '#F5F2EA',
            alpha: accent > 0.88 ? 0.75 : 0.28 + rand() * 0.2,
            phase: rand() * Math.PI * 2,
            drift: 0.4 + rand() * 0.8,
          })
        }
      }
    }

    const easeInOut = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

    const draw = (now: number) => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      // Convergence rides the same scroll progress as the text layers
      const raw = progress.get()
      const p = reduced ? 1 : easeInOut(Math.min(Math.max(raw / LAYERS_END, 0), 1))
      const wobble = (1 - p) * 7 // ambient float, stilled as order arrives

      for (const pt of particles) {
        const x =
          pt.sx + (pt.tx - pt.sx) * p + Math.sin(now * 0.0008 * pt.drift + pt.phase) * wobble
        const y =
          pt.sy + (pt.ty - pt.sy) * p + Math.cos(now * 0.0011 * pt.drift + pt.phase) * wobble
        ctx.globalAlpha = pt.alpha
        ctx.fillStyle = pt.color
        ctx.fillRect(x - pt.size / 2, y - pt.size / 2, pt.size, pt.size)
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    build()
    raf = requestAnimationFrame(draw)
    const ro = new ResizeObserver(build)
    ro.observe(canvas)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [progress])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}

/* ------------------------------------------------------------------ */

function Layer({
  layer,
  index,
  progress,
}: {
  layer: (typeof LAYERS)[number]
  index: number
  progress: MotionValue<number>
}) {
  const half = OVERLAP / 2
  const isFirst = index === 0
  // The first layer is already at full opacity when the panel pins, so the
  // stage is never empty; the rest crossfade through their shared boundary.
  const inStart = isFirst ? 0 : index * SPAN - half
  const inEnd = isFirst ? 0 : index * SPAN + half
  const outStart = (index + 1) * SPAN - half
  const outEnd = (index + 1) * SPAN + half

  const opacity = useTransform(progress, [inStart, inEnd, outStart, outEnd], [isFirst ? 1 : 0, 1, 1, 0])
  const y = useTransform(progress, [inStart, inEnd, outStart, outEnd], [isFirst ? 0 : 22, 0, 0, -22])

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0 flex flex-col justify-center">
      <p className="font-mono text-[11px] sm:text-xs tracking-[0.12em] text-[var(--color-secondary)] mb-4">
        {layer.tag}
      </p>
      <p className="font-display text-[clamp(1.75rem,5.5vw,3.25rem)] text-[var(--color-bg)] leading-[1.04]">
        {layer.line}
      </p>
    </motion.div>
  )
}

function Segment({
  index,
  progress,
}: {
  index: number
  progress: MotionValue<number>
}) {
  const start = index * SPAN
  const scaleX = useTransform(progress, [start, start + SPAN], [0, 1], { clamp: true })
  return (
    <div className="h-[3px] flex-1 bg-[#3A362F]">
      <motion.div
        className="h-full bg-[var(--color-secondary)] origin-left"
        style={{ scaleX }}
      />
    </div>
  )
}

export function PinnedStack() {
  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  const [counter, setCounter] = useState(1)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setCounter(Math.min(LAYERS.length, Math.max(1, Math.floor(v / SPAN) + 1)))
  })

  // Centred on the same boundary the last layer fades out across, so the two
  // crossfade through each other rather than leaving an empty stage.
  const half = OVERLAP / 2
  const resolveOpacity = useTransform(
    scrollYProgress,
    [LAYERS_END - half, LAYERS_END + half],
    [0, 1],
  )
  const resolveY = useTransform(scrollYProgress, [LAYERS_END - half, LAYERS_END + half], [22, 0])

  return (
    <section ref={trackRef} className="relative h-[420vh]">
      <div className="sticky top-0 h-screen flex items-center px-6 sm:px-10 md:px-14">
        <div className="max-w-[1100px] mx-auto w-full">
          <div
            className="relative overflow-hidden bg-[var(--color-ink)] min-h-[430px] sm:min-h-[500px] flex flex-col justify-center px-7 py-10 sm:px-12 sm:py-14"
            style={{ boxShadow: '10px 10px 0 var(--color-primary)' }}
          >
            <ParticleField progress={scrollYProgress} />

            <div className="relative z-10">
              <div className="flex items-baseline justify-between mb-8 sm:mb-10">
                <p className="font-mono text-[11px] tracking-[0.12em] text-[var(--color-text-muted)]">
                  WHAT I BUILD
                </p>
                <p className="font-mono text-[11px] tracking-[0.12em] text-[var(--color-text-muted)] tabular-nums">
                  0{counter} / 0{LAYERS.length}
                </p>
              </div>

              {/* Layers cycle in this fixed-height stage so the panel never jumps */}
              <div className="relative h-[124px] sm:h-[170px]">
                {LAYERS.map((layer, i) => (
                  <Layer key={layer.tag} layer={layer} index={i} progress={scrollYProgress} />
                ))}

                <motion.div
                  style={{ opacity: resolveOpacity, y: resolveY }}
                  className="absolute inset-0 flex flex-col justify-center"
                >
                  <p className="font-mono text-[11px] sm:text-xs tracking-[0.12em] text-[var(--color-secondary)] mb-4">
                    SIX SYSTEMS, ONE PATTERN
                  </p>
                  <p className="font-display text-[clamp(1.75rem,5.5vw,3.25rem)] text-[var(--color-bg)] leading-[1.04]">
                    Find the break, build the fix, measure it.
                  </p>
                </motion.div>
              </div>

              <div className="flex gap-1.5 mt-10 sm:mt-12">
                {LAYERS.map((layer, i) => (
                  <Segment key={layer.tag} index={i} progress={scrollYProgress} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
