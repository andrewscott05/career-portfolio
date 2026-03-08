import { useInView } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: EASE },
}

export function AnimatedSection({
  children,
  className = '',
  id,
}: {
  children: ReactNode
  className?: string
  id?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{ hidden: fadeInUp.hidden, visible: fadeInUp.visible }}
      transition={fadeInUp.transition}
      className={className}
    >
      {children}
    </motion.section>
  )
}
