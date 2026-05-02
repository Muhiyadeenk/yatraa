from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Wishlist
from .serializers import WishlistSerializer
from django.db import IntegrityError

class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
        except IntegrityError:
            # Handle unique constraint if user tries to wishlist the same hotel twice
            pass
