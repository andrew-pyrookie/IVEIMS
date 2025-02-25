from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings
from django.utils.timezone import now
import qrcode
from io import BytesIO
from django.core.files.base import ContentFile
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from django.conf import settings

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)

# Updated User Model
from django.db import models

class Users(AbstractBaseUser, PermissionsMixin):
    class RoleChoices(models.TextChoices):  # Define the available roles
        ADMIN = "admin", "Admin"
        STUDENT = "student", "Student"
        LAB_MANAGER = "lab manager", "Lab Manager"
        TECHNICIAN = 'Technician', "Technician"

    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True, max_length=255)
    role = models.CharField(max_length=20, choices=RoleChoices.choices, default=RoleChoices.STUDENT)
    created_at = models.DateTimeField(default=now)
    approved = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    last_login = models.DateTimeField(blank=True, null=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name", "role"]

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.name} - {self.email}"

    class Meta:
        db_table = "users"
        verbose_name_plural = "Users"

# Equipment Model
class Equipment(models.Model):
    name = models.CharField(max_length=255)
    lab = models.CharField(max_length=100)
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('in use', 'In Use'),
        ('maintenance', 'Maintenance'),
    ]
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='available')
    unique_code = models.CharField(unique=True, max_length=255)
    qr_code = models.ImageField(upload_to='qrcodes/', blank=True, null=True)
    last_maintenance = models.DateField(blank=True, null=True)
    next_maintenance = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    current_lab = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    last_sync = models.DateTimeField(auto_now=True)  
    is_synced = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    
    def generate_qr_code(self):
        qr = qrcode.make(self.unique_code)
        buffer = BytesIO()
        qr.save(buffer, format="PNG")
        self.qr_code.save(f"{self.unique_code}.png", ContentFile(buffer.getvalue()), save=False)

    def save(self, *args, **kwargs):
        if not self.qr_code:
            self.generate_qr_code()
        super().save(*args, **kwargs)

    class Meta:
        db_table = 'equipment'

class Project(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('completed', 'Completed'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    start_date = models.DateTimeField(default=now)
    end_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.status}"

    class Meta:
        db_table = 'projects'
class AssetTransfers(models.Model):
    equipment = models.ForeignKey(Equipment, models.CASCADE, null=True, blank=True)
    from_lab = models.CharField(max_length=100)
    to_lab = models.CharField(max_length=100)
    transfer_date = models.DateTimeField(blank=True, null=True)
    is_synced = models.BooleanField(default=False)

    class Meta:
        db_table = 'asset_transfers'

# Maintenance Reminders Model
class MaintenanceReminders(models.Model):
    equipment = models.ForeignKey(Equipment, models.CASCADE, null=True, blank=True)
    reminder_date = models.DateTimeField(blank=True, null=True)
    status = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'maintenance_reminders'
        
class Booking(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    class Meta:
        unique_together = ('equipment', 'start_time', 'end_time')

    def clean(self):
        if self.start_time >= self.end_time:
            raise ValidationError("End time must be after start time.")
        
        overlapping_bookings = Booking.objects.filter(
            equipment=self.equipment,
            start_time__lt=self.end_time,
            end_time__gt=self.start_time
        ).exclude(id=self.id)
        
        if overlapping_bookings.exists():
            raise ValidationError("This equipment is already booked for the selected time range.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.equipment.name} booked by {self.user.username} from {self.start_time} to {self.end_time}"

