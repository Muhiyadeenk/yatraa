export const mockHotels = [
  {
    id: 1,
    name: 'Emerald Forest Retreat',
    location: 'Ubud, Bali',
    address: 'Monkey Forest Road, Ubud 80571',
    description: 'Immerse yourself in nature at our luxurious eco-retreat. Featuring infinity pools overlooking the pristine jungle, world-class organic dining, and open-air spa treatments inspired by traditional Balinese healing.',
    price_per_night: 26500,
    rating: 4.9,
    reviews_count: 342,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1536847000185-3be9f65fd76d?q=80&w=2072&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop'
    ],
    category: 'Resort',
    amenities: { wifi: true, pool: true, parking: true, breakfast: true, ac: true, spa: true },
    rooms: [
      { id: 101, room_type: 'Canopy Suite', capacity: 2, price: 26500, available: 2 },
      { id: 102, room_type: 'River View Villa', capacity: 3, price: 37000, available: 1 },
      { id: 103, room_type: 'Family Treehouse', capacity: 5, price: 56000, available: 0 }
    ]
  },
  {
    id: 2,
    name: 'Serenity Cove Resort',
    location: 'Maldives',
    address: 'South Male Atoll, Maldives',
    description: 'Wake up to the sound of crystal-clear waters in our breathtaking overwater bungalows. Serenity Cove offers an unmatched tropical luxury experience with private access to vibrant coral reefs.',
    price_per_night: 70500,
    rating: 4.8,
    reviews_count: 512,
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?q=80&w=1974&auto=format&fit=crop'
    ],
    category: 'Resort',
    amenities: { wifi: true, pool: true, parking: false, breakfast: true, ac: true, spa: true },
    rooms: [
      { id: 201, room_type: 'Overwater Villa', capacity: 2, price: 70500, available: 5 },
      { id: 202, room_type: 'Beachfront Suite', capacity: 4, price: 92000, available: 2 }
    ]
  },
  {
    id: 3,
    name: 'The Alpine Sanctuary',
    location: 'Zermatt, Switzerland',
    address: 'Matterhorn View Road 1, Zermatt',
    description: 'An elegant mountain sanctuary blending modern luxury with classic alpine charm. Enjoy ski-in/ski-out access and relax in our heated outdoor pools with panoramic views of the Matterhorn.',
    price_per_night: 35000,
    rating: 4.7,
    reviews_count: 289,
    image: 'https://images.unsplash.com/photo-1542314831-c6a4d140e628?q=80&w=2070&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1542314831-c6a4d140e628?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop'
    ],
    category: 'Hotel',
    amenities: { wifi: true, pool: true, parking: true, breakfast: true, ac: true, spa: true },
    rooms: [
      { id: 301, room_type: 'Mountain View Suite', capacity: 2, price: 35000, available: 3 },
      { id: 302, room_type: 'Alpine Chalet', capacity: 6, price: 74000, available: 0 }
    ]
  },
  {
    id: 4,
    name: 'Oasis Desert Camp',
    location: 'Dubai, UAE',
    address: 'Al Marmoom Desert, Dubai',
    description: 'Experience the magic of the Arabian nights in our ultra-luxurious tented suites. Private plunge pools, fine dining under the stars, and sunset camel rides await you.',
    price_per_night: 48000,
    rating: 4.9,
    reviews_count: 156,
    image: 'https://images.unsplash.com/photo-1543968332-f99478b1ed9e?q=80&w=2000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1543968332-f99478b1ed9e?q=80&w=2000&auto=format&fit=crop'
    ],
    category: 'Resort',
    amenities: { wifi: true, pool: true, parking: true, breakfast: true, ac: true, spa: false },
    rooms: [
      { id: 401, room_type: 'Luxury Tent', capacity: 2, price: 48000, available: 4 }
    ]
  },
  {
    id: 5,
    name: 'Aurora Glass Igloos',
    location: 'Lapland, Finland',
    address: 'Kakslauttanen, 99830 Saariselkä',
    description: 'Fall asleep watching the Northern Lights from your cozy, heated glass igloo. A truly magical winter wonderland experience.',
    price_per_night: 31500,
    rating: 4.6,
    reviews_count: 420,
    image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1534&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1534&auto=format&fit=crop'
    ],
    category: 'Resort',
    amenities: { wifi: true, pool: false, parking: true, breakfast: true, ac: true, spa: true },
    rooms: [
      { id: 501, room_type: 'Glass Igloo', capacity: 2, price: 31500, available: 10 }
    ]
  },
  {
    id: 6,
    name: 'Casa Blanca Boutique',
    location: 'Santorini, Greece',
    address: 'Oia, Santorini 84702',
    description: 'Iconic white-washed architecture nestled on the cliffside. Features private cave pools and the best sunset views over the Aegean Sea.',
    price_per_night: 54000,
    rating: 4.8,
    reviews_count: 630,
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop'
    ],
    category: 'Hotel',
    amenities: { wifi: true, pool: true, parking: false, breakfast: true, ac: true, spa: false },
    rooms: [
      { id: 601, room_type: 'Cave Suite', capacity: 2, price: 54000, available: 1 }
    ]
  },
  {
    id: 7,
    name: 'The Royal Jaipur Plaza',
    location: 'Jaipur, India',
    address: 'MG Road, Jaipur, Rajasthan 302001',
    description: 'Experience majestic royal heritage in the Pink City. Heritage architecture meets exquisite modern amenities for unparalleled luxury.',
    price_per_night: 18500,
    rating: 4.9,
    reviews_count: 1420,
    image: 'https://images.unsplash.com/photo-1582647509711-c8abef5be174?q=80&w=2070&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1582647509711-c8abef5be174?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590076215667-875d4ef1d7af?q=80&w=2072&auto=format&fit=crop'
    ],
    category: 'Hotel',
    amenities: { wifi: true, pool: true, parking: true, breakfast: true, ac: true, spa: true },
    rooms: [
      { id: 701, room_type: 'Royal Suite', capacity: 2, price: 18500, available: 8 },
      { id: 702, room_type: 'Maharaja Penthouse', capacity: 4, price: 42000, available: 2 }
    ]
  },
  {
    id: 8,
    name: 'Bora Bora Pearl Hideaway',
    location: 'Bora Bora, French Polynesia',
    address: 'Motu Tevairoa, Bora Bora 98730',
    description: 'Private overwater cabanas offering complete seclusion and breathtaking views of Mount Otemanu.',
    price_per_night: 110000,
    rating: 5.0,
    reviews_count: 890,
    image: 'https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?q=80&w=2074&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?q=80&w=2074&auto=format&fit=crop'
    ],
    category: 'Resort',
    amenities: { wifi: true, pool: false, parking: false, breakfast: true, ac: true, spa: true },
    rooms: [
      { id: 801, room_type: 'Horizon Villa', capacity: 2, price: 110000, available: 3 }
    ]
  },
  {
    id: 9,
    name: 'Kyoto Zen Gardens',
    location: 'Kyoto, Japan',
    address: 'Arashiyama, Kyoto',
    description: 'A minimalist masterpiece hotel built into the ancient bamboo forests of Arashiyama. Includes private onsen baths.',
    price_per_night: 42000,
    rating: 4.8,
    reviews_count: 531,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop'
    ],
    category: 'Hotel',
    amenities: { wifi: true, pool: false, parking: true, breakfast: true, ac: true, spa: true },
    rooms: [
      { id: 901, room_type: 'Tatami Mat Suite', capacity: 2, price: 42000, available: 5 }
    ]
  },
  {
    id: 11,
    name: 'The Garden City Palace',
    location: 'Bangalore, India',
    address: 'Residency Road, Bangalore 560025',
    description: 'A luxurious urban sanctuary in the heart of the Garden City. Experience old-world charm blended with modern sophistication.',
    price_per_night: 12500,
    rating: 4.8,
    reviews_count: 850,
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=2000&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=2000&auto=format&fit=crop'],
    category: 'Hotel',
    amenities: { wifi: true, pool: true, parking: true, breakfast: true, ac: true, spa: true },
    rooms: [{ id: 1101, room_type: 'Executive Suite', capacity: 2, price: 12500, available: 5 }]
  },
  {
    id: 12,
    name: 'Bangalore Eco Woods',
    location: 'Bangalore, India',
    address: 'Bannerghatta Road, Bangalore 560083',
    description: 'Escape to nature at our sustainable luxury resort on the outskirts of Bangalore. Organic farming, bird watching, and luxury tents.',
    price_per_night: 9500,
    rating: 4.6,
    reviews_count: 320,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2000&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2000&auto=format&fit=crop'],
    category: 'Resort',
    amenities: { wifi: true, pool: true, parking: true, breakfast: true, ac: false, spa: true },
    rooms: [{ id: 1201, room_type: 'Luxury Tent', capacity: 2, price: 9500, available: 10 }]
  },
  {
    id: 13,
    name: 'Marine Drive Luxury',
    location: 'Mumbai, India',
    address: 'Marine Drive, Mumbai 400020',
    description: 'Overlooking the Arabian Sea, our Marine Drive hotel offers the most iconic views of the Queen\'s Necklace.',
    price_per_night: 22000,
    rating: 4.9,
    reviews_count: 1100,
    image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=2000&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=2000&auto=format&fit=crop'],
    category: 'Hotel',
    amenities: { wifi: true, pool: true, parking: true, breakfast: true, ac: true, spa: true },
    rooms: [{ id: 1301, room_type: 'Ocean Front Room', capacity: 2, price: 22000, available: 4 }]
  },
  {
    id: 14,
    name: 'Juhu Beach Haven',
    location: 'Mumbai, India',
    address: 'Juhu Tara Road, Mumbai 400049',
    description: 'A beachfront paradise in the city of dreams. Experience the best of Mumbai\'s coast with private beach access.',
    price_per_night: 18000,
    rating: 4.7,
    reviews_count: 640,
    image: 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?q=80&w=2000&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1561501900-3701fa6a0864?q=80&w=2000&auto=format&fit=crop'],
    category: 'Resort',
    amenities: { wifi: true, pool: true, parking: true, breakfast: true, ac: true, spa: true },
    rooms: [{ id: 1401, room_type: 'Beach View Villa', capacity: 2, price: 18000, available: 3 }]
  },
  {
    id: 15,
    name: 'The Dubai Marina Resort',
    location: 'Dubai, UAE',
    address: 'Dubai Marina, UAE',
    description: 'Ultra-modern luxury with private yacht access and views of the world\'s tallest skyline.',
    price_per_night: 45000,
    rating: 4.9,
    reviews_count: 980,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2000&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2000&auto=format&fit=crop'],
    category: 'Resort',
    amenities: { wifi: true, pool: true, parking: true, breakfast: true, ac: true, spa: true },
    rooms: [{ id: 1501, room_type: 'Marina Suite', capacity: 2, price: 45000, available: 8 }]
  },
  {
    id: 16,
    name: 'Parisian Elegance Hotel',
    location: 'Paris, France',
    address: 'Champs-Élysées, Paris',
    description: 'Classic French luxury just steps away from the Eiffel Tower and world-class shopping.',
    price_per_night: 52000,
    rating: 4.8,
    reviews_count: 1200,
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=2000&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=2000&auto=format&fit=crop'],
    category: 'Hotel',
    amenities: { wifi: true, pool: false, parking: true, breakfast: true, ac: true, spa: true },
    rooms: [{ id: 1601, room_type: 'Eiffel View Suite', capacity: 2, price: 52000, available: 2 }]
  },
  {
    id: 17,
    name: 'The Nizam Heritage',
    location: 'Hyderabad, India',
    address: 'Banjara Hills, Hyderabad 500034',
    description: 'Experience the grandeur of the Nawabs in our modern heritage hotel. Famous for its authentic Hyderabadi cuisine and royal suites.',
    price_per_night: 11000,
    rating: 4.7,
    reviews_count: 520,
    image: 'https://images.unsplash.com/photo-1597576579603-9118c44566f1?q=80&w=2000&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1597576579603-9118c44566f1?q=80&w=2000&auto=format&fit=crop'],
    category: 'Hotel',
    amenities: { wifi: true, pool: true, parking: true, breakfast: true, ac: true, spa: true },
    rooms: [{ id: 1701, room_type: 'Nizam Suite', capacity: 2, price: 11000, available: 6 }]
  },
  {
    id: 18,
    name: 'Delhi Imperial Plaza',
    location: 'New Delhi, India',
    address: 'Connaught Place, New Delhi 110001',
    description: 'The epitome of luxury in the national capital. A perfect blend of colonial architecture and contemporary world-class service.',
    price_per_night: 15500,
    rating: 4.8,
    reviews_count: 910,
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2000&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2000&auto=format&fit=crop'],
    category: 'Hotel',
    amenities: { wifi: true, pool: true, parking: true, breakfast: true, ac: true, spa: true },
    rooms: [{ id: 1801, room_type: 'Diplomatic Suite', capacity: 2, price: 15500, available: 4 }]
  },
  {
    id: 19,
    name: 'Goa Sands Resort',
    location: 'Goa, India',
    address: 'Calangute Beach, Goa 403516',
    description: 'Sun, sand, and serenity. Our beachfront resort in North Goa is the ultimate destination for luxury beach lovers.',
    price_per_night: 14000,
    rating: 4.6,
    reviews_count: 1500,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2000&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2000&auto=format&fit=crop'],
    category: 'Resort',
    amenities: { wifi: true, pool: true, parking: true, breakfast: true, ac: true, spa: true },
    rooms: [{ id: 1901, room_type: 'Sea View Suite', capacity: 2, price: 14000, available: 12 }]
  },
  {
    id: 20,
    name: 'Azure Maldives Resort',
    location: 'Maldives',
    address: 'Baa Atoll, Maldives',
    description: 'A private island escape in the Baa Atoll UNESCO World Biosphere Reserve. Luxury meets conservation.',
    price_per_night: 85000,
    rating: 4.9,
    reviews_count: 430,
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2000&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2000&auto=format&fit=crop'],
    category: 'Resort',
    amenities: { wifi: true, pool: true, parking: false, breakfast: true, ac: true, spa: true },
    rooms: [{ id: 2001, room_type: 'Sunset Overwater Villa', capacity: 2, price: 85000, available: 3 }]
  },
  {
    id: 21,
    name: 'Manhattan Grand Hotel',
    location: 'New York, USA',
    address: '5th Avenue, New York, NY 10022',
    description: 'Iconic luxury in the heart of Manhattan. Experience the hustle of NYC with the quiet elegance of our premium suites.',
    price_per_night: 42000,
    rating: 4.7,
    reviews_count: 2100,
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2000&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2000&auto=format&fit=crop'],
    category: 'Hotel',
    amenities: { wifi: true, pool: false, parking: true, breakfast: true, ac: true, spa: true },
    rooms: [{ id: 2101, room_type: 'Skyline Suite', capacity: 2, price: 42000, available: 5 }]
  }
];

export const mockUser = {
  id: 1,
  username: 'admin',
  email: 'admin@yatraa.com',
  first_name: 'Admin',
  last_name: 'User',
  is_staff: true
};

export const mockBookings = [
  {
    id: 1001,
    hotel_name: 'Emerald Forest Retreat',
    room_type: 'Canopy Suite',
    check_in: '2026-05-15',
    check_out: '2026-05-20',
    total_price: 132500,
    status: 'Confirmed'
  },
  {
    id: 1002,
    hotel_name: 'The Alpine Sanctuary',
    room_type: 'Mountain View Suite',
    check_in: '2026-12-10',
    check_out: '2026-12-14',
    total_price: 140000,
    status: 'Pending'
  }
];

export const adminStats = {
  totalUsers: 1248,
  totalProperties: 156,
  totalBookings: 3842,
  revenue: '₹ 10.4 Cr',
  recentBookings: [
    { id: 501, guest: 'Sarah M.', hotel: 'Emerald Forest Retreat', amount: '₹ 1,32,500', status: 'Confirmed' },
    { id: 502, guest: 'David L.', hotel: 'Serenity Cove Resort', amount: '₹ 2,82,000', status: 'Confirmed' },
    { id: 503, guest: 'Emma W.', hotel: 'Aurora Glass Igloos', amount: '₹ 94,500', status: 'Pending' },
    { id: 504, guest: 'Michael T.', hotel: 'Casa Blanca Boutique', amount: '₹ 1,62,000', status: 'Confirmed' }
  ]
};
