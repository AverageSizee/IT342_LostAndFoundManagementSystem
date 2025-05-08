import { useState } from 'react'
import { Router, Routes, Route, BrowserRouter } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LostItemsPage from './pages/LostAndFoundItems'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import './App.css'
import { AuthProvider } from './components/AuthProvider'
import ProtectedRoute from './components/ProtectedRoute'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import Search from "./pages/Search";

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />}/>
          

          <Route path="/LostandFoundItems" element={<ProtectedRoute> <LostItemsPage/> </ProtectedRoute>}/>
          <Route path="/Admin" element={<AdminProtectedRoute> <AdminPage/> </AdminProtectedRoute>}/>
          <Route path="/Profile" element={<ProtectedRoute> <ProfilePage/> </ProtectedRoute>}/>
          <Route path="/search" element={<ProtectedRoute> <Search /> </ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App


