from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.decorators import api_view
from .views import (
    # Authentication & Profile
    RegisterView, LoginView, LogoutView, ProfileView, DashboardView,
    # Labs
    LabListCreateView, LabDetailView,
    # Users
    UserListView, UserDetailView,
    # Equipment
    EquipmentListCreateView, EquipmentDetailView, TransferEquipmentView, EquipmentByLabView,
    # Projects
    ProjectListCreateView, ProjectDetailView,
    # Project Allocation
    ProjectAllocationListCreateView, ProjectAllocationDetailView,
    # Bookings
    BookingViewSet,
    # Borrow Requests
    BorrowRequestListCreateView, BorrowRequestDetailView,
    # Asset Transfers
    AssetTransferListCreateView, AssetTransferDetailView,
    # Maintenance
    MaintenanceRemindersListCreateView, MaintenanceRemindersDetailView,
    MaintenanceLogListCreateView, MaintenanceLogDetailView,
    # Project Documents
    ProjectDocumentListCreateView, ProjectDocumentDetailView,
    # Backup Logs
    BackupLogListView,
    # Offline Sync
    OfflineSyncView,
)

# Initialize DefaultRouter for ViewSets
router = DefaultRouter()
router.register(r'bookings', BookingViewSet, basename='booking')

@api_view(['GET'])
def api_root(request):
    return Response({
        "dashboard": request.build_absolute_uri('/api/dashboard/'),
        "labs": request.build_absolute_uri('/api/labs/'),
        "users": request.build_absolute_uri('/api/users/'),
        "equipment": request.build_absolute_uri('/api/equipment/'),
        "projects": request.build_absolute_uri('/api/projects/'),
        "project-allocations": request.build_absolute_uri('/api/project-allocations/'),
        "bookings": request.build_absolute_uri('/api/bookings/'),
        "borrow-requests": request.build_absolute_uri('/api/borrow-requests/'),
        "asset-transfers": request.build_absolute_uri('/api/asset-transfers/'),
        "maintenance-reminders": request.build_absolute_uri('/api/maintenance-reminders/'),
        "maintenance-logs": request.build_absolute_uri('/api/maintenance-logs/'),
        "project-documents": request.build_absolute_uri('/api/project-documents/'),
        "backup-logs": request.build_absolute_uri('/api/backup-logs/'),
        "sync-offline-data": request.build_absolute_uri('/api/sync-offline-data/'),
        "transfer-equipment": request.build_absolute_uri('/api/transfer-equipment/'),
        "auth": {
            "register": request.build_absolute_uri('/api/auth/register/'),
            "login": request.build_absolute_uri('/api/auth/login/'),
            "logout": request.build_absolute_uri('/api/auth/logout/'),
            "token_refresh": request.build_absolute_uri('/api/auth/token/refresh/'),
            "profile": request.build_absolute_uri('/api/auth/profile/'),
        }
    })

urlpatterns = [
    # API Root
    path('', api_root, name='api-root'),

    # Authentication & Profile
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/profile/', ProfileView.as_view(), name='profile'),

    # Dashboard (Role-Specific)
    path('dashboard/', DashboardView.as_view(), name='dashboard'),

    # Labs (Admin Only for Creation)
    path('labs/', LabListCreateView.as_view(), name='lab-list'),
    path('labs/<int:pk>/', LabDetailView.as_view(), name='lab-detail'),

    # Users (Admin Only for Creation)
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),

    # Equipment
    path('equipment/', EquipmentListCreateView.as_view(), name='equipment-list'),
    path('equipment/<int:pk>/', EquipmentDetailView.as_view(), name='equipment-detail'),
    path('equipment/by-lab/<int:lab_id>/', EquipmentByLabView.as_view(), name='equipment-by-lab'),
    path('transfer-equipment/', TransferEquipmentView.as_view(), name='transfer-equipment'),

    # Projects (Admin Creates, Others View/Manage)
    path('projects/', ProjectListCreateView.as_view(), name='project-list'),
    path('projects/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),

    # Project Allocations (Admin, Lab Manager, Technician)
    path('project-allocations/', ProjectAllocationListCreateView.as_view(), name='project-allocation-list'),
    path('project-allocations/<int:pk>/', ProjectAllocationDetailView.as_view(), name='project-allocation-detail'),

    # Borrow Requests
    path('borrow-requests/', BorrowRequestListCreateView.as_view(), name='borrow-request-list'),
    path('borrow-requests/<int:pk>/', BorrowRequestDetailView.as_view(), name='borrow-request-detail'),

    # Asset Transfers
    path('asset-transfers/', AssetTransferListCreateView.as_view(), name='asset-transfers-list'),
    path('asset-transfers/<int:pk>/', AssetTransferDetailView.as_view(), name='asset-transfers-detail'),

    # Maintenance Reminders (Admin, Lab Manager, Technician)
    path('maintenance-reminders/', MaintenanceRemindersListCreateView.as_view(), name='maintenance-reminders-list'),
    path('maintenance-reminders/<int:pk>/', MaintenanceRemindersDetailView.as_view(), name='maintenance-reminders-detail'),

    # Maintenance Logs (Admin, Lab Manager, Technician)
    path('maintenance-logs/', MaintenanceLogListCreateView.as_view(), name='maintenance-logs-list'),
    path('maintenance-logs/<int:pk>/', MaintenanceLogDetailView.as_view(), name='maintenance-logs-detail'),

    # Project Documents
    path('project-documents/', ProjectDocumentListCreateView.as_view(), name='project-document-list'),
    path('project-documents/<int:pk>/', ProjectDocumentDetailView.as_view(), name='project-document-detail'),

    # Backup Logs (Admin Only)
    path('backup-logs/', BackupLogListView.as_view(), name='backup-logs-list'),

    # Offline Sync (Admin Only)
    path('sync-offline-data/', OfflineSyncView.as_view(), name='sync-offline-data'),

    # Bookings (Router for ViewSet)
    path('', include(router.urls)),
]