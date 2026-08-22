import { body, param, query, validationResult } from 'express-validator';
import { HandleERROR } from 'vanta-api';
import Comment from './commentMd.js';
import Product from '../Product/ProductMd.js';
import mongoose from 'mongoose';
import { handleValidationErrors } from '../../Utils/handleValidationErrors.js';


// ==================== PARAM VALIDATORS ====================

export const validateCommentId = () => {
  return param('id')
    .notEmpty()
    .withMessage('Comment ID is required')
    .isMongoId()
    .withMessage('Invalid comment ID format');
};

export const validateCommentIdParam = () => {
  return param('commentId')
    .notEmpty()
    .withMessage('Comment ID is required')
    .isMongoId()
    .withMessage('Invalid comment ID format');
};

export const validateProductIdParam = () => {
  return param('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID format');
};

// ==================== QUERY VALIDATORS ====================

export const validateCommentQuery = () => {
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
    
    query('isPublished')
      .optional()
      .isBoolean()
      .withMessage('isPublished must be a boolean')
      .toBoolean(),
    
    query('isReply')
      .optional()
      .isBoolean()
      .withMessage('isReply must be a boolean')
      .toBoolean(),
    
    query('isBought')
      .optional()
      .isBoolean()
      .withMessage('isBought must be a boolean')
      .toBoolean(),
    
    query('rate')
      .optional()
      .isInt({ min: 0, max: 5 })
      .withMessage('Rate must be between 0 and 5')
      .toInt(),
    
    query('role')
      .optional()
      .isIn(['user', 'admin'])
      .withMessage('Role must be "user" or "admin"'),
    
    handleValidationErrors
  ];
};

// ==================== BODY VALIDATORS ====================

// Content validation
export const contentValidation = () => {
  return body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 3, max: 1000 })
    .withMessage('Content must be between 3 to 1000 characters')
    .matches(/^[\u0600-\u06FF\sa-zA-Z0-9\-_.,!?() ]+$/)
    .withMessage('Content contains invalid characters');
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

// Rate validation
export const rateValidation = () => {
  return body('rate')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rate must be between 0 and 5')
    .toFloat();
};

// Role validation (for admin replies)
export const roleValidation = () => {
  return body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be "user" or "admin"');
};

// IsPublished validation
export const isPublishedValidation = () => {
  return body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean')
    .toBoolean();
};

// IsReply validation
export const isReplyValidation = () => {
  return body('isReply')
    .optional()
    .isBoolean()
    .withMessage('isReply must be a boolean')
    .toBoolean();
};

// IsBought validation
export const isBoughtValidation = () => {
  return body('isBought')
    .optional()
    .isBoolean()
    .withMessage('isBought must be a boolean')
    .toBoolean();
};

// ==================== COMMENT VALIDATORS ====================

// 1. Get All Comments Validator (Admin only)
export const validateGetAllComments = [
  validateCommentQuery(),
  handleValidationErrors
];

// 2. Get All Comments of Product Validator
export const validateGetAllCommentsOfProduct = [
  validateProductIdParam(),
  validateCommentQuery(),
  handleValidationErrors
];

// 3. Create Comment Validator
export const validateCreateComment = [
  productIdValidation(),
  contentValidation(),
  rateValidation(),
  roleValidation(),
  isPublishedValidation(),
  isReplyValidation(),
  isBoughtValidation(),
  handleValidationErrors
];

// 4. Remove Comment Validator
export const validateRemoveComment = [
  validateCommentId(),
  handleValidationErrors
];

// 5. Change Published Status Validator
export const validateChangePublished = [
  validateCommentId(),
  handleValidationErrors
];

// 6. Reply to Comment Validator
export const validateReply = [
  validateCommentIdParam(),
  contentValidation(),
  roleValidation(),
  handleValidationErrors
];

// ==================== COMMENT EXISTENCE VALIDATOR ====================

export const validateCommentExists = async (req, res, next) => {
  const { id, commentId } = req.params;
  const commentIdToCheck = id || commentId;
  
  const comment = await Comment.findById(commentIdToCheck);
  if (!comment) {
    return next(new HandleERROR('Comment not found', 404));
  }
  
  req.comment = comment;
  next();
};

// ==================== PERMISSION VALIDATORS ====================

export const validateCommentPermission = (req, res, next) => {
  const userRole = req.role;
  const userId = req.userId;
  
  // Admin and superAdmin have full access
  if (userRole === 'admin' || userRole === 'superAdmin') {
    return next();
  }
  
  // Regular users can only view published comments
  if (req.method === 'GET') {
    return next();
  }
  
  return next(new HandleERROR('You do not have permission to perform this action', 403));
};

// ==================== RATE PERMISSION VALIDATOR ====================

export const validateRatePermission = () => {
  return body('rate')
    .optional()
    .custom(async (value, { req }) => {
      if (!value) return true;
      
      const { userId } = req;
      const { productId } = req.body;
      
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      // Check if user bought the product
      const isBought = user.boughtProductIds?.some(
        item => item.toString() === productId.toString()
      );
      
      if (!isBought) {
        throw new Error('You can only rate products you have purchased');
      }
      
      // Check if user already rated this product
      const alreadyRated = user.ratedProductIds?.some(
        item => item.toString() === productId.toString()
      );
      
      if (alreadyRated) {
        throw new Error('You have already rated this product');
      }
      
      return true;
    });
};

// ==================== REPLY VALIDATOR ====================

export const validateReplyPermission = async (req, res, next) => {
  const { commentId } = req.params;
  const { userId } = req;
  
  const comment = await Comment.findById(commentId);
  if (!comment) {
    return next(new HandleERROR('Comment not found', 404));
  }
  
  // Only admin can reply to comments (for now)
  if (req.role !== 'admin' && req.role !== 'superAdmin') {
    return next(new HandleERROR('Only admins can reply to comments', 403));
  }
  
  req.comment = comment;
  next();
};

// ==================== DELETE VALIDATOR ====================

export const validateCanDelete = async (req, res, next) => {
  const { id } = req.params;
  const comment = await Comment.findById(id);
  
  if (!comment) {
    return next(new HandleERROR('Comment not found', 404));
  }
  
  // If comment has replies, delete them too (handled in controller)
  next();
};

// ==================== COMPOSED VALIDATORS ====================

export const validateCommentCreate = [
  productIdValidation(),
  contentValidation(),
  rateValidation(),
  validateRatePermission(),
  roleValidation(),
  isPublishedValidation(),
  isReplyValidation(),
  isBoughtValidation(),
  handleValidationErrors
];

export const validateCommentUpdate = [
  validateCommentId(),
  contentValidation(),
  rateValidation(),
  roleValidation(),
  isPublishedValidation(),
  handleValidationErrors
];

export const validateCommentGet = [
  validateCommentId(),
  handleValidationErrors
];

export const validateCommentDelete = [
  validateCommentId(),
  handleValidationErrors
];

export const validateCommentReply = [
  validateCommentIdParam(),
  contentValidation(),
  roleValidation(),
  handleValidationErrors
];

// ==================== EXPORT ALL ====================

export default {
  handleValidationErrors,
  validateCommentId,
  validateCommentIdParam,
  validateProductIdParam,
  validateCommentQuery,
  validateGetAllComments,
  validateGetAllCommentsOfProduct,
  validateCreateComment,
  validateRemoveComment,
  validateChangePublished,
  validateReply,
  validateCommentCreate,
  validateCommentUpdate,
  validateCommentGet,
  validateCommentDelete,
  validateCommentReply,
  validateCommentExists,
  validateCommentPermission,
  validateRatePermission,
  validateReplyPermission,
  validateCanDelete,
  contentValidation,
  productIdValidation,
  rateValidation,
  roleValidation,
  isPublishedValidation,
  isReplyValidation,
  isBoughtValidation
};