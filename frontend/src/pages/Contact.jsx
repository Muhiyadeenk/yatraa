import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', message: '' });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.message) return;
    
    const newMsg = { ...formData, id: Date.now(), date: new Date().toISOString() };
    const existing = JSON.parse(localStorage.getItem('yathraa_contacts')) || [];
    localStorage.setItem('yathraa_contacts', JSON.stringify([newMsg, ...existing]));
    
    setSuccess(true);
    setFormData({ firstName: '', lastName: '', email: '', message: '' });
    setTimeout(() => setSuccess(false), 5000);
  };
  return (
    <div className="container section">
      <div className="text-center" style={{ marginBottom: '50px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>Contact Us</h1>
        <p className="text-muted text-lg">We're here to help and answer any question you might have.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Contact Information */}
        <div className="card" style={{ padding: '40px' }}>
          <h2 style={{ marginBottom: '30px' }}>Get In Touch</h2>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-blue)' }}>
                <MapPin />
              </div>
              <div>
                <h4 style={{ marginBottom: '0' }}>Our Layout</h4>
                <p className="text-muted">123 Travel Avenue, New York, NY 10001, USA</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-blue)' }}>
                <Phone />
              </div>
              <div>
                <h4 style={{ marginBottom: '0' }}>Phone Number</h4>
                <p className="text-muted">+1 (234) 567-8900</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-blue)' }}>
                <Mail />
              </div>
              <div>
                <h4 style={{ marginBottom: '0' }}>Email Address</h4>
                <p className="text-muted">support@yathraa.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card" style={{ padding: '40px' }}>
          <h2 style={{ marginBottom: '30px' }}>Send Us a Message</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-2" style={{ marginBottom: '15px' }}>
              <div>
                <label className="form-label">First Name</label>
                <input type="text" className="form-input" placeholder="John" required 
                  value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div>
                <label className="form-label">Last Name</label>
                <input type="text" className="form-input" placeholder="Doe" 
                  value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" placeholder="john@example.com" required
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea className="form-input" rows="5" placeholder="How can we help you?" required
                value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
            </div>
            
            {success ? (
               <div style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '16px', borderRadius: '8px', textAlign: 'center', marginBottom: '16px' }} className="flex items-center justify-center gap-2">
                 <CheckCircle size={20} /> <span>Message sent successfully!</span>
               </div>
            ) : (
              <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', gap: '10px' }}>
                <Send size={18} /> Send Message
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
