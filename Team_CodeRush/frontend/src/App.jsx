import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import TenantDashboard from './pages/tenant/TenantDashboard'
import OwnerDashboard from './pages/owner/OwnerDashboard'
import CanteenDashboard from './pages/canteen/CanteenDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/tenant/*" element={<ProtectedRoute><TenantDashboard /></ProtectedRoute>} />
        <Route path="/owner/*" element={<ProtectedRoute><OwnerDashboard /></ProtectedRoute>} />
        <Route path="/canteen/*" element={<ProtectedRoute><CanteenDashboard /></ProtectedRoute>} />
        <Route path="/admin/*" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
