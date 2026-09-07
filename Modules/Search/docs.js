/**
 * Global Search API Documentation
 * Base URL: /api/search
 * Public endpoint - No authentication required
 */

// ==================== COMMON SCHEMAS ====================

export const searchSchemas = {
  SearchResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      data: {
        type: 'object',
        properties: {
          products: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              count: { type: 'number', example: 10 },
              data: {
                type: 'array',
                items: { $ref: '#/components/schemas/Product' }
              }
            }
          },
          categories: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              count: { type: 'number', example: 5 },
              data: {
                type: 'array',
                items: { $ref: '#/components/schemas/Category' }
              }
            }
          },
          brands: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              count: { type: 'number', example: 3 },
              data: {
                type: 'array',
                items: { $ref: '#/components/schemas/Brand' }
              }
            }
          }
        }
      }
    }
  },

  Product: {
    type: 'object',
    properties: {
      _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
      title: { type: 'string', example: 'Samsung Galaxy S24' },
      description: { type: 'string', example: 'Latest Samsung smartphone' },
      slug: { type: 'string', example: 'samsung-galaxy-s24' },
      images: { type: 'array', items: { type: 'string' } },
      minPrice: { type: 'number', example: 1000 },
      maxPrice: { type: 'number', example: 1200 },
      avgRating: { type: 'number', example: 4.5 },
      InStock: { type: 'boolean', example: true },
      isPublished: { type: 'boolean', example: true }
    }
  },

  Category: {
    type: 'object',
    properties: {
      _id: { type: 'string', example: '507f1f77bcf86cd799439022' },
      title: { type: 'string', example: 'Smartphones' },
      image: { type: 'string', example: 'uploads/categories/smartphones.png' },
      isPublished: { type: 'boolean', example: true },
      supCategoryId: { type: 'string', example: null },
      subCategoryIds: { type: 'array', items: { type: 'string' } }
    }
  },

  Brand: {
    type: 'object',
    properties: {
      _id: { type: 'string', example: '507f1f77bcf86cd799439033' },
      title: { type: 'string', example: 'Samsung' },
      image: { type: 'string', example: 'uploads/brands/samsung.png' },
      isPublished: { type: 'boolean', example: true }
    }
  },

  ErrorResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      message: { type: 'string', example: 'result not found' }
    }
  }
};

// ==================== ENDPOINT DOCUMENTATION ====================

/**
 * @route GET /api/search/
 * @description Global search across products, categories, and brands
 * @access Public
 * @query {string} q - Search query (searches titles)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10, max: 50)
 * @query {string} sort - Sort field with prefix (- for desc, + for asc)
 * @query {string} fields - Comma-separated fields to include/exclude
 * @query {string} type - Filter by type: all, products, categories, brands
 * @query {number} minPrice - Minimum price (products only)
 * @query {number} maxPrice - Maximum price (products only)
 * @query {string} brandId - Filter by brand (products only)
 * @query {string} categoryId - Filter by category (products only)
 * @query {boolean} InStock - Filter by stock status (products only)
 */
export const searchDocs = {
  endpoint: '/',
  method: 'GET',
  summary: 'Global Search',
  description: 'Search across products, categories, and brands. Returns results from all three types.',
  access: 'Public',
  queryParams: {
    q: {
      type: 'string',
      required: false,
      example: 'samsung',
      description: 'Search query for titles'
    },
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
      example: 'title,images,minPrice',
      description: 'Comma-separated fields to include or exclude (prefix with -)'
    },
    type: {
      type: 'string',
      required: false,
      enum: ['all', 'products', 'categories', 'brands'],
      default: 'all',
      example: 'products',
      description: 'Filter search results by type'
    },
    minPrice: {
      type: 'number',
      required: false,
      example: 100,
      description: 'Minimum price filter (products only)'
    },
    maxPrice: {
      type: 'number',
      required: false,
      example: 500,
      description: 'Maximum price filter (products only)'
    },
    brandId: {
      type: 'string',
      required: false,
      example: '507f1f77bcf86cd799439033',
      description: 'Filter by brand ID (products only)'
    },
    categoryId: {
      type: 'string',
      required: false,
      example: '507f1f77bcf86cd799439022',
      description: 'Filter by category ID (products only)'
    },
    InStock: {
      type: 'boolean',
      required: false,
      example: true,
      description: 'Filter by stock status (products only)'
    },
    populate: {
      type: 'string',
      required: false,
      example: 'brandId,categoryIds',
      description: 'Relations to populate'
    }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        data: {
          products: {
            success: true,
            count: 10,
            data: [
              {
                _id: '507f1f77bcf86cd799439011',
                title: 'Samsung Galaxy S24',
                description: 'Latest Samsung smartphone',
                slug: 'samsung-galaxy-s24',
                images: ['image1.jpg'],
                minPrice: 1000,
                maxPrice: 1200,
                avgRating: 4.5,
                InStock: true,
                isPublished: true
              }
            ]
          },
          categories: {
            success: true,
            count: 5,
            data: [
              {
                _id: '507f1f77bcf86cd799439022',
                title: 'Smartphones',
                image: 'uploads/categories/smartphones.png',
                isPublished: true,
                supCategoryId: null,
                subCategoryIds: []
              }
            ]
          },
          brands: {
            success: true,
            count: 3,
            data: [
              {
                _id: '507f1f77bcf86cd799439033',
                title: 'Samsung',
                image: 'uploads/brands/samsung.png',
                isPublished: true
              }
            ]
          }
        }
      }
    },
    error: {
      status: 404,
      body: {
        success: false,
        message: 'result not found'
      }
    }
  },
  examples: [
    {
      name: 'Search all types',
      query: '?q=samsung',
      description: 'Search for "samsung" across all types'
    },
    {
      name: 'Search products only',
      query: '?q=phone&type=products&minPrice=100&maxPrice=500',
      description: 'Search products only with price filter'
    },
    {
      name: 'Search categories only',
      query: '?q=smart&type=categories',
      description: 'Search categories only'
    },
    {
      name: 'Search with filters',
      query: '?q=samsung&type=products&brandId=507f1f77bcf86cd799439033&InStock=true',
      description: 'Search products by brand and stock status'
    },
    {
      name: 'Pagination',
      query: '?q=samsung&page=2&limit=10',
      description: 'Get second page of search results'
    }
  ]
};

// ==================== SEARCH BEHAVIOR ====================

export const searchBehaviorDocs = {
  title: 'Search Behavior',
  description: 'How the global search works across different entities',
  behaviors: {
    products: {
      description: 'Products are searched by title and filtered',
      filters: [
        'isPublished: true (for public users)',
        'minPrice, maxPrice range',
        'brandId exact match',
        'categoryId exact match',
        'InStock boolean'
      ],
      searchField: 'title',
      sortable: true,
      populate: ['brandId', 'categoryIds', 'defaultProductVariantId', 'variantIds']
    },
    categories: {
      description: 'Categories are searched by title',
      filters: ['isPublished: true (for public users)'],
      searchField: 'title',
      sortable: true,
      populate: ['supCategoryId', 'subCategoryIds']
    },
    brands: {
      description: 'Brands are searched by title',
      filters: ['isPublished: true (for public users)'],
      searchField: 'title',
      sortable: true
    }
  }
};

// ==================== QUICK REFERENCE ====================

export const searchEndpoints = {
  globalSearch: {
    method: 'GET',
    path: '/api/search/',
    access: 'Public',
    description: 'Global search across products, categories, and brands'
  }
};

// ==================== VALIDATION RULES ====================

export const validationRules = {
  q: {
    minLength: 1,
    maxLength: 100,
    pattern: '^[\\u0600-\\u06FF\\sa-zA-Z0-9\\-_ ]+$',
    description: 'Search query (letters, numbers, spaces, hyphens, underscores)',
    example: 'samsung galaxy'
  },
  page: {
    min: 1,
    type: 'number',
    default: 1,
    example: 2
  },
  limit: {
    min: 1,
    max: 50,
    type: 'number',
    default: 10,
    example: 20
  },
  type: {
    enum: ['all', 'products', 'categories', 'brands'],
    default: 'all',
    example: 'products'
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
  },
  brandId: {
    format: 'MongoDB ObjectId',
    example: '507f1f77bcf86cd799439033'
  },
  categoryId: {
    format: 'MongoDB ObjectId',
    example: '507f1f77bcf86cd799439022'
  },
  InStock: {
    type: 'boolean',
    example: true
  }
};

// ==================== ERROR CODES ====================

export const searchErrorCodes = {
  '400': {
    code: 'BAD_REQUEST',
    examples: [
      'Search query cannot be empty',
      'maxPrice must be greater than or equal to minPrice',
      'Invalid brand ID format',
      'Invalid category ID format'
    ]
  },
  '404': {
    code: 'NOT_FOUND',
    examples: [
      'result not found'
    ]
  }
};

// ==================== RESPONSE TEMPLATES ====================

export const responseTemplates = {
  searchSuccess: {
    success: true,
    data: {
      products: {
        success: true,
        count: 10,
        data: [
          {
            _id: '507f1f77bcf86cd799439011',
            title: 'Samsung Galaxy S24',
            description: 'Latest Samsung smartphone',
            minPrice: 1000,
            maxPrice: 1200,
            avgRating: 4.5,
            InStock: true,
            images: ['image1.jpg']
          }
        ]
      },
      categories: {
        success: true,
        count: 5,
        data: [
          {
            _id: '507f1f77bcf86cd799439022',
            title: 'Smartphones',
            image: 'uploads/categories/smartphones.png',
            isPublished: true
          }
        ]
      },
      brands: {
        success: true,
        count: 3,
        data: [
          {
            _id: '507f1f77bcf86cd799439033',
            title: 'Samsung',
            image: 'uploads/brands/samsung.png',
            isPublished: true
          }
        ]
      }
    }
  },
  searchEmpty: {
    success: true,
    data: {
      products: { success: true, count: 0, data: [] },
      categories: { success: true, count: 0, data: [] },
      brands: { success: true, count: 0, data: [] }
    }
  },
  error: {
    success: false,
    message: 'result not found'
  }
};

// ==================== USE CASES ====================

export const searchUseCases = {
  productSearch: {
    description: 'Find products by name or description',
    examples: [
      'Search for "smartphone" to find all phones',
      'Search for "samsung" to find Samsung products',
      'Filter by price range: ?q=laptop&minPrice=1000&maxPrice=2000'
    ]
  },
  categorySearch: {
    description: 'Find categories by name',
    examples: [
      'Search for "electronics" to find electronics categories',
      'Search for "phone" to find phone-related categories'
    ]
  },
  brandSearch: {
    description: 'Find brands by name',
    examples: [
      'Search for "samsung" to find Samsung brand',
      'Search for "apple" to find Apple brand'
    ]
  },
  combinedSearch: {
    description: 'Search across all types simultaneously',
    features: [
      'Returns products, categories, and brands in one request',
      'Each type has its own pagination',
      'Useful for autocomplete or suggestion features'
    ]
  }
};

// ==================== DEFAULT EXPORT ====================

export default {
  searchSchemas,
  searchDocs,
  searchBehaviorDocs,
  searchEndpoints,
  validationRules,
  searchErrorCodes,
  responseTemplates,
  searchUseCases
};