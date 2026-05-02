from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
import uuid
from .models import Booking, Payment
from .serializers import BookingSerializer, PaymentSerializer

class BookingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing booking instances.
    Users can only see their own bookings.
    """
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Booking.objects.all().order_by('-created_at')
        return Booking.objects.filter(user=user).order_by('-created_at')

    def perform_create(self, serializer):
        """
        Custom create logic to calculate total price based on duration.
        """
        instance = serializer.save(user=self.request.user, total_price=0) # Temp price
        
        # Recalculate price based on the helper property in the model
        room_price = instance.room.price
        total_price = room_price * instance.nights_count
        
        instance.total_price = total_price
        instance.save()

class PaymentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for processing payments.
    """
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Payment.objects.all().order_by('-created_at')
        return Payment.objects.filter(booking__user=user).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        booking_id = request.data.get('booking_id')
        if not booking_id:
            return Response({"error": "booking_id is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            booking = Booking.objects.get(id=booking_id, user=request.user)
            
            # Simplified payment creation
            payment = Payment.objects.create(
                booking=booking,
                amount=booking.total_price,
                method=request.data.get('method', 'Card'),
                status='Completed'
            )
            
            # Sync booking status
            booking.status = 'Confirmed'
            booking.save()
            
            serializer = self.get_serializer(payment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found or access denied"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], url_path='paypal/create')
    def paypal_create(self, request):
        booking_id = request.data.get('booking_id')
        if not booking_id:
            return Response({"error": "booking_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            booking = Booking.objects.get(id=booking_id, user=request.user)
            # Initialize payment details on booking
            booking.payment_method = 'PayPal'
            booking.payment_status = 'Pending'
            booking.transaction_id = f"PAY-{uuid.uuid4().hex[:8].upper()}"
            booking.save()
            
            return Response({'orderID': booking.transaction_id})
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], url_path='paypal/verify')
    def paypal_verify(self, request):
        order_id = request.data.get('orderID')
        if not order_id:
            return Response({"error": "orderID is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            booking = Booking.objects.get(transaction_id=order_id, payment_method='PayPal', payment_status='Pending')
            booking.payment_status = 'Completed'
            booking.status = 'Paid'
            booking.save()
            
            # Also update the Payment model if it exists or create it
            Payment.objects.update_or_create(
                booking=booking,
                defaults={
                    'amount': booking.total_price,
                    'method': 'PayPal',
                    'status': 'Completed',
                    'transaction_id': order_id
                }
            )
            
            return Response({"message": "Payment successful", "status": "Paid"})
        except Booking.DoesNotExist:
            return Response({"error": "Invalid order ID or already verified"}, status=status.HTTP_400_BAD_REQUEST)
