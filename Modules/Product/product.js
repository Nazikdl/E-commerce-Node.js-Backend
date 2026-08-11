import { Router } from "express";
import {
  create,
  getAll,
  getOne,
  remove,
  toggleFavorite,
  update,
} from "./productCn.js";
import isAdmin from "../../Middlewares/isAdmin.js";
import isLogin from "../../Middlewares/isLogin.js";
import {
  validateProductCreate,
  validateProductUpdate,
  validateProductGet,
  validateProductDelete,
  validateFavoriteToggle,
  validateProductExists,
  validateProductPermission
} from "./productValidator.js";

const productRouter = Router();

productRouter.route("/")
  .get(validateProductGet, getAll)
  .post(isAdmin, validateProductCreate, create);

productRouter.route("/:id")
  .get(validateProductGet, getOne)
  .patch(isAdmin, validateProductExists, validateProductUpdate, update)
  .delete(isAdmin, validateProductExists, validateProductDelete, remove);

productRouter.route("/favorite/:id")
  .post(isLogin, validateFavoriteToggle, validateProductExists, toggleFavorite);

export default productRouter;