import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { projects } from '../data/projects'

const EASE = [0.22, 1, 0.36, 1] as const

export function CaseStudy() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? projects.find((p) => p.id === slug) : null

  return (
    <div className="min-h-screen px-6 sm:px-10 md:px-14 py-16 sm:py-20">
      <div className="max-w-[820px] mx-auto w-full">
        <Link
          to="/"
          className="press inline-block font-display text-xs text-[var(--color-ink)] bg-[var(--color-bg)] px-4 py-2.5 border-[3px] border-[var(--color-ink)] mb-12"
          style={{ boxShadow: '6px 6px 0 var(--color-ink)' }}
        >
          ← Back
        </Link>

        {project ? (
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <p className="font-mono text-[11px] tracking-[0.12em] text-[var(--color-primary)] mb-4">
              {project.tag}
            </p>
            <h1 className="font-display text-[clamp(2rem,6vw,3rem)] text-[var(--color-ink)] leading-[1.02] mb-10">
              {project.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-12">
              {[
                { label: 'The problem', body: project.problem },
                { label: 'The build', body: project.build },
                { label: 'The result', body: project.result },
              ].map((col) => (
                <div
                  key={col.label}
                  className="bg-[var(--color-surface)] border-[3px] border-[var(--color-ink)] p-6"
                  style={{ boxShadow: '6px 6px 0 var(--color-secondary)' }}
                >
                  <p className="font-display text-xs text-[var(--color-ink)] mb-3">
                    {col.label}
                  </p>
                  <p className="font-mono text-[13px] text-[var(--color-text-secondary)] leading-[1.7]">
                    {col.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t-[3px] border-[var(--color-ink)] pt-8">
              <p className="font-mono text-[13px] text-[var(--color-text-muted)] leading-[1.7]">
                More detail — PRD excerpts, architecture diagrams, and metrics —
                lives here. Extend this page per project as the case study grows.
              </p>
            </div>
          </motion.article>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-[var(--color-text-secondary)]"
          >
            <p className="mb-4">Project not found.</p>
            <Link
              to="/"
              className="font-display text-xs text-[var(--color-ink)] underline"
            >
              Back home
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
