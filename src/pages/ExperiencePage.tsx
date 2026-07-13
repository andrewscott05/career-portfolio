import { useEffect } from 'react'
import { Nav } from '../components/Nav'
import { Experience } from '../components/Experience'
import { Skills } from '../components/Skills'

export function ExperiencePage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Nav />
      <header className="px-6 sm:px-10 md:px-14">
        <div className="max-w-[1100px] mx-auto w-full pt-16 pb-12 sm:pt-20 sm:pb-16">
          <p className="font-mono text-[13px] tracking-[0.12em] uppercase text-[var(--color-text-secondary)] mb-6">
            Andrew Scott · Full track record
          </p>
          <h1 className="font-display text-[clamp(2.5rem,8vw,4.5rem)] text-[var(--color-ink)] leading-[0.98] tracking-[-0.01em] mb-6">
            Experience
          </h1>
          <p className="font-mono text-[15px] sm:text-base text-[var(--color-text-secondary)] max-w-[600px] leading-[1.8]">
            10+ years across enterprise IT, startup PMO leadership, and product
            at scale.
          </p>
        </div>
      </header>
      <Experience />
      <Skills />
    </>
  )
}
