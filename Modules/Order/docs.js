/**
 * @openapi
 * tags:
 *   - name: Order
 *     description: Order management endpoints (checkout, payment, verification)
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
 *     OrderItem:
 *       type: object
 *       properties:
 *         productVariantId:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439011
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
 *                   example: 507f1f77bcf86cd799439022
 *                 type:
 *                   type: string
 *                   enum: [size, color]
 *                   example: size
 *                 value:
 *                   type: string
 *                   example: Large
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
 *             slug:
 *               type: string
 *               example: samsung-galaxy-s24
 *         cartQuantity:
 *           type: number
 *           example: 2
 *         brandId:
 *           type: string
 *           example: 507f1f77bcf86cd799439044
 *         categoryIds:
 *           type: array
 *           items:
 *             type: string
 *
 *     StockIssueItem:
 *       type: object
 *       properties:
 *         productVariantId:
 *           type: object
 *           description: Product variant with stock issue
 *         cartQuantity:
 *           type: number
 *           example: 5
 *         sufficientQuantity:
 *           type: number
 *           example: 2
 *
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         orderCode:
 *           type: string
 *           example: ORD-2024-000000001
 *           description: Auto-generated order code
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
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         totalPrice:
 *           type: number
 *           example: 2000
 *         finalPrice:
 *           type: number
 *           example: 1800
 *         finalPriceAfterDiscount:
 *           type: number
 *           example: 1620
 *         freeShipping:
 *           type: boolean
 *           example: false
 *         discountCodeId:
 *           type: object
 *           nullable: true
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439033
 *             code:
 *               type: string
 *               example: SUMMER2024
 *             type:
 *               type: string
 *               enum: [percentage, fixed]
 *               example: percentage
 *             value:
 *               type: number
 *               example: 10
 *         address:
 *           type: object
 *           description: Shipping address (snapshot at order time)
 *         status:
 *           type: string
 *           enum: [pending, success, failed, stockIssue]
 *           example: pending
 *         stockIssueItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/StockIssueItem'
 *         authority:
 *           type: string
 *           example: A000000000000000000000000000000000000
 *           description: Zarinpal payment authority
 *         refId:
 *           type: string
 *           example: "123456789"
 *           description: Zarinpal reference ID after successful payment
 *         cashBackPrice:
 *           type: number
 *           example: 0
 *           description: Amount to refund if stock issue occurred
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     RequestPaymentRequest:
 *       type: object
 *       required:
 *         - addressId
 *       properties:
 *         addressId:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 507f1f77bcf86cd799439055
 *           description: Address ID (must belong to current user)
 *         code:
 *           type: string
 *           example: SUMMER2024
 *           description: Optional discount code
 *
 *     RequestPaymentResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             bankUrl:
 *               type: string
 *               example: https://www.zarinpal.com/pg/StartPay/A000000000000000000000000000000000000
 *               description: Zarinpal payment gateway URL
 *             amount:
 *               type: number
 *               example: 1620
 *         message:
 *           type: string
 *           example: payment requested successfully
 *
 *     VerifyPaymentRequest:
 *       type: object
 *       required:
 *         - authority
 *       properties:
 *         authority:
 *           type: string
 *           example: A000000000000000000000000000000000000
 *           description: Authority code from Zarinpal callback
 *
 *     VerifyPaymentResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             refId:
 *               type: string
 *               example: "123456789"
 *         message:
 *           type: string
 *           example: payment verified successfully
 *
 *     OrderListResponse:
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
 *             $ref: '#/components/schemas/Order'
 *
 *     OrderSingleResponse:
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
 *             $ref: '#/components/schemas/Order'
 *
 *     OrderUpdateRequest:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, success, failed, stockIssue]
 *           example: success
 *           description: Only status can be updated by admin
 *
 *     OrderUpdateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Order'
 *         message:
 *           type: string
 *           example: order updated successfully
 */

/**
 * @openapi
 * /api/orders:
 *   get:
 *     tags:
 *       - Order
 *     summary: Get all orders
 *     description: |
 *       Retrieve all orders with filtering, sorting, and pagination.
 *       - **Regular users**: Only see **their own** orders
 *       - **Admin/SuperAdmin**: See **all** orders
 *       - Automatically populates `userId`, `items.productId`, `discountCodeId`
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
 *         description: |
 *           Sort field with prefix (- for descending, + for ascending).
 *           Allowed fields: `totalPrice`, `finalPrice`, `finalPriceAfterDiscount`,
 *           `freeShipping`, `status`, `createdAt`, `updatedAt`, `orderCode`, `cashBackPrice`
 *         example: '-createdAt'
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Comma-separated fields to include or exclude
 *         example: 'orderCode,status,totalPrice,finalPriceAfterDiscount'
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query (matches order code)
 *         example: 'ORD-2024'
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: |
 *           Relations to populate.
 *           Allowed: `userId`, `items.productId`, `discountCodeId`
 *         example: 'userId,items.productId'
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, success, failed, stockIssue]
 *         description: Filter by status
 *         example: success
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderListResponse'
 *             example:
 *               success: true
 *               count: 5
 *               data:
 *                 - _id: 507f1f77bcf86cd799439011
 *                   orderCode: ORD-2024-000000001
 *                   userId:
 *                     _id: 507f1f77bcf86cd799439022
 *                     fullName: John Doe
 *                     phoneNumber: "09123456789"
 *                   items:
 *                     - productVariantId:
 *                         _id: 507f1f77bcf86cd799439033
 *                         price: 1000
 *                         finalPrice: 900
 *                         variantId:
 *                           type: size
 *                           value: Large
 *                       productId:
 *                         _id: 507f1f77bcf86cd799439044
 *                         title: Samsung Galaxy S24
 *                         images: ["uploads/products/image1.jpg"]
 *                         slug: samsung-galaxy-s24
 *                       cartQuantity: 2
 *                   totalPrice: 2000
 *                   finalPrice: 1800
 *                   finalPriceAfterDiscount: 1620
 *                   freeShipping: false
 *                   status: pending
 *                   createdAt: 2024-01-01T00:00:00.000Z
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   post:
 *     tags:
 *       - Order
 *     summary: Request payment (create order)
 *     description: |
 *       Create a new order from the current user's cart and request payment from Zarinpal.
 *       
 *       **Validations:**
 *       - Cart must not be empty
 *       - Address must exist and belong to the current user
 *       - If discount code is provided, it must be valid
 *       - Cart items are re-validated (stock, price) before creating order
 *       
 *       **Auto-generated fields:**
 *       - `orderCode`: Format `ORD-{year}-{9-digit-sequence}`
 *       - `totalPrice`, `finalPrice`, `finalPriceAfterDiscount`: Calculated from items
 *       - `authority`: From Zarinpal payment gateway
 *       - `status`: Set to `pending`
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RequestPaymentRequest'
 *           examples:
 *             withoutDiscount:
 *               summary: Checkout without discount
 *               value:
 *                 addressId: 507f1f77bcf86cd799439055
 *             withDiscount:
 *               summary: Checkout with discount code
 *               value:
 *                 addressId: 507f1f77bcf86cd799439055
 *                 code: SUMMER2024
 *     responses:
 *       200:
 *         description: Payment requested successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RequestPaymentResponse'
 *             example:
 *               success: true
 *               data:
 *                 bankUrl: https://www.zarinpal.com/pg/StartPay/A000000000000000000000000000000000000
 *                 amount: 1620
 *               message: payment requested successfully
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               emptyCart:
 *                 value:
 *                   success: false
 *                   message: your cart is empty
 *               invalidAddress:
 *                 value:
 *                   success: false
 *                   message: invalid address
 *               invalidDiscount:
 *                 value:
 *                   success: false
 *                   message: invalid discount code
 *               cartChanged:
 *                 value:
 *                   success: false
 *                   message: you have some changes in your cart please check it again
 *               bankFailure:
 *                 value:
 *                   success: false
 *                   message: failed to request payment
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/orders/verify:
 *   post:
 *     tags:
 *       - Order
 *     summary: Verify payment
 *     description: |
 *       Verify payment after Zarinpal callback. **Public endpoint** (called by Zarinpal gateway or client).
 *       
 *       **Process:**
 *       1. Find order by `authority`
 *       2. Verify payment with Zarinpal
 *       3. If successful:
 *          - Update discount code usage
 *          - Decrease product variant quantities
 *          - Increase `boughtCount` for variants and products
 *          - Add products to user's `boughtProductIds`
 *          - Handle stock issues (if quantity insufficient)
 *          - Calculate cashback if needed
 *          - Clear user's cart
 *       4. Update order status to `success`, `failed`, or `stockIssue`
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyPaymentRequest'
 *           example:
 *             authority: A000000000000000000000000000000000000
 *     responses:
 *       200:
 *         description: Payment verified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerifyPaymentResponse'
 *             examples:
 *               success:
 *                 summary: Payment verified successfully
 *                 value:
 *                   success: true
 *                   data:
 *                     refId: "123456789"
 *                   message: payment verified successfully
 *               failed:
 *                 summary: Payment failed
 *                 value:
 *                   success: false
 *                   message: payment failed
 *               alreadyVerified:
 *                 summary: Payment already verified (code 101)
 *                 value:
 *                   success: true
 *                   message: payment already verified
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidAuthority:
 *                 value:
 *                   success: false
 *                   message: invalid authority
 *               notPending:
 *                 value:
 *                   success: false
 *                   message: order is not pending
 *               authorityNotFound:
 *                 value:
 *                   success: false
 *                   message: Order with this authority not found
 */

/**
 * @openapi
 * /api/orders/{id}:
 *   get:
 *     tags:
 *       - Order
 *     summary: Get single order
 *     description: |
 *       Retrieve a single order by ID.
 *       - **Regular users**: Only see their **own** order (`id` must belong to them)
 *       - **Admin/SuperAdmin**: See **any** order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderSingleResponse'
 *             example:
 *               success: true
 *               count: 1
 *               data:
 *                 - _id: 507f1f77bcf86cd799439011
 *                   orderCode: ORD-2024-000000001
 *                   userId:
 *                     _id: 507f1f77bcf86cd799439022
 *                     fullName: John Doe
 *                     phoneNumber: "09123456789"
 *                   items:
 *                     - productId:
 *                         _id: 507f1f77bcf86cd799439044
 *                         title: Samsung Galaxy S24
 *                         images: ["uploads/products/image1.jpg"]
 *                       cartQuantity: 2
 *                   totalPrice: 2000
 *                   finalPrice: 1800
 *                   finalPriceAfterDiscount: 1620
 *                   status: success
 *                   refId: "123456789"
 *                   createdAt: 2024-01-01T00:00:00.000Z
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Order not found
 *
 *   patch:
 *     tags:
 *       - Order
 *     summary: Update order status (Admin only)
 *     description: |
 *       Update order status. **Admin/SuperAdmin only**.
 *       
 *       **Only `status` field can be updated.** All other fields are:
 *       - Auto-generated (`orderCode`)
 *       - Auto-calculated (`totalPrice`, `finalPrice`, `finalPriceAfterDiscount`, `cashBackPrice`)
 *       - Immutable after creation (`userId`, `items`, `address`, `discountCodeId`, `authority`)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderUpdateRequest'
 *           example:
 *             status: success
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderUpdateResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: 507f1f77bcf86cd799439011
 *                 orderCode: ORD-2024-000000001
 *                 status: success
 *               message: order updated successfully
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidStatus:
 *                 value:
 *                   success: false
 *                   message: 'Status must be one of: pending, success, failed, stockIssue'
 *               immutableField:
 *                 value:
 *                   success: false
 *                   message: totalPrice is auto-calculated
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
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Order not found
 */