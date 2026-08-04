/**
 * Slider Management API Documentation
 * Base URL: /api/sliders
 * All write operations require admin authentication
 */

// ==================== COMMON SCHEMAS ====================

export const sliderSchemas = {
  Slider: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        example: '507f1f77bcf86cd799439011',
        description: 'MongoDB ObjectId'
      },
      title: {
        type: 'string',
        maxLength: 100,
        example: 'Summer Sale 2024',
        description: 'Slider title (optional)',
        nullable: true
      },
      image: {
        type: 'string',
        required: true,
        example: 'uploads/sliders/summer-sale.jpg',
        description: 'Slider image path'
      },
      isPublished: {
        type: 'boolean',
        default: true,
        example: true,
        description: 'Slider visibility status'
      },
      path: {
        type: 'string',
        default: '/',
        example: '/products',
        description: 'Internal navigation path'
      },
      href: {
        type: 'string',
        example: 'https://example.com/summer-sale',
        description: 'External link URL'
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

  SliderResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      count: {
        type: 'number',
        example: 10,
        description: 'Total number of sliders (for getAll)'
      },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Slider' }
      }
    }
  },

  SingleSliderResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      data: {
        $ref: '#/components/schemas/Slider'
      }
    }
  },

  CreateSliderRequest: {
    type: 'object',
    required: ['image'],
    properties: {
      title: {
        type: 'string',
        maxLength: 100,
        example: 'Winter Collection',
        description: 'Slider title (optional)'
      },
      image: {
        type: 'string',
        required: true,
        example: 'uploads/sliders/winter-collection.jpg',
        description: 'Slider image path'
      },
      isPublished: {
        type: 'boolean',
        default: true,
        example: true,
        description: 'Slider visibility'
      },
      path: {
        type: 'string',
        default: '/',
        example: '/products/winter',
        description: 'Internal navigation path'
      },
      href: {
        type: 'string',
        example: 'https://example.com/winter-collection',
        description: 'External URL'
      }
    }
  },

  UpdateSliderRequest: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        maxLength: 100,
        example: 'Winter Collection 2024',
        description: 'Slider title'
      },
      image: {
        type: 'string',
        example: 'uploads/sliders/winter-collection-2024.jpg',
        description: 'Slider image path'
      },
      isPublished: {
        type: 'boolean',
        example: false,
        description: 'Slider visibility'
      },
      path: {
        type: 'string',
        example: '/products/winter-2024',
        description: 'Internal navigation path'
      },
      href: {
        type: 'string',
        example: 'https://example.com/winter-collection-2024',
        description: 'External URL'
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
        example: 'Slider not found'
      }
    }
  }
};

// ==================== ENDPOINT DOCUMENTATION ====================

/**
 * @route GET /api/sliders/
 * @description Get all sliders with filtering, sorting, and pagination
 * @access Public (published sliders) / Admin (all sliders)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10, max: 50)
 * @query {string} sort - Sort field with prefix (- for desc, + for asc)
 * @query {string} fields - Comma-separated fields to include/exclude
 * @query {string} q - Search query (searches title)
 * @query {boolean} isPublished - Filter by publication status
 */
export const getAllSlidersDocs = {
  endpoint: '/',
  method: 'GET',
  summary: 'Get All Sliders',
  description: 'Retrieve a list of all sliders. Public users only see published sliders. Admin sees all sliders.',
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
      max: 50,
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
      example: 'title,image,path',
      description: 'Comma-separated fields to include or exclude (prefix with -)'
    },
    q: {
      type: 'string',
      required: false,
      example: 'sale',
      description: 'Search query for slider title'
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
            title: 'Summer Sale',
            image: 'uploads/sliders/summer-sale.jpg',
            isPublished: true,
            path: '/products/summer-sale',
            href: null,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          }
        ]
      }
    }
  },
  examples: [
    {
      name: 'Get published sliders',
      query: '?isPublished=true&sort=-createdAt',
      description: 'Get all published sliders sorted by newest first'
    },
    {
      name: 'Search sliders',
      query: '?q=sale&fields=title,image',
      description: 'Search for sliders containing "sale" and return only title and image'
    },
    {
      name: 'Pagination',
      query: '?page=2&limit=5',
      description: 'Get second page with 5 items per page'
    }
  ]
};

/**
 * @route GET /api/sliders/:id
 * @description Get a single slider by ID
 * @access Public (published only) / Admin (all)
 * @param {string} id - Slider ID (MongoDB ObjectId)
 */
export const getSingleSliderDocs = {
  endpoint: '/:id',
  method: 'GET',
  summary: 'Get Single Slider',
  description: 'Retrieve detailed information about a specific slider. Public users can only view published sliders.',
  access: 'Public (published only), Admin, SuperAdmin (all)',
  params: {
    id: {
      type: 'string',
      required: true,
      pattern: '^[0-9a-fA-F]{24}$',
      example: '507f1f77bcf86cd799439011',
      description: 'MongoDB ObjectId of the slider'
    }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          title: 'Summer Sale',
          image: 'uploads/sliders/summer-sale.jpg',
          isPublished: true,
          path: '/products/summer-sale',
          href: 'https://example.com/summer-sale',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      }
    },
    error: {
      status: 404,
      body: {
        success: false,
        message: 'Slider not found'
      }
    }
  }
};

/**
 * @route POST /api/sliders/
 * @description Create a new slider
 * @access Private - Admin and SuperAdmin only
 * @body {string} image - Slider image path (required)
 * @body {string} title - Slider title (optional, max 100 chars)
 * @body {boolean} isPublished - Slider visibility (optional, default: true)
 * @body {string} path - Internal navigation path (optional, default: /)
 * @body {string} href - External URL (optional)
 */
export const createSliderDocs = {
  endpoint: '/',
  method: 'POST',
  summary: 'Create New Slider',
  description: 'Create a new slider with image and optional navigation links.',
  access: 'Admin, SuperAdmin',
  body: {
    image: {
      type: 'string',
      required: true,
      example: 'uploads/sliders/banner.jpg',
      description: 'Slider image path'
    },
    title: {
      type: 'string',
      required: false,
      maxLength: 100,
      example: 'Summer Sale 2024',
      description: 'Slider title (optional)'
    },
    isPublished: {
      type: 'boolean',
      required: false,
      default: true,
      example: true,
      description: 'Slider visibility'
    },
    path: {
      type: 'string',
      required: false,
      default: '/',
      example: '/products/summer-sale',
      description: 'Internal navigation path (starts with /)'
    },
    href: {
      type: 'string',
      required: false,
      example: 'https://example.com/summer-sale',
      description: 'External URL'
    }
  },
  responses: {
    success: {
      status: 201,
      body: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          title: 'Summer Sale 2024',
          image: 'uploads/sliders/banner.jpg',
          isPublished: true,
          path: '/products/summer-sale',
          href: 'https://example.com/summer-sale',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        },
        message: 'new slider created successfully'
      }
    },
    error: {
      status: 400,
      body: {
        success: false,
        message: 'Image is required'
      }
    }
  },
  examples: [
    {
      name: 'Create with only image',
      body: {
        image: 'uploads/sliders/banner.jpg'
      },
      description: 'Create a slider with only image (will be published by default)'
    },
    {
      name: 'Create with all fields',
      body: {
        title: 'Winter Collection',
        image: 'uploads/sliders/winter.jpg',
        isPublished: true,
        path: '/products/winter',
        href: 'https://example.com/winter-collection'
      },
      description: 'Create a slider with title, image, and navigation links'
    },
    {
      name: 'Create with external link',
      body: {
        image: 'uploads/sliders/promo.jpg',
        href: 'https://example.com/promo',
        isPublished: true
      },
      description: 'Create a slider that links to an external website'
    }
  ]
};

/**
 * @route PATCH /api/sliders/:id
 * @description Update an existing slider
 * @access Private - Admin and SuperAdmin only
 * @param {string} id - Slider ID (MongoDB ObjectId)
 * @body {string} image - Slider image path
 * @body {string} title - Slider title (max 100 chars)
 * @body {boolean} isPublished - Slider visibility
 * @body {string} path - Internal navigation path
 * @body {string} href - External URL
 */
export const updateSliderDocs = {
  endpoint: '/:id',
  method: 'PATCH',
  summary: 'Update Slider',
  description: 'Update slider information. Image will be deleted from server if changed.',
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
    image: {
      type: 'string',
      required: false,
      example: 'uploads/sliders/banner-new.jpg',
      description: 'New slider image path (old image will be deleted)'
    },
    title: {
      type: 'string',
      required: false,
      maxLength: 100,
      example: 'Summer Sale 2024',
      description: 'Slider title'
    },
    isPublished: {
      type: 'boolean',
      required: false,
      example: false,
      description: 'Slider visibility'
    },
    path: {
      type: 'string',
      required: false,
      example: '/products/summer-sale-2024',
      description: 'Internal navigation path'
    },
    href: {
      type: 'string',
      required: false,
      example: 'https://example.com/summer-sale-2024',
      description: 'External URL'
    }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          title: 'Summer Sale 2024',
          image: 'uploads/sliders/banner-new.jpg',
          isPublished: false,
          path: '/products/summer-sale-2024',
          href: 'https://example.com/summer-sale-2024',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        },
        message: 'slider updated successfully'
      }
    },
    error: {
      status: 404,
      body: {
        success: false,
        message: 'Slider not found'
      }
    }
  },
  examples: [
    {
      name: 'Update title only',
      body: {
        title: 'Winter Sale 2024'
      },
      description: 'Only update the slider title'
    },
    {
      name: 'Unpublish slider',
      body: {
        isPublished: false
      },
      description: 'Hide slider from public view'
    },
    {
      name: 'Update image and link',
      body: {
        image: 'uploads/sliders/new-banner.jpg',
        href: 'https://example.com/new-promo'
      },
      description: 'Update both image and external link (old image will be deleted)'
    },
    {
      name: 'Update all fields',
      body: {
        title: 'Spring Collection 2024',
        image: 'uploads/sliders/spring.jpg',
        isPublished: true,
        path: '/products/spring',
        href: 'https://example.com/spring-collection'
      },
      description: 'Update all slider fields'
    }
  ]
};

/**
 * @route DELETE /api/sliders/:id
 * @description Delete a slider
 * @access Private - Admin and SuperAdmin only
 * @param {string} id - Slider ID (MongoDB ObjectId)
 * @throws {404} - Slider not found
 */
export const deleteSliderDocs = {
  endpoint: '/:id',
  method: 'DELETE',
  summary: 'Delete Slider',
  description: 'Delete a slider. Image file will be removed from server.',
  access: 'Admin, SuperAdmin',
  params: {
    id: {
      type: 'string',
      required: true,
      pattern: '^[0-9a-fA-F]{24}$',
      example: '507f1f77bcf86cd799439011',
      description: 'MongoDB ObjectId of the slider'
    }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        message: 'slider removed successfully'
      }
    },
    error: {
      status: 404,
      body: {
        success: false,
        message: 'Slider not found'
      }
    }
  }
};

// ==================== QUICK REFERENCE ====================

export const sliderEndpoints = {
  getAllSliders: {
    method: 'GET',
    path: '/api/sliders/',
    access: 'Public (published), Admin (all)',
    description: 'Get all sliders with filtering, sorting, and pagination'
  },
  getSingleSlider: {
    method: 'GET',
    path: '/api/sliders/:id',
    access: 'Public (published), Admin (all)',
    description: 'Get specific slider by ID'
  },
  createSlider: {
    method: 'POST',
    path: '/api/sliders/',
    access: 'Admin, SuperAdmin',
    description: 'Create a new slider'
  },
  updateSlider: {
    method: 'PATCH',
    path: '/api/sliders/:id',
    access: 'Admin, SuperAdmin',
    description: 'Update slider information'
  },
  deleteSlider: {
    method: 'DELETE',
    path: '/api/sliders/:id',
    access: 'Admin, SuperAdmin',
    description: 'Delete a slider'
  }
};

// ==================== VALIDATION RULES SUMMARY ====================

export const validationRules = {
  image: {
    required: true,
    maxLength: 500,
    pattern: '^[a-zA-Z0-9\\-_./]+$',
    description: 'Valid file path format',
    example: 'uploads/sliders/banner.jpg'
  },
  title: {
    maxLength: 100,
    pattern: '^[\\u0600-\\u06FF\\sa-zA-Z0-9\\-_.!? ]+$',
    description: 'Letters, numbers, spaces, hyphens, underscores, dots, exclamation marks, and question marks',
    example: 'Summer Sale 2024!',
    required: false
  },
  path: {
    maxLength: 200,
    pattern: '^[a-zA-Z0-9\\-_/]+$',
    description: 'Starts with /, contains letters, numbers, hyphens, underscores, and slashes',
    example: '/products/summer-sale',
    default: '/'
  },
  href: {
    maxLength: 500,
    description: 'Valid URL or path',
    example: 'https://example.com/summer-sale',
    required: false
  },
  isPublished: {
    type: 'boolean',
    default: true,
    description: 'Slider visibility status'
  },
  sliderId: {
    format: 'MongoDB ObjectId',
    pattern: '^[0-9a-fA-F]{24}$',
    example: '507f1f77bcf86cd799439011'
  }
};

// ==================== PERMISSION MATRIX ====================

export const permissionMatrix = {
  endpoints: {
    'GET /api/sliders/': {
      public: 'published_only',
      user: 'published_only',
      admin: true,
      superAdmin: true
    },
    'GET /api/sliders/:id': {
      public: 'published_only',
      user: 'published_only',
      admin: true,
      superAdmin: true
    },
    'POST /api/sliders/': {
      public: false,
      user: false,
      admin: true,
      superAdmin: true
    },
    'PATCH /api/sliders/:id': {
      public: false,
      user: false,
      admin: true,
      superAdmin: true
    },
    'DELETE /api/sliders/:id': {
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
    },
    path: {
      public: 'read',
      user: 'read',
      admin: 'read_write',
      superAdmin: 'read_write'
    },
    href: {
      public: 'read',
      user: 'read',
      admin: 'read_write',
      superAdmin: 'read_write'
    }
  }
};

// ==================== ERROR CODES ====================

export const sliderErrorCodes = {
  '400': {
    code: 'BAD_REQUEST',
    description: 'Invalid input format or validation failed',
    examples: [
      'Image is required',
      'Image path contains invalid characters',
      'Title cannot exceed 100 characters',
      'Path must start with "/"',
      'Invalid URL format',
      'Invalid slider ID format'
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
    description: 'Slider not found',
    example: 'Slider not found'
  },
  '413': {
    code: 'PAYLOAD_TOO_LARGE',
    description: 'Image file too large',
    example: 'Image size cannot exceed 10MB'
  },
  '415': {
    code: 'UNSUPPORTED_MEDIA_TYPE',
    description: 'Invalid image format',
    example: 'Image must be JPEG, PNG, WEBP, GIF, or SVG format'
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
        title: 'Summer Sale',
        image: 'uploads/sliders/summer-sale.jpg',
        isPublished: true,
        path: '/products/summer-sale',
        href: null,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    ]
  },
  getSingleSuccess: {
    success: true,
    data: {
      _id: '507f1f77bcf86cd799439011',
      title: 'Summer Sale',
      image: 'uploads/sliders/summer-sale.jpg',
      isPublished: true,
      path: '/products/summer-sale',
      href: 'https://example.com/summer-sale',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  },
  createSuccess: {
    success: true,
    data: {
      _id: '507f1f77bcf86cd799439011',
      title: 'Summer Sale 2024',
      image: 'uploads/sliders/banner.jpg',
      isPublished: true,
      path: '/products/summer-sale',
      href: 'https://example.com/summer-sale',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    message: 'new slider created successfully'
  },
  updateSuccess: {
    success: true,
    data: {
      _id: '507f1f77bcf86cd799439011',
      title: 'Summer Sale 2024',
      image: 'uploads/sliders/banner-new.jpg',
      isPublished: false,
      path: '/products/summer-sale-2024',
      href: 'https://example.com/summer-sale-2024',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    message: 'slider updated successfully'
  },
  deleteSuccess: {
    success: true,
    message: 'slider removed successfully'
  },
  error: {
    success: false,
    message: 'Error message'
  }
};

// ==================== SLIDER USE CASES ====================

export const sliderUseCases = {
  homePage: {
    description: 'Main homepage banners',
    example: 'Full-width hero banners for promotions, seasonal sales, or featured products'
  },
  categoryPage: {
    description: 'Category-specific banners',
    example: 'Category header banners for electronics, fashion, etc.'
  },
  promotional: {
    description: 'Promotional campaigns',
    example: 'Limited-time offers, holiday specials, flash sales'
  },
  navigation: {
    description: 'Navigation with images',
    example: 'Visual navigation to product categories or collections'
  }
};

// ==================== DEFAULT EXPORT ====================

export default {
  sliderSchemas,
  getAllSlidersDocs,
  getSingleSliderDocs,
  createSliderDocs,
  updateSliderDocs,
  deleteSliderDocs,
  sliderEndpoints,
  validationRules,
  permissionMatrix,
  sliderErrorCodes,
  responseTemplates,
  sliderUseCases
};