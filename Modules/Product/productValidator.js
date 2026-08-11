import { body, param, query, validationResult } from 'express-validator';
import { HandleERROR } from 'vanta-api';
import Product from './ProductMd.js';
import mongoose from 'mongoose';
import { handleValidationErrors } from '../../Utils/handleValidationErrors.js';


// ==================== PARAM VALIDATORS ====================

export const validateProductId = () => {
  return param('id')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID format');
};

// ==================== QUERY VALIDATORS ====================

export const validateProductQuery = () => {
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

// ==================== BODY VALIDATORS ====================

// Title validation
export const productTitleValidation = () => {
  return body('title')
    .trim()
    .notEmpty()
    .withMessage('Product title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Product title must be between 3 to 200 characters')
    .matches(/^[\u0600-\u06FF\sa-zA-Z0-9\-_.,!?() ]+$/)
    .withMessage('Title contains invalid characters');
};

// Description validation
export const productDescriptionValidation = () => {
  return body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 to 5000 characters');
};

// Brand ID validation
export const productBrandValidation = () => {
  return body('brandId')
    .optional()
    .isMongoId()
    .withMessage('Invalid brand ID format');
};

// Category IDs validation
export const productCategoriesValidation = () => {
  return body('categoryIds')
    .optional()
    .isArray()
    .withMessage('categoryIds must be an array')
    .custom((value) => {
      if (!value) return true;
      for (let id of value) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error('Invalid category ID format');
        }
      }
      return true;
    });
};

// Images validation
export const productImagesValidation = () => {
  return body('images')
    .optional()
    .isArray()
    .withMessage('images must be an array')
    .custom((value) => {
      if (!value) return true;
      for (let img of value) {
        if (typeof img !== 'string' || img.length > 500) {
          throw new Error('Invalid image path');
        }
      }
      return true;
    });
};

// Videos validation
export const productVideosValidation = () => {
  return body('videos')
    .optional()
    .isArray()
    .withMessage('videos must be an array')
    .custom((value) => {
      if (!value) return true;
      for (let vid of value) {
        if (typeof vid !== 'string' || vid.length > 500) {
          throw new Error('Invalid video path');
        }
      }
      return true;
    });
};

// Tags validation
export const productTagsValidation = () => {
  return body('tags')
    .optional()
    .isArray()
    .withMessage('tags must be an array')
    .custom((value) => {
      if (!value) return true;
      for (let tag of value) {
        if (typeof tag !== 'string' || tag.length > 50) {
          throw new Error('Invalid tag format');
        }
      }
      return true;
    });
};

// Variant IDs validation
export const productVariantIdsValidation = () => {
  return body('productVariantIds')
    .optional()
    .isArray()
    .withMessage('productVariantIds must be an array')
    .custom((value) => {
      if (!value) return true;
      for (let id of value) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error('Invalid product variant ID format');
        }
      }
      return true;
    });
};

// Min Price validation
export const productMinPriceValidation = () => {
  return body('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('minPrice must be a positive number')
    .toFloat();
};

// Max Price validation
export const productMaxPriceValidation = () => {
  return body('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('maxPrice must be a positive number')
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.minPrice && value < req.body.minPrice) {
        throw new Error('maxPrice must be greater than or equal to minPrice');
      }
      return true;
    });
};

// Max Discount validation
export const productMaxDiscountValidation = () => {
  return body('maxDiscountPercent')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('maxDiscountPercent must be between 0 and 100')
    .toFloat();
};

// InStock validation
export const productInStockValidation = () => {
  return body('InStock')
    .optional()
    .isBoolean()
    .withMessage('InStock must be a boolean')
    .toBoolean();
};

// IsPublished validation
export const productIsPublishedValidation = () => {
  return body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean')
    .toBoolean();
};

// Information validation
export const productInformationValidation = () => {
  return body('information')
    .optional()
    .isArray()
    .withMessage('information must be an array')
    .custom((value) => {
      if (!value) return true;
      for (let info of value) {
        if (!info.key || typeof info.key !== 'string' || info.key.length > 100) {
          throw new Error('Invalid information key');
        }
        if (!info.value || typeof info.value !== 'string' || info.value.length > 500) {
          throw new Error('Invalid information value');
        }
      }
      return true;
    });
};

// Default Product Variant ID validation
export const productDefaultVariantValidation = () => {
  return body('defaultProductVariantId')
    .optional()
    .isMongoId()
    .withMessage('Invalid default product variant ID format');
};

// ==================== PRODUCT VALIDATORS ====================

// 1. Get All Products Validator
export const validateGetAllProducts = [
  validateProductQuery(),
  handleValidationErrors
];

// 2. Get Single Product Validator
export const validateGetSingleProduct = [
  validateProductId(),
  validateProductQuery(),
  handleValidationErrors
];

// 3. Create Product Validator
export const validateCreateProduct = [
  productTitleValidation(),
  productDescriptionValidation(),
  productBrandValidation(),
  productCategoriesValidation(),
  productImagesValidation(),
  productVideosValidation(),
  productTagsValidation(),
  productVariantIdsValidation(),
  productMinPriceValidation(),
  productMaxPriceValidation(),
  productMaxDiscountValidation(),
  productInStockValidation(),
  productIsPublishedValidation(),
  productInformationValidation(),
  productDefaultVariantValidation(),
  handleValidationErrors
];

// 4. Update Product Validator
export const validateUpdateProduct = [
  validateProductId(),
  productTitleValidation(),
  productDescriptionValidation(),
  productBrandValidation(),
  productCategoriesValidation(),
  productImagesValidation(),
  productVideosValidation(),
  productTagsValidation(),
  productVariantIdsValidation(),
  productMinPriceValidation(),
  productMaxPriceValidation(),
  productMaxDiscountValidation(),
  productInStockValidation(),
  productIsPublishedValidation(),
  productInformationValidation(),
  productDefaultVariantValidation(),
  handleValidationErrors
];

// 5. Delete Product Validator
export const validateDeleteProduct = [
  validateProductId(),
  handleValidationErrors
];

// 6. Toggle Favorite Validator
export const validateToggleFavorite = [
  validateProductId(),
  handleValidationErrors
];

// ==================== PRODUCT EXISTENCE VALIDATOR ====================

export const validateProductExists = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  
  if (!product) {
    return next(new HandleERROR('Product not found', 404));
  }
  
  req.product = product;
  next();
};

// ==================== PERMISSION VALIDATORS ====================

export const validateProductPermission = (req, res, next) => {
  const userRole = req.role;
  
  if (userRole === 'admin' || userRole === 'superAdmin') {
    return next();
  }
  
  if (req.method === 'GET') {
    return next();
  }
  
  return next(new HandleERROR('You do not have permission to perform this action', 403));
};

// ==================== TITLE UNIQUENESS VALIDATOR ====================

export const validateProductTitleUnique = () => {
  return body('title')
    .custom(async (value, { req }) => {
      const product = await Product.findOne({ 
        title: { $regex: new RegExp(`^${value}$`, 'i') }
      });
      
      if (!product) return true;
      
      if (req.params.id && product._id.toString() === req.params.id) {
        return true;
      }
      
      throw new Error('Product title already taken');
    });
};

// ==================== PRICE VALIDATION ====================

export const validatePriceRange = () => {
  return body('maxPrice')
    .optional()
    .custom((value, { req }) => {
      const minPrice = req.body.minPrice;
      if (minPrice && value && value < minPrice) {
        throw new Error('maxPrice must be greater than or equal to minPrice');
      }
      return true;
    });
};

// ==================== COMPOSED VALIDATORS ====================

export const validateProductCreate = [
  validateProductTitleUnique(),
  productTitleValidation(),
  productDescriptionValidation(),
  productBrandValidation(),
  productCategoriesValidation(),
  productImagesValidation(),
  productVideosValidation(),
  productTagsValidation(),
  productVariantIdsValidation(),
  productMinPriceValidation(),
  productMaxPriceValidation(),
  validatePriceRange(),
  productMaxDiscountValidation(),
  productInStockValidation(),
  productIsPublishedValidation(),
  productInformationValidation(),
  productDefaultVariantValidation(),
  handleValidationErrors
];

export const validateProductUpdate = [
  validateProductId(),
  validateProductTitleUnique(),
  productTitleValidation(),
  productDescriptionValidation(),
  productBrandValidation(),
  productCategoriesValidation(),
  productImagesValidation(),
  productVideosValidation(),
  productTagsValidation(),
  productVariantIdsValidation(),
  productMinPriceValidation(),
  productMaxPriceValidation(),
  validatePriceRange(),
  productMaxDiscountValidation(),
  productInStockValidation(),
  productIsPublishedValidation(),
  productInformationValidation(),
  productDefaultVariantValidation(),
  handleValidationErrors
];

export const validateProductGet = [
  validateProductId(),
  handleValidationErrors
];

export const validateProductDelete = [
  validateProductId(),
  handleValidationErrors
];

export const validateFavoriteToggle = [
  validateProductId(),
  handleValidationErrors
];

// ==================== FILE VALIDATORS ====================

export const validateProductImages = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  const maxFiles = 10;

  if (req.files.length > maxFiles) {
    return next(new HandleERROR(`Maximum ${maxFiles} images allowed`, 400));
  }

  for (let file of req.files) {
    if (!allowedTypes.includes(file.mimetype)) {
      return next(new HandleERROR('Image must be JPEG, PNG, WEBP, or GIF format', 400));
    }
    if (file.size > maxSize) {
      return next(new HandleERROR('Image size cannot exceed 5MB', 400));
    }
  }

  next();
};

export const validateProductVideos = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  const maxSize = 50 * 1024 * 1024; // 50MB
  const maxFiles = 5;

  if (req.files.length > maxFiles) {
    return next(new HandleERROR(`Maximum ${maxFiles} videos allowed`, 400));
  }

  for (let file of req.files) {
    if (!allowedTypes.includes(file.mimetype)) {
      return next(new HandleERROR('Video must be MP4, WEBM, or OGG format', 400));
    }
    if (file.size > maxSize) {
      return next(new HandleERROR('Video size cannot exceed 50MB', 400));
    }
  }

  next();
};

// ==================== EXPORT ALL ====================

export default {
  handleValidationErrors,
  validateProductId,
  validateProductQuery,
  validateGetAllProducts,
  validateGetSingleProduct,
  validateCreateProduct,
  validateUpdateProduct,
  validateDeleteProduct,
  validateToggleFavorite,
  validateProductCreate,
  validateProductUpdate,
  validateProductGet,
  validateProductDelete,
  validateFavoriteToggle,
  validateProductExists,
  validateProductPermission,
  validateProductTitleUnique,
  validatePriceRange,
  validateProductImages,
  validateProductVideos,
  productTitleValidation,
  productDescriptionValidation,
  productBrandValidation,
  productCategoriesValidation,
  productImagesValidation,
  productVideosValidation,
  productTagsValidation,
  productVariantIdsValidation,
  productMinPriceValidation,
  productMaxPriceValidation,
  productMaxDiscountValidation,
  productInStockValidation,
  productIsPublishedValidation,
  productInformationValidation,
  productDefaultVariantValidation
};