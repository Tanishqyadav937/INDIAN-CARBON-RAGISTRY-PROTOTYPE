import express from 'express';
import {
  register,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  changePassword,
  registerValidation,
  loginValidation
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Debug routes - remove in production
router.get('/debug-users', async (req, res) => {
  try {
    // Find demo user
    const demoUser = await User.findOne({ email: 'demo@carbonregistry.gov.in' }).select('+password');
    
    if (!demoUser) {
      return res.json({ 
        success: false, 
        message: 'Demo user not found',
        action: 'Run seed script to create demo users'
      });
    }
    
    // Check if password matches
    const isPasswordValid = await bcrypt.compare('demo123', demoUser.password);
    
    // Create a fresh demo user with known password
    if (!isPasswordValid) {
      // Hash password
      const hashedPassword = await bcrypt.hash('demo123', 12);
      
      // Update user password
      demoUser.password = hashedPassword;
      await demoUser.save();
      
      return res.json({
        success: true,
        message: 'Demo user password reset to demo123',
        user: {
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role,
          status: demoUser.status
        }
      });
    }
    
    return res.json({
      success: true,
      message: 'Demo user exists with correct password',
      user: {
        email: demoUser.email,
        name: demoUser.name,
        role: demoUser.role,
        status: demoUser.status,
        isVerified: demoUser.verification.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Debug route error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking demo users',
      error: error.message
    });
  }
});

// Reset all demo user passwords
router.get('/reset-demo-users', async (req, res) => {
  try {
    const demoEmails = [
      'demo@carbonregistry.gov.in',
      'contact@greenenergy.com',
      'info@forestngo.org',
      'verifier@carboncheck.com'
    ];
    
    // Hash password
    const hashedPassword = await bcrypt.hash('demo123', 12);
    
    // Update all demo users
    const results = [];
    
    for (const email of demoEmails) {
      const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
      
      if (user) {
        // Direct database update to ensure account is unlocked
        await User.updateOne(
          { _id: user._id },
          { 
            $set: { 
              password: hashedPassword,
              status: 'active',
              'verification.isEmailVerified': true,
              loginAttempts: 0
            },
            $unset: { lockUntil: 1 }
          }
        );
        
        // Refresh user data
        const updatedUser = await User.findById(user._id);
        
        results.push({
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          status: updatedUser.status,
          reset: true,
          unlocked: true
        });
      } else {
        results.push({
          email,
          reset: false,
          message: 'User not found'
        });
      }
    }
    
    return res.json({
      success: true,
      message: 'Demo users reset',
      results
    });
  } catch (error) {
    console.error('Reset demo users error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error resetting demo users',
      error: error.message
    });
  }
});

// Protected routes
router.use(authenticate); // All routes below require authentication

router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

export default router;
