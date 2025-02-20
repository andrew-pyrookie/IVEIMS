from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import AssetTransfers, Equipment, Users
from .serializers import AssetTransfersSerializer, EquipmentSerializer, UsersSerializer

Users = get_user_model()

# User Registration View
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

# User Login View (JWT Tokens)
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        user = Users.objects.filter(email=email).first()
        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_200_OK)

        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# Logout View (Blacklist Refresh Token)
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
