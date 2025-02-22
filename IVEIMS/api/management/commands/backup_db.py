import os
import datetime
from django.core.management.base import BaseCommand
from django.conf import settings

class Command(BaseCommand):
    help = "Backup the database"

    def handle(self, *args, **kwargs):
        backup_dir = os.path.join(settings.BASE_DIR, "backups")
        os.makedirs(backup_dir, exist_ok=True)

        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_file = os.path.join(backup_dir, f"db_backup_{timestamp}.sql")

        db_name = settings.DATABASES["default"]["NAME"]
        db_user = settings.DATABASES["default"]["USER"]
        db_password = settings.DATABASES["default"]["PASSWORD"]
        
        command = f"PGPASSWORD={db_password} pg_dump -U {db_user} -h localhost {db_name} > {backup_file}"
        
        os.system(command)
        self.stdout.write(self.style.SUCCESS(f"Backup created: {backup_file}"))
