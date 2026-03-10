import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateToken, generateVerificationToken, generateResetToken } from '../utils/jwt.js';
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from '../utils/email.js';
import { getDatabaseStatus } from '../config/database.js';
import { findUserByEmail as findMockUserByEmail, comparePassword as compareMockPassword } from '../utils/mockData.js';
import crypto from 'crypto';

// Validation rules
export const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('organization.name')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Organization name cannot exceed 200 characters'),
  body('organization.type')
    .optional()
    .isIn(['Government', 'Corporate', 'NGO', 'Individual', 'Research'])
    .withMessage('Invalid organization type')
];

export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Register new user
export const register = async (req, res, next) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, organization } = req.body;

    // Check if user already exists (case-insensitive)
    const existingUser = await User.findOne({ 
      email: email.toLowerCase()
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      organization,
      verification: {
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires
      }
    });

    // Send verification email
    try {
      const emailResult = await sendVerificationEmail(user, verificationToken);
      if (emailResult && emailResult.messageId) {
        console.log('Verification email sent successfully');
      } else {
        console.log('Email sending handled gracefully, continuing with registration');
      }
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail the registration if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          status: user.status
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (req, res, next) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    let user;
    
    // Try to use database first, fall back to mock data
    if (getDatabaseStatus()) {
      // Find user by email (case-insensitive) and include password
      user = await User.findOne({ 
        email: email.toLowerCase()
      }).select('+password');
    } else {
      // Use mock data
      user = findMockUserByEmail(email);
    }
    
    if (!user) {
      console.log(`Login attempt with non-existent email: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to too many failed login attempts. Please try again later.'
      });
    }

    // Check password
    let isPasswordValid;
    if (getDatabaseStatus()) {
      isPasswordValid = await user.comparePassword(password);
    } else {
      isPasswordValid = await compareMockPassword(password, user.password);
    }
    
    if (!isPasswordValid) {
      // Increment login attempts
      if (getDatabaseStatus()) {
        await user.incrementLoginAttempts();
      }
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if email is verified
    if (!user.verification.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email before logging in',
        requiresVerification: true
      });
    }

    // Reset login attempts on successful login
    if (getDatabaseStatus() && user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Update last login
    if (getDatabaseStatus()) {
      user.lastLogin = new Date();
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          organization: user.organization,
          profile: user.profile,
          lastLogin: user.lastLogin
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Verify email
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    // Find user by verification token
    const user = await User.findOne({
      'verification.emailVerificationToken': token,
      'verification.emailVerificationExpires': { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Update user verification status
    user.verification.isEmailVerified = true;
    user.verification.emailVerificationToken = undefined;
    user.verification.emailVerificationExpires = undefined;
    user.status = 'active';

    await user.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(user);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    // Generate JWT token
    const authToken = generateToken(user._id);

    res.json({
      success: true,
      message: 'Email verified successfully. Welcome to India Carbon Registry!',
      data: {
        token: authToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          organization: user.organization
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Resend verification email
export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Case-insensitive search for email
    const user = await User.findOne({ 
      email: email.toLowerCase()
    });
    
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.verification.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verification.emailVerificationToken = verificationToken;
    user.verification.emailVerificationExpires = verificationExpires;
    await user.save();

    // Send verification email
    try {
      const emailResult = await sendVerificationEmail(user, verificationToken);
      if (emailResult && emailResult.messageId) {
        console.log(`Verification email sent successfully to ${user.email}`);
      } else {
        console.log(`Email sending handled gracefully for ${user.email}, continuing with verification process`);
      }
      
      res.json({
        success: true,
        message: 'Verification email sent successfully'
      });
    } catch (emailError) {
      console.error(`Failed to send verification email to ${user.email}:`, emailError);
      // Still return success to client but with a different message
      res.json({
        success: true,
        message: 'Verification process initiated. If you do not receive an email, please check your spam folder or try again later.'
      });
    }
  } catch (error) {
    next(error);
  }
};

// Forgot password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Case-insensitive search for email
    const user = await User.findOne({ 
      email: email.toLowerCase()
    });
    
    if (!user) {
      // Don't reveal whether user exists or not
      console.log(`Password reset requested for non-existent email: ${email}`);
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset code has been sent.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetPassword = {
      token: crypto.createHash('sha256').update(resetToken).digest('hex'),
      expires: resetExpires
    };
    await user.save();

    // Send reset email
    try {
      await sendPasswordResetEmail(user, resetToken);
    } catch (emailError) {
      user.resetPassword = undefined;
      await user.save();
      throw emailError;
    }

    res.json({
      success: true,
      message: 'Password reset code has been sent to your email'
    });
  } catch (error) {
    next(error);
  }
};

// Reset password
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Hash token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      'resetPassword.token': hashedToken,
      'resetPassword.expires': { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Set new password
    user.password = password;
    user.resetPassword = undefined;
    user.loginAttempts = 0;
    user.lockUntil = undefined;

    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
export const getMe = async (req, res, next) => {
  try {
    let user;
    
    if (getDatabaseStatus()) {
      user = await User.findById(req.user._id).populate('organization');
    } else {
      // req.user is already set by middleware from mock data
      user = req.user;
    }
    
    res.json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, organization, profile } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (name) user.name = name;
    if (organization) user.organization = { ...user.organization, ...organization };
    if (profile) user.profile = { ...user.profile, ...profile };
    
    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

// Change password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    
    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};
