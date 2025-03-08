# from django.db import models
# from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
# from django.conf import settings
# from django.utils.timezone import now
# import qrcode
# import uuid
# from io import BytesIO
# from django.core.files.base import ContentFile
# from django.core.exceptions import ValidationError
# from django.contrib.auth.models import User
# from django.conf import settings

# class Lab(models.Model):
#     LAB_CHOICES = [
#         ('DS', 'Design Studio'),
#         ('CL', 'Cezeri Lab'),
#         ('MT', 'MedTech Lab')
#     ]
#     name = models.CharField(max_length=2, choices=LAB_CHOICES, unique=True)
#     description = models.TextField(blank=True, null=True)
#     manager = models.ForeignKey(
#         'Users', 
#         on_delete=models.SET_NULL, 
#         null=True, 
#         blank=True,
#         limit_choices_to={'role': 'lab_manager'},
#         related_name='managed_labs'
#     )

#     def get_full_name(self):
#         # Handle invalid or empty name gracefully
#         try:
#             return dict(self.LAB_CHOICES).get(self.name, 'Unknown Lab')
#         except (TypeError, AttributeError):
#             return 'Unknown Lab'

#     def clean(self):
#         # Validate name against LAB_CHOICES
#         if self.name not in dict(self.LAB_CHOICES):
#             raise ValidationError(f"Name must be one of: {', '.join(dict(self.LAB_CHOICES).keys())}")

#     def save(self, *args, **kwargs):
#         self.clean()  # Run validation before saving
#         super().save(*args, **kwargs)

#     def __str__(self):
#         return self.get_full_name()

#     class Meta:
#         db_table = 'labs'

# # Custom User Manager
# class CustomUserManager(BaseUserManager):
#     def create_user(self, email, password=None, **extra_fields):
#         if not email:
#             raise ValueError("The Email field must be set")
#         email = self.normalize_email(email)
#         user = self.model(email=email, **extra_fields)
#         user.set_password(password)
#         user.save(using=self._db)
#         return user

#     def create_superuser(self, email, password=None, **extra_fields):
#         extra_fields.setdefault("is_superuser", True)
#         extra_fields.setdefault("is_staff", True)
#         return self.create_user(email, password, **extra_fields)


# class Users(AbstractBaseUser, PermissionsMixin):
#     class RoleChoices(models.TextChoices):
#         ADMIN = "admin", "Admin"
#         STUDENT = "student", "Student"
#         LAB_MANAGER = "lab_manager", "Lab Manager"
#         TECHNICIAN = "technician", "Technician"

#     name = models.CharField(max_length=255)
#     email = models.EmailField(unique=True, max_length=255)
#     role = models.CharField(max_length=20, choices=RoleChoices.choices, default=RoleChoices.STUDENT)
#     lab = models.ForeignKey(Lab, null=True, blank=True, on_delete=models.SET_NULL)  # For Lab Managers
#     created_at = models.DateTimeField(default=now)
#     approved = models.BooleanField(default=False)
#     approved_by = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
#     is_active = models.BooleanField(default=True)
#     is_staff = models.BooleanField(default=False)
#     is_superuser = models.BooleanField(default=False)
#     last_login = models.DateTimeField(blank=True, null=True)

#     USERNAME_FIELD = "email"
#     REQUIRED_FIELDS = ["name", "role"]

#     objects = CustomUserManager()
    
#     def can_access_lab(self, lab):
#         if self.role == 'admin':
#             return True
#         return self.lab == lab

#     def __str__(self):
#         return f"{self.name} - {self.email}"

#     class Meta:
#         db_table = "users"

# class Equipment(models.Model):
#     class CategoryChoices(models.TextChoices):
#         ELECTRICAL = "electrical", "Electrical"
#         MECHANICAL = "mechanical", "Mechanical"
#         CONSUMABLE = "consumable", "Consumable"
#         MEDICAL = "medical", "Medical"

#     name = models.CharField(max_length=255)
#     current_lab = models.ForeignKey('Lab', on_delete=models.CASCADE, related_name='current_equipment')
#     home_lab = models.ForeignKey('Lab', on_delete=models.CASCADE, related_name='home_equipment', null=True, blank=True)  # New field
#     category = models.CharField(max_length=50, choices=CategoryChoices.choices, default=CategoryChoices.ELECTRICAL)
#     STATUS_CHOICES = [
#         ('available', 'Available'),
#         ('in_use', 'In Use'),
#         ('maintenance', 'Maintenance'),
#     ]
#     status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='available')
#     unique_code = models.CharField(unique=True, max_length=255, editable=False)
#     qr_code = models.ImageField(upload_to='qrcodes/', blank=True, null=True)
#     last_maintenance = models.DateField(blank=True, null=True)
#     next_maintenance = models.DateField(blank=True, null=True)
#     description = models.TextField(blank=True, null=True)
#     last_sync = models.DateTimeField(auto_now=True)
#     is_synced = models.BooleanField(default=False)
#     unit_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # New field
#     quantity = models.PositiveIntegerField(default=1)  # New field
#     total_price = models.DecimalField(max_digits=12, decimal_places=2, editable=False, default=0.00)

#     def generate_unique_code(self):
#         return f"{self.current_lab.name}-{str(uuid.uuid4())[:8]}"

#     def generate_qr_code(self):
#         qr = qrcode.make(self.unique_code)
#         buffer = BytesIO()
#         qr.save(buffer, format="PNG")
#         self.qr_code.save(f"{self.unique_code}.png", ContentFile(buffer.getvalue()), save=False)

#     def save(self, *args, **kwargs):
#         self.total_price = self.unit_price * self.quantity
#         if not self.unique_code:
#             self.unique_code = self.generate_unique_code()
#         if not self.qr_code:
#             self.generate_qr_code()
#         super().save(*args, **kwargs)

#     def __str__(self):
#         return f"{self.name} ({self.current_lab.get_full_name()})"

#     class Meta:
#         db_table = 'equipment'
        
# class Project(models.Model):
#     STATUS_CHOICES = [
#         ('pending', 'Pending'),
#         ('active', 'Active'),
#         ('completed', 'Completed'),
#     ]
#     lab = models.ForeignKey(Lab, on_delete=models.CASCADE, null=True, blank=True)  # Allow null values
#     title = models.CharField(max_length=255)
#     description = models.TextField(blank=True, null=True)
#     status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
#     start_date = models.DateTimeField(default=now)
#     end_date = models.DateTimeField(blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     members = models.ManyToManyField(Users, related_name='projects')
#     equipment = models.ManyToManyField(Equipment, related_name='projects')
#     progress = models.IntegerField(default=0)

#     def __str__(self):
#         return f"{self.title} - {self.lab.get_full_name() if self.lab else 'No Lab'}"

#     class Meta:
#         db_table = 'projects'
        
# class ProjectDocument(models.Model):
#     project = models.ForeignKey(Project, on_delete=models.CASCADE)
#     file = models.FileField(upload_to='projects/%Y/%m/%d/')
#     uploaded_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Doc for {self.project.title}"

#     class Meta:
#         db_table = 'project_documents'


# class BorrowRequest(models.Model):
#     STATUS_CHOICES = [
#         ('pending', 'Pending'),
#         ('approved', 'Approved'),
#         ('rejected', 'Rejected'),
#     ]

#     equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)
#     requesting_lab = models.ForeignKey(Lab, related_name='requests_made', on_delete=models.CASCADE)
#     owning_lab = models.ForeignKey(Lab, related_name='requests_received', on_delete=models.CASCADE)
#     requested_by = models.ForeignKey(Users, on_delete=models.CASCADE)
#     status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
#     request_date = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.equipment.name} from {self.owning_lab} to {self.requesting_lab}"

#     class Meta:
#         db_table = 'borrow_requests'
# class AssetTransfer(models.Model):
#     equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)
#     from_lab = models.ForeignKey(Lab, related_name='transfers_out', on_delete=models.CASCADE)
#     to_lab = models.ForeignKey(Lab, related_name='transfers_in', on_delete=models.CASCADE)
#     transfer_date = models.DateTimeField(auto_now_add=True)
#     transferred_by = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True)
#     is_synced = models.BooleanField(default=False)

#     def __str__(self):
#         return f"{self.equipment.name} from {self.from_lab} to {self.to_lab}"

#     class Meta:
#         db_table = 'asset_transfers'

# class MaintenanceReminders(models.Model):
#     STATUS_CHOICES = [
#         ('pending', 'Pending'),
#         ('sent', 'Sent'),
#         ('completed', 'Completed'),
#     ]
#     equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, null=True, blank=True)
#     reminder_date = models.DateTimeField(blank=True, null=True)
#     status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')

#     def __str__(self):
#         return f"Reminder for {self.equipment.name} on {self.reminder_date}"

#     class Meta:
#         db_table = 'maintenance_reminders'
        
# class MaintenanceLog(models.Model):
#     equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)
#     date_performed = models.DateTimeField()
#     details = models.TextField()
#     technician = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True)

#     def __str__(self):
#         return f"Maintenance on {self.equipment.name} at {self.date_performed}"

#     class Meta:
#         db_table = 'maintenance_logs'
        
# class Booking(models.Model):
#     STATUS_CHOICES = [
#         ('pending', 'Pending'),
#         ('approved', 'Approved'),
#         ('rejected', 'Rejected'),
#     ]

#     user = models.ForeignKey(Users, on_delete=models.CASCADE)
#     equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)
#     lab_space = models.ForeignKey(Lab, on_delete=models.CASCADE, null=True, blank=True)
#     start_time = models.DateTimeField()
#     end_time = models.DateTimeField()
#     status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
#     checked_in_at = models.DateTimeField(null=True, blank=True)
#     checked_out_at = models.DateTimeField(null=True, blank=True)
#     project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, blank=True)

#     class Meta:
#         unique_together = ('equipment', 'start_time', 'end_time')

#     def clean(self):
#         if self.start_time >= self.end_time:
#             raise ValidationError("End time must be after start time.")
#         overlapping_bookings = Booking.objects.filter(
#             equipment=self.equipment,
#             start_time__lt=self.end_time,
#             end_time__gt=self.start_time
#         ).exclude(id=self.id)
#         if overlapping_bookings.exists():
#             raise ValidationError("This equipment is already booked for the selected time range.")

#     def save(self, *args, **kwargs):
#         self.clean()
#         super().save(*args, **kwargs)

#     def __str__(self):
#         return f"{self.equipment.name} booked by {self.user.name} from {self.start_time}"

#     class Meta:
#         db_table = 'bookings'

# class ProjectAllocation(models.Model):
#     project = models.ForeignKey(Project, on_delete=models.CASCADE)
#     equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)
#     allocation_start = models.DateField()
#     allocation_end = models.DateField()
#     allocated_by = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True)

#     def clean(self):
#         if self.allocation_start >= self.allocation_end:
#             raise ValidationError("End date must be after start date.")
#         overlaps = ProjectAllocation.objects.filter(
#             equipment=self.equipment,
#             allocation_start__lt=self.allocation_end,
#             allocation_end__gt=self.allocation_start
#         ).exclude(id=self.id)
#         if overlaps.exists():
#             raise ValidationError("Equipment is already allocated for this period.")

#     def save(self, *args, **kwargs):
#         if self.allocated_by and self.allocated_by.role not in [Users.RoleChoices.ADMIN, Users.RoleChoices.LAB_MANAGER, Users.RoleChoices.TECHNICIAN]:
#             raise ValidationError("Only Admin, Lab Manager, or Technician can allocate equipment.")
#         self.clean()
#         super().save(*args, **kwargs)

#     def __str__(self):
#         return f"{self.equipment.name} allocated to {self.project.title}"

#     class Meta:
#         db_table = 'project_allocations'
        
        
# class BackupLog(models.Model):
#     date = models.DateTimeField(auto_now_add=True)
#     status = models.CharField(max_length=50, choices=[('success', 'Success'), ('failed', 'Failed')])
#     file_path = models.CharField(max_length=255)

#     def __str__(self):
#         return f"Backup on {self.date} - {self.status}"

#     class Meta:
#         db_table = 'backup_logs'

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings
from django.utils.timezone import now
import qrcode
import uuid
from io import BytesIO
from django.core.files.base import ContentFile
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from django.conf import settings

class Lab(models.Model):
    LAB_CHOICES = [
        ('DS', 'Design Studio'),
        ('CL', 'Cezeri Lab'),
        ('MT', 'MedTech Lab')
    ]
    name = models.CharField(max_length=2, choices=LAB_CHOICES, unique=True)
    description = models.TextField(blank=True, null=True)
    manager = models.ForeignKey(
        'Users', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        limit_choices_to={'role': 'lab_manager'},
        related_name='managed_labs'
    )

    def get_full_name(self):
        # Handle invalid or empty name gracefully
        try:
            return dict(self.LAB_CHOICES).get(self.name, 'Unknown Lab')
        except (TypeError, AttributeError):
            return 'Unknown Lab'

    def clean(self):
        # Validate name against LAB_CHOICES
        if self.name not in dict(self.LAB_CHOICES):
            raise ValidationError(f"Name must be one of: {', '.join(dict(self.LAB_CHOICES).keys())}")

    def save(self, *args, **kwargs):
        self.clean()  # Run validation before saving
        super().save(*args, **kwargs)

    def __str__(self):
        return self.get_full_name()

    class Meta:
        db_table = 'labs'

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
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("approved", True)
        extra_fields.setdefault("role", "admin")
        return self.create_user(email, password, **extra_fields)


class Users(AbstractBaseUser, PermissionsMixin):
    class RoleChoices(models.TextChoices):
        ADMIN = "admin", "Admin"
        STUDENT = "student", "Student"
        LAB_MANAGER = "lab_manager", "Lab Manager"
        TECHNICIAN = "technician", "Technician"

    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True, max_length=255)
    role = models.CharField(max_length=20, choices=RoleChoices.choices, default=RoleChoices.STUDENT)
    lab = models.ForeignKey(Lab, null=True, blank=True, on_delete=models.SET_NULL)  # For Lab Managers
    created_at = models.DateTimeField(default=now)
    approved = models.BooleanField(default=False)
    approved_by = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    last_login = models.DateTimeField(blank=True, null=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"] # Remove "role" from REQUIRED_FIELDS,still needed

    objects = CustomUserManager()
    
    def can_access_lab(self, lab):
        if self.role == 'admin':
            return True
        return self.lab == lab

    def __str__(self):
        return f"{self.name} - {self.email}"

    class Meta:
        db_table = "users"

class Equipment(models.Model):
    class CategoryChoices(models.TextChoices):
        ELECTRICAL = "electrical", "Electrical"
        MECHANICAL = "mechanical", "Mechanical"
        CONSUMABLE = "consumable", "Consumable"
        MEDICAL = "medical", "Medical"

    name = models.CharField(max_length=255)
    current_lab = models.ForeignKey('Lab', on_delete=models.CASCADE, related_name='current_equipment')
    home_lab = models.ForeignKey('Lab', on_delete=models.CASCADE, related_name='home_equipment', null=True, blank=True)  # New field
    is_synced = models.BooleanField(default=False)  # For offline sync tracking
    category = models.CharField(max_length=50, choices=CategoryChoices.choices, default=CategoryChoices.ELECTRICAL)
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('in_use', 'In Use'),
        ('maintenance', 'Maintenance'),
    ]
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='available')
    unique_code = models.CharField(unique=True, max_length=255, editable=False)
    qr_code = models.ImageField(upload_to='qrcodes/', blank=True, null=True)
    last_maintenance = models.DateField(blank=True, null=True)
    next_maintenance = models.DateField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    last_sync = models.DateTimeField(auto_now=True)
    is_synced = models.BooleanField(default=False)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # New field
    quantity = models.PositiveIntegerField(default=1)  # New field
    total_price = models.DecimalField(max_digits=12, decimal_places=2, editable=False, default=0.00)

    def generate_unique_code(self):
        return f"{self.current_lab.name}-{str(uuid.uuid4())[:8]}"

    def generate_qr_code(self):
        qr = qrcode.make(self.unique_code)
        buffer = BytesIO()
        qr.save(buffer, format="PNG")
        self.qr_code.save(f"{self.unique_code}.png", ContentFile(buffer.getvalue()), save=False)

    def save(self, *args, **kwargs):
        self.total_price = self.unit_price * self.quantity
        if not self.unique_code:
            self.unique_code = self.generate_unique_code()
        if not self.qr_code:
            self.generate_qr_code()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.current_lab.get_full_name()})"

    class Meta:
        db_table = 'equipment'
        
class Project(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('completed', 'Completed'),
    ]
    lab = models.ForeignKey(Lab, on_delete=models.CASCADE, null=True, blank=True)  # Allow null values
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    start_date = models.DateTimeField(default=now)
    end_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    members = models.ManyToManyField(Users, related_name='projects')
    equipment = models.ManyToManyField(Equipment, related_name='projects')
    progress = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.title} - {self.lab.get_full_name() if self.lab else 'No Lab'}"

    class Meta:
        db_table = 'projects'
        
class ProjectDocument(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    file = models.FileField(upload_to='projects/%Y/%m/%d/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Doc for {self.project.title}"

    class Meta:
        db_table = 'project_documents'


class BorrowRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)
    requesting_lab = models.ForeignKey(Lab, related_name='requests_made', on_delete=models.CASCADE)
    owning_lab = models.ForeignKey(Lab, related_name='requests_received', on_delete=models.CASCADE)
    requested_by = models.ForeignKey(Users, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    request_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.equipment.name} from {self.owning_lab} to {self.requesting_lab}"

    class Meta:
        db_table = 'borrow_requests'
class AssetTransfer(models.Model):
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)
    from_lab = models.ForeignKey(Lab, related_name='transfers_out', on_delete=models.CASCADE)
    to_lab = models.ForeignKey(Lab, related_name='transfers_in', on_delete=models.CASCADE)
    transfer_date = models.DateTimeField(auto_now_add=True)
    transferred_by = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True)
    is_synced = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.equipment.name} from {self.from_lab} to {self.to_lab}"

    class Meta:
        db_table = 'asset_transfers'

class MaintenanceReminders(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('completed', 'Completed'),
    ]
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, null=True, blank=True)
    reminder_date = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"Reminder for {self.equipment.name} on {self.reminder_date}"

    class Meta:
        db_table = 'maintenance_reminders'
        
class MaintenanceLog(models.Model):
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)
    date_performed = models.DateTimeField()
    details = models.TextField()
    technician = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"Maintenance on {self.equipment.name} at {self.date_performed}"

    class Meta:
        db_table = 'maintenance_logs'
        
class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)
    lab_space = models.ForeignKey(Lab, on_delete=models.CASCADE, null=True, blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    checked_in_at = models.DateTimeField(null=True, blank=True)
    checked_out_at = models.DateTimeField(null=True, blank=True)
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, blank=True)

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
        return f"{self.equipment.name} booked by {self.user.name} from {self.start_time}"

    class Meta:
        db_table = 'bookings'

class ProjectAllocation(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)
    allocation_start = models.DateField()
    allocation_end = models.DateField()
    allocated_by = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True)

    def clean(self):
        if self.allocation_start >= self.allocation_end:
            raise ValidationError("End date must be after start date.")
        overlaps = ProjectAllocation.objects.filter(
            equipment=self.equipment,
            allocation_start__lt=self.allocation_end,
            allocation_end__gt=self.allocation_start
        ).exclude(id=self.id)
        if overlaps.exists():
            raise ValidationError("Equipment is already allocated for this period.")

    def save(self, *args, **kwargs):
        if self.allocated_by and self.allocated_by.role not in [Users.RoleChoices.ADMIN, Users.RoleChoices.LAB_MANAGER, Users.RoleChoices.TECHNICIAN]:
            raise ValidationError("Only Admin, Lab Manager, or Technician can allocate equipment.")
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.equipment.name} allocated to {self.project.title}"

    class Meta:
        db_table = 'project_allocations'
        
        
class BackupLog(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=[('success', 'Success'), ('failed', 'Failed')])
    file_path = models.CharField(max_length=255)

    def __str__(self):
        return f"Backup on {self.date} - {self.status}"

    class Meta:
        db_table = 'backup_logs'