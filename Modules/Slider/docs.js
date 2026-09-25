/**
 * @openapi
 * tags:
 *   - name: Slider
 *     description: Slider management endpoints (homepage banners, promotional images)
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
 *     Slider:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         title:
 *           type: string
 *           nullable: true
 *           maxLength: 100
 *           example: Summer Sale 2024
 *         image:
 *           type: string
 *           maxLength: 500
 *           example: uploads/sliders/summer-sale.jpg
 *         isPublished:
 *           type: boolean
 *           example: true
 *         path:
 *           type: string
 *           default: /
 *           example: /products/summer-sale
 *           description: Internal navigation path
 *         href:
 *           type: string
 *           nullable: true
 *           example: https://example.com/summer-sale
 *           description: External link URL
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *
 *     CreateSliderRequest:
 *       type: object
 *       required:
 *         - image
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 100
 *           example: Summer Sale 2024
 *           description: Slider title (optional)
 *         image:
 *           type: string
 *           maxLength: 500
 *           example: uploads/sliders/summer-sale.jpg
 *           description: Slider image path (required)
 *         isPublished:
 *           type: boolean
 *           default: true
 *           example: true
 *         path:
 *           type: string
 *           default: /
 *           example: /products/summer-sale
 *           description: Internal navigation path (must start with /)
 *         href:
 *           type: string
 *           maxLength: 500
 *           example: https://example.com/summer-sale
 *           description: External URL (optional)
 *
 *     UpdateSliderRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 100
 *           example: Summer Sale 2024 - Updated
 *         image:
 *           type: string
 *           maxLength: 500
 *           example: uploads/sliders/summer-sale-new.jpg
 *         isPublished:
 *           type: boolean
 *           example: false
 *         path:
 *           type: string
 *           example: /products/summer-sale-2024
 *         href:
 *           type: string
 *           maxLength: 500
 *           example: https://example.com/summer-sale-2024
 *
 *     SliderListResponse:
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
 *             $ref: '#/components/schemas/Slider'
 *
 *     SliderSingleResponse:
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
 *             $ref: '#/components/schemas/Slider'
 *
 *     SliderCreateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Slider'
 *         message:
 *           type: string
 *           example: new slider created successfully
 *
 *     SliderUpdateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Slider'
 *         message:
 *           type: string
 *           example: slider updated successfully
 *
 *     SliderDeleteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: slider removed successfully
 */

/**
 * @openapi
 * /api/sliders:
 *   get:
 *     tags:
 *       - Slider
 *     summary: Get all sliders
 *     description: |
 *       Retrieve all sliders with filtering, sorting, and pagination.
 *       - **Public users**: Only see published sliders (isPublished: true)
 *       - **Admin/SuperAdmin**: See all sliders
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of items per page
 *         example: 10
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
 *         example: 'title,image,path'
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query for slider title
 *         example: 'sale'
 *       - in: query
 *         name: isPublished
 *         schema:
 *           type: boolean
 *         description: Filter by publication status (admin only)
 *         example: true
 *     responses:
 *       200:
 *         description: Sliders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SliderListResponse'
 *             example:
 *               success: true
 *               count: 2
 *               data:
 *                 - _id: 507f1f77bcf86cd799439011
 *                   title: Summer Sale 2024
 *                   image: uploads/sliders/summer-sale.jpg
 *                   isPublished: true
 *                   path: /products/summer-sale
 *                   href: null
 *                   createdAt: 2024-01-01T00:00:00.000Z
 *                   updatedAt: 2024-01-01T00:00:00.000Z
 *                 - _id: 507f1f77bcf86cd799439022
 *                   title: New Arrivals
 *                   image: uploads/sliders/new-arrivals.jpg
 *                   isPublished: true
 *                   path: /products/new
 *                   href: https://example.com/new
 *                   createdAt: 2024-01-02T00:00:00.000Z
 *                   updatedAt: 2024-01-02T00:00:00.000Z
 *       400:
 *         description: Invalid input format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   post:
 *     tags:
 *       - Slider
 *     summary: Create new slider
 *     description: |
 *       Create a new slider. **Admin/SuperAdmin only**.
 *       - `image` is **required**
 *       - `path` must start with `/`
 *       - `href` must be a valid URL or start with `/`
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSliderRequest'
 *           examples:
 *             minimal:
 *               summary: Slider with only image
 *               value:
 *                 image: uploads/sliders/banner.jpg
 *             full:
 *               summary: Slider with all fields
 *               value:
 *                 title: Summer Sale 2024
 *                 image: uploads/sliders/summer-sale.jpg
 *                 isPublished: true
 *                 path: /products/summer-sale
 *                 href: https://example.com/summer-sale
 *     responses:
 *       201:
 *         description: Slider created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SliderCreateResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: 507f1f77bcf86cd799439011
 *                 title: Summer Sale 2024
 *                 image: uploads/sliders/summer-sale.jpg
 *                 isPublished: true
 *                 path: /products/summer-sale
 *                 href: https://example.com/summer-sale
 *                 createdAt: 2024-01-01T00:00:00.000Z
 *                 updatedAt: 2024-01-01T00:00:00.000Z
 *               message: new slider created successfully
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingImage:
 *                 value:
 *                   success: false
 *                   message: Image is required
 *               invalidPath:
 *                 value:
 *                   success: false
 *                   message: Path must start with "/"
 *               invalidHref:
 *                 value:
 *                   success: false
 *                   message: Invalid URL format. Must be a valid URL or path
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
 * /api/sliders/{id}:
 *   get:
 *     tags:
 *       - Slider
 *     summary: Get single slider
 *     description: |
 *       Retrieve a single slider by ID.
 *       - **Public users**: Only see the slider if isPublished is true
 *       - **Admin/SuperAdmin**: See any slider
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Slider ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Slider retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SliderSingleResponse'
 *             example:
 *               success: true
 *               count: 1
 *               data:
 *                 - _id: 507f1f77bcf86cd799439011
 *                   title: Summer Sale 2024
 *                   image: uploads/sliders/summer-sale.jpg
 *                   isPublished: true
 *                   path: /products/summer-sale
 *                   href: https://example.com/summer-sale
 *                   createdAt: 2024-01-01T00:00:00.000Z
 *                   updatedAt: 2024-01-01T00:00:00.000Z
 *       404:
 *         description: Slider not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Slider not found
 *
 *   patch:
 *     tags:
 *       - Slider
 *     summary: Update slider
 *     description: |
 *       Update an existing slider. **Admin/SuperAdmin only**.
 *       - If `image` changes, old image is deleted from server
 *       - `path` must start with `/`
 *       - `href` must be a valid URL or start with `/`
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Slider ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSliderRequest'
 *           examples:
 *             updateTitle:
 *               summary: Update title only
 *               value:
 *                 title: Summer Sale 2024 - Extended
 *             changeImage:
 *               summary: Change image (old one deleted)
 *               value:
 *                 image: uploads/sliders/summer-sale-new.jpg
 *             unpublish:
 *               summary: Unpublish slider
 *               value:
 *                 isPublished: false
 *             fullUpdate:
 *               summary: Update all fields
 *               value:
 *                 title: Winter Sale 2024
 *                 image: uploads/sliders/winter-sale.jpg
 *                 isPublished: true
 *                 path: /products/winter-sale
 *                 href: https://example.com/winter-sale
 *     responses:
 *       200:
 *         description: Slider updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SliderUpdateResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: 507f1f77bcf86cd799439011
 *                 title: Winter Sale 2024
 *                 image: uploads/sliders/winter-sale.jpg
 *                 isPublished: true
 *                 path: /products/winter-sale
 *                 href: https://example.com/winter-sale
 *                 createdAt: 2024-01-01T00:00:00.000Z
 *                 updatedAt: 2024-01-05T00:00:00.000Z
 *               message: slider updated successfully
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
 *         description: Slider not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Slider not found
 *
 *   delete:
 *     tags:
 *       - Slider
 *     summary: Delete slider
 *     description: |
 *       Delete a slider. **Admin/SuperAdmin only**.
 *       - Slider image is deleted from server
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Slider ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Slider deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SliderDeleteResponse'
 *             example:
 *               success: true
 *               message: slider removed successfully
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
 *         description: Slider not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Slider not found
 */