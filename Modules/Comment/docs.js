/**
 * Comment Management API Documentation
 * Base URL: /api/comments
 */

// ==================== COMMON SCHEMAS ====================

export const commentSchemas = {
  Comment: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        example: '507f1f77bcf86cd799439011',
        description: 'MongoDB ObjectId'
      },
      productId: {
        type: 'string',
        example: '507f1f77bcf86cd799439022',
        description: 'Product ID this comment belongs to'
      },
      userId: {
        type: 'string',
        example: '507f1f77bcf86cd799439033',
        description: 'User ID who wrote the comment'
      },
      replyIds: {
        type: 'array',
        items: { type: 'string' },
        example: ['507f1f77bcf86cd799439044'],
        description: 'Array of reply comment IDs'
      },
      isReply: {
        type: 'boolean',
        default: false,
        example: false,
        description: 'Whether this is a reply to another comment'
      },
      content: {
        type: 'string',
        minLength: 3,
        maxLength: 1000,
        example: 'Great product! Highly recommend.',
        description: 'Comment content'
      },
      isPublished: {
        type: 'boolean',
        default: false,
        example: true,
        description: 'Whether comment is published (visible)'
      },
      rate: {
        type: 'number',
        min: 0,
        max: 5,
        example: 5,
        description: 'Rating (0-5), only for product comments'
      },
      role: {
        type: 'string',
        enum: ['user', 'admin'],
        default: 'user',
        example: 'user',
        description: 'Role of the commenter'
      },
      isBought: {
        type: 'boolean',
        default: false,
        example: true,
        description: 'Whether user bought the product'
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

  CommentResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      count: { type: 'number', example: 10 },
      data: { type: 'array', items: { $ref: '#/components/schemas/Comment' } }
    }
  },

  SingleCommentResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      data: { $ref: '#/components/schemas/Comment' }
    }
  },

  CreateCommentRequest: {
    type: 'object',
    required: ['productId', 'content'],
    properties: {
      productId: {
        type: 'string',
        required: true,
        example: '507f1f77bcf86cd799439022',
        description: 'Product ID'
      },
      content: {
        type: 'string',
        required: true,
        minLength: 3,
        maxLength: 1000,
        example: 'Great product!',
        description: 'Comment content'
      },
      rate: {
        type: 'number',
        min: 0,
        max: 5,
        example: 5,
        description: 'Rating (only if user bought the product)'
      }
    }
  },

  ReplyRequest: {
    type: 'object',
    required: ['content'],
    properties: {
      content: {
        type: 'string',
        required: true,
        minLength: 3,
        maxLength: 1000,
        example: 'Thank you for your feedback!',
        description: 'Reply content'
      }
    }
  },

  ErrorResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      message: { type: 'string', example: 'Comment not found' }
    }
  }
};

// ==================== ENDPOINT DOCUMENTATION ====================

/**
 * @route GET /api/comments/
 * @description Get all comments (Admin only)
 * @access Private - Admin and SuperAdmin only
 */
export const getAllCommentsDocs = {
  endpoint: '/',
  method: 'GET',
  summary: 'Get All Comments',
  description: 'Retrieve all comments across all products. Admin access only.',
  access: 'Admin, SuperAdmin',
  queryParams: {
    page: { type: 'number', default: 1, example: 2 },
    limit: { type: 'number', default: 10, max: 100, example: 20 },
    sort: { type: 'string', example: '-createdAt' },
    fields: { type: 'string', example: 'content,rate,isPublished' },
    isPublished: { type: 'boolean', example: true },
    isReply: { type: 'boolean', example: false },
    isBought: { type: 'boolean', example: true },
    rate: { type: 'number', min: 0, max: 5, example: 5 },
    role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
    populate: { type: 'string', example: 'userId,productId,replyIds' }
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
            productId: { _id: '507f1f77bcf86cd799439022', title: 'Product', images: [] },
            userId: { _id: '507f1f77bcf86cd799439033', phoneNumber: '09123456789', fullName: 'John Doe' },
            content: 'Great product!',
            rate: 5,
            isPublished: true,
            isBought: true,
            replyIds: [],
            createdAt: '2024-01-01T00:00:00.000Z'
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
 * @route GET /api/comments/:productId
 * @description Get all comments for a specific product
 * @access Public (published) / Admin (all)
 */
export const getProductCommentsDocs = {
  endpoint: '/:productId',
  method: 'GET',
  summary: 'Get Product Comments',
  description: 'Retrieve all comments for a specific product. Public users see only published comments.',
  access: 'Public (published), Admin, SuperAdmin (all)',
  params: {
    productId: {
      type: 'string',
      required: true,
      pattern: '^[0-9a-fA-F]{24}$',
      example: '507f1f77bcf86cd799439022'
    }
  },
  queryParams: {
    page: { type: 'number', default: 1 },
    limit: { type: 'number', default: 10, max: 100 },
    sort: { type: 'string', example: '-createdAt' },
    fields: { type: 'string', example: 'content,rate,userId' },
    isPublished: { type: 'boolean', example: true },
    rate: { type: 'number', min: 0, max: 5 },
    populate: { type: 'string', example: 'userId,replyIds' }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        count: 5,
        data: [
          {
            _id: '507f1f77bcf86cd799439011',
            content: 'Great product!',
            rate: 5,
            userId: { _id: '507f1f77bcf86cd799439033', fullName: 'John Doe' },
            isPublished: true,
            replyIds: [
              {
                _id: '507f1f77bcf86cd799439044',
                content: 'Thank you!',
                userId: { _id: '507f1f77bcf86cd799439055', fullName: 'Admin' }
              }
            ],
            createdAt: '2024-01-01T00:00:00.000Z'
          }
        ]
      }
    }
  }
};

/**
 * @route POST /api/comments/
 * @description Create a new comment
 * @access Private - Requires authentication
 */
export const createCommentDocs = {
  endpoint: '/',
  method: 'POST',
  summary: 'Create Comment',
  description: 'Create a new comment on a product. Users can rate only if they bought the product.',
  access: 'Authenticated Users',
  body: {
    productId: {
      type: 'string',
      required: true,
      example: '507f1f77bcf86cd799439022',
      description: 'Product ID'
    },
    content: {
      type: 'string',
      required: true,
      minLength: 3,
      maxLength: 1000,
      example: 'Excellent product! Very satisfied.',
      description: 'Comment content'
    },
    rate: {
      type: 'number',
      min: 0,
      max: 5,
      example: 5,
      description: 'Rating (only if user purchased the product)'
    }
  },
  responses: {
    success: {
      status: 201,
      body: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          productId: '507f1f77bcf86cd799439022',
          userId: '507f1f77bcf86cd799439033',
          content: 'Excellent product! Very satisfied.',
          rate: 5,
          isPublished: false,
          isBought: true,
          isReply: false
        },
        message: 'comment Successfully created'
      }
    },
    error: {
      status: 400,
      body: { success: false, message: 'You have already rated this product' }
    }
  },
  examples: [
    {
      name: 'Comment without rating',
      body: {
        productId: '507f1f77bcf86cd799439022',
        content: 'Nice product!'
      }
    },
    {
      name: 'Comment with rating',
      body: {
        productId: '507f1f77bcf86cd799439022',
        content: 'Excellent product!',
        rate: 5
      }
    }
  ]
};

/**
 * @route PATCH /api/comments/:id
 * @description Toggle comment publish status (Admin only)
 * @access Private - Admin and SuperAdmin only
 */
export const togglePublishCommentDocs = {
  endpoint: '/:id',
  method: 'PATCH',
  summary: 'Toggle Comment Publish Status',
  description: 'Publish or unpublish a comment. Admin access only.',
  access: 'Admin, SuperAdmin',
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
          isPublished: true
        },
        message: 'comment Successfully updated'
      }
    },
    error: {
      status: 404,
      body: { success: false, message: 'Comment not found' }
    }
  }
};

/**
 * @route DELETE /api/comments/:id
 * @description Delete a comment and its replies
 * @access Private - Admin and SuperAdmin only
 */
export const deleteCommentDocs = {
  endpoint: '/:id',
  method: 'DELETE',
  summary: 'Delete Comment',
  description: 'Delete a comment and all its replies. Admin access only.',
  access: 'Admin, SuperAdmin',
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
        message: 'comment Successfully deleted'
      }
    },
    error: {
      status: 404,
      body: { success: false, message: 'Comment not found' }
    }
  }
};

/**
 * @route POST /api/comments/reply/:commentId
 * @description Reply to a comment
 * @access Private - Admin and SuperAdmin only
 */
export const replyCommentDocs = {
  endpoint: '/reply/:commentId',
  method: 'POST',
  summary: 'Reply to Comment',
  description: 'Create a reply to an existing comment. Admin access only.',
  access: 'Admin, SuperAdmin',
  params: {
    commentId: {
      type: 'string',
      required: true,
      pattern: '^[0-9a-fA-F]{24}$',
      example: '507f1f77bcf86cd799439011'
    }
  },
  body: {
    content: {
      type: 'string',
      required: true,
      minLength: 3,
      maxLength: 1000,
      example: 'Thank you for your feedback! We appreciate it.',
      description: 'Reply content'
    }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439044',
          content: 'Thank you for your feedback!',
          isReply: true,
          isPublished: true
        },
        message: 'comment replied Successfully'
      }
    },
    error: {
      status: 404,
      body: { success: false, message: 'Comment not found' }
    }
  }
};

// ==================== QUICK REFERENCE ====================

export const commentEndpoints = {
  getAllComments: {
    method: 'GET',
    path: '/api/comments/',
    access: 'Admin, SuperAdmin',
    description: 'Get all comments (admin only)'
  },
  getProductComments: {
    method: 'GET',
    path: '/api/comments/:productId',
    access: 'Public, Admin',
    description: 'Get comments for a specific product'
  },
  createComment: {
    method: 'POST',
    path: '/api/comments/',
    access: 'Authenticated Users',
    description: 'Create a new comment'
  },
  togglePublish: {
    method: 'PATCH',
    path: '/api/comments/:id',
    access: 'Admin, SuperAdmin',
    description: 'Toggle comment publish status'
  },
  deleteComment: {
    method: 'DELETE',
    path: '/api/comments/:id',
    access: 'Admin, SuperAdmin',
    description: 'Delete comment and replies'
  },
  replyComment: {
    method: 'POST',
    path: '/api/comments/reply/:commentId',
    access: 'Admin, SuperAdmin',
    description: 'Reply to a comment'
  }
};

// ==================== VALIDATION RULES ====================

export const validationRules = {
  content: {
    minLength: 3,
    maxLength: 1000,
    required: true,
    example: 'Great product!',
    description: 'Comment or reply content'
  },
  rate: {
    min: 0,
    max: 5,
    type: 'number',
    example: 5,
    description: 'Rating (only for product comments)',
    note: 'User must have purchased the product'
  },
  productId: {
    format: 'MongoDB ObjectId',
    required: true,
    description: 'Product ID must exist'
  },
  isPublished: {
    type: 'boolean',
    default: false,
    description: 'Comment visibility status'
  },
  isReply: {
    type: 'boolean',
    default: false,
    description: 'Whether this is a reply'
  },
  role: {
    enum: ['user', 'admin'],
    default: 'user',
    description: 'Role of the commenter'
  }
};

// ==================== PERMISSION MATRIX ====================

export const permissionMatrix = {
  endpoints: {
    'GET /api/comments/': { user: false, admin: true, superAdmin: true },
    'GET /api/comments/:productId': { public: 'published_only', user: 'published_only', admin: true, superAdmin: true },
    'POST /api/comments/': { user: true, admin: true, superAdmin: true },
    'PATCH /api/comments/:id': { user: false, admin: true, superAdmin: true },
    'DELETE /api/comments/:id': { user: false, admin: true, superAdmin: true },
    'POST /api/comments/reply/:commentId': { user: false, admin: true, superAdmin: true }
  },
  fields: {
    content: { public: 'read', user: 'read_write', admin: 'read_write', superAdmin: 'read_write' },
    rate: { public: 'read', user: 'read_write', admin: 'read_write', superAdmin: 'read_write' },
    isPublished: { public: 'read', user: 'read', admin: 'read_write', superAdmin: 'read_write' },
    isBought: { public: 'read', user: 'read', admin: 'read_write', superAdmin: 'read_write' }
  }
};

// ==================== ERROR CODES ====================

export const commentErrorCodes = {
  '400': {
    code: 'BAD_REQUEST',
    examples: [
      'Content must be between 3 to 1000 characters',
      'Rate must be between 0 and 5',
      'You have already rated this product',
      'You can only rate products you have purchased'
    ]
  },
  '401': { code: 'UNAUTHORIZED', example: 'Authentication required' },
  '403': { code: 'FORBIDDEN', example: 'You do not have permission' },
  '404': { code: 'NOT_FOUND', example: 'Comment not found' }
};

// ==================== RESPONSE TEMPLATES ====================

export const responseTemplates = {
  getAllSuccess: {
    success: true,
    count: 10,
    data: [
      {
        _id: '507f1f77bcf86cd799439011',
        productId: { _id: '507f1f77bcf86cd799439022', title: 'Product' },
        userId: { _id: '507f1f77bcf86cd799439033', fullName: 'John Doe', phoneNumber: '09123456789' },
        content: 'Great product!',
        rate: 5,
        isPublished: true,
        isBought: true,
        replyIds: [],
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    ]
  },
  getProductCommentsSuccess: {
    success: true,
    count: 5,
    data: [
      {
        _id: '507f1f77bcf86cd799439011',
        content: 'Great product!',
        rate: 5,
        userId: { _id: '507f1f77bcf86cd799439033', fullName: 'John Doe' },
        isPublished: true,
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    ]
  },
  createSuccess: {
    success: true,
    data: {
      _id: '507f1f77bcf86cd799439011',
      productId: '507f1f77bcf86cd799439022',
      userId: '507f1f77bcf86cd799439033',
      content: 'Excellent product!',
      rate: 5,
      isPublished: false,
      isBought: true
    },
    message: 'comment Successfully created'
  },
  replySuccess: {
    success: true,
    data: {
      _id: '507f1f77bcf86cd799439044',
      content: 'Thank you for your feedback!',
      isReply: true,
      isPublished: true
    },
    message: 'comment replied Successfully'
  },
  deleteSuccess: {
    success: true,
    message: 'comment Successfully deleted'
  },
  toggleSuccess: {
    success: true,
    data: { _id: '507f1f77bcf86cd799439011', isPublished: true },
    message: 'comment Successfully updated'
  }
};

// ==================== DEFAULT EXPORT ====================

export default {
  commentSchemas,
  getAllCommentsDocs,
  getProductCommentsDocs,
  createCommentDocs,
  togglePublishCommentDocs,
  deleteCommentDocs,
  replyCommentDocs,
  commentEndpoints,
  validationRules,
  permissionMatrix,
  commentErrorCodes,
  responseTemplates
};