/**
 * @openapi
 * tags:
 *   - name: Address
 *     description: User address management endpoints
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Error message
 *
 *     Address:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         userId:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439022
 *             fullName:
 *               type: string
 *               example: John Doe
 *             phoneNumber:
 *               type: string
 *               example: "09123456789"
 *         title:
 *           type: string
 *           example: Home
 *         description:
 *           type: string
 *           example: No. 123, Main Street, Apartment 4B
 *         city:
 *           type: string
 *           example: Tehran
 *         province:
 *           type: string
 *           example: Tehran
 *         lat:
 *           type: string
 *           example: "35.6892"
 *         lng:
 *           type: string
 *           example: "51.3890"
 *         receiverPhoneNumber:
 *           type: string
 *           example: "09123456789"
 *         receiverFullName:
 *           type: string
 *           example: John Doe
 *         postalCode:
 *           type: string
 *           example: "1234567890"
 *         isDefault:
 *           type: boolean
 *           example: true
 *         unitNumber:
 *           type: string
 *           example: "4B"
 *         floor:
 *           type: string
 *           example: "4"
 *         plateNumber:
 *           type: string
 *           example: "123"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *
 *     CreateAddressRequest:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - city
 *         - province
 *         - lat
 *         - lng
 *         - receiverPhoneNumber
 *         - receiverFullName
 *         - postalCode
 *         - plateNumber
 *       properties:
 *         title:
 *           type: string
 *           example: Home
 *         description:
 *           type: string
 *           example: No. 123, Main Street, Apartment 4B
 *         city:
 *           type: string
 *           example: Tehran
 *         province:
 *           type: string
 *           example: Tehran
 *         lat:
 *           type: string
 *           example: "35.6892"
 *         lng:
 *           type: string
 *           example: "51.3890"
 *         receiverPhoneNumber:
 *           type: string
 *           example: "09123456789"
 *         receiverFullName:
 *           type: string
 *           example: John Doe
 *         postalCode:
 *           type: string
 *           example: "1234567890"
 *         isDefault:
 *           type: boolean
 *           example: true
 *         unitNumber:
 *           type: string
 *           example: "4B"
 *         floor:
 *           type: string
 *           example: "4"
 *         plateNumber:
 *           type: string
 *           example: "123"
 *
 *     UpdateAddressRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: Office
 *         description:
 *           type: string
 *           example: No. 456, Business Street, Floor 7
 *         city:
 *           type: string
 *           example: Tehran
 *         province:
 *           type: string
 *           example: Tehran
 *         lat:
 *           type: string
 *           example: "35.6892"
 *         lng:
 *           type: string
 *           example: "51.3890"
 *         receiverPhoneNumber:
 *           type: string
 *           example: "09123456789"
 *         receiverFullName:
 *           type: string
 *           example: Jane Doe
 *         postalCode:
 *           type: string
 *           example: "1234567890"
 *         isDefault:
 *           type: boolean
 *           example: false
 *         unitNumber:
 *           type: string
 *           example: "7A"
 *         floor:
 *           type: string
 *           example: "7"
 *         plateNumber:
 *           type: string
 *           example: "456"
 *
 *     AddressListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         count:
 *           type: number
 *           example: 3
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Address'
 *
 *     AddressSingleResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Address'
 *
 *     AddressCreateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Address'
 *         message:
 *           type: string
 *           example: address created successfully
 *
 *     AddressUpdateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Address'
 *         message:
 *           type: string
 *           example: address updated successfully
 *
 *     AddressDeleteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: address deleted successfully
 */

/**
 * @openapi
 * /api/addresses:
 *   get:
 *     tags:
 *       - Address
 *     summary: Get all addresses
 *     description: Retrieve all addresses for authenticated user. Admin can view all users' addresses.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: 'Sort field with prefix (- for descending, + for ascending)'
 *         example: '-createdAt'
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Comma-separated fields to include or exclude
 *         example: 'title,city,province,isDefault'
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query for address title
 *         example: 'home'
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *         example: 'Tehran'
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *         description: Filter by province
 *         example: 'Tehran'
 *       - in: query
 *         name: isDefault
 *         schema:
 *           type: boolean
 *         description: Filter by default status
 *         example: true
 *     responses:
 *       200:
 *         description: Addresses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddressListResponse'
 *             example:
 *               success: true
 *               count: 2
 *               data:
 *                 - _id: 507f1f77bcf86cd799439011
 *                   userId:
 *                     _id: 507f1f77bcf86cd799439022
 *                     fullName: John Doe
 *                     phoneNumber: "09123456789"
 *                   title: Home
 *                   description: No. 123, Main Street, Apartment 4B
 *                   city: Tehran
 *                   province: Tehran
 *                   lat: "35.6892"
 *                   lng: "51.3890"
 *                   receiverPhoneNumber: "09123456789"
 *                   receiverFullName: John Doe
 *                   postalCode: "1234567890"
 *                   isDefault: true
 *                   unitNumber: "4B"
 *                   floor: "4"
 *                   plateNumber: "123"
 *                   createdAt: 2024-01-01T00:00:00.000Z
 *                   updatedAt: 2024-01-01T00:00:00.000Z
 *       400:
 *         description: Invalid input format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     tags:
 *       - Address
 *     summary: Create new address
 *     description: Create a new address for the authenticated user. Only one default address allowed per user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAddressRequest'
 *           example:
 *             title: Home
 *             description: No. 123, Main Street, Apartment 4B
 *             city: Tehran
 *             province: Tehran
 *             lat: "35.6892"
 *             lng: "51.3890"
 *             receiverPhoneNumber: "09123456789"
 *             receiverFullName: John Doe
 *             postalCode: "1234567890"
 *             isDefault: true
 *             unitNumber: "4B"
 *             floor: "4"
 *             plateNumber: "123"
 *     responses:
 *       201:
 *         description: Address created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddressCreateResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: 507f1f77bcf86cd799439011
 *                 userId: 507f1f77bcf86cd799439022
 *                 title: Home
 *                 description: No. 123, Main Street, Apartment 4B
 *                 city: Tehran
 *                 province: Tehran
 *                 lat: "35.6892"
 *                 lng: "51.3890"
 *                 receiverPhoneNumber: "09123456789"
 *                 receiverFullName: John Doe
 *                 postalCode: "1234567890"
 *                 isDefault: true
 *                 unitNumber: "4B"
 *                 floor: "4"
 *                 plateNumber: "123"
 *                 createdAt: 2024-01-01T00:00:00.000Z
 *                 updatedAt: 2024-01-01T00:00:00.000Z
 *               message: address created successfully
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/addresses/{id}:
 *   get:
 *     tags:
 *       - Address
 *     summary: Get single address
 *     description: Retrieve detailed information about a specific address. Users can only access their own addresses.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Address ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Address retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddressSingleResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: 507f1f77bcf86cd799439011
 *                 userId:
 *                   _id: 507f1f77bcf86cd799439022
 *                   fullName: John Doe
 *                   phoneNumber: "09123456789"
 *                 title: Home
 *                 description: No. 123, Main Street, Apartment 4B
 *                 city: Tehran
 *                 province: Tehran
 *                 lat: "35.6892"
 *                 lng: "51.3890"
 *                 receiverPhoneNumber: "09123456789"
 *                 receiverFullName: John Doe
 *                 postalCode: "1234567890"
 *                 isDefault: true
 *                 unitNumber: "4B"
 *                 floor: "4"
 *                 plateNumber: "123"
 *                 createdAt: 2024-01-01T00:00:00.000Z
 *                 updatedAt: 2024-01-01T00:00:00.000Z
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: You do not have permission to access this address
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Address not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   patch:
 *     tags:
 *       - Address
 *     summary: Update address
 *     description: Update an existing address. Users can only update their own addresses. userId cannot be updated.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Address ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAddressRequest'
 *           example:
 *             title: Office
 *             description: No. 456, Business Street, Floor 7
 *             city: Tehran
 *             province: Tehran
 *             lat: "35.6892"
 *             lng: "51.3890"
 *             receiverPhoneNumber: "09123456789"
 *             receiverFullName: Jane Doe
 *             postalCode: "1234567890"
 *             isDefault: false
 *             unitNumber: "7A"
 *             floor: "7"
 *             plateNumber: "456"
 *     responses:
 *       200:
 *         description: Address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddressUpdateResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: 507f1f77bcf86cd799439011
 *                 userId: 507f1f77bcf86cd799439022
 *                 title: Office
 *                 description: No. 456, Business Street, Floor 7
 *                 city: Tehran
 *                 province: Tehran
 *                 lat: "35.6892"
 *                 lng: "51.3890"
 *                 receiverPhoneNumber: "09123456789"
 *                 receiverFullName: Jane Doe
 *                 postalCode: "1234567890"
 *                 isDefault: false
 *                 unitNumber: "7A"
 *                 floor: "7"
 *                 plateNumber: "456"
 *                 createdAt: 2024-01-01T00:00:00.000Z
 *                 updatedAt: 2024-01-01T00:00:00.000Z
 *               message: address updated successfully
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: You do not have permission to update this address
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Address not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     tags:
 *       - Address
 *     summary: Delete address
 *     description: Delete an address. Users can only delete their own addresses.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Address ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddressDeleteResponse'
 *             example:
 *               success: true
 *               message: address deleted successfully
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: You do not have permission to delete this address
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Address not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */