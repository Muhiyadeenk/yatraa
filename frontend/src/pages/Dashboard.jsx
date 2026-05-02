import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Calendar, CreditCard, LogOut, Settings, Heart, MapPin, Star, User, Bell, Shield, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('reservations');
  const [wishlistCount, setWishlistCount] = useState(0);

  // Force re-render when wishlist changes
  React.useEffect(() => {
    const handleUpdate = () => setWishlistCount(prev => prev + 1);
    window.addEventListener('wishlistUpdated', handleUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleUpdate);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };



  const safeParseBookings = () => {
    try {
      const data = localStorage.getItem('yathraa_bookings');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const [localBookings, setLocalBookings] = useState(safeParseBookings());
  const validBookings = Array.isArray(localBookings) ? localBookings.filter(b => b && typeof b === 'object') : [];
  const isAdmin = user?.is_staff || user?.username === 'admin';
  const userBookings = isAdmin ? validBookings : validBookings.filter(b => b.user_email === user?.email);

  if (!user) return <div className="container section text-center"><h2>Please log in to view your dashboard.</h2></div>;

  const removeBooking = (id) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      const updatedBookings = localBookings.filter(b => b.id !== id);
      localStorage.setItem('yathraa_bookings', JSON.stringify(updatedBookings));
      setLocalBookings(updatedBookings);
    }
  };

  const payBooking = (id) => {
    const updatedBookings = localBookings.map(b => {
      if (b.id === id) return { ...b, status: 'Confirmed' };
      return b;
    });
    localStorage.setItem('yathraa_bookings', JSON.stringify(updatedBookings));
    setLocalBookings(updatedBookings);
    alert("Payment successful! Your reservation is now Confirmed.");
  };

  const localWishlist = JSON.parse(localStorage.getItem('yathraa_wishlist')) || [];
  const wishlistedHotels = localWishlist.filter(w => w.user_email === user.email);

  return (
    <div className="dashboard-wrapper bg-soft min-h-screen">
      <div className="container pt-10 pb-20">
        
        {/* Modern Header Banner */}
        <div className="dashboard-header glass mb-10 flex justify-between items-center animate-fade-in" style={{ padding: '32px 40px' }}>
          <div className="flex items-center gap-6">
            <div className="dashboard-avatar" style={{ width: '70px', height: '70px', fontSize: '1.75rem' }}>
              {user.first_name[0]}{user.last_name[0]}
            </div>
            <div>
              <h1 className="text-3xl m-0 font-serif" style={{ letterSpacing: '-0.01em' }}>Welcome back, {user.first_name}!</h1>
              <p className="text-muted m-0 mt-1 text-base">Manage your luxury stays and account preferences.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="stat-box text-center" style={{ minWidth: '80px' }}>
              <span className="block text-2xl font-bold text-primary">{userBookings.length}</span>
              <span className="text-[10px] text-muted uppercase tracking-wider font-bold">Stays</span>
            </div>
            <div className="stat-box text-center border-l pl-4" style={{ minWidth: '80px' }}>
              <span className="block text-2xl font-bold text-primary">{wishlistedHotels.length}</span>
              <span className="text-[10px] text-muted uppercase tracking-wider font-bold">Liked</span>
            </div>
          </div>
        </div>

        <div className="grid gap-8" style={{ gridTemplateColumns: '280px 1fr' }}>
          
          {/* Sidebar Nav */}
          <aside className="animate-slide-in">
            <div className="glass p-4 rounded-2xl sticky top-24">
              <nav className="dashboard-nav">
                <button 
                  className={`nav-item ${activeTab === 'reservations' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reservations')}
                >
                  <Calendar size={20} /> My Reservations
                </button>
                <button 
                  className={`nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
                  onClick={() => setActiveTab('wishlist')}
                >
                  <Heart size={20} /> Wishlist
                </button>
                <button 
                  className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings size={20} /> Account Settings
                </button>
                {(user.is_staff || user.username === 'admin') && (
                  <button onClick={() => navigate('/admin-panel')} className="nav-item special-nav" style={{ color: 'var(--primary-dark)', fontWeight: 'bold', background: 'rgba(16, 185, 129, 0.1)' }}>
                    <Shield size={20} /> Admin Panel
                  </button>
                )}
                <div className="mt-8 pt-4 border-t">
                  <button onClick={handleLogout} className="nav-item text-red-500 hover:bg-red-50">
                    <LogOut size={20} /> Sign Out
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="dashboard-main animate-fade-in-up">
            
            {activeTab === 'reservations' && (
              <section>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-serif m-0 text-2xl">Booking History</h2>
                  <button onClick={() => navigate('/hotels')} className="btn btn-outline" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>+ New Booking</button>
                </div>
                
                {userBookings.length > 0 ? (
                  <div className="grid gap-4">
                    {userBookings.map(booking => (
                      <div key={booking.id} className="booking-card glass" style={{ padding: '24px', marginBottom: '16px' }}>
                        <div className="flex justify-between items-center">
                          <div>
                            <div style={{ marginBottom: '12px' }}>
                              <span className={`status-pill ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : ''}`} style={{ backgroundColor: booking.status === 'Confirmed' ? '#dcfce7' : '', color: booking.status === 'Confirmed' ? '#166534' : '' }}>
                                {booking.status}
                              </span>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', margin: '0 0 4px 0' }}>{booking.hotel_name}</h3>
                            <p className="text-primary font-bold" style={{ fontSize: '0.875rem', margin: '0 0 16px 0' }}>{booking.room_type}</p>
                            
                            <div className="flex text-muted" style={{ fontSize: '0.875rem', gap: '24px' }}>
                              <div className="flex items-center gap-2"><Calendar size={16} /> {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}</div>
                              <div className="flex items-center gap-2"><CreditCard size={16} /> Total: ₹{booking.total_price}</div>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
                            {booking.status === 'Pending' ? (
                              <>
                                <button onClick={() => payBooking(booking.id)} className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>Pay Now</button>
                                <button onClick={() => removeBooking(booking.id)} className="btn btn-outline" style={{ padding: '8px 20px', fontSize: '0.85rem', borderColor: '#ef4444', color: '#ef4444' }}>Cancel Booking</button>
                              </>
                            ) : (
                              <button className="btn-icon-round" style={{ flexShrink: 0 }}><ChevronRight size={20}/></button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state card glass text-center" style={{ padding: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(145deg, #ffffff, #f0fdf4)', border: '2px dashed var(--primary-light)' }}>
                    <div className="empty-icon bg-soft" style={{ marginBottom: '24px', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#dcfce7', color: 'var(--primary-dark)' }}>
                      <Calendar size={40} />
                    </div>
                    <h3 className="text-2xl font-serif mb-2" style={{ color: 'var(--primary-dark)' }}>Your Journey Awaits</h3>
                    <p className="text-muted mb-8" style={{ maxWidth: '400px', lineHeight: 1.6 }}>You haven't made any reservations yet. The world is full of beautiful luxury resorts waiting to be discovered.</p>
                    <button onClick={() => navigate('/hotels')} className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)' }}>Start Exploring</button>
                  </div>
                )}
              </section>
            )}

            {activeTab === 'wishlist' && (
              <section>
                <h2 className="font-serif mb-6">Your Favorites</h2>
                {wishlistedHotels.length > 0 ? (
                  <div className="grid grid-cols-2 gap-6">
                    {wishlistedHotels.map(hotel => (
                      <div key={hotel.id} className="wishlist-card glass overflow-hidden group">
                        <div className="wishlist-img-wrap">
                          <img src={hotel.image} alt={hotel.name} />
                          <button className="wishlist-btn"><Heart size={20} fill="var(--primary)"/></button>
                        </div>
                        <div className="p-6">
                           <h3 className="mb-2">{hotel.name}</h3>
                           <p className="text-muted text-sm flex items-center gap-2 mb-6"><MapPin size={16}/> {hotel.location}</p>
                           <button onClick={() => navigate(`/hotels/${hotel.id}`)} className="btn btn-outline w-full">View Details</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state card glass text-center" style={{ padding: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(145deg, #ffffff, #fdf2f8)', border: '2px dashed #fbcfe8' }}>
                    <div className="empty-icon" style={{ marginBottom: '24px', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fce7f3', color: '#db2777' }}>
                      <Heart size={40} />
                    </div>
                    <h3 className="text-2xl font-serif mb-2" style={{ color: '#9d174d' }}>Your Wishlist is Empty</h3>
                    <p className="text-muted mb-8" style={{ maxWidth: '400px', lineHeight: 1.6 }}>You haven't saved any properties yet. Tap the heart icon on any resort to save it here for later.</p>
                    <button onClick={() => navigate('/hotels')} className="btn" style={{ background: '#db2777', color: 'white', padding: '14px 32px', fontSize: '1.05rem', boxShadow: '0 8px 20px rgba(219, 39, 119, 0.3)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Find Inspiration</button>
                  </div>
                )}
              </section>
            )}

            {activeTab === 'settings' && (
              <section>
                <h2 className="font-serif mb-6" style={{ marginBottom: '24px' }}>Account Settings</h2>
                <div className="glass rounded-2xl" style={{ padding: '32px' }}>
                  <div className="settings-grid">
                    <div className="settings-group" style={{ marginBottom: '40px' }}>
                      <h4 className="flex items-center gap-2" style={{ marginBottom: '16px' }}><User size={18} className="text-primary"/> Personal Information</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div className="form-group">
                          <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>First Name</label>
                          <input type="text" className="form-input" defaultValue={user.first_name} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Last Name</label>
                          <input type="text" className="form-input" defaultValue={user.last_name} />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                          <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Email Address</label>
                          <input type="email" className="form-input" defaultValue={user.email} disabled />
                        </div>
                      </div>
                    </div>

                    <div className="settings-group">
                      <h4 className="flex items-center gap-2" style={{ marginBottom: '16px' }}><Bell size={18} className="text-primary"/> Notifications</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                          <input type="checkbox" defaultChecked />
                          <span>Email notifications for bookings</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                          <input type="checkbox" defaultChecked />
                          <span>Special offers and luxury deals</span>
                        </label>
                      </div>
                    </div>

                    <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e8ecf0', display: 'flex' }}>
                      <button className="btn btn-primary" style={{ padding: '12px 28px' }}>Save Changes</button>
                    </div>
                  </div>
                </div>
              </section>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
