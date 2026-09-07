import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Cart from "./cartMd.js";
import ProductVariant from "../ProductVariant/productVariantMd.js";

export const updateCart = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate({
    path: "item.productVariantId",
  });
  cart.items = cart.items.filter((item) => {
    if (item.cartQuantity > item.productVariantId.quantity) {
      item.cartQuantity = item.productVariantId.quantity;
      if (item.cartQuantity == 0) {
        return false;
      }
    }
    return item;
  });
  let totalPrice = 0;
  let finalPrice = 0;
  for (let item of cart.items) {
    totalPrice += item.productVariantId.price * item.cartQuantity;
    finalPrice += item.productVariantId.finalPrice * item.cartQuantity;
  }
  cart.finalPrice = finalPrice;
  cart.totalPrice = totalPrice;
  await cart.save();
};
export const getOne = catchAsync(async (req, res, next) => {
  await updateCart(req.userId);
  const feature = new ApiFeatures(Cart, req.query, req.role)
    .addManualFilters({ userId: req.userId })
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate([
      {
        path: "items",
        populate: [
          { path: "productId", select: "images title slug" },
          { path: "productVariantIds", populate: { path: "variantId" } },
          { path: "brandId", select: "image title" },
          { path: "categoryIds", select: "image title" },
        ],
      },
    ]);
  const result = await feature.execute();
  return res.status(200).json(result);
});
export const clearCart = catchAsync(async (req, res, next) => {
  const { userId } = req;
  const cart = await Cart.findOne({ userId });
  cart.items = [];
  cart.totalPrice = 0;
  cart.finalPrice = 0;
  const newCart = await cart.save();
  return res.status(200).json({
    success: true,
    data: newCart,
    message: "cart cleared successfully",
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const { userId } = req;
  const cart = await Cart.findOne({ userId }).populate({
    path: "items.productVariantId",
  });
  const { totalRemove = false, productVariantId = null } = req.body;
  if (!productVariantId) {
    return next(new HandleERROR("product variant is required", 400));
  }
  cart.items = cart.items.filter((item) => {
    if (item.productVariantId.toString() == productVariantId.toString()) {
      cart.totalPrice -= item.productVariantId.price;
      cart.finalPrice -= item.productVariantId.finalPrice;
      item.cartQuantity--;
      if (totalRemove || item.cartQuantity == 0) {
        return false;
      }
    }
    return item;
  });
  const newCart = await cart.save();
  return res.status(200).json({
    success: true,
    data: newCart,
    message: "remove item from cart successfully",
  });
});
export const addItem = catchAsync(async (req, res, next) => {
  const { userId } = req;
  const cart = await Cart.findOne({ userId }).populate({
    path: "items.productVariantId",
  });
  const { productVariantId = null } = req.body;
  if (!productVariantId) {
    return next(new HandleERROR("product variant is required", 400));
  }
  let isExist = false;
  let error = false;
  cart.items = cart.items.map((item) => {
    if (item.productVariantId._id.toString() == productVariantId.toString()) {
      isExist = true;
      cart.totalPrice += item.productVariantId.price;
      cart.finalPrice += item.productVariantId.finalPrice;
      item.cartQuantity++;
      if (item.cartQuantity > item.productVariantId.quantity) {
        error = true;
      }
    }
    return item;
  });
  const productVariant = await ProductVariant.findById(
    productVariantId,
  ).populate({ path: "productId" });
  if (error || productVariant.quantity == 0) {
    return next(
      new HandleERROR(
        `max quantity of this item is ${productVariant.quantity}`,
        400,
      ),
    );
  }
  if (!isExist) {
    cart.items.push({
      productVariantId,
      productId: productVariant.productId._id,
      brandId: productVariant.brandId._id,
      categoryIds: productVariant.categoryIds,
      cartQuantity: 1,
    });
    cart.finalPrice += productVariant.finalPrice;
    cart.totalPrice += productVariant.price;
  }

  const newCart = await cart.save();
  await newCart.populate([
    { path: "productId", select: "images title slug" },
    { path: "productVariantIds", populate: { path: "variantId" } },
    { path: "brandId", select: "image title" },
    { path: "categoryIds", select: "image title" },
  ]);
  return res.status(200).json({
    success: true,
    data: newCart,
    message: "add item to cart successfully",
  });
});
