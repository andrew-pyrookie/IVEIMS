from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import AssetTransfers, Equipment, Users
from .serializers import AssetTransfersSerializer, EquipmentSerializer, UsersSerializer

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
