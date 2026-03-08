import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { projects } from '../data/projects'

export function CaseStudy() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? projects.find((p) => p.id === slug) : null

  return (
    <div className="min-h-screen px-6 sm:px-8 md:px-12 lg:px-16 py-24">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/"
          className="link-underline font-mono text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors mb-14 inline-block"
        >
          ← Back
        </Link>
        {project ? (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-mono text-3xl font-semibold text-[var(--color-foreground)] mb-2">
              {project.title}
            </h1>
            {project.subtitle && (
              <p className="font-mono text-sm text-[var(--color-muted)] mb-6">
                {project.subtitle}
              </p>
            )}
            <p className="text-[var(--color-foreground-dim)] leading-relaxed mb-6">
              {project.description}
            </p>
            {project.metrics && (
              <p className="font-mono text-sm text-[var(--color-muted)]">
                {project.metrics}
              </p>
            )}
            <p className="mt-12 text-sm text-[var(--color-muted)]">
              Case study content (Miro screenshots, PRD excerpts, architecture diagrams, metrics) can be added here by editing this component or adding a dedicated page per project.
            </p>
          </motion.article>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[var(--color-muted)]"
          >
            <p>Project not found.</p>
            <Link to="/" className="link-underline font-mono text-sm mt-4 inline-block hover:text-[var(--color-foreground)]">
              Back home
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
