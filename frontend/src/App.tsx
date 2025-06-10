import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Navbar } from "./components/navbar"
import { ThemeProvider } from "./components/theme-provider"
import '@/globals.css'
import Adquire from "@/pages/adquire"
import AboutUs from "@/pages/about"
import Plans from "@/pages/plans"
import Dashboard from "@/pages/dashboard"
import Auth from "@/pages/auth"
import ProfilePage from "./pages/profile"

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token")
  return token ? <>{children}</> : <Navigate to="/auth" />
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Plans />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/adquire" element={<Adquire />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/dashboard/profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </Router>
    </ThemeProvider>
  )
}

export default App

