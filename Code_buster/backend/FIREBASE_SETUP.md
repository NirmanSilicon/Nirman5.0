# Firebase Setup Instructions

## Quick Start Guide

To enable Firebase integration for your LokAI complaint system, follow these steps:

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project

### 2. Enable Firestore Database

1. In your Firebase project, navigate to **Build** → **Firestore Database**
2. Click "Create database"
3. Choose **Production mode** or **Test mode** (for development)
4. Select your preferred Cloud Firestore location
5. Click "Enable"

### 3. Generate Service Account Credentials

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Navigate to **Service Accounts** tab
3. Click **Generate New Private Key**
4. Click **Generate Key** to download the JSON file
5. Save the downloaded file as `firebase-credentials.json` in your backend directory:
   ```
   c:\Users\krish\Desktop\lok ai\backend\firebase-credentials.json
   ```

### 4. Configure Environment Variables

Add these lines to your `.env` file (create it if it doesn't exist):

```env
# Firebase Configuration
FIREBASE_ENABLED=true
FIREBASE_CREDENTIALS_PATH=firebase-credentials.json
```

### 5. Restart the Server

Restart your backend server to apply the changes:

```bash
# Stop the current server (Ctrl+C in the terminal)
# Then restart it
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 6. Test the Integration

Submit a test complaint through your frontend or API:

```bash
curl -X POST "http://localhost:8000/api/complaints/submit" \
  -H "Content-Type: application/json" \
  -d '{
    "address": "123 Test Street",
    "complaint_text": "This is a test complaint to verify Firebase integration"
  }'
```

### 7. Verify in Firebase Console

1. Go to Firebase Console → Firestore Database
2. You should see a new collection called `complaints`
3. Click on it to view your submitted complaints

## Features

✅ **Dual Database Storage**: Complaints are saved to both MySQL and Firebase
✅ **Graceful Degradation**: If Firebase fails, complaints still save to MySQL
✅ **Real-time Dashboard**: View complaints in Firebase Console in real-time
✅ **Automatic Timestamps**: Created and updated timestamps are automatically managed
✅ **NLP Analysis**: Sentiment, urgency, and category are saved to Firebase

## Firestore Data Structure

Each complaint in Firestore has the following structure:

```json
{
  "id": "unique-complaint-id",
  "address": "Complaint address",
  "complaint_text": "Original complaint text",
  "cleaned_text": "Processed text",
  "sentiment": "positive|neutral|negative",
  "urgency": "low|medium|high",
  "category": "road|water|electricity|garbage|safety|health|other",
  "confidence_score": 0.85,
  "status": "pending|in_progress|resolved|rejected",
  "created_at": "2025-11-29T18:33:35Z",
  "updated_at": "2025-11-29T18:33:35Z"
}
```

## Troubleshooting

### Firebase not saving complaints

1. Check that `FIREBASE_ENABLED=true` in your `.env` file
2. Verify the credentials file path is correct
3. Check server logs for Firebase-related errors
4. Ensure Firestore is enabled in your Firebase project

### Permission denied errors

1. Make sure you downloaded the correct service account key
2. Verify the JSON file is not corrupted
3. Check that Firestore security rules allow writes

### Server won't start

1. Ensure `firebase-admin` is installed: `pip install firebase-admin`
2. Check that the credentials file exists at the specified path
3. Review server logs for detailed error messages

## Security Notes

⚠️ **Important**: 
- Never commit `firebase-credentials.json` to version control
- The file is already added to `.gitignore`
- Keep your service account credentials secure
- Use environment-specific credentials for production

## Next Steps

- Set up Firestore security rules for production
- Configure indexes for better query performance
- Implement real-time listeners in your frontend
- Set up Firebase Cloud Functions for automated workflows
