import { Nav } from '../components/Nav'
import { Hero } from '../components/Hero'
import { Ticker } from '../components/Ticker'
import { Stats } from '../components/Stats'
import { WhatImBuilding } from '../components/WhatImBuilding'
import { Contact } from '../components/Contact'

export function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Ticker />
      <div className="pt-16 sm:pt-20">
        <Stats />
      </div>
      <WhatImBuilding />
      <Contact />
    </>
  )
}
