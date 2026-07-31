import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useRef, useState, type MouseEvent } from 'react'
import { projects, developerPortal, type CaseStudy } from '../data/projects'

const EASE = [0.22, 1, 0.36, 1] as const
const TILT_MAX = 2.5 // degrees, kept small so it reads as tactile, not gimmicky

const MotionLink = motion.create(Link)

/* Entrances follow the site's press metaphor: elements arrive slightly
   raised, then press flat onto the page as their hard shadow grows in. */

function WorkCard({ project, index }: { project: CaseStudy; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width // 0 -> 1
    const py = (e.clientY - rect.top) / rect.height // 0 -> 1
    setTilt({
      x: (0.5 - py) * TILT_MAX * 2, // rotateX: top half tilts back, bottom tilts forward
      y: (px - 0.5) * TILT_MAX * 2, // rotateY: left half tilts left, right tilts right
    })
  }

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 })

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 1.04, y: -8 },
        visible: { opacity: 1, scale: 1, y: 0 },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.06 }}
      style={{ perspective: 2000 }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.2s ease-out',
          transformStyle: 'preserve-3d',
        }}
      >
        <MotionLink
          to={`/work/${project.id}`}
          variants={{
            hidden: { boxShadow: '0px 0px 0px var(--color-secondary)' },
            visible: { boxShadow: '8px 8px 0px var(--color-secondary)' },
          }}
          transition={{ duration: 0.5, ease: EASE, delay: index * 0.06 }}
          className="group block bg-[var(--color-surface)] border-[3px] border-[var(--color-ink)]"
        >
          {project.thumbnail && (
            <img
              src={project.thumbnail.src}
              alt={project.thumbnail.alt}
              className="w-full border-b-[3px] border-[var(--color-ink)]"
            />
          )}
          <div className="p-7 sm:p-9">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2 sm:gap-4 mb-3">
              <h3 className="font-display text-[clamp(1.25rem,3.5vw,1.75rem)] text-[var(--color-ink)]">
                <span className="font-mono text-[12px] font-medium text-[var(--color-text-muted)] mr-3 align-middle">
                  0{index + 1}
                </span>
                {project.title}
              </h3>
              <span className="font-mono text-[11px] text-[var(--color-primary)] whitespace-nowrap">
                {project.tag}
              </span>
            </div>
            <p className="font-serif text-[15px] sm:text-base text-[var(--color-text-secondary)] leading-[1.7] max-w-[62ch]">
              {project.summary}
            </p>
            <span className="inline-block font-display text-[13px] text-[var(--color-ink)] bg-[var(--color-secondary)] px-3 py-1.5 mt-6">
              Read more →
            </span>
          </div>
        </MotionLink>
      </div>
    </motion.div>
  )
}

export function WhatImBuilding() {
  return (
    <section id="work" className="px-6 sm:px-10 md:px-14 pb-16 sm:pb-20">
      <div className="max-w-[1100px] mx-auto w-full">
        <h2 className="font-display text-[clamp(1.5rem,4vw,2rem)] text-[var(--color-ink)] mb-6 sm:mb-7">
          Built &amp; shipped{' '}
          <span className="font-mono text-[13px] font-medium text-[var(--color-text-muted)] align-middle">
            (0{projects.length})
          </span>
        </h2>

        <div className="space-y-6">
          {projects.map((project, i) => (
            <WorkCard key={project.id} project={project} index={i} />
          ))}
        </div>

        <motion.a
          href={developerPortal.href}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 1.03, y: -6 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mt-6 bg-[var(--color-ink)] border-[3px] border-[var(--color-ink)] px-7 sm:px-10 py-7 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 group"
        >
          <div>
            <p className="font-display text-lg text-[var(--color-bg)]">
              {developerPortal.title}
            </p>
            <p className="font-serif text-[15px] text-[var(--color-ink-subtext)] mt-1.5 leading-[1.6]">
              {developerPortal.description}
            </p>
          </div>
          <span className="font-display text-[13px] text-[var(--color-secondary)] whitespace-nowrap sm:ml-8 group-hover:translate-x-0.5 transition-transform">
            Visit →
          </span>
        </motion.a>
      </div>
    </section>
  )
}
