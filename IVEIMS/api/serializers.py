from rest_framework import serializers
from .models import (
    AssetTransfer, Equipment, Users, Project, Booking, Lab, ProjectAllocation,
    BorrowRequest, MaintenanceReminders, MaintenanceLog, ProjectDocument, BackupLog
)

class UsersSerializer(serializers.ModelSerializer):
    lab = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Users
        fields = ['id', 'name', 'email', 'role', 'lab', 'approved']

    def create(self, validated_data):
        user = Users(**validated_data)
        user.set_password(validated_data['password'])  # Ensure password is hashed
        user.save()
        return user

class ProfileSerializer(serializers.ModelSerializer):
    lab = serializers.CharField(source='lab.get_full_name', read_only=True)
    class Meta:
        model = Users
        fields = ['id', 'name', 'email', 'role', 'lab']

class LabSerializer(serializers.ModelSerializer):
    manager = serializers.PrimaryKeyRelatedField(queryset=Users.objects.filter(role='lab_manager'), allow_null=True, required=False)
    name = serializers.ChoiceField(choices=Lab.LAB_CHOICES, required=True)  # Explicitly validate name
    equipment_count = serializers.SerializerMethodField()

    def get_equipment_count(self, obj):
        return obj.current_equipment.count()

    class Meta:
        model = Lab
        fields = ['id', 'name', 'description', 'manager', 'equipment_count']

    def validate_name(self, value):
        # Additional safety net (optional, since ChoiceField handles it)
        if value not in dict(Lab.LAB_CHOICES):
            raise serializers.ValidationError(f"Name must be one of: {', '.join(dict(Lab.LAB_CHOICES).keys())}")
        return value

class EquipmentSerializer(serializers.ModelSerializer):
    current_lab = serializers.StringRelatedField(read_only=True)
    home_lab = serializers.StringRelatedField(read_only=True, allow_null=True)
    current_lab_id = serializers.PrimaryKeyRelatedField(queryset=Lab.objects.all(), source='current_lab', write_only=True)
    home_lab_id = serializers.PrimaryKeyRelatedField(queryset=Lab.objects.all(), source='home_lab', required=False, allow_null=True, write_only=True)
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=0.00)
    quantity = serializers.IntegerField(required=False, default=1)

    class Meta:
        model = Equipment
        fields = [
            'id', 'name', 'current_lab', 'home_lab', 'category', 'status',
            'unique_code', 'qr_code', 'unit_price', 'quantity', 'total_price',
            'last_maintenance', 'next_maintenance', 'description',
            'current_lab_id', 'home_lab_id'  # Include write-only fields
        ]

    def create(self, validated_data):
        return Equipment.objects.create(**validated_data)

class ProjectSerializer(serializers.ModelSerializer):
    lab = serializers.StringRelatedField(read_only=True)
    lab_id = serializers.PrimaryKeyRelatedField(queryset=Lab.objects.all(), source='lab', write_only=True)
    members = serializers.PrimaryKeyRelatedField(many=True, queryset=Users.objects.all())
    equipment = serializers.PrimaryKeyRelatedField(many=True, queryset=Equipment.objects.all())

    class Meta:
        model = Project
        fields = [
            'id', 'lab', 'title', 'description', 'status', 'start_date', 
            'end_date', 'members', 'equipment', 'progress', 'lab_id'
        ]

class BookingSerializer(serializers.ModelSerializer):
    user = UsersSerializer(read_only=True)
    equipment = serializers.StringRelatedField(read_only=True)
    equipment_id = serializers.PrimaryKeyRelatedField(queryset=Equipment.objects.all(), source='equipment', write_only=True)
    lab_space = serializers.StringRelatedField(read_only=True, allow_null=True)
    lab_space_id = serializers.PrimaryKeyRelatedField(queryset=Lab.objects.all(), source='lab_space', allow_null=True, required=False, write_only=True)
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all(), allow_null=True, required=False)

    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'equipment', 'lab_space', 'start_time', 'end_time', 
            'status', 'checked_in_at', 'checked_out_at', 'project', 
            'equipment_id', 'lab_space_id'
        ]

class ProjectAllocationSerializer(serializers.ModelSerializer):
    project = serializers.StringRelatedField(read_only=True)
    project_id = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all(), source='project', write_only=True)
    equipment = serializers.StringRelatedField(read_only=True)
    equipment_id = serializers.PrimaryKeyRelatedField(queryset=Equipment.objects.all(), source='equipment', write_only=True)
    allocated_by = UsersSerializer(read_only=True)

    class Meta:
        model = ProjectAllocation
        fields = [
            'id', 'project', 'equipment', 'allocation_start', 'allocation_end', 
            'allocated_by', 'project_id', 'equipment_id'
        ]

    def create(self, validated_data):
        return ProjectAllocation.objects.create(**validated_data)

class BorrowRequestSerializer(serializers.ModelSerializer):
    equipment = serializers.StringRelatedField(read_only=True)
    equipment_id = serializers.PrimaryKeyRelatedField(queryset=Equipment.objects.all(), source='equipment', write_only=True)
    requesting_lab = serializers.StringRelatedField(read_only=True)
    requesting_lab_id = serializers.PrimaryKeyRelatedField(queryset=Lab.objects.all(), source='requesting_lab', write_only=True)
    owning_lab = serializers.StringRelatedField(read_only=True)
    owning_lab_id = serializers.PrimaryKeyRelatedField(queryset=Lab.objects.all(), source='owning_lab', write_only=True)
    requested_by = UsersSerializer(read_only=True)

    class Meta:
        model = BorrowRequest
        fields = [
            'id', 'equipment', 'requesting_lab', 'owning_lab', 'requested_by', 
            'status', 'request_date', 'equipment_id', 'requesting_lab_id', 'owning_lab_id'
        ]

    def create(self, validated_data):
        return BorrowRequest.objects.create(**validated_data)

class AssetTransfersSerializer(serializers.ModelSerializer):
    equipment = serializers.StringRelatedField(read_only=True)
    equipment_id = serializers.PrimaryKeyRelatedField(queryset=Equipment.objects.all(), source='equipment', write_only=True)
    from_lab = serializers.StringRelatedField(read_only=True)
    from_lab_id = serializers.PrimaryKeyRelatedField(queryset=Lab.objects.all(), source='from_lab', write_only=True)
    to_lab = serializers.StringRelatedField(read_only=True)
    to_lab_id = serializers.PrimaryKeyRelatedField(queryset=Lab.objects.all(), source='to_lab', write_only=True)
    transferred_by = UsersSerializer(read_only=True)

    class Meta:
        model = AssetTransfer
        fields = [
            'id', 'equipment', 'from_lab', 'to_lab', 'transfer_date', 
            'is_synced', 'transferred_by', 'equipment_id', 'from_lab_id', 'to_lab_id'
        ]

class MaintenanceRemindersSerializer(serializers.ModelSerializer):
    equipment = serializers.StringRelatedField(read_only=True)
    equipment_id = serializers.PrimaryKeyRelatedField(queryset=Equipment.objects.all(), source='equipment', write_only=True)

    class Meta:
        model = MaintenanceReminders
        fields = ['id', 'equipment', 'reminder_date', 'status', 'equipment_id']

class MaintenanceLogSerializer(serializers.ModelSerializer):
    equipment = serializers.StringRelatedField(read_only=True)
    equipment_id = serializers.PrimaryKeyRelatedField(queryset=Equipment.objects.all(), source='equipment', write_only=True)
    technician = UsersSerializer(read_only=True)

    class Meta:
        model = MaintenanceLog
        fields = ['id', 'equipment', 'date_performed', 'details', 'technician', 'equipment_id']

    def create(self, validated_data):
        return MaintenanceLog.objects.create(**validated_data)

class ProjectDocumentSerializer(serializers.ModelSerializer):
    project = serializers.StringRelatedField(read_only=True)
    project_id = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all(), source='project', write_only=True)

    class Meta:
        model = ProjectDocument
        fields = ['id', 'project', 'file', 'uploaded_at', 'project_id']

    def create(self, validated_data):
        return ProjectDocument.objects.create(**validated_data)

class BackupLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = BackupLog
        fields = ['id', 'date', 'status', 'file_path']