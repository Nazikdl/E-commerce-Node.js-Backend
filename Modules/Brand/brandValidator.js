import { body, param, query, validationResult } from 'express-validator';
import { HandleERROR } from 'vanta-api';
import { handleValidationErrors } from '../../Utils/handleValidationErrors.js';



// ==================== PARAM VALIDATORS ====================

export const validateBrandId = () => {
  return param('id')
    .notEmpty()
    .withMessage('Brand ID is required')
    .isMongoId()
    .withMessage('Invalid brand ID format');
};

// ==================== QUERY VALIDATORS ====================

export const validateBrandQuery = () => {
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
    
    query('isPublished')
      .optional()
      .isBoolean()
      .withMessage('isPublished must be a boolean')
      .toBoolean(),
    
    handleValidationErrors
  ];
};

// ==================== BODY VALIDATORS ====================

// Brand title validation
export const brandTitleValidation = () => {
  return body('title')
    .trim()
    .notEmpty()
    .withMessage('Brand title is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Brand title must be between 2 to 50 characters')
    .matches(/^[\u0600-\u06FF\sa-zA-Z0-9\-_.,& ]+$/)
    .withMessage('Brand title can only contain letters, numbers, spaces, hyphens, underscores, dots, ampersands, and commas');
};

// Brand image validation
export const brandImageValidation = () => {
  return body('image')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Image path cannot exceed 500 characters')
    .matches(/^[a-zA-Z0-9\-_./]+$/)
    .withMessage('Image path contains invalid characters');
};

// Brand isPublished validation
export const brandIsPublishedValidation = () => {
  return body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean (true or false)')
    .toBoolean();
};

// ==================== BRAND VALIDATORS ====================

// 1. Get All Brands Validator
export const validateGetAllBrands = [
  validateBrandQuery(),
  handleValidationErrors
];

// 2. Get Single Brand Validator
export const validateGetSingleBrand = [
  validateBrandId(),
  validateBrandQuery(),
  handleValidationErrors
];

// 3. Create Brand Validator
export const validateCreateBrand = [
  brandTitleValidation(),
  brandImageValidation(),
  brandIsPublishedValidation(),
  handleValidationErrors
];

// 4. Update Brand Validator
export const validateUpdateBrand = [
  validateBrandId(),
  brandTitleValidation(),
  brandImageValidation(),
  brandIsPublishedValidation(),
  handleValidationErrors
];

// 5. Delete Brand Validator
export const validateDeleteBrand = [
  validateBrandId(),
  handleValidationErrors
];

// ==================== FILE UPLOAD VALIDATORS ====================

// Validate image file for brand
export const validateBrandImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(req.file.mimetype)) {
    return next(new HandleERROR('Image must be JPEG, PNG, WEBP, or GIF format', 400));
  }

  if (req.file.size > maxSize) {
    return next(new HandleERROR('Image size cannot exceed 5MB', 400));
  }

  next();
};

// ==================== BRAND EXISTENCE VALIDATOR ====================

// Check if brand exists before operations
export const validateBrandExists = async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  
  if (!brand) {
    return next(new HandleERROR('Brand not found', 404));
  }
  
  req.brand = brand;
  next();
};

// ==================== PERMISSION VALIDATORS ====================

// Check if user has permission for brand operations
export const validateBrandPermission = (req, res, next) => {
  const userRole = req.role;
  
  // Admin and superAdmin have full access
  if (userRole === 'admin' || userRole === 'superAdmin') {
    return next();
  }
  
  // Regular users can only view brands
  if (req.method === 'GET') {
    return next();
  }
  
  return next(new HandleERROR('You do not have permission to perform this action', 403));
};

// ==================== BRAND-RELATED PRODUCT CHECK ====================

// Check if brand has products before deletion
export const validateBrandHasNoProducts = async (req, res, next) => {
  const { id } = req.params;
  const Product = req.app.get('ProductModel') || (await import('../Product/ProductMd.js')).default;
  
  const productExists = await Product.findOne({ brandId: id });
  if (productExists) {
    return next(new HandleERROR('This brand is used in some products and cannot be deleted', 400));
  }
  
  next();
};

// ==================== TITLE UNIQUENESS VALIDATOR ====================

// Check if brand title is unique (for create and update)
export const validateBrandTitleUnique = () => {
  return body('title')
    .custom(async (value, { req }) => {
      const Brand = req.app.get('BrandModel') || (await import('./brandMd.js')).default;
      
      // Check if title exists
      const brand = await Brand.findOne({ 
        title: { $regex: new RegExp(`^${value}$`, 'i') }
      });
      
      if (!brand) return true;
      
      // For update: allow if it's the same brand
      if (req.params.id && brand._id.toString() === req.params.id) {
        return true;
      }
      
      throw new Error('Brand title already taken');
    });
};

// ==================== COMPOSED VALIDATORS ====================

// Composed validators for each route
export const validateBrandCreate = [
  validateBrandTitleUnique(),
  brandTitleValidation(),
  brandImageValidation(),
  brandIsPublishedValidation(),
  handleValidationErrors
];

export const validateBrandUpdate = [
  validateBrandId(),
  validateBrandTitleUnique(),
  brandTitleValidation(),
  brandImageValidation(),
  brandIsPublishedValidation(),
  handleValidationErrors
];

export const validateBrandGet = [
  validateBrandId(),
  handleValidationErrors
];

export const validateBrandDelete = [
  validateBrandId(),
  handleValidationErrors
];

// ==================== EXPORT ALL ====================

export default {
  handleValidationErrors,
  validateBrandId,
  validateBrandQuery,
  validateGetAllBrands,
  validateGetSingleBrand,
  validateCreateBrand,
  validateUpdateBrand,
  validateDeleteBrand,
  validateBrandCreate,
  validateBrandUpdate,
  validateBrandGet,
  validateBrandDelete,
  validateBrandImage,
  validateBrandExists,
  validateBrandPermission,
  validateBrandHasNoProducts,
  validateBrandTitleUnique,
  brandTitleValidation,
  brandImageValidation,
  brandIsPublishedValidation
};