import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Product from "../Product/ProductMd.js";
import Category from "../Category/categoryMd.js";
import Brand from "../Brand/brandMd.js";

export const search = catchAsync(async (req, res, next) => {
  const condition = { isPublished: true };
  const role = req.role || 'user';

  const ProductFeatures = new ApiFeatures(Product, req.query, role)
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
  const product = await ProductFeatures.execute();

  const categoriesFeatures = new ApiFeatures(Category, req.query, req.role)
    .addManualFilters(condition)
    .filter()
    .search(["title"])
    .sort()
    .limitFields()
    .paginate()
    .populate([{ path: "supCategoryId" }, { path: "subCategoryIds" }]);
  const categories = await categoriesFeatures.execute();
  const brandFeatures = new ApiFeatures(Brand, req.query, req.role)
    .addManualFilters(condition)
    .filter()
    .search(["title"])
    .sort()
    .limitFields()
    .paginate();
  const brands = await brandFeatures.execute();
  if (product.count == 0 && categories.count == 0 && brands.count == 0) {
    return next(new HandleERROR("result not found", 404));
  }
  return res.status(200).json({
    success: true,
    data: {
      product,
      categories,
      brands,
    },
  });
});
