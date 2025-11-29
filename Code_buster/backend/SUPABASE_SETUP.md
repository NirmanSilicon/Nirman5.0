# Supabase Setup Guide for LokAI

This guide will help you set up Supabase for OTP authentication in your LokAI application.

## Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Click "Start your project" or sign in
3. Click "New Project"
4. Choose your organization or create a new one
5. Fill in project details:
   - **Project Name**: LokAI (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Choose the closest region to your users
6. Click "Create new project"
7. Wait for the project to be set up (this may take a few minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-ref.supabase.co`)
   - **anon public** API key
   - **service_role** API key (for admin operations)

## Step 3: Configure Supabase Auth

1. In your Supabase project, go to **Authentication** → **Settings**
2. Configure the following settings:
   - **Site URL**: `http://localhost:5174` (your frontend URL)
   - **Redirect URLs**: Add `http://localhost:5174` and `http://localhost:3000`
   - **Enable email confirmations**: Turn this OFF for OTP flow
   - **Enable phone confirmations**: Keep this OFF

## Step 4: Update Environment Variables

Update your `.env` file with your Supabase credentials:

```bash
# Supabase Configuration
# Get these from your Supabase project settings → API
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Replace:
- `https://your-project-ref.supabase.co` with your actual Project URL
- `your-anon-key-here` with your actual anon key
- `your-service-role-key-here` with your actual service role key

## Step 5: Create Users Table (Optional)

For storing user profiles and complaint history:

1. In Supabase, go to **Table Editor**
2. Click **Create a new table**
3. Create a table with these columns:
   - `id` (uuid, primary key, default: uuid_generate_v4())
   - `email` (text, unique, not null)
   - `name` (text)
   - `created_at` (timestamp, default: now())
   - `updated_at` (timestamp, default: now())

4. Set up Row Level Security (RLS):
   - Go to **Authentication** → **Policies**
   - Enable RLS on the users table
   - Create policies for read/write access

## Step 6: Test the Configuration

1. Restart your backend server
2. Test the Supabase OTP endpoints:

### Check Supabase Configuration
```bash
GET /api/supabase-otp/config
```

### Send OTP via Supabase
```bash
POST /api/supabase-otp/send
{
    "email": "test@example.com"
}
```

### Verify OTP via Supabase
```bash
POST /api/supabase-otp/verify
{
    "email": "test@example.com",
    "otp": "123456"
}
```

## Step 7: Frontend Integration

The frontend is already configured to use Supabase OTP endpoints. The flow is:

1. User enters email address
2. Frontend calls `/api/supabase-otp/send`
3. Supabase sends OTP email automatically
4. User enters OTP
5. Frontend calls `/api/supabase-otp/verify`
6. Supabase verifies OTP and creates session

## Features Available

1. **Email OTP Authentication**: Secure OTP generation and delivery
2. **Automatic User Creation**: Users are created automatically on first OTP
3. **Session Management**: Supabase handles sessions automatically
4. **Rate Limiting**: Built-in rate limiting by Supabase
5. **Fallback Mode**: Works even without Supabase configuration (for development)
6. **User Profiles**: Store additional user information in Supabase database

## Troubleshooting

### Common Issues

1. **"Supabase not configured" error**
   - Check your `.env` file for correct Supabase URL and keys
   - Ensure the keys are copied correctly without extra spaces

2. **"Failed to send OTP" error**
   - Check if email confirmations are disabled in Supabase Auth settings
   - Verify your site URL is correctly configured

3. **"Invalid OTP" error**
   - OTPs from Supabase are 6-digit numbers
   - Check your email spam folder for OTP messages
   - OTPs expire after 1 hour by default

4. **CORS issues**
   - Ensure your frontend URL is added to Supabase Auth redirect URLs
   - Check your backend CORS configuration

### Development Mode

When Supabase is not configured, the system works in fallback mode:
- OTP sending is simulated
- Use `123456` as the test OTP for verification
- All operations are logged for debugging

## Production Considerations

1. **Security**: Never commit your service role key to version control
2. **Environment Variables**: Use different keys for development and production
3. **Email Templates**: Customize Supabase email templates with your branding
4. **Rate Limiting**: Monitor and adjust rate limits as needed
5. **User Management**: Set up proper RLS policies for data security

## Advanced Features

### Custom Email Templates

1. In Supabase, go to **Authentication** → **Email Templates**
2. Customize the "Magic Link" template for OTP emails
3. Include your branding and custom messaging

### User Profile Management

Use the `/api/supabase-otp/profile` endpoint to store user information:

```bash
POST /api/supabase-otp/profile
{
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+1234567890"
}
```

### Session Management

Supabase automatically handles JWT tokens and sessions. The verified OTP response includes session information that you can use for authenticated requests.

That's it! Your LokAI application is now configured to use Supabase for secure OTP authentication.
