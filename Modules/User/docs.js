/**
 * User Management API Documentation
 * Base URL: /api/users
 * All endpoints require authentication and admin privileges (except viewing own profile)
 */

// ==================== COMMON SCHEMAS ====================

export const userSchemas = {
  User: {
    type: "object",
    properties: {
      _id: {
        type: "string",
        example: "507f1f77bcf86cd799439011",
        description: "MongoDB ObjectId",
      },
      phoneNumber: {
        type: "string",
        pattern: "^(\\+98|0)?9\\d{9}$",
        example: "09123456789",
        description: "Iranian mobile number",
      },
      fullName: {
        type: "string",
        example: "John Doe",
        description: "User full name",
      },
      role: {
        type: "string",
        enum: ["user", "admin", "superAdmin"],
        example: "user",
        description: "User role and permissions",
      },
      isActive: {
        type: "boolean",
        example: true,
        description: "Account status",
      },
      birthYear: {
        type: "string",
        format: "date",
        example: "1990-01-01",
        description: "User birth date",
      },
      ratedProductIds: {
        type: "array",
        items: { type: "string" },
        description: "Products rated by user",
        example: ["507f1f77bcf86cd799439011"],
      },
      favoriteProductIds: {
        type: "array",
        items: { type: "string" },
        description: "Products marked as favorite by user",
        example: ["507f1f77bcf86cd799439011"],
      },
      boughtProductIds: {
        type: "array",
        items: { type: "string" },
        description: "Products purchased by user",
        example: ["507f1f77bcf86cd799439011"],
      },
      cartId: {
        type: "string",
        example: "507f1f77bcf86cd799439011",
        description: "User cart reference",
      },
      addressIds: {
        type: "array",
        items: { type: "string" },
        description: "User saved addresses",
        example: ["507f1f77bcf86cd799439011"],
      },
      createdAt: {
        type: "string",
        format: "date-time",
        example: "2024-01-01T00:00:00.000Z",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        example: "2024-01-01T00:00:00.000Z",
      },
    },
  },

  UserResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      count: {
        type: "number",
        example: 10,
        description: "Total number of users (for getAll)",
      },
      data: {
        type: "array",
        items: { $ref: "#/components/schemas/User" },
      },
    },
  },

  SingleUserResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      data: {
        $ref: "#/components/schemas/User",
      },
    },
  },

  UpdateUserRequest: {
    type: "object",
    properties: {
      fullName: {
        type: "string",
        minLength: 2,
        maxLength: 100,
        example: "John Doe",
        description: "User full name",
      },
      birthYear: {
        type: "string",
        format: "date",
        example: "1990-01-01",
        description: "User birth date (ISO 8601 format)",
      },
      role: {
        type: "string",
        enum: ["admin", "superAdmin", "user"],
        example: "user",
        description: "User role (only superAdmin can change)",
      },
      isActive: {
        type: "boolean",
        example: true,
        description: "Account status (only admin/superAdmin can change)",
      },
    },
  },

  ChangePasswordRequest: {
    type: "object",
    required: ["newPassword"],
    properties: {
      oldPassword: {
        type: "string",
        minLength: 8,
        example: "OldSecurePass123",
        description: "Current password (required for users with password)",
      },
      newPassword: {
        type: "string",
        minLength: 8,
        pattern: "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])",
        example: "NewSecurePass123",
        description:
          "New password (must contain uppercase, lowercase, and number)",
      },
      confirmPassword: {
        type: "string",
        minLength: 8,
        example: "NewSecurePass123",
        description: "Must match newPassword",
      },
    },
  },

  ErrorResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: false,
      },
      message: {
        type: "string",
        example: "User not found",
      },
    },
  },
};

// ==================== ENDPOINT DOCUMENTATION ====================

/**
 * @route GET /api/users/
 * @description Get all users with filtering, sorting, and pagination
 * @access Private - Admin and SuperAdmin only
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10, max: 1000)
 * @query {string} sort - Sort field with prefix (- for desc, + for asc)
 * @query {string} fields - Comma-separated fields to include/exclude
 * @query {string} q - Search query (searches phoneNumber and fullName)
 * @query {string} populate - Relations to populate
 * @query {string} [filter] - Additional filters (e.g., role=admin, isActive=true)
 */
export const getAllUsersDocs = {
  endpoint: "/",
  method: "GET",
  summary: "Get All Users",
  description:
    "Retrieve a list of all users with advanced filtering, sorting, and pagination capabilities. Admin access only.",
  access: "Admin, SuperAdmin",
  queryParams: {
    page: {
      type: "number",
      required: false,
      default: 1,
      example: 2,
      description: "Page number for pagination",
    },
    limit: {
      type: "number",
      required: false,
      default: 10,
      max: 1000,
      example: 20,
      description: "Number of items per page",
    },
    sort: {
      type: "string",
      required: false,
      example: "-createdAt",
      description: "Sort field with prefix (- for descending, + for ascending)",
    },
    fields: {
      type: "string",
      required: false,
      example: "fullName,phoneNumber,role",
      description:
        "Comma-separated fields to include or exclude (prefix with -)",
    },
    q: {
      type: "string",
      required: false,
      example: "john",
      description: "Search query for phoneNumber and fullName",
    },
    populate: {
      type: "string",
      required: false,
      example: "cartId,addressIds",
      description: "Relations to populate",
    },
    role: {
      type: "string",
      required: false,
      enum: ["user", "admin", "superAdmin"],
      example: "admin",
      description: "Filter by user role",
    },
    isActive: {
      type: "boolean",
      required: false,
      example: true,
      description: "Filter by account status",
    },
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        count: 10,
        data: [
          {
            _id: "507f1f77bcf86cd799439011",
            phoneNumber: "09123456789",
            fullName: "John Doe",
            role: "user",
            isActive: true,
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
          },
        ],
      },
    },
    error: {
      status: 403,
      body: {
        success: false,
        message: "You do not have permission to access this resource",
      },
    },
  },
  examples: [
    {
      name: "Basic pagination",
      query: "?page=2&limit=20",
      description: "Get second page with 20 items per page",
    },
    {
      name: "Filter by role",
      query: "?role=admin&sort=-createdAt",
      description: "Get all admins sorted by creation date (newest first)",
    },
    {
      name: "Search users",
      query: "?q=john&fields=fullName,phoneNumber",
      description:
        'Search for users with "john" and return only name and phone',
    },
    {
      name: "Populate relations",
      query: "?populate=cartId,addressIds&isActive=true",
      description: "Get active users with their cart and addresses populated",
    },
  ],
};

/**
 * @route GET /api/users/:id
 * @description Get a single user by ID
 * @access Private - Admin, SuperAdmin, or Own Profile
 * @param {string} id - User ID (MongoDB ObjectId)
 * @query {string} fields - Comma-separated fields to include/exclude
 * @query {string} populate - Relations to populate
 */
export const getSingleUserDocs = {
  endpoint: "/:id",
  method: "GET",
  summary: "Get Single User",
  description:
    "Retrieve detailed information about a specific user. Regular users can only view their own profile.",
  access: "Admin, SuperAdmin, or Own Profile",
  params: {
    id: {
      type: "string",
      required: true,
      pattern: "^[0-9a-fA-F]{24}$",
      example: "507f1f77bcf86cd799439011",
      description: "MongoDB ObjectId of the user",
    },
  },
  queryParams: {
    fields: {
      type: "string",
      required: false,
      example: "fullName,phoneNumber,role,favoriteProductIds",
      description:
        "Comma-separated fields to include or exclude (prefix with -)",
    },
    populate: {
      type: "string",
      required: false,
      example: "favoriteProductIds",
      description: "Relations to populate",
    },
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        data: {
          _id: "507f1f77bcf86cd799439011",
          phoneNumber: "09123456789",
          fullName: "John Doe",
          role: "user",
          isActive: true,
          birthYear: "1990-01-01T00:00:00.000Z",
          favoriteProductIds: [
            {
              _id: "507f1f77bcf86cd799439022",
              title: "Product Name",
              minPrice: 100,
              maxPrice: 200,
              variantIds: ["507f1f77bcf86cd799439033"],
            },
          ],
          cartId: "507f1f77bcf86cd799439044",
          addressIds: ["507f1f77bcf86cd799439055"],
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      },
    },
    error: {
      status: 404,
      body: {
        success: false,
        message: "User not found",
      },
    },
  },
  examples: [
    {
      name: "Get user with populated favorites",
      query: "?populate=favoriteProductIds",
      description: "Get user with their favorite products populated",
    },
    {
      name: "Select specific fields",
      query: "?fields=fullName,phoneNumber",
      description: "Return only name and phone number",
    },
  ],
};

/**
 * @route PATCH /api/users/:id
 * @description Update user information
 * @access Private - Admin, SuperAdmin, or Own Profile
 * @param {string} id - User ID (MongoDB ObjectId)
 * @body {string} fullName - User full name
 * @body {string} birthYear - User birth date (ISO 8601)
 * @body {string} role - User role (only SuperAdmin)
 * @body {boolean} isActive - Account status (only Admin/SuperAdmin)
 */
export const updateUserDocs = {
  endpoint: "/:id",
  method: "PATCH",
  summary: "Update User",
  description:
    "Update user information. Admin can update all fields except role. SuperAdmin can update all fields. Regular users can only update their own profile (fullName and birthYear).",
  access: "Admin, SuperAdmin, or Own Profile",
  params: {
    id: {
      type: "string",
      required: true,
      pattern: "^[0-9a-fA-F]{24}$",
      example: "507f1f77bcf86cd799439011",
    },
  },
  body: {
    fullName: {
      type: "string",
      required: false,
      minLength: 2,
      maxLength: 100,
      example: "John Updated Doe",
      description: "User full name",
    },
    birthYear: {
      type: "string",
      format: "date",
      required: false,
      example: "1991-01-01",
      description: "User birth date in ISO 8601 format",
    },
    role: {
      type: "string",
      enum: ["admin", "superAdmin", "user"],
      required: false,
      example: "admin",
      description: "User role (only SuperAdmin can modify)",
    },
    isActive: {
      type: "boolean",
      required: false,
      example: false,
      description: "Account status (only Admin/SuperAdmin can modify)",
    },
    phoneNumber: {
      type: "string",
      required: false,
      pattern: "^(\\+98|0)?9\\d{9}$",
      example: "09123456789",
      description: "User phone number (requires unique validation)",
    },
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        message: "user updated successfully",
        data: {
          _id: "507f1f77bcf86cd799439011",
          phoneNumber: "09123456789",
          fullName: "John Updated Doe",
          role: "admin",
          isActive: false,
          birthYear: "1991-01-01T00:00:00.000Z",
        },
      },
    },
    error: {
      status: 403,
      body: {
        success: false,
        message: "you do not have permission",
      },
    },
  },
  examples: [
    {
      name: "User updates own profile",
      body: {
        fullName: "John Updated Doe",
        birthYear: "1991-01-01",
      },
      description: "Regular user updating their own name and birth date",
    },
    {
      name: "Admin updates user status",
      body: {
        isActive: false,
      },
      description: "Admin deactivating a user account",
    },
    {
      name: "SuperAdmin updates role",
      body: {
        role: "admin",
        isActive: true,
      },
      description: "SuperAdmin promoting a user to admin",
    },
  ],
};

/**
 * @route PATCH /api/users/change-password/:id
 * @description Change user password
 * @access Private - Admin, SuperAdmin, or Own Profile
 * @param {string} id - User ID (MongoDB ObjectId)
 * @body {string} oldPassword - Current password (required for users with password)
 * @body {string} newPassword - New password
 * @body {string} confirmPassword - Confirm new password
 */
export const changePasswordDocs = {
  endpoint: "/change-password/:id",
  method: "PATCH",
  summary: "Change User Password",
  description:
    "Change user password. Users with existing password must provide old password. Admins can change any user's password without old password.",
  access: "Admin, SuperAdmin, or Own Profile",
  params: {
    id: {
      type: "string",
      required: true,
      pattern: "^[0-9a-fA-F]{24}$",
      example: "507f1f77bcf86cd799439011",
    },
  },
  body: {
    oldPassword: {
      type: "string",
      required: false,
      minLength: 8,
      example: "OldSecurePass123",
      description: "Current password (required for users with password)",
    },
    newPassword: {
      type: "string",
      required: true,
      minLength: 8,
      pattern: "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])",
      example: "NewSecurePass123",
      description: "New password must contain uppercase, lowercase, and number",
    },
    confirmPassword: {
      type: "string",
      required: false,
      minLength: 8,
      example: "NewSecurePass123",
      description: "Must match newPassword",
    },
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        message: "password updated successfully",
      },
    },
    error: {
      status: 400,
      body: {
        success: false,
        message: "old password required",
      },
    },
  },
  examples: [
    {
      name: "User changes password with old password",
      body: {
        oldPassword: "OldSecurePass123",
        newPassword: "NewSecurePass123",
        confirmPassword: "NewSecurePass123",
      },
      description: "User with password changing to a new password",
    },
    {
      name: "Admin changes user password",
      body: {
        newPassword: "AdminSetPass123",
        confirmPassword: "AdminSetPass123",
      },
      description: "Admin resetting a user's password without old password",
    },
  ],
};

// ==================== QUICK REFERENCE ====================

export const userEndpoints = {
  getAllUsers: {
    method: "GET",
    path: "/api/users/",
    access: "Admin, SuperAdmin",
    description: "Get all users with filtering, sorting, and pagination",
  },
  getSingleUser: {
    method: "GET",
    path: "/api/users/:id",
    access: "Admin, SuperAdmin, Own Profile",
    description: "Get specific user by ID",
  },
  updateUser: {
    method: "PATCH",
    path: "/api/users/:id",
    access: "Admin, SuperAdmin, Own Profile",
    description: "Update user information",
  },
  changePassword: {
    method: "PATCH",
    path: "/api/users/change-password/:id",
    access: "Admin, SuperAdmin, Own Profile",
    description: "Change user password",
  },
};

// ==================== PERMISSION MATRIX ====================

export const permissionMatrix = {
  endpoints: {
    "GET /api/users/": {
      user: false,
      admin: true,
      superAdmin: true,
    },
    "GET /api/users/:id": {
      user: "own_only",
      admin: true,
      superAdmin: true,
    },
    "PATCH /api/users/:id": {
      user: "own_only",
      admin: true,
      superAdmin: true,
    },
    "PATCH /api/users/change-password/:id": {
      user: "own_only",
      admin: true,
      superAdmin: true,
    },
  },
  fields: {
    fullName: {
      user: "own_only",
      admin: true,
      superAdmin: true,
    },
    birthYear: {
      user: "own_only",
      admin: true,
      superAdmin: true,
    },
    role: {
      user: false,
      admin: false,
      superAdmin: true,
    },
    isActive: {
      user: false,
      admin: true,
      superAdmin: true,
    },
    phoneNumber: {
      user: false,
      admin: true,
      superAdmin: true,
    },
  },
};

// ==================== VALIDATION RULES SUMMARY ====================

export const validationRules = {
  phoneNumber: {
    pattern: "^(\\+98|0)?9\\d{9}$",
    description: "Iranian mobile number format",
    examples: ["09123456789", "09381234567", "+989381234567"],
  },
  password: {
    minLength: 8,
    pattern: "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])",
    description:
      "At least 8 characters, one uppercase, one lowercase, one number",
    example: "SecurePass123",
  },
  fullName: {
    minLength: 2,
    maxLength: 100,
    pattern: "^[\\u0600-\\u06FF\\sa-zA-Z]+$",
    description: "Letters and spaces only (supports Persian and English)",
    example: "John Doe",
  },
  birthYear: {
    format: "ISO 8601",
    min: "1900-01-01",
    max: "present",
    example: "1990-01-01",
  },
  role: {
    enum: ["user", "admin", "superAdmin"],
    default: "user",
  },
  userId: {
    format: "MongoDB ObjectId",
    pattern: "^[0-9a-fA-F]{24}$",
    example: "507f1f77bcf86cd799439011",
  },
};

// ==================== ERROR CODES ====================

export const userErrorCodes = {
  400: {
    code: "BAD_REQUEST",
    description: "Invalid input format or validation failed",
    examples: [
      "Invalid phone number format",
      "Password must be at least 8 characters",
      "Invalid user ID format",
    ],
  },
  401: {
    code: "UNAUTHORIZED",
    description: "Authentication required",
    example: "No token provided",
  },
  403: {
    code: "FORBIDDEN",
    description: "Insufficient permissions",
    examples: [
      "You do not have permission to access this resource",
      "Only superAdmin can change role",
    ],
  },
  404: {
    code: "NOT_FOUND",
    description: "User not found",
    example: "User not found with ID: 507f1f77bcf86cd799439011",
  },
  409: {
    code: "CONFLICT",
    description: "Duplicate entry",
    example: "Phone number already taken",
  },
  500: {
    code: "INTERNAL_SERVER_ERROR",
    description: "Server error",
    example: "Database connection error",
  },
};

// ==================== DEFAULT EXPORT ====================

export default {
  userSchemas,
  getAllUsersDocs,
  getSingleUserDocs,
  updateUserDocs,
  changePasswordDocs,
  userEndpoints,
  permissionMatrix,
  validationRules,
  userErrorCodes,
};
