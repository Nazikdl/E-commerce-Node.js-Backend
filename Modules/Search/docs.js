/**
 * @openapi
 * tags:
 *   - name: Search
 *     description: Global search across products, categories, and brands (public endpoint)
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
 *     SearchProduct:
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
 *           example: Latest Samsung smartphone
 *         slug:
 *           type: string
 *           example: samsung-galaxy-s24
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["uploads/products/image1.jpg"]
 *         minPrice:
 *           type: number
 *           example: 1000
 *         maxPrice:
 *           type: number
 *           example: 1200
 *         avgRating:
 *           type: number
 *           example: 4.5
 *         InStock:
 *           type: boolean
 *           example: true
 *         isPublished:
 *           type: boolean
 *           example: true
 *
 *     SearchCategory:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439022
 *         title:
 *           type: string
 *           example: Smartphones
 *         image:
 *           type: string
 *           example: uploads/categories/smartphones.png
 *         isPublished:
 *           type: boolean
 *           example: true
 *         supCategoryId:
 *           type: object
 *           nullable: true
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439033
 *             title:
 *               type: string
 *               example: Electronics
 *         subCategoryIds:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439044
 *               title:
 *                 type: string
 *                 example: Android Phones
 *
 *     SearchBrand:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439055
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
 *     SearchProductsResult:
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
 *             $ref: '#/components/schemas/SearchProduct'
 *
 *     SearchCategoriesResult:
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
 *             $ref: '#/components/schemas/SearchCategory'
 *
 *     SearchBrandsResult:
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
 *             $ref: '#/components/schemas/SearchBrand'
 *
 *     SearchResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             product:
 *               $ref: '#/components/schemas/SearchProductsResult'
 *             categories:
 *               $ref: '#/components/schemas/SearchCategoriesResult'
 *             brands:
 *               $ref: '#/components/schemas/SearchBrandsResult'
 */

/**
 * @openapi
 * /api/search:
 *   get:
 *     tags:
 *       - Search
 *     summary: Global search
 *     description: |
 *       Search across **products**, **categories**, and **brands** in a single request.
 *       
 *       **Behavior:**
 *       - Only returns **published** items (`isPublished: true`)
 *       - Returns results from **all three** collections simultaneously
 *       - Each collection has its own pagination (`count` and `data`)
 *       - If **no results** found in any collection → returns `404`
 *       
 *       **Search fields:**
 *       - Products: `title`
 *       - Categories: `title`
 *       - Brands: `title`
 *       
 *       **Population:**
 *       - Products: `defaultProductVariantId`, `categoryIds`, `brandId`, `variantIds`
 *       - Categories: `supCategoryId`, `subCategoryIds`
 *     security: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         description: Search query (matches title fields)
 *         example: 'samsung'
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number (applied to all collections)
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of items per page per collection
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
 *         example: 'title,images,minPrice'
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: Relations to populate
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [all, products, categories, brands]
 *           default: all
 *         description: Filter search results by type
 *         example: all
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Minimum price filter (products only)
 *         example: 100
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Maximum price filter (products only, must be >= minPrice)
 *         example: 500
 *       - in: query
 *         name: brandId
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Filter products by brand ID
 *         example: 507f1f77bcf86cd799439055
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Filter products by category ID
 *         example: 507f1f77bcf86cd799439022
 *       - in: query
 *         name: InStock
 *         schema:
 *           type: boolean
 *         description: Filter products by stock status
 *         example: true
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 *             example:
 *               success: true
 *               data:
 *                 product:
 *                   success: true
 *                   count: 10
 *                   data:
 *                     - _id: 507f1f77bcf86cd799439011
 *                       title: Samsung Galaxy S24
 *                       description: Latest Samsung smartphone
 *                       slug: samsung-galaxy-s24
 *                       images: ["uploads/products/image1.jpg"]
 *                       minPrice: 1000
 *                       maxPrice: 1200
 *                       avgRating: 4.5
 *                       InStock: true
 *                       isPublished: true
 *                 categories:
 *                   success: true
 *                   count: 5
 *                   data:
 *                     - _id: 507f1f77bcf86cd799439022
 *                       title: Smartphones
 *                       image: uploads/categories/smartphones.png
 *                       isPublished: true
 *                       supCategoryId:
 *                         _id: 507f1f77bcf86cd799439033
 *                         title: Electronics
 *                       subCategoryIds: []
 *                 brands:
 *                   success: true
 *                   count: 3
 *                   data:
 *                     - _id: 507f1f77bcf86cd799439055
 *                       title: Samsung
 *                       image: uploads/brands/samsung-logo.png
 *                       isPublished: true
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               emptyQuery:
 *                 value:
 *                   success: false
 *                   message: Search query cannot be empty
 *               invalidPrice:
 *                 value:
 *                   success: false
 *                   message: maxPrice must be greater than or equal to minPrice
 *       404:
 *         description: No results found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: result not found
 */