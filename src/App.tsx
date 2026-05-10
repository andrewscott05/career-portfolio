import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { ExperiencePage } from './pages/ExperiencePage'
import { CaseStudy } from './pages/CaseStudy'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/experience" element={<ExperiencePage />} />
      <Route path="/work/:slug" element={<CaseStudy />} />
    </Routes>
  )
}

export default App
