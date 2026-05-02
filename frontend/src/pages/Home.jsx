import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, Heart, Star, ChevronRight, ChevronLeft, MapPin } from 'lucide-react';
import { mockHotels } from '../mockData';
import HotelCard from '../components/HotelCard';
import HeroSlider from '../components/HeroSlider';
import TripPlanner from '../components/TripPlanner';
import './Home.css';

const destinationsIndia = [
  { name: 'Bangalore', acc: '5,372', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=800&auto=format&fit=crop' },
  { name: 'Mumbai', acc: '4,177', img: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=800&auto=format&fit=crop' },
  { name: 'Hyderabad', acc: '2,735', img: 'https://images.unsplash.com/photo-1597576579603-9118c44566f1?q=80&w=800&auto=format&fit=crop' },
  { name: 'New Delhi', acc: '12,786', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800&auto=format&fit=crop' },
  { name: 'Goa', acc: '9,254', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop' }
];

const destinationsOutside = [
  { name: 'Dubai', acc: '8,432', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop' },
  { name: 'Maldives', acc: '1,205', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800&auto=format&fit=crop' },
  { name: 'Paris', acc: '14,230', img: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=800&auto=format&fit=crop' },
  { name: 'New York', acc: '15,600', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800&auto=format&fit=crop' },
  { name: 'Bali', acc: '6,450', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop' }
];

const reviews = [
  { name: "Sarah & James", loc: "New York, USA", text: "The Emerald Forest Retreat was life-changing. Yathraa made the booking process incredibly smooth." },
  { name: "Elena Rodriguez", loc: "Madrid, Spain", text: "Our honeymoon in the Maldives exceeded all expectations. The overwater villa matched the photos perfectly." },
  { name: "Michael Tanaka", loc: "Tokyo, Japan", text: "Finding an eco-friendly luxury resort in the Swiss Alps felt impossible until we used Yathraa." },
  { name: "The Patel Family", loc: "London, UK", text: "Exceptional service from start to finish. The family suite we booked in Bali was absolutely stunning." },
  { name: "David Chen", loc: "Sydney, Australia", text: "I travel for business constantly. The premium hotels on Yathraa provide the exact level of comfort and luxury I need." },
  { name: "Anna & Lars", loc: "Oslo, Norway", text: "We found our dream cabin in the mountains through this platform. The whole experience was seamless and highly professional." }
];

const DestinationRow = ({ title, destinations }) => {
  const scrollRef = useRef(null);
  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'L' ? -320 : 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="destination-section fade-up">
      <div className="flex justify-between items-end mb-6">
        <h3 className="section-subtitle mb-0">{title}</h3>
        <div className="flex gap-3">
          <button className="btn-icon" onClick={() => scroll('L')}><ChevronLeft size={20} /></button>
          <button className="btn-icon" onClick={() => scroll('R')}><ChevronRight size={20} /></button>
        </div>
      </div>
      <div className="destination-scroll-container hide-scrollbar" ref={scrollRef}>
        {destinations.map((dest, i) => (
          <Link key={i} to={`/hotels?location=${dest.name}`} className="destination-card group" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="dest-img-wrap">
              <img src={dest.img} alt={dest.name} onError={(e) => { e.target.src = `https://picsum.photos/seed/${dest.name}/800/600`; }} />
            </div>
            <div className="dest-text">
              <h4 className="font-bold text-lg mb-1">{dest.name}</h4>
              <p className="text-muted text-sm">{dest.acc} accommodations</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const API = 'http://127.0.0.1:8000';

const Home = () => {
  const [displayHotels, setDisplayHotels] = useState([]);

  useEffect(() => {
    // Fetch live hotels from API, fall back to mock
    const loadHotels = async () => {
      try {
        const res = await fetch(`${API}/api/v1/hotels/`);
        if (res.ok) {
          const data = await res.json();
          const normalized = data.map(h => ({
            ...h,
            image: h.image
              ? (h.image.startsWith('http') ? h.image : `${API}${h.image}`)
              : (h.image_url || null),
            amenities: {
              wifi:      h.wifi      ?? false,
              pool:      h.pool      ?? false,
              parking:   h.parking   ?? false,
              breakfast: h.breakfast ?? false,
              ac:        h.ac        ?? false,
            },
          }));
          setDisplayHotels(normalized.slice(0, 6));
        } else {
          setDisplayHotels(mockHotels.slice(0, 6));
        }
      } catch {
        setDisplayHotels(mockHotels.slice(0, 6));
      }
    };
    loadHotels();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('fade-up-active');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);




  return (
    <main className="home-page">
      <HeroSlider />

      <section className="section bg-pure">
        <div className="container">
          <div className="section-title fade-up">
            <h2>Explore Destinations.</h2>
            <p>Find luxury accommodations tailored to breathtaking locations globally.</p>
          </div>
          <DestinationRow title="Top destinations in India" destinations={destinationsIndia} />
          <DestinationRow title="Top destinations outside India" destinations={destinationsOutside} />
        </div>
      </section>

      <TripPlanner />

      <section className="section bg-soft">
        <div className="container">
          <div className="section-title fade-up">
            <h2>Featured Stays.</h2>
            <p>Handpicked luxury accommodations for the conscious traveler.</p>
          </div>
          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {displayHotels.map(hotel => <HotelCard key={hotel.id} hotel={hotel} />)}
          </div>
          <div className="fade-up" style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/hotels" className="btn btn-primary">View All Properties</Link>
          </div>
        </div>
      </section>

      <section className="section pattern-bg">
        <div className="container">
          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '4.5rem', lineHeight: '1.1', marginBottom: '24px', fontWeight: 600 }}>Travel With<br />Purpose.</h2>
              <p className="text-muted text-lg mb-10 max-w-md">We partner with properties that maintain the highest standards of luxury while preserving their surroundings.</p>
              <div className="space-y-8">
                {[
                  { icon: Leaf, title: "Eco-Conscious Curation", text: "Every resort is vetted for sustainability and minimal impact." },
                  { icon: ShieldCheck, title: "Best Rate Guarantee", text: "Enjoy exclusive perks and the guaranteed best available rates." },
                  { icon: Heart, title: "Unmatched Service", text: "Experience 24/7 dedicated concierge service unconditionally." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="icon-box"><item.icon size={24} /></div>
                    <div>
                      <h4 className="text-xl mb-1">{item.title}</h4>
                      <p className="text-muted">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="image-collage">
              <img 
                src="https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?q=80&w=2000&auto=format&fit=crop" 
                alt="Desert" 
                className="collage-img-1" 
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800'; }}
              />
              <img 
                src="https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?q=80&w=1974&auto=format&fit=crop" 
                alt="Ocean" 
                className="collage-img-2" 
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800'; }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-soft">
        <div className="container">
          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'end', marginBottom: '48px' }}>
            <div></div> {/* Empty spacer to balance the grid */}
            <div className="section-title" style={{ marginBottom: 0, textAlign: 'center' }}>
              <h2 style={{ marginBottom: '12px', fontSize: '3.5rem' }}>Guest Stories.</h2>
              <p style={{ margin: 0, fontSize: '1.1rem' }}>Hear from travelers who have experienced the Yathraa difference.</p>
            </div>
            <div className="flex gap-3" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn-icon" style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.3s' }} 
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                onClick={() => {
                const scrollRef = document.getElementById('reviews-scroll');
                if (scrollRef) scrollRef.scrollBy({ left: -380, behavior: 'smooth' });
              }}><ChevronLeft size={24} color="var(--primary-dark)" /></button>
              <button className="btn-icon" style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }} 
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                onClick={() => {
                const scrollRef = document.getElementById('reviews-scroll');
                if (scrollRef) scrollRef.scrollBy({ left: 380, behavior: 'smooth' });
              }}><ChevronRight size={24} color="white" /></button>
            </div>
          </div>
          <div id="reviews-scroll" className="hide-scrollbar fade-up" style={{ display: 'flex', overflowX: 'auto', gap: '24px', paddingBottom: '20px', scrollSnapType: 'x mandatory' }}>
            {reviews.map((rev, i) => (
              <div key={i} className="glass card text-center testimonial-card" style={{ minWidth: '350px', maxWidth: '350px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', scrollSnapAlign: 'start', flexShrink: 0, transition: 'transform 0.3s ease', cursor: 'pointer' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="flex justify-center text-primary mb-6 gap-1" style={{ display: 'flex', gap: '4px' }}>
                  {[...Array(5)].map((_, idx) => <Star key={idx} size={18} fill="var(--primary)" />)}
                </div>
                <p className="text-muted italic mb-6" style={{ minHeight: '80px', fontSize: '1.05rem', lineHeight: 1.6 }}>"{rev.text}"</p>
                <h4 className="font-bold text-lg mb-1">{rev.name}</h4>
                <p className="text-sm text-primary font-medium tracking-wide uppercase">{rev.loc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
