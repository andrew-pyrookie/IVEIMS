from rest_framework import serializers
from .models import AssetTransfers, Equipment, MaintenanceReminders, Users
from django.contrib.auth import get_user_model

Users = get_user_model()

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
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Users
        fields = ['id', 'name', 'email', 'role', 'password', 'is_active', 'is_staff']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = Users.objects.create(
            name=validated_data['name'],
            email=validated_data['email'],
            role=validated_data['role']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user