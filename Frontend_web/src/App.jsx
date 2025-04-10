import { useState } from 'react'
import { Router, Routes, Route, BrowserRouter } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LostItemsPage from './pages/Lost&FoundItems'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import './App.css'
import { AuthProvider } from './components/AuthProvider'
import ProtectedRoute from './components/ProtectedRoute'
import AdminProtectedRoute from './components/AdminProtectedRoute'

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />}/>
          

          <Route path="/LostandFoundItems" element={<ProtectedRoute> <LostItemsPage/> </ProtectedRoute>}/>
          <Route path="/Admin" element={<AdminProtectedRoute> <AdminPage/> </AdminProtectedRoute>}/>
          <Route path="/Profile" element={<ProtectedRoute> <ProfilePage/> </ProtectedRoute>}/>
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
