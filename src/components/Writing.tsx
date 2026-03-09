import { AnimatedSection } from './AnimatedSection'

export function Writing() {
  return (
    <AnimatedSection id="writing" className="py-[120px] sm:py-[160px] px-6 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-[1200px] mx-auto w-full">
        <div className="max-w-2xl">
          <div className="border border-dashed border-[var(--color-border)] rounded-[10px] p-8 opacity-90">
            <h2 className="section-label mb-6">Writing & Thinking</h2>
            <p className="text-[var(--color-text-secondary)] mb-4">
              I write about freight tech, AI in logistics, and building products that automate at scale.
            </p>
            <p className="font-mono text-sm text-[var(--color-text-muted)]">
              Coming soon.
            </p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
