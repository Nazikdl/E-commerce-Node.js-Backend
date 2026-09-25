/**
 * @openapi
 * tags:
 *   - name: Variant
 *     description: Variant management endpoints (Size and Color attributes for products)
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
 *     Variant:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         type:
 *           type: string
 *           enum: [size, color]
 *           example: size
 *           description: Variant type (size or color)
 *         value:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           example: Large
 *           description: Variant value (unique)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *
 *     CreateVariantRequest:
 *       type: object
 *       required:
 *         - type
 *         - value
 *       properties:
 *         type:
 *           type: string
 *           enum: [size, color]
 *           example: size
 *           description: Variant type (size or color)
 *         value:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           example: XL
 *           description: Variant value (must be unique)
 *
 *     UpdateVariantRequest:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [size, color]
 *           example: color
 *         value:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           example: Navy Blue
 *
 *     VariantListResponse:
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
 *             $ref: '#/components/schemas/Variant'
 *
 *     VariantSingleResponse:
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
 *             $ref: '#/components/schemas/Variant'
 *
 *     VariantCreateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Variant'
 *         message:
 *           type: string
 *           example: new variant created successfully
 *
 *     VariantUpdateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Variant'
 *         message:
 *           type: string
 *           example: variant updated successfully
 *
 *     VariantDeleteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: variant removed successfully
 */

/**
 * @openapi
 * /api/variants:
 *   get:
 *     tags:
 *       - Variant
 *     summary: Get all variants
 *     description: |
 *       Retrieve all variants (size/color attributes) with filtering, sorting, and pagination.
 *       - Can filter by `type` (size or color)
 *       - Can search by `value`
 *     security: []
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
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *         example: 20
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: 'Sort field with prefix (- for descending, + for ascending)'
 *         example: 'value'
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Comma-separated fields to include or exclude
 *         example: 'type,value'
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query for variant value
 *         example: 'red'
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [size, color]
 *         description: Filter by variant type
 *         example: color
 *     responses:
 *       200:
 *         description: Variants retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VariantListResponse'
 *             example:
 *               success: true
 *               count: 3
 *               data:
 *                 - _id: 507f1f77bcf86cd799439011
 *                   type: color
 *                   value: Red
 *                   createdAt: 2024-01-01T00:00:00.000Z
 *                   updatedAt: 2024-01-01T00:00:00.000Z
 *                 - _id: 507f1f77bcf86cd799439022
 *                   type: color
 *                   value: Blue
 *                   createdAt: 2024-01-01T00:00:00.000Z
 *                   updatedAt: 2024-01-01T00:00:00.000Z
 *                 - _id: 507f1f77bcf86cd799439033
 *                   type: size
 *                   value: Large
 *                   createdAt: 2024-01-01T00:00:00.000Z
 *                   updatedAt: 2024-01-01T00:00:00.000Z
 *       400:
 *         description: Invalid input format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   post:
 *     tags:
 *       - Variant
 *     summary: Create new variant
 *     description: |
 *       Create a new variant. **Admin/SuperAdmin only**.
 *       - `type` must be `size` or `color`
 *       - `value` must be **unique** across all variants
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVariantRequest'
 *           examples:
 *             sizeVariant:
 *               summary: Create size variant
 *               value:
 *                 type: size
 *                 value: XL
 *             colorVariant:
 *               summary: Create color variant
 *               value:
 *                 type: color
 *                 value: Navy Blue
 *             numericSize:
 *               summary: Create numeric size
 *               value:
 *                 type: size
 *                 value: "42"
 *     responses:
 *       201:
 *         description: Variant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VariantCreateResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: 507f1f77bcf86cd799439011
 *                 type: size
 *                 value: XL
 *                 createdAt: 2024-01-01T00:00:00.000Z
 *                 updatedAt: 2024-01-01T00:00:00.000Z
 *               message: new variant created successfully
 *       400:
 *         description: Validation failed or value already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               valueExists:
 *                 value:
 *                   success: false
 *                   message: Variant value already exists
 *               invalidType:
 *                 value:
 *                   success: false
 *                   message: Variant type must be either "size" or "color"
 *               combinationExists:
 *                 value:
 *                   success: false
 *                   message: 'Variant with type "size" and value "XL" already exists'
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
 * /api/variants/{id}:
 *   get:
 *     tags:
 *       - Variant
 *     summary: Get single variant
 *     description: Retrieve a single variant by ID.
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Variant ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Variant retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VariantSingleResponse'
 *             example:
 *               success: true
 *               count: 1
 *               data:
 *                 - _id: 507f1f77bcf86cd799439011
 *                   type: color
 *                   value: Red
 *                   createdAt: 2024-01-01T00:00:00.000Z
 *                   updatedAt: 2024-01-01T00:00:00.000Z
 *       404:
 *         description: Variant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Variant not found
 *
 *   patch:
 *     tags:
 *       - Variant
 *     summary: Update variant
 *     description: |
 *       Update an existing variant. **Admin/SuperAdmin only**.
 *       - `value` must be **unique** across all variants
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Variant ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateVariantRequest'
 *           examples:
 *             updateValue:
 *               summary: Update value only
 *               value:
 *                 value: Extra Large
 *             updateType:
 *               summary: Change variant type
 *               value:
 *                 type: color
 *             updateAll:
 *               summary: Update both fields
 *               value:
 *                 type: size
 *                 value: 3XL
 *     responses:
 *       200:
 *         description: Variant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VariantUpdateResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: 507f1f77bcf86cd799439011
 *                 type: size
 *                 value: Extra Large
 *                 createdAt: 2024-01-01T00:00:00.000Z
 *                 updatedAt: 2024-01-05T00:00:00.000Z
 *               message: variant updated successfully
 *       400:
 *         description: Validation failed or value already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               valueExists:
 *                 value:
 *                   success: false
 *                   message: Variant value already exists
 *               invalidType:
 *                 value:
 *                   success: false
 *                   message: Variant type must be either "size" or "color"
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
 *         description: Variant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Variant not found
 *
 *   delete:
 *     tags:
 *       - Variant
 *     summary: Delete variant
 *     description: |
 *       Delete a variant. **Admin/SuperAdmin only**.
 *       - **Cannot delete if variant is used in any ProductVariant**
 *       - This protects data integrity between Variant and ProductVariant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Variant ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Variant deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VariantDeleteResponse'
 *             example:
 *               success: true
 *               message: variant removed successfully
 *       400:
 *         description: Variant is used in products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: This variant is used in some products and cannot be deleted
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
 *         description: Variant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Variant not found
 */