import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import User from "./userMd.js";
import bcrypt from 'bcrypt'

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(User, req.query, req.role)
    .filter()
    .sort()
    .search(["phoneNumber", "fullName"])
    .limitFields()
    .paginate()
    .populate();
  const result = await features.execute();
  return res.status(200).json(result);
});
export const getOne = catchAsync(async (req, res, next) => {
  const condition =
    req.role == "user" ? { _id: req.userId } : { _id: req.params.id };
  const features = new ApiFeatures(User, req.query, req.role)
    .addManualFilters(condition)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate([
      {
        path: "favoriteProductIds",
        select: "title images minPrice maxPrice",
        populate: { path: "variantIds" },
      },
    ]);
  const result = await features.execute();
  return res.status(200).json(result);
});
export const update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    birthYear = null,
    fullName = null,
    role = null,
    isActive = "unknown",
  } = req.body;
  if (req.role == "user" && req.userId.toString() != id.toString()) {
    return next(new HandleERROR("you do not have permission", 401));
  }
  const user = await User.findById(id);
  if (!user) {
    return next(new HandleERROR("user not found", 404));
  }
  user.fullName = fullName || user.fullName;
  user.birthYear = birthYear || user.birthYear;
  if (req.role == "superAdmin") {
    user.role = role || user.role;
  }
  if (req.role == "superAdmin" || req.role == "admin") {
    user.isActive = isActive != "unknown" ? isActive : user.isActive;
  }
  const newUser = await user.save();
  return res.status(200).json({
    success: true,
    message: "user updated successfully",
    data: newUser,
  });
});
export const changePassword = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (req.role == "user" && req.userId.toString() != id.toString()) {
    return next(new HandleERROR("you do not have permission", 401));
  }
  const { oldPassword = null, newPassword = null } = req.body;
  const user = await User.findById(id);
  if (req.role == "user" && user.password && !oldPassword) {
    return next(new HandleERROR("old password required", 400));
  }
  if(req.role=='user' && user.password){
const isMatch = bcrypt.compareSync(oldPassword, user.password);
  if (!isMatch) {
    return next(new HandleERROR("old password incorrect", 400));
  }
  }
  
  const passReg = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/);
  if (!passReg.test(newPassword)) {
    return next(
      new HandleERROR(
        "password must be contained A-Z , a-z , 0-9  and must be have 8 min length characters",
        400,
      ),
    );
  }
  user.password=bcrypt.hashSync(newPassword,10)
  await user.save()
   return res.status(200).json({
    success: true,
    message: "password updated successfully",
  });
});
