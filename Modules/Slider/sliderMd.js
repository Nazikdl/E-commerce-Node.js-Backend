import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: [true, "image is required"],
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    path: {
      type: String,
      default: "/",
    },
    href: {
      type: String,
    },
  },
  { timestamps: true },
);
const Slider = mongoose.model("Slider", sliderSchema);
export default Slider;
