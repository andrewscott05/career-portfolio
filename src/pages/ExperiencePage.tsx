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
      <div className="pt-24 sm:pt-28 px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="max-w-[1200px] mx-auto w-full">
          <h1 className="text-[2rem] sm:text-[2.75rem] md:text-[3.25rem] font-semibold tracking-tight text-[var(--color-text)] leading-[1.15] max-w-3xl">
            Experience
          </h1>
          <p className="mt-4 text-lg text-[var(--color-text-secondary)] max-w-2xl">
            10+ years across enterprise IT, startup PMO leadership, and product at scale.
          </p>
        </div>
      </div>
      <Experience />
      <Skills />
    </>
  )
}
