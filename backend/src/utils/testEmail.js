import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Load environment variables
dotenv.config();

const testEmail = async () => {
  console.log('Testing email configuration...');
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? '✓ Set' : '✗ Not set'}`);
  console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? '✓ Set' : '✗ Not set'}`);
  
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  try {
    // Send test email
    const info = await transporter.sendMail({
      from: `"India Carbon Registry" <${process.env.EMAIL_USER}>`,
      to: "test@0xastro.anonaddy.me", // Send to self
      subject: "Test Email - India Carbon Registry",
      text: "This is a test email to verify the configuration is working.",
      html: "<b>This is a test email to verify the configuration is working.</b>"
    });
    
    console.log('✅ Message sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};

// Run the test
testEmail();
