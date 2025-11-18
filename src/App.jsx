import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import LoadingSpinner from './components/LoadingSpinner';
import ClientEnrollmentForm from './pages/ClientEnrollmentForm';
import EmployeeProfile from './pages/EmployeeProfile';
function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/client-enroll"
        element= {<ClientEnrollmentForm />}
      />
      <Route
        path="/employee/:id"
        element={user ? <EmployeeProfile /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/"
        element={
          user ? (
            user.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;