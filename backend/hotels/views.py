from rest_framework import viewsets, permissions, filters
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from .models import Hotel, Room
from .serializers import HotelSerializer, RoomSerializer


class IsAdminOrReadOnly(permissions.BasePermission):
    """Allow read access to everyone; write access only to staff or 'admin' username."""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.is_staff or request.user.username == 'admin'


class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all().order_by('-created_at')
    serializer_class = HotelSerializer
    permission_classes = [IsAdminOrReadOnly]
    # Accept both JSON and multipart (for image uploads)
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['location', 'category', 'wifi', 'pool', 'parking', 'breakfast', 'ac']
    search_fields = ['name', 'location', 'description']
    ordering_fields = ['price_per_night', 'rating', 'created_at']


class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['hotel', 'room_type', 'available']

