import { Nav } from '../components/Nav'
import { Hero } from '../components/Hero'
import { Stats } from '../components/Stats'
import { PinnedStack } from '../components/PinnedStack'
import { WhatImBuilding } from '../components/WhatImBuilding'
import { Contact } from '../components/Contact'

export function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Stats />
      <PinnedStack />
      <WhatImBuilding />
      <Contact />
    </>
  )
}
