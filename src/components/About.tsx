import { AnimatedSection } from './AnimatedSection'

export function About() {
  return (
    <AnimatedSection id="about" className="py-[120px] sm:py-[160px] px-6 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-[1200px] mx-auto w-full">
        <div className="max-w-2xl border-t border-[var(--color-border)] pt-12">
          <h2 className="section-label mb-8">About</h2>
          <div className="space-y-5 text-[var(--color-text-secondary)] leading-relaxed text-[1rem] sm:text-[1.125rem]">
            <p>
              I build technology that automates complex operational workflows in freight logistics — from AI agents handling carrier communications to API platforms powering automated quoting at scale. Hybrid technical + domain background — I write PRDs with technical depth, architect agent systems, and contribute to M&A and PE analysis leveraging deep freight domain expertise.
            </p>
            <p>
              Currently leading AI & Automation products at Arrive Logistics, where I own the agent roadmap across tracking, carrier communications, quoting, and accounting. 10+ years across GM, startup PMO leadership, and now tech product at scale.
            </p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
