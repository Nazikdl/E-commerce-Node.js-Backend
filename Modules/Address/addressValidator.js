import { body, param, query, validationResult } from 'express-validator';
import { HandleERROR } from 'vanta-api';
import Address from './addressMd.js';
import { handleValidationErrors } from '../../Utils/handleValidationErrors.js';



// ==================== PARAM VALIDATORS ====================

export const validateAddressId = () => {
  return param('id')
    .notEmpty()
    .withMessage('Address ID is required')
    .isMongoId()
    .withMessage('Invalid address ID format');
};

// ==================== QUERY VALIDATORS ====================

export const validateAddressQuery = () => {
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
    
    query('city')
      .optional()
      .isString()
      .withMessage('City must be a string')
      .trim(),
    
    query('province')
      .optional()
      .isString()
      .withMessage('Province must be a string')
      .trim(),
    
    query('isDefault')
      .optional()
      .isBoolean()
      .withMessage('isDefault must be a boolean')
      .toBoolean(),
    
    handleValidationErrors
  ];
};

// ==================== BODY VALIDATORS ====================

// Title validation
export const addressTitleValidation = () => {
  return body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 to 100 characters')
    .matches(/^[\u0600-\u06FF\sa-zA-Z0-9\-_., ]+$/)
    .withMessage('Title contains invalid characters');
};

// Description validation
export const addressDescriptionValidation = () => {
  return body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 5, max: 500 })
    .withMessage('Description must be between 5 to 500 characters')
    .matches(/^[\u0600-\u06FF\sa-zA-Z0-9\-_.,!? ]+$/)
    .withMessage('Description contains invalid characters');
};

// City validation
export const addressCityValidation = () => {
  return body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 to 50 characters')
    .matches(/^[\u0600-\u06FF\sa-zA-Z\- ]+$/)
    .withMessage('City can only contain letters, spaces, and hyphens');
};

// Province validation
export const addressProvinceValidation = () => {
  return body('province')
    .trim()
    .notEmpty()
    .withMessage('Province is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Province must be between 2 to 50 characters')
    .matches(/^[\u0600-\u06FF\sa-zA-Z\- ]+$/)
    .withMessage('Province can only contain letters, spaces, and hyphens');
};

// Latitude validation
export const addressLatValidation = () => {
  return body('lat')
    .trim()
    .notEmpty()
    .withMessage('Latitude is required')
    .matches(/^-?([0-8]?[0-9]\.\d+)$|^-?90\.\d+$/)
    .withMessage('Invalid latitude format (must be between -90 and 90)')
    .custom(value => {
      const num = parseFloat(value);
      if (num < -90 || num > 90) {
        throw new Error('Latitude must be between -90 and 90');
      }
      return true;
    });
};

// Longitude validation
export const addressLngValidation = () => {
  return body('lng')
    .trim()
    .notEmpty()
    .withMessage('Longitude is required')
    .matches(/^-?([0-9]?[0-9]\.\d+)$|^-?1[0-7][0-9]\.\d+$|^-?180\.\d+$/)
    .withMessage('Invalid longitude format (must be between -180 and 180)')
    .custom(value => {
      const num = parseFloat(value);
      if (num < -180 || num > 180) {
        throw new Error('Longitude must be between -180 and 180');
      }
      return true;
    });
};

// Receiver phone number validation
export const addressReceiverPhoneValidation = () => {
  return body('receiverPhoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Receiver phone number is required')
    .matches(/^(\+98|0)?9\d{9}$/)
    .withMessage('Invalid Iranian phone number format (ex: 09123456789 or +989123456789)');
};

// Receiver full name validation
export const addressReceiverNameValidation = () => {
  return body('receiverFullName')
    .trim()
    .notEmpty()
    .withMessage('Receiver full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Receiver full name must be between 2 to 100 characters')
    .matches(/^[\u0600-\u06FF\sa-zA-Z]+$/)
    .withMessage('Receiver full name can only contain letters and spaces');
};

// Postal code validation
export const addressPostalCodeValidation = () => {
  return body('postalCode')
    .trim()
    .notEmpty()
    .withMessage('Postal code is required')
    .isLength({ min: 10, max: 10 })
    .withMessage('Postal code must be exactly 10 digits')
    .matches(/^\d{10}$/)
    .withMessage('Postal code must contain only numbers');
};

// Plate number validation
export const addressPlateNumberValidation = () => {
  return body('plateNumber')
    .trim()
    .notEmpty()
    .withMessage('Plate number is required')
    .isLength({ min: 1, max: 20 })
    .withMessage('Plate number must be between 1 to 20 characters')
    .matches(/^[a-zA-Z0-9\-_ ]+$/)
    .withMessage('Plate number contains invalid characters');
};

// Unit number validation (optional)
export const addressUnitNumberValidation = () => {
  return body('unitNumber')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Unit number cannot exceed 20 characters')
    .matches(/^[a-zA-Z0-9\-_ ]*$/)
    .withMessage('Unit number contains invalid characters');
};

// Floor validation (optional)
export const addressFloorValidation = () => {
  return body('floor')
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage('Floor cannot exceed 10 characters')
    .matches(/^[a-zA-Z0-9\-_ ]*$/)
    .withMessage('Floor contains invalid characters');
};

// IsDefault validation
export const addressIsDefaultValidation = () => {
  return body('isDefault')
    .optional()
    .isBoolean()
    .withMessage('isDefault must be a boolean (true or false)')
    .toBoolean();
};

// ==================== ADDRESS VALIDATORS ====================

// 1. Get All Addresses Validator
export const validateGetAllAddresses = [
  validateAddressQuery(),
  handleValidationErrors
];

// 2. Get Single Address Validator
export const validateGetSingleAddress = [
  validateAddressId(),
  validateAddressQuery(),
  handleValidationErrors
];

// 3. Create Address Validator
export const validateCreateAddress = [
  addressTitleValidation(),
  addressDescriptionValidation(),
  addressCityValidation(),
  addressProvinceValidation(),
  addressLatValidation(),
  addressLngValidation(),
  addressReceiverPhoneValidation(),
  addressReceiverNameValidation(),
  addressPostalCodeValidation(),
  addressPlateNumberValidation(),
  addressUnitNumberValidation(),
  addressFloorValidation(),
  addressIsDefaultValidation(),
  handleValidationErrors
];

// 4. Update Address Validator
export const validateUpdateAddress = [
  validateAddressId(),
  addressTitleValidation(),
  addressDescriptionValidation(),
  addressCityValidation(),
  addressProvinceValidation(),
  addressLatValidation(),
  addressLngValidation(),
  addressReceiverPhoneValidation(),
  addressReceiverNameValidation(),
  addressPostalCodeValidation(),
  addressPlateNumberValidation(),
  addressUnitNumberValidation(),
  addressFloorValidation(),
  addressIsDefaultValidation(),
  handleValidationErrors
];

// 5. Delete Address Validator
export const validateDeleteAddress = [
  validateAddressId(),
  handleValidationErrors
];

// ==================== ADDRESS EXISTENCE VALIDATOR ====================

// Check if address exists before operations
export const validateAddressExists = async (req, res, next) => {
  const { id } = req.params;
  const address = await Address.findById(id);
  
  if (!address) {
    return next(new HandleERROR('Address not found', 404));
  }
  
  req.address = address;
  next();
};

// ==================== PERMISSION VALIDATORS ====================

// Check if user has permission for address operations
export const validateAddressPermission = (req, res, next) => {
  const userRole = req.role;
  const userId = req.userId;
  const address = req.address;

  // Admin and superAdmin have full access
  if (userRole === 'admin' || userRole === 'superAdmin') {
    return next();
  }

  // Regular users can only access their own addresses
  if (address && address.userId.toString() === userId.toString()) {
    return next();
  }

  return next(new HandleERROR('You do not have permission to access this address', 403));
};

// ==================== DEFAULT ADDRESS VALIDATOR ====================

// Ensure only one default address per user
export const validateDefaultAddress = () => {
  return body('isDefault')
    .custom(async (value, { req }) => {
      if (!value) return true;
      
      const userId = req.userId;
      // Check if user already has a default address
      const existingDefault = await Address.findOne({ 
        userId: userId, 
        isDefault: true 
      });
      
      // For update: allow if it's the same address
      if (req.params.id && existingDefault && existingDefault._id.toString() === req.params.id) {
        return true;
      }
      
      if (existingDefault) {
        throw new Error('User already has a default address. Only one default address is allowed.');
      }
      
      return true;
    });
};

// ==================== USER ID VALIDATOR ====================

// Prevent userId from being updated by client
export const validateNoUserIdUpdate = () => {
  return body('userId')
    .custom((value, { req }) => {
      if (value) {
        throw new Error('userId cannot be updated');
      }
      return true;
    });
};

// ==================== COMPOSED VALIDATORS ====================

// Composed validators for each route
export const validateAddressCreate = [
  validateDefaultAddress(),
  addressTitleValidation(),
  addressDescriptionValidation(),
  addressCityValidation(),
  addressProvinceValidation(),
  addressLatValidation(),
  addressLngValidation(),
  addressReceiverPhoneValidation(),
  addressReceiverNameValidation(),
  addressPostalCodeValidation(),
  addressPlateNumberValidation(),
  addressUnitNumberValidation(),
  addressFloorValidation(),
  addressIsDefaultValidation(),
  handleValidationErrors
];

export const validateAddressUpdate = [
  validateAddressId(),
  validateDefaultAddress(),
  validateNoUserIdUpdate(),
  addressTitleValidation(),
  addressDescriptionValidation(),
  addressCityValidation(),
  addressProvinceValidation(),
  addressLatValidation(),
  addressLngValidation(),
  addressReceiverPhoneValidation(),
  addressReceiverNameValidation(),
  addressPostalCodeValidation(),
  addressPlateNumberValidation(),
  addressUnitNumberValidation(),
  addressFloorValidation(),
  addressIsDefaultValidation(),
  handleValidationErrors
];

export const validateAddressGet = [
  validateAddressId(),
  handleValidationErrors
];

export const validateAddressDelete = [
  validateAddressId(),
  handleValidationErrors
];

// ==================== EXPORT ALL ====================

export default {
  handleValidationErrors,
  validateAddressId,
  validateAddressQuery,
  validateGetAllAddresses,
  validateGetSingleAddress,
  validateCreateAddress,
  validateUpdateAddress,
  validateDeleteAddress,
  validateAddressCreate,
  validateAddressUpdate,
  validateAddressGet,
  validateAddressDelete,
  validateAddressExists,
  validateAddressPermission,
  validateDefaultAddress,
  validateNoUserIdUpdate,
  addressTitleValidation,
  addressDescriptionValidation,
  addressCityValidation,
  addressProvinceValidation,
  addressLatValidation,
  addressLngValidation,
  addressReceiverPhoneValidation,
  addressReceiverNameValidation,
  addressPostalCodeValidation,
  addressPlateNumberValidation,
  addressUnitNumberValidation,
  addressFloorValidation,
  addressIsDefaultValidation
};