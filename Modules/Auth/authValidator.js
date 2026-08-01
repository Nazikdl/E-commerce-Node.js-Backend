import { body, validationResult } from 'express-validator';
import { HandleERROR } from 'vanta-api';
import { handleValidationErrors } from '../../Utils/handleValidationErrors.js';


// Phone number validation rules
export const phoneNumberValidation = () => {
  return body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^(\+98|0)?9\d{9}$/)
    .withMessage('Invalid Iranian phone number format (ex: 09123456789 or +989123456789)');
};

// Password validation rules
export const passwordValidation = () => {
  return body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number');
};

// OTP code validation rules
export const otpCodeValidation = () => {
  return body('code')
    .trim()
    .notEmpty()
    .withMessage('OTP code is required')
    .isLength({ min: 4, max: 6 })
    .withMessage('OTP code must be between 4 to 6 digits')
    .matches(/^\d+$/)
    .withMessage('OTP code must contain only numbers');
};

// New password validation for forget password
export const newPasswordValidation = () => {
  return body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number');
};

// Optional fields validation
export const optionalFieldsValidation = () => {
  return [
    body('fullName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Full name must be between 2 to 100 characters'),
    
    body('email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    
    body('birthYear')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format')
      .toDate(),
  ];
};

// Role validation (for admin operations)
export const roleValidation = () => {
  return body('role')
    .optional()
    .isIn(['admin', 'superAdmin', 'user'])
    .withMessage('Role must be one of: admin, superAdmin, user');
};

// ==================== AUTH VALIDATORS ====================

// 1. Auth Validator - Initialize authentication
export const validateAuth = [
  phoneNumberValidation(),
  handleValidationErrors
];

// 2. Login with Password Validator
export const validateLoginPassword = [
  phoneNumberValidation(),
  passwordValidation(),
  handleValidationErrors
];

// 3. Login with OTP Validator
export const validateLoginOtp = [
  phoneNumberValidation(),
  otpCodeValidation(),
  handleValidationErrors
];

// 4. Resend Code Validator
export const validateResendCode = [
  phoneNumberValidation(),
  handleValidationErrors
];

// 5. Forget Password Validator
export const validateForgetPassword = [
  phoneNumberValidation(),
  otpCodeValidation(),
  newPasswordValidation(),
  handleValidationErrors
];

// 6. Update Profile Validator
export const validateUpdateProfile = [
  optionalFieldsValidation(),
  phoneNumberValidation().optional(),
  handleValidationErrors
];

// 7. Change Password Validator
export const validateChangePassword = [
  body('currentPassword')
    .trim()
    .notEmpty()
    .withMessage('Current password is required'),
  
  newPasswordValidation(),
  
  body('confirmPassword')
    .trim()
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  
  handleValidationErrors
];

// 8. Admin User Management Validator
export const validateAdminCreateUser = [
  phoneNumberValidation(),
  passwordValidation(),
  roleValidation(),
  optionalFieldsValidation(),
  handleValidationErrors
];

export const validateAdminUpdateUser = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid user ID format'),
  
  optionalFieldsValidation(),
  roleValidation(),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  handleValidationErrors
];