import { Router } from "express";
import { create, getAll, getOne, remove, update } from "./productVariantCn.js";
import isAdmin from "../../Middlewares/isAdmin.js";
import {
  validateProductVariantCreate,
  validateProductVariantUpdate,
  validateProductVariantGet,
  validateProductVariantDelete,
  validateProductVariantExists,
  validateCanDelete,
  validateProductVariantPermission
} from "./productVariantValidator.js";

const productVariantRouter = Router();

productVariantRouter.route('/')
  .get(validateProductVariantGet, getAll)
  .post(isAdmin, validateProductVariantCreate, create);

productVariantRouter.route('/:id')
  .get(validateProductVariantGet, getOne)
  .patch(isAdmin, validateProductVariantExists, validateProductVariantUpdate, update)
  .delete(isAdmin, validateProductVariantExists, validateCanDelete, validateProductVariantDelete, remove);

export default productVariantRouter;