import requests
from django.utils.timezone import now
from api.models import Equipment, AssetTransfers

def sync_offline_data():
    """Syncs all offline records to the server."""
    unsynced_transfers = AssetTransfers.objects.filter(is_synced=False)
    unsynced_equipment = Equipment.objects.filter(is_synced=False)

    if not unsynced_transfers and not unsynced_equipment:
        print("No pending sync data.")
        return

    url = "http://127.0.0.1:8000/api/sync-offline-data/"
    response = requests.post(url)

    if response.status_code == 200:
        print("Offline data synced successfully.")
    else:
        print("Sync failed:", response.json())

if __name__ == "__main__":
    sync_offline_data()

# Run crontab -e