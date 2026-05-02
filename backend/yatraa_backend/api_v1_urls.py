from django.urls import path, include

urlpatterns = [
    path('auth/', include('accounts.urls')),
    path('', include('hotels.urls')),
    path('', include('bookings.urls')),
    path('', include('reviews.urls')),
    path('', include('wishlist.urls')),
]
