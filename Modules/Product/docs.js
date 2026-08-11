/**
 * Product Management API Documentation
 * Base URL: /api/products
 */

// ==================== COMMON SCHEMAS ====================

export const productSchemas = {
  Product: {
    type: 'object',
    properties: {
      _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
      brandId: { type: 'string', example: '507f1f77bcf86cd799439022' },
      categoryIds: { type: 'array', items: { type: 'string' }, example: ['507f1f77bcf86cd799439033'] },
      title: { type: 'string', example: 'Samsung Galaxy S24' },
      description: { type: 'string', example: 'Latest Samsung smartphone with AI features' },
      slug: { type: 'string', example: 'samsung-galaxy-s24' },
      images: { type: 'array', items: { type: 'string' }, example: ['uploads/products/image1.jpg'] },
      videos: { type: 'array', items: { type: 'string' }, example: ['uploads/products/video1.mp4'] },
      tags: { type: 'array', items: { type: 'string' }, example: ['smartphone', 'samsung'] },
      boughtCount: { type: 'number', default: 0 },
      ratingCount: { type: 'number', default: 0 },
      avgRating: { type: 'number', default: 0 },
      maxDiscountPercent: { type: 'number', default: 0 },
      productVariantIds: { type: 'array', items: { type: 'string' } },
      variantIds: { type: 'array', items: { type: 'string' } },
      defaultProductVariantId: { type: 'object' },
      minPrice: { type: 'number' },
      maxPrice: { type: 'number' },
      InStock: { type: 'boolean', default: true },
      information: { type: 'array', items: { type: 'object' } },
      isPublished: { type: 'boolean', default: true },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  },

  ProductResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      count: { type: 'number', example: 10 },
      data: { type: 'array', items: { $ref: '#/components/schemas/Product' } }
    }
  },

  SingleProductResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      data: { $ref: '#/components/schemas/Product' },
      isBought: { type: 'boolean', example: false },
      isFavorite: { type: 'boolean', example: false },
      isRated: { type: 'boolean', example: false }
    }
  },

  CreateProductRequest: {
    type: 'object',
    required: ['title', 'description'],
    properties: {
      title: { type: 'string', example: 'Samsung Galaxy S24' },
      description: { type: 'string', example: 'Latest Samsung smartphone' },
      brandId: { type: 'string', example: '507f1f77bcf86cd799439022' },
      categoryIds: { type: 'array', items: { type: 'string' } },
      images: { type: 'array', items: { type: 'string' } },
      videos: { type: 'array', items: { type: 'string' } },
      tags: { type: 'array', items: { type: 'string' } },
      productVariantIds: { type: 'array', items: { type: 'string' } },
      minPrice: { type: 'number', example: 1000 },
      maxPrice: { type: 'number', example: 1200 },
      maxDiscountPercent: { type: 'number', example: 10 },
      InStock: { type: 'boolean', example: true },
      isPublished: { type: 'boolean', example: true },
      information: { type: 'array', items: { type: 'object' } },
      defaultProductVariantId: { type: 'string' }
    }
  },

  ErrorResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      message: { type: 'string', example: 'Product not found' }
    }
  }
};

// ==================== ENDPOINT DOCUMENTATION ====================

/**
 * @route GET /api/products/
 * @description Get all products with filtering, sorting, and pagination
 * @access Public (published only) / Admin (all)
 */
export const getAllProductsDocs = {
  endpoint: '/',
  method: 'GET',
  summary: 'Get All Products',
  description: 'Retrieve all products. Public users see only published products. Admin sees all.',
  access: 'Public (published), Admin, SuperAdmin (all)',
  queryParams: {
    page: { type: 'number', default: 1, example: 2 },
    limit: { type: 'number', default: 10, max: 100, example: 20 },
    sort: { type: 'string', example: '-createdAt' },
    fields: { type: 'string', example: 'title,price,images' },
    q: { type: 'string', example: 'samsung' },
    isPublished: { type: 'boolean', example: true },
    minPrice: { type: 'number', example: 100 },
    maxPrice: { type: 'number', example: 500 },
    brandId: { type: 'string', example: '507f1f77bcf86cd799439022' },
    categoryId: { type: 'string', example: '507f1f77bcf86cd799439033' },
    InStock: { type: 'boolean', example: true },
    populate: { type: 'string', example: 'brandId,categoryIds' }
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
            title: 'Samsung Galaxy S24',
            description: 'Latest Samsung smartphone',
            slug: 'samsung-galaxy-s24',
            minPrice: 1000,
            maxPrice: 1200,
            InStock: true,
            isPublished: true
          }
        ]
      }
    }
  },
  examples: [
    { name: 'Get published products', query: '?isPublished=true&sort=-createdAt' },
    { name: 'Search products', query: '?q=samsung&fields=title,price' },
    { name: 'Filter by price range', query: '?minPrice=100&maxPrice=500' },
    { name: 'Filter by brand', query: '?brandId=507f1f77bcf86cd799439022' }
  ]
};

/**
 * @route GET /api/products/:id
 * @description Get a single product by ID
 * @access Public (published) / Admin (all)
 */
export const getSingleProductDocs = {
  endpoint: '/:id',
  method: 'GET',
  summary: 'Get Single Product',
  description: 'Retrieve detailed product information. Also returns user interaction status (bought, favorite, rated).',
  access: 'Public (published), Admin, SuperAdmin (all)',
  params: {
    id: {
      type: 'string',
      required: true,
      pattern: '^[0-9a-fA-F]{24}$',
      example: '507f1f77bcf86cd799439011'
    }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          title: 'Samsung Galaxy S24',
          description: 'Latest Samsung smartphone',
          brandId: { _id: '507f1f77bcf86cd799439022', title: 'Samsung' },
          categoryIds: [{ _id: '507f1f77bcf86cd799439033', title: 'Smartphones' }],
          minPrice: 1000,
          maxPrice: 1200,
          InStock: true
        },
        isBought: false,
        isFavorite: true,
        isRated: false
      }
    },
    error: {
      status: 404,
      body: { success: false, message: 'Product not found' }
    }
  }
};

/**
 * @route POST /api/products/
 * @description Create a new product
 * @access Private - Admin and SuperAdmin only
 */
export const createProductDocs = {
  endpoint: '/',
  method: 'POST',
  summary: 'Create New Product',
  description: 'Create a new product. All fields must be validated.',
  access: 'Admin, SuperAdmin',
  body: {
    title: { type: 'string', required: true, example: 'Samsung Galaxy S24' },
    description: { type: 'string', required: true, example: 'Latest Samsung smartphone' },
    brandId: { type: 'string', example: '507f1f77bcf86cd799439022' },
    categoryIds: { type: 'array', items: { type: 'string' } },
    images: { type: 'array', items: { type: 'string' } },
    videos: { type: 'array', items: { type: 'string' } },
    tags: { type: 'array', items: { type: 'string' } },
    minPrice: { type: 'number', example: 1000 },
    maxPrice: { type: 'number', example: 1200 },
    maxDiscountPercent: { type: 'number', example: 10 },
    InStock: { type: 'boolean', default: true },
    isPublished: { type: 'boolean', default: true },
    information: { type: 'array', items: { type: 'object' } }
  },
  responses: {
    success: {
      status: 201,
      body: {
        success: true,
        data: { _id: '507f1f77bcf86cd799439011', title: 'Samsung Galaxy S24' },
        message: 'product successfully created'
      }
    },
    error: {
      status: 400,
      body: { success: false, message: 'Product title already taken' }
    }
  }
};

/**
 * @route PATCH /api/products/:id
 * @description Update an existing product
 * @access Private - Admin and SuperAdmin only
 */
export const updateProductDocs = {
  endpoint: '/:id',
  method: 'PATCH',
  summary: 'Update Product',
  description: 'Update product information. Images and videos will be deleted if removed.',
  access: 'Admin, SuperAdmin',
  params: {
    id: { type: 'string', required: true, example: '507f1f77bcf86cd799439011' }
  },
  body: {
    title: { type: 'string', example: 'Samsung Galaxy S24 Ultra' },
    description: { type: 'string', example: 'Updated description' },
    minPrice: { type: 'number', example: 1100 },
    maxPrice: { type: 'number', example: 1300 },
    InStock: { type: 'boolean', example: false },
    isPublished: { type: 'boolean', example: false }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        data: { _id: '507f1f77bcf86cd799439011', title: 'Samsung Galaxy S24 Ultra' },
        message: 'product successfully updated'
      }
    },
    error: {
      status: 404,
      body: { success: false, message: 'Product not found' }
    }
  }
};

/**
 * @route DELETE /api/products/:id
 * @description Delete a product
 * @access Private - Admin and SuperAdmin only
 */
export const deleteProductDocs = {
  endpoint: '/:id',
  method: 'DELETE',
  summary: 'Delete Product',
  description: 'Delete a product. Cannot delete if product has been bought.',
  access: 'Admin, SuperAdmin',
  params: {
    id: { type: 'string', required: true, example: '507f1f77bcf86cd799439011' }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        message: 'product successfully deleted'
      }
    },
    error: {
      status: 400,
      body: { success: false, message: 'you can not delete this product' }
    }
  }
};

/**
 * @route POST /api/products/favorite/:id
 * @description Toggle favorite status for a product
 * @access Private - Requires authentication
 */
export const toggleFavoriteDocs = {
  endpoint: '/favorite/:id',
  method: 'POST',
  summary: 'Toggle Favorite',
  description: 'Add or remove product from user\'s favorites.',
  access: 'Authenticated Users',
  params: {
    id: { type: 'string', required: true, example: '507f1f77bcf86cd799439011' }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        message: 'added to favorite product successfully'
      }
    },
    error: {
      status: 404,
      body: { success: false, message: 'Product not found' }
    }
  }
};

// ==================== QUICK REFERENCE ====================

export const productEndpoints = {
  getAllProducts: {
    method: 'GET',
    path: '/api/products/',
    access: 'Public, Admin',
    description: 'Get all products with filtering'
  },
  getSingleProduct: {
    method: 'GET',
    path: '/api/products/:id',
    access: 'Public, Admin',
    description: 'Get single product with user status'
  },
  createProduct: {
    method: 'POST',
    path: '/api/products/',
    access: 'Admin, SuperAdmin',
    description: 'Create new product'
  },
  updateProduct: {
    method: 'PATCH',
    path: '/api/products/:id',
    access: 'Admin, SuperAdmin',
    description: 'Update product'
  },
  deleteProduct: {
    method: 'DELETE',
    path: '/api/products/:id',
    access: 'Admin, SuperAdmin',
    description: 'Delete product'
  },
  toggleFavorite: {
    method: 'POST',
    path: '/api/products/favorite/:id',
    access: 'Authenticated Users',
    description: 'Toggle favorite status'
  }
};

// ==================== VALIDATION RULES ====================

export const validationRules = {
  title: {
    minLength: 3,
    maxLength: 200,
    required: true,
    unique: true,
    example: 'Samsung Galaxy S24'
  },
  description: {
    minLength: 10,
    maxLength: 5000,
    required: true,
    example: 'Latest Samsung smartphone'
  },
  minPrice: {
    min: 0,
    type: 'number',
    example: 1000
  },
  maxPrice: {
    min: 0,
    type: 'number',
    example: 1200,
    note: 'Must be >= minPrice'
  },
  maxDiscountPercent: {
    min: 0,
    max: 100,
    example: 10
  },
  InStock: {
    type: 'boolean',
    default: true
  },
  isPublished: {
    type: 'boolean',
    default: true
  }
};

// ==================== PERMISSION MATRIX ====================

export const permissionMatrix = {
  endpoints: {
    'GET /api/products/': { public: 'published_only', user: 'published_only', admin: true, superAdmin: true },
    'GET /api/products/:id': { public: 'published_only', user: 'published_only', admin: true, superAdmin: true },
    'POST /api/products/': { public: false, user: false, admin: true, superAdmin: true },
    'PATCH /api/products/:id': { public: false, user: false, admin: true, superAdmin: true },
    'DELETE /api/products/:id': { public: false, user: false, admin: true, superAdmin: true },
    'POST /api/products/favorite/:id': { public: false, user: true, admin: true, superAdmin: true }
  }
};

// ==================== ERROR CODES ====================

export const productErrorCodes = {
  '400': {
    code: 'BAD_REQUEST',
    examples: [
      'Product title already taken',
      'minPrice must be a positive number',
      'maxPrice must be greater than or equal to minPrice',
      'you can not delete this product'
    ]
  },
  '401': { code: 'UNAUTHORIZED', example: 'Authentication required' },
  '403': { code: 'FORBIDDEN', example: 'You do not have permission' },
  '404': { code: 'NOT_FOUND', example: 'Product not found' }
};

// ==================== DEFAULT EXPORT ====================

export default {
  productSchemas,
  getAllProductsDocs,
  getSingleProductDocs,
  createProductDocs,
  updateProductDocs,
  deleteProductDocs,
  toggleFavoriteDocs,
  productEndpoints,
  validationRules,
  permissionMatrix,
  productErrorCodes
};