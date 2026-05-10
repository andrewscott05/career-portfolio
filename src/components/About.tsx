import { Link } from 'react-router-dom'
import { AnimatedSection } from './AnimatedSection'

export function About() {
  return (
    <AnimatedSection id="about" className="py-16 sm:py-24 px-6 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-[1200px] mx-auto w-full">
        <div className="md:grid md:grid-cols-[140px_1fr] md:gap-16">
          <div>
            <h2 className="section-label">About</h2>
          </div>
          <div className="mt-6 md:mt-0 space-y-5 text-[var(--color-text-secondary)] leading-relaxed text-[1rem] sm:text-[1.0625rem] max-w-2xl">
            <p>
              I work on product across platforms, design systems, automation, and AI — partnering closely with engineering and design to ship things that work for real users at real scale. I write detailed PRDs, get into the weeds on architecture, and stay close to the work all the way through launch.
            </p>
            <p>
              I'm at Arrive Logistics working on AI and automation. Before that I PMed the Spot Quoting platform as it grew from $180M to $300M+ and shipped the Arrive Developer Portal from concept to launch. Got here through 10+ years — enterprise IT at GM, PMO at a startup, and now product at scale.
            </p>
            <p className="pt-2">
              <Link
                to="/experience"
                className="link-underline font-mono text-sm text-[var(--color-primary)]"
              >
                Full experience →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
