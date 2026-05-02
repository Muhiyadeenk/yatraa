import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import HotelDetail from './pages/HotelDetail';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import AdminPanel from './pages/AdminPanel';
import IntroAnimation from './components/IntroAnimation';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const location = useLocation();

  // Show intro animation on app load
  useEffect(() => {
    // If you want to disable it during development, you can set setShowIntro(false) here.
    // For now, it plays every time the app mounts.
  }, []);

  const handleIntroFinish = () => {
    setShowIntro(false);
  };

  return (
    <>
      {showIntro && <IntroAnimation onFinish={handleIntroFinish} />}
      
      <div className="app-container" style={{ 
        opacity: showIntro ? 0 : 1, 
        transition: 'opacity 0.8s ease-in',
        visibility: showIntro ? 'hidden' : 'visible',
        height: showIntro ? '100vh' : 'auto',
        overflow: showIntro ? 'hidden' : 'auto'
      }}>
        <Navbar />
        <main className="main-content" style={{ minHeight: '80vh', paddingTop: '80px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotels/:id" element={<HotelDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
