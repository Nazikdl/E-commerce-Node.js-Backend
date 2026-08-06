import { body, param, query, validationResult } from 'express-validator';
import { HandleERROR } from 'vanta-api';
import Variant from './variantMd.js';
import { handleValidationErrors } from '../../Utils/handleValidationErrors.js';


// ==================== PARAM VALIDATORS ====================

export const validateVariantId = () => {
  return param('id')
    .notEmpty()
    .withMessage('Variant ID is required')
    .isMongoId()
    .withMessage('Invalid variant ID format');
};

// ==================== QUERY VALIDATORS ====================

export const validateVariantQuery = () => {
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
    
    query('type')
      .optional()
      .isIn(['size', 'color'])
      .withMessage('Type must be either "size" or "color"'),
    
    handleValidationErrors
  ];
};

// ==================== BODY VALIDATORS ====================

// Variant type validation
export const variantTypeValidation = () => {
  return body('type')
    .trim()
    .notEmpty()
    .withMessage('Variant type is required')
    .isIn(['size', 'color'])
    .withMessage('Variant type must be either "size" or "color"');
};

// Variant value validation
export const variantValueValidation = () => {
  return body('value')
    .trim()
    .notEmpty()
    .withMessage('Variant value is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Variant value must be between 1 to 50 characters')
    .matches(/^[\u0600-\u06FF\sa-zA-Z0-9\-_.,# ]+$/)
    .withMessage('Variant value contains invalid characters');
};

// ==================== VARIANT VALIDATORS ====================

// 1. Get All Variants Validator
export const validateGetAllVariants = [
  validateVariantQuery(),
  handleValidationErrors
];

// 2. Get Single Variant Validator
export const validateGetSingleVariant = [
  validateVariantId(),
  validateVariantQuery(),
  handleValidationErrors
];

// 3. Create Variant Validator
export const validateCreateVariant = [
  variantTypeValidation(),
  variantValueValidation(),
  handleValidationErrors
];

// 4. Update Variant Validator
export const validateUpdateVariant = [
  validateVariantId(),
  variantTypeValidation(),
  variantValueValidation(),
  handleValidationErrors
];

// 5. Delete Variant Validator
export const validateDeleteVariant = [
  validateVariantId(),
  handleValidationErrors
];

// ==================== VARIANT EXISTENCE VALIDATOR ====================

// Check if variant exists before operations
export const validateVariantExists = async (req, res, next) => {
  const { id } = req.params;
  const variant = await Variant.findById(id);
  
  if (!variant) {
    return next(new HandleERROR('Variant not found', 404));
  }
  
  req.variant = variant;
  next();
};

// ==================== UNIQUENESS VALIDATOR ====================

// Check if variant value is unique (for create and update)
export const validateVariantValueUnique = () => {
  return body('value')
    .custom(async (value, { req }) => {
      // Check if value exists (case-insensitive)
      const variant = await Variant.findOne({ 
        value: { $regex: new RegExp(`^${value}$`, 'i') }
      });
      
      if (!variant) return true;
      
      // For update: allow if it's the same variant
      if (req.params.id && variant._id.toString() === req.params.id) {
        return true;
      }
      
      throw new Error('Variant value already exists');
    });
};

// ==================== TYPE-VALUE COMBINATION VALIDATOR ====================

// Check if type and value combination is unique
export const validateTypeValueUnique = () => {
  return body('type')
    .custom(async (type, { req }) => {
      const value = req.body.value;
      if (!type || !value) return true;
      
      // Check if combination exists
      const variant = await Variant.findOne({ 
        type: type,
        value: { $regex: new RegExp(`^${value}$`, 'i') }
      });
      
      if (!variant) return true;
      
      // For update: allow if it's the same variant
      if (req.params.id && variant._id.toString() === req.params.id) {
        return true;
      }
      
      throw new Error(`Variant with type "${type}" and value "${value}" already exists`);
    });
};

// ==================== PERMISSION VALIDATORS ====================

// Check if user has permission for variant operations
export const validateVariantPermission = (req, res, next) => {
  const userRole = req.role;
  
  // Admin and superAdmin have full access
  if (userRole === 'admin' || userRole === 'superAdmin') {
    return next();
  }
  
  // Regular users can only view variants
  if (req.method === 'GET') {
    return next();
  }
  
  return next(new HandleERROR('You do not have permission to perform this action', 403));
};

// ==================== PRODUCT-VARIANT RELATIONSHIP VALIDATOR ====================

// Check if variant is used in any product before deletion
export const validateVariantNotInUse = async (req, res, next) => {
  const { id } = req.params;
  const ProductVariant = req.app.get('ProductVariantModel') || (await import('../ProductVariant/productVariantMd.js')).default;
  
  const productVariant = await ProductVariant.findOne({ variantId: id });
  if (productVariant) {
    return next(new HandleERROR('This variant is used in some products and cannot be deleted', 400));
  }
  
  next();
};

// ==================== COMPOSED VALIDATORS ====================

// Composed validators for each route
export const validateVariantCreate = [
  validateVariantValueUnique(),
  validateTypeValueUnique(),
  variantTypeValidation(),
  variantValueValidation(),
  handleValidationErrors
];

export const validateVariantUpdate = [
  validateVariantId(),
  validateVariantValueUnique(),
  validateTypeValueUnique(),
  variantTypeValidation(),
  variantValueValidation(),
  handleValidationErrors
];

export const validateVariantGet = [
  validateVariantId(),
  handleValidationErrors
];

export const validateVariantDelete = [
  validateVariantId(),
  handleValidationErrors
];

// ==================== EXPORT ALL ====================

export default {
  handleValidationErrors,
  validateVariantId,
  validateVariantQuery,
  validateGetAllVariants,
  validateGetSingleVariant,
  validateCreateVariant,
  validateUpdateVariant,
  validateDeleteVariant,
  validateVariantCreate,
  validateVariantUpdate,
  validateVariantGet,
  validateVariantDelete,
  validateVariantExists,
  validateVariantPermission,
  validateVariantNotInUse,
  validateVariantValueUnique,
  validateTypeValueUnique,
  variantTypeValidation,
  variantValueValidation
};