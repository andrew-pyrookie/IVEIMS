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
    current_lab = serializers.CharField(source='current_lab.name')
    class Meta:
        model = Equipment
        fields = ['id', 'name', 'current_lab', 'category', 'status', 'unique_code', 'qr_code']

class ProjectSerializer(serializers.ModelSerializer):
    members = UsersSerializer(many=True, read_only=True)
    equipment = EquipmentSerializer(many=True, read_only=True)
    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'status', 'start_date', 'end_date', 'members', 'equipment', 'progress']
        

class BookingSerializer(serializers.ModelSerializer):
    user = UsersSerializer(read_only=True)
    equipment = EquipmentSerializer(read_only=True)
    lab_space = serializers.CharField(source='lab_space.name', allow_null=True)
    class Meta:
        model = Booking
        fields = ['id', 'user', 'equipment', 'lab_space', 'start_time', 'end_time', 'status', 'checked_in_at', 'checked_out_at']

class ProjectAllocationSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    equipment = EquipmentSerializer(read_only=True)
    allocated_by = UsersSerializer(read_only=True)
    class Meta:
        model = ProjectAllocation
        fields = ['id', 'project', 'equipment', 'allocation_start', 'allocation_end', 'allocated_by']

class BorrowRequestSerializer(serializers.ModelSerializer):
    equipment = EquipmentSerializer(read_only=True)
    requesting_lab = serializers.CharField(source='requesting_lab.name')
    owning_lab = serializers.CharField(source='owning_lab.name')
    requested_by = UsersSerializer(read_only=True)
    class Meta:
        model = BorrowRequest
        fields = ['id', 'equipment', 'requesting_lab', 'owning_lab', 'requested_by', 'status', 'request_date']

class AssetTransfersSerializer(serializers.ModelSerializer):
    equipment = EquipmentSerializer(read_only=True)
    from_lab = serializers.CharField(source='from_lab.name')
    to_lab = serializers.CharField(source='to_lab.name')
    class Meta:
        model = AssetTransfer
        fields = ['id', 'equipment', 'from_lab', 'to_lab', 'transfer_date', 'is_synced']

class MaintenanceRemindersSerializer(serializers.ModelSerializer):
    equipment = EquipmentSerializer(read_only=True)
    class Meta:
        model = MaintenanceReminders
        fields = ['id', 'equipment', 'reminder_date', 'status']

class MaintenanceLogSerializer(serializers.ModelSerializer):
    equipment = EquipmentSerializer(read_only=True)
    technician = UsersSerializer(read_only=True)
    class Meta:
        model = MaintenanceLog
        fields = ['id', 'equipment', 'date_performed', 'details', 'technician']

class ProjectDocumentSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    class Meta:
        model = ProjectDocument
        fields = ['id', 'project', 'file', 'uploaded_at']

class BackupLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = BackupLog
        fields = ['id', 'date', 'status', 'file_path']