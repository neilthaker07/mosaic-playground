import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import TaskPage from './TaskPage'
import Flags from './Flags'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        {/* <Route path="/tasks" element={<TaskPage />} />
        <Route path="/flags" element={<Flags />} /> */}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
