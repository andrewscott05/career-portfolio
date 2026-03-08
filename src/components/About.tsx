import { AnimatedSection } from './AnimatedSection'

export function About() {
  return (
    <AnimatedSection id="about" className="py-[140px] sm:py-[160px] px-6 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-2xl">
        <h2 className="font-mono text-sm text-[var(--color-muted)] tracking-[0.2em] uppercase mb-8">
          About
        </h2>
        <div className="space-y-5 text-[var(--color-foreground-dim)] leading-relaxed">
          <p>
            I build AI agents that automate complex carrier and operational workflows in freight logistics. Hybrid technical + domain background — I write PRDs with technical depth, architect agent systems, and also contribute to M&A and PE analysis leveraging deep freight domain expertise.
          </p>
          <p>
            Currently leading AI & Automation products at Arrive Logistics, where I own the agent roadmap across tracking, carrier communications, quoting, and accounting. 10+ years across GM, startup PMO leadership, and now AI product at scale.
          </p>
        </div>
      </div>
    </AnimatedSection>
  )
}
