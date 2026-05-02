import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { mockBookings, mockHotels, adminStats } from '../mockData';
import {
  LayoutDashboard, Hotel, Users, Calendar, MessageSquare,
  PlusCircle, ArrowLeft, Upload, X, ImagePlus, DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

const API = 'http://127.0.0.1:8000';

// ── Default form ──────────────────────────────────────────────────────────────
const defaultForm = {
  name: '', category: 'Resort', price_per_night: '',
  location: '', address: '', description: '',
  description_title: '', featured: false, rating: 0,
  is_available: true, total_rooms: 10, max_guests: 2,
  wifi: false, pool: false, parking: false, breakfast: false, ac: false,
};

// ── Status badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = { Confirmed: 'badge-green', Pending: 'badge-amber', Cancelled: 'badge-red' };
  return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>;
};

// ─────────────────────────────────────────────────────────────────────────────
const AdminPanel = () => {
  const { user, token } = useContext(AuthContext);
  const navigate        = useNavigate();
  const fileInputRef    = useRef(null);
  const fileInputRef2   = useRef(null);
  const fileInputRef3   = useRef(null);

  const [activeTab, setActiveTab] = useState('overview');
  const [hotels,    setHotels]    = useState([]);
  const [bookings,  setBookings]  = useState([]);
  const [contacts,  setContacts]  = useState([]);
  const [users,     setUsers]     = useState([]);
  const [loading,   setLoading]   = useState(false);

  // Form state
  const [showForm,  setShowForm]  = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form,      setForm]      = useState(defaultForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile2, setImageFile2] = useState(null);
  const [imagePreview2, setImagePreview2] = useState(null);
  const [imageFile3, setImageFile3] = useState(null);
  const [imagePreview3, setImagePreview3] = useState(null);
  const [saving,    setSaving]    = useState(false);

  // ── Auth guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user || (!user.is_staff && user.username !== 'admin')) {
      navigate('/dashboard');
    }
  }, [user]);

  // ── Load data on tab change ───────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      try {
        const res = await fetch(`${API}/api/v1/hotels/`);
        if (res.ok) setHotels(await res.json());
        else        setHotels(mockHotels);
      } catch { setHotels(mockHotels); }

      setBookings(JSON.parse(localStorage.getItem('yathraa_bookings')) || mockBookings);
      setContacts(JSON.parse(localStorage.getItem('yathraa_contacts')) || []);
      setUsers(
        JSON.parse(localStorage.getItem('yathraa_users')) ||
        [{ id: 1, username: 'admin', email: 'admin@yatraa.com', is_staff: true }]
      );
    } finally { setLoading(false); }
  };

  if (!user) return null;

  // ── Form helpers ─────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e, index = 1) => {
    const file = e.target.files[0];
    if (!file) return;
    if (index === 1) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else if (index === 2) {
      setImageFile2(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview2(reader.result);
      reader.readAsDataURL(file);
    } else if (index === 3) {
      setImageFile3(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview3(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (index = 1) => {
    if (index === 1) {
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else if (index === 2) {
      setImageFile2(null);
      setImagePreview2(null);
      if (fileInputRef2.current) fileInputRef2.current.value = '';
    } else if (index === 3) {
      setImageFile3(null);
      setImagePreview3(null);
      if (fileInputRef3.current) fileInputRef3.current.value = '';
    }
  };

  const clearAllImages = () => {
    clearImage(1);
    clearImage(2);
    clearImage(3);
  };

  const openAdd = () => {
    setForm(defaultForm);
    setEditingId(null);
    clearAllImages();
    setShowForm(true);
  };

  const openEdit = (hotel) => {
    setForm({ ...defaultForm, ...hotel });
    setEditingId(hotel.id);
    setImageFile(null);
    setImageFile2(null);
    setImageFile3(null);
    
    // Set previews for all three images
    setImagePreview(hotel.image ? (hotel.image.startsWith('http') ? hotel.image : `${API}${hotel.image}`) : null);
    setImagePreview2(hotel.image2 ? (hotel.image2.startsWith('http') ? hotel.image2 : `${API}${hotel.image2}`) : null);
    setImagePreview3(hotel.image3 ? (hotel.image3.startsWith('http') ? hotel.image3 : `${API}${hotel.image3}`) : null);
    
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(defaultForm);
    clearAllImages();
  };

  // ── Save hotel (supports image upload via FormData) ───────────────────────
  const saveHotel = async (e) => {
    e.preventDefault();
    setSaving(true);

    const url    = editingId ? `${API}/api/v1/hotels/${editingId}/` : `${API}/api/v1/hotels/`;
    const method = editingId ? 'PATCH' : 'POST';

    try {
      let res;

      if (imageFile || imageFile2 || imageFile3) {
        // Use FormData to send file + fields together
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => {
          // Exclude image strings when sending files to avoid "not a file" errors
          if (k !== 'image' && k !== 'image2' && k !== 'image3' && v !== null && v !== undefined) {
            fd.append(k, v);
          }
        });
        if (imageFile) fd.append('image', imageFile);
        if (imageFile2) fd.append('image2', imageFile2);
        if (imageFile3) fd.append('image3', imageFile3);

        res = await fetch(url, {
          method,
          headers: { Authorization: `Bearer ${token}` }, // No Content-Type — let browser set boundary
          body: fd,
        });
      } else {
        // No new image — send as JSON
        const payload = { ...form };
        // Don't overwrite existing images with string URLs
        delete payload.image;
        delete payload.image2;
        delete payload.image3;

        res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        cancelForm();
        loadData();
      } else {
        const err = await res.json();
        alert('Could not save: ' + JSON.stringify(err));
      }
    } catch (err) {
      alert('Network error — is the Django server running on port 8001?');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete hotel ──────────────────────────────────────────────────────────
  const deleteHotel = async (id) => {
    if (!window.confirm('Permanently delete this property?')) return;
    try {
      const res = await fetch(`${API}/api/v1/hotels/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) loadData();
      else alert('Delete failed — you may not have permission.');
    } catch { alert('Network error'); }
  };

  // ── Sidebar tabs ──────────────────────────────────────────────────────────
  const tabs = [
    { id: 'overview',   icon: LayoutDashboard, label: 'Overview'                                         },
    { id: 'properties', icon: Hotel,           label: 'Properties'                                       },
    { id: 'bookings',   icon: Calendar,        label: 'Reservations'                                     },
    { id: 'users',      icon: Users,           label: 'Accounts'                                         },
    { id: 'messages',   icon: MessageSquare,   label: `Messages${contacts.length ? ` (${contacts.length})` : ''}` },
  ];

  const titles = {
    overview:   { title: 'Overview',     sub: 'A snapshot of your platform activity.'        },
    properties: { title: 'Properties',   sub: 'Create, edit and manage hotel listings.'       },
    bookings:   { title: 'Reservations', sub: 'All guest bookings across every property.'     },
    users:      { title: 'Accounts',     sub: 'Registered users and admin accounts.'          },
    messages:   { title: 'Messages',     sub: 'Contact form submissions from visitors.'       },
  };
  const current = titles[activeTab];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="admin-layout">

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-card">
          <div className="admin-sidebar-header">
            <h3>Admin Panel</h3>
          </div>
          <nav className="admin-nav">
            {tabs.map(t => (
              <button
                key={t.id}
                className={`admin-nav-btn ${activeTab === t.id ? 'active' : ''}`}
                onClick={() => { setActiveTab(t.id); setShowForm(false); }}
              >
                <t.icon size={17} /> {t.label}
              </button>
            ))}
            <hr className="admin-nav-divider" />
            <button className="admin-nav-back" onClick={() => navigate('/')}>
              <ArrowLeft size={15} /> Back to Site
            </button>
          </nav>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main className="admin-main">

        {/* Page header */}
        <div className="admin-page-header">
          <div>
            <h1>{showForm && activeTab === 'properties' ? (editingId ? 'Edit Property' : 'Add New Property') : current.title}</h1>
            <p>{showForm && activeTab === 'properties' ? 'Fill in the details below and upload a cover image.' : current.sub}</p>
          </div>
          {activeTab === 'properties' && !showForm && (
            <button className="btn-admin-primary" onClick={openAdd}>
              <PlusCircle size={16} /> Add Property
            </button>
          )}
          {activeTab === 'properties' && showForm && (
            <button className="btn-admin-outline" onClick={cancelForm}>
              <X size={15} /> Cancel
            </button>
          )}
        </div>

        {loading && <div className="admin-loading">Loading data…</div>}

        {/* ──────────────────── OVERVIEW ──────────────────── */}
        {!loading && activeTab === 'overview' && (
          <>
            <div className="admin-stats-grid">
              {[
                { label: 'Properties',   value: hotels.length, icon: Hotel,       cls: 'green'  },
                { label: 'Reservations', value: bookings.length, icon: Calendar,    cls: 'blue'   },
                { label: 'Users',        value: users.length, icon: Users,       cls: 'purple' },
                { label: 'Revenue',      value: `₹ ${bookings.filter(b => b.status === 'Confirmed').reduce((acc, b) => acc + Number(b.total_price), 0).toLocaleString()}`, icon: DollarSign,  cls: 'amber'  },
              ].map((s, i) => (
                <div key={i} className="admin-stat-card">
                  <div className={`admin-stat-icon ${s.cls}`}><s.icon size={20} /></div>
                  <div>
                    <div className="admin-stat-value">{s.value}</div>
                    <div className="admin-stat-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="admin-panel-card">
              <div className="admin-panel-card-header"><h3>Recent Reservations</h3></div>
              {bookings.length === 0 ? (
                <div style={{ padding: '20px', color: '#64748b' }}>No recent reservations.</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Guest</th><th>Property</th><th>Amount</th><th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map(b => (
                      <tr key={b.id}>
                        <td className="td-name">
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>{b.user_name || 'Guest'}</span>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'normal' }}>{b.user_email || 'guest@example.com'}</span>
                          </div>
                        </td>
                        <td>{b.hotel_name}</td>
                        <td className="td-price">₹{Number(b.total_price).toLocaleString()}</td>
                        <td><StatusBadge status={b.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* ──────────────────── PROPERTIES ──────────────────── */}
        {!loading && activeTab === 'properties' && (
          showForm ? (
            /* ── ADD / EDIT FORM ─────────────────────────────────── */
            <div className="admin-panel-card">
              <form onSubmit={saveHotel} className="admin-form">
                <div className="admin-form-grid">

                  {/* ── Image Uploads ── */}
                  <div className="admin-form-group full-width">
                    <label className="admin-form-label">Property Gallery (Upload up to 3 images)</label>
                    <div className="admin-gallery-uploads">
                      
                      {/* Image 1 (Cover) */}
                      <div className="admin-img-upload-wrapper">
                        <span className="admin-img-label">Cover Image</span>
                        <div className="admin-img-upload-zone small" onClick={() => fileInputRef.current?.click()}>
                          {imagePreview ? (
                            <div className="admin-img-preview-wrap">
                              <img src={imagePreview} alt="Preview" className="admin-img-preview" />
                              <button type="button" className="admin-img-remove" onClick={(e) => { e.stopPropagation(); clearImage(1); }}>
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <div className="admin-img-placeholder">
                              <ImagePlus size={24} />
                              <span>Cover</span>
                            </div>
                          )}
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageChange(e, 1)} />
                      </div>

                      {/* Image 2 */}
                      <div className="admin-img-upload-wrapper">
                        <span className="admin-img-label">Gallery 1</span>
                        <div className="admin-img-upload-zone small" onClick={() => fileInputRef2.current?.click()}>
                          {imagePreview2 ? (
                            <div className="admin-img-preview-wrap">
                              <img src={imagePreview2} alt="Preview" className="admin-img-preview" />
                              <button type="button" className="admin-img-remove" onClick={(e) => { e.stopPropagation(); clearImage(2); }}>
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <div className="admin-img-placeholder">
                              <ImagePlus size={24} />
                              <span>Image 2</span>
                            </div>
                          )}
                        </div>
                        <input ref={fileInputRef2} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageChange(e, 2)} />
                      </div>

                      {/* Image 3 */}
                      <div className="admin-img-upload-wrapper">
                        <span className="admin-img-label">Gallery 2</span>
                        <div className="admin-img-upload-zone small" onClick={() => fileInputRef3.current?.click()}>
                          {imagePreview3 ? (
                            <div className="admin-img-preview-wrap">
                              <img src={imagePreview3} alt="Preview" className="admin-img-preview" />
                              <button type="button" className="admin-img-remove" onClick={(e) => { e.stopPropagation(); clearImage(3); }}>
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <div className="admin-img-placeholder">
                              <ImagePlus size={24} />
                              <span>Image 3</span>
                            </div>
                          )}
                        </div>
                        <input ref={fileInputRef3} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageChange(e, 3)} />
                      </div>

                    </div>
                  </div>

                  {/* Name */}
                  <div className="admin-form-group">
                    <label className="admin-form-label">Property Name *</label>
                    <input className="admin-form-input" type="text" name="name" required
                      value={form.name} onChange={handleChange} placeholder="e.g. Emerald Forest Retreat" />
                  </div>

                  {/* Category */}
                  <div className="admin-form-group">
                    <label className="admin-form-label">Category *</label>
                    <select className="admin-form-input" name="category" value={form.category} onChange={handleChange}>
                      <option value="Resort">Resort</option>
                      <option value="Hotel">Hotel</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div className="admin-form-group">
                    <label className="admin-form-label">Price per Night (₹) *</label>
                    <input className="admin-form-input" type="number" name="price_per_night" required min="0"
                      value={form.price_per_night} onChange={handleChange} placeholder="e.g. 26500" />
                  </div>

                  {/* Total Rooms */}
                  <div className="admin-form-group">
                    <label className="admin-form-label">Total Rooms Available *</label>
                    <input className="admin-form-input" type="number" name="total_rooms" required min="1"
                      value={form.total_rooms} onChange={handleChange} placeholder="e.g. 15" />
                  </div>

                  {/* Max Guests */}
                  <div className="admin-form-group">
                    <label className="admin-form-label">Max Guest Capacity *</label>
                    <input className="admin-form-input" type="number" name="max_guests" required min="1"
                      value={form.max_guests} onChange={handleChange} placeholder="e.g. 4" />
                  </div>

                  {/* Rating */}
                  <div className="admin-form-group">
                    <label className="admin-form-label">Rating (0-5) *</label>
                    <input className="admin-form-input" type="number" name="rating" required min="0" max="5" step="0.1"
                      value={form.rating} onChange={handleChange} placeholder="e.g. 4.5" />
                  </div>

                  {/* Availability Toggle */}
                  <div className="admin-form-group">
                    <label className="admin-form-label">Availability Status</label>
                    <label className="admin-featured-row" style={{ background: form.is_available ? '#f0fdf4' : '#fee2e2', borderColor: form.is_available ? '#bbf7d0' : '#fecaca', color: form.is_available ? '#166534' : '#991b1b' }}>
                      <input type="checkbox" name="is_available" checked={!!form.is_available} onChange={handleChange} />
                      {form.is_available ? '✔ Property is Open for Bookings' : '✖ Property is Currently Closed'}
                    </label>
                  </div>

                  {/* Location */}
                  <div className="admin-form-group">
                    <label className="admin-form-label">Location *</label>
                    <input className="admin-form-input" type="text" name="location" required
                      value={form.location} onChange={handleChange} placeholder="e.g. Ubud, Bali" />
                  </div>

                  {/* Address */}
                  <div className="admin-form-group full-width">
                    <label className="admin-form-label">Full Address</label>
                    <input className="admin-form-input" type="text" name="address"
                      value={form.address} onChange={handleChange} placeholder="Street, City, Postal Code" />
                  </div>

                  {/* Description Title */}
                  <div className="admin-form-group full-width">
                    <label className="admin-form-label">Description Heading</label>
                    <input className="admin-form-input" type="text" name="description_title"
                      value={form.description_title} onChange={handleChange}
                      placeholder="e.g. A Nature-Inspired Sanctuary" />
                  </div>

                  {/* Description */}
                  <div className="admin-form-group full-width">
                    <label className="admin-form-label">Full Description</label>
                    <textarea className="admin-form-input admin-form-textarea" name="description"
                      value={form.description} onChange={handleChange}
                      placeholder="Describe the property, its unique features, location highlights…" />
                  </div>

                  {/* Amenities */}
                  <div className="admin-form-group full-width">
                    <label className="admin-form-label">Amenities</label>
                    <div className="admin-amenities-row">
                      {[
                        { key: 'wifi',      label: '📶 Wi-Fi'     },
                        { key: 'pool',      label: '🏊 Pool'      },
                        { key: 'parking',   label: '🅿️ Parking'  },
                        { key: 'breakfast', label: '🍳 Breakfast' },
                        { key: 'ac',        label: '❄️ AC'        },
                      ].map(a => (
                        <label key={a.key} className="admin-amenity-label">
                          <input type="checkbox" name={a.key} checked={!!form[a.key]} onChange={handleChange} />
                          {a.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Featured */}
                  <div className="admin-form-group full-width">
                    <label className="admin-featured-row">
                      <input type="checkbox" name="featured" checked={!!form.featured} onChange={handleChange} />
                      ★ &nbsp; Show this property in <strong>"Featured Stays"</strong> on the homepage
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="admin-form-actions">
                    <button type="submit" className="btn-admin-primary" disabled={saving}>
                      {saving ? 'Saving…' : (editingId ? 'Save Changes' : 'Create Property')}
                    </button>
                    <button type="button" className="btn-admin-outline" onClick={cancelForm} disabled={saving}>
                      Cancel
                    </button>
                  </div>

                </div>
              </form>
            </div>
          ) : (
            /* ── PROPERTIES TABLE ────────────────────────────────── */
            <div className="admin-panel-card">
              {hotels.length === 0 ? (
                <div className="admin-empty">
                  <Hotel size={40} />
                  <p>No properties yet. Click "Add Property" to get started.</p>
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '52px' }}>Image</th>
                      <th>Name</th>
                      <th>Location</th>
                      <th>Category</th>
                      <th>Price / Night</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotels.map(h => {
                      const imgSrc = h.image
                        ? (h.image.startsWith('http') ? h.image : `${API}${h.image}`)
                        : null;
                      return (
                        <tr key={h.id}>
                          <td>
                            {imgSrc ? (
                              <img
                                src={imgSrc}
                                alt={h.name}
                                style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e8ecf0' }}
                              />
                            ) : (
                              <div style={{ width: '44px', height: '44px', background: '#f1f5f9', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Hotel size={18} color="#94a3b8" />
                              </div>
                            )}
                          </td>
                          <td className="td-name">{h.name}</td>
                          <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{h.location}</td>
                          <td><span className="badge badge-blue">{h.category}</span></td>
                          <td className="td-price">₹{Number(h.price_per_night).toLocaleString()}</td>
                          <td>
                            {h.featured
                              ? <span className="badge badge-amber">★ Featured</span>
                              : <span className="badge badge-gray">Standard</span>}
                          </td>
                          <td>
                            <div className="td-actions">
                              <button className="btn-action-edit"   onClick={() => openEdit(h)}>Edit</button>
                              <button className="btn-action-delete" onClick={() => deleteHotel(h.id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )
        )}

        {/* ──────────────────── BOOKINGS ──────────────────── */}
        {!loading && activeTab === 'bookings' && (
          <div className="admin-panel-card">
            {bookings.length === 0 ? (
              <div className="admin-empty"><Calendar size={40} /><p>No reservations found.</p></div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Account</th><th>Hotel</th><th>Room</th>
                    <th>Check-in</th><th>Check-out</th><th>Total</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>#{b.id}</td>
                      <td style={{ color: '#3b82f6', fontWeight: 500 }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span>{b.user_name || 'Guest'}</span>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'normal' }}>{b.user_email || 'guest@example.com'}</span>
                        </div>
                      </td>
                      <td className="td-name">{b.hotel_name}</td>
                      <td>{b.room_type}</td>
                      <td>{new Date(b.check_in).toLocaleDateString('en-IN',  { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td>{new Date(b.check_out).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="td-price">₹{Number(b.total_price).toLocaleString()}</td>
                      <td><StatusBadge status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>

              </table>
            )}
          </div>
        )}

        {/* ──────────────────── USERS ──────────────────── */}
        {!loading && activeTab === 'users' && (
          <div className="admin-panel-card">
            {users.length === 0 ? (
              <div className="admin-empty"><Users size={40} /><p>No users found.</p></div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr><th>Username</th><th>Email</th><th>Role</th></tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={i}>
                      <td className="td-name">{u.username}</td>
                      <td style={{ color: '#64748b' }}>{u.email}</td>
                      <td>
                        {u.is_staff
                          ? <span className="badge badge-green">Admin</span>
                          : <span className="badge badge-gray">Member</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ──────────────────── MESSAGES ──────────────────── */}
        {!loading && activeTab === 'messages' && (
          <div className="admin-panel-card">
            {contacts.length === 0 ? (
              <div className="admin-empty">
                <MessageSquare size={40} />
                <p>No messages yet. Contact form submissions will appear here.</p>
              </div>
            ) : (
              contacts.map((c, i) => (
                <div key={i} className="admin-message-card">
                  <div className="admin-message-meta">
                    <span className="admin-message-name">{c.firstName} {c.lastName}</span>
                    <span className="admin-message-email">{c.email}</span>
                  </div>
                  <div className="admin-message-body">{c.message}</div>
                </div>
              ))
            )}
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminPanel;
