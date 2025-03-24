from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.response import Response
from .views import EquipmentByQRCodeView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.decorators import api_view
from .views import (
    RegisterView, LoginView, LogoutView, ProfileView, DashboardView,
    LabListCreateView, LabDetailView,
    UserListView, UserDetailView,
    EquipmentListCreateView, EquipmentDetailView, TransferEquipmentView, EquipmentByLabView,
    ProjectListCreateView, ProjectDetailView,
    ProjectAllocationListCreateView, ProjectAllocationDetailView,
    BookingViewSet,
    BorrowRequestListCreateView, BorrowRequestDetailView,
    AssetTransferListCreateView, AssetTransferDetailView,
    MaintenanceRemindersListCreateView, MaintenanceRemindersDetailView,
    MaintenanceLogListCreateView, MaintenanceLogDetailView,
    ProjectDocumentListCreateView, ProjectDocumentDetailView,
    BackupLogListView,
    OfflineSyncView,
)

router = DefaultRouter()
router.register(r'bookings', BookingViewSet, basename='booking')

@api_view(['GET'])
def api_root(request):
    base_url = request.build_absolute_uri('/api/')
    return Response({
        "dashboard": f"{base_url}dashboard/",
        "labs": f"{base_url}labs/",
        "users": f"{base_url}users/",
        "equipment": f"{base_url}equipment/",
        "equipment-by-lab": f"{base_url}equipment/by-lab/<lab_id>/",
        "projects": f"{base_url}projects/",
        "project-allocations": f"{base_url}project-allocations/",
        "bookings": f"{base_url}bookings/",
        "borrow-requests": f"{base_url}borrow-requests/",
        "asset-transfers": f"{base_url}asset-transfers/",
        "maintenance-reminders": f"{base_url}maintenance/reminders/",
        "maintenance-logs": f"{base_url}maintenance/logs/",
        "project-documents": f"{base_url}project-documents/",
        "admin": {
            "backup-logs": f"{base_url}admin/backup-logs/",
            "sync-offline-data": f"{base_url}admin/sync-offline-data/",
        },
        "transfer-equipment": f"{base_url}transfer-equipment/",
        "auth": {
            "register": f"{base_url}auth/register/",
            "login": f"{base_url}auth/login/",
            "logout": f"{base_url}auth/logout/",
            "token_refresh": f"{base_url}auth/token/refresh/",
            "profile": f"{base_url}auth/profile/",
        }
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('auth/', include([
        path('register/', RegisterView.as_view(), name='register'),
        path('login/', LoginView.as_view(), name='login'),
        path('logout/', LogoutView.as_view(), name='logout'),
        path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
        path('profile/', ProfileView.as_view(), name='profile'),
    ])),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('labs/', include([
        path('', LabListCreateView.as_view(), name='lab-list'),
        path('<int:pk>/', LabDetailView.as_view(), name='lab-detail'),
    ])),
    path('users/', include([
        path('', UserListView.as_view(), name='user-list'),
        path('<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    ])),
    path('equipment/', include([
        path('', EquipmentListCreateView.as_view(), name='equipment-list'),
        path('<int:pk>/', EquipmentDetailView.as_view(), name='equipment-detail'),
        path('by-lab/<int:lab_id>/', EquipmentByLabView.as_view(), name='equipment-by-lab'),
        path('by-qr/', EquipmentByQRCodeView.as_view(), name='equipment-by-qr'),  # New endpoint
    ])),
    path('transfer-equipment/', TransferEquipmentView.as_view(), name='transfer-equipment'),
    path('projects/', include([
        path('', ProjectListCreateView.as_view(), name='project-list'),
        path('<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    ])),
    path('project-allocations/', include([
        path('', ProjectAllocationListCreateView.as_view(), name='project-allocation-list'),
        path('<int:pk>/', ProjectAllocationDetailView.as_view(), name='project-allocation-detail'),
    ])),
    path('borrow-requests/', include([
        path('', BorrowRequestListCreateView.as_view(), name='borrow-request-list'),
        path('<int:pk>/', BorrowRequestDetailView.as_view(), name='borrow-request-detail'),
    ])),
    path('asset-transfers/', include([
        path('', AssetTransferListCreateView.as_view(), name='asset-transfers-list'),
        path('<int:pk>/', AssetTransferDetailView.as_view(), name='asset-transfers-detail'),
    ])),
    path('maintenance/', include([
        path('reminders/', MaintenanceRemindersListCreateView.as_view(), name='maintenance-reminders-list'),
        path('reminders/<int:pk>/', MaintenanceRemindersDetailView.as_view(), name='maintenance-reminders-detail'),
        path('logs/', MaintenanceLogListCreateView.as_view(), name='maintenance-logs-list'),
        path('logs/<int:pk>/', MaintenanceLogDetailView.as_view(), name='maintenance-logs-detail'),
    ])),
    path('project-documents/', include([
        path('', ProjectDocumentListCreateView.as_view(), name='project-document-list'),
        path('<int:pk>/', ProjectDocumentDetailView.as_view(), name='project-document-detail'),
    ])),
    path('admin/', include([
        path('backup-logs/', BackupLogListView.as_view(), name='backup-logs-list'),
        path('sync-offline-data/', OfflineSyncView.as_view(), name='sync-offline-data'),
    ])),
    path('', include(router.urls)),
]