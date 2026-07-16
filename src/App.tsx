import { Routes, Route, Navigate } from 'react-router-dom'
import { Home } from './pages/Home'
import { AboutPage } from './pages/AboutPage'
import { CaseStudy } from './pages/CaseStudy'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutPage />} />
      {/* Previous URL — keep it alive rather than 404. */}
      <Route path="/experience" element={<Navigate to="/about" replace />} />
      <Route path="/work/:slug" element={<CaseStudy />} />
    </Routes>
  )
}

export default App
