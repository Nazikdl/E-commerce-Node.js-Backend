import { body, param, query, validationResult } from 'express-validator';
import { HandleERROR } from 'vanta-api';
import ProductVariant from './productVariantMd.js';
import Product from '../Product/ProductMd.js';
import Variant from '../Variant/variantMd.js';
import mongoose from 'mongoose';
import { handleValidationErrors } from '../../Utils/handleValidationErrors.js';


// ==================== PARAM VALIDATORS ====================

export const validateProductVariantId = () => {
  return param('id')
    .notEmpty()
    .withMessage('Product variant ID is required')
    .isMongoId()
    .withMessage('Invalid product variant ID format');
};

// ==================== QUERY VALIDATORS ====================

export const validateProductVariantQuery = () => {
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
    
    query('populate')
      .optional()
      .isString()
      .withMessage('Populate parameter must be a string')
      .trim(),
    
    query('productId')
      .optional()
      .isMongoId()
      .withMessage('Invalid product ID format'),
    
    query('variantId')
      .optional()
      .isMongoId()
      .withMessage('Invalid variant ID format'),
    
    query('minPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('minPrice must be a positive number')
      .toFloat(),
    
    query('maxPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('maxPrice must be a positive number')
      .toFloat(),
    
    query('inStock')
      .optional()
      .custom(value => {
        if (value === 'true' || value === 'false') {
          return true;
        }
        throw new Error('inStock must be true or false');
      }),
    
    handleValidationErrors
  ];
};

// ==================== BODY VALIDATORS ====================

// Variant ID validation
export const variantIdValidation = () => {
  return body('variantId')
    .trim()
    .notEmpty()
    .withMessage('Variant ID is required')
    .isMongoId()
    .withMessage('Invalid variant ID format')
    .custom(async (value) => {
      const variant = await Variant.findById(value);
      if (!variant) {
        throw new Error('Variant not found');
      }
      return true;
    });
};

// Product ID validation
export const productIdValidation = () => {
  return body('productId')
    .trim()
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID format')
    .custom(async (value) => {
      const product = await Product.findById(value);
      if (!product) {
        throw new Error('Product not found');
      }
      return true;
    });
};

// Price validation
export const priceValidation = () => {
  return body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number')
    .toFloat();
};

// Quantity validation
export const quantityValidation = () => {
  return body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer')
    .toInt();
};

// Discount percent validation
export const discountPercentValidation = () => {
  return body('discountPercent')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount percent must be between 0 and 100')
    .toFloat();
};

// Bought count validation (readonly - not for update)
export const boughtCountValidation = () => {
  return body('boughtCount')
    .optional()
    .custom((value, { req }) => {
      if (req.method === 'PATCH' && value !== undefined) {
        throw new Error('boughtCount cannot be updated directly');
      }
      return true;
    });
};

// Final price validation (readonly - auto-calculated)
export const finalPriceValidation = () => {
  return body('finalPrice')
    .optional()
    .custom((value, { req }) => {
      if (req.method === 'PATCH' && value !== undefined) {
        throw new Error('finalPrice is auto-calculated and cannot be updated directly');
      }
      return true;
    });
};

// ==================== UNIQUE VARIANT VALIDATOR ====================

// Check if product-variant combination is unique
export const validateUniqueProductVariant = () => {
  return body('variantId')
    .custom(async (value, { req }) => {
      const productId = req.body.productId;
      if (!productId || !value) return true;
      
      // Check if combination exists
      const existing = await ProductVariant.findOne({
        productId: productId,
        variantId: value
      });
      
      if (!existing) return true;
      
      // For update: allow if it's the same product variant
      if (req.params.id && existing._id.toString() === req.params.id) {
        return true;
      }
      
      throw new Error('This variant is already assigned to this product');
    });
};

// ==================== VARIANT QUANTITY VALIDATOR ====================

// Check if variant exists and quantity is valid
export const validateVariantQuantity = () => {
  return body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer')
    .toInt()
    .custom((value, { req }) => {
      // If price exists, quantity can be checked
      return true;
    });
};

// ==================== PRODUCT VARIANT VALIDATORS ====================

// 1. Get All Product Variants Validator
export const validateGetAllProductVariants = [
  validateProductVariantQuery(),
  handleValidationErrors
];

// 2. Get Single Product Variant Validator
export const validateGetSingleProductVariant = [
  validateProductVariantId(),
  validateProductVariantQuery(),
  handleValidationErrors
];

// 3. Create Product Variant Validator
export const validateCreateProductVariant = [
  variantIdValidation(),
  productIdValidation(),
  priceValidation(),
  quantityValidation(),
  discountPercentValidation(),
  validateUniqueProductVariant(),
  boughtCountValidation(),
  finalPriceValidation(),
  handleValidationErrors
];

// 4. Update Product Variant Validator
export const validateUpdateProductVariant = [
  validateProductVariantId(),
  variantIdValidation(),
  productIdValidation(),
  priceValidation(),
  quantityValidation(),
  discountPercentValidation(),
  validateUniqueProductVariant(),
  boughtCountValidation(),
  finalPriceValidation(),
  handleValidationErrors
];

// 5. Delete Product Variant Validator
export const validateDeleteProductVariant = [
  validateProductVariantId(),
  handleValidationErrors
];

// ==================== EXISTENCE VALIDATOR ====================

export const validateProductVariantExists = async (req, res, next) => {
  const { id } = req.params;
  const productVariant = await ProductVariant.findById(id);
  
  if (!productVariant) {
    return next(new HandleERROR('Product variant not found', 404));
  }
  
  req.productVariant = productVariant;
  next();
};

// ==================== PERMISSION VALIDATORS ====================

export const validateProductVariantPermission = (req, res, next) => {
  const userRole = req.role;
  
  if (userRole === 'admin' || userRole === 'superAdmin') {
    return next();
  }
  
  if (req.method === 'GET') {
    return next();
  }
  
  return next(new HandleERROR('You do not have permission to perform this action', 403));
};

// ==================== DELETE VALIDATOR ====================

export const validateCanDelete = async (req, res, next) => {
  const { id } = req.params;
  const productVariant = await ProductVariant.findById(id);
  
  if (!productVariant) {
    return next(new HandleERROR('Product variant not found', 404));
  }
  
  if (productVariant.boughtCount > 0) {
    return next(new HandleERROR('Cannot delete product variant that has been bought', 400));
  }
  
  next();
};

// ==================== PRICE RANGE VALIDATOR ====================

export const validatePriceWithDiscount = () => {
  return body('discountPercent')
    .optional()
    .custom((value, { req }) => {
      if (value !== undefined && req.body.price !== undefined) {
        const finalPrice = req.body.price * (1 - value / 100);
        if (finalPrice < 0) {
          throw new Error('Discount cannot result in negative price');
        }
      }
      return true;
    });
};

// ==================== COMPOSED VALIDATORS ====================

export const validateProductVariantCreate = [
  variantIdValidation(),
  productIdValidation(),
  priceValidation(),
  quantityValidation(),
  discountPercentValidation(),
  validateUniqueProductVariant(),
  validatePriceWithDiscount(),
  boughtCountValidation(),
  finalPriceValidation(),
  handleValidationErrors
];

export const validateProductVariantUpdate = [
  validateProductVariantId(),
  variantIdValidation(),
  productIdValidation(),
  priceValidation(),
  quantityValidation(),
  discountPercentValidation(),
  validateUniqueProductVariant(),
  validatePriceWithDiscount(),
  boughtCountValidation(),
  finalPriceValidation(),
  handleValidationErrors
];

export const validateProductVariantGet = [
  validateProductVariantId(),
  handleValidationErrors
];

export const validateProductVariantDelete = [
  validateProductVariantId(),
  handleValidationErrors
];

// ==================== EXPORT ALL ====================

export default {
  handleValidationErrors,
  validateProductVariantId,
  validateProductVariantQuery,
  validateGetAllProductVariants,
  validateGetSingleProductVariant,
  validateCreateProductVariant,
  validateUpdateProductVariant,
  validateDeleteProductVariant,
  validateProductVariantCreate,
  validateProductVariantUpdate,
  validateProductVariantGet,
  validateProductVariantDelete,
  validateProductVariantExists,
  validateProductVariantPermission,
  validateCanDelete,
  validateUniqueProductVariant,
  validatePriceWithDiscount,
  validateVariantQuantity,
  variantIdValidation,
  productIdValidation,
  priceValidation,
  quantityValidation,
  discountPercentValidation,
  boughtCountValidation,
  finalPriceValidation
};