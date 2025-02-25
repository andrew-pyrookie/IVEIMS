from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
import hashlib
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from rest_framework import status, viewsets
from .models import AssetTransfers, Equipment, Users, Project, Booking
from .serializers import AssetTransfersSerializer, EquipmentSerializer, UsersSerializer, ProjectSerializer, BookingSerializer, ProfileSerializer

Users = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = Users.objects.all()
    serializer_class = UsersSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UsersSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

<<<<<<< HEAD
        print(f"Received login attempt: {email}")  # Debugging log

        # Normalize email
        normalized_email = Users.objects.normalize_email(email)
        print(f"Normalized email: {normalized_email}")  # Debugging log

        # Find user
        user = Users.objects.filter(email=normalized_email).first()
        if not user:
            print("User not found")  # Debugging log
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # Check password
        if not user.check_password(password):
            print("Incorrect password")  # Debugging log
=======
        # Normalize email
        normalized_email = Users.objects.normalize_email(email)

        # Find user
        user = Users.objects.filter(email=normalized_email).first()
        if not user or not user.check_password(password):
>>>>>>> origin/main
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # Generate tokens
        refresh = RefreshToken.for_user(user)
<<<<<<< HEAD
        print("Login successful!")  # Debugging log
=======
>>>>>>> origin/main

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {"id": user.id, "role": user.role},
        }, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user  # Returns the authenticated user's data
# AssetTransfers Views
class AssetTransfersListCreateView(generics.ListCreateAPIView):
    queryset = AssetTransfers.objects.all()
    serializer_class = AssetTransfersSerializer
    permission_classes = [permissions.IsAuthenticated]

class AssetTransfersDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AssetTransfers.objects.all()
    serializer_class = AssetTransfersSerializer
    permission_classes = [permissions.IsAuthenticated]

# Equipment Views
class EquipmentListCreateView(generics.ListCreateAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        equipment = serializer.save()
        equipment.generate_qr_code()
        equipment.save()

class EquipmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [permissions.IsAuthenticated]

# User Authentication Views
class UserListView(generics.ListAPIView):
    queryset = Users.objects.all()
    serializer_class = UsersSerializer
    permission_classes = [permissions.IsAdminUser]

class UserDetailView(generics.RetrieveAPIView):
    queryset = Users.objects.all()
    serializer_class = UsersSerializer
    permission_classes = [permissions.IsAuthenticated]


# Custom API for transferring equipment
class TransferEquipmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        data = request.data
        equipment = get_object_or_404(Equipment, id=data['equipment_id'])
        from_lab = data['from_lab']
        to_lab = data['to_lab']

        # Update Equipment Location
        equipment.current_lab = to_lab
        equipment.save()

        # Log Transfer
        transfer = AssetTransfers.objects.create(
            equipment=equipment,
            from_lab=from_lab,
            to_lab=to_lab,
            transfer_date=data.get('transfer_date')
        )
        return Response({"message": "Equipment transferred successfully", "transfer_id": transfer.id})
    
class OfflineSyncView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Sync offline data when reconnected."""
        unsynced_transfers = AssetTransfers.objects.filter(is_synced=False)

        for transfer in unsynced_transfers:
            transfer.is_synced = True
            transfer.save()

        unsynced_equipment = Equipment.objects.filter(is_synced=False)
        for equipment in unsynced_equipment:
            equipment.is_synced = True
            equipment.save()

        return Response({"message": "Offline data synced successfully."}, status=status.HTTP_200_OK)
    
class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        print(f"Authenticated User: {self.request.user}")  # Debugging
        start_time = serializer.validated_data['start_time']
        end_time = serializer.validated_data['end_time']
        equipment = serializer.validated_data['equipment']

        conflicting_booking = Booking.objects.filter(
            equipment=equipment,
            start_time__lt=end_time,
            end_time__gt=start_time
        ).exists()

        if conflicting_booking:
            return Response({"error": "This equipment is already booked for the selected time range."}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        start_time = serializer.validated_data['start_time']
        end_time = serializer.validated_data['end_time']
        equipment = serializer.validated_data['equipment']
        instance = self.get_object()

        conflicting_booking = Booking.objects.filter(
            equipment=equipment,
            start_time__lt=end_time,
            end_time__gt=start_time
        ).exclude(id=instance.id).exists()

        if conflicting_booking:
            return Response({"error": "This equipment is already booked for the selected time range."}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save()