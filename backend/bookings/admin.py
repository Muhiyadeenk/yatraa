from django.contrib import admin
from .models import Booking, Payment

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'room', 'check_in', 'check_out', 'total_price', 'status', 'created_at')
    list_filter = ('status', 'check_in', 'created_at')
    search_fields = ('user__username', 'room__hotel__name')

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'booking', 'amount', 'method', 'status', 'transaction_id', 'created_at')
    list_filter = ('status', 'method')
    search_fields = ('transaction_id', 'booking__user__username')
