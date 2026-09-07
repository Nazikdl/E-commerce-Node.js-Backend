/**
 * Discount Code Management API Documentation
 * Base URL: /api/discount-code
 */

// ==================== COMMON SCHEMAS ====================

export const discountCodeSchemas = {
  UserUsed: {
    type: 'object',
    properties: {
      userId: {
        type: 'string',
        example: '507f1f77bcf86cd799439011',
        description: 'User ID'
      },
      count: {
        type: 'number',
        default: 1,
        example: 2,
        description: 'Number of times user used this code'
      }
    }
  },

  DiscountCode: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        example: '507f1f77bcf86cd799439022',
        description: 'MongoDB ObjectId'
      },
      type: {
        type: 'string',
        enum: ['percentage', 'fixed'],
        example: 'percentage',
        description: 'Discount type'
      },
      value: {
        type: 'number',
        example: 10,
        description: 'Discount value (percentage or fixed amount)'
      },
      startTime: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-01T00:00:00.000Z',
        description: 'Start time of discount validity'
      },
      expireTime: {
        type: 'string',
        format: 'date-time',
        example: '2024-12-31T23:59:59.000Z',
        description: 'Expiration time of discount'
      },
      minPrice: {
        type: 'number',
        example: 100,
        description: 'Minimum cart price required'
      },
      maxPrice: {
        type: 'number',
        example: 500,
        description: 'Maximum cart price allowed'
      },
      code: {
        type: 'string',
        example: 'SUMMER2024',
        description: 'Unique discount code'
      },
      usageLimit: {
        type: 'number',
        example: 100,
        description: 'Total number of times code can be used'
      },
      usedCount: {
        type: 'number',
        default: 0,
        example: 50,
        description: 'Number of times code has been used'
      },
      userUsedLimit: {
        type: 'number',
        example: 1,
        description: 'Maximum times a single user can use this code'
      },
      userIdUsed: {
        type: 'array',
        items: { $ref: '#/components/schemas/UserUsed' },
        description: 'Users who have used this code'
      },
      freeShipping: {
        type: 'boolean',
        default: false,
        example: true,
        description: 'Whether free shipping is included'
      },
      isPublished: {
        type: 'boolean',
        default: false,
        example: true,
        description: 'Whether discount code is active'
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-01T00:00:00.000Z'
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-01T00:00:00.000Z'
      }
    }
  },

  DiscountCodeResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      count: { type: 'number', example: 10 },
      data: { type: 'array', items: { $ref: '#/components/schemas/DiscountCode' } }
    }
  },

  SingleDiscountCodeResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      data: { $ref: '#/components/schemas/DiscountCode' }
    }
  },

  CreateDiscountCodeRequest: {
    type: 'object',
    required: ['code', 'type', 'value', 'usageLimit', 'userUsedLimit'],
    properties: {
      code: {
        type: 'string',
        required: true,
        example: 'SUMMER2024',
        description: 'Unique discount code (uppercase, letters, numbers, hyphens, underscores)'
      },
      type: {
        type: 'string',
        required: true,
        enum: ['percentage', 'fixed'],
        example: 'percentage',
        description: 'Discount type'
      },
      value: {
        type: 'number',
        required: true,
        example: 10,
        description: 'Discount value (max 100 for percentage)'
      },
      startTime: {
        type: 'string',
        format: 'date-time',
        example: '2024-06-01T00:00:00.000Z',
        description: 'Start time (must be in future)'
      },
      expireTime: {
        type: 'string',
        format: 'date-time',
        example: '2024-08-31T23:59:59.000Z',
        description: 'Expiration time (must be after start time)'
      },
      minPrice: {
        type: 'number',
        example: 100,
        description: 'Minimum cart price required'
      },
      maxPrice: {
        type: 'number',
        example: 500,
        description: 'Maximum cart price allowed'
      },
      usageLimit: {
        type: 'number',
        required: true,
        example: 100,
        description: 'Total usage limit'
      },
      userUsedLimit: {
        type: 'number',
        required: true,
        example: 1,
        description: 'Per user usage limit'
      },
      freeShipping: {
        type: 'boolean',
        default: false,
        example: true,
        description: 'Free shipping included'
      },
      isPublished: {
        type: 'boolean',
        default: false,
        example: true,
        description: 'Whether code is active'
      }
    }
  },

  CheckDiscountCodeRequest: {
    type: 'object',
    required: ['code'],
    properties: {
      code: {
        type: 'string',
        required: true,
        example: 'SUMMER2024',
        description: 'Discount code to check'
      }
    }
  },

  CheckDiscountCodeResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      data: {
        type: 'object',
        properties: {
          discountValue: { type: 'number', example: 100 },
          finalPriceAfterDiscount: { type: 'number', example: 800 }
        }
      }
    }
  },

  ErrorResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      message: { type: 'string', example: 'Discount code not found' }
    }
  }
};

// ==================== ENDPOINT DOCUMENTATION ====================

/**
 * @route GET /api/discount-code/
 * @description Get all discount codes (Admin only)
 * @access Private - Admin and SuperAdmin only
 */
export const getAllDiscountCodesDocs = {
  endpoint: '/',
  method: 'GET',
  summary: 'Get All Discount Codes',
  description: 'Retrieve all discount codes with filtering, sorting, and pagination. Admin access only.',
  access: 'Admin, SuperAdmin',
  queryParams: {
    page: { type: 'number', default: 1, example: 2 },
    limit: { type: 'number', default: 10, max: 100, example: 20 },
    sort: { type: 'string', example: '-createdAt' },
    fields: { type: 'string', example: 'code,type,value,isPublished' },
    q: { type: 'string', example: 'SUMMER' },
    type: { type: 'string', enum: ['percentage', 'fixed'], example: 'percentage' },
    isPublished: { type: 'boolean', example: true },
    freeShipping: { type: 'boolean', example: true },
    populate: { type: 'string', example: 'userIdUsed' }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        count: 5,
        data: [
          {
            _id: '507f1f77bcf86cd799439022',
            code: 'SUMMER2024',
            type: 'percentage',
            value: 10,
            usageLimit: 100,
            usedCount: 50,
            userUsedLimit: 1,
            isPublished: true,
            freeShipping: false,
            startTime: '2024-06-01T00:00:00.000Z',
            expireTime: '2024-08-31T23:59:59.000Z'
          }
        ]
      }
    },
    error: {
      status: 403,
      body: { success: false, message: 'You do not have permission' }
    }
  }
};

/**
 * @route GET /api/discount-code/:id
 * @description Get a single discount code by ID (Admin only)
 * @access Private - Admin and SuperAdmin only
 */
export const getSingleDiscountCodeDocs = {
  endpoint: '/:id',
  method: 'GET',
  summary: 'Get Single Discount Code',
  description: 'Retrieve detailed information about a specific discount code.',
  access: 'Admin, SuperAdmin',
  params: {
    id: {
      type: 'string',
      required: true,
      pattern: '^[0-9a-fA-F]{24}$',
      example: '507f1f77bcf86cd799439022'
    }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439022',
          code: 'SUMMER2024',
          type: 'percentage',
          value: 10,
          usageLimit: 100,
          usedCount: 50,
          userUsedLimit: 1,
          isPublished: true,
          userIdUsed: [
            {
              userId: { _id: '507f1f77bcf86cd799439011', fullName: 'John Doe' },
              count: 1
            }
          ]
        }
      }
    },
    error: {
      status: 404,
      body: { success: false, message: 'Discount code not found' }
    }
  }
};

/**
 * @route POST /api/discount-code/
 * @description Create a new discount code (Admin only)
 * @access Private - Admin and SuperAdmin only
 */
export const createDiscountCodeDocs = {
  endpoint: '/',
  method: 'POST',
  summary: 'Create Discount Code',
  description: 'Create a new discount code with validation rules.',
  access: 'Admin, SuperAdmin',
  body: {
    code: {
      type: 'string',
      required: true,
      example: 'SUMMER2024',
      description: 'Unique discount code'
    },
    type: {
      type: 'string',
      required: true,
      enum: ['percentage', 'fixed'],
      example: 'percentage',
      description: 'Discount type'
    },
    value: {
      type: 'number',
      required: true,
      example: 10,
      description: 'Discount value (max 100 for percentage)'
    },
    startTime: {
      type: 'string',
      format: 'date-time',
      example: '2024-06-01T00:00:00.000Z',
      description: 'Start time (optional)'
    },
    expireTime: {
      type: 'string',
      format: 'date-time',
      example: '2024-08-31T23:59:59.000Z',
      description: 'Expiration time (optional)'
    },
    minPrice: {
      type: 'number',
      example: 100,
      description: 'Minimum cart price (optional)'
    },
    maxPrice: {
      type: 'number',
      example: 500,
      description: 'Maximum cart price (optional)'
    },
    usageLimit: {
      type: 'number',
      required: true,
      example: 100,
      description: 'Total usage limit'
    },
    userUsedLimit: {
      type: 'number',
      required: true,
      example: 1,
      description: 'Per user usage limit'
    },
    freeShipping: {
      type: 'boolean',
      default: false,
      example: true,
      description: 'Free shipping included'
    },
    isPublished: {
      type: 'boolean',
      default: false,
      example: true,
      description: 'Whether code is active'
    }
  },
  responses: {
    success: {
      status: 201,
      body: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439022',
          code: 'SUMMER2024',
          type: 'percentage',
          value: 10,
          usageLimit: 100,
          userUsedLimit: 1,
          isPublished: true
        },
        message: 'discount code created successfully'
      }
    },
    error: {
      status: 400,
      body: { success: false, message: 'Discount code already taken' }
    }
  },
  examples: [
    {
      name: 'Create percentage discount',
      body: {
        code: 'SUMMER2024',
        type: 'percentage',
        value: 10,
        usageLimit: 100,
        userUsedLimit: 1,
        isPublished: true,
        minPrice: 100,
        expireTime: '2024-08-31T23:59:59.000Z'
      }
    },
    {
      name: 'Create fixed discount',
      body: {
        code: 'FIXED50',
        type: 'fixed',
        value: 50,
        usageLimit: 50,
        userUsedLimit: 2,
        isPublished: true,
        freeShipping: true
      }
    }
  ]
};

/**
 * @route PATCH /api/discount-code/:id
 * @description Update a discount code (Admin only)
 * @access Private - Admin and SuperAdmin only
 */
export const updateDiscountCodeDocs = {
  endpoint: '/:id',
  method: 'PATCH',
  summary: 'Update Discount Code',
  description: 'Update an existing discount code. Some fields cannot be updated if code has been used.',
  access: 'Admin, SuperAdmin',
  params: {
    id: {
      type: 'string',
      required: true,
      example: '507f1f77bcf86cd799439022'
    }
  },
  body: {
    code: { type: 'string', example: 'SUMMER2024' },
    type: { type: 'string', enum: ['percentage', 'fixed'], example: 'percentage' },
    value: { type: 'number', example: 15 },
    startTime: { type: 'string', format: 'date-time', example: '2024-06-01T00:00:00.000Z' },
    expireTime: { type: 'string', format: 'date-time', example: '2024-09-30T23:59:59.000Z' },
    minPrice: { type: 'number', example: 150 },
    maxPrice: { type: 'number', example: 600 },
    usageLimit: { type: 'number', example: 200 },
    userUsedLimit: { type: 'number', example: 2 },
    freeShipping: { type: 'boolean', example: true },
    isPublished: { type: 'boolean', example: false }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439022',
          code: 'SUMMER2024',
          value: 15,
          isPublished: false
        },
        message: 'discount code updated successfully'
      }
    },
    error: {
      status: 400,
      body: { success: false, message: 'usedCount is auto-calculated and cannot be updated directly' }
    }
  },
  examples: [
    {
      name: 'Update discount value',
      body: {
        value: 15,
        expireTime: '2024-09-30T23:59:59.000Z'
      }
    },
    {
      name: 'Unpublish discount',
      body: {
        isPublished: false
      }
    }
  ]
};

/**
 * @route DELETE /api/discount-code/:id
 * @description Delete a discount code (Admin only)
 * @access Private - Admin and SuperAdmin only
 */
export const deleteDiscountCodeDocs = {
  endpoint: '/:id',
  method: 'DELETE',
  summary: 'Delete Discount Code',
  description: 'Delete a discount code. Cannot delete if code has been used by any user.',
  access: 'Admin, SuperAdmin',
  params: {
    id: {
      type: 'string',
      required: true,
      pattern: '^[0-9a-fA-F]{24}$',
      example: '507f1f77bcf86cd799439022'
    }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        message: 'discount code removed successfully'
      }
    },
    error: {
      status: 400,
      body: {
        success: false,
        message: 'Cannot delete code because it has been used by at least one user. Change isPublished instead.'
      }
    },
    notFound: {
      status: 404,
      body: { success: false, message: 'Discount code not found' }
    }
  }
};

/**
 * @route POST /api/discount-code/check
 * @description Check and validate a discount code
 * @access Private - Requires authentication
 */
export const checkDiscountCodeDocs = {
  endpoint: '/check',
  method: 'POST',
  summary: 'Check Discount Code',
  description: 'Validate a discount code against user\'s cart and return discount amount.',
  access: 'Authenticated Users',
  body: {
    code: {
      type: 'string',
      required: true,
      example: 'SUMMER2024',
      description: 'Discount code to check'
    }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        data: {
          discountValue: 100,
          finalPriceAfterDiscount: 800
        }
      }
    },
    error: {
      status: 400,
      body: {
        success: false,
        message: 'discount code expired at 2024-12-31T23:59:59.000Z - min price for this code is 100'
      }
    },
    notFound: {
      status: 404,
      body: { success: false, message: 'invalid discount code' }
    }
  },
  examples: [
    {
      name: 'Valid discount code',
      body: {
        code: 'SUMMER2024'
      }
    }
  ]
};

// ==================== VALIDATION CHECKS ====================

export const validationChecksDocs = {
  title: 'Discount Code Validation Rules',
  description: 'When checking a discount code, the following validations are performed:',
  checks: [
    {
      name: 'Expiration Check',
      description: 'Code cannot be used after expireTime',
      error: 'discount code expired at {expireTime}'
    },
    {
      name: 'Start Time Check',
      description: 'Code cannot be used before startTime',
      error: 'discount code start at {startTime}'
    },
    {
      name: 'Minimum Price Check',
      description: 'Cart total must be at least minPrice',
      error: 'min price for this code is {minPrice}'
    },
    {
      name: 'Maximum Price Check',
      description: 'Cart total must not exceed maxPrice',
      error: 'max price for this code is {maxPrice}'
    },
    {
      name: 'Usage Limit Check',
      description: 'Total uses cannot exceed usageLimit',
      error: 'limit use for this code is finished'
    },
    {
      name: 'Published Status Check',
      description: 'Code must be published',
      error: 'discount code is not available'
    },
    {
      name: 'User Usage Limit Check',
      description: 'User cannot exceed userUsedLimit',
      error: 'user used limit is {userUsedLimit}'
    }
  ]
};

// ==================== QUICK REFERENCE ====================

export const discountCodeEndpoints = {
  getAllDiscountCodes: {
    method: 'GET',
    path: '/api/discount-code/',
    access: 'Admin, SuperAdmin',
    description: 'Get all discount codes'
  },
  getSingleDiscountCode: {
    method: 'GET',
    path: '/api/discount-code/:id',
    access: 'Admin, SuperAdmin',
    description: 'Get single discount code'
  },
  createDiscountCode: {
    method: 'POST',
    path: '/api/discount-code/',
    access: 'Admin, SuperAdmin',
    description: 'Create new discount code'
  },
  updateDiscountCode: {
    method: 'PATCH',
    path: '/api/discount-code/:id',
    access: 'Admin, SuperAdmin',
    description: 'Update discount code'
  },
  deleteDiscountCode: {
    method: 'DELETE',
    path: '/api/discount-code/:id',
    access: 'Admin, SuperAdmin',
    description: 'Delete discount code'
  },
  checkDiscountCode: {
    method: 'POST',
    path: '/api/discount-code/check',
    access: 'Authenticated Users',
    description: 'Check and validate discount code'
  }
};

// ==================== VALIDATION RULES ====================

export const validationRules = {
  code: {
    minLength: 3,
    maxLength: 50,
    pattern: '^[A-Z0-9\\-_]+$',
    required: true,
    unique: true,
    example: 'SUMMER2024',
    description: 'Uppercase letters, numbers, hyphens, underscores'
  },
  type: {
    enum: ['percentage', 'fixed'],
    required: true,
    example: 'percentage'
  },
  value: {
    min: 0,
    type: 'number',
    required: true,
    example: 10,
    note: 'Max 100 for percentage type'
  },
  usageLimit: {
    min: 1,
    type: 'number',
    required: true,
    example: 100
  },
  userUsedLimit: {
    min: 1,
    type: 'number',
    required: true,
    example: 1
  },
  minPrice: {
    min: 0,
    type: 'number',
    example: 100
  },
  maxPrice: {
    min: 0,
    type: 'number',
    example: 500,
    note: 'Must be >= minPrice'
  }
};

// ==================== PERMISSION MATRIX ====================

export const permissionMatrix = {
  endpoints: {
    'GET /api/discount-code/': { user: false, admin: true, superAdmin: true },
    'GET /api/discount-code/:id': { user: false, admin: true, superAdmin: true },
    'POST /api/discount-code/': { user: false, admin: true, superAdmin: true },
    'PATCH /api/discount-code/:id': { user: false, admin: true, superAdmin: true },
    'DELETE /api/discount-code/:id': { user: false, admin: true, superAdmin: true },
    'POST /api/discount-code/check': { user: true, admin: true, superAdmin: true }
  }
};

// ==================== ERROR CODES ====================

export const discountCodeErrorCodes = {
  '400': {
    code: 'BAD_REQUEST',
    examples: [
      'Discount code already taken',
      'For percentage type, value must be less than or equal to 100',
      'Expire time must be after start time',
      'Max price must be greater than or equal to min price',
      'Cannot delete code because it has been used by at least one user',
      'Discount code expired at {expireTime}',
      'min price for this code is {minPrice}',
      'user used limit is {userUsedLimit}'
    ]
  },
  '401': { code: 'UNAUTHORIZED', example: 'Authentication required' },
  '403': { code: 'FORBIDDEN', example: 'You do not have permission' },
  '404': { code: 'NOT_FOUND', example: 'Discount code not found' }
};

// ==================== RESPONSE TEMPLATES ====================

export const responseTemplates = {
  getAllSuccess: {
    success: true,
    count: 5,
    data: [
      {
        _id: '507f1f77bcf86cd799439022',
        code: 'SUMMER2024',
        type: 'percentage',
        value: 10,
        usageLimit: 100,
        usedCount: 50,
        userUsedLimit: 1,
        isPublished: true,
        freeShipping: false
      }
    ]
  },
  getSingleSuccess: {
    success: true,
    data: {
      _id: '507f1f77bcf86cd799439022',
      code: 'SUMMER2024',
      type: 'percentage',
      value: 10,
      usageLimit: 100,
      usedCount: 50,
      userUsedLimit: 1,
      isPublished: true,
      userIdUsed: [
        { userId: { _id: '507f1f77bcf86cd799439011', fullName: 'John Doe' }, count: 1 }
      ]
    }
  },
  createSuccess: {
    success: true,
    data: {
      _id: '507f1f77bcf86cd799439022',
      code: 'SUMMER2024',
      type: 'percentage',
      value: 10,
      usageLimit: 100,
      userUsedLimit: 1,
      isPublished: true
    },
    message: 'discount code created successfully'
  },
  updateSuccess: {
    success: true,
    data: {
      _id: '507f1f77bcf86cd799439022',
      code: 'SUMMER2024',
      value: 15,
      isPublished: false
    },
    message: 'discount code updated successfully'
  },
  deleteSuccess: {
    success: true,
    message: 'discount code removed successfully'
  },
  checkSuccess: {
    success: true,
    data: {
      discountValue: 100,
      finalPriceAfterDiscount: 800
    }
  },
  error: {
    success: false,
    message: 'Error message'
  }
};

// ==================== DEFAULT EXPORT ====================

export default {
  discountCodeSchemas,
  getAllDiscountCodesDocs,
  getSingleDiscountCodeDocs,
  createDiscountCodeDocs,
  updateDiscountCodeDocs,
  deleteDiscountCodeDocs,
  checkDiscountCodeDocs,
  validationChecksDocs,
  discountCodeEndpoints,
  validationRules,
  permissionMatrix,
  discountCodeErrorCodes,
  responseTemplates
};