import './App.css'
import React, { useState, useEffect, lazy, Suspense } from 'react'
import Login from './pages/Login/Login.jsx'

// Lazy loading large components to make the initial load lighter
const AdminHome = lazy(() => import('./pages/home/AdminHome.jsx'));
const Home = lazy(() => import('./pages/home/home.jsx'));

// Simple loading indicator for Suspense
const LoadingView = () => (
  <div className="loading-screen">
    <div className="loader"></div>
    <p>Cargando sistema...</p>
  </div>
);

function decodeJwt(token) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

import { NotificationProvider } from './context/NotificationContext';

function App() {
  const [view, setView] = useState('login')
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      handleLogin(storedToken);
    }
  }, []);

  const handleLogin = (tokenValue) => {
    if (!tokenValue) return setView('login');
    setToken(tokenValue);
    // tokenValue may be the raw jwt or an object; handle both
    let jwt = tokenValue;
    if (typeof tokenValue === 'object' && tokenValue.token) jwt = tokenValue.token;
    const payload = decodeJwt(jwt);
    // try common claim names: usuario, name, username
    const username = payload?.usuario || payload?.user || payload?.username || payload?.name || payload?.id || null;
    setUser(username);
    if (username === 'admin') {
      setView('adminHome'); // Redirigir a AdminHome si el usuario es 'admin'
    } else {
      setView('home'); // Redirigir a Home normal para otros usuarios
    }
  }

  return (
    <NotificationProvider>
      <div className="app-container">
        <Suspense fallback={<LoadingView />}>
          {view === 'login' && (
            <Login onLogin={(token) => handleLogin(token)} />
          )}

          {view === 'adminHome' && (
            <AdminHome onBack={() => { setToken(null); setUser(null); setView('login'); }} username={user} token={token} />
          )}
          {view === 'home' && (
            <Home onBack={() => { setToken(null); setUser(null); setView('login'); }} username={user} token={token} />
          )}
        </Suspense>
      </div>
    </NotificationProvider>
  )
}

export default App
