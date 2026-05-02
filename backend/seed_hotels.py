import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yatraa_backend.settings')
django.setup()

from hotels.models import Hotel

# Data from mockData.js (using image_url for external links)
hotels_to_add = [
    {
        'name': 'The Garden City Palace',
        'location': 'Bangalore, India',
        'address': 'Residency Road, Bangalore 560025',
        'description': 'A luxurious urban sanctuary in the heart of the Garden City. Experience old-world charm blended with modern sophistication.',
        'price_per_night': 12500,
        'rating': 4.8,
        'category': 'Hotel',
        'wifi': True, 'pool': True, 'parking': True, 'breakfast': True, 'ac': True,
        'is_available': True, 'total_rooms': 10, 'max_guests': 2,
        'image_url': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=2000&auto=format&fit=crop'
    },
    {
        'name': 'Bangalore Eco Woods',
        'location': 'Bangalore, India',
        'address': 'Bannerghatta Road, Bangalore 560083',
        'description': 'Escape to nature at our sustainable luxury resort on the outskirts of Bangalore. Organic farming, bird watching, and luxury tents.',
        'price_per_night': 9500,
        'rating': 4.6,
        'category': 'Resort',
        'wifi': True, 'pool': True, 'parking': True, 'breakfast': True, 'ac': False,
        'is_available': True, 'total_rooms': 10, 'max_guests': 4,
        'image_url': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2000&auto=format&fit=crop'
    },
    {
        'name': 'Marine Drive Luxury',
        'location': 'Mumbai, India',
        'address': 'Marine Drive, Mumbai 400020',
        'description': 'Overlooking the Arabian Sea, our Marine Drive hotel offers the most iconic views of the Queen\'s Necklace.',
        'price_per_night': 22000,
        'rating': 4.9,
        'category': 'Hotel',
        'wifi': True, 'pool': True, 'parking': True, 'breakfast': True, 'ac': True,
        'is_available': True, 'total_rooms': 10, 'max_guests': 2,
        'image_url': 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=2000&auto=format&fit=crop'
    },
    {
        'name': 'Juhu Beach Haven',
        'location': 'Mumbai, India',
        'address': 'Juhu Tara Road, Mumbai 400049',
        'description': 'A beachfront paradise in the city of dreams. Experience the best of Mumbai\'s coast with private beach access.',
        'price_per_night': 18000,
        'rating': 4.7,
        'category': 'Resort',
        'wifi': True, 'pool': True, 'parking': True, 'breakfast': True, 'ac': True,
        'is_available': True, 'total_rooms': 10, 'max_guests': 4,
        'image_url': 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?q=80&w=2000&auto=format&fit=crop'
    },
    {
        'name': 'The Nizam Heritage',
        'location': 'Hyderabad, India',
        'address': 'Banjara Hills, Hyderabad 500034',
        'description': 'Experience the grandeur of the Nawabs in our modern heritage hotel. Famous for its authentic Hyderabadi cuisine and royal suites.',
        'price_per_night': 11000,
        'rating': 4.7,
        'category': 'Hotel',
        'wifi': True, 'pool': True, 'parking': True, 'breakfast': True, 'ac': True,
        'is_available': True, 'total_rooms': 10, 'max_guests': 2,
        'image_url': 'https://images.unsplash.com/photo-1597576579603-9118c44566f1?q=80&w=2000&auto=format&fit=crop'
    },
    {
        'name': 'Delhi Imperial Plaza',
        'location': 'New Delhi, India',
        'address': 'Connaught Place, New Delhi 110001',
        'description': 'The epitome of luxury in the national capital. A perfect blend of colonial architecture and contemporary world-class service.',
        'price_per_night': 15500,
        'rating': 4.8,
        'category': 'Hotel',
        'wifi': True, 'pool': True, 'parking': True, 'breakfast': True, 'ac': True,
        'is_available': True, 'total_rooms': 10, 'max_guests': 2,
        'image_url': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2000&auto=format&fit=crop'
    },
    {
        'name': 'Goa Sands Resort',
        'location': 'Goa, India',
        'address': 'Calangute Beach, Goa 403516',
        'description': 'Sun, sand, and serenity. Our beachfront resort in North Goa is the ultimate destination for luxury beach lovers.',
        'price_per_night': 14000,
        'rating': 4.6,
        'category': 'Resort',
        'wifi': True, 'pool': True, 'parking': True, 'breakfast': True, 'ac': True,
        'is_available': True, 'total_rooms': 10, 'max_guests': 6,
        'image_url': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2000&auto=format&fit=crop'
    },
    {
        'name': 'Azure Maldives Resort',
        'location': 'Maldives',
        'address': 'Baa Atoll, Maldives',
        'description': 'A private island escape in the Baa Atoll UNESCO World Biosphere Reserve. Luxury meets conservation.',
        'price_per_night': 85000,
        'rating': 4.9,
        'category': 'Resort',
        'wifi': True, 'pool': True, 'parking': False, 'breakfast': True, 'ac': True,
        'is_available': True, 'total_rooms': 10, 'max_guests': 2,
        'image_url': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2000&auto=format&fit=crop'
    },
    {
        'name': 'Manhattan Grand Hotel',
        'location': 'New York, USA',
        'address': '5th Avenue, New York, NY 10022',
        'description': 'Iconic luxury in the heart of Manhattan. Experience the hustle of NYC with the quiet elegance of our premium suites.',
        'price_per_night': 42000,
        'rating': 4.7,
        'category': 'Hotel',
        'wifi': True, 'pool': False, 'parking': True, 'breakfast': True, 'ac': True,
        'is_available': True, 'total_rooms': 10, 'max_guests': 2,
        'image_url': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2000&auto=format&fit=crop'
    },
    {
        'name': 'Hyderabad Hills Resort',
        'location': 'Hyderabad, India',
        'address': 'Gandipet, Hyderabad 500075',
        'description': 'A serene lakeside resort offering a peaceful escape from the bustling city. Luxury villas with private pools.',
        'price_per_night': 13500,
        'rating': 4.5,
        'category': 'Resort',
        'wifi': True, 'pool': True, 'parking': True, 'breakfast': True, 'ac': True,
        'is_available': True, 'total_rooms': 12, 'max_guests': 4,
        'image_url': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2000&auto=format&fit=crop'
    },
    {
        'name': 'Delhi Heritage Villa',
        'location': 'New Delhi, India',
        'address': 'Mehrauli, New Delhi 110030',
        'description': 'A boutique resort experience near the Qutub Minar. Traditional architecture with modern luxury amenities.',
        'price_per_night': 14500,
        'rating': 4.6,
        'category': 'Resort',
        'wifi': True, 'pool': True, 'parking': True, 'breakfast': True, 'ac': True,
        'is_available': True, 'total_rooms': 8, 'max_guests': 2,
        'image_url': 'https://images.unsplash.com/photo-1590076215667-875d4ef1d7af?q=80&w=2000&auto=format&fit=crop'
    },
    {
        'name': 'Old Goa Boutique Hotel',
        'location': 'Goa, India',
        'address': 'Old Goa, Goa 403004',
        'description': 'A charming boutique hotel in the heart of historic Old Goa. Experience colonial elegance and tranquility.',
        'price_per_night': 8500,
        'rating': 4.4,
        'category': 'Hotel',
        'wifi': True, 'pool': True, 'parking': True, 'breakfast': True, 'ac': True,
        'is_available': True, 'total_rooms': 15, 'max_guests': 2,
        'image_url': 'https://images.unsplash.com/photo-1582647509711-c8abef5be174?q=80&w=2000&auto=format&fit=crop'
    },
    {
        'name': 'Burj Al Luxury',
        'location': 'Dubai, UAE',
        'address': 'Jumeirah Beach, Dubai',
        'description': 'The world\'s most luxurious hotel. Experience seven-star service and unparalleled opulence.',
        'price_per_night': 120000,
        'rating': 5.0,
        'category': 'Hotel',
        'wifi': True, 'pool': True, 'parking': True, 'breakfast': True, 'ac': True,
        'is_available': True, 'total_rooms': 20, 'max_guests': 2,
        'image_url': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2000&auto=format&fit=crop'
    },
    {
        'name': 'Riviera Palace Paris',
        'location': 'Paris, France',
        'address': 'Avenue Montaigne, Paris',
        'description': 'A palace-grade resort experience in the heart of Paris. Featuring a world-class spa and Michelin-starred dining.',
        'price_per_night': 65000,
        'rating': 4.9,
        'category': 'Resort',
        'wifi': True, 'pool': True, 'parking': True, 'breakfast': True, 'ac': True,
        'is_available': True, 'total_rooms': 12, 'max_guests': 2,
        'image_url': 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=2000&auto=format&fit=crop'
    },
    {
        'name': 'The Bangalore Ritz',
        'location': 'Bangalore, India',
        'address': 'MG Road, Bangalore',
        'description': 'Modern luxury meets technology in the heart of India\'s Silicon Valley.',
        'price_per_night': 14000,
        'rating': 4.8,
        'category': 'Hotel',
        'wifi': True, 'pool': True, 'parking': True, 'breakfast': True, 'ac': True,
        'is_available': True, 'total_rooms': 25, 'max_guests': 2,
        'image_url': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=2000&auto=format&fit=crop'
    },
    {
        'name': 'Mumbai Coast Resort',
        'location': 'Mumbai, India',
        'address': 'Worli Sea Face, Mumbai',
        'description': 'A luxury resort offering panoramic views of the Sea Link and the Arabian Sea.',
        'price_per_night': 25000,
        'rating': 4.7,
        'category': 'Resort',
        'wifi': True, 'pool': True, 'parking': True, 'breakfast': True, 'ac': True,
        'is_available': True, 'total_rooms': 15, 'max_guests': 4,
        'image_url': 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=2000&auto=format&fit=crop'
    },
    {
        'name': 'Pearl of Maldives',
        'location': 'Maldives',
        'address': 'Ari Atoll, Maldives',
        'description': 'Voted the most romantic resort in the world. Private lagoons and underwater dining.',
        'price_per_night': 95000,
        'rating': 5.0,
        'category': 'Resort',
        'wifi': True, 'pool': True, 'parking': False, 'breakfast': True, 'ac': True,
        'is_available': True, 'total_rooms': 10, 'max_guests': 2,
        'image_url': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2000&auto=format&fit=crop'
    },
    {
        'name': 'Bali Jungle Palace',
        'location': 'Bali, Indonesia',
        'address': 'Tegallalang, Bali',
        'description': 'Nestled deep in the rice terraces, offering a spiritual and luxurious escape.',
        'price_per_night': 28000,
        'rating': 4.9,
        'category': 'Resort',
        'wifi': True, 'pool': True, 'parking': True, 'breakfast': True, 'ac': True,
        'is_available': True, 'total_rooms': 8, 'max_guests': 2,
        'image_url': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2000&auto=format&fit=crop'
    },
    {
        'name': 'New York Plaza Central',
        'location': 'New York, USA',
        'address': 'Central Park South, NY',
        'description': 'The most prestigious address in New York City. Classic luxury overlooking the park.',
        'price_per_night': 55000,
        'rating': 4.8,
        'category': 'Hotel',
        'wifi': True, 'pool': False, 'parking': True, 'breakfast': True, 'ac': True,
        'is_available': True, 'total_rooms': 30, 'max_guests': 2,
        'image_url': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2000&auto=format&fit=crop'
    },
    {
        'name': 'The Hyderabad Grand',
        'location': 'Hyderabad, India',
        'address': 'Hitech City, Hyderabad',
        'description': 'A modern architectural marvel serving the global tech leaders of today.',
        'price_per_night': 12000,
        'rating': 4.7,
        'category': 'Hotel',
        'wifi': True, 'pool': True, 'parking': True, 'breakfast': True, 'ac': True,
        'is_available': True, 'total_rooms': 40, 'max_guests': 2,
        'image_url': 'https://images.unsplash.com/photo-1597576579603-9118c44566f1?q=80&w=2000&auto=format&fit=crop'
    }
]

for h_data in hotels_to_add:
    Hotel.objects.update_or_create(
        name=h_data['name'],
        defaults=h_data
    )
    print(f"Added/Updated: {h_data['name']}")

print("Done!")
