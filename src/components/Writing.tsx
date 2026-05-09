import { AnimatedSection } from './AnimatedSection'

export function Writing() {
  return (
    <AnimatedSection id="writing" className="py-16 sm:py-24 px-6 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-[1200px] mx-auto w-full">
        <div className="md:grid md:grid-cols-[140px_1fr] md:gap-16">
          <div>
            <h2 className="section-label">Writing</h2>
          </div>
          <div className="mt-6 md:mt-0 max-w-2xl">
            <p className="text-[var(--color-text-secondary)] text-[1rem] sm:text-[1.0625rem] leading-relaxed mb-3">
              I write about freight tech, AI in logistics, and building products that automate at scale.
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">
              Posts coming soon —{' '}
              <a
                href="https://linkedin.com/in/andrew-john-scott"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-[var(--color-primary)]"
              >
                follow on LinkedIn
              </a>{' '}
              in the meantime.
            </p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
