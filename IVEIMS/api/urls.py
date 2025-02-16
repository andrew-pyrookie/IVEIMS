from django.urls import path
from .views import (
    AssetTransfersListCreateView, AssetTransfersDetailView,
    EquipmentListCreateView, EquipmentDetailView,
    UserListView, UserDetailView, TransferEquipmentView
)

urlpatterns = [
    # AssetTransfers URLs
    path('asset-transfers/', AssetTransfersListCreateView.as_view(), name='asset-transfers-list'),
    path('asset-transfers/<int:pk>/', AssetTransfersDetailView.as_view(), name='asset-transfers-detail'),

    # Equipment URLs
    path('equipment/', EquipmentListCreateView.as_view(), name='equipment-list'),
    path('equipment/<int:pk>/', EquipmentDetailView.as_view(), name='equipment-detail'),

    # Users URLs
    path('users/', UserListView.as_view(), name='users-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='users-detail'),

    # Transfer Equipment URL
    path('transfer-equipment/', TransferEquipmentView.as_view(), name='transfer-equipment'),
]
