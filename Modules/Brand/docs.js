/**
 * @openapi
 * tags:
 *   - name: Brand
 *     description: Brand management endpoints
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
 *     Brand:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         title:
 *           type: string
 *           example: Samsung
 *         image:
 *           type: string
 *           example: uploads/brands/samsung-logo.png
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
 *     CreateBrandRequest:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           example: Samsung
 *         image:
 *           type: string
 *           example: uploads/brands/samsung-logo.png
 *         isPublished:
 *           type: boolean
 *           example: true
 *
 *     UpdateBrandRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: Samsung Electronics
 *         image:
 *           type: string
 *           example: uploads/brands/samsung-new-logo.png
 *         isPublished:
 *           type: boolean
 *           example: false
 *
 *     BrandListResponse:
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
 *             $ref: '#/components/schemas/Brand'
 *
 *     BrandSingleResponse:
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
 *             $ref: '#/components/schemas/Brand'
 *
 *     BrandCreateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Brand'
 *         message:
 *           type: string
 *           example: brand Successfully created
 *
 *     BrandUpdateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Brand'
 *         message:
 *           type: string
 *           example: brand Successfully updated
 *
 *     BrandDeleteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: brand Successfully deleted
 */

/**
 * @openapi
 * /api/brands:
 *   get:
 *     tags:
 *       - Brand
 *     summary: Get all brands
 *     description: Retrieve all brands. Public users only see published brands. Admin sees all.
 *     security: []
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
 *         example: 'title,image'
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query for brand title
 *         example: 'samsung'
 *       - in: query
 *         name: isPublished
 *         schema:
 *           type: boolean
 *         description: Filter by publication status (admin only)
 *         example: true
 *     responses:
 *       200:
 *         description: Brands retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BrandListResponse'
 *             example:
 *               success: true
 *               count: 2
 *               data:
 *                 - _id: 507f1f77bcf86cd799439011
 *                   title: Samsung
 *                   image: uploads/brands/samsung-logo.png
 *                   isPublished: true
 *                   createdAt: 2024-01-01T00:00:00.000Z
 *                   updatedAt: 2024-01-01T00:00:00.000Z
 *                 - _id: 507f1f77bcf86cd799439022
 *                   title: Apple
 *                   image: uploads/brands/apple-logo.png
 *                   isPublished: true
 *                   createdAt: 2024-01-01T00:00:00.000Z
 *                   updatedAt: 2024-01-01T00:00:00.000Z
 *       400:
 *         description: Invalid input format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     tags:
 *       - Brand
 *     summary: Create new brand
 *     description: Create a new brand. Admin/SuperAdmin only.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBrandRequest'
 *           example:
 *             title: Samsung
 *             image: uploads/brands/samsung-logo.png
 *             isPublished: true
 *     responses:
 *       201:
 *         description: Brand created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BrandCreateResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: 507f1f77bcf86cd799439011
 *                 title: Samsung
 *                 image: uploads/brands/samsung-logo.png
 *                 isPublished: true
 *                 createdAt: 2024-01-01T00:00:00.000Z
 *                 updatedAt: 2024-01-01T00:00:00.000Z
 *               message: brand Successfully created
 *       400:
 *         description: Validation failed or title already taken
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Brand title already taken
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
 * /api/brands/{id}:
 *   get:
 *     tags:
 *       - Brand
 *     summary: Get single brand
 *     description: Retrieve a single brand by ID. Public users only see published brands.
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Brand ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Comma-separated fields to include or exclude
 *         example: 'title,image,isPublished'
 *     responses:
 *       200:
 *         description: Brand retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BrandSingleResponse'
 *             example:
 *               success: true
 *               count: 1
 *               data:
 *                 - _id: 507f1f77bcf86cd799439011
 *                   title: Samsung
 *                   image: uploads/brands/samsung-logo.png
 *                   isPublished: true
 *                   createdAt: 2024-01-01T00:00:00.000Z
 *                   updatedAt: 2024-01-01T00:00:00.000Z
 *       404:
 *         description: Brand not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Brand not found
 *   patch:
 *     tags:
 *       - Brand
 *     summary: Update brand
 *     description: Update an existing brand. Admin/SuperAdmin only. If image changes, old image will be deleted.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Brand ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBrandRequest'
 *           example:
 *             title: Samsung Electronics
 *             image: uploads/brands/samsung-new-logo.png
 *             isPublished: false
 *     responses:
 *       200:
 *         description: Brand updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BrandUpdateResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: 507f1f77bcf86cd799439011
 *                 title: Samsung Electronics
 *                 image: uploads/brands/samsung-new-logo.png
 *                 isPublished: false
 *                 createdAt: 2024-01-01T00:00:00.000Z
 *                 updatedAt: 2024-01-01T00:00:00.000Z
 *               message: brand Successfully updated
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
 *         description: Admin permission required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Brand not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     tags:
 *       - Brand
 *     summary: Delete brand
 *     description: Delete a brand. Admin/SuperAdmin only. Cannot delete if used in products.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Brand ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Brand deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BrandDeleteResponse'
 *             example:
 *               success: true
 *               message: brand Successfully deleted
 *       400:
 *         description: Brand is used in some products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: this brand used in some product
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
 *         description: Brand not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */