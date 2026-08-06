/**
 * Variant Management API Documentation
 * Base URL: /api/variants
 * All write operations require admin authentication
 * Variants are used for product attributes like Size and Color
 */

// ==================== COMMON SCHEMAS ====================

export const variantSchemas = {
  Variant: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        example: '507f1f77bcf86cd799439011',
        description: 'MongoDB ObjectId'
      },
      type: {
        type: 'string',
        enum: ['size', 'color'],
        example: 'size',
        description: 'Variant type (size or color)'
      },
      value: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
        example: 'Large',
        description: 'Variant value (must be unique)'
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

  VariantResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      count: {
        type: 'number',
        example: 10,
        description: 'Total number of variants (for getAll)'
      },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Variant' }
      }
    }
  },

  SingleVariantResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      data: {
        $ref: '#/components/schemas/Variant'
      }
    }
  },

  CreateVariantRequest: {
    type: 'object',
    required: ['type', 'value'],
    properties: {
      type: {
        type: 'string',
        enum: ['size', 'color'],
        example: 'color',
        description: 'Variant type (must be size or color)'
      },
      value: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
        example: 'Red',
        description: 'Variant value (must be unique)'
      }
    }
  },

  UpdateVariantRequest: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        enum: ['size', 'color'],
        example: 'size',
        description: 'Variant type'
      },
      value: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
        example: 'XL',
        description: 'Variant value (must be unique)'
      }
    }
  },

  ErrorResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false
      },
      message: {
        type: 'string',
        example: 'Variant value already exists'
      }
    }
  }
};

// ==================== ENDPOINT DOCUMENTATION ====================

/**
 * @route GET /api/variants/
 * @description Get all variants with filtering, sorting, and pagination
 * @access Public
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10, max: 100)
 * @query {string} sort - Sort field with prefix (- for desc, + for asc)
 * @query {string} fields - Comma-separated fields to include/exclude
 * @query {string} q - Search query (searches value)
 * @query {string} type - Filter by variant type (size or color)
 */
export const getAllVariantsDocs = {
  endpoint: '/',
  method: 'GET',
  summary: 'Get All Variants',
  description: 'Retrieve a list of all variants. Can filter by type (size/color) and search by value.',
  access: 'Public',
  queryParams: {
    page: {
      type: 'number',
      required: false,
      default: 1,
      example: 2,
      description: 'Page number for pagination'
    },
    limit: {
      type: 'number',
      required: false,
      default: 10,
      max: 100,
      example: 20,
      description: 'Number of items per page'
    },
    sort: {
      type: 'string',
      required: false,
      example: '-createdAt',
      description: 'Sort field with prefix (- for descending, + for ascending)'
    },
    fields: {
      type: 'string',
      required: false,
      example: 'type,value',
      description: 'Comma-separated fields to include or exclude (prefix with -)'
    },
    q: {
      type: 'string',
      required: false,
      example: 'red',
      description: 'Search query for variant value'
    },
    type: {
      type: 'string',
      required: false,
      enum: ['size', 'color'],
      example: 'color',
      description: 'Filter by variant type'
    }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        count: 10,
        data: [
          {
            _id: '507f1f77bcf86cd799439011',
            type: 'color',
            value: 'Red',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          },
          {
            _id: '507f1f77bcf86cd799439022',
            type: 'size',
            value: 'Large',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          }
        ]
      }
    }
  },
  examples: [
    {
      name: 'Get all colors',
      query: '?type=color&sort=value',
      description: 'Get all color variants sorted by value'
    },
    {
      name: 'Get all sizes',
      query: '?type=size&sort=-value',
      description: 'Get all size variants sorted by value descending'
    },
    {
      name: 'Search variants',
      query: '?q=red&fields=value,type',
      description: 'Search for variants containing "red"'
    },
    {
      name: 'Pagination',
      query: '?page=2&limit=10',
      description: 'Get second page with 10 items per page'
    }
  ]
};

/**
 * @route GET /api/variants/:id
 * @description Get a single variant by ID
 * @access Public
 * @param {string} id - Variant ID (MongoDB ObjectId)
 */
export const getSingleVariantDocs = {
  endpoint: '/:id',
  method: 'GET',
  summary: 'Get Single Variant',
  description: 'Retrieve detailed information about a specific variant.',
  access: 'Public',
  params: {
    id: {
      type: 'string',
      required: true,
      pattern: '^[0-9a-fA-F]{24}$',
      example: '507f1f77bcf86cd799439011',
      description: 'MongoDB ObjectId of the variant'
    }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          type: 'color',
          value: 'Red',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      }
    },
    error: {
      status: 404,
      body: {
        success: false,
        message: 'Variant not found'
      }
    }
  }
};

/**
 * @route POST /api/variants/
 * @description Create a new variant
 * @access Private - Admin and SuperAdmin only
 * @body {string} type - Variant type (required, enum: size or color)
 * @body {string} value - Variant value (required, unique, 1-50 chars)
 */
export const createVariantDocs = {
  endpoint: '/',
  method: 'POST',
  summary: 'Create New Variant',
  description: 'Create a new variant. Type must be "size" or "color" and value must be unique.',
  access: 'Admin, SuperAdmin',
  body: {
    type: {
      type: 'string',
      required: true,
      enum: ['size', 'color'],
      example: 'size',
      description: 'Variant type (must be size or color)'
    },
    value: {
      type: 'string',
      required: true,
      minLength: 1,
      maxLength: 50,
      example: 'XL',
      description: 'Variant value (must be unique)'
    }
  },
  responses: {
    success: {
      status: 201,
      body: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          type: 'size',
          value: 'XL',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        },
        message: 'new variant created successfully'
      }
    },
    error: {
      status: 400,
      body: {
        success: false,
        message: 'Variant value already exists'
      }
    }
  },
  examples: [
    {
      name: 'Create size variant',
      body: {
        type: 'size',
        value: 'Medium'
      },
      description: 'Create a new size variant'
    },
    {
      name: 'Create color variant',
      body: {
        type: 'color',
        value: 'Blue'
      },
      description: 'Create a new color variant'
    },
    {
      name: 'Create with special characters',
      body: {
        type: 'size',
        value: '2XL'
      },
      description: 'Create a variant with numbers'
    }
  ]
};

/**
 * @route PATCH /api/variants/:id
 * @description Update an existing variant
 * @access Private - Admin and SuperAdmin only
 * @param {string} id - Variant ID (MongoDB ObjectId)
 * @body {string} type - Variant type (size or color)
 * @body {string} value - Variant value (unique, 1-50 chars)
 */
export const updateVariantDocs = {
  endpoint: '/:id',
  method: 'PATCH',
  summary: 'Update Variant',
  description: 'Update variant information. Type and value must be valid and unique.',
  access: 'Admin, SuperAdmin',
  params: {
    id: {
      type: 'string',
      required: true,
      pattern: '^[0-9a-fA-F]{24}$',
      example: '507f1f77bcf86cd799439011'
    }
  },
  body: {
    type: {
      type: 'string',
      required: false,
      enum: ['size', 'color'],
      example: 'color',
      description: 'Variant type'
    },
    value: {
      type: 'string',
      required: false,
      minLength: 1,
      maxLength: 50,
      example: 'Navy Blue',
      description: 'Variant value (must be unique)'
    }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          type: 'color',
          value: 'Navy Blue',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        },
        message: 'variant updated successfully'
      }
    },
    error: {
      status: 404,
      body: {
        success: false,
        message: 'Variant not found'
      }
    }
  },
  examples: [
    {
      name: 'Update value only',
      body: {
        value: 'Extra Large'
      },
      description: 'Only update the variant value'
    },
    {
      name: 'Update type only',
      body: {
        type: 'color'
      },
      description: 'Change variant type from size to color'
    },
    {
      name: 'Update all fields',
      body: {
        type: 'size',
        value: '3XL'
      },
      description: 'Update both type and value'
    }
  ]
};

/**
 * @route DELETE /api/variants/:id
 * @description Delete a variant
 * @access Private - Admin and SuperAdmin only
 * @param {string} id - Variant ID (MongoDB ObjectId)
 * @throws {400} - Variant is used in products
 * @throws {404} - Variant not found
 */
export const deleteVariantDocs = {
  endpoint: '/:id',
  method: 'DELETE',
  summary: 'Delete Variant',
  description: 'Delete a variant. Variant cannot be deleted if it is used in any product.',
  access: 'Admin, SuperAdmin',
  params: {
    id: {
      type: 'string',
      required: true,
      pattern: '^[0-9a-fA-F]{24}$',
      example: '507f1f77bcf86cd799439011',
      description: 'MongoDB ObjectId of the variant'
    }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        message: 'variant removed successfully'
      }
    },
    error: {
      status: 400,
      body: {
        success: false,
        message: 'this variant is used in some product'
      }
    },
    notFound: {
      status: 404,
      body: {
        success: false,
        message: 'Variant not found'
      }
    }
  }
};

// ==================== QUICK REFERENCE ====================

export const variantEndpoints = {
  getAllVariants: {
    method: 'GET',
    path: '/api/variants/',
    access: 'Public',
    description: 'Get all variants with filtering, sorting, and pagination'
  },
  getSingleVariant: {
    method: 'GET',
    path: '/api/variants/:id',
    access: 'Public',
    description: 'Get specific variant by ID'
  },
  createVariant: {
    method: 'POST',
    path: '/api/variants/',
    access: 'Admin, SuperAdmin',
    description: 'Create a new variant'
  },
  updateVariant: {
    method: 'PATCH',
    path: '/api/variants/:id',
    access: 'Admin, SuperAdmin',
    description: 'Update variant information'
  },
  deleteVariant: {
    method: 'DELETE',
    path: '/api/variants/:id',
    access: 'Admin, SuperAdmin',
    description: 'Delete a variant (if not used in products)'
  }
};

// ==================== PREDEFINED VARIANT EXAMPLES ====================

export const variantExamples = {
  sizes: {
    description: 'Common size variants',
    values: [
      { type: 'size', value: 'XS' },
      { type: 'size', value: 'S' },
      { type: 'size', value: 'M' },
      { type: 'size', value: 'L' },
      { type: 'size', value: 'XL' },
      { type: 'size', value: 'XXL' },
      { type: 'size', value: '3XL' },
      { type: 'size', value: '4XL' },
      { type: 'size', value: '5XL' }
    ]
  },
  shoeSizes: {
    description: 'Shoe size variants',
    values: [
      { type: 'size', value: '36' },
      { type: 'size', value: '37' },
      { type: 'size', value: '38' },
      { type: 'size', value: '39' },
      { type: 'size', value: '40' },
      { type: 'size', value: '41' },
      { type: 'size', value: '42' },
      { type: 'size', value: '43' },
      { type: 'size', value: '44' },
      { type: 'size', value: '45' },
      { type: 'size', value: '46' }
    ]
  },
  colors: {
    description: 'Common color variants',
    values: [
      { type: 'color', value: 'Red' },
      { type: 'color', value: 'Blue' },
      { type: 'color', value: 'Green' },
      { type: 'color', value: 'Yellow' },
      { type: 'color', value: 'Black' },
      { type: 'color', value: 'White' },
      { type: 'color', value: 'Gray' },
      { type: 'color', value: 'Navy' },
      { type: 'color', value: 'Burgundy' },
      { type: 'color', value: 'Teal' },
      { type: 'color', value: 'Olive' },
      { type: 'color', value: 'Coral' }
    ]
  }
};

// ==================== VALIDATION RULES SUMMARY ====================

export const validationRules = {
  type: {
    enum: ['size', 'color'],
    required: true,
    description: 'Variant type must be either "size" or "color"',
    example: 'size'
  },
  value: {
    minLength: 1,
    maxLength: 50,
    pattern: '^[\\u0600-\\u06FF\\sa-zA-Z0-9\\-_.,# ]+$',
    description: 'Letters, numbers, spaces, hyphens, underscores, dots, commas, hashes, and spaces',
    example: 'Extra Large',
    required: true,
    unique: true
  },
  variantId: {
    format: 'MongoDB ObjectId',
    pattern: '^[0-9a-fA-F]{24}$',
    example: '507f1f77bcf86cd799439011'
  }
};

// ==================== PERMISSION MATRIX ====================

export const permissionMatrix = {
  endpoints: {
    'GET /api/variants/': {
      public: true,
      user: true,
      admin: true,
      superAdmin: true
    },
    'GET /api/variants/:id': {
      public: true,
      user: true,
      admin: true,
      superAdmin: true
    },
    'POST /api/variants/': {
      public: false,
      user: false,
      admin: true,
      superAdmin: true
    },
    'PATCH /api/variants/:id': {
      public: false,
      user: false,
      admin: true,
      superAdmin: true
    },
    'DELETE /api/variants/:id': {
      public: false,
      user: false,
      admin: true,
      superAdmin: true
    }
  },
  fields: {
    type: {
      public: 'read',
      user: 'read',
      admin: 'read_write',
      superAdmin: 'read_write'
    },
    value: {
      public: 'read',
      user: 'read',
      admin: 'read_write',
      superAdmin: 'read_write'
    }
  }
};

// ==================== ERROR CODES ====================

export const variantErrorCodes = {
  '400': {
    code: 'BAD_REQUEST',
    description: 'Invalid input format or validation failed',
    examples: [
      'Variant value already exists',
      'Variant type must be either "size" or "color"',
      'Variant with type "color" and value "Red" already exists',
      'Variant value must be between 1 to 50 characters',
      'This variant is used in some products and cannot be deleted',
      'Invalid variant ID format'
    ]
  },
  '401': {
    code: 'UNAUTHORIZED',
    description: 'Authentication required',
    example: 'No token provided'
  },
  '403': {
    code: 'FORBIDDEN',
    description: 'Insufficient permissions',
    example: 'You do not have permission to perform this action'
  },
  '404': {
    code: 'NOT_FOUND',
    description: 'Variant not found',
    example: 'Variant not found'
  },
  '409': {
    code: 'CONFLICT',
    description: 'Duplicate entry',
    example: 'Variant value already exists'
  },
  '500': {
    code: 'INTERNAL_SERVER_ERROR',
    description: 'Server error',
    example: 'Database connection error'
  }
};

// ==================== RESPONSE TEMPLATES ====================

export const responseTemplates = {
  getAllSuccess: {
    success: true,
    count: 10,
    data: [
      {
        _id: '507f1f77bcf86cd799439011',
        type: 'color',
        value: 'Red',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        _id: '507f1f77bcf86cd799439022',
        type: 'size',
        value: 'Large',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    ]
  },
  getSingleSuccess: {
    success: true,
    data: {
      _id: '507f1f77bcf86cd799439011',
      type: 'color',
      value: 'Red',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  },
  createSuccess: {
    success: true,
    data: {
      _id: '507f1f77bcf86cd799439011',
      type: 'size',
      value: 'XL',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    message: 'new variant created successfully'
  },
  updateSuccess: {
    success: true,
    data: {
      _id: '507f1f77bcf86cd799439011',
      type: 'color',
      value: 'Navy Blue',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    message: 'variant updated successfully'
  },
  deleteSuccess: {
    success: true,
    message: 'variant removed successfully'
  },
  error: {
    success: false,
    message: 'Error message'
  }
};

// ==================== USE CASES ====================

export const variantUseCases = {
  productAttributes: {
    description: 'Product variations',
    examples: [
      'T-shirt sizes: S, M, L, XL',
      'Shoe sizes: 38, 39, 40, 41',
      'Colors: Red, Blue, Green, Black'
    ]
  },
  inventoryManagement: {
    description: 'Track stock by variant',
    examples: [
      '5 units of size M in red color',
      '3 units of size L in blue color'
    ]
  },
  pricing: {
    description: 'Different prices by variant',
    examples: [
      'Size XL costs more than size S',
      'Special color variants have premium pricing'
    ]
  },
  filtering: {
    description: 'Product filtering by attributes',
    examples: [
      'Filter products by available sizes',
      'Filter products by color options'
    ]
  }
};

// ==================== DEFAULT EXPORT ====================

export default {
  variantSchemas,
  getAllVariantsDocs,
  getSingleVariantDocs,
  createVariantDocs,
  updateVariantDocs,
  deleteVariantDocs,
  variantEndpoints,
  variantExamples,
  validationRules,
  permissionMatrix,
  variantErrorCodes,
  responseTemplates,
  variantUseCases
};