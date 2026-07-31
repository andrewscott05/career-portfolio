import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef } from 'react'

/* A pinned section: the panel sticks to the viewport while the layers below
   advance with scroll, then releases into "Built & shipped". Fully reversible,
   since everything is derived from scroll position rather than triggered once. */

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
            className="relative bg-[var(--color-ink)] px-7 py-10 sm:px-12 sm:py-14"
            style={{ boxShadow: '10px 10px 0 var(--color-primary)' }}
          >
            <p className="font-mono text-[11px] tracking-[0.12em] text-[var(--color-text-muted)] mb-8 sm:mb-10">
              WHAT I BUILD
            </p>

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
    </section>
  )
}
