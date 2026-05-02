from rest_framework import serializers
from .models import Booking, Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ('booking',)

class BookingSerializer(serializers.ModelSerializer):
    payment = PaymentSerializer(read_only=True)
    hotel_name = serializers.CharField(source='room.hotel.name', read_only=True)
    room_type = serializers.CharField(source='room.room_type', read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('user', 'status', 'created_at', 'total_price', 'payment_status', 'transaction_id')
