# Generated by Django 5.1.6 on 2025-02-21 10:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0005_equipment_qr_code"),
    ]

    operations = [
        migrations.AlterField(
            model_name="equipment",
            name="status",
            field=models.CharField(
                choices=[
                    ("available", "Available"),
                    ("in use", "In Use"),
                    ("maintenance", "Maintenance"),
                ],
                default="available",
                max_length=50,
            ),
        ),
    ]
