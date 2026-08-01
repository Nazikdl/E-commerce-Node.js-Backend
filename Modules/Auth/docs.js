/**
 * Authentication API Documentation
 * Base URL: /api/auth
 */

// ==================== ENDPOINT DOCUMENTATION ====================

/**
 * @route POST /api/auth/
 * @description Initialize authentication - Check if user exists and send OTP if no password set
 * @access Public
 * @body {string} phoneNumber - Iranian mobile number (ex: 09123456789)
 * @response 200 - Success
 * @response 400 - Invalid phone number format
 * @response 401 - SMS service error
 */
export const authDocs = {
  endpoint: "/",
  method: "POST",
  summary: "Initialize Authentication",
  description:
    "Checks if user exists. If user has no password, sends OTP via SMS. If user has password, prompts for password login.",
  body: {
    phoneNumber: {
      type: "string",
      required: true,
      pattern: "^(\\+98|0)?9\\d{9}$",
      example: "09123456789",
      description: "Iranian mobile number",
    },
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        data: {
          userExist: false, // boolean - true if user exists
          password: false, // boolean - true if user has password
        },
        message: "otp code sent", // or 'login with password'
      },
    },
    error: {
      status: 400,
      body: {
        success: false,
        message: "Invalid phone number format",
      },
    },
  },
  example: {
    request: {
      phoneNumber: "09123456789",
    },
    response: {
      success: true,
      data: {
        userExist: false,
        password: false,
      },
      message: "otp code sent",
    },
  },
};

/**
 * @route POST /api/auth/login-password
 * @description Login with phone number and password
 * @access Public
 * @body {string} phoneNumber - Iranian mobile number
 * @body {string} password - User password (min 8 chars, uppercase, lowercase, number)
 * @response 200 - Login successful
 * @response 400 - Invalid input
 * @response 401 - Invalid credentials
 */
export const loginPasswordDocs = {
  endpoint: "/login-password",
  method: "POST",
  summary: "Login with Password",
  description:
    "Authenticate user using phone number and password. Returns JWT token on success.",
  body: {
    phoneNumber: {
      type: "string",
      required: true,
      pattern: "^(\\+98|0)?9\\d{9}$",
      example: "09123456789",
    },
    password: {
      type: "string",
      required: true,
      minLength: 8,
      pattern: "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])",
      example: "SecurePass123",
      description: "Must contain uppercase, lowercase, and number",
    },
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        data: {
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          user: {
            _id: "507f1f77bcf86cd799439011",
            phoneNumber: "09123456789",
            fullName: "John Doe",
            role: "user",
            isActive: true,
          },
        },
        message: "login with password successfully",
      },
    },
    error: {
      status: 401,
      body: {
        success: false,
        message: "phone number or password incorrect",
      },
    },
  },
  example: {
    request: {
      phoneNumber: "09123456789",
      password: "SecurePass123",
    },
    response: {
      success: true,
      data: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        user: {
          _id: "507f1f77bcf86cd799439011",
          phoneNumber: "09123456789",
          fullName: "John Doe",
          role: "user",
          isActive: true,
        },
      },
      message: "login with password successfully",
    },
  },
};

/**
 * @route POST /api/auth/login-otp
 * @description Login with phone number and OTP code
 * @access Public
 * @body {string} phoneNumber - Iranian mobile number
 * @body {string} code - OTP code (4-6 digits)
 * @response 200 - Login successful
 * @response 400 - Invalid input
 * @response 401 - Invalid or expired OTP
 */
export const loginOtpDocs = {
  endpoint: "/login-otp",
  method: "POST",
  summary: "Login with OTP",
  description:
    "Authenticate user using phone number and OTP code. Creates new user if not exists.",
  body: {
    phoneNumber: {
      type: "string",
      required: true,
      pattern: "^(\\+98|0)?9\\d{9}$",
      example: "09123456789",
    },
    code: {
      type: "string",
      required: true,
      minLength: 4,
      maxLength: 6,
      pattern: "^\\d+$",
      example: "123456",
      description: "Numeric OTP code received via SMS",
    },
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        data: {
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          user: {
            _id: "507f1f77bcf86cd799439011",
            phoneNumber: "09123456789",
            fullName: "",
            role: "user",
            isActive: true,
          },
        },
        message: "login with password successfully",
      },
    },
    error: {
      status: 401,
      body: {
        success: false,
        message: "Invalid or expired OTP code",
      },
    },
  },
  example: {
    request: {
      phoneNumber: "09123456789",
      code: "123456",
    },
    response: {
      success: true,
      data: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        user: {
          _id: "507f1f77bcf86cd799439011",
          phoneNumber: "09123456789",
          fullName: "",
          role: "user",
          isActive: true,
        },
      },
      message: "login with password successfully",
    },
  },
};

/**
 * @route POST /api/auth/resend-code
 * @description Resend OTP code via SMS
 * @access Public
 * @body {string} phoneNumber - Iranian mobile number
 * @response 200 - OTP resent successfully
 * @response 400 - Invalid phone number
 * @response 401 - SMS service error
 */
export const resendCodeDocs = {
  endpoint: "/resend-code",
  method: "POST",
  summary: "Resend OTP Code",
  description: "Request a new OTP code to be sent to the user's phone number.",
  body: {
    phoneNumber: {
      type: "string",
      required: true,
      pattern: "^(\\+98|0)?9\\d{9}$",
      example: "09123456789",
    },
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        message: "otp code sent successfully",
      },
    },
    error: {
      status: 401,
      body: {
        success: false,
        message: "SMS service error",
      },
    },
  },
  example: {
    request: {
      phoneNumber: "09123456789",
    },
    response: {
      success: true,
      message: "otp code sent successfully",
    },
  },
};

/**
 * @route POST /api/auth/forget-password
 * @description Reset password using OTP verification
 * @access Public
 * @body {string} phoneNumber - Iranian mobile number
 * @body {string} code - OTP code (4-6 digits)
 * @body {string} newPassword - New password (min 8 chars, uppercase, lowercase, number)
 * @response 200 - Password updated
 * @response 400 - Invalid input or weak password
 * @response 401 - Invalid or expired OTP
 * @response 404 - User not found
 */
export const forgetPasswordDocs = {
  endpoint: "/forget-password",
  method: "POST",
  summary: "Reset Password",
  description:
    "Reset user password after OTP verification. OTP must be valid and not expired.",
  body: {
    phoneNumber: {
      type: "string",
      required: true,
      pattern: "^(\\+98|0)?9\\d{9}$",
      example: "09123456789",
    },
    code: {
      type: "string",
      required: true,
      minLength: 4,
      maxLength: 6,
      pattern: "^\\d+$",
      example: "123456",
    },
    newPassword: {
      type: "string",
      required: true,
      minLength: 8,
      pattern: "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])",
      example: "NewSecurePass123",
      description: "Must contain uppercase, lowercase, and number",
    },
  },
  responses: {
    success: {
      status: 200,
      body: {
        success: true,
        message: "password updated successfully",
      },
    },
    error: {
      status: 400,
      body: {
        success: false,
        message: "invalid format password",
      },
    },
    notFound: {
      status: 404,
      body: {
        success: false,
        message: "invalid phone number",
      },
    },
  },
  example: {
    request: {
      phoneNumber: "09123456789",
      code: "123456",
      newPassword: "NewSecurePass123",
    },
    response: {
      success: true,
      message: "password updated successfully",
    },
  },
};

// ==================== QUICK REFERENCE ====================

export const authEndpoints = {
  initialize: {
    method: "POST",
    path: "/api/auth/",
    description: "Initialize authentication - sends OTP or prompts password",
    body: { phoneNumber: "09123456789" },
  },
  loginPassword: {
    method: "POST",
    path: "/api/auth/login-password",
    description: "Login with phone number and password",
    body: { phoneNumber: "09123456789", password: "SecurePass123" },
  },
  loginOtp: {
    method: "POST",
    path: "/api/auth/login-otp",
    description: "Login with phone number and OTP code",
    body: { phoneNumber: "09123456789", code: "123456" },
  },
  resendCode: {
    method: "POST",
    path: "/api/auth/resend-code",
    description: "Resend OTP code to phone number",
    body: { phoneNumber: "09123456789" },
  },
  forgetPassword: {
    method: "POST",
    path: "/api/auth/forget-password",
    description: "Reset password using OTP verification",
    body: {
      phoneNumber: "09123456789",
      code: "123456",
      newPassword: "NewPass123",
    },
  },
};

// ==================== VALIDATION SUMMARY ====================

export const validationRules = {
  phoneNumber: {
    pattern: "^(\\+98|0)?9\\d{9}$",
    description: "Iranian mobile number format",
    examples: ["09123456789", "09381234567", "+989381234567"],
  },
  password: {
    minLength: 8,
    pattern: "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])",
    description:
      "At least 8 characters, one uppercase, one lowercase, one number",
    example: "SecurePass123",
  },
  otpCode: {
    minLength: 4,
    maxLength: 6,
    pattern: "^\\d+$",
    description: "Numeric code received via SMS",
    example: "123456",
  },
};

// ==================== ERROR CODES ====================

export const authErrorCodes = {
  400: {
    code: "BAD_REQUEST",
    description: "Invalid input format or validation failed",
    examples: [
      "Invalid phone number format",
      "Password must be at least 8 characters",
      "OTP code must contain only numbers",
    ],
  },
  401: {
    code: "UNAUTHORIZED",
    description: "Authentication failed",
    examples: [
      "Invalid or expired OTP code",
      "Phone number or password incorrect",
      "SMS service error",
    ],
  },
  404: {
    code: "NOT_FOUND",
    description: "Resource not found",
    examples: ["User not found", "Invalid phone number"],
  },
  500: {
    code: "INTERNAL_SERVER_ERROR",
    description: "Server error",
    examples: ["Database connection error", "SMS service unavailable"],
  },
};

// ==================== RESPONSE TEMPLATES ====================

export const responseTemplates = {
  success: {
    success: true,
    data: null,
    message: "Operation successful",
  },
  error: {
    success: false,
    message: "Error message",
    error: "Detailed error (development only)",
  },
  authSuccess: {
    success: true,
    data: {
      token: "jwt_token_string",
      user: {
        _id: "user_id",
        phoneNumber: "09123456789",
        fullName: "User Name",
        role: "user",
        isActive: true,
      },
    },
    message: "Authentication successful",
  },
};

// ==================== DEFAULT EXPORT ====================

export default {
  authDocs,
  loginPasswordDocs,
  loginOtpDocs,
  resendCodeDocs,
  forgetPasswordDocs,
  authEndpoints,
  validationRules,
  authErrorCodes,
  responseTemplates,
};
