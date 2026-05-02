from django.db import models
from django.conf import settings
from hotels.models import Hotel

class Wishlist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='wishlist', on_delete=models.CASCADE)
    hotel = models.ForeignKey(Hotel, related_name='wishlisted_by', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'hotel')

    def __str__(self):
        return f"{self.user.username} - {self.hotel.name}"
