/**
 * Brand Management API Documentation
 * Base URL: /api/brands
 * All write operations require admin authentication
 */

// ==================== COMMON SCHEMAS ====================

export const brandSchemas = {
  Brand: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        example: '507f1f77bcf86cd799439011',
        description: 'MongoDB ObjectId'
      },
      title: {
        type: 'string',
        minLength: 2,
        maxLength: 50,
        example: 'Apple',
        description: 'Brand title (unique)'
      },
      image: {
        type: 'string',
        example: 'uploads/brands/apple-logo.png',
        description: 'Brand image path'
      },
      isPublished: {
        type: 'boolean',
        default: true,
        example: true,
        description: 'Brand visibility status'
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

  BrandResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      count: {
        type: 'number',
        example: 10,
        description: 'Total number of brands (for getAll)'
      },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Brand' }
      }
    }
  },

  SingleBrandResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      data: {
        $ref: '#/components/schemas/Brand'
      }
    }
  },

  CreateBrandRequest: {
    type: 'object',
    required: ['title'],
    properties: {
      title: {
        type: 'string',
        minLength: 2,
        maxLength: 50,
        example: 'Samsung',
        description: 'Brand title (must be unique)'
      },
      image: {
        type: 'string',
        example: 'uploads/brands/samsung-logo.png',
        description: 'Brand image path'
      },
      isPublished: {
        type: 'boolean',
        default: true,
        example: true,
        description: 'Brand visibility'
      }
    }
  },

  UpdateBrandRequest: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        minLength: 2,
        maxLength: 50,
        example: 'Samsung Electronics',
        description: 'Brand title (must be unique)'
      },
      image: {
        type: 'string',
        example: 'uploads/brands/samsung-new-logo.png',
        description: 'Brand image path'
      },
      isPublished: {
        type: 'boolean',
        default: true,
        example: false,
        description: 'Brand visibility'
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
        example: 'Brand title already taken'
      }
    }
  }
};

// ==================== ENDPOINT DOCUMENTATION ====================

/**
 * @route GET /api/brands/
 * @description Get all brands with filtering, sorting, and pagination
 * @access Public (published brands) / Admin (all brands)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10, max: 100)
 * @query {string} sort - Sort field with prefix (- for desc, + for asc)
 * @query {string} fields - Comma-separated fields to include/exclude
 * @query {string} q - Search query (searches title)
 * @query {boolean} isPublished - Filter by publication status
 */
export const getAllBrandsDocs = {
  endpoint: '/',
  method: 'GET',
  summary: 'Get All Brands',
  description: 'Retrieve a list of all brands. Public users only see published brands. Admin sees all brands.',
  access: 'Public (published only), Admin, SuperAdmin (all)',
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
      example: 'title,image',
      description: 'Comma-separated fields to include or exclude (prefix with -)'
    },
    q: {
      type: 'string',
      required: false,
      example: 'apple',
      description: 'Search query for brand title'
    },
    isPublished: {
      type: 'boolean',
      required: false,
      example: true,
      description: 'Filter by publication status (admin only)'
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
            title: 'Apple',
            image: 'uploads/brands/apple-logo.png',
            isPublished: true,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          }
        ]
      }
    }
  },
  examples: [
    {
      name: 'Get published brands',
      query: '?isPublished=true&sort=title',
      description: 'Get all published brands sorted by title'
    },
    {
      name: 'Search brands',
      query: '?q=samsung&fields=title,image',
      description: 'Search for brands containing "samsung" and return only title and image'
    },
    {
      name: 'Pagination',
      query: '?page=2&limit=10',
      description: 'Get second page with 10 items per page'
    }
  ]
};

/**
 * @route GET /api/brands/:id
 * @description Get a single brand by ID
 * @access Public (published only) / Admin (all)
 * @param {string} id - Brand ID (MongoDB ObjectId)
 */
export const getSingleBrandDocs = {
  endpoint: '/:id',
  method: 'GET',
  summary: 'Get Single Brand',
  description: 'Retrieve detailed information about a specific brand. Public users can only view published brands.',
  access: 'Public (published only), Admin, SuperAdmin (all)',
  params: {
    id: {
      type: 'string',
      required: true,
      pattern: '^[0-9a-fA-F]{24}$',
      example: '507f1f77bcf86cd799439011',
      description: 'MongoDB ObjectId of the brand'
    }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          title: 'Apple',
          image: 'uploads/brands/apple-logo.png',
          isPublished: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      }
    },
    error: {
      status: 404,
      body: {
        success: false,
        message: 'Brand not found'
      }
    }
  }
};

/**
 * @route POST /api/brands/
 * @description Create a new brand
 * @access Private - Admin and SuperAdmin only
 * @body {string} title - Brand title (required, unique, 2-50 chars)
 * @body {string} image - Brand image path (optional)
 * @body {boolean} isPublished - Brand visibility (optional, default: true)
 */
export const createBrandDocs = {
  endpoint: '/',
  method: 'POST',
  summary: 'Create New Brand',
  description: 'Create a new brand. Title must be unique.',
  access: 'Admin, SuperAdmin',
  body: {
    title: {
      type: 'string',
      required: true,
      minLength: 2,
      maxLength: 50,
      example: 'Samsung',
      description: 'Brand title (must be unique)'
    },
    image: {
      type: 'string',
      required: false,
      example: 'uploads/brands/samsung-logo.png',
      description: 'Brand image path'
    },
    isPublished: {
      type: 'boolean',
      required: false,
      default: true,
      example: true,
      description: 'Brand visibility'
    }
  },
  responses: {
    success: {
      status: 201,
      body: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          title: 'Samsung',
          image: 'uploads/brands/samsung-logo.png',
          isPublished: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        },
        message: 'brand Successfully created'
      }
    },
    error: {
      status: 400,
      body: {
        success: false,
        message: 'Brand title already taken'
      }
    }
  },
  examples: [
    {
      name: 'Create with title only',
      body: {
        title: 'Xiaomi'
      },
      description: 'Create a brand with only title (will be published by default)'
    },
    {
      name: 'Create with all fields',
      body: {
        title: 'OnePlus',
        image: 'uploads/brands/oneplus-logo.png',
        isPublished: true
      },
      description: 'Create a brand with title, image, and publication status'
    }
  ]
};

/**
 * @route PATCH /api/brands/:id
 * @description Update an existing brand
 * @access Private - Admin and SuperAdmin only
 * @param {string} id - Brand ID (MongoDB ObjectId)
 * @body {string} title - Brand title (2-50 chars, unique)
 * @body {string} image - Brand image path
 * @body {boolean} isPublished - Brand visibility
 */
export const updateBrandDocs = {
  endpoint: '/:id',
  method: 'PATCH',
  summary: 'Update Brand',
  description: 'Update brand information. Title must be unique.',
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
    title: {
      type: 'string',
      required: false,
      minLength: 2,
      maxLength: 50,
      example: 'Samsung Electronics',
      description: 'Brand title (must be unique)'
    },
    image: {
      type: 'string',
      required: false,
      example: 'uploads/brands/samsung-new-logo.png',
      description: 'Brand image path'
    },
    isPublished: {
      type: 'boolean',
      required: false,
      example: false,
      description: 'Brand visibility'
    }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          title: 'Samsung Electronics',
          image: 'uploads/brands/samsung-new-logo.png',
          isPublished: false,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        },
        message: 'brand Successfully updated'
      }
    },
    error: {
      status: 400,
      body: {
        success: false,
        message: 'Brand title already taken'
      }
    }
  },
  examples: [
    {
      name: 'Update title',
      body: {
        title: 'Samsung Electronics'
      },
      description: 'Only update the brand title'
    },
    {
      name: 'Unpublish brand',
      body: {
        isPublished: false
      },
      description: 'Hide brand from public view'
    },
    {
      name: 'Update all fields',
      body: {
        title: 'Samsung Electronics Co.',
        image: 'uploads/brands/samsung-co-logo.png',
        isPublished: true
      },
      description: 'Update all brand fields'
    }
  ]
};

/**
 * @route DELETE /api/brands/:id
 * @description Delete a brand
 * @access Private - Admin and SuperAdmin only
 * @param {string} id - Brand ID (MongoDB ObjectId)
 * @throws {400} - Brand has associated products
 * @throws {404} - Brand not found
 */
export const deleteBrandDocs = {
  endpoint: '/:id',
  method: 'DELETE',
  summary: 'Delete Brand',
  description: 'Delete a brand. Brand cannot be deleted if it is used in any product.',
  access: 'Admin, SuperAdmin',
  params: {
    id: {
      type: 'string',
      required: true,
      pattern: '^[0-9a-fA-F]{24}$',
      example: '507f1f77bcf86cd799439011',
      description: 'MongoDB ObjectId of the brand'
    }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        message: 'brand Successfully deleted'
      }
    },
    error: {
      status: 400,
      body: {
        success: false,
        message: 'this brand used in some product'
      }
    },
    notFound: {
      status: 404,
      body: {
        success: false,
        message: 'Brand not found'
      }
    }
  }
};

// ==================== QUICK REFERENCE ====================

export const brandEndpoints = {
  getAllBrands: {
    method: 'GET',
    path: '/api/brands/',
    access: 'Public (published), Admin (all)',
    description: 'Get all brands with filtering, sorting, and pagination'
  },
  getSingleBrand: {
    method: 'GET',
    path: '/api/brands/:id',
    access: 'Public (published), Admin (all)',
    description: 'Get specific brand by ID'
  },
  createBrand: {
    method: 'POST',
    path: '/api/brands/',
    access: 'Admin, SuperAdmin',
    description: 'Create a new brand'
  },
  updateBrand: {
    method: 'PATCH',
    path: '/api/brands/:id',
    access: 'Admin, SuperAdmin',
    description: 'Update brand information'
  },
  deleteBrand: {
    method: 'DELETE',
    path: '/api/brands/:id',
    access: 'Admin, SuperAdmin',
    description: 'Delete a brand (cannot delete if used in products)'
  }
};

// ==================== VALIDATION RULES SUMMARY ====================

export const validationRules = {
  title: {
    minLength: 2,
    maxLength: 50,
    pattern: '^[\\u0600-\\u06FF\\sa-zA-Z0-9\\-_.& ]+$',
    description: 'Letters, numbers, spaces, hyphens, underscores, dots, ampersands, and commas',
    example: 'Apple Inc.',
    required: true,
    unique: true
  },
  image: {
    maxLength: 500,
    pattern: '^[a-zA-Z0-9\\-_./]+$',
    description: 'Valid file path format',
    example: 'uploads/brands/logo.png'
  },
  isPublished: {
    type: 'boolean',
    default: true,
    description: 'Brand visibility status'
  },
  brandId: {
    format: 'MongoDB ObjectId',
    pattern: '^[0-9a-fA-F]{24}$',
    example: '507f1f77bcf86cd799439011'
  }
};

// ==================== PERMISSION MATRIX ====================

export const permissionMatrix = {
  endpoints: {
    'GET /api/brands/': {
      public: 'published_only',
      user: 'published_only',
      admin: true,
      superAdmin: true
    },
    'GET /api/brands/:id': {
      public: 'published_only',
      user: 'published_only',
      admin: true,
      superAdmin: true
    },
    'POST /api/brands/': {
      public: false,
      user: false,
      admin: true,
      superAdmin: true
    },
    'PATCH /api/brands/:id': {
      public: false,
      user: false,
      admin: true,
      superAdmin: true
    },
    'DELETE /api/brands/:id': {
      public: false,
      user: false,
      admin: true,
      superAdmin: true
    }
  },
  fields: {
    title: {
      public: 'read',
      user: 'read',
      admin: 'read_write',
      superAdmin: 'read_write'
    },
    image: {
      public: 'read',
      user: 'read',
      admin: 'read_write',
      superAdmin: 'read_write'
    },
    isPublished: {
      public: 'read',
      user: 'read',
      admin: 'read_write',
      superAdmin: 'read_write'
    }
  }
};

// ==================== ERROR CODES ====================

export const brandErrorCodes = {
  '400': {
    code: 'BAD_REQUEST',
    description: 'Invalid input format or validation failed',
    examples: [
      'Brand title already taken',
      'Brand title must be between 2 to 50 characters',
      'This brand is used in some product and cannot be deleted',
      'Invalid brand ID format'
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
    description: 'Brand not found',
    example: 'Brand not found'
  },
  '409': {
    code: 'CONFLICT',
    description: 'Duplicate entry',
    example: 'Brand title already taken'
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
        title: 'Apple',
        image: 'uploads/brands/apple-logo.png',
        isPublished: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    ]
  },
  getSingleSuccess: {
    success: true,
    data: {
      _id: '507f1f77bcf86cd799439011',
      title: 'Apple',
      image: 'uploads/brands/apple-logo.png',
      isPublished: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  },
  createSuccess: {
    success: true,
    data: {
      _id: '507f1f77bcf86cd799439011',
      title: 'Samsung',
      image: 'uploads/brands/samsung-logo.png',
      isPublished: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    message: 'brand Successfully created'
  },
  updateSuccess: {
    success: true,
    data: {
      _id: '507f1f77bcf86cd799439011',
      title: 'Samsung Electronics',
      image: 'uploads/brands/samsung-new-logo.png',
      isPublished: false,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    message: 'brand Successfully updated'
  },
  deleteSuccess: {
    success: true,
    message: 'brand Successfully deleted'
  },
  error: {
    success: false,
    message: 'Error message'
  }
};

// ==================== DEFAULT EXPORT ====================

export default {
  brandSchemas,
  getAllBrandsDocs,
  getSingleBrandDocs,
  createBrandDocs,
  updateBrandDocs,
  deleteBrandDocs,
  brandEndpoints,
  validationRules,
  permissionMatrix,
  brandErrorCodes,
  responseTemplates
};