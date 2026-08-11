import { body, param, query, validationResult } from 'express-validator';
import { HandleERROR } from 'vanta-api';
import Category from './categoryMd.js';
import { handleValidationErrors } from '../../Utils/handleValidationErrors.js';



// ==================== PARAM VALIDATORS ====================

export const validateCategoryId = () => {
  return param('id')
    .notEmpty()
    .withMessage('Category ID is required')
    .isMongoId()
    .withMessage('Invalid category ID format');
};

// ==================== QUERY VALIDATORS ====================

export const validateCategoryQuery = () => {
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
    
    query('supCategoryId')
  .optional({ nullable: true })
  .isMongoId()
  .withMessage('Invalid super category ID format'),
    
    handleValidationErrors
  ];
};

// ==================== BODY VALIDATORS ====================

// Category title validation
export const categoryTitleValidation = () => {
  return body('title')
    .trim()
    .notEmpty()
    .withMessage('Category title is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Category title must be between 2 to 50 characters')
    .matches(/^[\u0600-\u06FF\sa-zA-Z0-9\-_.,&/ ]+$/)
    .withMessage('Category title can only contain letters, numbers, spaces, hyphens, underscores, dots, ampersands, commas, and slashes');
};

// Category image validation
export const categoryImageValidation = () => {
  return body('image')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Image path cannot exceed 500 characters')
    .matches(/^[a-zA-Z0-9\-_./]+$/)
    .withMessage('Image path contains invalid characters');
};

// Category isPublished validation
export const categoryIsPublishedValidation = () => {
  return body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean (true or false)')
    .toBoolean();
};

// Super category validation
export const categorySupCategoryValidation = () => {
  return body('supCategoryId')
    .optional({ nullable: true })  
    .custom(async (value) => {
      if (!value) return true;
      
      
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid super category ID format');
      }
      
      const category = await Category.findById(value);
      if (!category) {
        throw new Error('Super category not found');
      }
      
      // Check if it's a subcategory itself (prevent deep nesting)
      if (category.supCategoryId) {
        throw new Error('Super category cannot be a subcategory itself');
      }
      
      return true;
    });
}
// ==================== CATEGORY VALIDATORS ====================

// 1. Get All Categories Validator
export const validateGetAllCategories = [
  validateCategoryQuery(),
  handleValidationErrors
];

// 2. Get Single Category Validator
export const validateGetSingleCategory = [
  validateCategoryId(),
  validateCategoryQuery(),
  handleValidationErrors
];

// 3. Create Category Validator
export const validateCreateCategory = [
  categoryTitleValidation(),
  categoryImageValidation(),
  categoryIsPublishedValidation(),
  categorySupCategoryValidation(),
  handleValidationErrors
];

// 4. Update Category Validator
export const validateUpdateCategory = [
  validateCategoryId(),
  categoryTitleValidation(),
  categoryImageValidation(),
  categoryIsPublishedValidation(),
  categorySupCategoryValidation(),
  handleValidationErrors
];

// 5. Delete Category Validator
export const validateDeleteCategory = [
  validateCategoryId(),
  handleValidationErrors
];

// ==================== FILE UPLOAD VALIDATORS ====================

// Validate image file for category
export const validateCategoryImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(req.file.mimetype)) {
    return next(new HandleERROR('Image must be JPEG, PNG, WEBP, GIF, or SVG format', 400));
  }

  if (req.file.size > maxSize) {
    return next(new HandleERROR('Image size cannot exceed 5MB', 400));
  }

  next();
};

// ==================== CATEGORY EXISTENCE VALIDATOR ====================

// Check if category exists before operations
export const validateCategoryExists = async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  
  if (!category) {
    return next(new HandleERROR('Category not found', 404));
  }
  
  req.category = category;
  next();
};

// ==================== PERMISSION VALIDATORS ====================

// Check if user has permission for category operations
export const validateCategoryPermission = (req, res, next) => {
  const userRole = req.role;
  
  // Admin and superAdmin have full access
  if (userRole === 'admin' || userRole === 'superAdmin') {
    return next();
  }
  
  // Regular users can only view categories
  if (req.method === 'GET') {
    return next();
  }
  
  return next(new HandleERROR('You do not have permission to perform this action', 403));
};

// ==================== CATEGORY RELATIONSHIP VALIDATORS ====================

// Check if category has products or subcategories before deletion
export const validateCategoryCanBeDeleted = async (req, res, next) => {
  const { id } = req.params;
  const Product = req.app.get('ProductModel') || (await import('../Product/ProductMd.js')).default;
  
  // Check if category is used in any product
  const productExists = await Product.findOne({ categoryIds: id });
  if (productExists) {
    return next(new HandleERROR('This category is used in some products and cannot be deleted', 400));
  }
  
  // Check if category has subcategories
  const hasSubcategories = await Category.findOne({ supCategoryId: id });
  if (hasSubcategories) {
    return next(new HandleERROR('This category is a parent of some categories and cannot be deleted', 400));
  }
  
  next();
};

// ==================== TITLE UNIQUENESS VALIDATOR ====================

// Check if category title is unique (for create and update)
export const validateCategoryTitleUnique = () => {
  return body('title')
    .custom(async (value, { req }) => {
      // Check if title exists (case-insensitive)
      const category = await Category.findOne({ 
        title: { $regex: new RegExp(`^${value}$`, 'i') }
      });
      
      if (!category) return true;
      
      // For update: allow if it's the same category
      if (req.params.id && category._id.toString() === req.params.id) {
        return true;
      }
      
      throw new Error('Category title already taken');
    });
};

// ==================== SELF-REFERENCE VALIDATOR ====================

// Prevent category from being its own parent (circular reference)
export const validateNoSelfReference = () => {
  return body('supCategoryId')
    .custom((value, { req }) => {
      if (!value || !req.params.id) return true;
      
      if (value === req.params.id) {
        throw new Error('Category cannot be its own parent');
      }
      
      return true;
    });
};

// ==================== NESTING DEPTH VALIDATOR ====================

// Check if adding subcategory would exceed max depth
export const validateNestingDepth = () => {
  return body('supCategoryId')
    .custom(async (value) => {
      if (!value) return true;
      
      let depth = 0;
      let currentId = value;
      const maxDepth = 3; // Maximum nesting level
      
      while (currentId) {
        depth++;
        if (depth > maxDepth) {
          throw new Error(`Category nesting depth cannot exceed ${maxDepth} levels`);
        }
        
        const category = await Category.findById(currentId);
        if (!category) break;
        currentId = category.supCategoryId;
      }
      
      return true;
    });
};

// ==================== COMPOSED VALIDATORS ====================

// Composed validators for each route
export const validateCategoryCreate = [
  validateCategoryTitleUnique(),
  categoryTitleValidation(),
  categoryImageValidation(),
  categoryIsPublishedValidation(),
  categorySupCategoryValidation(),
  validateNestingDepth(),
  handleValidationErrors
];

export const validateCategoryUpdate = [
  validateCategoryId(),
  validateCategoryTitleUnique(),
  categoryTitleValidation(),
  categoryImageValidation(),
  categoryIsPublishedValidation(),
  categorySupCategoryValidation(),
  validateNoSelfReference(),
  validateNestingDepth(),
  handleValidationErrors
];

export const validateCategoryGet = [
  validateCategoryId(),
  handleValidationErrors
];

export const validateCategoryDelete = [
  validateCategoryId(),
  handleValidationErrors
];

// ==================== EXPORT ALL ====================

export default {
  handleValidationErrors,
  validateCategoryId,
  validateCategoryQuery,
  validateGetAllCategories,
  validateGetSingleCategory,
  validateCreateCategory,
  validateUpdateCategory,
  validateDeleteCategory,
  validateCategoryCreate,
  validateCategoryUpdate,
  validateCategoryGet,
  validateCategoryDelete,
  validateCategoryImage,
  validateCategoryExists,
  validateCategoryPermission,
  validateCategoryCanBeDeleted,
  validateCategoryTitleUnique,
  validateNoSelfReference,
  validateNestingDepth,
  categoryTitleValidation,
  categoryImageValidation,
  categoryIsPublishedValidation,
  categorySupCategoryValidation
};