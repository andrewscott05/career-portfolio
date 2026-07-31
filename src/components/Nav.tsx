import { Link, useLocation } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'

type NavLink = { label: string; to: string; hash?: string }

const links: NavLink[] = [
  { label: 'Work', to: '/', hash: '#work' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/', hash: '#contact' },
]

export function Nav() {
  const location = useLocation()
  // The asterisk turns with the page: a small thread from top to bottom
  const { scrollYProgress } = useScroll()
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 720])

  const handleHashClick = (e: React.MouseEvent, link: NavLink) => {
    if (!link.hash) return
    if (location.pathname === link.to) {
      e.preventDefault()
      document.querySelector(link.hash)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-[var(--color-bg)] border-b-[3px] border-[var(--color-ink)]">
      <div className="max-w-[1100px] mx-auto w-full flex items-center justify-between px-6 sm:px-10 md:px-14 py-5">
        <Link to="/" className="font-display text-base text-[var(--color-ink)]">
          A.SCOTT
          <motion.span
            style={{ rotate }}
            className="inline-block text-[var(--color-primary)]"
          >
            *
          </motion.span>
        </Link>
        <div className="flex items-center gap-5 sm:gap-6">
          {links.map((link) => (
            <Link
              key={link.label}
              to={`${link.to}${link.hash ?? ''}`}
              onClick={(e) => handleHashClick(e, link)}
              className="font-mono font-medium text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-ink)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
