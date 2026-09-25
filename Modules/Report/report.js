import { Router } from "express";
import isAdmin from "../../Middlewares/isAdmin.js";
import isLogin from "../../Middlewares/isLogin.js";
import {
  getAdminReport,
  getUserReport,
  userMostOrderCount,
  userMostOrderPrice,
  brandMostSellCount,
  categoryMostSellCount,
} from "./reportCn.js";
import {
  validateAdminReport,
  validateUserReport,
  validateUsersMostOrders,
  validateUsersMostPrice,
  validateBrandsMostSell,
  validateCategoriesMostSell,
} from "./reportValidator.js";

const reportRouter = Router();

// ==================== ADMIN ROUTES ====================

// Admin Dashboard
reportRouter
  .route("/admin")
  .get(isAdmin, validateAdminReport, getAdminReport);

// Users with most orders
reportRouter
  .route("/users-most-orders")
  .get(isAdmin, validateUsersMostOrders, userMostOrderCount);

// Users with most spending
reportRouter
  .route("/users-most-price")
  .get(isAdmin, validateUsersMostPrice, userMostOrderPrice);

// Best-selling brands
reportRouter
  .route("/brands-most-sell")
  .get(isAdmin, validateBrandsMostSell, brandMostSellCount);

// Best-selling categories
reportRouter
  .route("/categories-most-sell")
  .get(isAdmin, validateCategoriesMostSell, categoryMostSellCount);

// ==================== USER ROUTES ====================

// User Dashboard
reportRouter
  .route("/user")
  .get(isLogin, validateUserReport, getUserReport);

export default reportRouter;