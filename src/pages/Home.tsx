import { Nav } from '../components/Nav'
import { Hero } from '../components/Hero'
import { About } from '../components/About'
import { WhatImBuilding } from '../components/WhatImBuilding'
import { Experience } from '../components/Experience'
import { Skills } from '../components/Skills'
import { Testimonials } from '../components/Testimonials'
import { Contact } from '../components/Contact'

export function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <About />
      <WhatImBuilding />
      <Experience />
      <Skills />
      <Testimonials />
      <Contact />
    </>
  )
}
