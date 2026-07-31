import { Nav } from '../components/Nav'
import { Hero } from '../components/Hero'
import { Stats } from '../components/Stats'
import { BuildSequence } from '../components/BuildSequence'
import { WhatImBuilding } from '../components/WhatImBuilding'
import { Contact } from '../components/Contact'

export function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Stats />
      <BuildSequence />
      <WhatImBuilding />
      <Contact />
    </>
  )
}
