## Application Configuration

### Cloudinary Settings (for photo functionality)
Add this to your `appsettings.json`:

```json
{
  "CloudinarySettings": {
    "CloudName": "your_cloud_name",
    "ApiKey": "your_api_key",
    "ApiSecret": "your_api_secret"
  },
  "TokenKey": "The TokenKey must be >= 64 characters" 
}