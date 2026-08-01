import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
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
},{timestamps:true});
const Brand=mongoose.model('Brand',brandSchema)
export default Brand
