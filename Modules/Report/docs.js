/**
 * @openapi
 * tags:
 *   - name: Report
 *     description: Reporting and analytics endpoints (Admin dashboard + User dashboard + Aggregations)
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
 *           example: "Page must be a positive integer | Limit must be between 1 and 100"
 *
 *     AdminOverview:
 *       type: object
 *       properties:
 *         totalRevenue: { type: number, example: 125000000 }
 *         totalOrders: { type: number, example: 850 }
 *         totalUsers: { type: number, example: 320 }
 *         totalProducts: { type: number, example: 150 }
 *         lowStockCount: { type: number, example: 8 }
 *         averageRating: { type: number, example: 4.35 }
 *
 *     SalesChartPoint:
 *       type: object
 *       properties:
 *         date: { type: string, example: "2024-06-15" }
 *         revenue: { type: number, example: 12500000 }
 *         orders: { type: number, example: 42 }
 *
 *     OrderStats:
 *       type: object
 *       properties:
 *         pending: { type: number, example: 15 }
 *         success: { type: number, example: 800 }
 *         failed: { type: number, example: 25 }
 *         stockIssue: { type: number, example: 10 }
 *
 *     ProductStats:
 *       type: object
 *       properties:
 *         total: { type: number, example: 150 }
 *         published: { type: number, example: 140 }
 *         unpublished: { type: number, example: 10 }
 *         inStock: { type: number, example: 135 }
 *         outOfStock: { type: number, example: 15 }
 *
 *     UserStats:
 *       type: object
 *       properties:
 *         total: { type: number, example: 320 }
 *         active: { type: number, example: 300 }
 *         inactive: { type: number, example: 20 }
 *         newUsers: { type: number, example: 45 }
 *
 *     DiscountStats:
 *       type: object
 *       properties:
 *         total: { type: number, example: 25 }
 *         published: { type: number, example: 18 }
 *         active: { type: number, example: 12 }
 *         expired: { type: number, example: 5 }
 *
 *     ReviewStats:
 *       type: object
 *       properties:
 *         total: { type: number, example: 450 }
 *         published: { type: number, example: 380 }
 *         pending: { type: number, example: 70 }
 *         averageRating: { type: number, example: 4.35 }
 *
 *     TopProduct:
 *       type: object
 *       properties:
 *         productId: { type: string, example: "507f1f77bcf86cd799439011" }
 *         title: { type: string, example: "Samsung Galaxy S24" }
 *         image: { type: string, example: "uploads/products/image1.jpg" }
 *         soldQuantity: { type: number, example: 250 }
 *         revenue: { type: number, example: 225000 }
 *         avgRating: { type: number, example: 4.7 }
 *
 *     LowStockProduct:
 *       type: object
 *       properties:
 *         variantId: { type: string, example: "507f1f77bcf86cd799439022" }
 *         productId: { type: string, example: "507f1f77bcf86cd799439011" }
 *         productTitle: { type: string, example: "Samsung Galaxy S24" }
 *         quantity: { type: number, example: 3 }
 *         price: { type: number, example: 1000 }
 *         finalPrice: { type: number, example: 900 }
 *
 *     AdminReportResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: true }
 *         data:
 *           type: object
 *           properties:
 *             range:
 *               type: object
 *               properties:
 *                 from: { type: string, format: date-time }
 *                 to: { type: string, format: date-time }
 *             overview: { $ref: '#/components/schemas/AdminOverview' }
 *             sales:
 *               type: array
 *               items: { $ref: '#/components/schemas/SalesChartPoint' }
 *             orders: { $ref: '#/components/schemas/OrderStats' }
 *             products: { $ref: '#/components/schemas/ProductStats' }
 *             users: { $ref: '#/components/schemas/UserStats' }
 *             topProducts:
 *               type: array
 *               items: { $ref: '#/components/schemas/TopProduct' }
 *             lowStockProducts:
 *               type: array
 *               items: { $ref: '#/components/schemas/LowStockProduct' }
 *             recentOrders:
 *               type: array
 *               items: { type: object }
 *             discounts: { $ref: '#/components/schemas/DiscountStats' }
 *             reviews: { $ref: '#/components/schemas/ReviewStats' }
 *
 *     UserReportResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: true }
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               type: object
 *               properties:
 *                 id: { type: string, example: "507f1f77bcf86cd799439022" }
 *                 fullName: { type: string, example: "John Doe" }
 *                 phoneNumber: { type: string, example: "09123456789" }
 *             overview:
 *               type: object
 *               properties:
 *                 totalOrders: { type: number, example: 15 }
 *                 successfulOrders: { type: number, example: 12 }
 *                 totalSpent: { type: number, example: 15000000 }
 *                 favoritesCount: { type: number, example: 8 }
 *                 reviewsCount: { type: number, example: 5 }
 *             orders:
 *               type: object
 *               properties:
 *                 pending: { type: number, example: 1 }
 *                 success: { type: number, example: 12 }
 *                 failed: { type: number, example: 2 }
 *                 stockIssue: { type: number, example: 0 }
 *                 total: { type: number, example: 15 }
 *             recentOrders:
 *               type: array
 *               items: { type: object }
 *             favoriteProducts:
 *               type: array
 *               items: { type: object }
 *             recentlyPurchased:
 *               type: array
 *               items: { type: object }
 *             productsToReview:
 *               type: array
 *               items: { type: object }
 *             availableDiscounts:
 *               type: array
 *               items: { type: object }
 *
 *     UserMostOrderCountItem:
 *       type: object
 *       properties:
 *         _id: { type: string, example: "507f1f77bcf86cd799439022" }
 *         totalOrderCount: { type: number, example: 15 }
 *         userData:
 *           type: object
 *           properties:
 *             _id: { type: string, example: "507f1f77bcf86cd799439022" }
 *             fullName: { type: string, example: "John Doe" }
 *             phoneNumber: { type: string, example: "09123456789" }
 *
 *     UserMostOrderPriceItem:
 *       type: object
 *       properties:
 *         _id: { type: string, example: "507f1f77bcf86cd799439022" }
 *         totalOrderPrice: { type: number, example: 15000000 }
 *         userData:
 *           type: object
 *           properties:
 *             _id: { type: string, example: "507f1f77bcf86cd799439022" }
 *             fullName: { type: string, example: "John Doe" }
 *             phoneNumber: { type: string, example: "09123456789" }
 *
 *     BrandMostSellItem:
 *       type: object
 *       properties:
 *         _id: { type: string, example: "507f1f77bcf86cd799439033" }
 *         totalOrderCount: { type: number, example: 520 }
 *         brandData:
 *           type: object
 *           properties:
 *             _id: { type: string, example: "507f1f77bcf86cd799439033" }
 *             title: { type: string, example: "Samsung" }
 *             image: { type: string, example: "uploads/brands/samsung.png" }
 *
 *     CategoryMostSellItem:
 *       type: object
 *       properties:
 *         _id: { type: string, example: "507f1f77bcf86cd799439044" }
 *         totalOrderCount: { type: number, example: 380 }
 *         categoryData:
 *           type: object
 *           properties:
 *             _id: { type: string, example: "507f1f77bcf86cd799439044" }
 *             title: { type: string, example: "Smartphones" }
 *             image: { type: string, example: "uploads/categories/smartphones.png" }
 */

/**
 * @openapi
 * /api/reports/admin:
 *   get:
 *     tags:
 *       - Report
 *     summary: Get admin dashboard report
 *     description: |
 *       Retrieve comprehensive dashboard data for admin. **Admin/SuperAdmin only**.
 *
 *       **Includes:**
 *       - Overview (revenue, orders, users, products, low stock, avg rating)
 *       - Sales chart (daily revenue and orders)
 *       - Order statistics by status
 *       - Product statistics (published, in stock)
 *       - User statistics (active, new)
 *       - Top 10 selling products
 *       - Top 10 low stock products
 *       - 10 most recent orders
 *       - Discount statistics
 *       - Review statistics
 *     parameters:
 *       - in: query
 *         name: range
 *         schema:
 *           type: string
 *           enum: [today, 7d, 30d, 3m, 1y]
 *           default: 30d
 *         description: Time range for the report
 *         example: 30d
 *     responses:
 *       200:
 *         description: Admin report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminReportResponse'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Range must be one of today, 7d, 30d, 3m, 1y
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
 * /api/reports/user:
 *   get:
 *     tags:
 *       - Report
 *     summary: Get user dashboard report
 *     description: |
 *       Retrieve personalized dashboard data for the current user.
 *
 *       **Includes:**
 *       - User profile (name, phone)
 *       - Overview (total orders, successful orders, total spent, favorites, reviews)
 *       - Order statistics by status
 *       - 10 most recent orders
 *       - Favorite products (up to 10)
 *       - Recently purchased products (up to 10)
 *       - Products to review (purchased but not rated, up to 10)
 *       - Available discounts (active, up to 10)
 *     responses:
 *       200:
 *         description: User report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserReportResponse'
 *       400:
 *         description: Invalid user id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Invalid user id
 *       401:
 *         description: Authentication required
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
 *               message: User not found
 */

/**
 * @openapi
 * /api/reports/users-most-orders:
 *   get:
 *     tags:
 *       - Report
 *     summary: Get users with most orders
 *     description: |
 *       Retrieve users ranked by number of successful orders. **Admin/SuperAdmin only**.
 *       - Only counts orders with `status: "success"`
 *       - Sorted by `totalOrderCount` descending
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
 *         description: Number of results per page
 *       - in: query
 *         name: startTime
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date filter (ISO 8601)
 *         example: 2024-01-01T00:00:00.000Z
 *       - in: query
 *         name: endTime
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date filter (ISO 8601, must be after startTime)
 *         example: 2024-12-31T23:59:59.000Z
 *     responses:
 *       200:
 *         description: Users with most orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 page: { type: number, example: 1 }
 *                 limit: { type: number, example: 10 }
 *                 count: { type: number, example: 10 }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserMostOrderCountItem'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidPage:
 *                 value:
 *                   success: false
 *                   message: Page must be a positive integer
 *               invalidLimit:
 *                 value:
 *                   success: false
 *                   message: Limit must be between 1 and 100
 *               invalidDate:
 *                 value:
 *                   success: false
 *                   message: startTime must be a valid ISO 8601 date
 *               wrongOrder:
 *                 value:
 *                   success: false
 *                   message: endTime must be after startTime
 *               multipleErrors:
 *                 value:
 *                   success: false
 *                   message: Page must be a positive integer | Limit must be between 1 and 100
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin permission required
 *
 * /api/reports/users-most-price:
 *   get:
 *     tags:
 *       - Report
 *     summary: Get users with most spending
 *     description: |
 *       Retrieve users ranked by total spending. **Admin/SuperAdmin only**.
 *       - Only counts orders with `status: "success"`
 *       - Sorted by `totalOrderPrice` descending
 *       - Sums `finalPriceAfterDiscount` of orders
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: startTime
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endTime
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Users with most spending retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 page: { type: number, example: 1 }
 *                 limit: { type: number, example: 10 }
 *                 count: { type: number, example: 10 }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserMostOrderPriceItem'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin permission required
 *
 * /api/reports/brands-most-sell:
 *   get:
 *     tags:
 *       - Report
 *     summary: Get best-selling brands
 *     description: |
 *       Retrieve brands ranked by total quantity sold. **Admin/SuperAdmin only**.
 *       - Only counts orders with `status: "success"`
 *       - Unwinds `items` and groups by `items.brandId`
 *       - Sums `items.cartQuantity`
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: startTime
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endTime
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Best-selling brands retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 page: { type: number, example: 1 }
 *                 limit: { type: number, example: 10 }
 *                 count: { type: number, example: 10 }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BrandMostSellItem'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin permission required
 *
 * /api/reports/categories-most-sell:
 *   get:
 *     tags:
 *       - Report
 *     summary: Get best-selling categories
 *     description: |
 *       Retrieve categories ranked by total quantity sold. **Admin/SuperAdmin only**.
 *       - Only counts orders with `status: "success"`
 *       - Double unwinds `items` and `items.categoryIds`
 *       - Sums `items.cartQuantity`
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: startTime
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endTime
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Best-selling categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 page: { type: number, example: 1 }
 *                 limit: { type: number, example: 10 }
 *                 count: { type: number, example: 10 }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CategoryMostSellItem'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin permission required
 */