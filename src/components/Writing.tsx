import { AnimatedSection } from './AnimatedSection'

export function Writing() {
  return (
    <AnimatedSection id="writing" className="py-[140px] sm:py-[160px] px-6 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-2xl mx-auto">
        <div className="border border-dashed border-[var(--color-border)] rounded-sm p-8 opacity-80">
          <h2 className="font-mono text-sm text-[var(--color-muted)] tracking-[0.2em] uppercase mb-6">
            Writing / Thinking
          </h2>
          <p className="text-[var(--color-foreground-dim)] mb-4">
            I write about AI agents, freight tech, and building products that automate at scale.
          </p>
          <p className="font-mono text-sm text-[var(--color-muted)]">
            Coming soon.
          </p>
        </div>
      </div>
    </AnimatedSection>
  )
}
