import { Nav } from '../components/Nav'
import { Hero } from '../components/Hero'
import { Metrics } from '../components/Metrics'
import { WhatImBuilding } from '../components/WhatImBuilding'
import { About } from '../components/About'
import { Testimonials } from '../components/Testimonials'
import { Contact } from '../components/Contact'

export function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Metrics />
      <WhatImBuilding />
      <About />
      <Testimonials />
      <Contact />
    </>
  )
}
