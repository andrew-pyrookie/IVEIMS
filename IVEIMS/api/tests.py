from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import Users, Lab, Equipment, Project, Booking, ProjectAllocation, BorrowRequest, AssetTransfer, MaintenanceReminders, MaintenanceLog, BackupLog
from django.utils.timezone import now, timedelta
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.files.uploadedfile import SimpleUploadedFile

class IVEIMSTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        # Create Users
        self.admin = Users.objects.create_superuser(email="admin@example.com", password="adminpass", name="Admin User", role="admin")
        self.lab_manager = Users.objects.create_user(email="labmanager@example.com", password="labpass", name="Lab Manager", role="lab_manager")
        self.technician = Users.objects.create_user(email="technician@example.com", password="techpass", name="Technician", role="technician")
        self.student = Users.objects.create_user(email="student@example.com", password="studentpass", name="Student", role="student")

        # Create Labs
        self.design_studio = Lab.objects.create(name="DS", description="Design Studio Lab", manager=self.lab_manager)
        self.cezeri_lab = Lab.objects.create(name="CL", description="Cezeri Lab")
        # MT created in test_create_lab_admin to avoid duplication

        # Assign Lab to Lab Manager
        self.lab_manager.lab = self.design_studio
        self.lab_manager.save()

        # Create Equipment
        self.equipment = Equipment.objects.create(
            name="3D Printer", current_lab=self.design_studio, category="electrical", status="available"
        )

        # Create Project
        self.project = Project.objects.create(title="Test Project", status="pending")
        self.project.members.add(self.student, self.lab_manager)

        # Tokens for Authentication
        self.admin_token = str(RefreshToken.for_user(self.admin).access_token)
        self.lab_manager_token = str(RefreshToken.for_user(self.lab_manager).access_token)
        self.technician_token = str(RefreshToken.for_user(self.technician).access_token)
        self.student_token = str(RefreshToken.for_user(self.student).access_token)

    # Authentication Tests
    def test_register(self):
        url = reverse('register')
        data = {"email": "newuser@example.com", "password": "newpass", "name": "New User", "role": "student"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_login(self):
        url = reverse('login')
        data = {"email": "student@example.com", "password": "studentpass"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logout(self):
        url = reverse('logout')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.student_token}')
        refresh = RefreshToken.for_user(self.student)
        response = self.client.post(url, {"refresh": str(refresh)}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Dashboard Test
    def test_dashboard_admin(self):
        url = reverse('dashboard')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_dashboard_student(self):
        url = reverse('dashboard')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.student_token}')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Lab Tests
    def test_create_lab_admin(self):
        url = reverse('lab-list')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        data = {"name": "MT", "description": "New MedTech Lab"}
        response = self.client.post(url, data, format='json')
        print("Lab Response:", response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_lab_student_denied(self):
        url = reverse('lab-list')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.student_token}')
        data = {"name": "MT", "description": "New MedTech Lab"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # User Tests
    def test_list_users_admin(self):
        url = reverse('user-list')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_users_student_denied(self):
        url = reverse('user-list')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.student_token}')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # Equipment Tests
    def test_create_equipment(self):
        url = reverse('equipment-list')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        data = {"name": "CNC Machine", "current_lab": self.design_studio.id, "category": "mechanical"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # Project Tests
    def test_create_project_admin(self):
        url = reverse('project-list')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        data = {"title": "New Project", "description": "Test", "status": "pending"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_projects_student(self):
        url = reverse('project-list')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.student_token}')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    # Project Allocation Tests
    def test_allocate_equipment_technician(self):
        url = reverse('project-allocation-list')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.technician_token}')
        data = {
            "project": self.project.id,
            "equipment": self.equipment.id,
            "allocation_start": now().date().isoformat(),
            "allocation_end": (now() + timedelta(days=5)).date().isoformat()
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_allocate_equipment_student_denied(self):
        url = reverse('project-allocation-list')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.student_token}')
        data = {
            "project": self.project.id,
            "equipment": self.equipment.id,
            "allocation_start": now().date().isoformat(),
            "allocation_end": (now() + timedelta(days=5)).date().isoformat()
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # Booking Tests
    def test_create_booking_student(self):
        url = reverse('booking-list')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.student_token}')
        data = {
            "equipment": self.equipment.id,
            "start_time": (now() + timedelta(hours=1)).isoformat(),
            "end_time": (now() + timedelta(hours=2)).isoformat(),
            "lab_space": self.design_studio.id
        }
        response = self.client.post(url, data, format='json')
        print("Booking Response:", response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'pending')

    def test_approve_booking_lab_manager(self):
        booking = Booking.objects.create(
            user=self.student, equipment=self.equipment,
            start_time=now() + timedelta(hours=1),
            end_time=now() + timedelta(hours=2),
            lab_space=self.design_studio,
            status='pending'
        )
        url = reverse('booking-detail', kwargs={'pk': booking.id})
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.lab_manager_token}')
        data = {"status": "approved"}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_approve_booking_student_denied(self):
        booking = Booking.objects.create(
            user=self.student, equipment=self.equipment,
            start_time=now() + timedelta(hours=1),
            end_time=now() + timedelta(hours=2),
            lab_space=self.design_studio,
            status='pending'
        )
        url = reverse('booking-detail', kwargs={'pk': booking.id})
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.student_token}')
        data = {"status": "approved"}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # Borrow Request Tests
    def test_create_borrow_request(self):
        url = reverse('borrow-request-list')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.student_token}')
        data = {
            "equipment": self.equipment.id,
            "requesting_lab": self.cezeri_lab.id,
            "owning_lab": self.design_studio.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_approve_borrow_request_lab_manager(self):
        borrow_request = BorrowRequest.objects.create(
            equipment=self.equipment, requesting_lab=self.cezeri_lab,
            owning_lab=self.design_studio, requested_by=self.student, status='pending'
        )
        url = reverse('borrow-request-detail', kwargs={'pk': borrow_request.id})
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.lab_manager_token}')
        data = {"status": "approved"}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Asset Transfer Tests
    def test_transfer_equipment(self):
        url = reverse('transfer-equipment')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.lab_manager_token}')
        data = {"equipment_id": self.equipment.id, "from_lab": "DS", "to_lab": "CL"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Maintenance Tests
    def test_create_maintenance_reminder(self):
        url = reverse('maintenance-reminders-list')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.technician_token}')
        data = {"equipment": self.equipment.id, "reminder_date": (now() + timedelta(days=1)).isoformat()}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_maintenance_log(self):
        url = reverse('maintenance-logs-list')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.technician_token}')
        data = {"equipment": self.equipment.id, "date_performed": now().isoformat(), "details": "Oil change"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # Project Document Tests
    def test_upload_project_document(self):
        url = reverse('project-document-list')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.student_token}')
        file = SimpleUploadedFile("test.pdf", b"file_content", content_type="application/pdf")
        data = {"project": self.project.id, "file": file}
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # Backup Log Tests
    def test_list_backup_logs_admin(self):
        BackupLog.objects.create(status="success", file_path="/backups/test.db")
        url = reverse('backup-logs-list')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Offline Sync Test
    def test_offline_sync(self):
        AssetTransfer.objects.create(equipment=self.equipment, from_lab=self.design_studio, to_lab=self.cezeri_lab, is_synced=False)
        url = reverse('sync-offline-data')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.post(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)