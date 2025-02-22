from django.urls import path
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.decorators import api_view
from .views import (
    AssetTransfersListCreateView, AssetTransfersDetailView,
    EquipmentListCreateView, EquipmentDetailView,
    UserListView, UserDetailView, TransferEquipmentView, RegisterView, LoginView, LogoutView,
    ProjectListCreateView, ProjectDetailView, OfflineSyncView
)

@api_view(['GET'])
def api_root(request):
    return Response({
        "asset_transfers": "/api/asset-transfers/",
        "equipment": "/api/equipment/",
        "users": "/api/users/",
        "transfer_equipment": "/api/transfer-equipment/"
    })

urlpatterns = [
    path('', api_root, name='api-root'),  # This line adds the root API endpoint
    
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('asset-transfers/', AssetTransfersListCreateView.as_view(), name='asset-transfers-list'),
    path('asset-transfers/<int:pk>/', AssetTransfersDetailView.as_view(), name='asset-transfers-detail'),
    path('equipment/', EquipmentListCreateView.as_view(), name='equipment-list'),
    path('equipment/<int:pk>/', EquipmentDetailView.as_view(), name='equipment-detail'),
    path('users/', UserListView.as_view(), name='users-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='users-detail'),
    path('transfer-equipment/', TransferEquipmentView.as_view(), name='transfer-equipment'),
    path('projects/', ProjectListCreateView.as_view(), name='project-list'),
    path('projects/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    path("sync-offline-data/", OfflineSyncView.as_view(), name="sync_offline_data"),
]