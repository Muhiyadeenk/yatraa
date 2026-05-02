from django.contrib import admin
from .models import Hotel, Room

@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'location', 'category', 'price_per_night', 'rating')
    list_filter = ('category', 'location')
    search_fields = ('name', 'location')

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('id', 'hotel', 'room_type', 'capacity', 'price', 'available')
    list_filter = ('available', 'hotel__name')
    search_fields = ('room_type', 'hotel__name')
