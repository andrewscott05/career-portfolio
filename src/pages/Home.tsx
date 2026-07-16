import { Nav } from '../components/Nav'
import { Hero } from '../components/Hero'
import { WhatImBuilding } from '../components/WhatImBuilding'
import { Contact } from '../components/Contact'

export function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <WhatImBuilding />
      <Contact />
    </>
  )
}
