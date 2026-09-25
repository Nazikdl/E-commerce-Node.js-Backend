import { body, param, query, validationResult } from "express-validator";
import Order from "./orderMd.js";
import Address from "../Address/addressMd.js";
import Discount from "../DiscountCode/discountMd.js";
import Cart from "../Cart/cartMd.js";
import { handleValidationErrors } from "../../Utils/handleValidationErrors.js";


// ---- Custom validators ----
const doesOrderExist = async (id) => {
  const order = await Order.findById(id);
  if (!order) throw new Error("Order not found");
  return order;
};

const doesAddressExistAndBelongToUser = async (addressId, userId) => {
  const address = await Address.findOne({ _id: addressId, userId });
  if (!address) throw new Error("Address not found or does not belong to you");
  return true;
};

const doesDiscountCodeExist = async (code) => {
  const discount = await Discount.findOne({ code: code.trim().toUpperCase() });
  if (!discount) throw new Error("Invalid discount code");
  return true;
};

const doesOrderExistByAuthority = async (authority) => {
  const order = await Order.findOne({ authority });
  if (!order) throw new Error("Order with this authority not found");
  return true;
};

const isCartNotEmpty = async (userId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0) {
    throw new Error("Your cart is empty");
  }
  return true;
};

// ---- GET all (validateGetAll) ----
export const validateGetAll = [
  query("q")
    .optional()
    .isString()
    .withMessage("Search term must be a string")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Search term must be at least 1 character if provided"),

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

  query("sort")
    .optional()
    .isString()
    .withMessage("Sort parameter must be a string")
    .custom((value) => {
      const fields = value.split(",");
      const allowed = [
        "totalPrice", "finalPrice", "finalPriceAfterDiscount",
        "freeShipping", "status", "createdAt", "updatedAt",
        "orderCode", "cashBackPrice"
      ];
      for (const field of fields) {
        const clean = field.replace(/^-/, "");
        if (!allowed.includes(clean)) {
          throw new Error(`Invalid sort field: ${clean}. Allowed: ${allowed.join(", ")}`);
        }
      }
      return true;
    }),

  query("fields")
    .optional()
    .isString()
    .withMessage("Fields parameter must be a string")
    .custom((value) => {
      const fields = value.split(",");
      const allowed = [
        "orderCode", "userId", "items", "totalPrice", "finalPrice",
        "finalPriceAfterDiscount", "freeShipping", "discountCodeId",
        "address", "status", "stockIssueItems", "authority", "refId",
        "cashBackPrice", "createdAt", "updatedAt"
      ];
      for (const field of fields) {
        const clean = field.replace(/^-/, "");
        if (!allowed.includes(clean)) {
          throw new Error(`Invalid field: ${clean}. Allowed: ${allowed.join(", ")}`);
        }
      }
      return true;
    }),

  query("populate")
    .optional()
    .isString()
    .withMessage("Populate parameter must be a string")
    .custom((value) => {
      const paths = value.split(",");
      const allowed = ["userId", "items.productId", "discountCodeId"];
      for (const path of paths) {
        // Allow nested paths like "items.productId"
        const base = path.split(".")[0];
        if (!allowed.includes(base) && !allowed.includes(path)) {
          throw new Error(`Invalid populate path: ${path}. Allowed: ${allowed.join(", ")}`);
        }
      }
      return true;
    }),

  handleValidationErrors,
];

// ---- GET one (validateGetOne) ----
export const validateGetOne = [
  param("id")
    .notEmpty()
    .withMessage("Order ID is required")
    .isMongoId()
    .withMessage("Invalid order ID format")
    .custom(doesOrderExist),
  handleValidationErrors,
];

// ---- UPDATE (validateUpdate) ----
// Only allow status update; block all other fields.
export const validateUpdate = [
  param("id")
    .notEmpty()
    .withMessage("Order ID is required")
    .isMongoId()
    .withMessage("Invalid order ID format")
    .custom(doesOrderExist),

  body("status")
    .optional()
    .isIn(["pending", "success", "failed", "stockIssue"])
    .withMessage("Status must be one of: pending, success, failed, stockIssue"),

  // Block all other fields
  body("userId")
    .custom((value) => {
      if (value !== undefined) throw new Error("userId cannot be changed");
      return true;
    }),
  body("orderCode")
    .custom((value) => {
      if (value !== undefined) throw new Error("orderCode is auto-generated");
      return true;
    }),
  body("totalPrice")
    .custom((value) => {
      if (value !== undefined) throw new Error("totalPrice is auto-calculated");
      return true;
    }),
  body("finalPrice")
    .custom((value) => {
      if (value !== undefined) throw new Error("finalPrice is auto-calculated");
      return true;
    }),
  body("finalPriceAfterDiscount")
    .custom((value) => {
      if (value !== undefined) throw new Error("finalPriceAfterDiscount is auto-calculated");
      return true;
    }),
  body("freeShipping")
    .custom((value) => {
      if (value !== undefined) throw new Error("freeShipping is auto-calculated");
      return true;
    }),
  body("discountCodeId")
    .custom((value) => {
      if (value !== undefined) throw new Error("discountCodeId cannot be changed after creation");
      return true;
    }),
  body("address")
    .custom((value) => {
      if (value !== undefined) throw new Error("address cannot be changed");
      return true;
    }),
  body("items")
    .custom((value) => {
      if (value !== undefined) throw new Error("items cannot be changed directly");
      return true;
    }),
  body("stockIssueItems")
    .custom((value) => {
      if (value !== undefined) throw new Error("stockIssueItems is auto-managed");
      return true;
    }),
  body("authority")
    .custom((value) => {
      if (value !== undefined) throw new Error("authority cannot be changed");
      return true;
    }),
  body("refId")
    .custom((value) => {
      if (value !== undefined) throw new Error("refId cannot be changed directly");
      return true;
    }),
  body("cashBackPrice")
    .custom((value) => {
      if (value !== undefined) throw new Error("cashBackPrice is auto-calculated");
      return true;
    }),

  handleValidationErrors,
];

// ---- REQUEST PAYMENT (validateRequestPayment) ----
export const validateRequestPayment = [
  body("addressId")
    .notEmpty()
    .withMessage("Address ID is required")
    .isMongoId()
    .withMessage("Invalid address ID format")
    .custom(async (addressId, { req }) => {
      const userId = req.userId;
      await doesAddressExistAndBelongToUser(addressId, userId);
      // Also check cart is not empty (but controller will do it; we can pre-check)
      await isCartNotEmpty(userId);
      return true;
    }),

  body("code")
    .optional()
    .isString()
    .withMessage("Discount code must be a string")
    .trim()
    .toUpperCase()
    .custom(async (code) => {
      if (code) {
        await doesDiscountCodeExist(code);
      }
      return true;
    }),

  // Block auto fields
  body("userId")
    .custom((value) => {
      if (value !== undefined) throw new Error("userId is auto-set");
      return true;
    }),
  body("items")
    .custom((value) => {
      if (value !== undefined) throw new Error("items are taken from cart");
      return true;
    }),
  body("totalPrice")
    .custom((value) => {
      if (value !== undefined) throw new Error("totalPrice is auto-calculated");
      return true;
    }),
  body("finalPrice")
    .custom((value) => {
      if (value !== undefined) throw new Error("finalPrice is auto-calculated");
      return true;
    }),
  body("finalPriceAfterDiscount")
    .custom((value) => {
      if (value !== undefined) throw new Error("finalPriceAfterDiscount is auto-calculated");
      return true;
    }),
  body("freeShipping")
    .custom((value) => {
      if (value !== undefined) throw new Error("freeShipping is auto-calculated");
      return true;
    }),
  body("orderCode")
    .custom((value) => {
      if (value !== undefined) throw new Error("orderCode is auto-generated");
      return true;
    }),
  body("status")
    .custom((value) => {
      if (value !== undefined) throw new Error("status is auto-set");
      return true;
    }),
  body("authority")
    .custom((value) => {
      if (value !== undefined) throw new Error("authority is auto-set");
      return true;
    }),

  handleValidationErrors,
];

// ---- VERIFY PAYMENT (validateVerify) ----
export const validateVerify = [
  body("authority")
    .notEmpty()
    .withMessage("Authority is required")
    .isString()
    .withMessage("Authority must be a string")
    .trim()
    .custom(doesOrderExistByAuthority),

  handleValidationErrors,
];