import { Link, useLocation } from 'react-router-dom'

const RESUME = '/resume.pdf'

type NavLink = { label: string; to: string; hash?: string }

const links: NavLink[] = [
  { label: 'Work', to: '/', hash: '#work' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/', hash: '#contact' },
]

export function Nav() {
  const location = useLocation()

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
          A. SCOTT<span className="text-[var(--color-primary)]">*</span>
        </Link>
        <div className="flex items-center gap-5 sm:gap-6">
          {links.map((link) => (
            <Link
              key={link.label}
              to={`${link.to}${link.hash ?? ''}`}
              onClick={(e) => handleHashClick(e, link)}
              className="hidden sm:inline font-mono font-medium text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-ink)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={RESUME}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-xs text-[var(--color-bg)] bg-[var(--color-ink)] px-4 py-2.5"
          >
            Resume ↓
          </a>
        </div>
      </div>
    </nav>
  )
}
