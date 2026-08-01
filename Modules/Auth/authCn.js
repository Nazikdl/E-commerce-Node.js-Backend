import { catchAsync, HandleERROR } from "vanta-api";
import User from "../User/userMd.js";
import { sendAuthCode, verifyCode } from "../../Utils/smsHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Cart from "../Cart/cartMd.js";

export const auth = catchAsync(async (req, res, next) => {
  const { phoneNumber } = req.body;
  const user = await User?.findOne({ phoneNumber });
  if (!user?.password) {
    const smsResult = await sendAuthCode(phoneNumber);
    if (!smsResult.success) {
      return next(new HandleERROR(smsResult.message, 401));
    }
  }
  return res.status(200).json({
    success: true,
    data: {
      userExist: !!user,
      password: !!user?.password,
    },
    message: !user?.password ? "otp code sent" : "login with password",
  });
});
export const loginWithPassword = catchAsync(async (req, res, next) => {
  const { phoneNumber, password } = req.body;
  const user = await User?.findOne({ phoneNumber });
  if (!user) {
    return next(new HandleERROR("phone number or password incorrect", 401));
  }
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return next(new HandleERROR("phone number or password incorrect", 401));
  }
  const token = jwt.sign(
    { _id: user._id, role: user?.role },
    process.env.SECRET_JWT,
  );
  return res.status(200).json({
    success: true,
    data: {
      token,
      user,
    },
    message: "login with password successfully",
  });
});
export const loginWithOtp = catchAsync(async (req, res, next) => {
  const { phoneNumber, code } = req.body;
  const smsResult = await verifyCode(phoneNumber, code);
  if (!smsResult.success) {
    return next(new HandleERROR(smsResult.message, 401));
  }
  let user = await User?.findOne({ phoneNumber });
  if (!user) {
    user = await User.create({ phoneNumber });
    const cart = await Cart.create({ userId: user?._id });
    user.cartId = Cart._id;
    await user.save();
  }

  const token = jwt.sign(
    { _id: user._id, role: user?.role },
    process.env.SECRET_JWT,
  );
  return res.status(200).json({
    success: true,
    data: {
      token,
      user,
    },
    message: "login with password successfully",
  });
});
export const resendCode = catchAsync(async (req, res, next) => {
  const { phoneNumber } = req.body;
  const smsResult = await sendAuthCode(phoneNumber);
  if (!smsResult.success) {
    return next(new HandleERROR(smsResult.message, 401));
  }
  return res.status(200).json({
    success: true,
    message: "otp code sent successfully",
  });
});
export const forgetPassword = catchAsync(async (req, res, next) => {
  const { phoneNumber, code, newPassword } = req.body;
  const passReg = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/);
  if (!passReg.test(newPassword)) {
    return next(new HandleERROR("invalid format password", 400));
  }
  const smsResult = await verifyCode(phoneNumber, code);
  if (!smsResult.success) {
    return next(new HandleERROR(smsResult.message, 401));
  }
  const user = await User.findOne({ phoneNumber });
  if (!user) {
    return next(new HandleERROR("invalid phone number", 404));
  }
  user.password = bcrypt.hashSync(newPassword, 10);
  await user.save();
  return res.status(200).json({
    success: true,
    message: "password updated successfully",
  });
});
