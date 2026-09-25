/**
 * @openapi
 * tags:
 *   - name: User
 *     description: User management endpoints (Admin CRUD + self profile)
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
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         phoneNumber:
 *           type: string
 *           pattern: '^(\+98|0)?9\d{9}$'
 *           example: "09123456789"
 *         fullName:
 *           type: string
 *           example: John Doe
 *         role:
 *           type: string
 *           enum: [user, admin, superAdmin]
 *           example: user
 *         isActive:
 *           type: boolean
 *           example: true
 *         birthYear:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 1990-01-01T00:00:00.000Z
 *         cartId:
 *           type: string
 *           nullable: true
 *           example: 507f1f77bcf86cd799439022
 *         favoriteProductIds:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439033
 *               title:
 *                 type: string
 *                 example: Samsung Galaxy S24
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               minPrice:
 *                 type: number
 *                 example: 1000
 *               maxPrice:
 *                 type: number
 *                 example: 1200
 *         ratedProductIds:
 *           type: array
 *           items:
 *             type: string
 *           example: ["507f1f77bcf86cd799439044"]
 *         boughtProductIds:
 *           type: array
 *           items:
 *             type: string
 *           example: ["507f1f77bcf86cd799439055"]
 *         addressIds:
 *           type: array
 *           items:
 *             type: string
 *           example: ["507f1f77bcf86cd799439066"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: John Updated Doe
 *         birthYear:
 *           type: string
 *           format: date-time
 *           example: 1991-01-01T00:00:00.000Z
 *         role:
 *           type: string
 *           enum: [user, admin, superAdmin]
 *           example: admin
 *           description: Only superAdmin can update this
 *         isActive:
 *           type: boolean
 *           example: false
 *           description: Only admin/superAdmin can update this
 *         phoneNumber:
 *           type: string
 *           pattern: '^(\+98|0)?9\d{9}$'
 *           example: "09123456789"
 *
 *     ChangePasswordRequest:
 *       type: object
 *       required:
 *         - newPassword
 *       properties:
 *         oldPassword:
 *           type: string
 *           minLength: 8
 *           example: OldSecurePass123
 *           description: Required for users with existing password
 *         newPassword:
 *           type: string
 *           minLength: 8
 *           pattern: '^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])'
 *           example: NewSecurePass123
 *         confirmPassword:
 *           type: string
 *           minLength: 8
 *           example: NewSecurePass123
 *           description: Must match newPassword
 *
 *     UserListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         count:
 *           type: number
 *           example: 10
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *
 *     UserSingleResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         count:
 *           type: number
 *           example: 1
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *
 *     UserUpdateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/User'
 *         message:
 *           type: string
 *           example: user updated successfully
 *
 *     PasswordChangeResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: password updated successfully
 */

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - User
 *     summary: Get all users (Admin only)
 *     description: |
 *       Retrieve all users with filtering, sorting, and pagination. **Admin/SuperAdmin only**.
 *       - Password field is **automatically excluded** (forbiddenFields in security config)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *         example: 2
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *           default: 10
 *         description: Number of items per page
 *         example: 20
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
 *         example: 'fullName,phoneNumber,role,isActive'
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query (matches `phoneNumber` and `fullName`)
 *         example: 'john'
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: Relations to populate
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserListResponse'
 *             example:
 *               success: true
 *               count: 10
 *               data:
 *                 - _id: 507f1f77bcf86cd799439011
 *                   phoneNumber: "09123456789"
 *                   fullName: John Doe
 *                   role: user
 *                   isActive: true
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
 *       403:
 *         description: Admin permission required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: You do not have permission to perform this action
 */

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get single user
 *     description: |
 *       Retrieve a single user by ID.
 *       - **Regular users**: Can only access their **own** profile (`id` must equal their user ID)
 *       - **Admin/SuperAdmin**: Can access **any** user's profile
 *       - Automatically populates `favoriteProductIds` with product details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSingleResponse'
 *             example:
 *               success: true
 *               count: 1
 *               data:
 *                 - _id: 507f1f77bcf86cd799439011
 *                   phoneNumber: "09123456789"
 *                   fullName: John Doe
 *                   role: user
 *                   isActive: true
 *                   birthYear: 1990-01-01T00:00:00.000Z
 *                   favoriteProductIds:
 *                     - _id: 507f1f77bcf86cd799439033
 *                       title: Samsung Galaxy S24
 *                       images: ["uploads/products/image1.jpg"]
 *                       minPrice: 1000
 *                       maxPrice: 1200
 *                   createdAt: 2024-01-01T00:00:00.000Z
 *                   updatedAt: 2024-01-01T00:00:00.000Z
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: You do not have permission to access this resource
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: You do not have permission to access this resource
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: user not found
 *
 *   patch:
 *     tags:
 *       - User
 *     summary: Update user
 *     description: |
 *       Update user information.
 *       - **Regular users**: Can only update their own `fullName` and `birthYear` (`id` must equal their user ID)
 *       - **Admin**: Can update `fullName`, `birthYear`, `isActive` of any user
 *       - **SuperAdmin**: Can update all fields including `role`
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *           examples:
 *             userUpdateSelf:
 *               summary: User updating own profile
 *               value:
 *                 fullName: John Updated Doe
 *                 birthYear: 1991-01-01T00:00:00.000Z
 *             adminDeactivate:
 *               summary: Admin deactivating a user
 *               value:
 *                 isActive: false
 *             superAdminChangeRole:
 *               summary: SuperAdmin changing user role
 *               value:
 *                 role: admin
 *                 isActive: true
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserUpdateResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: 507f1f77bcf86cd799439011
 *                 phoneNumber: "09123456789"
 *                 fullName: John Updated Doe
 *                 role: admin
 *                 isActive: false
 *                 birthYear: 1991-01-01T00:00:00.000Z
 *               message: user updated successfully
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: You do not have permission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: you do not have permission
 *       403:
 *         description: You do not have permission to access this resource
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: user not found
 */

/**
 * @openapi
 * /api/users/change-password/{id}:
 *   patch:
 *     tags:
 *       - User
 *     summary: Change user password
 *     description: |
 *       Change user password.
 *       - **Regular users**: Can only change **own** password (`id` must equal their user ID)
 *         - If user already has a password, `oldPassword` is **required**
 *       - **Admin/SuperAdmin**: Can change **any** user's password without `oldPassword`
 *       - New password must contain: **at least 8 chars**, **1 uppercase**, **1 lowercase**, **1 number**
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *           examples:
 *             userChangeWithOld:
 *               summary: User with password changing
 *               value:
 *                 oldPassword: OldSecurePass123
 *                 newPassword: NewSecurePass123
 *                 confirmPassword: NewSecurePass123
 *             userSetFirstPassword:
 *               summary: User setting password first time (no old required)
 *               value:
 *                 newPassword: NewSecurePass123
 *                 confirmPassword: NewSecurePass123
 *             adminReset:
 *               summary: Admin resetting user password
 *               value:
 *                 newPassword: AdminSetPass123
 *                 confirmPassword: AdminSetPass123
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PasswordChangeResponse'
 *             example:
 *               success: true
 *               message: password updated successfully
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               oldPasswordRequired:
 *                 value:
 *                   success: false
 *                   message: old password required
 *               oldPasswordIncorrect:
 *                 value:
 *                   success: false
 *                   message: old password incorrect
 *               weakPassword:
 *                 value:
 *                   success: false
 *                   message: password must be contained A-Z , a-z , 0-9 and must be have 8 min length characters
 *               mismatch:
 *                 value:
 *                   success: false
 *                   message: Confirm password does not match new password
 *       401:
 *         description: You do not have permission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: you do not have permission
 *       403:
 *         description: You do not have permission to access this resource
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */