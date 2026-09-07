import { query, validationResult } from 'express-validator';
import { HandleERROR } from 'vanta-api';
import { handleValidationErrors } from '../../Utils/handleValidationErrors.js';



// ==================== QUERY VALIDATORS ====================

export const validateSearchQuery = () => {
  return [
    query('q')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage('Search query cannot be empty')
      .isLength({ max: 100 })
      .withMessage('Search query cannot exceed 100 characters')
      .matches(/^[\u0600-\u06FF\sa-zA-Z0-9\-_ ]+$/)
      .withMessage('Search query contains invalid characters'),
    
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer')
      .toInt(),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50')
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
    
    query('populate')
      .optional()
      .isString()
      .withMessage('Populate parameter must be a string')
      .trim(),
    
    query('minPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('minPrice must be a positive number')
      .toFloat(),
    
    query('maxPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('maxPrice must be a positive number')
      .toFloat()
      .custom((value, { req }) => {
        if (req.query.minPrice && value < parseFloat(req.query.minPrice)) {
          throw new Error('maxPrice must be greater than or equal to minPrice');
        }
        return true;
      }),
    
    query('brandId')
      .optional()
      .isMongoId()
      .withMessage('Invalid brand ID format'),
    
    query('categoryId')
      .optional()
      .isMongoId()
      .withMessage('Invalid category ID format'),
    
    query('InStock')
      .optional()
      .isBoolean()
      .withMessage('InStock must be a boolean')
      .toBoolean(),
    
    handleValidationErrors
  ];
};

// ==================== SEARCH TYPE VALIDATORS ====================

export const validateSearchType = () => {
  return query('type')
    .optional()
    .isIn(['all', 'products', 'categories', 'brands'])
    .withMessage('Type must be "all", "products", "categories", or "brands"');
};

// ==================== SEARCH VALIDATORS ====================

// 1. Search All Validator
export const validateSearch = [
  validateSearchQuery(),
  validateSearchType(),
  handleValidationErrors
];

// 2. Search Products Only Validator
export const validateSearchProducts = [
  validateSearchQuery(),
  query('type').optional().isIn(['products']),
  handleValidationErrors
];

// 3. Search Categories Only Validator
export const validateSearchCategories = [
  validateSearchQuery(),
  query('type').optional().isIn(['categories']),
  handleValidationErrors
];

// 4. Search Brands Only Validator
export const validateSearchBrands = [
  validateSearchQuery(),
  query('type').optional().isIn(['brands']),
  handleValidationErrors
];

// ==================== COMPOSED VALIDATORS ====================

export const validateSearchAll = [
  validateSearchQuery(),
  validateSearchType(),
  handleValidationErrors
];

// ==================== EXPORT ALL ====================

export default {
  handleValidationErrors,
  validateSearchQuery,
  validateSearchType,
  validateSearch,
  validateSearchAll,
  validateSearchProducts,
  validateSearchCategories,
  validateSearchBrands
};