from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.decorators import api_view

from .views import (
    AssetTransfersListCreateView, AssetTransfersDetailView,
    EquipmentListCreateView, EquipmentDetailView,
    UserListView, UserDetailView, TransferEquipmentView, 
    RegisterView, LoginView, LogoutView,
    ProjectListCreateView, ProjectDetailView, 
    OfflineSyncView, BookingViewSet
)

# Initialize DefaultRouter for ViewSets
router = DefaultRouter()
router.register(r'bookings', BookingViewSet, basename='booking')

@api_view(['GET'])
def api_root(request):
    return Response({
        "asset_transfers": request.build_absolute_uri('/api/asset-transfers/'),
        "equipment": request.build_absolute_uri('/api/equipment/'),
        "users": request.build_absolute_uri('/api/users/'),
        "transfer_equipment": request.build_absolute_uri('/api/transfer-equipment/'),
        "projects": request.build_absolute_uri('/api/projects/'),
        "bookings": request.build_absolute_uri('/api/bookings/'),
        "sync_offline_data": request.build_absolute_uri('/api/sync-offline-data/'),
        "auth": {
            "register": request.build_absolute_uri('/api/register/'),
            "login": request.build_absolute_uri('/api/login/'),
            "logout": request.build_absolute_uri('/api/logout/'),
            "token_refresh": request.build_absolute_uri('/api/token/refresh/'),
        }
    })

urlpatterns = [
    # API Root & Authentication
    path('', api_root, name='api-root'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    # Asset Transfers
    path('asset-transfers/', AssetTransfersListCreateView.as_view(), name='asset-transfers-list'),
    path('asset-transfers/<int:pk>/', AssetTransfersDetailView.as_view(), name='asset-transfers-detail'),

    # Equipment
    path('equipment/', EquipmentListCreateView.as_view(), name='equipment-list'),
    path('equipment/<int:pk>/', EquipmentDetailView.as_view(), name='equipment-detail'),

    # Users
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),

    # Projects
    path('projects/', ProjectListCreateView.as_view(), name='project-list'),
    path('projects/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),

    # Transfer Equipment
    path('transfer-equipment/', TransferEquipmentView.as_view(), name='transfer-equipment'),

    # Offline Sync
    path('sync-offline-data/', OfflineSyncView.as_view(), name='sync-offline-data'),

    # Include Router URLs (Bookings)
    path('', include(router.urls)),
]