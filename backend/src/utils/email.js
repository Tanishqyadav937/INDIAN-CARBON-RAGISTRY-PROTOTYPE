import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async (options) => {
  try {
    const message = {
      from: `"India Carbon Registry" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    // Send the email
    const info = await transporter.sendMail(message);
    console.log('✅ Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    // Don't throw error to prevent registration failure
    console.log('⚠️ Continuing without email verification. User can request verification email later.');
    return null;
  }
};

export const sendVerificationEmail = async (user, token) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { 
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                line-height: 1.6; 
                color: #2d3748; 
                background: linear-gradient(135deg, #f0f9f4 0%, #f5f5dc 50%, #fff8dc 100%);
                margin: 0;
                padding: 20px;
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: white;
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
            }
            .header { 
                background: linear-gradient(135deg, #8fbc8f, #6b8e6b); 
                color: white; 
                padding: 40px 30px; 
                text-align: center; 
                position: relative;
            }
            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1), transparent 60%);
            }
            .header h1 { 
                font-size: 28px; 
                font-weight: 300; 
                margin: 0 0 8px 0;
                position: relative;
                z-index: 1;
            }
            .header h2 { 
                font-size: 18px; 
                font-weight: 400; 
                margin: 0;
                opacity: 0.9;
                position: relative;
                z-index: 1;
            }
            .content { 
                padding: 40px 30px; 
                background: white;
            }
            .code { 
                font-size: 36px; 
                font-weight: 600; 
                letter-spacing: 8px; 
                text-align: center; 
                padding: 30px; 
                background: linear-gradient(135deg, #f0f9f4, #e8f5e8); 
                border: 2px solid #8fbc8f;
                border-radius: 16px; 
                margin: 30px 0; 
                color: #2d3748; 
                font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .footer { 
                text-align: center; 
                color: #718096; 
                font-size: 14px; 
                margin-top: 30px; 
                padding: 20px 30px;
                background: #f8f9fa;
                border-top: 1px solid #e2e8f0;
            }
            .content p {
                font-size: 16px;
                line-height: 1.7;
                margin-bottom: 16px;
                color: #4a5568;
            }
            .content strong {
                color: #2d3748;
                font-weight: 600;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🌱 India Carbon Registry</h1>
                <h2>Email Verification Required</h2>
            </div>
            <div class="content">
                <p>Dear ${user.name},</p>
                <p>Thank you for registering with India Carbon Registry! To complete your registration and start using our platform, please verify your email address using the verification code below:</p>
                
                <div class="code">${token}</div>
                
                <p>Enter this code in the verification page to activate your account.</p>
                <p><strong>This code will expire in 24 hours.</strong></p>
                <p>If you didn't create an account with us, please ignore this email.</p>
                <p>Best regards,<br>India Carbon Registry Team</p>
            </div>
            <div class="footer">
                <p>This is an automated email. Please do not reply.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: '🌱 Your India Carbon Registry Verification Code',
    html
  });
};

export const sendPasswordResetEmail = async (user, token) => {
  // Generate a 6-digit code from the token
  const resetCode = token.substring(0, 6);
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { 
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                line-height: 1.6; 
                color: #2d3748; 
                background: linear-gradient(135deg, #f0f9f4 0%, #f5f5dc 50%, #fff8dc 100%);
                margin: 0;
                padding: 20px;
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: white;
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
            }
            .header { 
                background: linear-gradient(135deg, #d4a574, #b8860b); 
                color: white; 
                padding: 40px 30px; 
                text-align: center; 
                position: relative;
            }
            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1), transparent 60%);
            }
            .header h1 { 
                font-size: 28px; 
                font-weight: 300; 
                margin: 0 0 8px 0;
                position: relative;
                z-index: 1;
            }
            .header h2 { 
                font-size: 18px; 
                font-weight: 400; 
                margin: 0;
                opacity: 0.9;
                position: relative;
                z-index: 1;
            }
            .content { 
                padding: 40px 30px; 
                background: white;
            }
            .code { 
                font-size: 36px; 
                font-weight: 600; 
                letter-spacing: 8px; 
                text-align: center; 
                padding: 30px; 
                background: linear-gradient(135deg, #fef7e0, #f4e4bc); 
                border: 2px solid #d4a574;
                border-radius: 16px; 
                margin: 30px 0; 
                color: #2d3748; 
                font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .footer { 
                text-align: center; 
                color: #718096; 
                font-size: 14px; 
                margin-top: 30px; 
                padding: 20px 30px;
                background: #f8f9fa;
                border-top: 1px solid #e2e8f0;
            }
            .content p {
                font-size: 16px;
                line-height: 1.7;
                margin-bottom: 16px;
                color: #4a5568;
            }
            .content strong {
                color: #2d3748;
                font-weight: 600;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 India Carbon Registry</h1>
                <h2>Password Reset Code</h2>
            </div>
            <div class="content">
                <p>Dear ${user.name},</p>
                <p>We received a request to reset your password for your India Carbon Registry account.</p>
                <p>Please use the code below to reset your password:</p>
                
                <div class="code">${resetCode}</div>
                
                <p><strong>This code will expire in 1 hour.</strong></p>
                <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
                <p>Best regards,<br>India Carbon Registry Team</p>
            </div>
            <div class="footer">
                <p>This is an automated email. Please do not reply.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: '🔐 Your India Carbon Registry Password Reset Code',
    html
  });
};

export const sendWelcomeEmail = async (user) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { 
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                line-height: 1.6; 
                color: #2d3748; 
                background: linear-gradient(135deg, #f0f9f4 0%, #f5f5dc 50%, #fff8dc 100%);
                margin: 0;
                padding: 20px;
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: white;
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
            }
            .header { 
                background: linear-gradient(135deg, #8fbc8f, #6b8e6b); 
                color: white; 
                padding: 40px 30px; 
                text-align: center; 
                position: relative;
            }
            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1), transparent 60%);
            }
            .header h1 { 
                font-size: 28px; 
                font-weight: 300; 
                margin: 0;
                position: relative;
                z-index: 1;
            }
            .content { 
                padding: 40px 30px; 
                background: white;
            }
            .button { 
                display: inline-block; 
                background: linear-gradient(135deg, #8fbc8f, #6b8e6b); 
                color: white; 
                padding: 16px 32px; 
                text-decoration: none; 
                border-radius: 16px; 
                margin: 24px 0; 
                font-weight: 600;
                font-size: 16px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
            }
            .button:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1);
            }
            .footer { 
                text-align: center; 
                color: #718096; 
                font-size: 14px; 
                margin-top: 30px; 
                padding: 20px 30px;
                background: #f8f9fa;
                border-top: 1px solid #e2e8f0;
            }
            .content p {
                font-size: 16px;
                line-height: 1.7;
                margin-bottom: 16px;
                color: #4a5568;
            }
            .content ul {
                margin: 24px 0;
                padding-left: 0;
                list-style: none;
            }
            .content li {
                font-size: 16px;
                line-height: 1.7;
                margin-bottom: 12px;
                color: #4a5568;
                padding-left: 0;
            }
            .content strong {
                color: #2d3748;
                font-weight: 600;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Welcome to India Carbon Registry!</h1>
            </div>
            <div class="content">
                <p>Dear ${user.name},</p>
                <p>Congratulations! Your email has been successfully verified and your account is now active.</p>
                <p>You can now access all features of the India Carbon Registry platform:</p>
                <ul>
                    <li>🏗️ Register carbon credit projects</li>
                    <li>📊 Track project progress and emissions</li>
                    <li>💱 Trade carbon credits in the marketplace</li>
                    <li>📈 View analytics and reports</li>
                    <li>🤝 Connect with other stakeholders</li>
                </ul>
                <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
                <p>Thank you for joining India's journey towards carbon neutrality!</p>
                <p>Best regards,<br>India Carbon Registry Team</p>
            </div>
            <div class="footer">
                <p>This is an automated email. Please do not reply.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: '🎉 Welcome to India Carbon Registry!',
    html
  });
};
