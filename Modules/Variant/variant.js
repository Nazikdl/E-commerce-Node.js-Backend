import { Router } from "express";
import { create, getAll, getOne, remove, update } from "./variantCn.js";
import isAdmin from "../../Middlewares/isAdmin.js";
import { 
  validateVariantCreate, 
  validateVariantUpdate, 
  validateVariantGet, 
  validateVariantDelete,
  validateVariantExists,
  validateVariantNotInUse
} from "./variantValidator.js";

const variantRouter = Router();

variantRouter.route("/")
  .get(validateVariantGet, getAll)
  .post(isAdmin, validateVariantCreate, create);

variantRouter.route("/:id")
  .get(validateVariantGet, getOne)
  .patch(isAdmin, validateVariantExists, validateVariantUpdate, update)
  .delete(isAdmin, validateVariantExists, validateVariantNotInUse, validateVariantDelete, remove);

export default variantRouter;