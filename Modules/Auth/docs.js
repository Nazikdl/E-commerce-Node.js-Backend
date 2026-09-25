/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints (OTP, password login, password reset)
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
 *     AuthRequest:
 *       type: object
 *       required:
 *         - phoneNumber
 *       properties:
 *         phoneNumber:
 *           type: string
 *           pattern: '^(\+98|0)?9\d{9}$'
 *           example: "09123456789"
 *           description: Iranian mobile number
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             userExist:
 *               type: boolean
 *               example: false
 *               description: Whether user exists in database
 *             password:
 *               type: boolean
 *               example: false
 *               description: Whether user has set a password
 *         message:
 *           type: string
 *           example: otp code sent
 *
 *     LoginPasswordRequest:
 *       type: object
 *       required:
 *         - phoneNumber
 *         - password
 *       properties:
 *         phoneNumber:
 *           type: string
 *           pattern: '^(\+98|0)?9\d{9}$'
 *           example: "09123456789"
 *         password:
 *           type: string
 *           minLength: 8
 *           pattern: '^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])'
 *           example: SecurePass123
 *           description: 'At least 8 characters, one uppercase, one lowercase, one number'
 *
 *     LoginOtpRequest:
 *       type: object
 *       required:
 *         - phoneNumber
 *         - code
 *       properties:
 *         phoneNumber:
 *           type: string
 *           pattern: '^(\+98|0)?9\d{9}$'
 *           example: "09123456789"
 *         code:
 *           type: string
 *           minLength: 4
 *           maxLength: 6
 *           pattern: '^\d+$'
 *           example: "123456"
 *           description: OTP code received via SMS
 *
 *     ResendCodeRequest:
 *       type: object
 *       required:
 *         - phoneNumber
 *       properties:
 *         phoneNumber:
 *           type: string
 *           pattern: '^(\+98|0)?9\d{9}$'
 *           example: "09123456789"
 *
 *     ForgetPasswordRequest:
 *       type: object
 *       required:
 *         - phoneNumber
 *         - code
 *         - newPassword
 *       properties:
 *         phoneNumber:
 *           type: string
 *           pattern: '^(\+98|0)?9\d{9}$'
 *           example: "09123456789"
 *         code:
 *           type: string
 *           minLength: 4
 *           maxLength: 6
 *           pattern: '^\d+$'
 *           example: "123456"
 *         newPassword:
 *           type: string
 *           minLength: 8
 *           pattern: '^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])'
 *           example: NewSecurePass123
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               description: JWT access token
 *             user:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 507f1f77bcf86cd799439011
 *                 phoneNumber:
 *                   type: string
 *                   example: "09123456789"
 *                 fullName:
 *                   type: string
 *                   example: John Doe
 *                 role:
 *                   type: string
 *                   enum: [user, admin, superAdmin]
 *                   example: user
 *                 isActive:
 *                   type: boolean
 *                   example: true
 *         message:
 *           type: string
 *           example: login with password successfully
 *
 *     MessageResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: operation successfully
 */

/**
 * @openapi
 * /api/auth:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Initialize authentication
 *     description: |
 *       Check if user exists and determine authentication method:
 *       - If user doesn't have password → Send OTP via SMS
 *       - If user has password → Prompt for password login
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRequest'
 *           example:
 *             phoneNumber: "09123456789"
 *     responses:
 *       200:
 *         description: Authentication initialized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             examples:
 *               newUser:
 *                 summary: New user (OTP sent)
 *                 value:
 *                   success: true
 *                   data:
 *                     userExist: false
 *                     password: false
 *                   message: otp code sent
 *               existingUserWithPassword:
 *                 summary: Existing user with password
 *                 value:
 *                   success: true
 *                   data:
 *                     userExist: true
 *                     password: true
 *                   message: login with password
 *       400:
 *         description: Invalid phone number format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Invalid Iranian phone number format
 *       401:
 *         description: SMS service error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/auth/login-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login with password
 *     description: Authenticate user using phone number and password. Returns JWT token.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginPasswordRequest'
 *           example:
 *             phoneNumber: "09123456789"
 *             password: SecurePass123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *             example:
 *               success: true
 *               data:
 *                 token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJyb2xlIjoidXNlciJ9.xxx
 *                 user:
 *                   _id: 507f1f77bcf86cd799439011
 *                   phoneNumber: "09123456789"
 *                   fullName: John Doe
 *                   role: user
 *                   isActive: true
 *               message: login with password successfully
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: phone number or password incorrect
 */

/**
 * @openapi
 * /api/auth/login-otp:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login with OTP
 *     description: Authenticate user using phone number and OTP code. Creates new user if not exists.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginOtpRequest'
 *           example:
 *             phoneNumber: "09123456789"
 *             code: "123456"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *             example:
 *               success: true
 *               data:
 *                 token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxx
 *                 user:
 *                   _id: 507f1f77bcf86cd799439011
 *                   phoneNumber: "09123456789"
 *                   fullName: ""
 *                   role: user
 *                   isActive: true
 *               message: login with password successfully
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid or expired OTP code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Invalid or expired OTP code
 */

/**
 * @openapi
 * /api/auth/resend-code:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Resend OTP code
 *     description: Request a new OTP code to be sent via SMS.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResendCodeRequest'
 *           example:
 *             phoneNumber: "09123456789"
 *     responses:
 *       200:
 *         description: OTP code resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               success: true
 *               message: otp code sent successfully
 *       400:
 *         description: Invalid phone number
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: SMS service error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/auth/forget-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reset password
 *     description: Reset user password using OTP verification.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgetPasswordRequest'
 *           example:
 *             phoneNumber: "09123456789"
 *             code: "123456"
 *             newPassword: NewSecurePass123
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               success: true
 *               message: password updated successfully
 *       400:
 *         description: Invalid input or weak password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: invalid format password
 *       401:
 *         description: Invalid or expired OTP code
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
 *               message: invalid phone number
 */