import { Nav } from '../components/Nav'
import { Hero } from '../components/Hero'
import { Ticker } from '../components/Ticker'
import { Stats } from '../components/Stats'
import { Approach } from '../components/Approach'
import { WhatImBuilding } from '../components/WhatImBuilding'
import { Contact } from '../components/Contact'

export function Home() {
  return (
    <>
      <Nav />
      <Hero />
      {/* Breathing room so the chart lands, then the ticker arrives */}
      <div className="h-[12vh] sm:h-[16vh]" aria-hidden />
      <Ticker />
      <div className="pt-16 sm:pt-24">
        <Stats />
      </div>
      {/* The page goes quiet here before the work */}
      <Approach />
      <WhatImBuilding />
      <Contact />
    </>
  )
}
