import { body, param, query, validationResult } from 'express-validator';
import { HandleERROR } from 'vanta-api';
import Cart from './cartMd.js';
import ProductVariant from '../ProductVariant/productVariantMd.js';
import Product from '../Product/ProductMd.js';
import mongoose from 'mongoose';
import { handleValidationErrors } from '../../Utils/handleValidationErrors.js';


// ==================== PARAM VALIDATORS ====================

export const validateCartId = () => {
  return param('id')
    .optional()
    .isMongoId()
    .withMessage('Invalid cart ID format');
};

// ==================== QUERY VALIDATORS ====================

export const validateCartQuery = () => {
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
    
    handleValidationErrors
  ];
};

// ==================== BODY VALIDATORS ====================

// Product Variant ID validation
export const productVariantIdValidation = () => {
  return body('productVariantId')
    .trim()
    .notEmpty()
    .withMessage('Product variant ID is required')
    .isMongoId()
    .withMessage('Invalid product variant ID format')
    .custom(async (value) => {
      const productVariant = await ProductVariant.findById(value)
        .populate('productId')
        .populate('variantId');
      
      if (!productVariant) {
        throw new Error('Product variant not found');
      }
      
      if (productVariant.quantity <= 0) {
        throw new Error('This product variant is out of stock');
      }
      
      req.productVariant = productVariant;
      return true;
    });
};

// Total Remove validation
export const totalRemoveValidation = () => {
  return body('totalRemove')
    .optional()
    .isBoolean()
    .withMessage('totalRemove must be a boolean')
    .toBoolean();
};

// Product Variant ID for remove validation
export const productVariantIdRemoveValidation = () => {
  return body('productVariantId')
    .trim()
    .notEmpty()
    .withMessage('Product variant ID is required')
    .isMongoId()
    .withMessage('Invalid product variant ID format')
    .custom(async (value, { req }) => {
      const cart = await Cart.findOne({ userId: req.userId });
      if (!cart) {
        throw new Error('Cart not found');
      }
      
      const itemExists = cart.items.some(
        item => item.productVariantId.toString() === value.toString()
      );
      
      if (!itemExists) {
        throw new Error('Product variant not found in cart');
      }
      
      return true;
    });
};

// ==================== CART VALIDATORS ====================

// 1. Get Cart Validator
export const validateGetCart = [
  validateCartQuery(),
  handleValidationErrors
];

// 2. Add Item to Cart Validator
export const validateAddItem = [
  productVariantIdValidation(),
  handleValidationErrors
];

// 3. Remove Item from Cart Validator
export const validateRemoveItem = [
  productVariantIdRemoveValidation(),
  totalRemoveValidation(),
  handleValidationErrors
];

// 4. Clear Cart Validator
export const validateClearCart = [
  handleValidationErrors
];

// ==================== CART EXISTENCE VALIDATOR ====================

export const validateCartExists = async (req, res, next) => {
  const { userId } = req;
  const cart = await Cart.findOne({ userId });
  
  if (!cart) {
    return next(new HandleERROR('Cart not found', 404));
  }
  
  req.cart = cart;
  next();
};

// ==================== CART ITEM VALIDATOR ====================

export const validateCartItem = async (req, res, next) => {
  const { userId } = req;
  const { productVariantId } = req.body;
  
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return next(new HandleERROR('Cart not found', 404));
  }
  
  const item = cart.items.find(
    item => item.productVariantId.toString() === productVariantId.toString()
  );
  
  if (!item) {
    return next(new HandleERROR('Item not found in cart', 404));
  }
  
  req.cartItem = item;
  next();
};

// ==================== QUANTITY VALIDATOR ====================

export const validateQuantity = () => {
  return body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1')
    .toInt()
    .custom(async (value, { req }) => {
      const { productVariantId } = req.body;
      const productVariant = await ProductVariant.findById(productVariantId);
      
      if (!productVariant) {
        throw new Error('Product variant not found');
      }
      
      if (value > productVariant.quantity) {
        throw new Error(`Only ${productVariant.quantity} items available in stock`);
      }
      
      return true;
    });
};

// ==================== PERMISSION VALIDATOR ====================

export const validateCartPermission = (req, res, next) => {
  const userRole = req.role;
  
  // Admin and superAdmin can view any cart
  if (userRole === 'admin' || userRole === 'superAdmin') {
    return next();
  }
  
  // Regular users can only access their own cart
  if (req.method === 'GET' || req.method === 'POST' || req.method === 'PATCH' || req.method === 'DELETE') {
    // User ID is already set by isLogin middleware
    return next();
  }
  
  return next(new HandleERROR('You do not have permission to perform this action', 403));
};

// ==================== COMPOSED VALIDATORS ====================

export const validateCartGet = [
  validateCartQuery(),
  handleValidationErrors
];

export const validateCartAdd = [
  productVariantIdValidation(),
  handleValidationErrors
];

export const validateCartRemove = [
  productVariantIdRemoveValidation(),
  totalRemoveValidation(),
  handleValidationErrors
];

export const validateCartClear = [
  handleValidationErrors
];

// ==================== EXPORT ALL ====================

export default {
  handleValidationErrors,
  validateCartId,
  validateCartQuery,
  validateGetCart,
  validateAddItem,
  validateRemoveItem,
  validateClearCart,
  validateCartGet,
  validateCartAdd,
  validateCartRemove,
  validateCartClear,
  validateCartExists,
  validateCartItem,
  validateCartPermission,
  validateQuantity,
  productVariantIdValidation,
  productVariantIdRemoveValidation,
  totalRemoveValidation
};