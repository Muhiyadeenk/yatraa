import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

const bgImages = [
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2025&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop'
];

const destinations = [
  { name: 'Bangalore', icon: '🇮🇳' },
  { name: 'Mumbai', icon: '🇮🇳' },
  { name: 'Hyderabad', icon: '🇮🇳' },
  { name: 'New Delhi', icon: '🇮🇳' },
  { name: 'Goa', icon: '🇮🇳' },
  { name: 'Dubai', icon: '🇦🇪' },
  { name: 'Maldives', icon: '🇲🇻' },
  { name: 'Paris', icon: '🇫🇷' },
  { name: 'New York', icon: '🇺🇸' },
  { name: 'Bali', icon: '🇮🇩' }
];

const HeroSlider = () => {
  const [currentBg, setCurrentBg] = useState(0);
  const [destination, setDestination] = useState('');
  const [guests, setGuests] = useState({ adults: 2, children: 0 });
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const navigate = useNavigate();

  const getDaysInMonth = () => {
    const days = [];
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const startDay = currentMonth.getDay();
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    const dateParam = selectedDate ? `&date=${selectedDate.toISOString().split('T')[0]}` : '';
    const q = `location=${destination}&adults=${guests.adults}&children=${guests.children}${dateParam}`;
    navigate(`/hotels?${q}`);
  };

  const updateGuests = (type, delta) => {
    setGuests(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta)
    }));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <section className="hero">
      {bgImages.map((img, index) => (
        <div
          key={index}
          className={`hero-bg ${index === currentBg ? 'active' : ''}`}
          style={{ 
            backgroundImage: `url(${img})`,
            backgroundColor: '#000' // Black fallback
          }}
        />
      ))}
      
      <div className="hero-content">
        <h1>Stay Where Luxury Meets Nature.</h1>
        <p>Discover world-class eco-resorts and premium stays tucked away in nature's most stunning landscapes.</p>

        <div className="search-bar glass">
          <div 
            className="search-field" 
            onMouseEnter={() => setActiveDropdown('dest')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <MapPin size={24} className="text-primary" />
            <div>
              <label>DESTINATION</label>
              <input 
                type="text" 
                placeholder="Where to next?" 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                autoComplete="off"
              />
              {activeDropdown === 'dest' && (
                <div className="search-dropdown glass fade-in">
                  <div className="dropdown-header">Top Destinations</div>
                  <div className="dest-grid-container">
                    {destinations.map((dest, i) => (
                      <div key={i} className="dropdown-item" onClick={() => {setDestination(dest.name); setActiveDropdown(null);}}>
                        <span className="dest-icon">{dest.icon}</span>
                        <span className="dest-name">{dest.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="search-divider"></div>
          
          <div 
            className="search-field"
            onMouseEnter={() => setActiveDropdown('date')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Calendar size={24} className="text-primary" />
            <div>
              <label>DATE</label>
              <input 
                type="text" 
                readOnly
                placeholder="Select Date"
                value={selectedDate ? `${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}` : ''}
              />
              {activeDropdown === 'date' && (
                <div className="search-dropdown date-dropdown glass fade-in">
                  <div className="calendar-header">
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}>&lt;</button>
                    <span>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}>&gt;</button>
                  </div>
                  <div className="calendar-grid days-header">
                    {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d}>{d}</div>)}
                  </div>
                  <div className="calendar-grid">
                    {(() => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return getDaysInMonth().map((d, i) => {
                        let isPast = false;
                        if (d) {
                          const iterDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
                          isPast = iterDate < today;
                        }
                        return (
                          <div 
                            key={i} 
                            className={`calendar-cell ${d ? 'active-day' : 'empty'} ${isPast ? 'past-date' : ''} ${selectedDate && selectedDate.getDate() === d && selectedDate.getMonth() === currentMonth.getMonth() && selectedDate.getFullYear() === currentMonth.getFullYear() ? 'selected' : ''}`}
                            onClick={() => {
                              if (d && !isPast) {
                                setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d));
                                setActiveDropdown(null);
                              }
                            }}
                          >
                            {d || ''}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="search-divider"></div>
          
          <div 
            className="search-field"
            onMouseEnter={() => setActiveDropdown('guests')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Users size={24} className="text-primary" />
            <div>
              <label>GUESTS</label>
              <div className="guests-display-text" style={{whiteSpace: 'nowrap'}}>{guests.adults} Adults, {guests.children} Kids</div>
              {activeDropdown === 'guests' && (
                <div className="guests-dropdown glass fade-in">
                  <div className="counter-row">
                    <div className="counter-info">
                      <span className="label">Adults</span>
                      <span className="sub">Ages 13+</span>
                    </div>
                    <div className="counter-controls">
                      <button onClick={() => updateGuests('adults', -1)}>-</button>
                      <span>{guests.adults}</span>
                      <button onClick={() => updateGuests('adults', 1)}>+</button>
                    </div>
                  </div>
                  <div className="counter-row">
                    <div className="counter-info">
                      <span className="label">Children</span>
                      <span className="sub">Ages 2-12</span>
                    </div>
                    <div className="counter-controls">
                      <button onClick={() => updateGuests('children', -1)}>-</button>
                      <span>{guests.children}</span>
                      <button onClick={() => updateGuests('children', 1)}>+</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <button className="btn btn-primary search-btn" onClick={handleSearch}>
            <Search size={22} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
