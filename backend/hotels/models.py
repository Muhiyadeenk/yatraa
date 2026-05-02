from django.db import models

class Hotel(models.Model):
    CATEGORY_CHOICES = (
        ('Hotel', 'Hotel'),
        ('Resort', 'Resort'),
    )

    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    address = models.TextField()
    description_title = models.CharField(max_length=255, default="A Nature-Inspired Sanctuary")
    description = models.TextField()
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)  # Starting price
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    image = models.ImageField(upload_to='hotels/', blank=True, null=True)
    image_url = models.URLField(max_length=1000, blank=True, null=True)
    image2 = models.ImageField(upload_to='hotels/', blank=True, null=True)
    image2_url = models.URLField(max_length=1000, blank=True, null=True)
    image3 = models.ImageField(upload_to='hotels/', blank=True, null=True)
    image3_url = models.URLField(max_length=1000, blank=True, null=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Hotel')
    featured = models.BooleanField(default=False)
    
    # Amenities
    wifi = models.BooleanField(default=False)
    pool = models.BooleanField(default=False)
    parking = models.BooleanField(default=False)
    breakfast = models.BooleanField(default=False)
    ac = models.BooleanField(default=False)
    
    is_available = models.BooleanField(default=True)
    total_rooms = models.PositiveIntegerField(default=10)
    max_guests = models.PositiveIntegerField(default=2)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Room(models.Model):
    hotel = models.ForeignKey(Hotel, related_name='rooms', on_delete=models.CASCADE)
    room_type = models.CharField(max_length=100)  # e.g., Deluxe, Suite, Standard
    capacity = models.PositiveIntegerField(default=2)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    available = models.BooleanField(default=True)
    image = models.ImageField(upload_to='rooms/', blank=True, null=True)

    def __str__(self):
        return f"{self.room_type} at {self.hotel.name}"
