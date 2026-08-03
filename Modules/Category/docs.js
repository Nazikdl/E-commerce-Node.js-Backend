/**
 * Category Management API Documentation
 * Base URL: /api/categories
 * All write operations require admin authentication
 */

// ==================== COMMON SCHEMAS ====================

export const categorySchemas = {
  Category: {
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
        example: 'Electronics',
        description: 'Category title (unique)'
      },
      image: {
        type: 'string',
        example: 'uploads/categories/electronics.png',
        description: 'Category image path'
      },
      isPublished: {
        type: 'boolean',
        default: true,
        example: true,
        description: 'Category visibility status'
      },
      supCategoryId: {
        type: 'string',
        example: '507f1f77bcf86cd799439022',
        description: 'Parent category ID (for subcategories)',
        nullable: true
      },
      subCategoryIds: {
        type: 'array',
        items: { type: 'string' },
        example: ['507f1f77bcf86cd799439033', '507f1f77bcf86cd799439044'],
        description: 'Array of subcategory IDs'
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

  CategoryResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      count: {
        type: 'number',
        example: 10,
        description: 'Total number of categories (for getAll)'
      },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Category' }
      }
    }
  },

  SingleCategoryResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      data: {
        $ref: '#/components/schemas/Category'
      }
    }
  },

  CreateCategoryRequest: {
    type: 'object',
    required: ['title'],
    properties: {
      title: {
        type: 'string',
        minLength: 2,
        maxLength: 50,
        example: 'Electronics',
        description: 'Category title (must be unique)'
      },
      image: {
        type: 'string',
        example: 'uploads/categories/electronics.png',
        description: 'Category image path'
      },
      isPublished: {
        type: 'boolean',
        default: true,
        example: true,
        description: 'Category visibility'
      },
      supCategoryId: {
        type: 'string',
        example: '507f1f77bcf86cd799439022',
        description: 'Parent category ID (for creating subcategory)',
        nullable: true
      }
    }
  },

  UpdateCategoryRequest: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        minLength: 2,
        maxLength: 50,
        example: 'Consumer Electronics',
        description: 'Category title (must be unique)'
      },
      image: {
        type: 'string',
        example: 'uploads/categories/consumer-electronics.png',
        description: 'Category image path'
      },
      isPublished: {
        type: 'boolean',
        example: false,
        description: 'Category visibility'
      },
      supCategoryId: {
        type: 'string',
        example: '507f1f77bcf86cd799439022',
        description: 'Parent category ID',
        nullable: true
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
        example: 'Category title already taken'
      }
    }
  }
};

// ==================== ENDPOINT DOCUMENTATION ====================

/**
 * @route GET /api/categories/
 * @description Get all categories with filtering, sorting, and pagination
 * @access Public (published categories) / Admin (all categories)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10, max: 100)
 * @query {string} sort - Sort field with prefix (- for desc, + for asc)
 * @query {string} fields - Comma-separated fields to include/exclude
 * @query {string} q - Search query (searches title)
 * @query {boolean} isPublished - Filter by publication status
 * @query {string} supCategoryId - Filter by parent category
 * @query {string} populate - Relations to populate
 */
export const getAllCategoriesDocs = {
  endpoint: '/',
  method: 'GET',
  summary: 'Get All Categories',
  description: 'Retrieve a list of all categories with hierarchical structure. Public users only see published categories. Admin sees all categories.',
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
      example: 'title,image,supCategoryId',
      description: 'Comma-separated fields to include or exclude (prefix with -)'
    },
    q: {
      type: 'string',
      required: false,
      example: 'electronics',
      description: 'Search query for category title'
    },
    isPublished: {
      type: 'boolean',
      required: false,
      example: true,
      description: 'Filter by publication status (admin only)'
    },
    supCategoryId: {
      type: 'string',
      required: false,
      example: '507f1f77bcf86cd799439022',
      description: 'Filter by parent category (get subcategories)'
    },
    populate: {
      type: 'string',
      required: false,
      example: 'supCategoryId,subCategoryIds',
      description: 'Populate parent and child categories'
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
            title: 'Electronics',
            image: 'uploads/categories/electronics.png',
            isPublished: true,
            supCategoryId: null,
            subCategoryIds: [
              '507f1f77bcf86cd799439022',
              '507f1f77bcf86cd799439033'
            ],
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          }
        ]
      }
    }
  },
  examples: [
    {
      name: 'Get main categories',
      query: '?isPublished=true&supCategoryId=null',
      description: 'Get all published main categories (no parent)'
    },
    {
      name: 'Get subcategories',
      query: '?supCategoryId=507f1f77bcf86cd799439011',
      description: 'Get all subcategories of a specific category'
    },
    {
      name: 'Search categories',
      query: '?q=phone&fields=title,image',
      description: 'Search for categories containing "phone"'
    },
    {
      name: 'Get with hierarchy',
      query: '?populate=supCategoryId,subCategoryIds',
      description: 'Get categories with parent and children populated'
    }
  ]
};

/**
 * @route GET /api/categories/:id
 * @description Get a single category by ID with hierarchy
 * @access Public (published only) / Admin (all)
 * @param {string} id - Category ID (MongoDB ObjectId)
 */
export const getSingleCategoryDocs = {
  endpoint: '/:id',
  method: 'GET',
  summary: 'Get Single Category',
  description: 'Retrieve detailed information about a specific category including parent and child relationships.',
  access: 'Public (published only), Admin, SuperAdmin (all)',
  params: {
    id: {
      type: 'string',
      required: true,
      pattern: '^[0-9a-fA-F]{24}$',
      example: '507f1f77bcf86cd799439011',
      description: 'MongoDB ObjectId of the category'
    }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          title: 'Electronics',
          image: 'uploads/categories/electronics.png',
          isPublished: true,
          supCategoryId: null,
          subCategoryIds: [
            {
              _id: '507f1f77bcf86cd799439022',
              title: 'Smartphones',
              isPublished: true
            },
            {
              _id: '507f1f77bcf86cd799439033',
              title: 'Laptops',
              isPublished: true
            }
          ],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      }
    },
    error: {
      status: 404,
      body: {
        success: false,
        message: 'Category not found'
      }
    }
  }
};

/**
 * @route POST /api/categories/
 * @description Create a new category
 * @access Private - Admin and SuperAdmin only
 * @body {string} title - Category title (required, unique, 2-50 chars)
 * @body {string} image - Category image path (optional)
 * @body {boolean} isPublished - Category visibility (optional, default: true)
 * @body {string} supCategoryId - Parent category ID (optional)
 */
export const createCategoryDocs = {
  endpoint: '/',
  method: 'POST',
  summary: 'Create New Category',
  description: 'Create a new category. Can be a main category or subcategory. Title must be unique.',
  access: 'Admin, SuperAdmin',
  body: {
    title: {
      type: 'string',
      required: true,
      minLength: 2,
      maxLength: 50,
      example: 'Smartphones',
      description: 'Category title (must be unique)'
    },
    image: {
      type: 'string',
      required: false,
      example: 'uploads/categories/smartphones.png',
      description: 'Category image path'
    },
    isPublished: {
      type: 'boolean',
      required: false,
      default: true,
      example: true,
      description: 'Category visibility'
    },
    supCategoryId: {
      type: 'string',
      required: false,
      example: '507f1f77bcf86cd799439011',
      description: 'Parent category ID (creates subcategory)',
      nullable: true
    }
  },
  responses: {
    success: {
      status: 201,
      body: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439022',
          title: 'Smartphones',
          image: 'uploads/categories/smartphones.png',
          isPublished: true,
          supCategoryId: '507f1f77bcf86cd799439011',
          subCategoryIds: [],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        },
        message: 'category Created Successfully'
      }
    },
    error: {
      status: 400,
      body: {
        success: false,
        message: 'Category title already taken'
      }
    }
  },
  examples: [
    {
      name: 'Create main category',
      body: {
        title: 'Electronics',
        isPublished: true
      },
      description: 'Create a main category with no parent'
    },
    {
      name: 'Create subcategory',
      body: {
        title: 'Smartphones',
        supCategoryId: '507f1f77bcf86cd799439011',
        isPublished: true
      },
      description: 'Create a subcategory under Electronics'
    },
    {
      name: 'Create with image',
      body: {
        title: 'Laptops',
        image: 'uploads/categories/laptops.png',
        supCategoryId: '507f1f77bcf86cd799439011'
      },
      description: 'Create a subcategory with image'
    }
  ]
};

/**
 * @route PATCH /api/categories/:id
 * @description Update an existing category
 * @access Private - Admin and SuperAdmin only
 * @param {string} id - Category ID (MongoDB ObjectId)
 * @body {string} title - Category title (2-50 chars, unique)
 * @body {string} image - Category image path
 * @body {boolean} isPublished - Category visibility
 * @body {string} supCategoryId - Parent category ID
 */
export const updateCategoryDocs = {
  endpoint: '/:id',
  method: 'PATCH',
  summary: 'Update Category',
  description: 'Update category information. Can change parent category. Title must be unique.',
  access: 'Admin, SuperAdmin',
  params: {
    id: {
      type: 'string',
      required: true,
      pattern: '^[0-9a-fA-F]{24}$',
      example: '507f1f77bcf86cd799439022'
    }
  },
  body: {
    title: {
      type: 'string',
      required: false,
      minLength: 2,
      maxLength: 50,
      example: 'Smartphones & Tablets',
      description: 'Category title (must be unique)'
    },
    image: {
      type: 'string',
      required: false,
      example: 'uploads/categories/smartphones-new.png',
      description: 'Category image path'
    },
    isPublished: {
      type: 'boolean',
      required: false,
      example: false,
      description: 'Category visibility'
    },
    supCategoryId: {
      type: 'string',
      required: false,
      example: '507f1f77bcf86cd799439011',
      description: 'Parent category ID (changing parent)',
      nullable: true
    }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439022',
          title: 'Smartphones & Tablets',
          image: 'uploads/categories/smartphones-new.png',
          isPublished: false,
          supCategoryId: '507f1f77bcf86cd799439011',
          subCategoryIds: ['507f1f77bcf86cd799439033'],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        },
        message: 'category updated Successfully'
      }
    },
    error: {
      status: 400,
      body: {
        success: false,
        message: 'Category title already taken'
      }
    }
  },
  examples: [
    {
      name: 'Update title',
      body: {
        title: 'Consumer Electronics'
      },
      description: 'Only update the category title'
    },
    {
      name: 'Change parent category',
      body: {
        supCategoryId: '507f1f77bcf86cd799439044'
      },
      description: 'Move category to a different parent'
    },
    {
      name: 'Remove parent (make main)',
      body: {
        supCategoryId: null
      },
      description: 'Make a subcategory a main category'
    },
    {
      name: 'Unpublish category',
      body: {
        isPublished: false
      },
      description: 'Hide category from public view'
    }
  ]
};

/**
 * @route DELETE /api/categories/:id
 * @description Delete a category
 * @access Private - Admin and SuperAdmin only
 * @param {string} id - Category ID (MongoDB ObjectId)
 * @throws {400} - Category has associated products or subcategories
 * @throws {404} - Category not found
 */
export const deleteCategoryDocs = {
  endpoint: '/:id',
  method: 'DELETE',
  summary: 'Delete Category',
  description: 'Delete a category. Category cannot be deleted if it is used in any product or has subcategories.',
  access: 'Admin, SuperAdmin',
  params: {
    id: {
      type: 'string',
      required: true,
      pattern: '^[0-9a-fA-F]{24}$',
      example: '507f1f77bcf86cd799439022',
      description: 'MongoDB ObjectId of the category'
    }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        message: 'category deleted Successfully'
      }
    },
    error: {
      status: 400,
      body: {
        success: false,
        message: 'this category is used in some product or parent of some category'
      }
    },
    notFound: {
      status: 404,
      body: {
        success: false,
        message: 'Category not found'
      }
    }
  }
};

// ==================== HIERARCHY STRUCTURE ====================

export const categoryHierarchyDocs = {
  title: 'Category Hierarchy Structure',
  description: 'Categories support hierarchical (tree) structure with unlimited nesting levels.',
  levels: {
    level1: {
      name: 'Main Categories',
      description: 'Categories with no parent (supCategoryId: null)',
      example: 'Electronics, Clothing, Books'
    },
    level2: {
      name: 'Subcategories',
      description: 'Categories with a parent category',
      example: 'Smartphones, Laptops (under Electronics)'
    },
    level3: {
      name: 'Sub-subcategories',
      description: 'Categories with a parent that is also a subcategory',
      example: 'Gaming Laptops, Business Laptops (under Laptops)'
    }
  },
  rules: {
    maxDepth: 3,
    noCircular: 'Category cannot be its own parent',
    noSelfReference: 'Category cannot reference itself',
    parentMustExist: 'Parent category must exist',
    noOrphanSubcategories: 'Subcategories cannot be deleted without reassigning'
  }
};

// ==================== QUICK REFERENCE ====================

export const categoryEndpoints = {
  getAllCategories: {
    method: 'GET',
    path: '/api/categories/',
    access: 'Public (published), Admin (all)',
    description: 'Get all categories with filtering, sorting, and pagination'
  },
  getSingleCategory: {
    method: 'GET',
    path: '/api/categories/:id',
    access: 'Public (published), Admin (all)',
    description: 'Get specific category by ID with hierarchy'
  },
  createCategory: {
    method: 'POST',
    path: '/api/categories/',
    access: 'Admin, SuperAdmin',
    description: 'Create a new category (main or subcategory)'
  },
  updateCategory: {
    method: 'PATCH',
    path: '/api/categories/:id',
    access: 'Admin, SuperAdmin',
    description: 'Update category information including parent'
  },
  deleteCategory: {
    method: 'DELETE',
    path: '/api/categories/:id',
    access: 'Admin, SuperAdmin',
    description: 'Delete a category (if not used in products or as parent)'
  }
};

// ==================== VALIDATION RULES SUMMARY ====================

export const validationRules = {
  title: {
    minLength: 2,
    maxLength: 50,
    pattern: '^[\\u0600-\\u06FF\\sa-zA-Z0-9\\-_.&/ ]+$',
    description: 'Letters, numbers, spaces, hyphens, underscores, dots, ampersands, commas, and slashes',
    example: 'Electronics & Gadgets',
    required: true,
    unique: true
  },
  image: {
    maxLength: 500,
    pattern: '^[a-zA-Z0-9\\-_./]+$',
    description: 'Valid file path format',
    example: 'uploads/categories/electronics.png'
  },
  isPublished: {
    type: 'boolean',
    default: true,
    description: 'Category visibility status'
  },
  supCategoryId: {
    format: 'MongoDB ObjectId',
    pattern: '^[0-9a-fA-F]{24}$',
    example: '507f1f77bcf86cd799439011',
    description: 'Parent category ID (null for main categories)'
  },
  categoryId: {
    format: 'MongoDB ObjectId',
    pattern: '^[0-9a-fA-F]{24}$',
    example: '507f1f77bcf86cd799439011'
  }
};

// ==================== PERMISSION MATRIX ====================

export const permissionMatrix = {
  endpoints: {
    'GET /api/categories/': {
      public: 'published_only',
      user: 'published_only',
      admin: true,
      superAdmin: true
    },
    'GET /api/categories/:id': {
      public: 'published_only',
      user: 'published_only',
      admin: true,
      superAdmin: true
    },
    'POST /api/categories/': {
      public: false,
      user: false,
      admin: true,
      superAdmin: true
    },
    'PATCH /api/categories/:id': {
      public: false,
      user: false,
      admin: true,
      superAdmin: true
    },
    'DELETE /api/categories/:id': {
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
    supCategoryId: {
      public: 'read',
      user: 'read',
      admin: 'read_write',
      superAdmin: 'read_write'
    },
    subCategoryIds: {
      public: 'read',
      user: 'read',
      admin: 'read_write',
      superAdmin: 'read_write'
    }
  }
};

// ==================== ERROR CODES ====================

export const categoryErrorCodes = {
  '400': {
    code: 'BAD_REQUEST',
    description: 'Invalid input format or validation failed',
    examples: [
      'Category title already taken',
      'Category title must be between 2 to 50 characters',
      'Super category not found',
      'Category cannot be its own parent',
      'Category nesting depth cannot exceed 3 levels',
      'This category is used in some product or parent of some category',
      'Invalid category ID format'
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
    description: 'Category not found',
    example: 'Category not found'
  },
  '409': {
    code: 'CONFLICT',
    description: 'Duplicate entry',
    example: 'Category title already taken'
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
        title: 'Electronics',
        image: 'uploads/categories/electronics.png',
        isPublished: true,
        supCategoryId: null,
        subCategoryIds: ['507f1f77bcf86cd799439022'],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    ]
  },
  getSingleSuccess: {
    success: true,
    data: {
      _id: '507f1f77bcf86cd799439011',
      title: 'Electronics',
      image: 'uploads/categories/electronics.png',
      isPublished: true,
      supCategoryId: null,
      subCategoryIds: ['507f1f77bcf86cd799439022'],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  },
  createSuccess: {
    success: true,
    data: {
      _id: '507f1f77bcf86cd799439022',
      title: 'Smartphones',
      image: 'uploads/categories/smartphones.png',
      isPublished: true,
      supCategoryId: '507f1f77bcf86cd799439011',
      subCategoryIds: [],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    message: 'category Created Successfully'
  },
  updateSuccess: {
    success: true,
    data: {
      _id: '507f1f77bcf86cd799439022',
      title: 'Smartphones & Tablets',
      image: 'uploads/categories/smartphones-new.png',
      isPublished: false,
      supCategoryId: '507f1f77bcf86cd799439011',
      subCategoryIds: ['507f1f77bcf86cd799439033'],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    message: 'category updated Successfully'
  },
  deleteSuccess: {
    success: true,
    message: 'category deleted Successfully'
  },
  error: {
    success: false,
    message: 'Error message'
  }
};

// ==================== DEFAULT EXPORT ====================

export default {
  categorySchemas,
  getAllCategoriesDocs,
  getSingleCategoryDocs,
  createCategoryDocs,
  updateCategoryDocs,
  deleteCategoryDocs,
  categoryHierarchyDocs,
  categoryEndpoints,
  validationRules,
  permissionMatrix,
  categoryErrorCodes,
  responseTemplates
};