/**
 * Cart Management API Documentation
 * Base URL: /api/cart
 * All endpoints require authentication (isLogin middleware)
 */

// ==================== COMMON SCHEMAS ====================

export const cartSchemas = {
  CartItem: {
    type: 'object',
    properties: {
      productId: {
        type: 'string',
        example: '507f1f77bcf86cd799439011',
        description: 'Product ID'
      },
      productVariantId: {
        type: 'string',
        example: '507f1f77bcf86cd799439022',
        description: 'Product variant ID (size/color)'
      },
      brandId: {
        type: 'string',
        example: '507f1f77bcf86cd799439033',
        description: 'Brand ID'
      },
      categoryIds: {
        type: 'array',
        items: { type: 'string' },
        example: ['507f1f77bcf86cd799439044'],
        description: 'Category IDs'
      },
      cartQuantity: {
        type: 'number',
        default: 1,
        example: 2,
        description: 'Quantity in cart'
      }
    }
  },

  Cart: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        example: '507f1f77bcf86cd799439055',
        description: 'MongoDB ObjectId'
      },
      userId: {
        type: 'string',
        example: '507f1f77bcf86cd799439066',
        description: 'User ID who owns the cart'
      },
      items: {
        type: 'array',
        items: { $ref: '#/components/schemas/CartItem' }
      },
      totalPrice: {
        type: 'number',
        example: 1000,
        description: 'Total price without discounts'
      },
      finalPrice: {
        type: 'number',
        example: 900,
        description: 'Total price after discounts'
      },
      finalPriceAfterDiscount: {
        type: 'number',
        example: 850,
        description: 'Final price after additional discounts'
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

  CartResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      data: { $ref: '#/components/schemas/Cart' }
    }
  },

  AddItemRequest: {
    type: 'object',
    required: ['productVariantId'],
    properties: {
      productVariantId: {
        type: 'string',
        required: true,
        example: '507f1f77bcf86cd799439022',
        description: 'Product variant ID to add to cart'
      }
    }
  },

  RemoveItemRequest: {
    type: 'object',
    required: ['productVariantId'],
    properties: {
      productVariantId: {
        type: 'string',
        required: true,
        example: '507f1f77bcf86cd799439022',
        description: 'Product variant ID to remove from cart'
      },
      totalRemove: {
        type: 'boolean',
        default: false,
        example: true,
        description: 'If true, removes all quantity of the item'
      }
    }
  },

  ErrorResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      message: { type: 'string', example: 'Cart not found' }
    }
  }
};

// ==================== ENDPOINT DOCUMENTATION ====================

/**
 * @route GET /api/cart/
 * @description Get current user's cart
 * @access Private - Requires authentication
 */
export const getCartDocs = {
  endpoint: '/',
  method: 'GET',
  summary: 'Get User Cart',
  description: 'Retrieve the current user\'s cart with all items and calculated prices.',
  access: 'Authenticated Users',
  queryParams: {
    fields: {
      type: 'string',
      example: 'items,totalPrice,finalPrice',
      description: 'Comma-separated fields to include'
    },
    populate: {
      type: 'string',
      example: 'items.productId,items.productVariantId',
      description: 'Relations to populate'
    }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439055',
          userId: '507f1f77bcf86cd799439066',
          items: [
            {
              productId: {
                _id: '507f1f77bcf86cd799439011',
                title: 'Samsung Galaxy S24',
                images: ['image1.jpg'],
                slug: 'samsung-galaxy-s24'
              },
              productVariantId: {
                _id: '507f1f77bcf86cd799439022',
                price: 1000,
                finalPrice: 900,
                discountPercent: 10,
                variantId: { _id: '507f1f77bcf86cd799439033', type: 'size', value: 'Large' }
              },
              brandId: { _id: '507f1f77bcf86cd799439044', title: 'Samsung', image: 'brand.jpg' },
              categoryIds: [{ _id: '507f1f77bcf86cd799439055', title: 'Smartphones' }],
              cartQuantity: 2
            }
          ],
          totalPrice: 2000,
          finalPrice: 1800,
          finalPriceAfterDiscount: 1800,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      }
    },
    error: {
      status: 401,
      body: { success: false, message: 'Authentication required' }
    }
  }
};

/**
 * @route POST /api/cart/
 * @description Add item to cart
 * @access Private - Requires authentication
 */
export const addItemDocs = {
  endpoint: '/',
  method: 'POST',
  summary: 'Add Item to Cart',
  description: 'Add a product variant to the user\'s cart. Automatically updates prices and quantities.',
  access: 'Authenticated Users',
  body: {
    productVariantId: {
      type: 'string',
      required: true,
      example: '507f1f77bcf86cd799439022',
      description: 'Product variant ID to add'
    }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439055',
          items: [
            {
              productVariantId: '507f1f77bcf86cd799439022',
              cartQuantity: 1
            }
          ],
          totalPrice: 1000,
          finalPrice: 900
        },
        message: 'add item to cart successfully'
      }
    },
    error: {
      status: 400,
      body: { success: false, message: 'This product variant is out of stock' }
    }
  },
  examples: [
    {
      name: 'Add single item',
      body: {
        productVariantId: '507f1f77bcf86cd799439022'
      }
    }
  ]
};

/**
 * @route PATCH /api/cart/
 * @description Remove item from cart
 * @access Private - Requires authentication
 */
export const removeItemDocs = {
  endpoint: '/',
  method: 'PATCH',
  summary: 'Remove Item from Cart',
  description: 'Remove a product variant from the cart. Can remove one quantity or all.',
  access: 'Authenticated Users',
  body: {
    productVariantId: {
      type: 'string',
      required: true,
      example: '507f1f77bcf86cd799439022',
      description: 'Product variant ID to remove'
    },
    totalRemove: {
      type: 'boolean',
      default: false,
      example: false,
      description: 'If true, removes all quantity of the item'
    }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439055',
          items: [],
          totalPrice: 0,
          finalPrice: 0
        },
        message: 'remove item from cart successfully'
      }
    },
    error: {
      status: 400,
      body: { success: false, message: 'Product variant not found in cart' }
    }
  },
  examples: [
    {
      name: 'Remove one quantity',
      body: {
        productVariantId: '507f1f77bcf86cd799439022'
      }
    },
    {
      name: 'Remove all quantity',
      body: {
        productVariantId: '507f1f77bcf86cd799439022',
        totalRemove: true
      }
    }
  ]
};

/**
 * @route DELETE /api/cart/
 * @description Clear entire cart
 * @access Private - Requires authentication
 */
export const clearCartDocs = {
  endpoint: '/',
  method: 'DELETE',
  summary: 'Clear Cart',
  description: 'Remove all items from the user\'s cart and reset prices to zero.',
  access: 'Authenticated Users',
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439055',
          items: [],
          totalPrice: 0,
          finalPrice: 0,
          finalPriceAfterDiscount: 0
        },
        message: 'cart cleared successfully'
      }
    },
    error: {
      status: 401,
      body: { success: false, message: 'Authentication required' }
    }
  }
};

// ==================== QUICK REFERENCE ====================

export const cartEndpoints = {
  getCart: {
    method: 'GET',
    path: '/api/cart/',
    access: 'Authenticated Users',
    description: 'Get current user\'s cart'
  },
  addItem: {
    method: 'POST',
    path: '/api/cart/',
    access: 'Authenticated Users',
    description: 'Add item to cart'
  },
  removeItem: {
    method: 'PATCH',
    path: '/api/cart/',
    access: 'Authenticated Users',
    description: 'Remove item from cart'
  },
  clearCart: {
    method: 'DELETE',
    path: '/api/cart/',
    access: 'Authenticated Users',
    description: 'Clear entire cart'
  }
};

// ==================== VALIDATION RULES ====================

export const validationRules = {
  productVariantId: {
    required: true,
    format: 'MongoDB ObjectId',
    description: 'Product variant ID must exist and have stock',
    example: '507f1f77bcf86cd799439022'
  },
  cartQuantity: {
    default: 1,
    min: 1,
    type: 'number',
    description: 'Quantity in cart',
    note: 'Cannot exceed available stock'
  },
  totalRemove: {
    type: 'boolean',
    default: false,
    description: 'Remove all quantity of the item'
  },
  totalPrice: {
    type: 'number',
    description: 'Auto-calculated sum of all item prices without discounts'
  },
  finalPrice: {
    type: 'number',
    description: 'Auto-calculated sum of all item prices after discounts'
  }
};

// ==================== PERMISSION MATRIX ====================

export const permissionMatrix = {
  endpoints: {
    'GET /api/cart/': { user: 'own_only', admin: true, superAdmin: true },
    'POST /api/cart/': { user: 'own_only', admin: true, superAdmin: true },
    'PATCH /api/cart/': { user: 'own_only', admin: true, superAdmin: true },
    'DELETE /api/cart/': { user: 'own_only', admin: true, superAdmin: true }
  },
  fields: {
    items: { user: 'read_write', admin: 'read_write', superAdmin: 'read_write' },
    totalPrice: { user: 'read_write', admin: 'read_write', superAdmin: 'read_write' },
    finalPrice: { user: 'read_write', admin: 'read_write', superAdmin: 'read_write' }
  }
};

// ==================== CART CALCULATIONS ====================

export const cartCalculations = {
  title: 'Automatic Cart Calculations',
  description: 'Cart prices are automatically calculated and updated',
  calculations: {
    totalPrice: {
      formula: 'Σ(price × cartQuantity)',
      description: 'Sum of all item prices without discounts',
      example: '2 items × $1000 = $2000'
    },
    finalPrice: {
      formula: 'Σ(finalPrice × cartQuantity)',
      description: 'Sum of all item final prices after variant discounts',
      example: '2 items × $900 = $1800'
    },
    finalPriceAfterDiscount: {
      formula: 'Additional discounts applied',
      description: 'Final price after any additional cart-level discounts',
      example: '$1800 - $100 = $1700'
    },
    cartQuantity: {
      description: 'Auto-adjusts if quantity exceeds available stock',
      note: 'When adding item, if quantity > stock, it will be capped at stock quantity'
    },
    stockCheck: {
      description: 'Items with 0 stock are automatically removed from cart',
      note: 'During updateCart, items with quantity > stock are adjusted or removed'
    }
  }
};

// ==================== ERROR CODES ====================

export const cartErrorCodes = {
  '400': {
    code: 'BAD_REQUEST',
    examples: [
      'Product variant is required',
      'Product variant not found',
      'This product variant is out of stock',
      'Max quantity of this item is 5',
      'Product variant not found in cart'
    ]
  },
  '401': {
    code: 'UNAUTHORIZED',
    example: 'Authentication required'
  },
  '403': {
    code: 'FORBIDDEN',
    example: 'You do not have permission'
  },
  '404': {
    code: 'NOT_FOUND',
    examples: [
      'Cart not found',
      'Item not found in cart'
    ]
  }
};

// ==================== RESPONSE TEMPLATES ====================

export const responseTemplates = {
  getCartSuccess: {
    success: true,
    data: {
      _id: '507f1f77bcf86cd799439055',
      userId: '507f1f77bcf86cd799439066',
      items: [
        {
          productId: {
            _id: '507f1f77bcf86cd799439011',
            title: 'Samsung Galaxy S24',
            images: ['image1.jpg'],
            slug: 'samsung-galaxy-s24'
          },
          productVariantId: {
            _id: '507f1f77bcf86cd799439022',
            price: 1000,
            finalPrice: 900,
            discountPercent: 10
          },
          brandId: { _id: '507f1f77bcf86cd799439044', title: 'Samsung' },
          categoryIds: [{ _id: '507f1f77bcf86cd799439055', title: 'Smartphones' }],
          cartQuantity: 2
        }
      ],
      totalPrice: 2000,
      finalPrice: 1800,
      finalPriceAfterDiscount: 1800,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  },
  addItemSuccess: {
    success: true,
    data: {
      _id: '507f1f77bcf86cd799439055',
      items: [{ productVariantId: '507f1f77bcf86cd799439022', cartQuantity: 1 }],
      totalPrice: 1000,
      finalPrice: 900
    },
    message: 'add item to cart successfully'
  },
  removeItemSuccess: {
    success: true,
    data: {
      _id: '507f1f77bcf86cd799439055',
      items: [],
      totalPrice: 0,
      finalPrice: 0
    },
    message: 'remove item from cart successfully'
  },
  clearCartSuccess: {
    success: true,
    data: {
      _id: '507f1f77bcf86cd799439055',
      items: [],
      totalPrice: 0,
      finalPrice: 0,
      finalPriceAfterDiscount: 0
    },
    message: 'cart cleared successfully'
  }
};

// ==================== DEFAULT EXPORT ====================

export default {
  cartSchemas,
  getCartDocs,
  addItemDocs,
  removeItemDocs,
  clearCartDocs,
  cartEndpoints,
  cartCalculations,
  validationRules,
  permissionMatrix,
  cartErrorCodes,
  responseTemplates
};