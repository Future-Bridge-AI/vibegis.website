import { BrowserRouter, Routes, Route } from 'react-router-dom'
import VibeGISLanding from '@/marketing/landing/LandingPage'
import TrainingSuccess from '@/marketing/training/TrainingSuccess'
import Generator from '@/app/generator'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Marketing Routes */}
        <Route path="/" element={<VibeGISLanding />} />
        <Route path="/training/success" element={<TrainingSuccess />} />

        {/* Authenticated App Routes */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/generator" element={<Generator />} />
        
        {/* 404 */}
        <Route path="*" element={<div>404 - Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
