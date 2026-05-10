import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

type NavLink = {
  label: string
  to: string
  hash?: string
}

const links: NavLink[] = [
  { label: 'Work', to: '/', hash: '#work' },
  { label: 'Experience', to: '/experience' },
  { label: 'Contact', to: '/', hash: '#contact' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleHashClick = (e: React.MouseEvent, link: NavLink) => {
    if (!link.hash) return
    if (location.pathname === link.to) {
      e.preventDefault()
      document.querySelector(link.hash)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--color-bg)]/90 backdrop-blur-sm border-b border-[var(--color-border-subtle)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="font-semibold text-sm text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
        >
          Andrew Scott
        </Link>
        <nav className="flex items-center gap-6" aria-label="Site">
          {links.map((link) => (
            <Link
              key={link.label}
              to={`${link.to}${link.hash ?? ''}`}
              onClick={(e) => handleHashClick(e, link)}
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors link-underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
