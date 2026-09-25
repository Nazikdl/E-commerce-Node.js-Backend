import { catchAsync, HandleERROR } from "vanta-api";
import Order from "../Order/orderMd.js";
import User from "../User/userMd.js";
import Product from "../Product/ProductMd.js";
import ProductVariant from "../ProductVariant/productVariantMd.js";
import Comment from "../Comment/commentMd.js";
import Discount from "../DiscountCode/discountMd.js";
import mongoose from "mongoose";

// ==================== HELPER FUNCTIONS ====================

/**
 * Get date range for reports
 * range: today | 7d | 30d | 3m | 1y
 */
const getDateRange = (range = "30d") => {
  const now = new Date();
  const from = new Date(now);

  switch (range) {
    case "today":
      from.setHours(0, 0, 0, 0);
      break;
    case "7d":
      from.setDate(from.getDate() - 7);
      break;
    case "30d":
      from.setDate(from.getDate() - 30);
      break;
    case "3m":
      from.setMonth(from.getMonth() - 3);
      break;
    case "1y":
      from.setFullYear(from.getFullYear() - 1);
      break;
    default:
      from.setDate(from.getDate() - 30);
  }

  return { from, to: now };
};

/**
 * Parse and validate pagination + time range
 */
const parseQueryOptions = (req) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
  const skip = (page - 1) * limit;
  const startTime = req.query.startTime
    ? new Date(req.query.startTime)
    : new Date(new Date().setFullYear(new Date().getFullYear() - 1));
  const endTime = req.query.endTime ? new Date(req.query.endTime) : new Date();

  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    throw new HandleERROR("Invalid date format for startTime or endTime", 400);
  }

  if (startTime > endTime) {
    throw new HandleERROR("startTime must be before endTime", 400);
  }

  return { page, limit, skip, startTime, endTime };
};

// ==================== ADMIN DASHBOARD ====================

/**
 * Admin Dashboard
 * GET /api/reports/admin?range=30d
 */
export const getAdminReport = catchAsync(async (req, res, next) => {
  const range = req.query.range || "30d";
  const { from, to } = getDateRange(range);

  const successOrderMatch = {
    status: "success",
    createdAt: { $gte: from, $lte: to },
  };

  const [
    overview,
    orderStats,
    productStats,
    userStats,
    sales,
    topProducts,
    lowStockProducts,
    recentOrders,
    discountStats,
    reviewStats,
  ] = await Promise.all([
    // ---------- OVERVIEW ----------
    Order.aggregate([
      { $match: successOrderMatch },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$finalPriceAfterDiscount" },
          totalOrders: { $sum: 1 },
        },
      },
    ]),

    // ---------- ORDER STATISTICS ----------
    Order.aggregate([
      { $match: { createdAt: { $gte: from, $lte: to } } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),

    // ---------- PRODUCT STATISTICS ----------
    Product.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          published: [
            { $match: { isPublished: true } },
            { $count: "count" },
          ],
          unpublished: [
            { $match: { isPublished: false } },
            { $count: "count" },
          ],
          inStock: [
            { $match: { InStock: true } },
            { $count: "count" },
          ],
          outOfStock: [
            { $match: { InStock: false } },
            { $count: "count" },
          ],
        },
      },
    ]),

    // ---------- USER STATISTICS ----------
    User.aggregate([
      {
        $facet: {
          total: [
            { $match: { role: "user" } },
            { $count: "count" },
          ],
          active: [
            { $match: { role: "user", isActive: true } },
            { $count: "count" },
          ],
          inactive: [
            { $match: { role: "user", isActive: false } },
            { $count: "count" },
          ],
          newUsers: [
            {
              $match: {
                role: "user",
                createdAt: { $gte: from, $lte: to },
              },
            },
            { $count: "count" },
          ],
        },
      },
    ]),

    // ---------- SALES CHART ----------
    Order.aggregate([
      { $match: successOrderMatch },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          revenue: { $sum: "$finalPriceAfterDiscount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          revenue: 1,
          orders: 1,
        },
      },
    ]),

    // ---------- TOP SELLING PRODUCTS ----------
    Order.aggregate([
      { $match: { status: "success" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          soldQuantity: { $sum: "$items.cartQuantity" },
          revenue: {
            $sum: {
              $multiply: [
                "$items.cartQuantity",
                "$items.productVariantId.finalPrice",
              ],
            },
          },
        },
      },
      { $sort: { soldQuantity: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: {
          path: "$product",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          title: "$product.title",
          image: { $arrayElemAt: ["$product.images", 0] },
          soldQuantity: 1,
          revenue: 1,
          avgRating: "$product.avgRating",
        },
      },
    ]),

    // ---------- LOW STOCK PRODUCTS ----------
    ProductVariant.aggregate([
      { $match: { quantity: { $lte: 5 } } },
      { $sort: { quantity: 1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: {
          path: "$product",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          variantId: "$_id",
          productId: "$productId",
          productTitle: "$product.title",
          quantity: 1,
          price: 1,
          finalPrice: 1,
        },
      },
    ]),

    // ---------- RECENT ORDERS ----------
    Order.find({ createdAt: { $gte: from, $lte: to } })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("userId", "fullName phoneNumber")
      .lean(),

    // ---------- DISCOUNT STATISTICS ----------
    Discount.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          published: [
            { $match: { isPublished: true } },
            { $count: "count" },
          ],
          expired: [
            { $match: { expireTime: { $lt: new Date() } } },
            { $count: "count" },
          ],
          active: [
            {
              $match: {
                isPublished: true,
                startTime: { $lte: new Date() },
                expireTime: { $gte: new Date() },
              },
            },
            { $count: "count" },
          ],
        },
      },
    ]),

    // ---------- REVIEW STATISTICS ----------
    Comment.aggregate([
      { $match: { isReply: false } },
      {
        $facet: {
          total: [{ $count: "count" }],
          published: [
            { $match: { isPublished: true } },
            { $count: "count" },
          ],
          pending: [
            { $match: { isPublished: false } },
            { $count: "count" },
          ],
          averageRating: [
            { $match: { rate: { $exists: true, $ne: null } } },
            {
              $group: {
                _id: null,
                value: { $avg: "$rate" },
              },
            },
          ],
        },
      },
    ]),
  ]);

  // ---------- FORMAT RESULTS ----------
  const overviewData = overview[0] || { totalRevenue: 0, totalOrders: 0 };

  const formattedOrderStats = {
    pending: 0,
    success: 0,
    failed: 0,
    stockIssue: 0,
  };
  orderStats.forEach((item) => {
    if (item._id in formattedOrderStats) {
      formattedOrderStats[item._id] = item.count;
    }
  });

  const getFacetCount = (facet) => facet?.[0]?.count || 0;

  const productData = productStats[0] || {};
  const formattedProductStats = {
    total: getFacetCount(productData.total),
    published: getFacetCount(productData.published),
    unpublished: getFacetCount(productData.unpublished),
    inStock: getFacetCount(productData.inStock),
    outOfStock: getFacetCount(productData.outOfStock),
  };

  const userData = userStats[0] || {};
  const formattedUserStats = {
    total: getFacetCount(userData.total),
    active: getFacetCount(userData.active),
    inactive: getFacetCount(userData.inactive),
    newUsers: getFacetCount(userData.newUsers),
  };

  const discountData = discountStats[0] || {};
  const formattedDiscountStats = {
    total: getFacetCount(discountData.total),
    published: getFacetCount(discountData.published),
    active: getFacetCount(discountData.active),
    expired: getFacetCount(discountData.expired),
  };

  const reviewData = reviewStats[0] || {};
  const formattedReviewStats = {
    total: getFacetCount(reviewData.total),
    published: getFacetCount(reviewData.published),
    pending: getFacetCount(reviewData.pending),
    averageRating:
      Math.round((reviewData.averageRating?.[0]?.value || 0) * 100) / 100,
  };

  return res.status(200).json({
    success: true,
    data: {
      range: { from, to },
      overview: {
        totalRevenue: overviewData.totalRevenue || 0,
        totalOrders: overviewData.totalOrders || 0,
        totalUsers: formattedUserStats.total,
        totalProducts: formattedProductStats.total,
        lowStockCount: lowStockProducts.length,
        averageRating: formattedReviewStats.averageRating,
      },
      sales,
      orders: formattedOrderStats,
      products: formattedProductStats,
      users: formattedUserStats,
      topProducts,
      lowStockProducts,
      recentOrders,
      discounts: formattedDiscountStats,
      reviews: formattedReviewStats,
    },
  });
});

// ==================== USER DASHBOARD ====================

/**
 * User Dashboard
 * GET /api/reports/user
 */
export const getUserReport = catchAsync(async (req, res, next) => {
  const userId = req.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new HandleERROR("Invalid user id", 400));
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);

  const [
    user,
    orderStats,
    spending,
    recentOrders,
    favoriteProducts,
    recentlyPurchased,
    productsToReview,
    availableDiscounts,
  ] = await Promise.all([
    // ---------- USER ----------
    User.findById(userObjectId)
      .select(
        "fullName phoneNumber favoriteProductIds boughtProductIds ratedProductIds",
      )
      .lean(),

    // ---------- ORDER STATISTICS ----------
    Order.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),

    // ---------- TOTAL SPENDING ----------
    Order.aggregate([
      { $match: { userId: userObjectId, status: "success" } },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$finalPriceAfterDiscount" },
          totalOrders: { $sum: 1 },
        },
      },
    ]),

    // ---------- RECENT ORDERS ----------
    Order.find({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),

    // ---------- FAVORITE PRODUCTS ----------
    Product.find({ _id: { $in: user?.favoriteProductIds || [] } })
      .select(
        "title images minPrice maxPrice avgRating ratingCount isPublished InStock",
      )
      .limit(10)
      .lean(),

    // ---------- RECENTLY PURCHASED ----------
    Product.find({ _id: { $in: user?.boughtProductIds || [] } })
      .select(
        "title images minPrice maxPrice avgRating ratingCount isPublished InStock",
      )
      .limit(10)
      .lean(),

    // ---------- PRODUCTS TO REVIEW ----------
    Product.find({
      _id: {
        $in: [...(user?.boughtProductIds || [])].filter(
          (id) =>
            !(user?.ratedProductIds || []).some(
              (ratedId) => ratedId.toString() === id.toString(),
            ),
        ),
      },
    })
      .select("title images minPrice maxPrice avgRating ratingCount isPublished")
      .limit(10)
      .lean(),

    // ---------- AVAILABLE DISCOUNTS ----------
    Discount.find({
      isPublished: true,
      startTime: { $lte: new Date() },
      expireTime: { $gte: new Date() },
      $expr: { $lt: ["$usedCount", "$usageLimit"] },
    })
      .select(
        "code type value startTime expireTime minPrice maxPrice freeShipping",
      )
      .limit(10)
      .lean(),
  ]);

  if (!user) {
    return next(new HandleERROR("User not found", 404));
  }

  // ---------- FORMAT ORDER STATS ----------
  const formattedOrderStats = {
    pending: 0,
    success: 0,
    failed: 0,
    stockIssue: 0,
    total: 0,
  };
  orderStats.forEach((item) => {
    if (item._id in formattedOrderStats) {
      formattedOrderStats[item._id] = item.count;
    }
    formattedOrderStats.total += item.count;
  });

  const spendingData = spending[0] || { totalSpent: 0, totalOrders: 0 };

  return res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
      },
      overview: {
        totalOrders: formattedOrderStats.total,
        successfulOrders: formattedOrderStats.success,
        totalSpent: spendingData.totalSpent || 0,
        favoritesCount: user.favoriteProductIds?.length || 0,
        reviewsCount: user.ratedProductIds?.length || 0,
      },
      orders: formattedOrderStats,
      recentOrders,
      favoriteProducts,
      recentlyPurchased,
      productsToReview,
      availableDiscounts,
    },
  });
});

// ==================== USER MOST ORDER COUNT ====================

/**
 * Users with most orders
 * GET /api/reports/users-most-orders
 */
export const userMostOrderCount = catchAsync(async (req, res, next) => {
  const { page, limit, skip, startTime, endTime } = parseQueryOptions(req);

  const result = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startTime, $lte: endTime },
        status: "success",
      },
    },
    {
      $group: {
        _id: "$userId",
        totalOrderCount: { $sum: 1 },
      },
    },
    { $sort: { totalOrderCount: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userData",
      },
    },
    { $unwind: "$userData" },
    {
      $project: {
        _id: 1,
        totalOrderCount: 1,
        "userData._id": 1,
        "userData.fullName": 1,
        "userData.phoneNumber": 1,
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    page,
    limit,
    count: result.length,
    data: result,
  });
});

// ==================== USER MOST ORDER PRICE ====================

/**
 * Users with most spending
 * GET /api/reports/users-most-price
 */
export const userMostOrderPrice = catchAsync(async (req, res, next) => {
  const { page, limit, skip, startTime, endTime } = parseQueryOptions(req);

  const result = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startTime, $lte: endTime },
        status: "success",
      },
    },
    {
      $group: {
        _id: "$userId",
        totalOrderPrice: { $sum: "$finalPriceAfterDiscount" },
      },
    },
    { $sort: { totalOrderPrice: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userData",
      },
    },
    { $unwind: "$userData" },
    {
      $project: {
        _id: 1,
        totalOrderPrice: 1,
        "userData._id": 1,
        "userData.fullName": 1,
        "userData.phoneNumber": 1,
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    page,
    limit,
    count: result.length,
    data: result,
  });
});

// ==================== BRAND MOST SELL COUNT ====================

/**
 * Best-selling brands
 * GET /api/reports/brands-most-sell
 */
export const brandMostSellCount = catchAsync(async (req, res, next) => {
  const { page, limit, skip, startTime, endTime } = parseQueryOptions(req);

  const result = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startTime, $lte: endTime },
        status: "success",
      },
    },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.brandId",
        totalOrderCount: { $sum: "$items.cartQuantity" },
      },
    },
    { $sort: { totalOrderCount: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "brands",
        localField: "_id",
        foreignField: "_id",
        as: "brandData",
      },
    },
    { $unwind: "$brandData" },
    {
      $project: {
        _id: 1,
        totalOrderCount: 1,
        "brandData._id": 1,
        "brandData.title": 1,
        "brandData.image": 1,
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    page,
    limit,
    count: result.length,
    data: result,
  });
});

// ==================== CATEGORY MOST SELL COUNT ====================

/**
 * Best-selling categories
 * GET /api/reports/categories-most-sell
 */
export const categoryMostSellCount = catchAsync(async (req, res, next) => {
  const { page, limit, skip, startTime, endTime } = parseQueryOptions(req);

  const result = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startTime, $lte: endTime },
        status: "success",
      },
    },
    { $unwind: "$items" },
    { $unwind: "$items.categoryIds" },
    {
      $group: {
        _id: "$items.categoryIds",
        totalOrderCount: { $sum: "$items.cartQuantity" },
      },
    },
    { $sort: { totalOrderCount: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "categoryData",
      },
    },
    { $unwind: "$categoryData" },
    {
      $project: {
        _id: 1,
        totalOrderCount: 1,
        "categoryData._id": 1,
        "categoryData.title": 1,
        "categoryData.image": 1,
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    page,
    limit,
    count: result.length,
    data: result,
  });
});