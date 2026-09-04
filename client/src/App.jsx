import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'

// Pages
import HomePage from './pages/HomePage'
import HospitalsPage from './pages/HospitalsPage'
import HospitalDetailPage from './pages/HospitalDetailPage'
import AppointmentPage from './pages/AppointmentPage'
import EmergencyPage from './pages/EmergencyPage'
import BloodBankPage from './pages/BloodBankPage'
import SchemesPage from './pages/SchemesPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import HospitalRegisterPage from './pages/HospitalRegisterPage'
import NotFoundPage from './pages/NotFoundPage'

// Layout
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin-slow w-10 h-10 border-4 border-primary border-t-transparent rounded-full" /></div>
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

const AppRoutes = () => (
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/hospitals" element={<HospitalsPage />} />
      <Route path="/hospitals/:id" element={<HospitalDetailPage />} />
      <Route path="/emergency" element={<EmergencyPage />} />
      <Route path="/blood-bank" element={<BloodBankPage />} />
      <Route path="/schemes" element={<SchemesPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register-hospital" element={
        <ProtectedRoute role="hospital_admin"><HospitalRegisterPage /></ProtectedRoute>
      } />
      <Route path="/appointment/:hospitalId/:doctorId" element={
        <ProtectedRoute><AppointmentPage /></ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute><UserDashboard /></ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    <Footer />
  </BrowserRouter>
)

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', borderRadius: '10px' },
          success: { iconTheme: { primary: '#2E7D32', secondary: '#fff' } },
          error: { iconTheme: { primary: '#C62828', secondary: '#fff' } }
        }}
      />
    </AuthProvider>
  )
}
