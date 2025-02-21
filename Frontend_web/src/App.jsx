import { useState } from 'react'
import { Router, Routes, Route, BrowserRouter } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LostItemsPage from './pages/Lost&FoundItems'
import LogoutPage from './pages/LogoutPage'
import './App.css'
import { AuthProvider } from './components/AuthProvider'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />}/>
          

          <Route path="/LostandFoundItems" element={<ProtectedRoute> <LostItemsPage/> </ProtectedRoute>}/>
          <Route path="/Logout" element={<ProtectedRoute> <LogoutPage/> </ProtectedRoute>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
