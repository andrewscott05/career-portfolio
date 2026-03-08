import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { AnimatedSection } from './AnimatedSection'
import { projects, type Project } from '../data/projects'

const CARD_TRANSITION = { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }

function ProjectCard({
  project,
  index,
  isPlaceholder,
  isFeatured,
}: {
  project: Project
  index: number
  isPlaceholder?: boolean
  isFeatured?: boolean
}) {
  const content = (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ ...CARD_TRANSITION, delay: index * 0.08 }}
      whileHover={isPlaceholder ? undefined : { scale: 1.02 }}
      className={`
        block text-left p-6 sm:p-8
        border bg-[var(--color-surface-elevated)] backdrop-blur-sm
        transition-all duration-300 ease-out
        ${isPlaceholder
          ? 'border-dashed border-[var(--color-border)] opacity-70'
          : isFeatured
            ? 'border-white/[0.07] hover:border-[var(--color-border-hover)] hover:shadow-[0_0_40px_-12px_rgba(0,255,136,0.15)]'
            : 'border-white/[0.06] hover:border-[var(--color-border-hover)] hover:shadow-[0_0_30px_-10px_rgba(0,255,136,0.12)]'
        }
      `}
    >
      <h3 className="font-mono font-semibold text-[var(--color-foreground)] mb-1">
        {project.title}
      </h3>
      {project.subtitle && (
        <p className="font-mono text-sm text-[var(--color-muted)] mb-3">
          {project.subtitle}
        </p>
      )}
      <p className="text-sm text-[var(--color-foreground-dim)] leading-relaxed mb-2">
        {project.description}
      </p>
      {project.metrics && (
        <p className="font-mono text-xs text-[var(--color-muted)]">
          {project.metrics}
        </p>
      )}
      {!isPlaceholder && !project.external && (
        <span className="font-mono text-xs text-[var(--color-accent)] mt-3 inline-block link-underline">
          Case study →
        </span>
      )}
    </motion.article>
  )

  if (isPlaceholder) {
    return <div className="min-h-[200px]">{content}</div>
  }
  if (project.external && project.href) {
    return (
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block min-h-[200px]"
      >
        {content}
      </a>
    )
  }
  return (
    <Link to={`/work/${project.id}`} className="block min-h-[200px]">
      {content}
    </Link>
  )
}

export function WhatImBuilding() {
  const [featured, ...rest] = projects
  return (
    <AnimatedSection id="work" className="py-[140px] sm:py-[160px] px-6 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-5xl mx-auto">
        {/* Section title with bleed - overlaps previous section */}
        <h2 className="font-mono text-sm text-[var(--color-muted)] tracking-[0.2em] uppercase mb-4 -mt-16 sm:-mt-20">
          What I&apos;m Building
        </h2>
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2">
          {/* Featured: Bob full width */}
          <div className="sm:col-span-2 min-h-[220px]">
            <ProjectCard project={featured} index={0} isFeatured />
          </div>
          {rest.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i + 1} />
          ))}
          <ProjectCard
            project={{
              id: 'more',
              title: 'More coming soon',
              description: 'Case studies and deep dives on agent architecture, metrics, and lessons learned.',
            }}
            index={projects.length}
            isPlaceholder
          />
        </div>
      </div>
    </AnimatedSection>
  )
}
