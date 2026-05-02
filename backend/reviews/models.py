from django.db import models
from django.conf import settings
from hotels.models import Hotel

class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='reviews', on_delete=models.CASCADE)
    hotel = models.ForeignKey(Hotel, related_name='reviews', on_delete=models.CASCADE)
    rating = models.IntegerField()  # 1 to 5
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.hotel.name} - {self.rating} stars"
