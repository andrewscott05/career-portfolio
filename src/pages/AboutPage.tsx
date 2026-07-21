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
              Give me a messy, ambiguous problem and I&apos;m happy. My whole
              career has been about organizing chaos and scaling it to
              excellence. I thrive in the ambiguity, I love pulling the moving
              parts into alignment, and I have a relentless streak for getting
              things right. &ldquo;Good enough&rdquo; rarely is.
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
              Away from the screen, most of my time goes to my family. I have a
              young daughter, with a son arriving this fall. The rest goes to
              staying active: running and working out, getting far too invested
              in college football, and escaping into the mountains and the
              outdoors whenever I can.
            </p>
          </motion.section>
        </div>
      </article>
    </>
  )
}
