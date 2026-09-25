/**
 * @openapi
 * tags:
 *   - name: Cart
 *     description: Shopping cart management endpoints (requires authentication)
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
 *     CartItem:
 *       type: object
 *       properties:
 *         productId:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439011
 *             title:
 *               type: string
 *               example: Samsung Galaxy S24
 *             images:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["uploads/products/image1.jpg"]
 *             slug:
 *               type: string
 *               example: samsung-galaxy-s24
 *         productVariantId:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439022
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
 *                   example: 507f1f77bcf86cd799439033
 *                 type:
 *                   type: string
 *                   enum: [size, color]
 *                   example: size
 *                 value:
 *                   type: string
 *                   example: Large
 *         brandId:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439044
 *             title:
 *               type: string
 *               example: Samsung
 *             image:
 *               type: string
 *               example: uploads/brands/samsung.png
 *         categoryIds:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439055
 *               title:
 *                 type: string
 *                 example: Smartphones
 *         cartQuantity:
 *           type: number
 *           example: 2
 *           description: Quantity in cart
 *
 *     Cart:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439066
 *         userId:
 *           type: string
 *           example: 507f1f77bcf86cd799439077
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         totalPrice:
 *           type: number
 *           example: 2000
 *           description: Total price without discounts
 *         finalPrice:
 *           type: number
 *           example: 1800
 *           description: Total price after discounts
 *         finalPriceAfterDiscount:
 *           type: number
 *           example: 1800
 *           description: Final price after additional discounts
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *
 *     AddItemRequest:
 *       type: object
 *       required:
 *         - productVariantId
 *       properties:
 *         productVariantId:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 507f1f77bcf86cd799439022
 *           description: Product variant ID to add
 *
 *     RemoveItemRequest:
 *       type: object
 *       required:
 *         - productVariantId
 *       properties:
 *         productVariantId:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 507f1f77bcf86cd799439022
 *           description: Product variant ID to remove
 *         totalRemove:
 *           type: boolean
 *           default: false
 *           example: false
 *           description: If true, removes all quantity of the item
 *
 *     CartGetResponse:
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
 *             $ref: '#/components/schemas/Cart'
 *
 *     CartActionResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Cart'
 *         message:
 *           type: string
 *           example: add item to cart successfully
 */

/**
 * @openapi
 * /api/cart:
 *   get:
 *     tags:
 *       - Cart
 *     summary: Get user cart
 *     description: Retrieve the current user's cart with all items and calculated prices.
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
 *         name: populate
 *         schema:
 *           type: string
 *         description: Relations to populate
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartGetResponse'
 *             example:
 *               success: true
 *               count: 1
 *               data:
 *                 - _id: 507f1f77bcf86cd799439066
 *                   userId: 507f1f77bcf86cd799439077
 *                   items:
 *                     - productId:
 *                         _id: 507f1f77bcf86cd799439011
 *                         title: Samsung Galaxy S24
 *                         images: ["uploads/products/image1.jpg"]
 *                         slug: samsung-galaxy-s24
 *                       productVariantId:
 *                         _id: 507f1f77bcf86cd799439022
 *                         price: 1000
 *                         finalPrice: 900
 *                         discountPercent: 10
 *                         variantId:
 *                           _id: 507f1f77bcf86cd799439033
 *                           type: size
 *                           value: Large
 *                       brandId:
 *                         _id: 507f1f77bcf86cd799439044
 *                         title: Samsung
 *                         image: uploads/brands/samsung.png
 *                       categoryIds:
 *                         - _id: 507f1f77bcf86cd799439055
 *                           title: Smartphones
 *                       cartQuantity: 2
 *                   totalPrice: 2000
 *                   finalPrice: 1800
 *                   finalPriceAfterDiscount: 1800
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
 *             example:
 *               success: false
 *               message: Authentication required
 *
 *   post:
 *     tags:
 *       - Cart
 *     summary: Add item to cart
 *     description: |
 *       Add a product variant to the user's cart. Automatically:
 *       - Updates prices
 *       - Caps quantity at available stock
 *       - Removes items with 0 stock
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddItemRequest'
 *           example:
 *             productVariantId: 507f1f77bcf86cd799439022
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartActionResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: 507f1f77bcf86cd799439066
 *                 items:
 *                   - productVariantId: 507f1f77bcf86cd799439022
 *                     cartQuantity: 1
 *                 totalPrice: 1000
 *                 finalPrice: 900
 *               message: add item to cart successfully
 *       400:
 *         description: Validation failed or out of stock
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               required:
 *                 value:
 *                   success: false
 *                   message: Product variant ID is required
 *               outOfStock:
 *                 value:
 *                   success: false
 *                   message: This product variant is out of stock
 *               maxQuantity:
 *                 value:
 *                   success: false
 *                   message: max quantity of this item is 5
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   patch:
 *     tags:
 *       - Cart
 *     summary: Remove item from cart
 *     description: |
 *       Remove a product variant from the cart.
 *       - If `totalRemove: false` → Decreases quantity by 1
 *       - If `totalRemove: true` → Removes all quantity of that item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RemoveItemRequest'
 *           examples:
 *             decreaseQuantity:
 *               summary: Remove one quantity
 *               value:
 *                 productVariantId: 507f1f77bcf86cd799439022
 *             removeAll:
 *               summary: Remove all quantity
 *               value:
 *                 productVariantId: 507f1f77bcf86cd799439022
 *                 totalRemove: true
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartActionResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: 507f1f77bcf86cd799439066
 *                 items: []
 *                 totalPrice: 0
 *                 finalPrice: 0
 *               message: remove item from cart successfully
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Product variant not found in cart
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Cart or item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               cartNotFound:
 *                 value:
 *                   success: false
 *                   message: Cart not found
 *               itemNotFound:
 *                 value:
 *                   success: false
 *                   message: Item not found in cart
 *
 *   delete:
 *     tags:
 *       - Cart
 *     summary: Clear entire cart
 *     description: Remove all items from the user's cart and reset prices to zero.
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartActionResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: 507f1f77bcf86cd799439066
 *                 items: []
 *                 totalPrice: 0
 *                 finalPrice: 0
 *                 finalPriceAfterDiscount: 0
 *               message: cart cleared successfully
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Cart not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Cart not found
 */