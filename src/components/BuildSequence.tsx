import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const EASE = [0.22, 1, 0.36, 1] as const

const LINES = [
  'Find where the process breaks',
  'Design the fix',
  'Ship it, then measure',
]

export function BuildSequence() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [lineIndex, setLineIndex] = useState(0)
  const [typed, setTyped] = useState('')
  const [doneLines, setDoneLines] = useState<boolean[]>(LINES.map(() => false))
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (!inView) return
    let cancelled = false
    let charTimer: ReturnType<typeof setInterval> | undefined
    let stepTimer: ReturnType<typeof setTimeout> | undefined

    function typeLine(li: number) {
      if (cancelled) return
      if (li >= LINES.length) {
        stepTimer = setTimeout(() => {
          if (!cancelled) setFinished(true)
        }, 250)
        return
      }
      let idx = 0
      setTyped('')
      charTimer = setInterval(() => {
        idx += 1
        setTyped(LINES[li].slice(0, idx))
        if (idx >= LINES[li].length) {
          clearInterval(charTimer)
          stepTimer = setTimeout(() => {
            if (cancelled) return
            setDoneLines((d) => {
              const next = [...d]
              next[li] = true
              return next
            })
            setLineIndex(li + 1)
            stepTimer = setTimeout(() => typeLine(li + 1), 200)
          }, 200)
        }
      }, 22)
    }

    typeLine(0)
    return () => {
      cancelled = true
      clearInterval(charTimer)
      clearTimeout(stepTimer)
    }
  }, [inView])

  return (
    <section className="px-6 sm:px-10 md:px-14 pb-16 sm:pb-20">
      <div className="max-w-[1100px] mx-auto w-full">
        <div
          ref={ref}
          className="bg-[var(--color-ink)] px-7 py-9 sm:px-10 sm:py-11"
          style={{ boxShadow: '8px 8px 0 var(--color-primary)' }}
        >
          <p className="font-mono text-[11px] tracking-[0.12em] text-[var(--color-text-muted)] mb-6">
            HOW IT GOES
          </p>
          <div className="space-y-3">
            {LINES.map((line, i) => (
              <div key={line} className="flex items-center gap-3 font-mono text-[14px] sm:text-[15px]">
                <span
                  className={
                    doneLines[i] ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'
                  }
                >
                  {doneLines[i] ? '✓' : '›'}
                </span>
                <span className="text-[var(--color-bg)]">
                  {doneLines[i] ? line : i === lineIndex ? typed : ''}
                  {i === lineIndex && !finished && (
                    <span className="inline-block w-[2px] h-[1em] bg-[var(--color-bg)] ml-0.5 align-middle animate-pulse" />
                  )}
                </span>
              </div>
            ))}
          </div>

          {finished && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex items-center gap-3 mt-7 pt-6 border-t border-[#3A362F]"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
                <motion.path
                  d="M4 12.5l4.5 4.5L20 6"
                  stroke="var(--color-primary)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
              </svg>
              <p className="font-display text-[var(--color-bg)] text-lg sm:text-xl">
                Shipped.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
