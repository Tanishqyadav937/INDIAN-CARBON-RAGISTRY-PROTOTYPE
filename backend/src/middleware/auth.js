import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';
import { getDatabaseStatus } from '../config/database.js';
import { findUserById as findMockUserById } from '../utils/mockData.js';

export const authenticate = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }

    // Get user from token
    let user;
    if (getDatabaseStatus()) {
      user = await User.findById(decoded.userId).select('-password');
    } else {
      // Use mock data
      user = findMockUserById(decoded.userId);
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is not active. Please verify your email first.'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to too many failed login attempts.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed.'
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please log in first.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const user = await User.findById(decoded.userId).select('-password');
        if (user && user.status === 'active' && !user.isLocked) {
          req.user = user;
        }
      }
    }

    next();
  } catch (error) {
    next();
  }
};
