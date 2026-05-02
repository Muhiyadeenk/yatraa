import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setIsLoading(true);
    
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name
      });
      // Optionally redirect to login or automatically login
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container section">
      <div className="auth-card card">
        <div className="auth-header text-center">
          <h2>Create an Account</h2>
          <p className="text-muted">Join Yathraa for exclusive deals</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-2">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input type="text" className="form-input" name="first_name" value={formData.first_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input type="text" className="form-input" name="last_name" value={formData.last_name} onChange={handleChange} required />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Username</label>
            <input type="text" className="form-input" name="username" value={formData.username} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-input" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <div className="auth-footer text-center">
          <p>Already have an account? <Link to="/login" className="text-primary font-medium">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
