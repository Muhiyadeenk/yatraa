from rest_framework import viewsets, permissions
from .models import Review
from .serializers import ReviewSerializer
from django_filters.rest_framework import DjangoFilterBackend

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['hotel', 'user', 'rating']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
