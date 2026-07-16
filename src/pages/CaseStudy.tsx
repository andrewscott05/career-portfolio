import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { Nav } from '../components/Nav'
import { projects, type Artifact } from '../data/projects'

const EASE = [0.22, 1, 0.36, 1] as const

function ArtifactFigure({ artifact }: { artifact: Artifact }) {
  return (
    <figure className="mt-7">
      <img
        src={artifact.src}
        alt={artifact.alt}
        className="w-full border-[3px] border-[var(--color-ink)]"
        style={{ boxShadow: '8px 8px 0 var(--color-ink)' }}
      />
      {artifact.caption && (
        <figcaption className="font-mono text-[11px] text-[var(--color-text-muted)] mt-4">
          {artifact.caption}
        </figcaption>
      )}
    </figure>
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
          <div className="max-w-[820px] mx-auto w-full font-mono">
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
            <p className="font-mono text-[15px] sm:text-base text-[var(--color-text-secondary)] leading-[1.8] mb-8">
              {project.summary}
            </p>

            {/* Roles / team metadata — scope at a glance. */}
            <dl className="border-t-[3px] border-b-[3px] border-[var(--color-ink)] py-5 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:gap-3">
                <dt className="font-display text-xs text-[var(--color-ink)] sm:w-20 shrink-0">
                  Roles
                </dt>
                <dd className="font-mono text-[13px] text-[var(--color-text-secondary)] leading-[1.7]">
                  {project.roles.join(' · ')}
                </dd>
              </div>
              {project.team && (
                <div className="flex flex-col sm:flex-row sm:gap-3">
                  <dt className="font-display text-xs text-[var(--color-ink)] sm:w-20 shrink-0">
                    Team
                  </dt>
                  <dd className="font-mono text-[13px] text-[var(--color-text-secondary)] leading-[1.7]">
                    {project.team}
                  </dd>
                </div>
              )}
            </dl>
          </motion.header>

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
              <p className="font-mono text-[14px] sm:text-[15px] text-[var(--color-text-secondary)] leading-[1.8]">
                {section.body}
              </p>
              {section.artifact && <ArtifactFigure artifact={section.artifact} />}
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
