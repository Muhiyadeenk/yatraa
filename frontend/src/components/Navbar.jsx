import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'glass-nav' : ''} ${!isHome && !isScrolled ? 'solid-nav' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          Yathraa<span className="dot">.</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links desktop-only">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/hotels?type=Hotel" className={`nav-link ${location.search.includes('Hotel') ? 'active' : ''}`}>Hotel</Link>
          <Link to="/hotels?type=Resort" className={`nav-link ${location.search.includes('Resort') ? 'active' : ''}`}>Resort</Link>
          <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
          
          {user ? (
            <div className="nav-actions">
              <Link to="/dashboard" className="account-pill" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.1)', padding: '6px 16px 6px 6px', borderRadius: '30px', transition: 'all 0.3s ease', textDecoration: 'none' }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  background: 'var(--primary)', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '0.9rem', 
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
                }}>
                  {user.first_name ? user.first_name[0] : user.username[0].toUpperCase()}
                </div>
                <span className="font-semibold" style={{ color: 'inherit' }}>Account</span>
              </Link>
            </div>
          ) : (
            <div className="nav-actions">
              <Link to="/login" className="nav-link">Sign In</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '10px 24px', marginLeft: '16px' }}>Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-toggle mobile-only" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu glass">
            <Link to="/" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/hotels?type=Hotel" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Hotel</Link>
            <Link to="/hotels?type=Resort" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Resort</Link>
            <Link to="/contact" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="mobile-link flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: 'var(--primary)', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '0.85rem', 
                    fontWeight: 'bold' 
                  }}>
                    {user.first_name[0]}
                  </div>
                  Account
                </Link>
                <button onClick={handleLogout} className="mobile-link text-left w-full">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                <Link to="/register" className="mobile-link font-bold text-primary" onClick={() => setMobileMenuOpen(false)}>Sign Up Free</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
