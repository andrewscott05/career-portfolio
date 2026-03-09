import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { AnimatedSection } from './AnimatedSection'
import { projects, type Project } from '../data/projects'

const EASE = [0.22, 1, 0.36, 1] as const

function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 ml-1">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

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
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.08 }}
      whileHover={isPlaceholder ? undefined : { y: -2 }}
      className={`
        block text-left p-6 sm:p-8 rounded-[10px] border transition-all duration-300 ease-out group/card
        ${isPlaceholder
          ? 'border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/60 opacity-80'
          : 'bg-[var(--color-surface)] border-[var(--color-border)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:border-[var(--color-primary)]'
        }
        ${isFeatured ? 'border-l-4 border-l-[var(--color-primary)] sm:border-l-4' : ''}
      `}
    >
      <h3 className="font-bold text-[var(--color-text)] mb-1 text-lg">
        {project.title}
      </h3>
      {project.subtitle && (
        <p className="font-mono text-sm text-[var(--color-primary)] mb-3">
          {project.subtitle}
        </p>
      )}
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-2">
        {project.description}
      </p>
      {project.metrics && (
        <p className="font-mono text-xs text-[var(--color-tan)] font-medium mt-2">
          {project.metrics}
        </p>
      )}
      {!isPlaceholder && !project.external && (
        <span className="inline-flex items-center gap-1 font-mono text-sm text-[var(--color-primary)] mt-4 group-hover/card:underline">
          Case study
          <span className="inline-block transition-transform duration-200 group-hover/card:translate-x-0.5">→</span>
        </span>
      )}
      {!isPlaceholder && project.external && (
        <span className="inline-flex items-center font-mono text-sm text-[var(--color-primary)] mt-4">
          Visit site
          <ExternalLinkIcon />
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
    <AnimatedSection id="work" className="py-[120px] sm:py-[160px] px-6 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-[1200px] mx-auto w-full">
        <h2 className="section-label mb-10">What I&apos;m Building</h2>
        <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2">
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
