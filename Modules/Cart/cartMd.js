import mongoose from "mongoose";
const itemSchema = new mongoose.Schema({
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
  },
  categoryIds: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
   productVariantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductVariant",
  },
  cartQuantity:{
    type:Number,
    default:1
  }
},{_id:false});
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    items:{
        type:[itemSchema],
        default:[]
    },
    finalPrice:{
        type:Number,
        default:0
    },
    finalPriceAfterDiscount:{
        type:Number,
        default:0
    },
    totalPrice:{
        type:Number,
        default:0
    }
  },
  { timestamps: true },
);
const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
