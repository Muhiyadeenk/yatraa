import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, Wifi, Coffee, Car, Wind, Check, Heart, User, Calendar, X, ShieldCheck, Lock } from 'lucide-react';
import PayPalPayment from '../components/PayPalPayment';
import { AuthContext } from '../context/AuthContext';
import { mockHotels } from '../mockData';
import './HotelDetail.css';

const HotelDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  
  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];
  
  // Fake booking state
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [bookingId, setBookingId] = useState(null);

  // Calendar month navigation
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const prevMonth = () => setCalendarMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  const nextMonth = () => setCalendarMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1));

  const API = 'http://127.0.0.1:8000';

  useEffect(() => {
    const loadHotel = async () => {
      // Try real API first
      try {
        const res = await fetch(`${API}/api/v1/hotels/${id}/`);
        if (res.ok) {
          const data = await res.json();
          // Normalise shape so the rest of the page works
          const normalised = {
            ...data,
            // Resolve image URL
            image: data.image
              ? (data.image.startsWith('http') ? data.image : `${API}${data.image}`)
              : (data.image_url || `https://picsum.photos/seed/${data.id}main/1000/600`),
            // Build images array for gallery
            images: data.images?.length
              ? data.images.map(img => img.startsWith('http') ? img : `${API}${img}`)
              : [
                  data.image ? (data.image.startsWith('http') ? data.image : `${API}${data.image}`) : (data.image_url || `https://picsum.photos/seed/${data.id}main/1000/600`),
                  data.image2 ? (data.image2.startsWith('http') ? data.image2 : `${API}${data.image2}`) : (data.image2_url || `https://picsum.photos/seed/${data.id}b/500/500`),
                  data.image3 ? (data.image3.startsWith('http') ? data.image3 : `${API}${data.image3}`) : (data.image3_url || `https://picsum.photos/seed/${data.id}c/500/500`),
                ],
            // Normalise amenities from flat API fields
            amenities: {
              wifi:      data.wifi      ?? false,
              pool:      data.pool      ?? false,
              parking:   data.parking   ?? false,
              breakfast: data.breakfast ?? false,
              ac:        data.ac        ?? false,
              spa:       data.spa       ?? false,
            },
            // Use backend rooms if available, otherwise fallback to mock
            rooms: data.rooms && data.rooms.length > 0
              ? data.rooms.map(r => ({
                  ...r,
                  // Convert boolean 'available' to number for frontend logic if needed
                  available: typeof r.available === 'boolean' ? (r.available ? 5 : 0) : r.available
                }))
              : [{ id: `${data.id}-mock`, room_type: 'Premium Suite', capacity: 2, price: data.price_per_night, available: 3 }],
            // Fill in missing fields
            rating:         data.rating         || 4.8,
            reviews_count:  data.reviews_count  || Math.floor(Math.random() * 200) + 50,
            address:        data.address        || data.location,
            description:    data.description    || 'A beautiful property offering premium amenities and unmatched comfort.',
            descriptionTitle: data.description_title || 'A Premium Experience',
          };
          setHotel(normalised);
          setBookingSuccess(false);
          return;
        }
      } catch (err) {
        // API unavailable — fall through to mock data
      }

      // Fallback: search mock data
      const foundHotel = mockHotels.find(h => h.id === Number(id));
      if (foundHotel) {
        if (!foundHotel.rooms) {
          foundHotel.rooms = [
            { id: `${foundHotel.id}-r1`, room_type: 'Premium Suite', capacity: 2, price: foundHotel.price_per_night, available: 3 }
          ];
        }
        if (!foundHotel.images) foundHotel.images = [foundHotel.image, foundHotel.image];
        if (!foundHotel.address) foundHotel.address = foundHotel.location;
        if (!foundHotel.description) foundHotel.description = 'A beautiful property offering premium amenities.';
        if (foundHotel.reviews_count === undefined) foundHotel.reviews_count = Math.floor(Math.random() * 50) + 10;
        setHotel(foundHotel);
      }
      setBookingSuccess(false);
    };

    loadHotel();
  }, [id]);

  const getSelectedDay = (dateStr) => {
    if (!dateStr) return null;
    return parseInt(dateStr.split('-')[2], 10);
  };
  
  const checkInDay = getSelectedDay(checkIn);
  const checkOutDay = getSelectedDay(checkOut);

  const handleDateClick = (day) => {
    const d = new Date();
    const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(dateString);
      setCheckOut('');
    } else if (checkIn && !checkOut) {
      if (new Date(dateString) > new Date(checkIn)) {
        setCheckOut(dateString);
      } else {
        setCheckIn(dateString);
      }
    }
  };

  const handleBooking = async () => {
    if (!user) {
      alert("Please login to reserve this property!");
      navigate('/login');
      return;
    }

    if (!selectedRoom) {
       alert("Please select a suite first before reserving!");
       return;
    }
    
    const room = selectedRoom;
    if (room.available < 1) {
       alert("Sorry, this suite is currently fully booked out for these dates.");
       return;
    }

    // Create Booking on Backend
    try {
      const token = localStorage.getItem('yathraa_token');

      // Extract real ID if it's a string like "1-r1"
      const realRoomId = typeof room.id === 'string' && room.id.includes('-') 
        ? parseInt(room.id.split('-')[0]) 
        : room.id;

      const res = await fetch(`${API}/api/v1/bookings/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          room: realRoomId,
          check_in: checkIn || today,
          check_out: checkOut || today,
        })
      });

      if (res.ok) {
        const data = await res.json();
        setBookingId(data.id);
        setShowPaymentModal(true);
      } else {
        const errData = await res.json();
        alert("Booking failed: " + JSON.stringify(errData));
      }
    } catch (err) {
      console.error(err);
      alert("Network error while creating booking.");
    }
  };

  const processPayment = async () => {
    setPaymentProcessing(true);
    
    try {
      const token = localStorage.getItem('yathraa_token');

      const res = await fetch(`${API}/api/v1/payments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          booking_id: bookingId,
          method: 'Card',
        })
      });

      if (res.ok) {
        // Success Sequence for demo card
        const room = selectedRoom;
        const newBooking = {
          id: bookingId,
          user_name: `${user.first_name} ${user.last_name}`,
          user_email: user.email,
          hotel_name: hotel.name,
          room_type: room.room_type,
          check_in: checkIn || "TBD",
          check_out: checkOut || "TBD",
          total_price: room.price,
          status: 'Paid',
          date: new Date().toISOString()
        };
        
        const existingBookings = JSON.parse(localStorage.getItem('yathraa_bookings')) || [];
        localStorage.setItem('yathraa_bookings', JSON.stringify([newBooking, ...existingBookings]));
        
        setPaymentProcessing(false);
        setBookingSuccess(true);
      } else {
        alert("Payment verification failed on backend.");
        setPaymentProcessing(false);
      }
    } catch (err) {
      console.error(err);
      alert("Network error during payment.");
      setPaymentProcessing(false);
    }
  };

  if (!hotel) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
      <div style={{ width: '40px', height: '40px', border: '4px solid #e8ecf0', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#64748b', fontSize: '1rem' }}>Loading property details…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div className="hotel-detail-page bg-soft">
      
      {/* Premium Image Gallery Collage */}
      <div className="gallery-header container pt-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="category-pill">{hotel.category}</span>
              <div className="flex items-center text-primary gap-1 ml-2">
                <Star size={18} fill="var(--primary)" />
                <span className="font-bold">{hotel.rating}</span>
                <span className="text-muted ml-1">({hotel.reviews_count} reviews)</span>
              </div>
            </div>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '5px' }}>{hotel.name}</h1>
            <p className="flex items-center gap-2 text-muted text-lg"><MapPin size={20}/> {hotel.address}</p>
          </div>
          <div className="flex gap-4">
            <button className="btn btn-outline flex items-center gap-2"><Heart size={18}/> Save to Wishlist</button>
          </div>
        </div>

        <div className="premium-gallery">
          <div className="main-image">
            <img 
              src={hotel.images[0]} 
              alt="Main" 
              onError={(e) => { e.target.src = `https://picsum.photos/seed/${hotel.id}main/1000/600`; }}
            />
          </div>
          <div className="side-images">
            {hotel.images.slice(1).map((img, i) => (
              <img 
                key={i} 
                src={img} 
                alt={`Gallery ${i}`} 
                onError={(e) => { e.target.src = `https://picsum.photos/seed/${hotel.id}sub${i}/500/500`; }}
              />
            ))}
            {hotel.images.length === 1 && (
               <img src={hotel.image} alt="Fallback" />
            )}
          </div>
        </div>
      </div>

      <div className="container section">
        <div className="layout-grid">
          
          {/* Main Info */}
          <div className="detail-main">
            <section className="info-section">
              <h2>{hotel.descriptionTitle || hotel.description_title || 'A Luxury Experience'}</h2>
              <p className="text-muted text-lg" style={{ lineHeight: '1.9' }}>{hotel.description}</p>
            </section>

            <section className="info-section">
              <h2>Premium Amenities</h2>
              <div className="grid grid-cols-2 gap-4">
                {hotel.amenities.wifi && <div className="amenity-item"><Wifi size={24} className="text-primary"/> <span>High-Speed WiFi</span></div>}
                {hotel.amenities.pool && <div className="amenity-item"><span style={{fontSize: '24px'}} className="text-primary">🏊</span> <span>Infinity Pool</span></div>}
                {hotel.amenities.parking && <div className="amenity-item"><Car size={24} className="text-primary"/> <span>Valet Parking</span></div>}
                {hotel.amenities.ac && <div className="amenity-item"><Wind size={24} className="text-primary"/> <span>Climate Control</span></div>}
                {hotel.amenities.spa && <div className="amenity-item"><span style={{fontSize: '24px'}} className="text-primary">🌸</span> <span>Holistic Wellness Spa</span></div>}
                {hotel.amenities.breakfast && <div className="amenity-item"><Coffee size={24} className="text-primary"/> <span>Organic Breakfast</span></div>}
              </div>
            </section>

            <section className="info-section">
              <h2>Select Your Suite</h2>
              <div className="rooms-grid">
                {hotel.rooms.map(room => (
                  <div key={room.id} className={`room-card glass ${selectedRoom?.id === room.id ? 'border-primary' : ''}`} style={{ borderColor: selectedRoom?.id === room.id ? 'var(--primary)' : '' }}>
                    <div>
                      <h3 className="mb-2">{room.room_type} {room.available <= 2 && <span className="text-sm border text-primary px-2 py-1 rounded ml-2" style={{ borderColor: 'var(--primary-light)' }}>Only {room.available} left</span>}</h3>
                      <p className="text-muted flex items-center gap-2 m-0"><User size={16}/> Up to {room.capacity} Guests</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-2xl text-primary">₹{room.price}</div>
                      <div className="text-muted text-sm mb-4">per night</div>
                      <div className="mb-2">
                        {room.available > 0 ? (
                          <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded">{room.available} rooms available</span>
                        ) : (
                          <span className="text-xs text-red-600 font-bold bg-red-50 px-2 py-1 rounded">Fully Booked</span>
                        )}
                      </div>
                      <button 
                         className={`btn ${selectedRoom?.id === room.id ? 'btn-primary' : 'btn-outline'}`} 
                         onClick={() => {
                           setSelectedRoom(room);
                           setGuests(room.capacity);
                         }}
                         disabled={room.available < 1}
                      >
                         {room.available < 1 ? 'Sold Out' : (selectedRoom?.id === room.id ? 'Selected' : 'Select')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="info-section">
              <div className="flex justify-between items-center mb-6">
                <h2 className="m-0">Check Availability</h2>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2"><span className="dot dot-available"></span> Available</div>
                  <div className="flex items-center gap-2"><span className="dot dot-booked"></span> Booked</div>
                </div>
              </div>
              <div className="custom-calendar-box">
                {/* Month Navigation Header */}
                <div className="cal-nav-header">
                  <button className="cal-nav-btn" onClick={prevMonth}>&#8249;</button>
                  <span className="cal-month-label">{monthNames[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}</span>
                  <button className="cal-nav-btn" onClick={nextMonth}>&#8250;</button>
                </div>
                <div className="calendar-grid">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="calendar-day-header">{day}</div>
                  ))}
                  {[...Array(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay())].map((_, i) => (
                    <div key={`empty-${i}`} className="calendar-day"></div>
                  ))}
                  {[...Array(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate())].map((_, i) => {
                    const day = i + 1;
                    const today = new Date();
                    today.setHours(0,0,0,0);
                    const thisDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
                    const isPast = thisDay < today;
                    const isAvailable = day % 4 !== 0;

                    return (
                      <div key={i} className={`calendar-day ${isPast ? 'past' : ''}`}>
                        <div
                          className={`day-circle ${!isPast && isAvailable ? 'available' : (isPast ? '' : 'booked')}`}
                          onClick={() => {
                            if (!isPast && isAvailable) {
                              const dateStr = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth()+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                              if (!checkIn || (checkIn && checkOut)) { setCheckIn(dateStr); setCheckOut(''); }
                              else if (dateStr > checkIn) { setCheckOut(dateStr); }
                              else { setCheckIn(dateStr); setCheckOut(''); }
                            }
                          }}
                          style={{ cursor: (!isPast && isAvailable) ? 'pointer' : 'default' }}
                        >
                          {day}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          {/* Sticky Booking Widget */}
          <div className="detail-sidebar">
            <div className="booking-widget glass">
              <div className="price-header flex items-end gap-2 mb-6 pb-6 border-b">
                <span className="text-4xl font-bold text-primary">₹{hotel.price_per_night}</span>
                <span className="text-muted mb-2">/ night</span>
              </div>
              
              <div className="booking-form">
                <div className="form-group mb-4 relative">
                  <Calendar size={18} className="absolute text-muted" style={{ top: '35px', left: '15px' }} />
                  <label className="form-label">Check-in</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    style={{ paddingLeft: '45px' }} 
                    value={checkIn} 
                    min={today}
                    onChange={e=>setCheckIn(e.target.value)} 
                  />
                </div>
                <div className="form-group mb-4 relative">
                  <Calendar size={18} className="absolute text-muted" style={{ top: '35px', left: '15px' }} />
                  <label className="form-label">Check-out</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    style={{ paddingLeft: '45px' }} 
                    value={checkOut} 
                    min={checkIn || today}
                    onChange={e=>setCheckOut(e.target.value)} 
                  />
                </div>

                <div className="form-group mb-6 relative">
                  <User size={18} className="absolute text-muted" style={{ top: '35px', left: '15px' }} />
                  <label className="form-label">Guests</label>
                  <select 
                    className="form-input" 
                    style={{ paddingLeft: '45px', appearance: 'auto' }} 
                    value={guests} 
                    onChange={e=>setGuests(Number(e.target.value))}
                  >
                    {[...Array(selectedRoom?.capacity || 4)].map((_, i) => (
                      <option key={i+1} value={i+1}>{i+1} {i+1 === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
                
                {bookingSuccess ? (
                   <div style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '16px', borderRadius: '8px', textAlign: 'center', marginBottom: '16px' }}>
                     <h3 className="font-bold mb-1 m-0">Booking Confirmed!</h3>
                     <p className="text-sm m-0">View your dashboard for details.</p>
                   </div>
                ) : (
                  <>
                    <button className="btn btn-primary w-full justify-center text-lg py-3" onClick={handleBooking}>
                      Reserve this Property
                    </button>
                    <p className="text-center text-muted text-sm mt-4">You won't be charged yet.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="payment-modal-overlay flex items-center justify-center">
          <div className="payment-modal-content p-0 overflow-hidden">
            {bookingSuccess ? (
              <div className="booking-success-box text-center" style={{ background: 'var(--primary-light)', padding: '60px 40px' }}>
                <div className="success-icon-wrap mb-6" style={{ background: 'var(--primary)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                  <Check size={40} color="white" />
                </div>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '24px', color: 'var(--primary-dark)', fontFamily: 'serif' }}>Booking Confirmed!</h2>
                <p style={{ fontSize: '1.2rem', color: 'var(--primary-dark)' }}>Your suite has been reserved and payment was successful. You can view it in your dashboard.</p>
                <button className="btn btn-primary mt-8 py-3 px-8 text-lg" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
              </div>
            ) : (
              <div className="payment-demo-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px', borderBottom: '1px solid #e2e8f0' }}>
                  <h2 className="m-0 text-2xl font-serif" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Complete Your Booking</h2>
                  <button onClick={() => setShowPaymentModal(false)} className="btn-icon rounded-full transition-colors" style={{ padding: '8px', cursor: 'pointer', background: 'transparent', border: 'none' }}><X size={20}/></button>
                </div>
                
                <div className="payment-modal-body">
                  <div className="booking-summary-box">
                    <h3 className="mb-4 text-xl font-bold text-gray-800" style={{ marginBottom: '16px' }}>{hotel.name}</h3>
                    <div className="grid grid-cols-2 mb-4" style={{ gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Room Type</div>
                        <div className="font-medium text-gray-700">{selectedRoom?.room_type}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Guests</div>
                        <div className="font-medium text-gray-700">{guests} Adults</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Check-in</div>
                        <div className="font-medium text-gray-700">{checkIn || 'TBD'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Check-out</div>
                        <div className="font-medium text-gray-700">{checkOut || 'TBD'}</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center font-bold text-2xl border-t border-dashed border-gray-300 pt-5 mt-2">
                      <span className="text-gray-600">Total Amount</span>
                      <span className="text-primary">₹{selectedRoom?.price}</span>
                    </div>
                  </div>
                  
                  <div className="payment-tabs" style={{ marginBottom: '32px' }}>
                    <div className="flex gap-4" style={{ gap: '16px', marginBottom: '24px' }}>
                      <button 
                        className={`payment-tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('card')}
                      >
                        <div className="tab-icon">💳</div>
                        <span>Credit/Debit Card</span>
                      </button>
                      <button 
                        className={`payment-tab-btn ${paymentMethod === 'paypal' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('paypal')}
                      >
                        <div className="tab-icon">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style={{ height: '16px' }} />
                        </div>
                        <span>PayPal</span>
                      </button>
                    </div>

                    {paymentMethod === 'card' ? (
                      <div className="card-payment-view animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="payment-methods" style={{ marginBottom: '32px' }}>
                          <h4 className="text-sm font-semibold uppercase tracking-widest" style={{ marginBottom: '12px', color: '#64748b' }}>Saved Card (Demo)</h4>
                          <div className="payment-card-demo">
                            <div className="flex items-center gap-4">
                              <div className="card-icon-wrapper">💳</div>
                              <div>
                                <div className="font-bold text-gray-800">Test Credit Card</div>
                                <div className="text-sm text-gray-500">**** **** **** 4242</div>
                              </div>
                            </div>
                            <div className="demo-ready-badge">Ready</div>
                          </div>
                        </div>
                        
                        <button 
                          className="btn btn-primary w-full text-xl flex justify-center items-center shadow-lg hover:shadow-emerald-200" 
                          style={{ padding: '16px', width: '100%', gap: '12px', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.2)' }}
                          onClick={processPayment}
                          disabled={paymentProcessing}
                        >
                          {paymentProcessing ? (
                            <><div className="loading-spinner"></div> Processing...</>
                          ) : (
                            `Pay ₹${selectedRoom?.price} (Demo)`
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="paypal-payment-view animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div style={{ marginBottom: '24px' }}>
                          <p className="flex items-center" style={{ gap: '8px', color: '#64748b', marginBottom: '16px' }}>
                            <ShieldCheck size={18} className="text-emerald-500" /> 
                            Pay securely with PayPal. Fast, easy and safe.
                          </p>
                          <PayPalPayment 
                            amount={selectedRoom?.price} 
                            bookingId={bookingId}
                            onSuccess={(txId) => {
                                setBookingSuccess(true);
                                // Update local storage too
                                const room = selectedRoom;
                                const newBooking = {
                                    id: bookingId,
                                    user_name: `${user.first_name} ${user.last_name}`,
                                    user_email: user.email,
                                    hotel_name: hotel.name,
                                    room_type: room.room_type,
                                    check_in: checkIn || "TBD",
                                    check_out: checkOut || "TBD",
                                    total_price: room.price,
                                    status: 'Paid',
                                    date: new Date().toISOString(),
                                    transaction_id: txId
                                };
                                const existingBookings = JSON.parse(localStorage.getItem('yathraa_bookings')) || [];
                                localStorage.setItem('yathraa_bookings', JSON.stringify([newBooking, ...existingBookings]));
                            }}
                            onError={() => alert('PayPal payment failed.')}
                            onCancel={() => console.log('Payment cancelled')}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="payment-footer">
                    <div className="flex items-center gap-2"><Lock size={14}/> SSL Encrypted</div>
                    <div className="flex items-center gap-2"><ShieldCheck size={14}/> Secure Checkout</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetail;
