/**
 * @openapi
 * tags:
 *   - name: ProductVariant
 *     description: Product variant management endpoints (price, stock, discount per product-variant combination)
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
 *     ProductVariant:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         variantId:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439022
 *             type:
 *               type: string
 *               enum: [size, color]
 *               example: size
 *             value:
 *               type: string
 *               example: Large
 *         productId:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439033
 *             title:
 *               type: string
 *               example: Samsung Galaxy S24
 *             images:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["uploads/products/image1.jpg"]
 *         price:
 *           type: number
 *           example: 1000
 *           description: Base price
 *         discountPercent:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           example: 10
 *           description: Discount percentage
 *         finalPrice:
 *           type: number
 *           example: 900
 *           description: Auto-calculated final price (price - discount)
 *         quantity:
 *           type: number
 *           example: 50
 *           description: Available quantity in stock
 *         boughtCount:
 *           type: number
 *           example: 5
 *           description: Number of times this variant has been bought
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *
 *     CreateProductVariantRequest:
 *       type: object
 *       required:
 *         - variantId
 *         - productId
 *         - price
 *       properties:
 *         variantId:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 507f1f77bcf86cd799439022
 *           description: Variant ID (must exist)
 *         productId:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 507f1f77bcf86cd799439033
 *           description: Product ID (must exist)
 *         price:
 *           type: number
 *           minimum: 0
 *           example: 1000
 *           description: Base price
 *         quantity:
 *           type: number
 *           minimum: 0
 *           default: 0
 *           example: 50
 *           description: Stock quantity
 *         discountPercent:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           default: 0
 *           example: 10
 *           description: Discount percentage
 *
 *     UpdateProductVariantRequest:
 *       type: object
 *       properties:
 *         variantId:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 507f1f77bcf86cd799439022
 *         productId:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 507f1f77bcf86cd799439033
 *         price:
 *           type: number
 *           minimum: 0
 *           example: 1100
 *         quantity:
 *           type: number
 *           minimum: 0
 *           example: 30
 *         discountPercent:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           example: 15
 *
 *     ProductVariantListResponse:
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
 *             $ref: '#/components/schemas/ProductVariant'
 *
 *     ProductVariantSingleResponse:
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
 *             $ref: '#/components/schemas/ProductVariant'
 *
 *     ProductVariantCreateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/ProductVariant'
 *         message:
 *           type: string
 *           example: product variant created successfully
 *
 *     ProductVariantUpdateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/ProductVariant'
 *         message:
 *           type: string
 *           example: product variant updated successfully
 *
 *     ProductVariantDeleteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: product variant removed successfully
 */

/**
 * @openapi
 * /api/product-variants:
 *   get:
 *     tags:
 *       - ProductVariant
 *     summary: Get all product variants
 *     description: |
 *       Retrieve all product variants with filtering, sorting, and pagination.
 *       - Automatically populates `variantId` and `productId` (title, images)
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
 *         example: 'price,quantity,discountPercent,finalPrice'
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         description: Filter by product ID
 *         example: 507f1f77bcf86cd799439033
 *       - in: query
 *         name: variantId
 *         schema:
 *           type: string
 *         description: Filter by variant ID
 *         example: 507f1f77bcf86cd799439022
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
 *         name: inStock
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: Filter by stock status
 *         example: "true"
 *     responses:
 *       200:
 *         description: Product variants retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariantListResponse'
 *             example:
 *               success: true
 *               count: 2
 *               data:
 *                 - _id: 507f1f77bcf86cd799439011
 *                   variantId:
 *                     _id: 507f1f77bcf86cd799439022
 *                     type: size
 *                     value: Large
 *                   productId:
 *                     _id: 507f1f77bcf86cd799439033
 *                     title: Samsung Galaxy S24
 *                     images: ["uploads/products/image1.jpg"]
 *                   price: 1000
 *                   discountPercent: 10
 *                   finalPrice: 900
 *                   quantity: 50
 *                   boughtCount: 5
 *       400:
 *         description: Invalid input format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   post:
 *     tags:
 *       - ProductVariant
 *     summary: Create new product variant
 *     description: |
 *       Create a new product variant. **Admin/SuperAdmin only**.
 *       - `variantId` and `productId` must exist
 *       - The product-variant combination must be **unique** (cannot assign same variant twice to same product)
 *       - `finalPrice` is **auto-calculated** from `price` and `discountPercent`
 *       - **Automatically updates parent product:**
 *         - `minPrice`, `maxPrice` (from all variants)
 *         - `maxDiscountPercent` (highest discount)
 *         - `InStock` (true if any variant has quantity > 0)
 *         - `defaultProductVariantId` (variant with highest discount)
 *         - `productVariantIds`, `variantIds`
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductVariantRequest'
 *           examples:
 *             sizeVariant:
 *               summary: Size variant with discount
 *               value:
 *                 variantId: 507f1f77bcf86cd799439022
 *                 productId: 507f1f77bcf86cd799439033
 *                 price: 1000
 *                 quantity: 50
 *                 discountPercent: 10
 *             colorVariant:
 *               summary: Color variant without discount
 *               value:
 *                 variantId: 507f1f77bcf86cd799439044
 *                 productId: 507f1f77bcf86cd799439033
 *                 price: 1200
 *                 quantity: 30
 *     responses:
 *       201:
 *         description: Product variant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariantCreateResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: 507f1f77bcf86cd799439011
 *                 variantId: 507f1f77bcf86cd799439022
 *                 productId: 507f1f77bcf86cd799439033
 *                 price: 1000
 *                 quantity: 50
 *                 discountPercent: 10
 *                 finalPrice: 900
 *               message: product variant created successfully
 *       400:
 *         description: Validation failed or duplicate variant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               duplicate:
 *                 value:
 *                   success: false
 *                   message: This variant is already assigned to this product
 *               variantNotFound:
 *                 value:
 *                   success: false
 *                   message: Variant not found
 *               productNotFound:
 *                 value:
 *                   success: false
 *                   message: Product not found
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
 * /api/product-variants/{id}:
 *   get:
 *     tags:
 *       - ProductVariant
 *     summary: Get single product variant
 *     description: Retrieve a single product variant by ID.
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product variant ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Product variant retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariantSingleResponse'
 *             example:
 *               success: true
 *               count: 1
 *               data:
 *                 - _id: 507f1f77bcf86cd799439011
 *                   variantId:
 *                     _id: 507f1f77bcf86cd799439022
 *                     type: size
 *                     value: Large
 *                   productId:
 *                     _id: 507f1f77bcf86cd799439033
 *                     title: Samsung Galaxy S24
 *                     images: ["uploads/products/image1.jpg"]
 *                   price: 1000
 *                   discountPercent: 10
 *                   finalPrice: 900
 *                   quantity: 50
 *                   boughtCount: 5
 *       404:
 *         description: Product variant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Product variant not found
 *
 *   patch:
 *     tags:
 *       - ProductVariant
 *     summary: Update product variant
 *     description: |
 *       Update an existing product variant. **Admin/SuperAdmin only**.
 *       - `finalPrice` is **auto-recalculated** if `price` or `discountPercent` changes
 *       - `boughtCount` and `finalPrice` are **read-only** (cannot be updated directly)
 *       - **Automatically recalculates parent product:**
 *         - `minPrice`, `maxPrice`, `maxDiscountPercent`, `InStock`, `defaultProductVariantId`
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product variant ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductVariantRequest'
 *           examples:
 *             updatePrice:
 *               summary: Update price only
 *               value:
 *                 price: 1100
 *             updateStock:
 *               summary: Update stock
 *               value:
 *                 quantity: 30
 *             updateDiscount:
 *               summary: Update discount
 *               value:
 *                 discountPercent: 15
 *             updateAll:
 *               summary: Update all fields
 *               value:
 *                 price: 1100
 *                 quantity: 30
 *                 discountPercent: 15
 *     responses:
 *       200:
 *         description: Product variant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariantUpdateResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: 507f1f77bcf86cd799439011
 *                 price: 1100
 *                 quantity: 30
 *                 discountPercent: 15
 *                 finalPrice: 935
 *               message: product variant updated successfully
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               readOnlyBoughtCount:
 *                 value:
 *                   success: false
 *                   message: boughtCount cannot be updated directly
 *               readOnlyFinalPrice:
 *                 value:
 *                   success: false
 *                   message: finalPrice is auto-calculated and cannot be updated directly
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
 *         description: Product variant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   delete:
 *     tags:
 *       - ProductVariant
 *     summary: Delete product variant
 *     description: |
 *       Delete a product variant. **Admin/SuperAdmin only**.
 *       - **Cannot delete if variant has been bought** (`boughtCount > 0`)
 *       - **Automatically updates parent product:**
 *         - Removes variant from `productVariantIds` and `variantIds`
 *         - Recalculates `minPrice`, `maxPrice`, `maxDiscountPercent`, `InStock`, `defaultProductVariantId`
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product variant ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Product variant deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariantDeleteResponse'
 *             example:
 *               success: true
 *               message: product variant removed successfully
 *       400:
 *         description: Cannot delete bought variant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Cannot delete product variant that has been bought
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
 *         description: Product variant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Product variant not found
 */