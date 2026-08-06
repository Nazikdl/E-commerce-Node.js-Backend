import mongoose from "mongoose";
const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "title is required"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    city: {
      type: String,
      required: [true, "city is required"],
    },
    province: {
      type: String,
      required: [true, "province is required"],
    },
    lat: {
      type: String,
      required: [true, "lat is required"],
    },
    lng: {
      type: String,
      required: [true, "lng is required"],
    },
    receiverPhoneNumber: {
      type: String,
      required: [true, "receiver PhoneNumber is required"],
      match: [/^(\\+98|0)?9\\d{9}$/, "invalid phone number"],
    },
    receiverFullName: {
      type: String,
      required: [true, "receiver FullName is required"],
    },
    postalCode: {
      type: String,
      required: [true, "postal Code is required"],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    unitNumber: {
      type: String,
      default: "",
    },
    floor: {
      type: String,
      default: "",
    },
    plateNumber: {
      type: String,
      required: [true, "plateNumber is required"],
    },
  },
  { timestamps: true },
);
const Address = mongoose.model("Address", addressSchema);
export default Address;
