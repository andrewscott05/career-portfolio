import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { projects, developerPortal, type CaseStudy } from '../data/projects'

const EASE = [0.22, 1, 0.36, 1] as const

function CaseCard({ project, index }: { project: CaseStudy; index: number }) {
  const cols: Array<{ label: string; body: string }> = [
    { label: 'The problem', body: project.problem },
    { label: 'The build', body: project.build },
    { label: 'The result', body: project.result },
  ]
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.08 }}
      className="bg-[var(--color-surface)] border-[3px] border-[var(--color-ink)] p-7 sm:p-10 mb-6"
      style={{ boxShadow: '8px 8px 0 var(--color-secondary)' }}
    >
      <div className="flex justify-between items-baseline gap-4 mb-3.5">
        <h3 className="font-display text-[clamp(1.375rem,4vw,1.875rem)] text-[var(--color-ink)]">
          {project.title}
        </h3>
        <span className="font-mono text-[11px] text-[var(--color-primary)] whitespace-nowrap">
          {project.tag}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7 mb-5">
        {cols.map((col) => (
          <div key={col.label}>
            <p className="font-display text-xs text-[var(--color-ink)] mb-2">
              {col.label}
            </p>
            <p className="font-mono text-[13px] text-[var(--color-text-secondary)] leading-[1.7]">
              {col.body}
            </p>
          </div>
        ))}
      </div>
      <Link
        to={`/work/${project.id}`}
        className="press inline-block font-display text-[13px] text-[var(--color-ink)] bg-[var(--color-secondary)] px-3 py-1.5"
      >
        Read the case study →
      </Link>
    </motion.article>
  )
}

export function WhatImBuilding() {
  return (
    <section id="work" className="px-6 sm:px-10 md:px-14 pb-16 sm:pb-20">
      <div className="max-w-[1100px] mx-auto w-full">
        <p className="section-label mb-5">// Built &amp; shipped</p>

        {projects.map((project, i) => (
          <CaseCard key={project.id} project={project} index={i} />
        ))}

        <a
          href={developerPortal.href}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[var(--color-ink)] border-[3px] border-[var(--color-ink)] px-7 sm:px-10 py-7 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 group"
        >
          <div>
            <p className="font-display text-lg text-[var(--color-bg)]">
              {developerPortal.title}
            </p>
            <p className="font-mono text-[13px] text-[var(--color-ink-subtext)] mt-1.5 leading-[1.7]">
              {developerPortal.description}
            </p>
          </div>
          <span className="font-display text-[13px] text-[var(--color-secondary)] whitespace-nowrap sm:ml-8 group-hover:translate-x-0.5 transition-transform">
            Visit →
          </span>
        </a>
      </div>
    </section>
  )
}
