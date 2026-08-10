/**
 * Address Management API Documentation
 * Base URL: /api/addresses
 * All endpoints require authentication (isLogin middleware)
 */

// ==================== COMMON SCHEMAS ====================

export const addressSchemas = {
  Address: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        example: '507f1f77bcf86cd799439011',
        description: 'MongoDB ObjectId'
      },
      userId: {
        type: 'string',
        example: '507f1f77bcf86cd799439022',
        description: 'User ID who owns this address'
      },
      title: {
        type: 'string',
        minLength: 2,
        maxLength: 100,
        example: 'Home',
        description: 'Address title (e.g., Home, Office)'
      },
      description: {
        type: 'string',
        minLength: 5,
        maxLength: 500,
        example: 'No. 123, Main Street, Apartment 4B',
        description: 'Full address description'
      },
      city: {
        type: 'string',
        minLength: 2,
        maxLength: 50,
        example: 'Tehran',
        description: 'City name'
      },
      province: {
        type: 'string',
        minLength: 2,
        maxLength: 50,
        example: 'Tehran',
        description: 'Province/State name'
      },
      lat: {
        type: 'string',
        example: '35.6892',
        description: 'Latitude coordinate'
      },
      lng: {
        type: 'string',
        example: '51.3890',
        description: 'Longitude coordinate'
      },
      receiverPhoneNumber: {
        type: 'string',
        pattern: '^(\\+98|0)?9\\d{9}$',
        example: '09123456789',
        description: 'Receiver phone number'
      },
      receiverFullName: {
        type: 'string',
        minLength: 2,
        maxLength: 100,
        example: 'John Doe',
        description: 'Receiver full name'
      },
      postalCode: {
        type: 'string',
        pattern: '^\\d{10}$',
        example: '1234567890',
        description: 'Postal code (10 digits)'
      },
      isDefault: {
        type: 'boolean',
        default: false,
        example: true,
        description: 'Is this the default address'
      },
      unitNumber: {
        type: 'string',
        default: '',
        example: '4B',
        description: 'Unit/Apartment number (optional)'
      },
      floor: {
        type: 'string',
        default: '',
        example: '4',
        description: 'Floor number (optional)'
      },
      plateNumber: {
        type: 'string',
        minLength: 1,
        maxLength: 20,
        example: '123',
        description: 'Plate/Building number'
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

  AddressResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      count: {
        type: 'number',
        example: 5,
        description: 'Total number of addresses (for getAll)'
      },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Address' }
      }
    }
  },

  SingleAddressResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      data: {
        $ref: '#/components/schemas/Address'
      }
    }
  },

  CreateAddressRequest: {
    type: 'object',
    required: [
      'title', 'description', 'city', 'province', 
      'lat', 'lng', 'receiverPhoneNumber', 'receiverFullName',
      'postalCode', 'plateNumber'
    ],
    properties: {
      title: {
        type: 'string',
        minLength: 2,
        maxLength: 100,
        example: 'Home',
        description: 'Address title'
      },
      description: {
        type: 'string',
        minLength: 5,
        maxLength: 500,
        example: 'No. 123, Main Street, Apartment 4B',
        description: 'Full address description'
      },
      city: {
        type: 'string',
        minLength: 2,
        maxLength: 50,
        example: 'Tehran',
        description: 'City name'
      },
      province: {
        type: 'string',
        minLength: 2,
        maxLength: 50,
        example: 'Tehran',
        description: 'Province/State name'
      },
      lat: {
        type: 'string',
        example: '35.6892',
        description: 'Latitude coordinate'
      },
      lng: {
        type: 'string',
        example: '51.3890',
        description: 'Longitude coordinate'
      },
      receiverPhoneNumber: {
        type: 'string',
        pattern: '^(\\+98|0)?9\\d{9}$',
        example: '09123456789',
        description: 'Receiver phone number'
      },
      receiverFullName: {
        type: 'string',
        minLength: 2,
        maxLength: 100,
        example: 'John Doe',
        description: 'Receiver full name'
      },
      postalCode: {
        type: 'string',
        pattern: '^\\d{10}$',
        example: '1234567890',
        description: 'Postal code (10 digits)'
      },
      isDefault: {
        type: 'boolean',
        default: false,
        example: true,
        description: 'Set as default address'
      },
      unitNumber: {
        type: 'string',
        maxLength: 20,
        example: '4B',
        description: 'Unit/Apartment number (optional)'
      },
      floor: {
        type: 'string',
        maxLength: 10,
        example: '4',
        description: 'Floor number (optional)'
      },
      plateNumber: {
        type: 'string',
        minLength: 1,
        maxLength: 20,
        example: '123',
        description: 'Plate/Building number'
      }
    }
  },

  UpdateAddressRequest: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        minLength: 2,
        maxLength: 100,
        example: 'Office',
        description: 'Address title'
      },
      description: {
        type: 'string',
        minLength: 5,
        maxLength: 500,
        example: 'No. 456, Business Street, Floor 7',
        description: 'Full address description'
      },
      city: {
        type: 'string',
        minLength: 2,
        maxLength: 50,
        example: 'Tehran',
        description: 'City name'
      },
      province: {
        type: 'string',
        minLength: 2,
        maxLength: 50,
        example: 'Tehran',
        description: 'Province/State name'
      },
      lat: {
        type: 'string',
        example: '35.6892',
        description: 'Latitude coordinate'
      },
      lng: {
        type: 'string',
        example: '51.3890',
        description: 'Longitude coordinate'
      },
      receiverPhoneNumber: {
        type: 'string',
        pattern: '^(\\+98|0)?9\\d{9}$',
        example: '09123456789',
        description: 'Receiver phone number'
      },
      receiverFullName: {
        type: 'string',
        minLength: 2,
        maxLength: 100,
        example: 'Jane Doe',
        description: 'Receiver full name'
      },
      postalCode: {
        type: 'string',
        pattern: '^\\d{10}$',
        example: '1234567890',
        description: 'Postal code (10 digits)'
      },
      isDefault: {
        type: 'boolean',
        example: false,
        description: 'Set as default address'
      },
      unitNumber: {
        type: 'string',
        maxLength: 20,
        example: '7A',
        description: 'Unit/Apartment number (optional)'
      },
      floor: {
        type: 'string',
        maxLength: 10,
        example: '7',
        description: 'Floor number (optional)'
      },
      plateNumber: {
        type: 'string',
        minLength: 1,
        maxLength: 20,
        example: '456',
        description: 'Plate/Building number'
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
        example: 'Address not found'
      }
    }
  }
};

// ==================== ENDPOINT DOCUMENTATION ====================

/**
 * @route GET /api/addresses/
 * @description Get all addresses for authenticated user
 * @access Private - Requires authentication
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10, max: 100)
 * @query {string} sort - Sort field with prefix (- for desc, + for asc)
 * @query {string} fields - Comma-separated fields to include/exclude
 * @query {string} q - Search query (searches title)
 * @query {string} city - Filter by city
 * @query {string} province - Filter by province
 * @query {boolean} isDefault - Filter by default status
 */
export const getAllAddressesDocs = {
  endpoint: '/',
  method: 'GET',
  summary: 'Get All Addresses',
  description: 'Retrieve all addresses for the authenticated user. Admin can view all users\' addresses.',
  access: 'Authenticated Users, Admin, SuperAdmin',
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
      example: 'title,city,province,isDefault',
      description: 'Comma-separated fields to include or exclude (prefix with -)'
    },
    q: {
      type: 'string',
      required: false,
      example: 'home',
      description: 'Search query for address title'
    },
    city: {
      type: 'string',
      required: false,
      example: 'Tehran',
      description: 'Filter by city'
    },
    province: {
      type: 'string',
      required: false,
      example: 'Tehran',
      description: 'Filter by province'
    },
    isDefault: {
      type: 'boolean',
      required: false,
      example: true,
      description: 'Filter by default status'
    }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        count: 3,
        data: [
          {
            _id: '507f1f77bcf86cd799439011',
            userId: {
              _id: '507f1f77bcf86cd799439022',
              fullName: 'John Doe',
              phoneNumber: '09123456789'
            },
            title: 'Home',
            description: 'No. 123, Main Street, Apartment 4B',
            city: 'Tehran',
            province: 'Tehran',
            lat: '35.6892',
            lng: '51.3890',
            receiverPhoneNumber: '09123456789',
            receiverFullName: 'John Doe',
            postalCode: '1234567890',
            isDefault: true,
            unitNumber: '4B',
            floor: '4',
            plateNumber: '123',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          }
        ]
      }
    },
    error: {
      status: 401,
      body: {
        success: false,
        message: 'Authentication required'
      }
    }
  },
  examples: [
    {
      name: 'Get all addresses',
      query: '',
      description: 'Get all addresses for authenticated user'
    },
    {
      name: 'Filter by city',
      query: '?city=Tehran&isDefault=true',
      description: 'Get default address in Tehran'
    },
    {
      name: 'Search addresses',
      query: '?q=home&fields=title,city,province',
      description: 'Search addresses containing "home"'
    },
    {
      name: 'Pagination',
      query: '?page=2&limit=5',
      description: 'Get second page with 5 items per page'
    }
  ]
};

/**
 * @route GET /api/addresses/:id
 * @description Get a single address by ID
 * @access Private - Requires authentication
 * @param {string} id - Address ID (MongoDB ObjectId)
 */
export const getSingleAddressDocs = {
  endpoint: '/:id',
  method: 'GET',
  summary: 'Get Single Address',
  description: 'Retrieve detailed information about a specific address. Users can only access their own addresses.',
  access: 'Authenticated Users, Admin, SuperAdmin',
  params: {
    id: {
      type: 'string',
      required: true,
      pattern: '^[0-9a-fA-F]{24}$',
      example: '507f1f77bcf86cd799439011',
      description: 'MongoDB ObjectId of the address'
    }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          userId: {
            _id: '507f1f77bcf86cd799439022',
            fullName: 'John Doe',
            phoneNumber: '09123456789'
          },
          title: 'Home',
          description: 'No. 123, Main Street, Apartment 4B',
          city: 'Tehran',
          province: 'Tehran',
          lat: '35.6892',
          lng: '51.3890',
          receiverPhoneNumber: '09123456789',
          receiverFullName: 'John Doe',
          postalCode: '1234567890',
          isDefault: true,
          unitNumber: '4B',
          floor: '4',
          plateNumber: '123',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      }
    },
    error: {
      status: 404,
      body: {
        success: false,
        message: 'Address not found'
      }
    }
  }
};

/**
 * @route POST /api/addresses/
 * @description Create a new address
 * @access Private - Requires authentication
 * @body {string} title - Address title (required)
 * @body {string} description - Full address (required)
 * @body {string} city - City name (required)
 * @body {string} province - Province name (required)
 * @body {string} lat - Latitude (required)
 * @body {string} lng - Longitude (required)
 * @body {string} receiverPhoneNumber - Receiver phone (required)
 * @body {string} receiverFullName - Receiver full name (required)
 * @body {string} postalCode - Postal code (required, 10 digits)
 * @body {string} plateNumber - Plate/Building number (required)
 * @body {boolean} isDefault - Set as default (optional, default: false)
 * @body {string} unitNumber - Unit number (optional)
 * @body {string} floor - Floor number (optional)
 */
export const createAddressDocs = {
  endpoint: '/',
  method: 'POST',
  summary: 'Create New Address',
  description: 'Create a new address for the authenticated user. Only one default address allowed per user.',
  access: 'Authenticated Users',
  body: {
    title: {
      type: 'string',
      required: true,
      minLength: 2,
      maxLength: 100,
      example: 'Home',
      description: 'Address title'
    },
    description: {
      type: 'string',
      required: true,
      minLength: 5,
      maxLength: 500,
      example: 'No. 123, Main Street, Apartment 4B',
      description: 'Full address description'
    },
    city: {
      type: 'string',
      required: true,
      minLength: 2,
      maxLength: 50,
      example: 'Tehran',
      description: 'City name'
    },
    province: {
      type: 'string',
      required: true,
      minLength: 2,
      maxLength: 50,
      example: 'Tehran',
      description: 'Province/State name'
    },
    lat: {
      type: 'string',
      required: true,
      example: '35.6892',
      description: 'Latitude coordinate'
    },
    lng: {
      type: 'string',
      required: true,
      example: '51.3890',
      description: 'Longitude coordinate'
    },
    receiverPhoneNumber: {
      type: 'string',
      required: true,
      pattern: '^(\\+98|0)?9\\d{9}$',
      example: '09123456789',
      description: 'Receiver phone number'
    },
    receiverFullName: {
      type: 'string',
      required: true,
      minLength: 2,
      maxLength: 100,
      example: 'John Doe',
      description: 'Receiver full name'
    },
    postalCode: {
      type: 'string',
      required: true,
      pattern: '^\\d{10}$',
      example: '1234567890',
      description: 'Postal code (10 digits)'
    },
    isDefault: {
      type: 'boolean',
      required: false,
      default: false,
      example: true,
      description: 'Set as default address'
    },
    unitNumber: {
      type: 'string',
      required: false,
      maxLength: 20,
      example: '4B',
      description: 'Unit/Apartment number (optional)'
    },
    floor: {
      type: 'string',
      required: false,
      maxLength: 10,
      example: '4',
      description: 'Floor number (optional)'
    },
    plateNumber: {
      type: 'string',
      required: true,
      minLength: 1,
      maxLength: 20,
      example: '123',
      description: 'Plate/Building number'
    }
  },
  responses: {
    success: {
      status: 201,
      body: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          userId: '507f1f77bcf86cd799439022',
          title: 'Home',
          description: 'No. 123, Main Street, Apartment 4B',
          city: 'Tehran',
          province: 'Tehran',
          lat: '35.6892',
          lng: '51.3890',
          receiverPhoneNumber: '09123456789',
          receiverFullName: 'John Doe',
          postalCode: '1234567890',
          isDefault: true,
          unitNumber: '4B',
          floor: '4',
          plateNumber: '123',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        },
        message: 'address created successfully'
      }
    },
    error: {
      status: 400,
      body: {
        success: false,
        message: 'User already has a default address'
      }
    }
  },
  examples: [
    {
      name: 'Create home address',
      body: {
        title: 'Home',
        description: 'No. 123, Main Street, Apartment 4B',
        city: 'Tehran',
        province: 'Tehran',
        lat: '35.6892',
        lng: '51.3890',
        receiverPhoneNumber: '09123456789',
        receiverFullName: 'John Doe',
        postalCode: '1234567890',
        plateNumber: '123',
        unitNumber: '4B',
        floor: '4',
        isDefault: true
      },
      description: 'Create a new home address and set as default'
    },
    {
      name: 'Create office address',
      body: {
        title: 'Office',
        description: 'No. 456, Business Street, Floor 7',
        city: 'Tehran',
        province: 'Tehran',
        lat: '35.6892',
        lng: '51.3890',
        receiverPhoneNumber: '09123456789',
        receiverFullName: 'Jane Doe',
        postalCode: '1234567890',
        plateNumber: '456',
        unitNumber: '7A',
        floor: '7',
        isDefault: false
      },
      description: 'Create an office address (not default)'
    }
  ]
};

/**
 * @route PATCH /api/addresses/:id
 * @description Update an existing address
 * @access Private - Requires authentication
 * @param {string} id - Address ID (MongoDB ObjectId)
 * @body {string} title - Address title
 * @body {string} description - Full address
 * @body {string} city - City name
 * @body {string} province - Province name
 * @body {string} lat - Latitude
 * @body {string} lng - Longitude
 * @body {string} receiverPhoneNumber - Receiver phone
 * @body {string} receiverFullName - Receiver full name
 * @body {string} postalCode - Postal code
 * @body {string} plateNumber - Plate/Building number
 * @body {boolean} isDefault - Set as default
 * @body {string} unitNumber - Unit number (optional)
 * @body {string} floor - Floor number (optional)
 */
export const updateAddressDocs = {
  endpoint: '/:id',
  method: 'PATCH',
  summary: 'Update Address',
  description: 'Update an existing address. Users can only update their own addresses. userId cannot be updated.',
  access: 'Authenticated Users, Admin, SuperAdmin',
  params: {
    id: {
      type: 'string',
      required: true,
      pattern: '^[0-9a-fA-F]{24}$',
      example: '507f1f77bcf86cd799439011',
      description: 'MongoDB ObjectId of the address'
    }
  },
  body: {
    title: {
      type: 'string',
      required: false,
      minLength: 2,
      maxLength: 100,
      example: 'Office',
      description: 'Address title'
    },
    description: {
      type: 'string',
      required: false,
      minLength: 5,
      maxLength: 500,
      example: 'No. 456, Business Street, Floor 7',
      description: 'Full address description'
    },
    city: {
      type: 'string',
      required: false,
      minLength: 2,
      maxLength: 50,
      example: 'Tehran',
      description: 'City name'
    },
    province: {
      type: 'string',
      required: false,
      minLength: 2,
      maxLength: 50,
      example: 'Tehran',
      description: 'Province/State name'
    },
    lat: {
      type: 'string',
      required: false,
      example: '35.6892',
      description: 'Latitude coordinate'
    },
    lng: {
      type: 'string',
      required: false,
      example: '51.3890',
      description: 'Longitude coordinate'
    },
    receiverPhoneNumber: {
      type: 'string',
      required: false,
      pattern: '^(\\+98|0)?9\\d{9}$',
      example: '09123456789',
      description: 'Receiver phone number'
    },
    receiverFullName: {
      type: 'string',
      required: false,
      minLength: 2,
      maxLength: 100,
      example: 'Jane Doe',
      description: 'Receiver full name'
    },
    postalCode: {
      type: 'string',
      required: false,
      pattern: '^\\d{10}$',
      example: '1234567890',
      description: 'Postal code (10 digits)'
    },
    isDefault: {
      type: 'boolean',
      required: false,
      example: false,
      description: 'Set as default address'
    },
    unitNumber: {
      type: 'string',
      required: false,
      maxLength: 20,
      example: '7A',
      description: 'Unit/Apartment number (optional)'
    },
    floor: {
      type: 'string',
      required: false,
      maxLength: 10,
      example: '7',
      description: 'Floor number (optional)'
    },
    plateNumber: {
      type: 'string',
      required: false,
      minLength: 1,
      maxLength: 20,
      example: '456',
      description: 'Plate/Building number'
    }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          userId: '507f1f77bcf86cd799439022',
          title: 'Office',
          description: 'No. 456, Business Street, Floor 7',
          city: 'Tehran',
          province: 'Tehran',
          lat: '35.6892',
          lng: '51.3890',
          receiverPhoneNumber: '09123456789',
          receiverFullName: 'Jane Doe',
          postalCode: '1234567890',
          isDefault: false,
          unitNumber: '7A',
          floor: '7',
          plateNumber: '456',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        },
        message: 'address updated successfully'
      }
    },
    error: {
      status: 403,
      body: {
        success: false,
        message: 'You do not have permission to update this address'
      }
    }
  },
  examples: [
    {
      name: 'Update title only',
      body: {
        title: 'Office'
      },
      description: 'Only update the address title'
    },
    {
      name: 'Set as default',
      body: {
        isDefault: true
      },
      description: 'Set this address as default (will remove default from others)'
    },
    {
      name: 'Update all fields',
      body: {
        title: 'Office',
        description: 'No. 456, Business Street, Floor 7',
        city: 'Tehran',
        province: 'Tehran',
        lat: '35.6892',
        lng: '51.3890',
        receiverPhoneNumber: '09123456789',
        receiverFullName: 'Jane Doe',
        postalCode: '1234567890',
        plateNumber: '456',
        unitNumber: '7A',
        floor: '7',
        isDefault: false
      },
      description: 'Update all address fields'
    }
  ]
};

/**
 * @route DELETE /api/addresses/:id
 * @description Delete an address
 * @access Private - Requires authentication
 * @param {string} id - Address ID (MongoDB ObjectId)
 * @throws {403} - User doesn't have permission
 * @throws {404} - Address not found
 */
export const deleteAddressDocs = {
  endpoint: '/:id',
  method: 'DELETE',
  summary: 'Delete Address',
  description: 'Delete an address. Users can only delete their own addresses.',
  access: 'Authenticated Users, Admin, SuperAdmin',
  params: {
    id: {
      type: 'string',
      required: true,
      pattern: '^[0-9a-fA-F]{24}$',
      example: '507f1f77bcf86cd799439011',
      description: 'MongoDB ObjectId of the address'
    }
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        message: 'address deleted successfully'
      }
    },
    error: {
      status: 403,
      body: {
        success: false,
        message: 'you do not have permission to delete this address'
      }
    },
    notFound: {
      status: 404,
      body: {
        success: false,
        message: 'Address not found'
      }
    }
  }
};

// ==================== QUICK REFERENCE ====================

export const addressEndpoints = {
  getAllAddresses: {
    method: 'GET',
    path: '/api/addresses/',
    access: 'Authenticated Users, Admin, SuperAdmin',
    description: 'Get all addresses for authenticated user'
  },
  getSingleAddress: {
    method: 'GET',
    path: '/api/addresses/:id',
    access: 'Authenticated Users, Admin, SuperAdmin',
    description: 'Get specific address by ID'
  },
  createAddress: {
    method: 'POST',
    path: '/api/addresses/',
    access: 'Authenticated Users',
    description: 'Create a new address'
  },
  updateAddress: {
    method: 'PATCH',
    path: '/api/addresses/:id',
    access: 'Authenticated Users, Admin, SuperAdmin',
    description: 'Update address information'
  },
  deleteAddress: {
    method: 'DELETE',
    path: '/api/addresses/:id',
    access: 'Authenticated Users, Admin, SuperAdmin',
    description: 'Delete an address'
  }
};

// ==================== VALIDATION RULES SUMMARY ====================

export const validationRules = {
  title: {
    minLength: 2,
    maxLength: 100,
    pattern: '^[\\u0600-\\u06FF\\sa-zA-Z0-9\\-_. ]+$',
    description: 'Letters, numbers, spaces, hyphens, underscores, dots',
    example: 'Home',
    required: true
  },
  description: {
    minLength: 5,
    maxLength: 500,
    pattern: '^[\\u0600-\\u06FF\\sa-zA-Z0-9\\-_.!? ]+$',
    description: 'Full address description',
    example: 'No. 123, Main Street, Apartment 4B',
    required: true
  },
  city: {
    minLength: 2,
    maxLength: 50,
    pattern: '^[\\u0600-\\u06FF\\sa-zA-Z\\- ]+$',
    description: 'City name (letters, spaces, hyphens)',
    example: 'Tehran',
    required: true
  },
  province: {
    minLength: 2,
    maxLength: 50,
    pattern: '^[\\u0600-\\u06FF\\sa-zA-Z\\- ]+$',
    description: 'Province name (letters, spaces, hyphens)',
    example: 'Tehran',
    required: true
  },
  lat: {
    pattern: '^-?([0-8]?[0-9]\\.\\d+)$|^-?90\\.\\d+$',
    description: 'Latitude between -90 and 90',
    example: '35.6892',
    required: true
  },
  lng: {
    pattern: '^-?([0-9]?[0-9]\\.\\d+)$|^-?1[0-7][0-9]\\.\\d+$|^-?180\\.\\d+$',
    description: 'Longitude between -180 and 180',
    example: '51.3890',
    required: true
  },
  receiverPhoneNumber: {
    pattern: '^(\\+98|0)?9\\d{9}$',
    description: 'Iranian phone number',
    example: '09123456789',
    required: true
  },
  receiverFullName: {
    minLength: 2,
    maxLength: 100,
    pattern: '^[\\u0600-\\u06FF\\sa-zA-Z]+$',
    description: 'Full name (letters and spaces only)',
    example: 'John Doe',
    required: true
  },
  postalCode: {
    length: 10,
    pattern: '^\\d{10}$',
    description: '10-digit postal code',
    example: '1234567890',
    required: true
  },
  plateNumber: {
    minLength: 1,
    maxLength: 20,
    pattern: '^[a-zA-Z0-9\\-_ ]+$',
    description: 'Plate/building number',
    example: '123',
    required: true
  },
  unitNumber: {
    maxLength: 20,
    pattern: '^[a-zA-Z0-9\\-_ ]*$',
    description: 'Unit/apartment number (optional)',
    example: '4B',
    required: false
  },
  floor: {
    maxLength: 10,
    pattern: '^[a-zA-Z0-9\\-_ ]*$',
    description: 'Floor number (optional)',
    example: '4',
    required: false
  },
  isDefault: {
    type: 'boolean',
    default: false,
    description: 'Default address status',
    required: false
  },
  addressId: {
    format: 'MongoDB ObjectId',
    pattern: '^[0-9a-fA-F]{24}$',
    example: '507f1f77bcf86cd799439011'
  }
};

// ==================== PERMISSION MATRIX ====================

export const permissionMatrix = {
  endpoints: {
    'GET /api/addresses/': {
      user: 'own_only',
      admin: true,
      superAdmin: true
    },
    'GET /api/addresses/:id': {
      user: 'own_only',
      admin: true,
      superAdmin: true
    },
    'POST /api/addresses/': {
      user: true,
      admin: true,
      superAdmin: true
    },
    'PATCH /api/addresses/:id': {
      user: 'own_only',
      admin: true,
      superAdmin: true
    },
    'DELETE /api/addresses/:id': {
      user: 'own_only',
      admin: true,
      superAdmin: true
    }
  },
  fields: {
    userId: {
      user: 'read',
      admin: 'read_write',
      superAdmin: 'read_write'
    },
    title: {
      user: 'read_write',
      admin: 'read_write',
      superAdmin: 'read_write'
    },
    description: {
      user: 'read_write',
      admin: 'read_write',
      superAdmin: 'read_write'
    },
    city: {
      user: 'read_write',
      admin: 'read_write',
      superAdmin: 'read_write'
    },
    province: {
      user: 'read_write',
      admin: 'read_write',
      superAdmin: 'read_write'
    },
    lat: {
      user: 'read_write',
      admin: 'read_write',
      superAdmin: 'read_write'
    },
    lng: {
      user: 'read_write',
      admin: 'read_write',
      superAdmin: 'read_write'
    },
    receiverPhoneNumber: {
      user: 'read_write',
      admin: 'read_write',
      superAdmin: 'read_write'
    },
    receiverFullName: {
      user: 'read_write',
      admin: 'read_write',
      superAdmin: 'read_write'
    },
    postalCode: {
      user: 'read_write',
      admin: 'read_write',
      superAdmin: 'read_write'
    },
    isDefault: {
      user: 'read_write',
      admin: 'read_write',
      superAdmin: 'read_write'
    },
    unitNumber: {
      user: 'read_write',
      admin: 'read_write',
      superAdmin: 'read_write'
    },
    floor: {
      user: 'read_write',
      admin: 'read_write',
      superAdmin: 'read_write'
    },
    plateNumber: {
      user: 'read_write',
      admin: 'read_write',
      superAdmin: 'read_write'
    }
  }
};

// ==================== ERROR CODES ====================

export const addressErrorCodes = {
  '400': {
    code: 'BAD_REQUEST',
    description: 'Invalid input format or validation failed',
    examples: [
      'Title is required',
      'Invalid latitude format (must be between -90 and 90)',
      'Postal code must be exactly 10 digits',
      'User already has a default address',
      'Invalid address ID format'
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
    examples: [
      'You do not have permission to access this address',
      'you do not have permission to update this address',
      'you do not have permission to delete this address'
    ]
  },
  '404': {
    code: 'NOT_FOUND',
    description: 'Address not found',
    example: 'Address not found'
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
    count: 3,
    data: [
      {
        _id: '507f1f77bcf86cd799439011',
        userId: {
          _id: '507f1f77bcf86cd799439022',
          fullName: 'John Doe',
          phoneNumber: '09123456789'
        },
        title: 'Home',
        description: 'No. 123, Main Street, Apartment 4B',
        city: 'Tehran',
        province: 'Tehran',
        lat: '35.6892',
        lng: '51.3890',
        receiverPhoneNumber: '09123456789',
        receiverFullName: 'John Doe',
        postalCode: '1234567890',
        isDefault: true,
        unitNumber: '4B',
        floor: '4',
        plateNumber: '123',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    ]
  },
  getSingleSuccess: {
    success: true,
    data: {
      _id: '507f1f77bcf86cd799439011',
      userId: {
        _id: '507f1f77bcf86cd799439022',
        fullName: 'John Doe',
        phoneNumber: '09123456789'
      },
      title: 'Home',
      description: 'No. 123, Main Street, Apartment 4B',
      city: 'Tehran',
      province: 'Tehran',
      lat: '35.6892',
      lng: '51.3890',
      receiverPhoneNumber: '09123456789',
      receiverFullName: 'John Doe',
      postalCode: '1234567890',
      isDefault: true,
      unitNumber: '4B',
      floor: '4',
      plateNumber: '123',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  },
  createSuccess: {
    success: true,
    data: {
      _id: '507f1f77bcf86cd799439011',
      userId: '507f1f77bcf86cd799439022',
      title: 'Home',
      description: 'No. 123, Main Street, Apartment 4B',
      city: 'Tehran',
      province: 'Tehran',
      lat: '35.6892',
      lng: '51.3890',
      receiverPhoneNumber: '09123456789',
      receiverFullName: 'John Doe',
      postalCode: '1234567890',
      isDefault: true,
      unitNumber: '4B',
      floor: '4',
      plateNumber: '123',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    message: 'address created successfully'
  },
  updateSuccess: {
    success: true,
    data: {
      _id: '507f1f77bcf86cd799439011',
      userId: '507f1f77bcf86cd799439022',
      title: 'Office',
      description: 'No. 456, Business Street, Floor 7',
      city: 'Tehran',
      province: 'Tehran',
      lat: '35.6892',
      lng: '51.3890',
      receiverPhoneNumber: '09123456789',
      receiverFullName: 'Jane Doe',
      postalCode: '1234567890',
      isDefault: false,
      unitNumber: '7A',
      floor: '7',
      plateNumber: '456',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    message: 'address updated successfully'
  },
  deleteSuccess: {
    success: true,
    message: 'address deleted successfully'
  },
  error: {
    success: false,
    message: 'Error message'
  }
};

// ==================== USE CASES ====================

export const addressUseCases = {
  shipping: {
    description: 'Shipping address for orders',
    examples: [
      'Home address for product delivery',
      'Office address for business shipments'
    ]
  },
  billing: {
    description: 'Billing address for invoices',
    examples: [
      'Same as shipping address',
      'Different address for billing purposes'
    ]
  },
  defaultAddress: {
    description: 'Pre-selected address for faster checkout',
    features: [
      'Only one default address allowed per user',
      'Automatically selected during checkout',
      'Can be changed anytime'
    ]
  },
  locationServices: {
    description: 'Location-based services',
    features: [
      'Latitude/Longitude for map integration',
      'Nearby store finder',
      'Delivery zone verification'
    ]
  }
};

// ==================== DEFAULT EXPORT ====================

export default {
  addressSchemas,
  getAllAddressesDocs,
  getSingleAddressDocs,
  createAddressDocs,
  updateAddressDocs,
  deleteAddressDocs,
  addressEndpoints,
  validationRules,
  permissionMatrix,
  addressErrorCodes,
  responseTemplates,
  addressUseCases
};