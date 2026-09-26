import { body, param, query, validationResult } from 'express-validator';
import { HandleERROR } from 'vanta-api';
import { handleValidationErrors } from '../../Utils/handleValidationErrors.js';

// ==================== PARAM VALIDATORS ====================

export const validateUserId = () => {
  return param('id')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid user ID format');
};

// ==================== QUERY VALIDATORS ====================

export const validateUserQuery = () => {
  return [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer')
      .toInt(),

    query('limit')
      .optional()
      .isInt({ min: 1, max: 1000 })
      .withMessage('Limit must be between 1 and 1000')
      .toInt(),

    query('sort')
      .optional()
      .isString()
      .withMessage('Sort parameter must be a string')
      .trim(),

    query('fields')
      .optional()
      .isString()
      .withMessage('Fields parameter must be a string')
      .trim(),

    query('q')
      .optional()
      .isString()
      .withMessage('Search query must be a string')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Search query cannot be empty'),

    query('populate')
      .optional()
      .isString()
      .withMessage('Populate parameter must be a string')
      .trim(),
  ];
};

// ==================== BODY VALIDATORS ====================

// Phone number validation (فقط با صفر اول - 11 رقم)
// optional = true  => اگه نفرستادی، رد نکن
// optional = false => اجباری
export const phoneNumberValidation = (optional = false) => {
  const chain = body('phoneNumber').trim();

  return optional
    ? chain
        .optional({ checkFalsy: true })
        .matches(/^09\d{9}$/)
        .withMessage('Invalid Iranian phone number format (ex: 09123456789)')
    : chain
        .notEmpty()
        .withMessage('Phone number is required')
        .matches(/^09\d{9}$/)
        .withMessage('Invalid Iranian phone number format (ex: 09123456789)');
};

// Full name validation (همیشه optional - چون توی update و create اختیاریه)
export const fullNameValidation = () => {
  return body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 to 100 characters')
    .matches(/^[\u0600-\u06FF\sa-zA-Z]+$/)
    .withMessage('Full name can only contain letters and spaces');
};

// Birth year validation
export const birthYearValidation = () => {
  return body('birthYear')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format (use ISO 8601: YYYY-MM-DD)')
    .toDate()
    .custom((value) => {
      const minDate = new Date('1900-01-01');
      const maxDate = new Date();
      if (value < minDate || value > maxDate) {
        throw new Error('Birth year must be between 1900 and present');
      }
      return true;
    });
};

// Role validation
export const roleValidation = () => {
  return body('role')
    .optional()
    .isIn(['admin', 'superAdmin', 'user'])
    .withMessage('Role must be one of: admin, superAdmin, user');
};

// IsActive validation
export const isActiveValidation = () => {
  return body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean (true or false)')
    .toBoolean();
};

// Password validations
// optional = true  => برای update
// optional = false => برای create / login
export const passwordValidation = (optional = false) => {
  const chain = body('password');

  return optional
    ? chain
        .optional()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/)
        .withMessage(
          'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        )
    : chain
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/)
        .withMessage(
          'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        );
};

// Old password validation (اجباری)
export const oldPasswordValidation = () => {
  return body('oldPassword')
    .notEmpty()
    .withMessage('Old password is required when changing password')
    .isLength({ min: 8 })
    .withMessage('Old password must be at least 8 characters long');
};

// New password validation (اجباری)
export const newPasswordValidation = () => {
  return body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/)
    .withMessage(
      'New password must contain at least one uppercase letter, one lowercase letter, and one number',
    );
};

// Confirm password validation (اجباری + باید با newPassword یکی باشه)
export const confirmPasswordValidation = () => {
  return body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Confirm password does not match new password');
      }
      return true;
    });
};

// ==================== USER VALIDATORS ====================

// 1. Get All Users Validator
export const validateGetAllUsers = [
  ...validateUserQuery(),
  handleValidationErrors,
];

// 2. Get Single User Validator
export const validateGetSingleUser = [
  validateUserId(),
  ...validateUserQuery(),
  handleValidationErrors,
];

// 3. Update User Validator (فیلدها همه optional)
export const validateUpdateUser = [
  validateUserId(),
  fullNameValidation(),
  birthYearValidation(),
  roleValidation(),
  isActiveValidation(),
  phoneNumberValidation(true), // optional
  handleValidationErrors,
];

// 4. Change Password Validator
export const validateChangePassword = [
  validateUserId(),
  oldPasswordValidation(),
  newPasswordValidation(),
  confirmPasswordValidation(),
  handleValidationErrors,
];

// 5. Admin Create User Validator (phone + password اجباری)
export const validateAdminCreateUser = [
  phoneNumberValidation(), // required
  passwordValidation(), // required
  fullNameValidation(), // optional
  roleValidation(), // optional
  isActiveValidation(), // optional
  birthYearValidation(), // optional
  handleValidationErrors,
];

// 6. Admin Update User Validator (همه چی optional)
export const validateAdminUpdateUser = [
  validateUserId(),
  phoneNumberValidation(true), // optional
  fullNameValidation(), // optional
  birthYearValidation(), // optional
  roleValidation(), // optional
  isActiveValidation(), // optional
  handleValidationErrors,
];

// 7. Admin Delete User Validator
export const validateAdminDeleteUser = [validateUserId(), handleValidationErrors];

// ==================== PERMISSION VALIDATORS ====================

// Check if user has permission to access/modify the resource
export const validateUserPermission = (req, res, next) => {
  const { id } = req.params;
  const userRole = req.role;
  const userId = req.userId;

  // Admin and superAdmin have full access
  if (userRole === 'admin' || userRole === 'superAdmin') {
    return next();
  }

  // Regular users can only access their own data
  if (userRole === 'user' && userId.toString() === id.toString()) {
    return next();
  }

  return next(
    new HandleERROR('You do not have permission to access this resource', 403),
  );
};

// ==================== DEFAULT EXPORT ====================
// فقط validator-های اصلی (نام‌گذاری‌شده‌ها) رو اینجا میاریم
// تا با named export تداخل نکنه

export default {
  handleValidationErrors,
  validateUserId,
  validateUserQuery,
  validateGetAllUsers,
  validateGetSingleUser,
  validateUpdateUser,
  validateChangePassword,
  validateAdminCreateUser,
  validateAdminUpdateUser,
  validateAdminDeleteUser,
  validateUserPermission,
};