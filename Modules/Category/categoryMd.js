import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      unique: [true, "title already taken"],
      trim: true,
      minlength: [2, "title must be at least 2 character"],
      maxlength: [50, "title must be at most 50 character"],
    },
    image: {
      type: String,
      default: "",
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    supCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    subCategoryIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);
const Category = mongoose.model("Category", CategorySchema);
export default Category;
