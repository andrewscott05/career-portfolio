const RESUME = '/resume.pdf'

const links = [
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'About', href: '#about' },
]

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-[var(--color-bg)] border-b-[3px] border-[var(--color-ink)]">
      <div className="max-w-[1100px] mx-auto w-full flex items-center justify-between px-6 sm:px-10 md:px-14 py-5">
        <a
          href="#top"
          className="font-display text-base text-[var(--color-ink)]"
        >
          A. SCOTT<span className="text-[var(--color-primary)]">*</span>
        </a>
        <div className="flex items-center gap-5 sm:gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hidden sm:inline font-mono font-medium text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-ink)] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href={RESUME}
            download
            className="font-display text-xs text-[var(--color-bg)] bg-[var(--color-ink)] px-4 py-2.5"
          >
            Resume ↓
          </a>
        </div>
      </div>
    </nav>
  )
}
