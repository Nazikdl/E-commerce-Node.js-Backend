import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  password: {
    type: String,
  },
  phoneNumber: {
    type: String,
    match: [/^(\\+98|0)?9\\d{9}$/, "invalid phone number"],
    required: [true, "phone number is required"],
    unique: [true, "phone number already taken"],
  },
  fullName: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["admin", "superAdmin", "user"],
    default: "user",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  ratedProductIds: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    default: [],
  },
  favoriteProductIds: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    default: [],
  },
  boughtProductIds: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    default: [],
  },
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
  birthYear: {
    type: Date,
    default: null,
  },
  addressIds: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    default: [],
  },
},{timestamps:true});
const User=mongoose.model('User',userSchema)
export default User
