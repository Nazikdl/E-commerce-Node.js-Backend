import { query } from "express-validator";
import { handleValidationErrors } from "../../Utils/handleValidationErrors.js";

// ==================== QUERY VALIDATORS ====================

/**
 * Admin dashboard query validator
 * GET /api/reports/admin?range=30d
 */
export const validateAdminReportQuery = () => {
  return [
    query("range")
      .optional()
      .isIn(["today", "7d", "30d", "3m", "1y"])
      .withMessage("Range must be one of: today, 7d, 30d, 3m, 1y"),
  ];
};

/**
 * Aggregation query validator (pagination + date range)
 * Used for: users-most-orders, users-most-price, brands-most-sell, categories-most-sell
 */
export const validateAggregationQuery = () => {
  return [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer")
      .toInt(),

    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100")
      .toInt(),

    query("startTime")
      .optional()
      .isISO8601()
      .withMessage("startTime must be a valid ISO 8601 date")
      .toDate(),

    query("endTime")
      .optional()
      .isISO8601()
      .withMessage("endTime must be a valid ISO 8601 date")
      .toDate()
      .custom((value, { req }) => {
        if (req.query.startTime) {
          const start = new Date(req.query.startTime);
          if (value < start) {
            throw new Error("endTime must be after startTime");
          }
        }
        return true;
      }),
  ];
};

/**
 * User dashboard query validator (no query params needed)
 * GET /api/reports/user
 */
export const validateUserReportQuery = () => {
  return [];
};

// ==================== COMPOSED VALIDATORS ====================

// Admin dashboard
export const validateAdminReport = [
  validateAdminReportQuery(),
  handleValidationErrors,
];

// User dashboard
export const validateUserReport = [
  validateUserReportQuery(),
  handleValidationErrors,
];

// Users with most orders
export const validateUsersMostOrders = [
  validateAggregationQuery(),
  handleValidationErrors,
];

// Users with most spending
export const validateUsersMostPrice = [
  validateAggregationQuery(),
  handleValidationErrors,
];

// Best-selling brands
export const validateBrandsMostSell = [
  validateAggregationQuery(),
  handleValidationErrors,
];

// Best-selling categories
export const validateCategoriesMostSell = [
  validateAggregationQuery(),
  handleValidationErrors,
];

// ==================== EXPORT ALL ====================

export default {
  validateAdminReportQuery,
  validateAggregationQuery,
  validateUserReportQuery,
  validateAdminReport,
  validateUserReport,
  validateUsersMostOrders,
  validateUsersMostPrice,
  validateBrandsMostSell,
  validateCategoriesMostSell,
};