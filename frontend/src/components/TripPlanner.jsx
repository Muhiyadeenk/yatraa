import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, Wallet, Navigation, CheckCircle2, ChevronRight, Hotel, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './TripPlanner.css';

const bgImages = [
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop', // Mountains
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop', // Yosemite
  'https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=2000&auto=format&fit=crop', // Forest
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2000&auto=format&fit=crop', // Lake
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop', // Sunbeams in forest
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2000&auto=format&fit=crop'  // Misty mountains
];

const TripPlanner = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 6000); // Crossfade every 6 seconds
    return () => clearInterval(timer);
  }, []);

  const [formData, setFormData] = useState({
    from: '',
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 2,
    budget: '',
    type: 'Family'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateTrip = (e) => {
    e.preventDefault();
    if (!formData.from || !formData.destination) {
        alert("Please enter from and destination locations.");
        return;
    }
    setLoading(true);
    setResult(null);

    // Dynamic generation logic
    setTimeout(() => {
      setLoading(false);
      
      const start = new Date(formData.startDate || Date.now());
      const end = new Date(formData.endDate || Date.now() + 86400000 * 3);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 3;
      
      const destination = formData.destination;
      const type = formData.type;
      
      // Generate dynamic plan based on days
      const plan = [];
      for (let i = 1; i <= diffDays; i++) {
        let activities = [];
        if (i === 1) {
          activities = [`Travel from ${formData.from} to ${destination}`, 'Check-in and relaxation', `Evening stroll at ${destination} local market`];
        } else if (i === diffDays) {
          activities = [`Early morning sunrise at ${destination} viewpoint`, 'Breakfast at a local cafe', `Return journey to ${formData.from}`];
        } else {
          if (type === 'Adventure') {
            activities = ['Trekking to nearby peak', 'Outdoor lunch session', 'Rock climbing or river rafting'];
          } else if (type === 'Romantic') {
            activities = ['Private boat ride or scenic walk', 'Gourmet lunch with a view', 'Couple spa or candlelight dinner'];
          } else if (type === 'Family') {
            activities = ['Visit to local museum or park', 'Family picnic', 'Cultural show or magic performance'];
          } else {
            activities = [`Explore hidden gems of ${destination}`, 'Photography tour', 'Taste local street food'];
          }
        }
        plan.push({ day: i, activities });
      }

      const hotelOptions = {
        Luxury: ['The Grand Palace', 'Imperial Residency', 'Royal Heritage'],
        Adventure: ['Basecamp Lodge', 'Trekker\'s Haven', 'The Peak Hotel'],
        Family: ['Green Valley Resort', 'Happy Family Inn', 'Nature Retreat'],
        Romantic: ['Sunset Villa', 'Lover\'s Lane Resort', 'Whispering Pines'],
      };

      const selectedHotels = hotelOptions[type] || hotelOptions['Family'];

      setResult({
        route: `${formData.from} → ${destination}`,
        duration: `${diffDays} Days / ${diffDays - 1} Nights`,
        budget: formData.budget || `₹${(diffDays * 4000 * formData.travelers).toLocaleString()}`,
        plan: plan,
        hotels: selectedHotels,
        tips: [
          'Carry comfortable walking shoes',
          'Keep your camera ready for scenic views',
          `Perfectly curated for your ${type} trip style`,
          'Check local weather forecasts before heading out'
        ]
      });
    }, 2000);
  };

  return (
    <section className="section trip-planner-section">
      {/* Changing Background Images */}
      {bgImages.map((img, index) => (
        <div 
          key={img} 
          className={`planner-bg-image ${index === bgIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}
      <div className="planner-bg-overlay"></div>

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="section-title text-center fade-up">
          <div className="ai-badge">
            <Sparkles size={16} /> AI Trip Planner
          </div>
          <h2>Plan Your Perfect Trip.</h2>
          <p>Choose your starting place, destination, travel dates, and let our intelligent engine craft the ultimate itinerary for you.</p>
        </div>

        <div className="planner-grid">
          {/* Left Side: Form */}
          <div className="planner-card glass fade-up">
            <div className="planner-card-header">
              <h3>Trip Details</h3>
              <p>Tell us about your upcoming journey</p>
            </div>
            
            <form onSubmit={generateTrip} className="planner-form">
              <div className="form-row">
                <div className="input-group">
                  <label><MapPin size={16} /> From</label>
                  <input type="text" name="from" placeholder="e.g. Bangalore" value={formData.from} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <label><Navigation size={16} /> Destination</label>
                  <input type="text" name="destination" placeholder="e.g. Munnar" value={formData.destination} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label><Calendar size={16} /> Start Date</label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <label><Calendar size={16} /> End Date</label>
                  <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label><Users size={16} /> Travelers</label>
                  <input type="number" min="1" name="travelers" value={formData.travelers} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label><Wallet size={16} /> Budget</label>
                  <input type="text" name="budget" placeholder="e.g. ₹15,000" value={formData.budget} onChange={handleChange} />
                </div>
              </div>

              <div className="input-group full-width">
                <label>Travel Type</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option>Family</option>
                  <option>Romantic</option>
                  <option>Adventure</option>
                  <option>Solo</option>
                  <option>Luxury</option>
                  <option>Business</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary generate-btn mt-6" disabled={loading}>
                {loading ? <><Loader2 className="animate-spin" /> Crafting Your Itinerary...</> : <><Sparkles size={20} /> Generate My Trip</>}
              </button>
            </form>
          </div>

          {/* Right Side: Result */}
          <div className="planner-result-card glass fade-up" style={{ transitionDelay: '0.2s' }}>
            {!loading && !result && (
              <div className="empty-state">
                <div className="empty-icon-wrap">
                  <Navigation size={48} />
                </div>
                <h3>Your Journey Awaits</h3>
                <p>Fill in the details and click generate to see your custom travel plan right here.</p>
              </div>
            )}

            {loading && (
              <div className="loading-state">
                <div className="radar-spinner"></div>
                <h3>Analyzing routes &amp; places...</h3>
                <p>Finding the best luxury stays for your {formData.type} trip.</p>
              </div>
            )}

            {result && (
              <div className="result-content animate-in fade-in slide-in-from-bottom-2">
                <div className="result-header">
                  <div className="route-badge">📍 {result.route}</div>
                  <div className="quick-stats">
                    <span><Calendar size={14} /> {result.duration}</span>
                    <span><Wallet size={14} /> Est. {result.budget}</span>
                  </div>
                </div>

                <div className="plan-section">
                  <h4>Recommended Plan</h4>
                  <div className="timeline">
                    {result.plan.map((p, idx) => (
                      <div key={idx} className="timeline-item">
                        <div className="timeline-day">Day {p.day}</div>
                        <ul className="timeline-activities">
                          {p.activities.map((act, i) => (
                            <li key={i}><CheckCircle2 size={14} /> {act}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="suggestions-row">
                  <div className="suggestion-box">
                    <h4><Hotel size={16} /> Suggested Hotels</h4>
                    <ul>
                      {result.hotels.map((h, i) => <li key={i}>{h}</li>)}
                    </ul>
                  </div>
                  <div className="suggestion-box">
                    <h4><Sparkles size={16} /> Travel Tips</h4>
                    <ul>
                      {result.tips.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="result-actions">
                  <button className="btn btn-outline flex-1">Save Plan</button>
                  <button className="btn btn-primary flex-1" onClick={() => navigate('/hotels')}>Book Hotels <ChevronRight size={18} /></button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TripPlanner;
