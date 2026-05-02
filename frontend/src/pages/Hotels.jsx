import React, { useState, useEffect, useRef } from 'react';
import HotelCard from '../components/HotelCard';
import { Search, SlidersHorizontal } from 'lucide-react';
import { mockHotels } from '../mockData';
import { useLocation } from 'react-router-dom';
import './Hotels.css';

const API = 'http://127.0.0.1:8000';

const Hotels = () => {
  const location = useLocation();

  const [hotels, setHotels]           = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading]         = useState(true);
  const allHotelsRef = useRef([]);

  const [filters, setFilters] = useState({
    category: '',
    wifi: false,
    pool: false,
    parking: false,
    ac: false
  });

  // Core filter function — works on any array passed directly (no ref timing issues)
  const applyFiltersToData = (data, currentFilters, query) => {
    let filtered = data;

    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(h =>
        h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q)
      );
    }
    if (currentFilters.category) {
      filtered = filtered.filter(h => h.category === currentFilters.category);
    }
    if (currentFilters.wifi)    filtered = filtered.filter(h => h.amenities.wifi);
    if (currentFilters.pool)    filtered = filtered.filter(h => h.amenities.pool);
    if (currentFilters.parking) filtered = filtered.filter(h => h.amenities.parking);
    if (currentFilters.ac)      filtered = filtered.filter(h => h.amenities.ac);

    // Guest capacity filtering
    const searchParams = new URLSearchParams(window.location.search);
    const adults   = parseInt(searchParams.get('adults'))   || 0;
    const children = parseInt(searchParams.get('children')) || 0;
    const totalGuests = adults + children;
    if (totalGuests > 0) {
      filtered = filtered.filter(h => (h.max_guests || 2) >= totalGuests);
    }

    setHotels(filtered);
  };

  // Fetch hotels, then immediately apply URL-based filters — no race condition
  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/api/v1/hotels/`);
        if (!res.ok) throw new Error('API error');
        const data = await res.json();

        const normalized = data.map(h => ({
          ...h,
          amenities: {
            wifi:      h.wifi      ?? h.amenities?.wifi      ?? false,
            pool:      h.pool      ?? h.amenities?.pool      ?? false,
            parking:   h.parking   ?? h.amenities?.parking   ?? false,
            breakfast: h.breakfast ?? h.amenities?.breakfast ?? false,
            ac:        h.ac        ?? h.amenities?.ac        ?? false,
          },
          image: h.image
            ? (h.image.startsWith('http') ? h.image : `${API}${h.image}`)
            : (h.image_url || null),
        }));

        allHotelsRef.current = normalized;

        // Parse URL params and apply filters immediately after data loads
        const searchParams = new URLSearchParams(window.location.search);
        const locParam  = searchParams.get('location') || '';
        const typeParam = searchParams.get('type')     || '';

        const initFilters = { ...filters, category: typeParam };
        setFilters(initFilters);
        setSearchQuery(locParam);
        applyFiltersToData(normalized, initFilters, locParam);

      } catch {
        allHotelsRef.current = mockHotels;
        setHotels(mockHotels);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const newFilters = { ...filters, [e.target.name]: value };
    setFilters(newFilters);
    applyFiltersToData(allHotelsRef.current, newFilters, searchQuery);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    applyFiltersToData(allHotelsRef.current, filters, value);
  };

  const clearFilters = () => {
    const resetFilters = { category: '', wifi: false, pool: false, parking: false, ac: false };
    setFilters(resetFilters);
    setSearchQuery('');
    setHotels(allHotelsRef.current);
  };

  return (
    <div className="container section flex gap-6 hotels-page text-main">
      {/* Sidebar Filters */}
      <aside className="luxury-sidebar">
        <div className="filter-header flex items-center justify-between mb-6 pb-4 border-b">
          <h3 className="flex items-center gap-2 m-0"><SlidersHorizontal size={20}/> Refine Search</h3>
          <button className="text-primary font-medium text-sm" onClick={clearFilters}>Clear All</button>
        </div>

        <div className="filter-group mb-6">
          <h4 className="form-label">Search Location</h4>
          <div className="search-bar-inline flex items-center">
            <Search size={18} className="text-muted" />
            <input
              type="text"
              placeholder="E.g. Maldives"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="filter-group mb-6">
          <h4 className="form-label">Property Type</h4>
          <select className="form-input custom-select" name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">All Types</option>
            <option value="Hotel">Luxury Hotels</option>
            <option value="Resort">Eco-Resorts</option>
          </select>
        </div>

        <div className="filter-group">
          <h4 className="form-label">Must-Have Amenities</h4>
          <div className="checkbox-list">
            <label className="custom-checkbox">
              <input type="checkbox" name="wifi" checked={filters.wifi} onChange={handleFilterChange} />
              <span className="checkmark"></span>High-Speed WiFi
            </label>
            <label className="custom-checkbox">
              <input type="checkbox" name="pool" checked={filters.pool} onChange={handleFilterChange} />
              <span className="checkmark"></span>Swimming Pool
            </label>
            <label className="custom-checkbox">
              <input type="checkbox" name="parking" checked={filters.parking} onChange={handleFilterChange} />
              <span className="checkmark"></span>Valet Parking
            </label>
            <label className="custom-checkbox">
              <input type="checkbox" name="ac" checked={filters.ac} onChange={handleFilterChange} />
              <span className="checkmark"></span>Air Conditioning
            </label>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="hotels-content">
        <div className="results-header mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-4xl m-0">Our Collection</h1>
            <p className="text-muted mt-2">
              Showing {hotels.length} luxury propert{hotels.length === 1 ? 'y' : 'ies'} fitting your criteria
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-muted">Loading properties...</div>
        ) : hotels.length > 0 ? (
          <div className="hotels-grid">
            {hotels.map(hotel => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <div className="no-results text-center py-10 card">
            <h3 className="text-2xl mb-2">No properties found</h3>
            <p className="text-muted">Try adjusting your filters or destination.</p>
            <button onClick={clearFilters} className="btn btn-outline mt-4">Reset Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hotels;
