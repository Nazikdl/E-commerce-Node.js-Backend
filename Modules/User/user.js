import { Router } from "express";
import isAdmin from "../../Middlewares/isAdmin.js";
import {
  validateGetAllUsers,
  validateGetSingleUser,
  validateUpdateUser,
  validateChangePassword,
  validateUserPermission,
} from "./userValidator.js";
import { changePassword, getAll, getOne, update } from "./userCn.js";

const userRouter = Router();

userRouter.route("/").get(isAdmin, validateGetAllUsers, getAll);

userRouter
  .route("/:id")
  .patch(validateUpdateUser, validateUserPermission, update)
  .get(validateGetSingleUser, validateUserPermission, getOne);

userRouter
  .route("/change-password/:id")
  .patch(validateChangePassword, validateUserPermission, changePassword);

export default userRouter;
