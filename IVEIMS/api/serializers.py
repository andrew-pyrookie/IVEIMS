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
        fields = ['id', 'name', 'email', 'role', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_role(self, value):
        if value not in Users.RoleChoices.values:
            raise serializers.ValidationError("Invalid role selected.")
        return value

    def create(self, validated_data):
        validated_data['email'] = Users.objects.normalize_email(validated_data['email'])
        validated_data.pop('is_superuser', None)
        validated_data.pop('is_staff', None)

        user = Users.objects.create(
            name=validated_data['name'],
            email=validated_data['email'],
            role=validated_data['role']
        )
        user.set_password(validated_data['password'])

        if user.role == Users.RoleChoices.ADMIN:
            user.is_staff = True

        user.save()
        return user

    
class ProfileSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Users
        fields = ['id', 'email', 'name', 'role', 'password']
        read_only_fields = ['email', 'role']  # Prevent email/role from being updated

    def update(self, instance, validated_data):
        # Handle password update securely
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        return super().update(instance, validated_data)
    
class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id','equipment', 'start_time', 'end_time']

    def validate(self, data):
        if data['end_time'] <= data['start_time']:
            raise serializers.ValidationError("End time must be after start time.")
        return data
