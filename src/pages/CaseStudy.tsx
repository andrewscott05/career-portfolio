import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { projects } from '../data/projects'

const EASE = [0.22, 1, 0.36, 1] as const

export function CaseStudy() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? projects.find((p) => p.id === slug) : null

  return (
    <div className="min-h-screen px-6 sm:px-8 md:px-12 lg:px-16 py-24">
      <div className="max-w-[1200px] mx-auto w-full max-w-2xl">
        <Link
          to="/"
          className="link-underline font-mono text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors mb-14 inline-block"
        >
          ← Back
        </Link>
        {project ? (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <h1 className="font-bold text-3xl text-[var(--color-text)] mb-2">
              {project.title}
            </h1>
            {project.subtitle && (
              <p className="font-mono text-sm text-[var(--color-primary)] mb-6">
                {project.subtitle}
              </p>
            )}
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
              {project.description}
            </p>
            {project.metrics && (
              <p className="font-mono text-sm text-[var(--color-tan)]">
                {project.metrics}
              </p>
            )}
            <p className="mt-12 text-sm text-[var(--color-text-muted)]">
              Case study content (Miro screenshots, PRD excerpts, architecture diagrams, metrics) can be added here by editing this component or adding a dedicated page per project.
            </p>
          </motion.article>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[var(--color-text-secondary)]"
          >
            <p>Project not found.</p>
            <Link to="/" className="link-underline font-mono text-sm mt-4 inline-block hover:text-[var(--color-text)]">
              Back home
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
