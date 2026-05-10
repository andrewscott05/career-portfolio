import { useState, useEffect } from 'react'

const links = [
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--color-bg)]/90 backdrop-blur-sm border-b border-[var(--color-border-subtle)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 h-14 flex items-center justify-between">
        <a
          href="#"
          className="font-semibold text-sm text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
        >
          Andrew Scott
        </a>
        <nav className="flex items-center gap-6" aria-label="Site">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors link-underline"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
