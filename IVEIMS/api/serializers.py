from rest_framework import serializers
from .models import AssetTransfers, Equipment, MaintenanceReminders, Users, Project, Booking
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

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
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
    
class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id','equipment', 'start_time', 'end_time']

    def validate(self, data):
        if data['end_time'] <= data['start_time']:
            raise serializers.ValidationError("End time must be after start time.")
        return data
