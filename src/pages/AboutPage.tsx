import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Nav } from '../components/Nav'

const EASE = [0.22, 1, 0.36, 1] as const

export function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Nav />
      <article className="px-6 sm:px-10 md:px-14 py-14 sm:py-20">
        <div className="max-w-[820px] mx-auto w-full">
          <motion.header
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <p className="section-label mb-4">Hello</p>
            <h1 className="font-display text-[clamp(2.25rem,7vw,3.5rem)] text-[var(--color-ink)] leading-[1.0] mb-7">
              Hi, I&apos;m Andrew.
            </h1>
            <p className="font-serif text-[18px] sm:text-xl text-[var(--color-text-secondary)] leading-[1.6]">
              I&apos;ve spent most of my career taking on messy, ambiguous
              problems and turning them into something that runs well. I like
              being the person pulling the pieces into line, and I&apos;m not
              usually satisfied until it&apos;s actually right, not just good
              enough.
            </p>
          </motion.header>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-14 sm:mt-16 border-t-[3px] border-[var(--color-ink)] pt-10"
          >
            <p className="section-label mb-5">Off the clock</p>
            <p className="font-serif text-[17px] sm:text-lg text-[var(--color-text-secondary)] leading-[1.7]">
              Away from the screen, most of my time goes to my young family.
              Outside of that, I&apos;m usually running, in the gym, watching
              more college football than I probably should, or out in
              nature whenever I can get there.
            </p>
          </motion.section>
        </div>
      </article>
    </>
  )
}
