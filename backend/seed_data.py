import os
import django
import random
from decimal import Decimal

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yatraa_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from hotels.models import Hotel, Room

User = get_user_model()

def seed_data():
    print("Starting database seeding...")

    # Create Superuser
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@yatraa.com', 'adminpass', first_name='Admin', last_name='User')
        print("Created superuser: admin / adminpass")
    
    # Create Regular User
    if not User.objects.filter(username='testuser').exists():
        User.objects.create_user('testuser', 'user@yatraa.com', 'userpass', first_name='Test', last_name='User')
        print("Created regular user: testuser / userpass")

    # Clear existing hotels (optional, to avoid duplicates if run multiple times)
    Hotel.objects.all().delete()
    print("Cleared existing hotel data.")

    # Mock Hotels
    hotels_data = [
        {
            'name': 'The Grand Azure Resort',
            'location': 'Maldives',
            'address': 'Atoll Island 5, Maldives',
            'description': 'Experience ultimate luxury in our overwater villas. Crystal clear water, premium dining, and world-class spa facilities.',
            'price_per_night': 499.00,
            'rating': 4.9,
            'image': 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop',
            'category': 'Resort',
            'wifi': True, 'pool': True, 'parking': False, 'breakfast': True, 'ac': True
        },
        {
            'name': 'Alpine Peak Lodge',
            'location': 'Swiss Alps',
            'address': 'Mountain View Road 12, Zermatt',
            'description': 'Cozy luxury lodge right next to the ski slopes. Perfect for winter getaways with a heated indoor pool and sauna.',
            'price_per_night': 350.00,
            'rating': 4.7,
            'image': 'https://images.unsplash.com/photo-1542314831-c6a4d140e628?q=80&w=2070&auto=format&fit=crop',
            'category': 'Resort',
            'wifi': True, 'pool': True, 'parking': True, 'breakfast': True, 'ac': True
        },
        {
            'name': 'Metropolitan Boutique Hotel',
            'location': 'New York, USA',
            'address': '5th Avenue, NYC',
            'description': 'Stay in the heart of the city in our newly renovated modern rooms. Walking distance to Central Park.',
            'price_per_night': 250.00,
            'rating': 4.5,
            'image': 'https://images.unsplash.com/photo-1566073171589-236da10c83cb?q=80&w=2000&auto=format&fit=crop',
            'category': 'Hotel',
            'wifi': True, 'pool': False, 'parking': True, 'breakfast': False, 'ac': True
        },
        {
            'name': 'Bali Jungle Retreat',
            'location': 'Ubud, Bali',
            'address': 'Monkey Forest Road, Ubud',
            'description': 'Reconnect with nature in our eco-friendly jungle villas. Includes daily yoga sessions and organic meals.',
            'price_per_night': 120.00,
            'rating': 4.8,
            'image': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080&auto=format&fit=crop',
            'category': 'Resort',
            'wifi': True, 'pool': True, 'parking': True, 'breakfast': True, 'ac': True
        },
        {
            'name': 'Parisian Elegance',
            'location': 'Paris, France',
            'address': 'Rue de Rivoli, Paris',
            'description': 'Classic French styling meets modern comfort. Enjoy stunning views of the Eiffel Tower from your balcony.',
            'price_per_night': 320.00,
            'rating': 4.6,
            'image': 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1534&auto=format&fit=crop',
            'category': 'Hotel',
            'wifi': True, 'pool': False, 'parking': False, 'breakfast': True, 'ac': True
        }
    ]

    room_types = ['Standard', 'Deluxe', 'Suite']

    for data in hotels_data:
        hotel = Hotel.objects.create(**data)
        print(f"Created Hotel: {hotel.name}")

        # Create 3 room types for each hotel
        for i, r_type in enumerate(room_types):
            capacity = i + 2 # 2, 3, 4 guests
            base_multiplier = Decimal(1 + (i * 0.5)) # 1x, 1.5x, 2.0x base price
            room_price = Decimal(data['price_per_night']) * base_multiplier
            
            Room.objects.create(
                hotel=hotel,
                room_type=r_type,
                capacity=capacity,
                price=round(room_price, 2),
                available=True
            )
        print(f"  -> Added {len(room_types)} rooms.")

    print("\nDatabase seeding completed successfully!")

if __name__ == '__main__':
    seed_data()
