/**
 * @openapi
 * tags:
 *   - name: DiscountCode
 *     description: Discount code management endpoints (Admin CRUD + user validation)
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
 *     UserUsed:
 *       type: object
 *       properties:
 *         userId:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439011
 *             fullName:
 *               type: string
 *               example: John Doe
 *             phoneNumber:
 *               type: string
 *               example: "09123456789"
 *             role:
 *               type: string
 *               enum: [user, admin]
 *               example: user
 *         count:
 *           type: number
 *           example: 2
 *           description: Number of times user used this code
 *
 *     DiscountCode:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439022
 *         type:
 *           type: string
 *           enum: [percentage, fixed]
 *           example: percentage
 *         value:
 *           type: number
 *           example: 10
 *           description: Discount value (max 100 for percentage)
 *         startTime:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2024-06-01T00:00:00.000Z
 *         expireTime:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2024-08-31T23:59:59.000Z
 *         minPrice:
 *           type: number
 *           nullable: true
 *           example: 100
 *         maxPrice:
 *           type: number
 *           nullable: true
 *           example: 500
 *         code:
 *           type: string
 *           example: SUMMER2024
 *         usageLimit:
 *           type: number
 *           example: 100
 *         usedCount:
 *           type: number
 *           example: 50
 *         userUsedLimit:
 *           type: number
 *           example: 1
 *         userIdUsed:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserUsed'
 *         freeShipping:
 *           type: boolean
 *           example: false
 *         isPublished:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *
 *     CreateDiscountCodeRequest:
 *       type: object
 *       required:
 *         - code
 *         - type
 *         - value
 *         - usageLimit
 *         - userUsedLimit
 *       properties:
 *         code:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           pattern: '^[A-Z0-9\-_]+$'
 *           example: SUMMER2024
 *         type:
 *           type: string
 *           enum: [percentage, fixed]
 *           example: percentage
 *         value:
 *           type: number
 *           minimum: 0
 *           example: 10
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: 2024-06-01T00:00:00.000Z
 *         expireTime:
 *           type: string
 *           format: date-time
 *           example: 2024-08-31T23:59:59.000Z
 *         minPrice:
 *           type: number
 *           minimum: 0
 *           example: 100
 *         maxPrice:
 *           type: number
 *           minimum: 0
 *           example: 500
 *         usageLimit:
 *           type: number
 *           minimum: 1
 *           example: 100
 *         userUsedLimit:
 *           type: number
 *           minimum: 1
 *           example: 1
 *         freeShipping:
 *           type: boolean
 *           default: false
 *           example: true
 *         isPublished:
 *           type: boolean
 *           default: false
 *           example: true
 *
 *     UpdateDiscountCodeRequest:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           example: SUMMER2024
 *         type:
 *           type: string
 *           enum: [percentage, fixed]
 *           example: percentage
 *         value:
 *           type: number
 *           example: 15
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: 2024-06-01T00:00:00.000Z
 *         expireTime:
 *           type: string
 *           format: date-time
 *           example: 2024-09-30T23:59:59.000Z
 *         minPrice:
 *           type: number
 *           example: 150
 *         maxPrice:
 *           type: number
 *           example: 600
 *         usageLimit:
 *           type: number
 *           example: 200
 *         userUsedLimit:
 *           type: number
 *           example: 2
 *         freeShipping:
 *           type: boolean
 *           example: true
 *         isPublished:
 *           type: boolean
 *           example: false
 *
 *     CheckDiscountCodeRequest:
 *       type: object
 *       required:
 *         - code
 *       properties:
 *         code:
 *           type: string
 *           example: SUMMER2024
 *
 *     DiscountCodeListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         count:
 *           type: number
 *           example: 5
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DiscountCode'
 *
 *     DiscountCodeSingleResponse:
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
 *             $ref: '#/components/schemas/DiscountCode'
 *
 *     DiscountCodeCreateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/DiscountCode'
 *         message:
 *           type: string
 *           example: discount code created successfully
 *
 *     DiscountCodeUpdateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/DiscountCode'
 *         message:
 *           type: string
 *           example: discount code updated successfully
 *
 *     DiscountCodeDeleteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: discount code removed successfully
 *
 *     CheckDiscountCodeResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             discountValue:
 *               type: number
 *               example: 100
 *             finalPriceAfterDiscount:
 *               type: number
 *               example: 800
 */

/**
 * @openapi
 * /api/discount-code:
 *   get:
 *     tags:
 *       - DiscountCode
 *     summary: Get all discount codes (Admin only)
 *     description: Retrieve all discount codes with filtering and pagination. **Admin/SuperAdmin only**.
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
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query for discount code
 *         example: 'SUMMER'
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [percentage, fixed]
 *         description: Filter by discount type
 *       - in: query
 *         name: isPublished
 *         schema:
 *           type: boolean
 *         description: Filter by publication status
 *       - in: query
 *         name: freeShipping
 *         schema:
 *           type: boolean
 *         description: Filter by free shipping
 *     responses:
 *       200:
 *         description: Discount codes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiscountCodeListResponse'
 *             example:
 *               success: true
 *               count: 2
 *               data:
 *                 - _id: 507f1f77bcf86cd799439022
 *                   code: SUMMER2024
 *                   type: percentage
 *                   value: 10
 *                   usageLimit: 100
 *                   usedCount: 50
 *                   userUsedLimit: 1
 *                   isPublished: true
 *                   freeShipping: false
 *                   startTime: 2024-06-01T00:00:00.000Z
 *                   expireTime: 2024-08-31T23:59:59.000Z
 *                   userIdUsed:
 *                     - userId:
 *                         _id: 507f1f77bcf86cd799439011
 *                         fullName: John Doe
 *                         phoneNumber: "09123456789"
 *                         role: user
 *                       count: 1
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
 *
 *   post:
 *     tags:
 *       - DiscountCode
 *     summary: Create new discount code (Admin only)
 *     description: |
 *       Create a new discount code. **Admin/SuperAdmin only**.
 *       - **Percentage**: value must be between 0 and 100
 *       - **Fixed**: value can be any positive number
 *       - `startTime` must be in the future
 *       - `expireTime` must be after `startTime`
 *       - `maxPrice` must be >= `minPrice`
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDiscountCodeRequest'
 *           examples:
 *             percentage:
 *               summary: Percentage discount
 *               value:
 *                 code: SUMMER2024
 *                 type: percentage
 *                 value: 10
 *                 usageLimit: 100
 *                 userUsedLimit: 1
 *                 isPublished: true
 *                 minPrice: 100
 *                 expireTime: 2024-08-31T23:59:59.000Z
 *             fixed:
 *               summary: Fixed discount with free shipping
 *               value:
 *                 code: FIXED50
 *                 type: fixed
 *                 value: 50
 *                 usageLimit: 50
 *                 userUsedLimit: 2
 *                 isPublished: true
 *                 freeShipping: true
 *     responses:
 *       201:
 *         description: Discount code created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiscountCodeCreateResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: 507f1f77bcf86cd799439022
 *                 code: SUMMER2024
 *                 type: percentage
 *                 value: 10
 *                 usageLimit: 100
 *                 usedCount: 0
 *                 userUsedLimit: 1
 *                 isPublished: true
 *                 freeShipping: false
 *               message: discount code created successfully
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               codeTaken:
 *                 value:
 *                   success: false
 *                   message: Discount code already taken
 *               invalidPercentage:
 *                 value:
 *                   success: false
 *                   message: For percentage type, value must be less than or equal to 100
 *               invalidTime:
 *                 value:
 *                   success: false
 *                   message: Expire time must be after start time
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
 */

/**
 * @openapi
 * /api/discount-code/{id}:
 *   get:
 *     tags:
 *       - DiscountCode
 *     summary: Get single discount code (Admin only)
 *     description: Retrieve a single discount code by ID. **Admin/SuperAdmin only**.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Discount code ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439022
 *     responses:
 *       200:
 *         description: Discount code retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiscountCodeSingleResponse'
 *             example:
 *               success: true
 *               count: 1
 *               data:
 *                 - _id: 507f1f77bcf86cd799439022
 *                   code: SUMMER2024
 *                   type: percentage
 *                   value: 10
 *                   usageLimit: 100
 *                   usedCount: 50
 *                   userUsedLimit: 1
 *                   isPublished: true
 *                   userIdUsed:
 *                     - userId:
 *                         _id: 507f1f77bcf86cd799439011
 *                         fullName: John Doe
 *                         phoneNumber: "09123456789"
 *                         role: user
 *                       count: 1
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
 *       404:
 *         description: Discount code not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Discount code not found
 *
 *   patch:
 *     tags:
 *       - DiscountCode
 *     summary: Update discount code (Admin only)
 *     description: |
 *       Update an existing discount code. **Admin/SuperAdmin only**.
 *       - **If code has been used (usedCount > 0)**: Cannot change `code`, `type`, `value`, `userUsedLimit`, `userIdUsed`, `usedCount`
 *       - **If code hasn't been used**: All fields can be updated
 *       - Read-only fields (`usedCount`, `userIdUsed`) cannot be updated
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Discount code ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439022
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDiscountCodeRequest'
 *           examples:
 *             updateValue:
 *               summary: Update discount value
 *               value:
 *                 value: 15
 *                 expireTime: 2024-09-30T23:59:59.000Z
 *             unpublish:
 *               summary: Unpublish discount code
 *               value:
 *                 isPublished: false
 *     responses:
 *       200:
 *         description: Discount code updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiscountCodeUpdateResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: 507f1f77bcf86cd799439022
 *                 code: SUMMER2024
 *                 value: 15
 *                 isPublished: false
 *               message: discount code updated successfully
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               readOnly:
 *                 value:
 *                   success: false
 *                   message: usedCount is auto-calculated and cannot be updated directly
 *               codeTaken:
 *                 value:
 *                   success: false
 *                   message: Discount code already taken
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
 *       404:
 *         description: Discount code not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   delete:
 *     tags:
 *       - DiscountCode
 *     summary: Delete discount code (Admin only)
 *     description: |
 *       Delete a discount code. **Admin/SuperAdmin only**.
 *       - **Cannot delete if code has been used** (usedCount > 0)
 *       - Instead, change `isPublished` to `false` to disable
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Discount code ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439022
 *     responses:
 *       200:
 *         description: Discount code deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiscountCodeDeleteResponse'
 *             example:
 *               success: true
 *               message: discount code removed successfully
 *       400:
 *         description: Cannot delete used code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Cannot delete code because it has been used by at least one user. Change isPublished instead.
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
 *       404:
 *         description: Discount code not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/discount-code/check:
 *   post:
 *     tags:
 *       - DiscountCode
 *     summary: Check discount code
 *     description: |
 *       Validate a discount code against the current user's cart. **Requires authentication**.
 *       
 *       **Validations performed:**
 *       - Code must exist
 *       - Code must be published (`isPublished: true`)
 *       - Current time must be between `startTime` and `expireTime`
 *       - Cart total must be >= `minPrice` (if set)
 *       - Cart total must be <= `maxPrice` (if set)
 *       - `usedCount` must be less than `usageLimit`
 *       - User's usage count must be less than `userUsedLimit`
 *       
 *       **Calculation:**
 *       - **percentage**: `discountValue = cart.finalPrice × (value / 100)`
 *       - **fixed**: `discountValue = value`
 *       - `finalPriceAfterDiscount = cart.finalPrice - discountValue`
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckDiscountCodeRequest'
 *           example:
 *             code: SUMMER2024
 *     responses:
 *       200:
 *         description: Discount code is valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CheckDiscountCodeResponse'
 *             example:
 *               success: true
 *               data:
 *                 discountValue: 100
 *                 finalPriceAfterDiscount: 800
 *       400:
 *         description: Discount code is invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               expired:
 *                 value:
 *                   success: false
 *                   message: discount code expired at 2024-12-31T23:59:59.000Z
 *               notStarted:
 *                 value:
 *                   success: false
 *                   message: discount code start at 2024-06-01T00:00:00.000Z
 *               minPrice:
 *                 value:
 *                   success: false
 *                   message: min price for this code is 100
 *               maxPrice:
 *                 value:
 *                   success: false
 *                   message: max price for this code is 500
 *               usageLimit:
 *                 value:
 *                   success: false
 *                   message: limit use for this code is finished
 *               notPublished:
 *                 value:
 *                   success: false
 *                   message: discount code is not available
 *               userLimit:
 *                 value:
 *                   success: false
 *                   message: user used limit is 1
 *               multipleErrors:
 *                 value:
 *                   success: false
 *                   message: discount code expired at 2024-12-31 - min price for this code is 100
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Invalid discount code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: invalid discount code
 */