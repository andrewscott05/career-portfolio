import { Link, useParams } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Nav } from '../components/Nav'
import { projects, type Artifact, type CriteriaItem, type Embed } from '../data/projects'

const EASE = [0.22, 1, 0.36, 1] as const

/** A small illustrative recreation of a live Bob update, not an actual screenshot. */
function LiveTrackingDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const note = 'Called the driver, confirmed location: Denver, CO. ETA to next stop: 45 min.'
  const [typed, setTyped] = useState('')
  const [logged, setLogged] = useState(false)

  useEffect(() => {
    if (!inView) return
    let i = 0
    const interval = setInterval(() => {
      i += 1
      setTyped(note.slice(0, i))
      if (i >= note.length) {
        clearInterval(interval)
        setTimeout(() => setLogged(true), 350)
      }
    }, 22)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  return (
    <figure ref={ref} className="mt-8">
      <div
        className="border-[3px] border-[var(--color-ink)]"
        style={{ boxShadow: '8px 8px 0 var(--color-ink)' }}
      >
        <div className="bg-[#4A90D9] text-white font-display text-[13px] px-5 py-3">
          Tracking
        </div>
        <div className="p-5 bg-[var(--color-surface)]">
          <div className="flex justify-between items-baseline mb-1 gap-3">
            <p className="font-display text-[14px] text-[var(--color-ink)]">
              Location Update
            </p>
            {logged && (
              <motion.span
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="font-mono text-[10px] tracking-[0.08em] text-[var(--color-primary)] border border-[var(--color-primary)] px-2 py-0.5 whitespace-nowrap"
              >
                LOGGED
              </motion.span>
            )}
          </div>
          <p className="font-mono text-[11px] text-[var(--color-text-muted)] mb-4">
            Bob Broker
          </p>
          <p className="font-serif text-[14px] text-[var(--color-text-secondary)] leading-[1.6] min-h-[3.2em]">
            {typed}
            {!logged && (
              <span className="inline-block w-[2px] h-[1em] bg-[var(--color-ink)] ml-0.5 align-middle animate-pulse" />
            )}
          </p>
        </div>
      </div>
      <figcaption className="font-serif italic text-[13px] text-[var(--color-text-muted)] mt-4">
        A recreation of the update flow, not an actual screenshot, the real one is further down.
      </figcaption>
    </figure>
  )
}

function ArtifactFigure({ artifact }: { artifact: Artifact }) {
  const isSmall = artifact.size === 'small'
  return (
    <figure className={'mt-7' + (isSmall ? ' max-w-[280px] sm:max-w-[320px]' : '')}>
      <img
        src={artifact.src}
        alt={artifact.alt}
        className="w-full border-[3px] border-[var(--color-ink)]"
        style={{ boxShadow: '8px 8px 0 var(--color-ink)' }}
      />
      {artifact.caption && (
        <figcaption className="font-serif italic text-[13px] text-[var(--color-text-muted)] mt-4">
          {artifact.caption}
        </figcaption>
      )}
    </figure>
  )
}

function EmbedFigure({ embed }: { embed: Embed }) {
  return (
    <figure className="mt-10 sm:mt-12">
      <div
        className="border-[3px] border-[var(--color-ink)]"
        style={{ boxShadow: '8px 8px 0 var(--color-ink)' }}
      >
        <iframe
          src={embed.src}
          title={embed.title}
          className="w-full aspect-video block"
          allow="autoplay"
          allowFullScreen
        />
      </div>
      {embed.caption && (
        <figcaption className="font-serif italic text-[13px] text-[var(--color-text-muted)] mt-4">
          {embed.caption}
        </figcaption>
      )}
    </figure>
  )
}

function CriteriaFigure({
  criteria,
  accent = 'ink',
}: {
  criteria: CriteriaItem[]
  accent?: 'ink' | 'ochre'
}) {
  const shadow = accent === 'ochre' ? 'var(--color-secondary)' : 'var(--color-ink)'
  return (
    <div
      className="mt-7 bg-[var(--color-surface)] border-[3px] border-[var(--color-ink)]"
      style={{ boxShadow: `6px 6px 0 ${shadow}` }}
    >
      {criteria.map((item, i) => (
        <div
          key={item.label}
          className={
            'px-6 sm:px-7 py-5' +
            (i > 0 ? ' border-t border-[var(--color-hairline)]' : '')
          }
        >
          <p className="font-display text-[13px] text-[var(--color-primary)] mb-1.5">
            {item.label}
          </p>
          <p className="font-serif text-[15px] sm:text-base text-[var(--color-text-secondary)] leading-[1.6]">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  )
}

export function CaseStudy() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? projects.find((p) => p.id === slug) : null

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!project) {
    return (
      <>
        <Nav />
        <div className="px-6 sm:px-10 md:px-14 py-20">
          <div className="max-w-[820px] mx-auto w-full font-serif">
            <p className="mb-6 text-[var(--color-text-secondary)]">
              Project not found.
            </p>
            <Link
              to="/"
              className="press inline-block font-display text-xs text-[var(--color-ink)] bg-[var(--color-bg)] px-4 py-2.5 border-[3px] border-[var(--color-ink)]"
              style={{ boxShadow: '6px 6px 0 var(--color-ink)' }}
            >
              ← Back home
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Nav />
      <article className="px-6 sm:px-10 md:px-14 py-14 sm:py-20">
        <div className="max-w-[820px] mx-auto w-full">
          <motion.header
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <p className="font-mono text-[11px] tracking-[0.12em] text-[var(--color-primary)] mb-4">
              {project.tag}
            </p>
            <h1 className="font-display text-[clamp(2rem,6vw,3rem)] text-[var(--color-ink)] leading-[1.02] mb-6">
              {project.title}
            </h1>
            <p className="font-serif text-[17px] sm:text-lg text-[var(--color-text-secondary)] leading-[1.7] mb-8 pb-8 border-b-[3px] border-[var(--color-ink)]">
              {project.summary}
            </p>
          </motion.header>

          {project.embed && <EmbedFigure embed={project.embed} />}
          {project.id === 'bob-ai-voice' && <LiveTrackingDemo />}

          {project.sections.map((section, i) => (
            <motion.section
              key={section.heading}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.04 }}
              className="mt-12 sm:mt-14"
            >
              <h2 className="font-display text-[clamp(1.25rem,3.5vw,1.75rem)] text-[var(--color-ink)] mb-4">
                {section.heading}
              </h2>
              <p className="font-serif text-[16px] sm:text-[17px] text-[var(--color-text-secondary)] leading-[1.7]">
                {section.body}
              </p>
              {section.artifact && <ArtifactFigure artifact={section.artifact} />}
              {section.criteria && (
                <CriteriaFigure criteria={section.criteria} accent={section.criteriaAccent} />
              )}
            </motion.section>
          ))}

          <div className="mt-16 pt-8 border-t-[3px] border-[var(--color-ink)]">
            <Link
              to="/#work"
              className="press inline-block font-display text-xs text-[var(--color-ink)] bg-[var(--color-bg)] px-4 py-2.5 border-[3px] border-[var(--color-ink)]"
              style={{ boxShadow: '6px 6px 0 var(--color-ink)' }}
            >
              ← All work
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
