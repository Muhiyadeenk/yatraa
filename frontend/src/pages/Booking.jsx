import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Info } from 'lucide-react';
import './Booking.css';

const Booking = () => {
  const { id } = useParams(); // room id
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Booking Form State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchRoom = async () => {
      try {
        const response = await api.get(`rooms/${id}/`);
        setRoom(response.data);
      } catch (err) {
        console.error("Room not found", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id, user, navigate]);

  // Calculate Price
  useEffect(() => {
    if (checkIn && checkOut && room) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays > 0) {
        setTotalPrice(diffDays * room.price);
      } else {
        setTotalPrice(room.price);
      }
    }
  }, [checkIn, checkOut, room]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setError('');
    
    if (new Date(checkIn) >= new Date(checkOut)) {
      setError('Check-out date must be after check-in date');
      return;
    }

    setBookingLoading(true);
    try {
      const response = await api.post('bookings/', {
        room: room.id,
        check_in: checkIn,
        check_out: checkOut
      });
      // Redirect to payment/success page
      alert("Booking successful!");
      navigate('/dashboard');
    } catch (err) {
      setError('Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="container section text-center">Loading...</div>;
  if (!room) return <div className="container section text-center">Room details not found.</div>;

  return (
    <div className="container section">
      <div className="booking-page-layout grid gap-4" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
        
        {/* Booking Form */}
        <div>
          <h2>Complete Your Booking</h2>
          <div className="card" style={{ padding: '30px', marginTop: '20px' }}>
            {error && <div className="auth-error">{error}</div>}
            
            <form onSubmit={handleBooking}>
              <div className="form-group">
                <h4 style={{ marginBottom: '15px' }}>Date Selection</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="form-label">Check-in Date</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      required 
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">Check-out Date</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      required 
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '30px', paddingTop: '30px', borderTop: '1px solid var(--border-color)' }}>
                <h4 style={{ marginBottom: '15px' }}>Payment Details</h4>
                <p className="text-muted flex items-center gap-1" style={{ marginBottom: '20px' }}>
                  <Info size={16} /> Payment will be handled via secure gateway on the next step.
                </p>
                <div className="flex justify-between items-center" style={{ padding: '15px', background: 'var(--bg-light)', borderRadius: 'var(--border-radius-md)' }}>
                  <span className="font-bold">Total Amount:</span>
                  <span className="font-bold text-primary text-xl">${totalPrice || room.price}</span>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '20px' }}
                disabled={bookingLoading}
              >
                {bookingLoading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>

        {/* Room Summary Sidebar */}
        <div>
          <h3>Booking Summary</h3>
          <div className="card" style={{ marginTop: '20px' }}>
            {room.image && (
              <img src={room.image} alt={room.room_type} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            )}
            <div style={{ padding: '20px' }}>
              <div className="font-bold" style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{room.room_type}</div>
              <p className="text-muted" style={{ paddingBottom: '15px', borderBottom: '1px solid var(--border-color)', marginBottom: '15px' }}>
                Capacity: {room.capacity} Guests
              </p>
              
              <div className="flex justify-between" style={{ marginBottom: '10px' }}>
                <span className="text-muted">Price per night</span>
                <span>${room.price}</span>
              </div>
              
              {checkIn && checkOut && (
                <div className="flex justify-between" style={{ marginBottom: '10px' }}>
                  <span className="text-muted">Stay</span>
                  <span>{Math.ceil(Math.abs(new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))} nights</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Booking;
