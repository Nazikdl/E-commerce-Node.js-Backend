import { Router } from "express";
import { create, getAll, getOne, remove, update } from "./brandCn.js";
import isAdmin from "../../Middlewares/isAdmin.js";
import { 
  validateBrandCreate, 
  validateBrandUpdate, 
  validateBrandGet, 
  validateBrandDelete,
  validateBrandExists,
  validateBrandHasNoProducts,
  validateBrandImage
} from "./brandValidator.js";

const brandRouter = Router();

// Public routes (with validation)
brandRouter.route("/")
  .get(validateBrandGet, getAll)
  .post(isAdmin, validateBrandImage, validateBrandCreate, create);

brandRouter.route("/:id")
  .get(validateBrandGet, getOne)
  .patch(isAdmin, validateBrandImage, validateBrandExists, validateBrandUpdate, update)
  .delete(isAdmin, validateBrandExists, validateBrandHasNoProducts, validateBrandDelete, remove);

export default brandRouter;