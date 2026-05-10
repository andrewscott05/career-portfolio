import { AnimatedSection } from './AnimatedSection'

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

export function Contact() {
  return (
    <AnimatedSection id="contact" className="py-16 sm:py-24 px-6 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-[1200px] mx-auto w-full">
        <div className="md:grid md:grid-cols-[140px_1fr] md:gap-16">
          <div>
            <h2 className="section-label">Contact</h2>
          </div>
          <div className="mt-6 md:mt-0 max-w-2xl">
            <p className="text-[var(--color-text-secondary)] text-sm mb-6">
              Open to speaking, advising, collaborating, or just talking shop about product, platforms, and automation.
            </p>
            <nav className="flex flex-wrap items-center gap-6" aria-label="Contact">
              <a
                href="mailto:ascott1296@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-2xl sm:text-3xl font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors inline-flex items-center gap-3"
              >
                ascott1296@gmail.com
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M7 17L17 7" />
                  <polyline points="8 7 17 7 17 16" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/in/andrew-john-scott"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors p-1"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
            </nav>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
