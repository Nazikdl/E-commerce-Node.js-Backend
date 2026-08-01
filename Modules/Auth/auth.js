import { Router } from "express";
import {
  validateAuth,
  validateLoginPassword,
  validateLoginOtp,
  validateResendCode,
  validateForgetPassword
} from "./authValidator.js";
import {
  auth,
  loginWithPassword,
  loginWithOtp,
  resendCode,
  forgetPassword
} from "./authCn.js";

const authRouter = Router();

authRouter.route('/')
  .post(validateAuth, auth);

authRouter.route('/login-password')
  .post(validateLoginPassword, loginWithPassword);

authRouter.route('/login-otp')
  .post(validateLoginOtp, loginWithOtp);

authRouter.route('/resend-code')
  .post(validateResendCode, resendCode);

authRouter.route('/forget-password')
  .post(validateForgetPassword, forgetPassword);

export default authRouter;