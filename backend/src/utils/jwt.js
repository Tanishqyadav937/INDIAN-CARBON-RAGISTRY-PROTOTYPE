import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const generateVerificationToken = () => {
  // Generate a 6-digit numeric code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Return the verification code
  return code;
};

export const generateResetToken = () => {
  return jwt.sign(
    { purpose: 'password_reset' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};
