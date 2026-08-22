/**
 * Product Variant Management API Documentation
 * Base URL: /api/product-variants
 * All write operations require admin authentication
 */

// ==================== COMMON SCHEMAS ====================

export const productVariantSchemas = {
  ProductVariant: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        example: '507f1f77bcf86cd799439011',
        description: 'MongoDB ObjectId'
      },
      variantId: {
        type: 'string',
        example: '507f1f77bcf86cd799439022',
        description: 'Variant ID (size/color)'
      },
      productId: {
        type: 'string',
        example: '507f1f77bcf86cd799439033',
        description: 'Product ID'
      },
      boughtCount: {
        type: 'number',
        default: 0,
        example: 5,
        description: 'Number of times this variant has been bought'
      },
      price: {
        type: 'number',
        required: true,
        example: 1000,
        description: 'Base price of this variant'
      },
      quantity: {
        type: 'number',
        default: 0,
        example: 50,
        description: 'Available quantity in stock'
      },
      discountPercent: {
        type: 'number',
        default: 0,
        min: 0,
        max: 100,
        example: 10,
        description: 'Discount percentage for this variant'
      },
      finalPrice: {
        type: 'number',
        example: 900,
        description: 'Auto-calculated final price (price - discount)'
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

  ProductVariantResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      count: { type: 'number', example: 10 },
      data: { type: 'array', items: { $ref: '#/components/schemas/ProductVariant' } }
    }
  },

  SingleProductVariantResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      data: { $ref: '#/components/schemas/ProductVariant' }
    }
  },

  CreateProductVariantRequest: {
    type: 'object',
    required: ['variantId', 'productId', 'price'],
    properties: {
      variantId: {
        type: 'string',
        required: true,
        example: '507f1f77bcf86cd799439022',
        description: 'Variant ID (must exist)'
      },
      productId: {
        type: 'string',
        required: true,
        example: '507f1f77bcf86cd799439033',
        description: 'Product ID (must exist)'
      },
      price: {
        type: 'number',
        required: true,
        example: 1000,
        description: 'Base price'
      },
      quantity: {
        type: 'number',
        default: 0,
        example: 50,
        description: 'Stock quantity'
      },
      discountPercent: {
        type: 'number',
        default: 0,
        min: 0,
        max: 100,
        example: 10,
        description: 'Discount percentage'
      }
    }
  },

  UpdateProductVariantRequest: {
    type: 'object',
    properties: {
      variantId: {
        type: 'string',
        example: '507f1f77bcf86cd799439022',
        description: 'Variant ID'
      },
      productId: {
        type: 'string',
        example: '507f1f77bcf86cd799439033',
        description: 'Product ID'
      },
      price: {
        type: 'number',
        example: 1100,
        description: 'Base price'
      },
      quantity: {
        type: 'number',
        example: 30,
        description: 'Stock quantity'
      },
      discountPercent: {
        type: 'number',
        min: 0,
        max: 100,
        example: 15,
        description: 'Discount percentage'
      }
    }
  },

  ErrorResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      message: { type: 'string', example: 'Product variant not found' }
    }
  }
};

// ==================== ENDPOINT DOCUMENTATION ====================

/**
 * @route GET /api/product-variants/
 * @description Get all product variants with filtering
 * @access Public
 */
export const getAllProductVariantsDocs = {
  endpoint: '/',
  method: 'GET',
  summary: 'Get All Product Variants',
  description: 'Retrieve all product variants with filtering, sorting, and pagination.',
  access: 'Public',
  queryParams: {
    page: { type: 'number', default: 1, example: 2 },
    limit: { type: 'number', default: 10, max: 100, example: 20 },
    sort: { type: 'string', example: '-createdAt' },
    fields: { type: 'string', example: 'price,quantity,discountPercent' },
    productId: { type: 'string', example: '507f1f77bcf86cd799439033' },
    variantId: { type: 'string', example: '507f1f77bcf86cd799439022' },
    minPrice: { type: 'number', example: 100 },
    maxPrice: { type: 'number', example: 500 },
    inStock: { type: 'string', enum: ['true', 'false'], example: 'true' },
    populate: { type: 'string', example: 'variantId,productId' }
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
            variantId: { _id: '507f1f77bcf86cd799439022', type: 'size', value: 'Large' },
            productId: { _id: '507f1f77bcf86cd799439033', title: 'T-Shirt', images: [] },
            price: 1000,
            quantity: 50,
            discountPercent: 10,
            finalPrice: 900,
            boughtCount: 5
          }
        ]
      }
    }
  },
  examples: [
    { name: 'Get all variants', query: '' },
    { name: 'Filter by product', query: '?productId=507f1f77bcf86cd799439033' },
    { name: 'Filter by variant', query: '?variantId=507f1f77bcf86cd799439022' },
    { name: 'Filter by price range', query: '?minPrice=100&maxPrice=500' },
    { name: 'In stock only', query: '?inStock=true' }
  ]
};

/**
 * @route GET /api/product-variants/:id
 * @description Get a single product variant by ID
 * @access Public
 */
export const getSingleProductVariantDocs = {
  endpoint: '/:id',
  method: 'GET',
  summary: 'Get Single Product Variant',
  description: 'Retrieve detailed information about a specific product variant.',
  access: 'Public',
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
          variantId: { _id: '507f1f77bcf86cd799439022', type: 'size', value: 'Large' },
          productId: { _id: '507f1f77bcf86cd799439033', title: 'T-Shirt', images: [] },
          price: 1000,
          quantity: 50,
          discountPercent: 10,
          finalPrice: 900,
          boughtCount: 5
        }
      }
    },
    error: {
      status: 404,
      body: { success: false, message: 'Product variant not found' }
    }
  }
};

/**
 * @route POST /api/product-variants/
 * @description Create a new product variant
 * @access Private - Admin and SuperAdmin only
 */
export const createProductVariantDocs = {
  endpoint: '/',
  method: 'POST',
  summary: 'Create Product Variant',
  description: 'Create a new product variant. Automatically updates parent product prices and stock.',
  access: 'Admin, SuperAdmin',
  body: {
    variantId: {
      type: 'string',
      required: true,
      example: '507f1f77bcf86cd799439022',
      description: 'Variant ID (must exist)'
    },
    productId: {
      type: 'string',
      required: true,
      example: '507f1f77bcf86cd799439033',
      description: 'Product ID (must exist)'
    },
    price: {
      type: 'number',
      required: true,
      example: 1000,
      description: 'Base price'
    },
    quantity: {
      type: 'number',
      default: 0,
      example: 50,
      description: 'Stock quantity'
    },
    discountPercent: {
      type: 'number',
      default: 0,
      min: 0,
      max: 100,
      example: 10,
      description: 'Discount percentage'
    }
  },
  responses: {
    success: {
      status: 201,
      body: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          variantId: '507f1f77bcf86cd799439022',
          productId: '507f1f77bcf86cd799439033',
          price: 1000,
          quantity: 50,
          discountPercent: 10,
          finalPrice: 900
        },
        message: 'product variant created successfully'
      }
    },
    error: {
      status: 400,
      body: { success: false, message: 'This variant is already assigned to this product' }
    }
  },
  examples: [
    {
      name: 'Create size variant',
      body: {
        variantId: '507f1f77bcf86cd799439022',
        productId: '507f1f77bcf86cd799439033',
        price: 1000,
        quantity: 50,
        discountPercent: 10
      }
    },
    {
      name: 'Create color variant',
      body: {
        variantId: '507f1f77bcf86cd799439044',
        productId: '507f1f77bcf86cd799439033',
        price: 1200,
        quantity: 30
      }
    }
  ]
};

/**
 * @route PATCH /api/product-variants/:id
 * @description Update an existing product variant
 * @access Private - Admin and SuperAdmin only
 */
export const updateProductVariantDocs = {
  endpoint: '/:id',
  method: 'PATCH',
  summary: 'Update Product Variant',
  description: 'Update product variant information. Automatically recalculates finalPrice and updates parent product.',
  access: 'Admin, SuperAdmin',
  params: {
    id: {
      type: 'string',
      required: true,
      example: '507f1f77bcf86cd799439011'
    }
  },
  body: {
    variantId: { type: 'string', example: '507f1f77bcf86cd799439022' },
    productId: { type: 'string', example: '507f1f77bcf86cd799439033' },
    price: { type: 'number', example: 1100 },
    quantity: { type: 'number', example: 30 },
    discountPercent: { type: 'number', min: 0, max: 100, example: 15 }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          price: 1100,
          quantity: 30,
          discountPercent: 15,
          finalPrice: 935
        },
        message: 'product variant updated successfully'
      }
    },
    error: {
      status: 404,
      body: { success: false, message: 'Product variant not found' }
    }
  },
  examples: [
    { name: 'Update price only', body: { price: 1100 } },
    { name: 'Update stock', body: { quantity: 30 } },
    { name: 'Update discount', body: { discountPercent: 15 } },
    { name: 'Update all fields', body: { price: 1100, quantity: 30, discountPercent: 15 } }
  ]
};

/**
 * @route DELETE /api/product-variants/:id
 * @description Delete a product variant
 * @access Private - Admin and SuperAdmin only
 */
export const deleteProductVariantDocs = {
  endpoint: '/:id',
  method: 'DELETE',
  summary: 'Delete Product Variant',
  description: 'Delete a product variant. Cannot delete if variant has been bought.',
  access: 'Admin, SuperAdmin',
  params: {
    id: {
      type: 'string',
      required: true,
      example: '507f1f77bcf86cd799439011'
    }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        message: 'product variant removed successfully'
      }
    },
    error: {
      status: 400,
      body: { success: false, message: 'Cannot delete product variant that has been bought' }
    },
    notFound: {
      status: 404,
      body: { success: false, message: 'Product variant not found' }
    }
  }
};

// ==================== AUTOMATIC CALCULATIONS ====================

export const autoCalculationsDocs = {
  title: 'Automatic Calculations',
  description: 'Product variant automatically calculates and updates related fields.',
  calculations: {
    finalPrice: {
      formula: 'price * (1 - discountPercent / 100)',
      description: 'Automatically calculated on save and update',
      example: 'price: 1000, discountPercent: 10 → finalPrice: 900'
    },
    productAggregation: {
      description: 'When product variant is created/updated/deleted, parent product is automatically updated',
      updates: {
        minPrice: 'Lowest price among all variants',
        maxPrice: 'Highest price among all variants',
        maxDiscountPercent: 'Highest discount among all variants',
        InStock: 'True if any variant has quantity > 0',
        defaultProductVariantId: 'Variant with highest discount (first if none)',
        productVariantIds: 'Array of all variant IDs',
        variantIds: 'Array of all variant IDs'
      }
    }
  }
};

// ==================== QUICK REFERENCE ====================

export const productVariantEndpoints = {
  getAllProductVariants: {
    method: 'GET',
    path: '/api/product-variants/',
    access: 'Public',
    description: 'Get all product variants with filtering'
  },
  getSingleProductVariant: {
    method: 'GET',
    path: '/api/product-variants/:id',
    access: 'Public',
    description: 'Get single product variant'
  },
  createProductVariant: {
    method: 'POST',
    path: '/api/product-variants/',
    access: 'Admin, SuperAdmin',
    description: 'Create new product variant'
  },
  updateProductVariant: {
    method: 'PATCH',
    path: '/api/product-variants/:id',
    access: 'Admin, SuperAdmin',
    description: 'Update product variant'
  },
  deleteProductVariant: {
    method: 'DELETE',
    path: '/api/product-variants/:id',
    access: 'Admin, SuperAdmin',
    description: 'Delete product variant'
  }
};

// ==================== VALIDATION RULES ====================

export const validationRules = {
  variantId: {
    required: true,
    format: 'MongoDB ObjectId',
    description: 'Must exist in Variant collection',
    example: '507f1f77bcf86cd799439022'
  },
  productId: {
    required: true,
    format: 'MongoDB ObjectId',
    description: 'Must exist in Product collection',
    example: '507f1f77bcf86cd799439033'
  },
  price: {
    required: true,
    min: 0,
    type: 'number',
    example: 1000
  },
  quantity: {
    default: 0,
    min: 0,
    type: 'integer',
    example: 50
  },
  discountPercent: {
    default: 0,
    min: 0,
    max: 100,
    type: 'number',
    example: 10
  },
  boughtCount: {
    default: 0,
    min: 0,
    type: 'number',
    description: 'Read-only - auto-incremented on purchase'
  },
  finalPrice: {
    type: 'number',
    description: 'Read-only - auto-calculated from price and discount'
  }
};

// ==================== PERMISSION MATRIX ====================

export const permissionMatrix = {
  endpoints: {
    'GET /api/product-variants/': { public: true, user: true, admin: true, superAdmin: true },
    'GET /api/product-variants/:id': { public: true, user: true, admin: true, superAdmin: true },
    'POST /api/product-variants/': { public: false, user: false, admin: true, superAdmin: true },
    'PATCH /api/product-variants/:id': { public: false, user: false, admin: true, superAdmin: true },
    'DELETE /api/product-variants/:id': { public: false, user: false, admin: true, superAdmin: true }
  }
};

// ==================== ERROR CODES ====================

export const productVariantErrorCodes = {
  '400': {
    code: 'BAD_REQUEST',
    examples: [
      'This variant is already assigned to this product',
      'Cannot delete product variant that has been bought',
      'Price must be a positive number',
      'Discount percent must be between 0 and 100'
    ]
  },
  '401': { code: 'UNAUTHORIZED', example: 'Authentication required' },
  '403': { code: 'FORBIDDEN', example: 'You do not have permission' },
  '404': { code: 'NOT_FOUND', example: 'Product variant not found' }
};

// ==================== RESPONSE TEMPLATES ====================

export const responseTemplates = {
  getAllSuccess: {
    success: true,
    count: 10,
    data: [
      {
        _id: '507f1f77bcf86cd799439011',
        variantId: { _id: '507f1f77bcf86cd799439022', type: 'size', value: 'Large' },
        productId: { _id: '507f1f77bcf86cd799439033', title: 'T-Shirt' },
        price: 1000,
        quantity: 50,
        discountPercent: 10,
        finalPrice: 900,
        boughtCount: 5
      }
    ]
  },
  getSingleSuccess: {
    success: true,
    data: {
      _id: '507f1f77bcf86cd799439011',
      variantId: { _id: '507f1f77bcf86cd799439022', type: 'size', value: 'Large' },
      productId: { _id: '507f1f77bcf86cd799439033', title: 'T-Shirt' },
      price: 1000,
      quantity: 50,
      discountPercent: 10,
      finalPrice: 900,
      boughtCount: 5
    }
  },
  createSuccess: {
    success: true,
    data: {
      _id: '507f1f77bcf86cd799439011',
      variantId: '507f1f77bcf86cd799439022',
      productId: '507f1f77bcf86cd799439033',
      price: 1000,
      quantity: 50,
      discountPercent: 10,
      finalPrice: 900
    },
    message: 'product variant created successfully'
  },
  updateSuccess: {
    success: true,
    data: {
      _id: '507f1f77bcf86cd799439011',
      price: 1100,
      quantity: 30,
      discountPercent: 15,
      finalPrice: 935
    },
    message: 'product variant updated successfully'
  },
  deleteSuccess: {
    success: true,
    message: 'product variant removed successfully'
  }
};

// ==================== DEFAULT EXPORT ====================

export default {
  productVariantSchemas,
  getAllProductVariantsDocs,
  getSingleProductVariantDocs,
  createProductVariantDocs,
  updateProductVariantDocs,
  deleteProductVariantDocs,
  autoCalculationsDocs,
  productVariantEndpoints,
  validationRules,
  permissionMatrix,
  productVariantErrorCodes,
  responseTemplates
};