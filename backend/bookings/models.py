from django.db import models
from django.conf import settings
from hotels.models import Room

class Booking(models.Model):
    """
    Handles hotel reservations for users.
    """
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Paid', 'Paid'),
        ('Cancelled', 'Cancelled'),
    )

    PAYMENT_STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='bookings', on_delete=models.CASCADE)
    room = models.ForeignKey(Room, related_name='bookings', on_delete=models.CASCADE)
    check_in = models.DateField()
    check_out = models.DateField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Total price for the entire stay")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    
    # Payment fields
    payment_method = models.CharField(max_length=50, blank=True, null=True)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='Pending')
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def nights_count(self):
        """Calculates the number of nights between check-in and check-out."""
        if not self.check_in or not self.check_out:
            return 0
        delta = self.check_out - self.check_in
        return max(delta.days, 1)

    def __str__(self):
        return f"{self.user.username}'s stay at {self.room.hotel.name} ({self.status})"

class Payment(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed'),
    )
    
    METHOD_CHOICES = (
        ('Card', 'Credit/Debit Card'),
        ('PayPal', 'PayPal'),
        ('Stripe', 'Stripe'),
    )

    booking = models.OneToOneField(Booking, related_name='payment', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=50, choices=METHOD_CHOICES, default='Card')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.id} for Booking {self.booking.id}"
