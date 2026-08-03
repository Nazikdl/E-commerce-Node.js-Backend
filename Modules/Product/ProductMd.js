import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
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
});
const Product = mongoose.model("Product", productSchema);
export default Product;
