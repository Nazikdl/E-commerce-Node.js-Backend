import mongoose from "mongoose";
const productVariantSchema = new mongoose.Schema(
  {
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
      required: [true, "variant is required"],
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "product is required"],
    },
    boughtCount: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "price is required"],
    },
    quantity: {
      type: Number,
      default: 0,
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    finalPrice: {
      type: Number,
    },
  },
  { timestamps: true },
);
productVariantSchema.pre("save", function () {
  if (this.isModified("price") || this.isModified("discountPercent")) {
    this.finalPrice = Number(
      (this.price * (1 - discountPercent / 100)).toFixed(2),
    );
  }
});
productVariantSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  const currentDoc = await this.model.findOne(this.getQuery());
  if (!currentDoc) {
    return new Error("product variant not found");
  }
  const price = update.price ?? currentDoc.price;
  const discountPercent = update.discountPercent ?? currentDoc.discountPercent;
  update.finalPrice = Number((price * (1 - discountPercent / 100)).toFixed(2));
});
const ProductVariant = mongoose.model("ProductVariant", productVariantSchema);
export default ProductVariant;
