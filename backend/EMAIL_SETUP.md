# Gmail Email Setup Guide for India Carbon Registry

This guide explains how to set up Gmail to work with the India Carbon Registry application for sending verification emails, password reset emails, and welcome emails.

## 1. Create App Password for Gmail

Gmail requires an App Password for applications that don't support OAuth 2.0. Follow these steps to create one:

1. Go to your [Google Account](https://myaccount.google.com/)
2. Select "Security" from the left navigation panel
3. Under "Signing in to Google," select "2-Step Verification" (you must have this enabled)
4. At the bottom of the page, select "App passwords"
5. Click "Select app" and choose "Mail"
6. Click "Select device" and choose "Other (Custom name)"
7. Enter "India Carbon Registry" and click "Generate"
8. Google will display a 16-character password. **Copy this password**

## 2. Update Environment Variables

Create a `.env` file in the backend directory with the following email configuration:

```
# Email configuration for Gmail
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-16-character-app-password
```

Replace:
- `your-gmail-address@gmail.com` with your actual Gmail address
- `your-16-character-app-password` with the app password generated in step 1

## 3. Gmail Account Settings

Ensure your Gmail account has the following settings:

1. Less secure app access: This is no longer relevant if using App Passwords
2. IMAP access: Should be enabled in Gmail settings
3. No recent security incidents that might cause Google to block the connection

## 4. Troubleshooting

If you encounter email sending issues:

### Common Error: "454 4.7.0 TLS not available due to local problem"
- Solution: We've updated the code to use port 465 with secure connection (SSL/TLS)

### Error: "Invalid login credentials"
- Check that you're using the App Password, not your regular Gmail password
- Verify that 2-Step Verification is enabled on your account
- Regenerate a new App Password if needed

### Error: "Connection refused"
- Check your firewall settings
- Ensure your network allows outgoing connections to Gmail's SMTP server

## 5. Testing Email Functionality

To test if your email configuration is working:

1. Start the server: `npm run dev`
2. Register a new user account
3. Check if the verification email is received
4. Alternatively, use the "Forgot Password" feature to test email delivery

If emails are not being received, check the server logs for specific error messages.

## 6. Production Considerations

For production environments:
- Consider using a dedicated email service like SendGrid, Mailgun, or Amazon SES
- Update the email transport configuration accordingly
- Set appropriate rate limits to avoid being flagged as spam
