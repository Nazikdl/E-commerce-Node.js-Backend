/**
 * @openapi
 * tags:
 *   - name: Comment
 *     description: Comment and rating management endpoints
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
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         productId:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439022
 *             title:
 *               type: string
 *               example: Samsung Galaxy S24
 *             images:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["uploads/products/image1.jpg"]
 *         userId:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439033
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
 *         replyIds:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439044
 *               content:
 *                 type: string
 *                 example: Thank you for your feedback!
 *               isReply:
 *                 type: boolean
 *                 example: true
 *               isPublished:
 *                 type: boolean
 *                 example: true
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: admin
 *               userId:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 507f1f77bcf86cd799439055
 *                   fullName:
 *                     type: string
 *                     example: Admin User
 *                   phoneNumber:
 *                     type: string
 *                     example: "09123456789"
 *         isReply:
 *           type: boolean
 *           example: false
 *         content:
 *           type: string
 *           minLength: 3
 *           maxLength: 1000
 *           example: Great product! Highly recommend.
 *         isPublished:
 *           type: boolean
 *           example: true
 *         rate:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *           example: 5
 *           description: Rating (only for product comments)
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           example: user
 *         isBought:
 *           type: boolean
 *           example: true
 *           description: Whether user bought the product
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *
 *     CreateCommentRequest:
 *       type: object
 *       required:
 *         - productId
 *         - content
 *       properties:
 *         productId:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 507f1f77bcf86cd799439022
 *           description: Product ID (must exist)
 *         content:
 *           type: string
 *           minLength: 3
 *           maxLength: 1000
 *           example: Excellent product! Very satisfied.
 *         rate:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *           example: 5
 *           description: Rating (only if user purchased the product)
 *
 *     ReplyRequest:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           minLength: 3
 *           maxLength: 1000
 *           example: Thank you for your feedback! We appreciate it.
 *
 *     CommentListResponse:
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
 *             $ref: '#/components/schemas/Comment'
 *
 *     CommentCreateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Comment'
 *         message:
 *           type: string
 *           example: comment Successfully created
 *
 *     CommentUpdateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Comment'
 *         message:
 *           type: string
 *           example: comment Successfully updated
 *
 *     CommentDeleteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: comment Successfully deleted
 *
 *     ReplyResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Comment'
 *         message:
 *           type: string
 *           example: comment replied Successfully
 */

/**
 * @openapi
 * /api/comments:
 *   get:
 *     tags:
 *       - Comment
 *     summary: Get all comments (Admin only)
 *     description: Retrieve all comments across all products. **Admin/SuperAdmin only**.
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
 *       - in: query
 *         name: isPublished
 *         schema:
 *           type: boolean
 *         description: Filter by publication status
 *         example: true
 *       - in: query
 *         name: isReply
 *         schema:
 *           type: boolean
 *         description: Filter by reply status
 *         example: false
 *       - in: query
 *         name: isBought
 *         schema:
 *           type: boolean
 *         description: Filter by purchase status
 *         example: true
 *       - in: query
 *         name: rate
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 5
 *         description: Filter by rating
 *         example: 5
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, admin]
 *         description: Filter by commenter role
 *         example: user
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentListResponse'
 *             example:
 *               success: true
 *               count: 10
 *               data:
 *                 - _id: 507f1f77bcf86cd799439011
 *                   productId:
 *                     _id: 507f1f77bcf86cd799439022
 *                     title: Samsung Galaxy S24
 *                     images: ["uploads/products/image1.jpg"]
 *                   userId:
 *                     _id: 507f1f77bcf86cd799439033
 *                     fullName: John Doe
 *                     phoneNumber: "09123456789"
 *                     role: user
 *                   content: Great product!
 *                   rate: 5
 *                   isPublished: true
 *                   isReply: false
 *                   isBought: true
 *                   role: user
 *                   replyIds: []
 *                   createdAt: 2024-01-01T00:00:00.000Z
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
 *       - Comment
 *     summary: Create new comment
 *     description: |
 *       Create a new comment on a product. **Requires authentication**.
 *       - Users can only rate products they have **purchased**
 *       - Each user can rate a product only **once**
 *       - Comments are **not published** by default (need admin approval)
 *       - When a comment has a rating, product's avgRating and ratingCount are automatically updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommentRequest'
 *           examples:
 *             withoutRate:
 *               summary: Comment without rating
 *               value:
 *                 productId: 507f1f77bcf86cd799439022
 *                 content: Nice product!
 *             withRate:
 *               summary: Comment with rating (only if purchased)
 *               value:
 *                 productId: 507f1f77bcf86cd799439022
 *                 content: Excellent product! Very satisfied.
 *                 rate: 5
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentCreateResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: 507f1f77bcf86cd799439011
 *                 productId: 507f1f77bcf86cd799439022
 *                 userId: 507f1f77bcf86cd799439033
 *                 content: Excellent product!
 *                 rate: 5
 *                 isPublished: false
 *                 isBought: true
 *                 isReply: false
 *                 role: user
 *               message: comment Successfully created
 *       400:
 *         description: Validation failed or permission denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               notPurchased:
 *                 value:
 *                   success: false
 *                   message: You can only rate products you have purchased
 *               alreadyRated:
 *                 value:
 *                   success: false
 *                   message: You have already rated this product
 *               invalidContent:
 *                 value:
 *                   success: false
 *                   message: Content must be between 3 to 1000 characters
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/comments/{productId}:
 *   get:
 *     tags:
 *       - Comment
 *     summary: Get comments for a product
 *     description: |
 *       Retrieve all comments for a specific product.
 *       - **Public users**: Only see published comments (isPublished: true)
 *       - **Admin/SuperAdmin**: See all comments
 *       - Automatically populates `userId`, `productId`, and `replyIds`
 *     security: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: Product ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439022
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
 *         name: rate
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 5
 *         description: Filter by rating
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentListResponse'
 *             example:
 *               success: true
 *               count: 5
 *               data:
 *                 - _id: 507f1f77bcf86cd799439011
 *                   content: Great product!
 *                   rate: 5
 *                   userId:
 *                     _id: 507f1f77bcf86cd799439033
 *                     fullName: John Doe
 *                     phoneNumber: "09123456789"
 *                   productId:
 *                     _id: 507f1f77bcf86cd799439022
 *                     title: Samsung Galaxy S24
 *                     images: ["uploads/products/image1.jpg"]
 *                   isPublished: true
 *                   isReply: false
 *                   replyIds:
 *                     - _id: 507f1f77bcf86cd799439044
 *                       content: Thank you for your feedback!
 *                       isReply: true
 *                       isPublished: true
 *                       role: admin
 *                       userId:
 *                         _id: 507f1f77bcf86cd799439055
 *                         fullName: Admin User
 *                         phoneNumber: "09123456789"
 *                         role: admin
 *                   createdAt: 2024-01-01T00:00:00.000Z
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/comments/{id}:
 *   patch:
 *     tags:
 *       - Comment
 *     summary: Toggle comment publish status
 *     description: Publish or unpublish a comment. **Admin/SuperAdmin only**.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Comment ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Comment publish status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentUpdateResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: 507f1f77bcf86cd799439011
 *                 content: Great product!
 *                 isPublished: true
 *                 rate: 5
 *               message: comment Successfully updated
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
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Comment not found
 *   delete:
 *     tags:
 *       - Comment
 *     summary: Delete comment and its replies
 *     description: |
 *       Delete a comment and all its replies. **Admin/SuperAdmin only**.
 *       - All replies associated with this comment are also deleted
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Comment ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentDeleteResponse'
 *             example:
 *               success: true
 *               message: comment Successfully deleted
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
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Comment not found
 */

/**
 * @openapi
 * /api/comments/reply/{commentId}:
 *   post:
 *     tags:
 *       - Comment
 *     summary: Reply to a comment
 *     description: |
 *       Create a reply to an existing comment. **Requires authentication**.
 *       - Only **admin** users can reply (for now)
 *       - Admin replies are **published** immediately (isPublished: true)
 *       - User replies are **not published** by default
 *       - Reply is added to parent comment's `replyIds`
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: Parent comment ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReplyRequest'
 *           example:
 *             content: Thank you for your feedback! We appreciate it.
 *     responses:
 *       200:
 *         description: Reply created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReplyResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: 507f1f77bcf86cd799439044
 *                 productId: 507f1f77bcf86cd799439022
 *                 userId: 507f1f77bcf86cd799439055
 *                 content: Thank you for your feedback!
 *                 isReply: true
 *                 isPublished: true
 *                 role: admin
 *               message: comment replied Successfully
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Content must be between 3 to 1000 characters
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Only admins can reply
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Only admins can reply to comments
 *       404:
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Comment not found
 */