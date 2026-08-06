import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Variant from "./variantMd.js";
import ProductVariant from "../ProductVariant/productVariantMd.js";

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Variant, req.query, req, role)
    .filter()
    .search(["value"])
    .sort()
    .limitFields()
    .paginate();
  const result = await features.execute();
  return res.status(200).json(result);
});
export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(
    Variant,
    req.query,
    req,
    role,
  ).addManualFilters({ _id: req.params.id });
  const result = await features.execute();
  return res.status(200).json(result);
});
export const create = catchAsync(async (req, res, next) => {
  const variant = await Variant.create(req.body);
  return res.status(201).json({
    success: true,
    data: variant,
    message: "new variant created successfully",
  });
});
export const update = catchAsync(async (req, res, next) => {
  const variant = await Variant.findById(req.params.id);

  const newVariant = await Variant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({
    success: true,
    data: newVariant,
    message: "variant updated successfully",
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const pr = await ProductVariant.findOne({ variantId: req.params.id });
  if (pr) {
    return next(new HandleERROR("this variant is used in some product", 400));
  }
  const variant = await Variant.findByIdAndDelete(req.params.id);

  return res.status(200).json({
    success: true,
    message: "variant removed successfully",
  });
});
