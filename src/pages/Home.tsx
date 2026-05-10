import { Nav } from '../components/Nav'
import { Hero } from '../components/Hero'
import { About } from '../components/About'
import { WhatImBuilding } from '../components/WhatImBuilding'
import { Testimonials } from '../components/Testimonials'
import { Contact } from '../components/Contact'

export function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <About />
      <WhatImBuilding />
      <Testimonials />
      <Contact />
    </>
  )
}
