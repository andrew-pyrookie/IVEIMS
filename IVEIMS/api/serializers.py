from rest_framework import serializers
from .models import AssetTransfers, Equipment, MaintenanceReminders, Users

class AssetTransfersSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssetTransfers
        fields = '__all__'

class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = '__all__'

class MaintenanceRemindersSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceReminders
        fields = '__all__'

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        exclude = ['groups', 'user_permissions']
