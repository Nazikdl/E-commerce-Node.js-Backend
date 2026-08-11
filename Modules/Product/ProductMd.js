import mongoose from "mongoose";

const informationSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, "key of information is required"],
    },
    value: {
      type: String,
      required: [true, "value of information is required"],
    },
  },
  { _id: false },
);
const productSchema = new mongoose.Schema(
  {
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    categoryIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
        },
      ],
      default: [],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "title is required"],
      unique: [true, "title is already taken"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "description is required"],
    },
    slug: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
    videos: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    boughtCount: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    avgRating: {
      type: Number,
      default: 0,
    },
    maxDiscountPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    productVariantIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProductVariant",
        },
      ],
      default: [],
    },
    variantIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Variant" }],
      default: [],
    },
    defaultProductVariantId: {
      type: { type: mongoose.Schema.Types.ObjectId, 
        ref: "productVariant" },
      default:{}
    },
    minPrice: {
      type: Number,
    },
    maxPrice: {
      type: Number,
    },
    InStock: {
      type: Boolean,
      default: true,
    },
    information: {
      type: [informationSchema],
      default: [],
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);
productSchema.pre("save", function () {
  this.slug = this.title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
});

productSchema.pre("findOneAndUpdate", function () {
  this.slug = this.title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
});
const Product = mongoose.model("Product", productSchema);
export default Product;
