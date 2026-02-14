import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Triage from './pages/Triage';
import Result from './pages/Result';
import Records from './pages/Records';
import Login from './pages/Login';

// Protected Route Wrapper
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) return null; // Or a loading spinner

  return (
    <Router>
      {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />} {/* Pass setter to logout if needed */}

      <div className={isAuthenticated ? "min-h-screen bg-slate-50 font-sans" : "font-sans"}>
        <main className={isAuthenticated ? "container mx-auto px-4 py-6" : ""}>
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} />

            <Route path="/" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/triage" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Triage />
              </ProtectedRoute>
            } />
            <Route path="/result" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Result />
              </ProtectedRoute>
            } />
            <Route path="/patients" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Records />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
