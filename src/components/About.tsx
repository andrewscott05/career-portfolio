export function About() {
  return (
    <section id="about" className="px-6 sm:px-10 md:px-14 pb-16 sm:pb-20">
      <div className="max-w-[1100px] mx-auto w-full">
        <div className="border-t-[3px] border-[var(--color-ink)] pt-10 sm:pt-11 grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-6 md:gap-12 items-start">
          <p className="section-label">// About</p>
          <div>
            <p className="font-mono text-[15px] sm:text-base text-[var(--color-ink)] leading-[1.8] mb-[18px]">
              Operations run on a thousand small decisions — where something is,
              who owns the next step, what happens when it&apos;s late. The work
              here is building systems that make those calls without routing them
              through more people.
            </p>
            <p className="font-mono text-[15px] sm:text-base text-[var(--color-text-secondary)] leading-[1.8]">
              That means specs with real technical depth, architecture argued
              alongside engineers, and a memory of what it feels like to be the
              person on the other end of a broken process. The whole job is
              knowing exactly what to automate — and what to leave to people.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
