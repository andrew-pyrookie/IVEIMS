# from django.shortcuts import get_object_or_404
# from rest_framework import generics, permissions, status, viewsets
# from rest_framework.permissions import BasePermission, IsAuthenticated
# from django.core.exceptions import PermissionDenied
# from django.db import IntegrityError
# from rest_framework_simplejwt.tokens import RefreshToken
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from django.contrib.auth import get_user_model
# from .models import (
#     AssetTransfer, Equipment, Users, Project, Booking, Lab, ProjectAllocation,
#     BorrowRequest, MaintenanceReminders, MaintenanceLog, ProjectDocument, BackupLog
# )
# from .serializers import (
#     AssetTransfersSerializer, EquipmentSerializer, UsersSerializer, ProjectSerializer,
#     BookingSerializer, ProfileSerializer, LabSerializer, ProjectAllocationSerializer,
#     BorrowRequestSerializer, MaintenanceRemindersSerializer, MaintenanceLogSerializer,
#     ProjectDocumentSerializer, BackupLogSerializer
# )

# Users = get_user_model()

# class IsAdmin(BasePermission):
#     def has_permission(self, request, view):
#         return request.user.is_authenticated and request.user.role == 'admin'

# class IsLabManagerOrAdmin(BasePermission):
#     def has_permission(self, request, view):
#         return request.user.is_authenticated and request.user.role in ['admin', 'lab_manager']
    
# class IsStudent(BasePermission):
#     def has_permission(self, request, view):
#         return request.user.is_authenticated and request.user.role == 'student'

# class IsLabStaff(BasePermission):
#     def has_permission(self, request, view):
#         return request.user.is_authenticated and request.user.role in ['admin', 'lab_manager', 'technician']
#     def has_object_permission(self, request, view, obj):
#         if request.user.role == 'admin':
#             return True
#         if hasattr(obj, 'current_lab'):
#             return obj.current_lab == request.user.lab
#         if hasattr(obj, 'lab'):
#             return obj.lab == request.user.lab
#         return True

# class RegisterView(generics.CreateAPIView):
#     queryset = Users.objects.all()
#     serializer_class = UsersSerializer
#     permission_classes = [permissions.AllowAny]

#     def perform_create(self, serializer):
#         user = serializer.save()
#         refresh = RefreshToken.for_user(user)
#         self.request.data['refresh'] = str(refresh)
#         self.request.data['access'] = str(refresh.access_token)

# class LoginView(APIView):
#     permission_classes = [permissions.AllowAny]
#     def post(self, request, *args, **kwargs):
#         email = request.data.get("email")
#         password = request.data.get("password")
#         normalized_email = Users.objects.normalize_email(email)
#         user = Users.objects.filter(email=normalized_email).first()
#         if not user or not user.check_password(password):
#             return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
#         refresh = RefreshToken.for_user(user)
#         return Response({
#             "refresh": str(refresh),
#             "access": str(refresh.access_token),
#             "user": {"id": user.id, "role": user.role, "lab": user.lab.get_full_name() if user.lab else None},
#         }, status=status.HTTP_200_OK)

# class LogoutView(APIView):
#     permission_classes = [permissions.IsAuthenticated]
#     def post(self, request):
#         try:
#             refresh_token = request.data["refresh"]
#             token = RefreshToken(refresh_token)
#             token.blacklist()
#             return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

# class ProfileView(generics.RetrieveUpdateAPIView):
#     serializer_class = ProfileSerializer
#     permission_classes = [IsAuthenticated]
#     def get_object(self):
#         return self.request.user

# class DashboardView(APIView):
#     permission_classes = [IsAuthenticated]
#     def get(self, request):
#         user = request.user
#         data = {"role": user.role}
#         if user.role == 'admin':
#             data.update({
#                 "users": Users.objects.count(),
#                 "labs": Lab.objects.count(),
#                 "equipment": Equipment.objects.count(),
#                 "projects": Project.objects.count(),
#                 "pending_bookings": Booking.objects.filter(status='pending').count(),
#             })
#         elif user.role == 'lab_manager':
#             lab = user.lab
#             equipment = EquipmentSerializer(Equipment.objects.filter(current_lab=lab), many=True).data
#             data.update({
#                 "lab": lab.get_full_name(),
#                 "equipment": equipment,
#                 "projects": Project.objects.filter(lab=lab).count(),
#                 "transfers": AssetTransfer.objects.filter(from_lab=lab).count(),
#                 "pending_bookings": Booking.objects.filter(lab_space=lab, status='pending').count(),
#             })
#         elif user.role == 'technician':
#             lab = user.lab
#             equipment_qs = Equipment.objects.filter(current_lab=lab) if lab else Equipment.objects.all()
#             data.update({
#                 "lab": lab.get_full_name() if lab else "All Labs",
#                 "equipment_maintenance": equipment_qs.filter(status='maintenance').count(),
#                 "pending_reminders": MaintenanceReminders.objects.filter(status='pending').count(),
#             })
#         elif user.role == 'student':
#             projects = ProjectSerializer(Project.objects.filter(members=user), many=True).data
#             bookings = BookingSerializer(Booking.objects.filter(user=user), many=True).data
#             data.update({
#                 "projects": projects,
#                 "bookings": bookings,
#             })
#         return Response(data)

# class LabListCreateView(generics.ListCreateAPIView):
#     queryset = Lab.objects.all()
#     serializer_class = LabSerializer
#     permission_classes = [IsAdmin]

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         try:
#             self.perform_create(serializer)
#         except IntegrityError as e:
#             return Response(
#                 {"detail": f"Lab with name '{request.data.get('name')}' already exists."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
#         headers = self.get_success_headers(serializer.data)
#         return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

# class LabDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Lab.objects.all()
#     serializer_class = LabSerializer
#     permission_classes = [IsAdmin]


# class EquipmentListCreateView(generics.ListCreateAPIView):
#     serializer_class = EquipmentSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         user = self.request.user
#         if user.role == 'admin':
#             return Equipment.objects.all()
#         elif user.role in ['lab_manager', 'technician']:
#             return Equipment.objects.filter(current_lab=user.lab)
#         elif user.role == 'student':
#             return Equipment.objects.filter(status='available')
#         return Equipment.objects.none()

#     def perform_create(self, serializer):
#         if self.request.user.role not in ['admin', 'lab_manager', 'technician']:
#             raise PermissionDenied("Only staff can create equipment.")
#         serializer.save()

# class EquipmentByLabView(generics.ListAPIView):
#     serializer_class = EquipmentSerializer
#     permission_classes = [IsAuthenticated]
#     def get_queryset(self):
#         user = self.request.user
#         lab_id = self.kwargs['lab_id']
#         lab = get_object_or_404(Lab, id=lab_id)
#         queryset = Equipment.objects.filter(current_lab=lab)
#         if user.role == 'admin':
#             return queryset
#         elif user.role in ['lab_manager', 'technician']:
#             if user.lab != lab:
#                 raise PermissionDenied("You can only view your lab's equipment.")
#             return queryset
#         elif user.role == 'student':
#             return queryset.filter(status='available')
#         return queryset.none()

# class EquipmentDetailView(generics.RetrieveUpdateDestroyAPIView):
#     serializer_class = EquipmentSerializer
#     permission_classes = [IsLabStaff]
#     def get_queryset(self):
#         user = self.request.user
#         if user.role == 'admin':
#             return Equipment.objects.all()
#         elif user.role in ['lab_manager', 'technician']:
#             return Equipment.objects.filter(current_lab=user.lab)
#         return Equipment.objects.none()

# class UserListView(generics.ListAPIView):
#     queryset = Users.objects.all()
#     serializer_class = UsersSerializer
#     permission_classes = [IsAdmin]

# class UserDetailView(generics.RetrieveUpdateAPIView):
#     queryset = Users.objects.all()
#     serializer_class = UsersSerializer
#     permission_classes = [IsAdmin]

# class ProjectListCreateView(generics.ListCreateAPIView):
#     serializer_class = ProjectSerializer
#     permission_classes = [IsAuthenticated]
#     def get_queryset(self):
#         user = self.request.user
#         if user.role == 'admin':
#             return Project.objects.all()
#         elif user.role in ['lab_manager', 'technician']:
#             return Project.objects.filter(lab=user.lab)
#         elif user.role == 'student':
#             return Project.objects.filter(members=user)
#         return Project.objects.none()
#     def perform_create(self, serializer):
#         if self.request.user.role not in ['admin', 'lab_manager']:
#             raise PermissionDenied("Only Admin or Lab Manager can create projects.")
#         serializer.save()

# class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
#     serializer_class = ProjectSerializer
#     permission_classes = [IsLabManagerOrAdmin]
#     def get_queryset(self):
#         user = self.request.user
#         if user.role == 'admin':
#             return Project.objects.all()
#         elif user.role == 'lab_manager':
#             return Project.objects.filter(lab=user.lab)
#         return Project.objects.none()

# class ProjectAllocationListCreateView(generics.ListCreateAPIView):
#     queryset = ProjectAllocation.objects.all()
#     serializer_class = ProjectAllocationSerializer
#     permission_classes = [IsLabManagerOrAdmin]
#     def perform_create(self, serializer):
#         serializer.save(allocated_by=self.request.user)

# class ProjectAllocationDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = ProjectAllocation.objects.all()
#     serializer_class = ProjectAllocationSerializer
#     permission_classes = [IsLabManagerOrAdmin]

# # class BookingViewSet(viewsets.ModelViewSet):
# #     serializer_class = BookingSerializer
# #     permission_classes = [IsAuthenticated]
# #     def get_queryset(self):
# #         user = self.request.user
# #         if user.role in ['admin', 'lab_manager', 'technician']:
# #             return Booking.objects.filter(lab_space=user.lab) if user.lab else Booking.objects.all()
# #         return Booking.objects.filter(user=user)
# #     def perform_create(self, serializer):
# #         serializer.save(user=self.request.user)
# #     def perform_update(self, serializer):
# #         if 'status' in serializer.validated_data and serializer.validated_data['status'] in ['approved', 'rejected']:
# #             if self.request.user.role not in ['admin', 'lab_manager', 'technician']:
# #                 raise PermissionDenied("Only staff can approve/reject bookings.")
# #         serializer.save()
# from rest_framework.exceptions import ValidationError, PermissionDenied
# from django.core.exceptions import ValidationError as DjangoValidationError

# class BookingViewSet(viewsets.ModelViewSet):
#     serializer_class = BookingSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         user = self.request.user
#         if user.role in ['admin', 'lab_manager', 'technician']:
#             return Booking.objects.filter(lab_space=user.lab) if user.lab else Booking.objects.all()
#         return Booking.objects.filter(user=user)

#     def perform_create(self, serializer):
#         """Handle booking creation and catch validation errors properly."""
#         try:
#             serializer.save(user=self.request.user)
#         except DjangoValidationError as e:
#             raise ValidationError({"error": e.messages})  # Returns 400 instead of 500

#     def perform_update(self, serializer):
#         """Ensure only staff can approve/reject bookings."""
#         if 'status' in serializer.validated_data and serializer.validated_data['status'] in ['approved', 'rejected']:
#             if self.request.user.role not in ['admin', 'lab_manager', 'technician']:
#                 raise PermissionDenied("Only staff can approve/reject bookings.")
#         serializer.save()

# class BorrowRequestListCreateView(generics.ListCreateAPIView):
#     queryset = BorrowRequest.objects.all()
#     serializer_class = BorrowRequestSerializer
#     permission_classes = [IsAuthenticated]
#     def perform_create(self, serializer):
#         serializer.save(requested_by=self.request.user)

# class BorrowRequestDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = BorrowRequest.objects.all()
#     serializer_class = BorrowRequestSerializer
#     permission_classes = [IsLabManagerOrAdmin]

# class AssetTransferListCreateView(generics.ListCreateAPIView):
#     queryset = AssetTransfer.objects.all()
#     serializer_class = AssetTransfersSerializer
#     permission_classes = [IsLabManagerOrAdmin]

# class AssetTransferDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = AssetTransfer.objects.all()
#     serializer_class = AssetTransfersSerializer
#     permission_classes = [IsLabManagerOrAdmin]

# class TransferEquipmentView(APIView):
#     permission_classes = [IsLabManagerOrAdmin]
#     def post(self, request):
#         equipment_id = request.data.get('equipment_id')
#         to_lab_name = request.data.get('to_lab')
#         equipment = get_object_or_404(Equipment, id=equipment_id)
#         to_lab = get_object_or_404(Lab, name=to_lab_name)
#         from_lab = equipment.current_lab
#         equipment.current_lab = to_lab
#         equipment.save()
#         transfer = AssetTransfer.objects.create(
#             equipment=equipment, 
#             from_lab=from_lab, 
#             to_lab=to_lab, 
#             transferred_by=request.user
#         )
#         return Response({"message": "Equipment transferred", "transfer_id": transfer.id}, status=status.HTTP_200_OK)

# class MaintenanceRemindersListCreateView(generics.ListCreateAPIView):
#     queryset = MaintenanceReminders.objects.all()
#     serializer_class = MaintenanceRemindersSerializer
#     permission_classes = [IsLabStaff]

# class MaintenanceRemindersDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = MaintenanceReminders.objects.all()
#     serializer_class = MaintenanceRemindersSerializer
#     permission_classes = [IsLabStaff]

# class MaintenanceLogListCreateView(generics.ListCreateAPIView):
#     queryset = MaintenanceLog.objects.all()
#     serializer_class = MaintenanceLogSerializer
#     permission_classes = [IsLabStaff]
#     def perform_create(self, serializer):
#         serializer.save(technician=self.request.user)

# class MaintenanceLogDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = MaintenanceLog.objects.all()
#     serializer_class = MaintenanceLogSerializer
#     permission_classes = [IsLabStaff]

# class ProjectDocumentListCreateView(generics.ListCreateAPIView):
#     queryset = ProjectDocument.objects.all()
#     serializer_class = ProjectDocumentSerializer
#     permission_classes = [IsAuthenticated]
#     def get_queryset(self):
#         if self.request.user.role in [Users.RoleChoices.ADMIN, Users.RoleChoices.LAB_MANAGER, Users.RoleChoices.TECHNICIAN]:
#             return ProjectDocument.objects.all()
#         return ProjectDocument.objects.filter(project__members=self.request.user)

# class ProjectDocumentDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = ProjectDocument.objects.all()
#     serializer_class = ProjectDocumentSerializer
#     permission_classes = [IsLabManagerOrAdmin]

# class BackupLogListView(generics.ListAPIView):
#     queryset = BackupLog.objects.all()
#     serializer_class = BackupLogSerializer
#     permission_classes = [IsAdmin]

# class OfflineSyncView(APIView):
#     permission_classes = [IsAdmin]
#     def post(self, request):
#         unsynced_transfers = AssetTransfer.objects.filter(is_synced=False)
#         for transfer in unsynced_transfers:
#             transfer.is_synced = True
#             transfer.save()
#         unsynced_equipment = Equipment.objects.filter(is_synced=False)
#         for equipment in unsynced_equipment:
#             equipment.is_synced = True
#             equipment.save()
#         return Response({"message": "Offline data synced successfully."}, status=status.HTTP_200_OK)
from django.shortcuts import get_object_or_404
from django.conf import settings
from datetime import datetime
from django.utils.timezone import now
from rest_framework import generics, permissions, status, viewsets
from rest_framework.permissions import BasePermission, IsAuthenticated
from django.core.exceptions import PermissionDenied
from django.db import IntegrityError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
import os
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

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class IsLabManagerOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'lab_manager']
    
class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'student'

class IsLabStaff(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'lab_manager', 'technician']
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        if hasattr(obj, 'current_lab'):
            return obj.current_lab == request.user.lab
        if hasattr(obj, 'lab'):
            return obj.lab == request.user.lab
        return True
    
class IsApproved(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.user.role == 'admin' or request.user.approved:
            return True
        # Unapproved users can only use safe methods (GET)
        return request.method in permissions.SAFE_METHODS

class RegisterView(generics.CreateAPIView):
    queryset = Users.objects.all()
    serializer_class = UsersSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        self.request.data['refresh'] = str(refresh)
        self.request.data['access'] = str(refresh.access_token)

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
            "user": {"id": user.id, "role": user.role, "lab": user.lab.get_full_name() if user.lab else None},
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
    permission_classes = [IsAuthenticated]
    def get_object(self):
        return self.request.user

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        data = {"role": user.role}
        if not user.approved and user.role != 'admin':
            data.update({
                "message": "Your account is pending approval. Please wait for an admin to approve.",
                "labs": Lab.objects.count(),
                "available_equipment": Equipment.objects.filter(status='available').count()
            })
        elif user.role == 'admin':
            data.update({
                "users": Users.objects.count(),
                "labs": Lab.objects.count(),
                "equipment": Equipment.objects.count(),
                "projects": Project.objects.count(),
                "pending_bookings": Booking.objects.filter(status='pending').count(),
                "pending_users": Users.objects.filter(approved=False).count()  # Add this
            })
        elif user.role == 'lab_manager':
            lab = user.lab
            equipment = EquipmentSerializer(Equipment.objects.filter(current_lab=lab), many=True).data
            data.update({
                "lab": lab.get_full_name(),
                "equipment": equipment,
                "projects": Project.objects.filter(lab=lab).count(),
                "transfers": AssetTransfer.objects.filter(from_lab=lab).count(),
                "pending_bookings": Booking.objects.filter(lab_space=lab, status='pending').count(),
            })
        elif user.role == 'technician':
            lab = user.lab
            equipment_qs = Equipment.objects.filter(current_lab=lab) if lab else Equipment.objects.all()
            data.update({
                "lab": lab.get_full_name() if lab else "All Labs",
                "equipment_maintenance": equipment_qs.filter(status='maintenance').count(),
                "pending_reminders": MaintenanceReminders.objects.filter(status='pending').count(),
            })
        elif user.role == 'student':
            projects = ProjectSerializer(Project.objects.filter(members=user), many=True).data
            bookings = BookingSerializer(Booking.objects.filter(user=user), many=True).data
            data.update({
                "projects": projects,
                "bookings": bookings,
            })
        return Response(data)

class LabListCreateView(generics.ListCreateAPIView):
    queryset = Lab.objects.all()
    serializer_class = LabSerializer
    permission_classes = [IsAdmin]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            self.perform_create(serializer)
        except IntegrityError as e:
            return Response(
                {"detail": f"Lab with name '{request.data.get('name')}' already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class LabDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Lab.objects.all()
    serializer_class = LabSerializer
    permission_classes = [IsAdmin]


class EquipmentListCreateView(generics.ListCreateAPIView):
    serializer_class = EquipmentSerializer
    permission_classes = [IsAuthenticated, IsApproved]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Equipment.objects.all()
        elif user.role in ['lab_manager', 'technician']:
            return Equipment.objects.filter(current_lab=user.lab)
        elif user.role == 'student':
            return Equipment.objects.filter(status='available')
        return Equipment.objects.none()

    def perform_create(self, serializer):
        if self.request.user.role not in ['admin', 'lab_manager', 'technician']:
            raise PermissionDenied("Only staff can create equipment.")
        serializer.save()

class EquipmentByLabView(generics.ListAPIView):
    serializer_class = EquipmentSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        lab_id = self.kwargs['lab_id']
        lab = get_object_or_404(Lab, id=lab_id)
        queryset = Equipment.objects.filter(current_lab=lab)
        if user.role == 'admin':
            return queryset
        elif user.role in ['lab_manager', 'technician']:
            if user.lab != lab:
                raise PermissionDenied("You can only view your lab's equipment.")
            return queryset
        elif user.role == 'student':
            return queryset.filter(status='available')
        return queryset.none()

class EquipmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EquipmentSerializer
    permission_classes = [IsLabStaff]
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Equipment.objects.all()
        elif user.role in ['lab_manager', 'technician']:
            return Equipment.objects.filter(current_lab=user.lab)
        return Equipment.objects.none()

class UserListView(generics.ListAPIView):
    queryset = Users.objects.all()
    serializer_class = UsersSerializer
    permission_classes = [IsAdmin]

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = Users.objects.all()
    serializer_class = UsersSerializer
    permission_classes = [IsAdmin]

class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsApproved]
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Project.objects.all()
        elif user.role in ['lab_manager', 'technician']:
            return Project.objects.filter(lab=user.lab)
        elif user.role == 'student':
            return Project.objects.filter(members=user)
        return Project.objects.none()
    def perform_create(self, serializer):
        if self.request.user.role not in ['admin', 'lab_manager']:
            raise PermissionDenied("Only Admin or Lab Manager can create projects.")
        serializer.save()

class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsLabManagerOrAdmin]
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Project.objects.all()
        elif user.role == 'lab_manager':
            return Project.objects.filter(lab=user.lab)
        return Project.objects.none()

class ProjectAllocationListCreateView(generics.ListCreateAPIView):
    queryset = ProjectAllocation.objects.all()
    serializer_class = ProjectAllocationSerializer
    permission_classes = [IsLabManagerOrAdmin]
    def perform_create(self, serializer):
        serializer.save(allocated_by=self.request.user)

class ProjectAllocationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProjectAllocation.objects.all()
    serializer_class = ProjectAllocationSerializer
    permission_classes = [IsLabManagerOrAdmin]


from rest_framework.exceptions import ValidationError, PermissionDenied
from django.core.exceptions import ValidationError as DjangoValidationError

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated, IsApproved]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'lab_manager', 'technician']:
            return Booking.objects.filter(lab_space=user.lab) if user.lab else Booking.objects.all()
        return Booking.objects.filter(user=user)

    def perform_create(self, serializer):
        """Handle booking creation and catch validation errors properly."""
        try:
            serializer.save(user=self.request.user)
        except DjangoValidationError as e:
            raise ValidationError({"error": e.messages})  # Returns 400 instead of 500

    def perform_update(self, serializer):
        """Ensure only staff can approve/reject bookings."""
        if 'status' in serializer.validated_data and serializer.validated_data['status'] in ['approved', 'rejected']:
            if self.request.user.role not in ['admin', 'lab_manager', 'technician']:
                raise PermissionDenied("Only staff can approve/reject bookings.")
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
    permission_classes = [IsLabManagerOrAdmin, IsApproved]

class AssetTransferDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AssetTransfer.objects.all()
    serializer_class = AssetTransfersSerializer
    permission_classes = [IsLabManagerOrAdmin]

class TransferEquipmentView(APIView):
    permission_classes = [IsLabManagerOrAdmin]
    def post(self, request):
        equipment_id = request.data.get('equipment_id')
        to_lab_name = request.data.get('to_lab')
        equipment = get_object_or_404(Equipment, id=equipment_id)
        to_lab = get_object_or_404(Lab, name=to_lab_name)
        from_lab = equipment.current_lab
        equipment.current_lab = to_lab
        equipment.save()
        transfer = AssetTransfer.objects.create(
            equipment=equipment, 
            from_lab=from_lab, 
            to_lab=to_lab, 
            transferred_by=request.user
        )
        return Response({"message": "Equipment transferred", "transfer_id": transfer.id}, status=status.HTTP_200_OK)

class MaintenanceRemindersListCreateView(generics.ListCreateAPIView):
    queryset = MaintenanceReminders.objects.all()
    serializer_class = MaintenanceRemindersSerializer
    permission_classes = [IsLabStaff]

class MaintenanceRemindersDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MaintenanceReminders.objects.all()
    serializer_class = MaintenanceRemindersSerializer
    permission_classes = [IsLabStaff]

class MaintenanceLogListCreateView(generics.ListCreateAPIView):
    queryset = MaintenanceLog.objects.all()
    serializer_class = MaintenanceLogSerializer
    permission_classes = [IsLabStaff]
    def perform_create(self, serializer):
        serializer.save(technician=self.request.user)

class MaintenanceLogDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MaintenanceLog.objects.all()
    serializer_class = MaintenanceLogSerializer
    permission_classes = [IsLabStaff]

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
    permission_classes = [IsLabManagerOrAdmin]

class BackupLogListView(generics.ListAPIView):
    queryset = BackupLog.objects.all()
    serializer_class = BackupLogSerializer
    permission_classes = [IsAdmin]

class OfflineSyncView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request):
        # Sync offline AssetTransfers
        unsynced_transfers = AssetTransfer.objects.filter(is_synced=False)
        transfer_count = unsynced_transfers.count()
        for transfer in unsynced_transfers:
            transfer.is_synced = True
            transfer.save()

        # Sync offline Equipment
        unsynced_equipment = Equipment.objects.filter(is_synced=False)
        equipment_count = unsynced_equipment.count()
        for equipment in unsynced_equipment:
            equipment.is_synced = True
            equipment.save()

        # Create a backup log entry
        backup_file_name = f"backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.bak"
        backup_path = os.path.join(settings.MEDIA_ROOT, 'backups', backup_file_name)
        os.makedirs(os.path.dirname(backup_path), exist_ok=True)  # Ensure directory exists
        # Simulate backup creation (replace with real DB dump in production)
        with open(backup_path, 'w') as f:
            f.write("Simulated backup data")

        BackupLog.objects.create(
            status='success',
            file_path=backup_path
        )

        # Response
        message = f"Offline data synced successfully. Synced {transfer_count} transfers and {equipment_count} equipment items."
        return Response({"message": message}, status=status.HTTP_200_OK)