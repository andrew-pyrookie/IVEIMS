from rest_framework import serializers
from .models import (
    AssetTransfer, Equipment, Users, Project, Booking, Lab, ProjectAllocation,
    BorrowRequest, MaintenanceReminders, MaintenanceLog, ProjectDocument, BackupLog
)

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'name', 'email', 'role', 'lab', 'approved']

class ProfileSerializer(serializers.ModelSerializer):
    lab = serializers.CharField(source='lab.name', read_only=True)
    class Meta:
        model = Users
        fields = ['id', 'name', 'email', 'role', 'lab']

class LabSerializer(serializers.ModelSerializer):
    manager = UsersSerializer(read_only=True)
    class Meta:
        model = Lab
        fields = ['id', 'name', 'description', 'manager']

class EquipmentSerializer(serializers.ModelSerializer):
    current_lab = serializers.PrimaryKeyRelatedField(queryset=Lab.objects.all())
    home_lab = serializers.PrimaryKeyRelatedField(queryset=Lab.objects.all(), required=False, allow_null=True)
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=0.00)
    quantity = serializers.IntegerField(required=False, default=1)

    class Meta:
        model = Equipment
        fields = [
            'id', 'name', 'current_lab', 'home_lab', 'category', 'status', 
            'unique_code', 'qr_code', 'unit_price', 'quantity'
        ]

    def create(self, validated_data):
        return Equipment.objects.create(**validated_data)

class ProjectSerializer(serializers.ModelSerializer):
    members = UsersSerializer(many=True, read_only=True)
    equipment = EquipmentSerializer(many=True, read_only=True)
    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'status', 'start_date', 'end_date', 'members', 'equipment', 'progress']

class BookingSerializer(serializers.ModelSerializer):
    user = UsersSerializer(read_only=True)
    equipment = serializers.PrimaryKeyRelatedField(queryset=Equipment.objects.all())
    lab_space = serializers.PrimaryKeyRelatedField(queryset=Lab.objects.all(), allow_null=True, required=False)
    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField()
    class Meta:
        model = Booking
        fields = ['id', 'user', 'equipment', 'lab_space', 'start_time', 'end_time', 'status', 'checked_in_at', 'checked_out_at']

class ProjectAllocationSerializer(serializers.ModelSerializer):
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())
    equipment = serializers.PrimaryKeyRelatedField(queryset=Equipment.objects.all())
    allocated_by = UsersSerializer(read_only=True)
    class Meta:
        model = ProjectAllocation
        fields = ['id', 'project', 'equipment', 'allocation_start', 'allocation_end', 'allocated_by']

    def create(self, validated_data):
        return ProjectAllocation.objects.create(**validated_data)

class BorrowRequestSerializer(serializers.ModelSerializer):
    equipment = serializers.PrimaryKeyRelatedField(queryset=Equipment.objects.all())
    requesting_lab = serializers.PrimaryKeyRelatedField(queryset=Lab.objects.all())
    owning_lab = serializers.PrimaryKeyRelatedField(queryset=Lab.objects.all())
    requested_by = UsersSerializer(read_only=True)
    class Meta:
        model = BorrowRequest
        fields = ['id', 'equipment', 'requesting_lab', 'owning_lab', 'requested_by', 'status', 'request_date']

    def create(self, validated_data):
        return BorrowRequest.objects.create(**validated_data)

class AssetTransfersSerializer(serializers.ModelSerializer):
    equipment = serializers.PrimaryKeyRelatedField(queryset=Equipment.objects.all())
    from_lab = serializers.PrimaryKeyRelatedField(queryset=Lab.objects.all())
    to_lab = serializers.PrimaryKeyRelatedField(queryset=Lab.objects.all())
    class Meta:
        model = AssetTransfer
        fields = ['id', 'equipment', 'from_lab', 'to_lab', 'transfer_date', 'is_synced']

class MaintenanceRemindersSerializer(serializers.ModelSerializer):
    equipment = serializers.PrimaryKeyRelatedField(queryset=Equipment.objects.all())
    class Meta:
        model = MaintenanceReminders
        fields = ['id', 'equipment', 'reminder_date', 'status']

class MaintenanceLogSerializer(serializers.ModelSerializer):
    equipment = serializers.PrimaryKeyRelatedField(queryset=Equipment.objects.all())
    technician = UsersSerializer(read_only=True)
    class Meta:
        model = MaintenanceLog
        fields = ['id', 'equipment', 'date_performed', 'details', 'technician']

    def create(self, validated_data):
        return MaintenanceLog.objects.create(**validated_data)

class ProjectDocumentSerializer(serializers.ModelSerializer):
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())
    class Meta:
        model = ProjectDocument
        fields = ['id', 'project', 'file', 'uploaded_at']

    def create(self, validated_data):
        return ProjectDocument.objects.create(**validated_data)

class BackupLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = BackupLog
        fields = ['id', 'date', 'status', 'file_path']