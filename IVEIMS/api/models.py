from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils.timezone import now

# Custom User Manager
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
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)

# Custom User Model
class Users(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True, max_length=255)
    role = models.TextField()
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
    status = models.TextField(blank=True, null=True)
    unique_code = models.CharField(unique=True, max_length=255)
    last_maintenance = models.DateField(blank=True, null=True)
    next_maintenance = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    current_lab = models.CharField(max_length=100)

    class Meta:
        db_table = 'equipment'

# Asset Transfers Model
class AssetTransfers(models.Model):
    equipment = models.ForeignKey(Equipment, models.CASCADE, null=True, blank=True)
    from_lab = models.CharField(max_length=100)
    to_lab = models.CharField(max_length=100)
    transfer_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'asset_transfers'

# Maintenance Reminders Model
class MaintenanceReminders(models.Model):
    equipment = models.ForeignKey(Equipment, models.CASCADE, null=True, blank=True)
    reminder_date = models.DateTimeField(blank=True, null=True)
    status = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'maintenance_reminders'
