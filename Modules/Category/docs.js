/**
 * @openapi
 * tags:
 *   - name: Category
 *     description: Category management endpoints (hierarchical structure with parent/child relationships)
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
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: Electronics
 *         image:
 *           type: string
 *           example: uploads/categories/electronics.png
 *         isPublished:
 *           type: boolean
 *           example: true
 *         supCategoryId:
 *           type: object
 *           nullable: true
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439022
 *             title:
 *               type: string
 *               example: Home
 *             image:
 *               type: string
 *               example: uploads/categories/home.png
 *             isPublished:
 *               type: boolean
 *               example: true
 *           description: Parent category (null for main categories)
 *         subCategoryIds:
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
 *               image:
 *                 type: string
 *                 example: uploads/categories/smartphones.png
 *               isPublished:
 *                 type: boolean
 *                 example: true
 *           description: Child categories
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *
 *     CreateCategoryRequest:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: Smartphones
 *           description: Category title (must be unique)
 *         image:
 *           type: string
 *           maxLength: 500
 *           example: uploads/categories/smartphones.png
 *           description: Category image path (optional)
 *         isPublished:
 *           type: boolean
 *           default: true
 *           example: true
 *           description: Category visibility (optional)
 *         supCategoryId:
 *           type: string
 *           nullable: true
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 507f1f77bcf86cd799439011
 *           description: Parent category ID (optional, null for main categories)
 *
 *     UpdateCategoryRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: Smartphones & Tablets
 *         image:
 *           type: string
 *           example: uploads/categories/smartphones-new.png
 *         isPublished:
 *           type: boolean
 *           example: false
 *         supCategoryId:
 *           type: string
 *           nullable: true
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 507f1f77bcf86cd799439011
 *           description: Parent category ID (null to make it a main category)
 *
 *     CategoryListResponse:
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
 *             $ref: '#/components/schemas/Category'
 *
 *     CategorySingleResponse:
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
 *             $ref: '#/components/schemas/Category'
 *
 *     CategoryCreateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Category'
 *         message:
 *           type: string
 *           example: category Created Successfully
 *
 *     CategoryUpdateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Category'
 *         message:
 *           type: string
 *           example: category updated Successfully
 *
 *     CategoryDeleteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: category deleted Successfully
 */

/**
 * @openapi
 * /api/categories:
 *   get:
 *     tags:
 *       - Category
 *     summary: Get all categories
 *     description: |
 *       Retrieve all categories with filtering, sorting, and pagination.
 *       - **Public users**: Only see published categories (isPublished: true)
 *       - **Admin/SuperAdmin**: See all categories
 *       - Automatically populates `supCategoryId` (parent) and `subCategoryIds` (children)
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
 *         description: Comma-separated fields to include or exclude (prefix with -)
 *         example: 'title,image,isPublished'
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query for category title
 *         example: 'electronics'
 *       - in: query
 *         name: isPublished
 *         schema:
 *           type: boolean
 *         description: Filter by publication status (admin only)
 *         example: true
 *       - in: query
 *         name: supCategoryId
 *         schema:
 *           type: string
 *           nullable: true
 *         description: Filter by parent category ID
 *         example: 507f1f77bcf86cd799439011
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: Relations to populate
 *         example: 'supCategoryId,subCategoryIds'
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryListResponse'
 *             example:
 *               success: true
 *               count: 2
 *               data:
 *                 - _id: 507f1f77bcf86cd799439011
 *                   title: Electronics
 *                   image: uploads/categories/electronics.png
 *                   isPublished: true
 *                   supCategoryId: null
 *                   subCategoryIds:
 *                     - _id: 507f1f77bcf86cd799439022
 *                       title: Smartphones
 *                       image: uploads/categories/smartphones.png
 *                       isPublished: true
 *                   createdAt: 2024-01-01T00:00:00.000Z
 *                   updatedAt: 2024-01-01T00:00:00.000Z
 *                 - _id: 507f1f77bcf86cd799439022
 *                   title: Smartphones
 *                   image: uploads/categories/smartphones.png
 *                   isPublished: true
 *                   supCategoryId:
 *                     _id: 507f1f77bcf86cd799439011
 *                     title: Electronics
 *                     image: uploads/categories/electronics.png
 *                   subCategoryIds: []
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
 *       - Category
 *     summary: Create new category
 *     description: |
 *       Create a new category. **Admin/SuperAdmin only**.
 *       - If `supCategoryId` is provided, it automatically adds this category to parent's `subCategoryIds`
 *       - Title must be unique
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryRequest'
 *           examples:
 *             mainCategory:
 *               summary: Create main category (no parent)
 *               value:
 *                 title: Electronics
 *                 image: uploads/categories/electronics.png
 *                 isPublished: true
 *             subCategory:
 *               summary: Create subcategory (with parent)
 *               value:
 *                 title: Smartphones
 *                 image: uploads/categories/smartphones.png
 *                 isPublished: true
 *                 supCategoryId: 507f1f77bcf86cd799439011
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryCreateResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: 507f1f77bcf86cd799439022
 *                 title: Smartphones
 *                 image: uploads/categories/smartphones.png
 *                 isPublished: true
 *                 supCategoryId: 507f1f77bcf86cd799439011
 *                 subCategoryIds: []
 *                 createdAt: 2024-01-01T00:00:00.000Z
 *                 updatedAt: 2024-01-01T00:00:00.000Z
 *               message: category Created Successfully
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
 *                   message: Category title already taken
 *               invalidParent:
 *                 value:
 *                   success: false
 *                   message: Super category not found
 *               deepNesting:
 *                 value:
 *                   success: false
 *                   message: Super category cannot be a subcategory itself
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
 * /api/categories/{id}:
 *   get:
 *     tags:
 *       - Category
 *     summary: Get single category
 *     description: |
 *       Retrieve a single category by ID with parent and children populated.
 *       - **Public users**: Only see the category if isPublished is true
 *       - **Admin/SuperAdmin**: See any category
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategorySingleResponse'
 *             example:
 *               success: true
 *               count: 1
 *               data:
 *                 - _id: 507f1f77bcf86cd799439011
 *                   title: Electronics
 *                   image: uploads/categories/electronics.png
 *                   isPublished: true
 *                   supCategoryId: null
 *                   subCategoryIds:
 *                     - _id: 507f1f77bcf86cd799439022
 *                       title: Smartphones
 *                       image: uploads/categories/smartphones.png
 *                       isPublished: true
 *                     - _id: 507f1f77bcf86cd799439033
 *                       title: Laptops
 *                       image: uploads/categories/laptops.png
 *                       isPublished: true
 *                   createdAt: 2024-01-01T00:00:00.000Z
 *                   updatedAt: 2024-01-01T00:00:00.000Z
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Category not found
 *
 *   patch:
 *     tags:
 *       - Category
 *     summary: Update category
 *     description: |
 *       Update an existing category. **Admin/SuperAdmin only**.
 *       - If parent changes, old parent's `subCategoryIds` is updated and new parent is updated
 *       - If image changes, old image is deleted from server
 *       - Category cannot be its own parent
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategoryRequest'
 *           examples:
 *             updateTitle:
 *               summary: Update title only
 *               value:
 *                 title: Consumer Electronics
 *             changeParent:
 *               summary: Change parent category
 *               value:
 *                 supCategoryId: 507f1f77bcf86cd799439044
 *             makeMain:
 *               summary: Make it a main category (remove parent)
 *               value:
 *                 supCategoryId: null
 *             unpublish:
 *               summary: Unpublish category
 *               value:
 *                 isPublished: false
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryUpdateResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: 507f1f77bcf86cd799439011
 *                 title: Consumer Electronics
 *                 image: uploads/categories/electronics.png
 *                 isPublished: false
 *                 supCategoryId: null
 *                 subCategoryIds:
 *                   - 507f1f77bcf86cd799439022
 *                 createdAt: 2024-01-01T00:00:00.000Z
 *                 updatedAt: 2024-01-01T00:00:00.000Z
 *               message: category updated Successfully
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
 *                   message: Category title already taken
 *               selfParent:
 *                 value:
 *                   success: false
 *                   message: Category cannot be its own parent
 *               deepNesting:
 *                 value:
 *                   success: false
 *                   message: Category nesting depth cannot exceed 3 levels
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
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Category not found
 *
 *   delete:
 *     tags:
 *       - Category
 *     summary: Delete category
 *     description: |
 *       Delete a category. **Admin/SuperAdmin only**.
 *       - Category cannot be deleted if it is used in any product
 *       - Category cannot be deleted if it is a parent of other categories
 *       - If it has a parent, its ID is removed from parent's `subCategoryIds`
 *       - Category image is deleted from server
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryDeleteResponse'
 *             example:
 *               success: true
 *               message: category deleted Successfully
 *       400:
 *         description: Category is used in products or has subcategories
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               usedInProducts:
 *                 value:
 *                   success: false
 *                   message: This category is used in some products and cannot be deleted
 *               hasChildren:
 *                 value:
 *                   success: false
 *                   message: This category is a parent of some categories and cannot be deleted
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
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Category not found
 */