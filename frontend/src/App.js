import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import DashboardPage from "./pages/DashboardPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* ...otras rutas... */}
      </Routes>
    </Router>
  )
}

export default App