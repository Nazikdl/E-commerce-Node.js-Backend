import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import ProductVariant from "./productVariantMd.js";
import Product from "../Product/ProductMd.js";

export const getAll = catchAsync(async (req, res, next) => {
  const feature = new ApiFeatures(ProductVariant, req.query, req.role)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate([
      { path: "variantId" },
      { path: "productId", select: "title images" },
    ]);
  const result = await feature.execute();
  return res.status(200).json(result);
});
export const getOne = catchAsync(async (req, res, next) => {
  const feature = new ApiFeatures(ProductVariant, req.query, req.role)
    .addManualFilters({ _id: req.params.id })
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate([
      { path: "variantId" },
      { path: "productId", select: "title images" },
    ]);
  const result = await feature.execute();
  return res.status(200).json(result);
});
export const create = catchAsync(async (req, res, next) => {
  const productVariant = await ProductVariant.create(req.body);
  const product = await Product.findOneAndUpdate(
    productVariant.productId,
    {
      $push: {
        productVariantIds: productVariant._id,
        variantIds: productVariant.variantId,
      },
    },
    { new: true, runValidators: true },
  ).populate("productVariantIds");
  let defaultProductVariantId = null;
  let minPrice = 0;
  let maxPrice = 0;
  let maxDiscountPercent = 0;
  let InStock = false;
  for (let prv of product.productVariantIds) {
    if (prv.quantity == 0) {
      continue;
    }
    InStock = true;
    if (
      defaultProductVariantId &&
      prv.discountPercent > defaultProductVariantId.discountPercent
    ) {
      defaultProductVariantId = prv;
    }
    if (defaultProductVariantId == null) {
      defaultProductVariantId = prv;
    }
    minPrice = minPrice < prv.price ? minPrice : prv.price;
    maxPrice = maxPrice > prv.price ? maxPrice : prv.price;
    maxDiscountPercent =
      maxDiscountPercent > prv.discountPercent
        ? maxDiscountPercent
        : prv.discountPercent;
  }
  product.maxPrice = maxPrice;
  product.minPrice = minPrice;
  product.maxDiscountPercent = maxDiscountPercent;
  product.InStock = InStock;
  product.defaultProductVariantId = defaultProductVariantId._id;
  await product.save();
  return res.status(201).json({
    success: true,
    data: productVariant,
    message: "product variant created successfully",
  });
});
export const update = catchAsync(async (req, res, next) => {
  const productVariant = await ProductVariant.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
  const product = await Product.findOne(productVariant.productId).populate("productVariantIds");
  let defaultProductVariantId = null;
  let minPrice = 0;
  let maxPrice = 0;
  let maxDiscountPercent = 0;
  let InStock = false;
  for (let prv of product.productVariantIds) {
    if (prv.quantity == 0) {
      continue;
    }
    InStock = true;
    if (
      defaultProductVariantId &&
      prv.discountPercent > defaultProductVariantId.discountPercent
    ) {
      defaultProductVariantId = prv;
    }
    if (defaultProductVariantId == null) {
      defaultProductVariantId = prv;
    }
    minPrice = minPrice < prv.price ? minPrice : prv.price;
    maxPrice = maxPrice > prv.price ? maxPrice : prv.price;
    maxDiscountPercent =
      maxDiscountPercent > prv.discountPercent
        ? maxDiscountPercent
        : prv.discountPercent;
  }
  product.maxPrice = maxPrice;
  product.minPrice = minPrice;
  product.maxDiscountPercent = maxDiscountPercent;
  product.InStock = InStock;
  product.defaultProductVariantId = defaultProductVariantId._id;
  await product.save();
  return res.status(200).json({
    success: true,
    data: productVariant,
    message: "product variant updated successfully",
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const productVariant = await ProductVariant.findById(req.params.id);
  if(productVariant.boughtCount>0){
    return next(new HandleERROR('you can not delete this product variant',400))
  }
 await productVariant.findByIdAndDelete(req.params.id)
  const product = await Product.findByIdAndUpdate(productVariant.productId,{$pull:{
    productVariantIds:productVariant._id,variantIds:productVariant.variantId
  }},{new:true,runValidators:true}).populate("productVariantIds");
  let defaultProductVariantId = null;
  let minPrice = 0;
  let maxPrice = 0;
  let maxDiscountPercent = 0;
  let InStock = false;
  for (let prv of product.productVariantIds) {
    if (prv.quantity == 0) {
      continue;
    }
    InStock = true;
    if (
      defaultProductVariantId &&
      prv.discountPercent > defaultProductVariantId.discountPercent
    ) {
      defaultProductVariantId = prv;
    }
    if (defaultProductVariantId == null) {
      defaultProductVariantId = prv;
    }
    minPrice = minPrice < prv.price ? minPrice : prv.price;
    maxPrice = maxPrice > prv.price ? maxPrice : prv.price;
    maxDiscountPercent =
      maxDiscountPercent > prv.discountPercent
        ? maxDiscountPercent
        : prv.discountPercent;
  }
  product.maxPrice = maxPrice;
  product.minPrice = minPrice;
  product.maxDiscountPercent = maxDiscountPercent;
  product.InStock = InStock;
  product.defaultProductVariantId = defaultProductVariantId._id;
  await product.save();
  return res.status(200).json({
    success: true,
    message: "product variant removed successfully",
  });
});

