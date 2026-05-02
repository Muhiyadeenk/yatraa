import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yatraa_backend.settings')
django.setup()

from hotels.models import Hotel, Room

def seed_rooms():
    print("Checking for hotels without rooms...")
    hotels = Hotel.objects.all()
    for hotel in hotels:
        if not hotel.rooms.exists():
            print(f"Adding rooms to {hotel.name}...")
            # Standard Room
            Room.objects.create(
                hotel=hotel,
                room_type='Standard Room',
                capacity=2,
                price=hotel.price_per_night,
                available=True
            )
            # Premium Suite
            Room.objects.create(
                hotel=hotel,
                room_type='Premium Suite',
                capacity=4,
                price=hotel.price_per_night * 2,
                available=True
            )
    print("Done!")

if __name__ == '__main__':
    seed_rooms()
