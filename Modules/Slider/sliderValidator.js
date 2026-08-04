import { body, param, query, validationResult } from 'express-validator';
import { HandleERROR } from 'vanta-api';
import { handleValidationErrors } from '../../Utils/handleValidationErrors.js';


// ==================== PARAM VALIDATORS ====================

export const validateSliderId = () => {
  return param('id')
    .notEmpty()
    .withMessage('Slider ID is required')
    .isMongoId()
    .withMessage('Invalid slider ID format');
};

// ==================== QUERY VALIDATORS ====================

export const validateSliderQuery = () => {
  return [
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
    
    query('q')
      .optional()
      .isString()
      .withMessage('Search query must be a string')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Search query cannot be empty'),
    
    query('isPublished')
      .optional()
      .isBoolean()
      .withMessage('isPublished must be a boolean')
      .toBoolean(),
    
    handleValidationErrors
  ];
};

// ==================== BODY VALIDATORS ====================

// Slider title validation
export const sliderTitleValidation = () => {
  return body('title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters')
    .matches(/^[\u0600-\u06FF\sa-zA-Z0-9\-_.,!? ]+$/)
    .withMessage('Title contains invalid characters');
};

// Slider image validation
export const sliderImageValidation = () => {
  return body('image')
    .trim()
    .notEmpty()
    .withMessage('Image is required')
    .isLength({ max: 500 })
    .withMessage('Image path cannot exceed 500 characters')
    .matches(/^[a-zA-Z0-9\-_./]+$/)
    .withMessage('Image path contains invalid characters');
};

// Slider isPublished validation
export const sliderIsPublishedValidation = () => {
  return body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean (true or false)')
    .toBoolean();
};

// Slider path validation
export const sliderPathValidation = () => {
  return body('path')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Path cannot exceed 200 characters')
    .matches(/^[a-zA-Z0-9\-_/]+$/)
    .withMessage('Path contains invalid characters')
    .custom(value => {
      // Ensure path starts with /
      if (value && !value.startsWith('/')) {
        throw new Error('Path must start with "/"');
      }
      return true;
    });
};

// Slider href validation
export const sliderHrefValidation = () => {
  return body('href')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Href cannot exceed 500 characters')
    .custom(value => {
      // Validate URL format
      if (value) {
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        if (!urlPattern.test(value) && !value.startsWith('/')) {
          throw new Error('Invalid URL format. Must be a valid URL or path');
        }
      }
      return true;
    });
};

// ==================== SLIDER VALIDATORS ====================

// 1. Get All Sliders Validator
export const validateGetAllSliders = [
  validateSliderQuery(),
  handleValidationErrors
];

// 2. Get Single Slider Validator
export const validateGetSingleSlider = [
  validateSliderId(),
  validateSliderQuery(),
  handleValidationErrors
];

// 3. Create Slider Validator
export const validateCreateSlider = [
  sliderTitleValidation(),
  sliderImageValidation(),
  sliderIsPublishedValidation(),
  sliderPathValidation(),
  sliderHrefValidation(),
  handleValidationErrors
];

// 4. Update Slider Validator
export const validateUpdateSlider = [
  validateSliderId(),
  sliderTitleValidation(),
  sliderImageValidation(),
  sliderIsPublishedValidation(),
  sliderPathValidation(),
  sliderHrefValidation(),
  handleValidationErrors
];

// 5. Delete Slider Validator
export const validateDeleteSlider = [
  validateSliderId(),
  handleValidationErrors
];

// ==================== FILE UPLOAD VALIDATORS ====================

// Validate image file for slider
export const validateSliderImage = (req, res, next) => {
  if (!req.file) {
    return next(new HandleERROR('Image file is required', 400));
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(req.file.mimetype)) {
    return next(new HandleERROR('Image must be JPEG, PNG, WEBP, GIF, or SVG format', 400));
  }

  if (req.file.size > maxSize) {
    return next(new HandleERROR('Image size cannot exceed 10MB', 400));
  }

  next();
};

// ==================== SLIDER EXISTENCE VALIDATOR ====================

// Check if slider exists before operations
export const validateSliderExists = async (req, res, next) => {
  const { id } = req.params;
  const Slider = req.app.get('SliderModel') || (await import('./sliderMd.js')).default;
  const slider = await Slider.findById(id);
  
  if (!slider) {
    return next(new HandleERROR('Slider not found', 404));
  }
  
  req.slider = slider;
  next();
};

// ==================== PERMISSION VALIDATORS ====================

// Check if user has permission for slider operations
export const validateSliderPermission = (req, res, next) => {
  const userRole = req.role;
  
  // Admin and superAdmin have full access
  if (userRole === 'admin' || userRole === 'superAdmin') {
    return next();
  }
  
  // Regular users can only view sliders
  if (req.method === 'GET') {
    return next();
  }
  
  return next(new HandleERROR('You do not have permission to perform this action', 403));
};

// ==================== COMPOSED VALIDATORS ====================

// Composed validators for each route
export const validateSliderCreate = [
  sliderTitleValidation(),
  sliderImageValidation(),
  sliderIsPublishedValidation(),
  sliderPathValidation(),
  sliderHrefValidation(),
  handleValidationErrors
];

export const validateSliderUpdate = [
  validateSliderId(),
  sliderTitleValidation(),
  sliderImageValidation(),
  sliderIsPublishedValidation(),
  sliderPathValidation(),
  sliderHrefValidation(),
  handleValidationErrors
];

export const validateSliderGet = [
  validateSliderId(),
  handleValidationErrors
];

export const validateSliderDelete = [
  validateSliderId(),
  handleValidationErrors
];

// ==================== EXPORT ALL ====================

export default {
  handleValidationErrors,
  validateSliderId,
  validateSliderQuery,
  validateGetAllSliders,
  validateGetSingleSlider,
  validateCreateSlider,
  validateUpdateSlider,
  validateDeleteSlider,
  validateSliderCreate,
  validateSliderUpdate,
  validateSliderGet,
  validateSliderDelete,
  validateSliderImage,
  validateSliderExists,
  validateSliderPermission,
  sliderTitleValidation,
  sliderImageValidation,
  sliderIsPublishedValidation,
  sliderPathValidation,
  sliderHrefValidation
};