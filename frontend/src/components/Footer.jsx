import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--bg-pure)', color: 'var(--text-main)', borderTop: '1px solid var(--border)', paddingTop: '80px', paddingBottom: '30px' }}>
      <div className="container">
        <div className="grid grid-cols-4 gap-8" style={{ marginBottom: '60px' }}>
          <div style={{ paddingRight: '20px' }}>
            <h2 className="logo" style={{ color: 'var(--primary-dark)', fontSize: '2.5rem', marginBottom: '20px' }}>Yatraa<span className="dot">.</span></h2>
            <p className="text-muted" style={{ marginBottom: '30px', fontSize: '1.05rem' }}>Experience the world's most luxurious eco-resorts and hotels. Crafted for the conscious traveler.</p>
            <div className="flex gap-4">
              <span className="text-muted font-medium">Follow us on IG & Twitter @YatraaStays</span>
            </div>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '25px', fontSize: '1.2rem' }}>Destinations</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} className="text-muted">
              <li><Link to="/hotels" style={{ '&:hover': { color: 'var(--primary)' }}}>Maldives</Link></li>
              <li><Link to="/hotels">Swiss Alps</Link></li>
              <li><Link to="/hotels">Bali Retreats</Link></li>
              <li><Link to="/hotels">Santorini</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '25px', fontSize: '1.2rem' }}>Company</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} className="text-muted">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Support</Link></li>
              <li><Link to="/faq">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '25px', fontSize: '1.2rem' }}>Newsletter</h4>
            <p className="text-muted" style={{ marginBottom: '20px' }}>Subscribe for exclusive luxury offers.</p>
            <div className="flex" style={{ background: 'var(--bg-soft)', borderRadius: '50px', padding: '5px', border: '1px solid var(--border)' }}>
              <input type="email" placeholder="Your email..." className="form-input" style={{ border: 'none', background: 'transparent', width: '100%' }} />
              <button className="btn btn-primary" style={{ padding: '10px' }}><Send size={18} /></button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-muted" style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', fontSize: '0.95rem' }}>
          <p>&copy; {new Date().getFullYear()} Yathraa Luxury Resorts. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-2"><MapPin size={16}/> New York</span>
            <span className="flex items-center gap-2"><Phone size={16}/> 1-800-YATRAA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
