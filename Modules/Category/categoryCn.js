import fs from "fs";
import { __dirname } from "../../app.js";
import Category from "./categoryMd.js";
import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Product from "../Product/ProductMd.js";
export const getAll = catchAsync(async (req, res, next) => {
  const condition =
    req.role != "admin" && req.role != "superAdmin"
      ? { isPublished: true }
      : {};
  const features = new ApiFeatures(Category, req.query, req, role)
    .addManualFilters(condition)
    .filter()
    .search(["title"])
    .sort()
    .limitFields()
    .paginate()
    .populate([{ path: "supCategoryId" }, { path: "subCategoryIds" }]);
  const result = await features.execute();
  return res.status(200).json(result);
});
export const getOne = catchAsync(async (req, res, next) => {
  const condition =
    req.role != "admin" && req.role != "superAdmin"
      ? { isPublished: true, _id: req.params.id }
      : { _id: req.params.id };
  const features = new ApiFeatures(Category, req.query, req, role)
    .addManualFilters(condition)
    .populate([{ path: "supCategoryId" }, { path: "subCategoryIds" }]);

  const result = await features.execute();
  return res.status(200).json(result);
});
export const create = catchAsync(async (req, res, next) => {
  const category = await Category.create(req.body);
  if (category.supCategoryId) {
    await Category.findByIdAndUpdate(
      category.supCategoryId,
      {
        $push: { subCategoryIds: category._id },
      },
      { new: true, runValidators: true },
    );
  }
  return res.status(201).json({
    success: true,
    data: category,
    message: "category Created Successfully",
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const pr = await Product.findOne({ categoryIds: req.params.id });
  const cat = await Category.findOne({ supCategoryId: req.params.id });
  if (pr || cat) {
    return next(
      new HandleERROR(
        "this category is used in some product or parent of some category",
        400,
      ),
    );
  }
  const category = await Category.findByIdAndDelete(req.params.id);
  if (category.supCategoryId) {
    await Category.findByIdAndUpdate(
      category.supCategoryId,
      {
        $pull: { subCategoryIds: category._id },
      },
      { new: true, runValidators: true },
    );
  }
  if (
    category.image &&
    fs.existsSync(`${__dirname}/Public/${category.image}`)
  ) {
    fs.unlinkSync(`${__dirname}/Public/${category.image}`);
  }
  return res.status(200).json({
    success: true,
    message: "category deleted Successfully",
  });
});
export const update = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  const newCategory = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );
  if (newCategory?.supCategoryId != category?.supCategoryId) {
    await Category.findByIdAndUpdate(category.supCategoryId, {
      $pull: {
        subCategoryIds: category._id,
      },
    });
    await Category.findByIdAndUpdate(newCategory.supCategoryId, {
      $push: {
        subCategoryIds: category._id,
      },
    });
  }
  if (category.image && req?.body?.image != category.image) {
    fs.unlinkSync(`${__dirname}/Public/${category.image}`);
  }
  return res.status(200).json({
    success: true,
    data: newCategory,
    message: "category updated Successfully",
  });
});
