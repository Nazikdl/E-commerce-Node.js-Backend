/**
 * @openapi
 * tags:
 *   - name: Product
 *     description: Product management endpoints
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
 *     Information:
 *       type: object
 *       properties:
 *         key:
 *           type: string
 *           example: Material
 *         value:
 *           type: string
 *           example: Cotton
 *
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         title:
 *           type: string
 *           example: Samsung Galaxy S24
 *         description:
 *           type: string
 *           example: Latest Samsung smartphone with AI features
 *         slug:
 *           type: string
 *           example: samsung-galaxy-s24
 *         brandId:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439022
 *             title:
 *               type: string
 *               example: Samsung
 *         categoryIds:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439033
 *               title:
 *                 type: string
 *                 example: Smartphones
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["uploads/products/image1.jpg", "uploads/products/image2.jpg"]
 *         videos:
 *           type: array
 *           items:
 *             type: string
 *           example: ["uploads/products/video1.mp4"]
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["smartphone", "samsung", "5g"]
 *         minPrice:
 *           type: number
 *           example: 1000
 *         maxPrice:
 *           type: number
 *           example: 1200
 *         maxDiscountPercent:
 *           type: number
 *           example: 15
 *         avgRating:
 *           type: number
 *           example: 4.5
 *         ratingCount:
 *           type: number
 *           example: 120
 *         boughtCount:
 *           type: number
 *           example: 50
 *         InStock:
 *           type: boolean
 *           example: true
 *         isPublished:
 *           type: boolean
 *           example: true
 *         variantIds:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439044
 *               type:
 *                 type: string
 *                 enum: [size, color]
 *                 example: color
 *               value:
 *                 type: string
 *                 example: Black
 *         productVariantIds:
 *           type: array
 *           items:
 *             type: string
 *           example: ["507f1f77bcf86cd799439055"]
 *         defaultProductVariantId:
 *           type: object
 *           nullable: true
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439055
 *             price:
 *               type: number
 *               example: 1000
 *             finalPrice:
 *               type: number
 *               example: 900
 *             discountPercent:
 *               type: number
 *               example: 10
 *             variantId:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 507f1f77bcf86cd799439044
 *                 type:
 *                   type: string
 *                   example: color
 *                 value:
 *                   type: string
 *                   example: Black
 *         information:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Information'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *
 *     CreateProductRequest:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           maxLength: 200
 *           example: Samsung Galaxy S24
 *         description:
 *           type: string
 *           minLength: 10
 *           maxLength: 5000
 *           example: Latest Samsung smartphone with AI features
 *         brandId:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 507f1f77bcf86cd799439022
 *         categoryIds:
 *           type: array
 *           items:
 *             type: string
 *             pattern: '^[0-9a-fA-F]{24}$'
 *           example: ["507f1f77bcf86cd799439033"]
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["uploads/products/image1.jpg"]
 *         videos:
 *           type: array
 *           items:
 *             type: string
 *           example: ["uploads/products/video1.mp4"]
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["smartphone", "samsung"]
 *         minPrice:
 *           type: number
 *           minimum: 0
 *           example: 1000
 *         maxPrice:
 *           type: number
 *           minimum: 0
 *           example: 1200
 *         maxDiscountPercent:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           example: 15
 *         InStock:
 *           type: boolean
 *           default: true
 *           example: true
 *         isPublished:
 *           type: boolean
 *           default: true
 *           example: true
 *         information:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Information'
 *           example:
 *             - key: Material
 *               value: Aluminum
 *             - key: Warranty
 *               value: "18 months"
 *
 *     UpdateProductRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           maxLength: 200
 *           example: Samsung Galaxy S24 Ultra
 *         description:
 *           type: string
 *           minLength: 10
 *           maxLength: 5000
 *           example: Updated description
 *         brandId:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 507f1f77bcf86cd799439022
 *         categoryIds:
 *           type: array
 *           items:
 *             type: string
 *           example: ["507f1f77bcf86cd799439033"]
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["uploads/products/new-image1.jpg"]
 *         videos:
 *           type: array
 *           items:
 *             type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["smartphone", "samsung", "5g"]
 *         InStock:
 *           type: boolean
 *           example: false
 *         isPublished:
 *           type: boolean
 *           example: false
 *         information:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Information'
 *
 *     ProductListResponse:
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
 *             $ref: '#/components/schemas/Product'
 *
 *     ProductSingleResponse:
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
 *             $ref: '#/components/schemas/Product'
 *         isBought:
 *           type: boolean
 *           example: false
 *           description: Whether current user bought this product
 *         isFavorite:
 *           type: boolean
 *           example: true
 *           description: Whether current user added this product to favorites
 *         isRated:
 *           type: boolean
 *           example: false
 *           description: Whether current user rated this product
 *
 *     ProductCreateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Product'
 *         message:
 *           type: string
 *           example: product successfully created
 *
 *     ProductUpdateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Product'
 *         message:
 *           type: string
 *           example: product successfully updated
 *
 *     ProductDeleteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: product successfully deleted
 *
 *     FavoriteToggleResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: added from favorite product successfully
 */

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get all products
 *     description: |
 *       Retrieve all products with filtering, sorting, and pagination.
 *       - **Public users**: Only see published products (isPublished: true)
 *       - **Admin/SuperAdmin**: See all products
 *       - Automatically populates `defaultProductVariantId`, `categoryIds`, `brandId`, `variantIds`
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
 *         example: '-createdAt'
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Comma-separated fields to include or exclude
 *         example: 'title,minPrice,maxPrice,images'
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query for product title
 *         example: 'samsung'
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *         example: 100
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *         example: 500
 *       - in: query
 *         name: brandId
 *         schema:
 *           type: string
 *         description: Filter by brand ID
 *         example: 507f1f77bcf86cd799439022
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *         example: 507f1f77bcf86cd799439033
 *       - in: query
 *         name: InStock
 *         schema:
 *           type: boolean
 *         description: Filter by stock status
 *         example: true
 *       - in: query
 *         name: isPublished
 *         schema:
 *           type: boolean
 *         description: Filter by publication status (admin only)
 *         example: true
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *             example:
 *               success: true
 *               count: 2
 *               data:
 *                 - _id: 507f1f77bcf86cd799439011
 *                   title: Samsung Galaxy S24
 *                   description: Latest Samsung smartphone
 *                   slug: samsung-galaxy-s24
 *                   brandId:
 *                     _id: 507f1f77bcf86cd799439022
 *                     title: Samsung
 *                   categoryIds:
 *                     - _id: 507f1f77bcf86cd799439033
 *                       title: Smartphones
 *                   images: ["uploads/products/image1.jpg"]
 *                   minPrice: 1000
 *                   maxPrice: 1200
 *                   maxDiscountPercent: 15
 *                   avgRating: 4.5
 *                   ratingCount: 120
 *                   InStock: true
 *                   isPublished: true
 *       400:
 *         description: Invalid input format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   post:
 *     tags:
 *       - Product
 *     summary: Create new product
 *     description: |
 *       Create a new product. **Admin/SuperAdmin only**.
 *       - Title must be unique
 *       - Slug is auto-generated from title
 *       - `maxPrice` must be >= `minPrice`
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *           examples:
 *             basic:
 *               summary: Basic product
 *               value:
 *                 title: Samsung Galaxy S24
 *                 description: Latest Samsung smartphone with AI features
 *                 brandId: 507f1f77bcf86cd799439022
 *                 categoryIds: ["507f1f77bcf86cd799439033"]
 *                 minPrice: 1000
 *                 maxPrice: 1200
 *                 isPublished: true
 *             withDetails:
 *               summary: Product with images and info
 *               value:
 *                 title: iPhone 15 Pro
 *                 description: Apple flagship smartphone
 *                 brandId: 507f1f77bcf86cd799439044
 *                 categoryIds: ["507f1f77bcf86cd799439033"]
 *                 images: ["uploads/products/iphone1.jpg", "uploads/products/iphone2.jpg"]
 *                 tags: ["smartphone", "apple", "5g"]
 *                 minPrice: 1500
 *                 maxPrice: 1800
 *                 maxDiscountPercent: 10
 *                 information:
 *                   - key: Material
 *                     value: Titanium
 *                   - key: Warranty
 *                     value: "18 months"
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductCreateResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: 507f1f77bcf86cd799439011
 *                 title: Samsung Galaxy S24
 *                 slug: samsung-galaxy-s24
 *                 description: Latest Samsung smartphone
 *                 minPrice: 1000
 *                 maxPrice: 1200
 *                 InStock: true
 *                 isPublished: true
 *               message: product successfully created
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               titleTaken:
 *                 value:
 *                   success: false
 *                   message: Product title already taken
 *               invalidPrice:
 *                 value:
 *                   success: false
 *                   message: maxPrice must be greater than or equal to minPrice
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
 * /api/products/{id}:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get single product
 *     description: |
 *       Retrieve a single product by ID.
 *       - **Public users**: Only see the product if isPublished is true
 *       - **Admin/SuperAdmin**: See any product
 *       - If authenticated, also returns `isBought`, `isFavorite`, `isRated` flags
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductSingleResponse'
 *             example:
 *               success: true
 *               count: 1
 *               data:
 *                 - _id: 507f1f77bcf86cd799439011
 *                   title: Samsung Galaxy S24
 *                   description: Latest Samsung smartphone
 *                   slug: samsung-galaxy-s24
 *                   brandId:
 *                     _id: 507f1f77bcf86cd799439022
 *                     title: Samsung
 *                   categoryIds:
 *                     - _id: 507f1f77bcf86cd799439033
 *                       title: Smartphones
 *                   images: ["uploads/products/image1.jpg"]
 *                   minPrice: 1000
 *                   maxPrice: 1200
 *                   avgRating: 4.5
 *                   InStock: true
 *               isBought: false
 *               isFavorite: true
 *               isRated: false
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Product not found
 *
 *   patch:
 *     tags:
 *       - Product
 *     summary: Update product
 *     description: |
 *       Update an existing product. **Admin/SuperAdmin only**.
 *       - Read-only fields (`minPrice`, `maxPrice`, `avgRating`, `ratingCount`, `boughtCount`, `variantIds`, `productVariantIds`, `InStock`, `slug`, `maxDiscountPercent`) cannot be updated directly
 *       - If images change, removed images are deleted from server
 *       - If videos change, removed videos are deleted from server
 *       - Slug is auto-regenerated if title changes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductRequest'
 *           examples:
 *             updateTitle:
 *               summary: Update title
 *               value:
 *                 title: Samsung Galaxy S24 Ultra
 *             updateImages:
 *               summary: Update images (old ones deleted)
 *               value:
 *                 images: ["uploads/products/new-image1.jpg"]
 *             unpublish:
 *               summary: Unpublish product
 *               value:
 *                 isPublished: false
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductUpdateResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: 507f1f77bcf86cd799439011
 *                 title: Samsung Galaxy S24 Ultra
 *                 slug: samsung-galaxy-s24-ultra
 *                 isPublished: false
 *               message: product successfully updated
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
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   delete:
 *     tags:
 *       - Product
 *     summary: Delete product
 *     description: |
 *       Delete a product. **Admin/SuperAdmin only**.
 *       - **Cannot delete if product has been bought** (`boughtCount > 0`)
 *       - Deletes all comments and product variants associated with this product
 *       - Deletes all images and videos from server
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductDeleteResponse'
 *             example:
 *               success: true
 *               message: product successfully deleted
 *       400:
 *         description: Cannot delete bought product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: you can not delete this product
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
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/products/favorite/{id}:
 *   post:
 *     tags:
 *       - Product
 *     summary: Toggle favorite product
 *     description: |
 *       Add or remove a product from user's favorites. **Requires authentication**.
 *       - If product is already in favorites → Removes it
 *       - If product is not in favorites → Adds it
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Favorite status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FavoriteToggleResponse'
 *             examples:
 *               added:
 *                 summary: Added to favorites
 *                 value:
 *                   success: true
 *                   message: added from favorite product successfully
 *               removed:
 *                 summary: Removed from favorites
 *                 value:
 *                   success: true
 *                   message: removed from favorite product successfully
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */