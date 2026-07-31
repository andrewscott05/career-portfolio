import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { projects, developerPortal, type CaseStudy } from '../data/projects'

const EASE = [0.22, 1, 0.36, 1] as const

/* No card chrome: the work reads as an editorial index. Rows divided by hard
   ink rules, an ink wipe rising on hover, and the case study's real artifact
   sliding in from the right edge. */

function WorkRow({ project, index }: { project: CaseStudy; index: number }) {
  // Hover peek: an explicitly chosen image, else the first section artifact
  const peek = project.cardPeek ?? project.sections.find((s) => s.artifact)?.artifact

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.05 }}
      className="border-b-[3px] border-[var(--color-ink)]"
    >
      <Link
        to={`/work/${project.id}`}
        className="group relative block overflow-hidden"
      >
        {/* Ink wipe rises behind the text on hover */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[var(--color-ink)] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
        />

        {/* The real artifact slides in from the right, hard-clipped */}
        {peek && (
          <div
            aria-hidden
            className="hidden md:block absolute inset-y-0 right-0 w-[36%] z-20 border-l-[3px] border-[var(--color-ink)] bg-[var(--color-surface)] translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"
          >
            <img
              src={peek.src}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover object-left-top"
            />
          </div>
        )}

        <div className="relative z-10 py-9 sm:py-11 md:pr-[40%]">
          <p className="font-mono text-[11px] tracking-[0.12em] text-[var(--color-primary)] group-hover:text-[var(--color-secondary)] transition-colors mb-3">
            {project.tag}
          </p>
          <h3 className="font-display text-[clamp(1.6rem,4.5vw,2.9rem)] leading-[1.0] text-[var(--color-ink)] group-hover:text-[var(--color-bg)] transition-colors">
            {project.title}
          </h3>
          <p className="font-serif text-[15px] sm:text-base leading-[1.7] max-w-[58ch] mt-3 text-[var(--color-text-secondary)] group-hover:text-[var(--color-ink-subtext)] transition-colors">
            {project.summary}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}

export function WhatImBuilding() {
  return (
    <section id="work" className="px-6 sm:px-10 md:px-14 pb-16 sm:pb-20">
      <div className="max-w-[1100px] mx-auto w-full">
        <h2 className="font-display text-[clamp(1.75rem,4.5vw,2.5rem)] text-[var(--color-ink)]">
          Built &amp; shipped
        </h2>
        <p className="font-serif italic text-[15px] sm:text-base text-[var(--color-text-muted)] mt-2 mb-8 sm:mb-10">
          Six systems, shipped and measured.
        </p>

        <div className="border-t-[3px] border-[var(--color-ink)]">
          {projects.map((project, i) => (
            <WorkRow key={project.id} project={project} index={i} />
          ))}

          {/* The external portal is just another row in the index */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: EASE, delay: projects.length * 0.05 }}
            className="border-b-[3px] border-[var(--color-ink)]"
          >
            <a
              href={developerPortal.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden"
            >
              <div
                aria-hidden
                className="absolute inset-0 bg-[var(--color-ink)] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
              />
              <div className="relative z-10 py-9 sm:py-11">
                <p className="font-mono text-[11px] tracking-[0.12em] text-[var(--color-primary)] group-hover:text-[var(--color-secondary)] transition-colors mb-3">
                  EXTERNAL
                </p>
                <h3 className="font-display text-[clamp(1.6rem,4.5vw,2.9rem)] leading-[1.0] text-[var(--color-ink)] group-hover:text-[var(--color-bg)] transition-colors">
                  {developerPortal.title}{' '}
                  <span className="text-[clamp(1.1rem,3vw,1.9rem)] align-middle">↗</span>
                </h3>
                <p className="font-serif text-[15px] sm:text-base leading-[1.7] max-w-[58ch] mt-3 text-[var(--color-text-secondary)] group-hover:text-[var(--color-ink-subtext)] transition-colors">
                  {developerPortal.description}
                </p>
              </div>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
