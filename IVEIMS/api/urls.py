from django.urls import path
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .views import (
    AssetTransfersListCreateView, AssetTransfersDetailView,
    EquipmentListCreateView, EquipmentDetailView,
    UserListView, UserDetailView, TransferEquipmentView
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
    path('asset-transfers/', AssetTransfersListCreateView.as_view(), name='asset-transfers-list'),
    path('asset-transfers/<int:pk>/', AssetTransfersDetailView.as_view(), name='asset-transfers-detail'),
    path('equipment/', EquipmentListCreateView.as_view(), name='equipment-list'),
    path('equipment/<int:pk>/', EquipmentDetailView.as_view(), name='equipment-detail'),
    path('users/', UserListView.as_view(), name='users-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='users-detail'),
    path('transfer-equipment/', TransferEquipmentView.as_view(), name='transfer-equipment'),
]