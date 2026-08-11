import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Product from "./ProductMd.js";
import User from "../User/userMd.js";
import Comment from "../Comment/commentMd.js";
import ProductVariant from "../ProductVariant/productVariantMd.js";
import fs from "fs";
import { __dirname } from "./../../app.js";

export const getAll = catchAsync(async (req, res, next) => {
  const condition =
    req.role != "superAdmin" && req.role != "admin"
      ? { isPublished: true }
      : {};

  const features = new ApiFeatures(Product, req.query, req.role)
    .addManualFilters(condition)
    .filter()
    .sort()
    .search(["title"])
    .limitFields()
    .paginate()
    .populate([
      { path: "defaultProductVariantId", populate: [{ path: "variantId" }] },
      { path: "categoryIds", select: "title" },
      { path: "brandId", select: "title" },
      { path: "variantIds" },
    ]);
  const result = await features.execute();
  return res.status(200).json(result);
});

export const getOne = catchAsync(async (req, res, next) => {
  const condition =
    req.role != "superAdmin" && req.role != "admin"
      ? { isPublished: true, _id: req.params.id }
      : { _id: req.params.id };

  const features = new ApiFeatures(Product, req.query, req.role)
    .addManualFilters(condition)
    .filter()
    .sort()
    .search()
    .limitFields()
    .paginate()
    .populate([
      { path: "productVariantId", populate: [{ path: "variantId" }] },
      { path: "categoryIds", select: "title" },
      { path: "brandId", select: "title" },
      { path: "variantIds" },
    ]);
  const result = await features.execute();
  let isBought = false;
  let isRated = false;
  let isFavorite = false;
  if (req.userId) {
    const user = await User.findById(req.userId);
    isBought = !!user?.boughtProductIds?.find(
      (item) => item?.toString() == req.params.id.toString(),
    );
    isFavorite = !!user?.favoriteProductIds?.find(
      (item) => item?.toString() == req.params.id.toString(),
    );
    isRated = !!user?.ratedProductIds?.find(
      (item) => item?.toString() == req.params.id.toString(),
    );
  }
  return res.status(200).json({ ...result, isBought, isFavorite, isRated });
});
export const create = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);
  return res.status(201).json({
    success: true,
    data: product,
    message: "product successfully created",
  });
});
export const update = catchAsync(async (req, res, next) => {
  const {
    minPrice = null,
    maxPrice = null,
    productVariantIds = null,
    slug = null,
    maxDiscountPercent = null,
    boughtCount = null,
    ratingCount = null,
    avgRating = null,
    variantIds = null,
    InStock = null,
    ...otherData
  } = req.body;
  const product = await Product.findByIdAndUpdate(req.params.id, otherData, {
    new: true,
    runValidators: true,
  });
  const pr = await Product.findById(req.params.id);
  if (otherData.images) {
    for (let img of pr.images) {
      const isExist = otherData.images.include(img);
      if (!isExist) {
        if (fs.existsSync(`${__dirname}/Public/${img}`)) {
          fs.unlinkSync(`${__dirname}/Public/${img}`);
        }
      }
    }
  }
  if (otherData.videos) {
    for (let video of pr.videos) {
      const isExist = otherData.videos.include(video);
      if (!isExist) {
        if (fs.existsSync(`${__dirname}/Public/${video}`)) {
          fs.unlinkSync(`${__dirname}/Public/${video}`);
        }
      }
    }
  }
  return res.status(200).json({
    success: true,
    data: product,
    message: "product successfully updated",
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (product.boughtCount > 0) {
    return next(new HandleERROR("you can not delete this product", 400));
  }
  await Comment.deleteMany({ productId: req.params.id });
  await ProductVariant.deleteMany({ productId: req.params.id });
  for (let img of product.images) {
    if (fs.existsSync(`${__dirname}/Public/${img}`)) {
      fs.unlinkSync(`${__dirname}/Public/${img}`);
    }
  }
  for (let vid of product.videos) {
    if (fs.existsSync(`${__dirname}/Public/${vid}`)) {
      fs.unlinkSync(`${__dirname}/Public/${vid}`);
    }
  }
  return res.status(200).json({
    success: true,
    message: "product successfully deleted",
  });
});
export const toggleFavorite = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req;
  const user = await User.findById(userId);
  const isExist = !!user?.favoriteProductIds?.find(
    (item) => item.toString() == id.toString(),
  );
  if (isExist) {
    user.favoriteProductIds=user?.favoriteProductIds?.filter(
      (item) => item.toString() != id.toString(),
    );
  } else {
    user?.favoriteProductIds?.push(id);
  }
  await user.save();
  return res.status(200).json({
    success: true,
    message: isExist
      ? "removed from favorite product successfully"
      : "added from favorite product successfully",
  });
});
