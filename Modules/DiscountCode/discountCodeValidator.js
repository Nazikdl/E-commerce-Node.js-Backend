import { body, param, query, validationResult } from 'express-validator';
import { HandleERROR } from 'vanta-api';
import DiscountCode from './discountCodeMd.js';
import mongoose from 'mongoose';
import { handleValidationErrors } from '../../Utils/handleValidationErrors.js';


// ==================== PARAM VALIDATORS ====================

export const validateDiscountCodeId = () => {
  return param('id')
    .notEmpty()
    .withMessage('Discount code ID is required')
    .isMongoId()
    .withMessage('Invalid discount code ID format');
};

// ==================== QUERY VALIDATORS ====================

export const validateDiscountCodeQuery = () => {
  return [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer')
      .toInt(),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
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
    
    query('type')
      .optional()
      .isIn(['percentage', 'fixed'])
      .withMessage('Type must be "percentage" or "fixed"'),
    
    query('isPublished')
      .optional()
      .isBoolean()
      .withMessage('isPublished must be a boolean')
      .toBoolean(),
    
    query('freeShipping')
      .optional()
      .isBoolean()
      .withMessage('freeShipping must be a boolean')
      .toBoolean(),
    
    handleValidationErrors
  ];
};

// ==================== BODY VALIDATORS ====================

// Code validation
export const codeValidation = () => {
  return body('code')
    .trim()
    .notEmpty()
    .withMessage('Discount code is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Discount code must be between 3 to 50 characters')
    .matches(/^[A-Z0-9\-_]+$/)
    .withMessage('Code can only contain uppercase letters, numbers, hyphens, and underscores')
    .custom(value => {
      // Convert to uppercase for consistency
      return value.toUpperCase();
    });
};

// Type validation
export const typeValidation = () => {
  return body('type')
    .trim()
    .notEmpty()
    .withMessage('Type is required')
    .isIn(['percentage', 'fixed'])
    .withMessage('Type must be "percentage" or "fixed"');
};

// Value validation
export const valueValidation = () => {
  return body('value')
    .notEmpty()
    .withMessage('Value is required')
    .isFloat({ min: 0 })
    .withMessage('Value must be a positive number')
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.type === 'percentage' && value > 100) {
        throw new Error('For percentage type, value must be less than or equal to 100');
      }
      return true;
    });
};

// Start time validation
export const startTimeValidation = () => {
  return body('startTime')
    .optional()
    .isISO8601()
    .withMessage('Invalid start time format (use ISO 8601)')
    .toDate()
    .custom((value) => {
      const now = new Date();
      if (value < now) {
        throw new Error('Start time must be in the future');
      }
      return true;
    });
};

// Expire time validation
export const expireTimeValidation = () => {
  return body('expireTime')
    .optional()
    .isISO8601()
    .withMessage('Invalid expire time format (use ISO 8601)')
    .toDate()
    .custom((value, { req }) => {
      const startTime = req.body.startTime;
      if (startTime && value <= new Date(startTime)) {
        throw new Error('Expire time must be after start time');
      }
      const now = new Date();
      if (value < now) {
        throw new Error('Expire time must be in the future');
      }
      return true;
    });
};

// Min price validation
export const minPriceValidation = () => {
  return body('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Min price must be a positive number')
    .toFloat();
};

// Max price validation
export const maxPriceValidation = () => {
  return body('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Max price must be a positive number')
    .toFloat()
    .custom((value, { req }) => {
      const minPrice = req.body.minPrice;
      if (minPrice && value && value < minPrice) {
        throw new Error('Max price must be greater than or equal to min price');
      }
      return true;
    });
};

// Usage limit validation
export const usageLimitValidation = () => {
  return body('usageLimit')
    .notEmpty()
    .withMessage('Usage limit is required')
    .isInt({ min: 1 })
    .withMessage('Usage limit must be at least 1')
    .toInt();
};

// User used limit validation
export const userUsedLimitValidation = () => {
  return body('userUsedLimit')
    .notEmpty()
    .withMessage('User used limit is required')
    .isInt({ min: 1 })
    .withMessage('User used limit must be at least 1')
    .toInt();
};

// Free shipping validation
export const freeShippingValidation = () => {
  return body('freeShipping')
    .optional()
    .isBoolean()
    .withMessage('freeShipping must be a boolean')
    .toBoolean();
};

// IsPublished validation
export const isPublishedValidation = () => {
  return body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean')
    .toBoolean();
};

// ==================== READ-ONLY FIELDS ====================

export const validateReadOnlyFields = () => {
  return [
    body('usedCount')
      .optional()
      .custom(() => {
        throw new Error('usedCount is auto-calculated and cannot be updated directly');
      }),
    
    body('userIdUsed')
      .optional()
      .custom(() => {
        throw new Error('userIdUsed is auto-managed and cannot be updated directly');
      })
  ];
};

// ==================== CODE UNIQUENESS ====================

export const validateCodeUnique = () => {
  return body('code')
    .custom(async (value, { req }) => {
      if (!value) return true;
      
      const discountCode = await DiscountCode.findOne({ 
        code: { $regex: new RegExp(`^${value}$`, 'i') }
      });
      
      if (!discountCode) return true;
      
      if (req.params.id && discountCode._id.toString() === req.params.id) {
        return true;
      }
      
      throw new Error('Discount code already taken');
    });
};

// ==================== DISCOUNT CODE VALIDATORS ====================

// 1. Get All Discount Codes Validator
export const validateGetAllDiscountCodes = [
  validateDiscountCodeQuery(),
  handleValidationErrors
];

// 2. Get Single Discount Code Validator
export const validateGetSingleDiscountCode = [
  validateDiscountCodeId(),
  validateDiscountCodeQuery(),
  handleValidationErrors
];

// 3. Create Discount Code Validator
export const validateCreateDiscountCode = [
  codeValidation(),
  validateCodeUnique(),
  typeValidation(),
  valueValidation(),
  startTimeValidation(),
  expireTimeValidation(),
  minPriceValidation(),
  maxPriceValidation(),
  usageLimitValidation(),
  userUsedLimitValidation(),
  freeShippingValidation(),
  isPublishedValidation(),
  handleValidationErrors
];

// 4. Update Discount Code Validator
export const validateUpdateDiscountCode = [
  validateDiscountCodeId(),
  codeValidation(),
  validateCodeUnique(),
  typeValidation(),
  valueValidation(),
  startTimeValidation(),
  expireTimeValidation(),
  minPriceValidation(),
  maxPriceValidation(),
  usageLimitValidation(),
  userUsedLimitValidation(),
  freeShippingValidation(),
  isPublishedValidation(),
  validateReadOnlyFields(),
  handleValidationErrors
];

// 5. Delete Discount Code Validator
export const validateDeleteDiscountCode = [
  validateDiscountCodeId(),
  handleValidationErrors
];

// 6. Check Discount Code Validator
export const validateCheckDiscountCode = [
  body('code')
    .trim()
    .notEmpty()
    .withMessage('Discount code is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Discount code must be between 3 to 50 characters')
    .matches(/^[A-Z0-9\-_]+$/)
    .withMessage('Invalid discount code format'),
  handleValidationErrors
];

// ==================== DISCOUNT CODE EXISTENCE ====================

export const validateDiscountCodeExists = async (req, res, next) => {
  const { id } = req.params;
  const discountCode = await DiscountCode.findById(id);
  
  if (!discountCode) {
    return next(new HandleERROR('Discount code not found', 404));
  }
  
  req.discountCode = discountCode;
  next();
};

// ==================== DISCOUNT CODE CAN DELETE ====================

export const validateCanDelete = async (req, res, next) => {
  const { id } = req.params;
  const discountCode = await DiscountCode.findById(id);
  
  if (!discountCode) {
    return next(new HandleERROR('Discount code not found', 404));
  }
  
  if (discountCode.usedCount > 0) {
    return next(new HandleERROR(
      'Cannot delete code because it has been used by at least one user. Change isPublished instead.',
      400
    ));
  }
  
  next();
};

// ==================== COMPOSED VALIDATORS ====================

export const validateDiscountCodeCreate = [
  codeValidation(),
  validateCodeUnique(),
  typeValidation(),
  valueValidation(),
  startTimeValidation(),
  expireTimeValidation(),
  minPriceValidation(),
  maxPriceValidation(),
  usageLimitValidation(),
  userUsedLimitValidation(),
  freeShippingValidation(),
  isPublishedValidation(),
  handleValidationErrors
];

export const validateDiscountCodeUpdate = [
  validateDiscountCodeId(),
  codeValidation(),
  validateCodeUnique(),
  typeValidation(),
  valueValidation(),
  startTimeValidation(),
  expireTimeValidation(),
  minPriceValidation(),
  maxPriceValidation(),
  usageLimitValidation(),
  userUsedLimitValidation(),
  freeShippingValidation(),
  isPublishedValidation(),
  validateReadOnlyFields(),
  handleValidationErrors
];

export const validateDiscountCodeGet = [
  validateDiscountCodeId(),
  handleValidationErrors
];

export const validateDiscountCodeDelete = [
  validateDiscountCodeId(),
  handleValidationErrors
];

export const validateDiscountCodeCheck = [
  body('code')
    .trim()
    .notEmpty()
    .withMessage('Discount code is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Discount code must be between 3 to 50 characters')
    .matches(/^[A-Z0-9\-_]+$/)
    .withMessage('Invalid discount code format'),
  handleValidationErrors
];

// ==================== EXPORT ALL ====================

export default {
  handleValidationErrors,
  validateDiscountCodeId,
  validateDiscountCodeQuery,
  validateGetAllDiscountCodes,
  validateGetSingleDiscountCode,
  validateCreateDiscountCode,
  validateUpdateDiscountCode,
  validateDeleteDiscountCode,
  validateCheckDiscountCode,
  validateDiscountCodeCreate,
  validateDiscountCodeUpdate,
  validateDiscountCodeGet,
  validateDiscountCodeDelete,
  validateDiscountCodeCheck,
  validateDiscountCodeExists,
  validateCanDelete,
  validateCodeUnique,
  validateReadOnlyFields,
  codeValidation,
  typeValidation,
  valueValidation,
  startTimeValidation,
  expireTimeValidation,
  minPriceValidation,
  maxPriceValidation,
  usageLimitValidation,
  userUsedLimitValidation,
  freeShippingValidation,
  isPublishedValidation
};