import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Heart } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './HotelCard.css';

/**
 * A reusable, premium card component for displaying hotels and resorts.
 */
const HotelCard = ({ hotel }) => {
  const { toggleWishlist, isInWishlist } = useContext(AuthContext);
  const isLiked = isInWishlist(hotel.id);

  return (
    <div className="resort-card">
      <div className="resort-image-wrapper">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="resort-img"
          onError={(e) => { e.target.src = `https://picsum.photos/seed/${encodeURIComponent(hotel.name.replace(/\s+/g, ''))}/800/600`; }}
        />
        <div className="resort-badge">{hotel.category}</div>
        <button 
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(hotel);
          }}
        >
          <Heart size={20} className={isLiked ? "text-red-500 fill-red-500" : "text-muted"} />
        </button>
      </div>
      <div className="resort-info glass">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/hotels/${hotel.id}`}>
            <h3>{hotel.name}</h3>
          </Link>
          <div className="flex items-center gap-1 text-primary">
            <Star size={16} fill="var(--primary)" />
            <span className="font-bold">{hotel.rating}</span>
          </div>
        </div>
        <p className="flex items-center gap-2 text-muted mb-4"><MapPin size={16} />{hotel.location}</p>
        <div className="flex justify-between items-center mt-auto border-t pt-4">
          <div>
            <span className="text-muted text-sm">Starting from</span>
            <div className="font-bold text-xl text-primary">₹{hotel.price_per_night}</div>
          </div>
          <Link to={`/hotels/${hotel.id}`} className="btn btn-outline" style={{ padding: '8px 20px' }}>Explore</Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
