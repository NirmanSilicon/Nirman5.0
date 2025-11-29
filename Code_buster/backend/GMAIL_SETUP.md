# Gmail Setup Guide for LokAI

This guide will help you configure Gmail SMTP for sending OTP emails instead of SMS messages.

## Step 1: Enable 2-Factor Authentication

1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left navigation
3. Enable "2-Step Verification" if it's not already enabled
4. Follow the setup process

## Step 2: Generate App Password

1. After enabling 2-Step Verification, go back to Security settings
2. Click on "App passwords" (you may need to sign in again)
3. Under "Select app", choose "Mail"
4. Under "Select device", choose "Other (Custom name)"
5. Enter "LokAI Backend" as the custom name
6. Click "Generate"
7. **Important**: Copy the 16-character password immediately (you won't see it again)

## Step 3: Update Environment Variables

Update your `.env` file with your Gmail credentials:

```bash
# Gmail Configuration
# Use App Password for Gmail: https://support.google.com/accounts/answer/185833
GMAIL_EMAIL=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
```

Replace:
- `your-email@gmail.com` with your actual Gmail address
- `your-16-character-app-password` with the app password you generated

## Step 4: Test the Configuration

1. Restart your backend server
2. Test the email OTP endpoints:

### Send OTP via Email
```bash
POST /api/email-otp/send
{
    "email": "test@example.com"
}
```

### Verify OTP via Email
```bash
POST /api/email-otp/verify
{
    "email": "test@example.com",
    "otp": "123456"
}
```

### Send Welcome Email
```bash
POST /api/email-otp/welcome
{
    "email": "test@example.com"
}
```

## Step 5: Update Frontend

Update your frontend to use the new email OTP endpoints instead of SMS:

- Replace `/api/otp/send` with `/api/email-otp/send`
- Replace `/api/otp/verify` with `/api/email-otp/verify`
- Update the UI to ask for email instead of phone number

## Features Available

1. **OTP Verification**: Send and verify OTP codes via email
2. **Welcome Emails**: Send welcome messages to new users
3. **Complaint Updates**: Send status updates via email
4. **HTML Templates**: Beautiful, responsive email templates
5. **Rate Limiting**: Prevent spam with rate limiting
6. **Development Mode**: Show OTP in development for testing

## Troubleshooting

### Common Issues

1. **"Authentication failed" error**
   - Double-check your app password
   - Ensure 2-Step Verification is enabled
   - Make sure you're using the app password, not your regular password

2. **"SMTP server not found" error**
   - Check your internet connection
   - Ensure Gmail SMTP settings are correct (smtp.gmail.com:587)

3. **"Email not sending" error**
   - Check if Gmail is blocking less secure apps
   - Try enabling "Allow less secure apps" temporarily for testing

### Security Notes

- **Never** commit your app password to version control
- Use environment variables for all sensitive data
- Consider using a dedicated Gmail account for production
- Enable logging to monitor email delivery status

## Alternative Email Providers

If you prefer not to use Gmail, you can easily modify the `email_service.py` to use other providers:

- **SendGrid**: More reliable for bulk emails
- **AWS SES**: Cost-effective for high volume
- **Mailgun**: Advanced features and analytics

Just update the SMTP settings in the `EmailService` class.

## Testing in Development

In development mode (`DEBUG=True`), the OTP will be included in the API response for easy testing:

```json
{
    "message": "OTP sent successfully to your email",
    "email": "test@example.com",
    "expires_in_minutes": 5,
    "attempts_remaining": 3,
    "otp": "123456",  // Only in development mode
    "email_info": "In development mode - OTP shown above for testing"
}
```

## Production Considerations

1. **Domain Verification**: Consider verifying your domain with Gmail
2. **Email Templates**: Customize email templates with your branding
3. **Monitoring**: Set up email delivery monitoring
4. **Fallback**: Consider having a backup email service
5. **Unsubscribe**: Include unsubscribe links in marketing emails

That's it! Your LokAI application is now configured to send emails via Gmail instead of SMS messages.
