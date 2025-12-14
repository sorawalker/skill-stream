import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/login/Login.tsx';
import { Register } from './pages/register/Register.tsx';
import { Home } from './pages/home/Home.tsx';
import { useAuthContext } from './contexts/auth.context';
import React from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
