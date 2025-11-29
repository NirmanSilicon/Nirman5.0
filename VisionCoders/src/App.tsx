import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ProfilePage from './pages/ProfilePage';
import DashboardLayout from './layout/DashboardLayout';
import DashboardHome from './dashboard/DashboradHome';
import LoginAnimation from './animations/LoginAnimation';
import LogoutAnimation from './animations/LogoutAnimation';

function App() {
  // TODO: Add auth store when available
  const user = null;
  const loading = false;
  const showLoginAnimation = false;
  const showLogoutAnimation = false;
  const isNewUser = false;

  const hideLoginAnimation = () => {};
  const hideLogoutAnimation = () => {};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/signup" element={user ? <Navigate to="/" replace /> : <SignupPage />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" replace />} />
        <Route path="/" element={user ? <DashboardLayout /> : <Navigate to="/login" replace />}>
          <Route index element={<DashboardHome />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Animations */}
      <AnimatePresence>
        {showLoginAnimation && (
          <LoginAnimation
            onComplete={hideLoginAnimation}
            username={undefined}
            isNewUser={isNewUser}
          />
        )}
        {showLogoutAnimation && (
          <LogoutAnimation onComplete={hideLogoutAnimation} />
        )}
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
