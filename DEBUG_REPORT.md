# Code Analysis & Debug Report

## Critical Issues Found

### 1. **Backend - authController.js: Regex Injection Vulnerability**
- **Location**: Lines 56, 127, 269, 328
- **Issue**: Using user input directly in regex without escaping
- **Problem**: `new RegExp(^${email}$, 'i')` can cause regex injection attacks
- **Fix**: Escape special regex characters

### 2. **Backend - resetPassword.js: Incorrect Token Handling**
- **Location**: resetPassword function
- **Issue**: Token is hashed with SHA256 but generated as random bytes
- **Problem**: The token comparison logic doesn't match token generation
- **Fix**: Use consistent token handling

### 3. **Frontend - App.tsx: Hardcoded Backend URL**
- **Location**: Multiple fetch calls
- **Issue**: `http://localhost:5000` hardcoded throughout
- **Problem**: Won't work in production, should use environment variable
- **Fix**: Use environment variable for API URL

### 4. **Frontend - LoginPage.tsx: Hardcoded Backend URL**
- **Location**: Multiple fetch calls
- **Issue**: Same hardcoded localhost issue
- **Fix**: Use environment variable

### 5. **Backend - User Model: Missing loginAttempts Reset**
- **Location**: User.js resetLoginAttempts method
- **Issue**: Using $unset incorrectly for loginAttempts
- **Problem**: Should set to 0, not unset
- **Fix**: Change $unset to $set with value 0

### 6. **Backend - authController.js: Password Reset Token Mismatch**
- **Location**: resetPassword function
- **Issue**: Token is hashed but comparison logic expects plain token
- **Problem**: Tokens won't match during verification
- **Fix**: Ensure consistent hashing

### 7. **Frontend - Missing Environment Configuration**
- **Issue**: No .env file for API URL configuration
- **Fix**: Create .env.local with VITE_API_URL

### 8. **Backend - Missing Environment Configuration**
- **Issue**: No .env file template
- **Fix**: Create .env.example with required variables

## Warnings

- Email sending will fail without proper Gmail credentials
- MongoDB connection will fail without proper URI
- Frontend will show errors without backend running

## Summary
- 8 issues identified
- 3 critical (security/functionality)
- 5 important (configuration/usability)
