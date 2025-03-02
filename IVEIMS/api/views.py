from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status, viewsets
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import (
    AssetTransfer, Equipment, Users, Project, Booking, Lab, ProjectAllocation,
    BorrowRequest, MaintenanceReminders, MaintenanceLog, ProjectDocument, BackupLog
)
from .serializers import (
    AssetTransfersSerializer, EquipmentSerializer, UsersSerializer, ProjectSerializer,
    BookingSerializer, ProfileSerializer, LabSerializer, ProjectAllocationSerializer,
    BorrowRequestSerializer, MaintenanceRemindersSerializer, MaintenanceLogSerializer,
    ProjectDocumentSerializer, BackupLogSerializer
)

Users = get_user_model()

class IsAdminOrStaff(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.role == 'admin' or request.user.is_staff)

class IsAdminLabManagerTechnician(BasePermission):
    def has_permission(self, request, view):
        allowed_roles = [Users.RoleChoices.ADMIN, Users.RoleChoices.LAB_MANAGER, Users.RoleChoices.TECHNICIAN]
        return request.user.is_authenticated and request.user.role in allowed_roles

class IsLabManagerOrAdmin(BasePermission):
    def has_permission(self, request, view):
        allowed_roles = [Users.RoleChoices.ADMIN, Users.RoleChoices.LAB_MANAGER]
        return request.user.is_authenticated and request.user.role in allowed_roles

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
        normalized_email = Users.objects.normalize_email(email)
        user = Users.objects.filter(email=normalized_email).first()
        if not user or not user.check_password(password):
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {"id": user.id, "role": user.role, "lab": user.lab.name if user.lab else None},
        }, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {"role": user.role}
        if user.role == Users.RoleChoices.ADMIN:
            data.update({
                "users": Users.objects.count(),
                "equipment": Equipment.objects.count(),
                "projects": Project.objects.count(),
                "pending_bookings": Booking.objects.filter(status='pending').count(),
            })
        elif user.role == Users.RoleChoices.LAB_MANAGER:
            lab = user.lab
            data.update({
                "lab": lab.name,
                "equipment": Equipment.objects.filter(current_lab=lab).count(),
                "projects": Project.objects.filter(members=user).count(),
                "pending_borrow_requests": BorrowRequest.objects.filter(owning_lab=lab, status='pending').count(),
            })
        elif user.role == Users.RoleChoices.TECHNICIAN:
            data.update({
                "maintenance_reminders": MaintenanceReminders.objects.filter(status='pending').count(),
                "equipment_in_maintenance": Equipment.objects.filter(status='maintenance').count(),
            })
        elif user.role == Users.RoleChoices.STUDENT:
            data.update({
                "projects": Project.objects.filter(members=user).count(),
                "bookings": Booking.objects.filter(user=user).count(),
            })
        return Response(data, status=status.HTTP_200_OK)

class LabListCreateView(generics.ListCreateAPIView):
    queryset = Lab.objects.all()
    serializer_class = LabSerializer
    permission_classes = [IsAdminOrStaff]

class LabDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Lab.objects.all()
    serializer_class = LabSerializer
    permission_classes = [IsAdminOrStaff]

class EquipmentListCreateView(generics.ListCreateAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        equipment = serializer.save()
        equipment.generate_qr_code()
        equipment.save()

class EquipmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [IsAuthenticated]

class UserListView(generics.ListAPIView):
    queryset = Users.objects.all()
    serializer_class = UsersSerializer
    permission_classes = [IsAdminOrStaff]

class UserDetailView(generics.RetrieveAPIView):
    queryset = Users.objects.all()
    serializer_class = UsersSerializer
    permission_classes = [IsAuthenticated]

class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAdminOrStaff]  # Changed from IsAuthenticated

    def get_queryset(self):
        if self.request.user.role in [Users.RoleChoices.ADMIN, Users.RoleChoices.LAB_MANAGER, Users.RoleChoices.TECHNICIAN]:
            return Project.objects.all()
        return Project.objects.filter(members=self.request.user)

class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

class ProjectAllocationListCreateView(generics.ListCreateAPIView):
    queryset = ProjectAllocation.objects.all()
    serializer_class = ProjectAllocationSerializer
    permission_classes = [IsAdminLabManagerTechnician]

    def perform_create(self, serializer):
        serializer.save(allocated_by=self.request.user)

class ProjectAllocationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProjectAllocation.objects.all()
    serializer_class = ProjectAllocationSerializer
    permission_classes = [IsAdminLabManagerTechnician]

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role in [Users.RoleChoices.ADMIN, Users.RoleChoices.LAB_MANAGER, Users.RoleChoices.TECHNICIAN]:
            return Booking.objects.all()
        return Booking.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        if 'status' in serializer.validated_data and serializer.validated_data['status'] == 'approved':
            if self.request.user.role not in [Users.RoleChoices.ADMIN, Users.RoleChoices.LAB_MANAGER, Users.RoleChoices.TECHNICIAN]:
                return Response({"error": "Only Admin, Lab Manager, or Technician can approve bookings."}, status=status.HTTP_403_FORBIDDEN)
        serializer.save()

class BorrowRequestListCreateView(generics.ListCreateAPIView):
    queryset = BorrowRequest.objects.all()
    serializer_class = BorrowRequestSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(requested_by=self.request.user)

class BorrowRequestDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BorrowRequest.objects.all()
    serializer_class = BorrowRequestSerializer
    permission_classes = [IsLabManagerOrAdmin]

class AssetTransferListCreateView(generics.ListCreateAPIView):
    queryset = AssetTransfer.objects.all()
    serializer_class = AssetTransfersSerializer
    permission_classes = [IsLabManagerOrAdmin]

class AssetTransferDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AssetTransfer.objects.all()
    serializer_class = AssetTransfersSerializer
    permission_classes = [IsLabManagerOrAdmin]

class TransferEquipmentView(APIView):
    permission_classes = [IsLabManagerOrAdmin]

    def post(self, request, *args, **kwargs):
        data = request.data
        equipment = get_object_or_404(Equipment, id=data['equipment_id'])
        from_lab = get_object_or_404(Lab, name=data['from_lab'])
        to_lab = get_object_or_404(Lab, name=data['to_lab'])
        equipment.current_lab = to_lab
        equipment.save()
        transfer = AssetTransfer.objects.create(
            equipment=equipment,
            from_lab=from_lab,
            to_lab=to_lab,
        )
        return Response({"message": "Equipment transferred successfully", "transfer_id": transfer.id}, status=status.HTTP_200_OK)


class MaintenanceRemindersListCreateView(generics.ListCreateAPIView):
    queryset = MaintenanceReminders.objects.all()
    serializer_class = MaintenanceRemindersSerializer
    permission_classes = [IsAdminLabManagerTechnician]

class MaintenanceRemindersDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MaintenanceReminders.objects.all()
    serializer_class = MaintenanceRemindersSerializer
    permission_classes = [IsAdminLabManagerTechnician]

class MaintenanceLogListCreateView(generics.ListCreateAPIView):
    queryset = MaintenanceLog.objects.all()
    serializer_class = MaintenanceLogSerializer
    permission_classes = [IsAdminLabManagerTechnician]

    def perform_create(self, serializer):
        serializer.save(technician=self.request.user)

class MaintenanceLogDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MaintenanceLog.objects.all()
    serializer_class = MaintenanceLogSerializer
    permission_classes = [IsAdminLabManagerTechnician]

class ProjectDocumentListCreateView(generics.ListCreateAPIView):
    queryset = ProjectDocument.objects.all()
    serializer_class = ProjectDocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role in [Users.RoleChoices.ADMIN, Users.RoleChoices.LAB_MANAGER, Users.RoleChoices.TECHNICIAN]:
            return ProjectDocument.objects.all()
        return ProjectDocument.objects.filter(project__members=self.request.user)

class ProjectDocumentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProjectDocument.objects.all()
    serializer_class = ProjectDocumentSerializer
    permission_classes = [IsAuthenticated]

class BackupLogListView(generics.ListAPIView):
    queryset = BackupLog.objects.all()
    serializer_class = BackupLogSerializer
    permission_classes = [IsAdminOrStaff]

class OfflineSyncView(APIView):
    permission_classes = [IsAdminOrStaff]

    def post(self, request):
        unsynced_transfers = AssetTransfer.objects.filter(is_synced=False)
        for transfer in unsynced_transfers:
            transfer.is_synced = True
            transfer.save()

        unsynced_equipment = Equipment.objects.filter(is_synced=False)
        for equipment in unsynced_equipment:
            equipment.is_synced = True
            equipment.save()

        return Response({"message": "Offline data synced successfully."}, status=status.HTTP_200_OK)