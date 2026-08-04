import ApiFeatures, { catchAsync } from "vanta-api";
import Slider from "./sliderMd.js";
import fs from "fs";
import { __dirname } from "../../app.js";

export const getAll = catchAsync(async (req, res, next) => {
  const condition =
    req.role != "admin" && req.role != "superAdmin"
      ? { isPublished: true }
      : {};
  const features = new ApiFeatures(Slider, req.query, req, role)
    .addManualFilters(condition)
    .filter()
    .search(["title"])
    .sort()
    .limitFields()
    .paginate();
  const result = await features.execute();
  return res.status(200).json(result);
});
export const getOne = catchAsync(async (req, res, next) => {
  const condition =
    req.role != "admin" && req.role != "superAdmin"
      ? { isPublished: true, _id: req.params.id }
      : { _id: req.params.id };
  const features = new ApiFeatures(
    Slider,
    req.query,
    req,
    role,
  ).addManualFilters(condition);
  const result = await features.execute();
  return res.status(200).json(result);
});
export const create = catchAsync(async (req, res, next) => {
  const slider = await Slider.create(req.body);
  return res.status(201).json({
    success: true,
    data: slider,
    message: "new slider created successfully",
  });
});
export const update = catchAsync(async (req, res, next) => {
  const slider = await Slider.findById(req.params.id);
  if (slider.image && slider.image != req?.body?.image) {
    fs.unlinkSync(`${__dirname}/Public/${slider.image}`);
  }
  const newSlider = await Slider.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({
    success: true,
    data: newSlider,
    message: "slider updated successfully",
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const slider = await Slider.findByIdAndDelete(req.params.id);
  if (slider.image && fs.existsSync(`${__dirname}/Public/${slider.image}`)) {
    fs.unlinkSync(`${__dirname}/Public/${slider.image}`);
  }
  return res.status(200).json({
    success: true,
    message: "slider removed successfully",
  });
});
