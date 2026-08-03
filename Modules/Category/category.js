import { Router } from "express";
import { create, getAll, getOne, remove, update } from "./categoryCn.js";
import isAdmin from "../../Middlewares/isAdmin.js";
import { 
  validateCategoryCreate, 
  validateCategoryUpdate, 
  validateCategoryGet, 
  validateCategoryDelete,
  validateCategoryExists,
  validateCategoryCanBeDeleted,
  validateCategoryImage
} from "./categoryValidator.js";

const categoryRouter = Router();

// Public routes (with validation)
categoryRouter.route("/")
  .get(validateCategoryGet, getAll)
  .post(isAdmin, validateCategoryImage, validateCategoryCreate, create);

categoryRouter.route("/:id")
  .get(validateCategoryGet, getOne)
  .delete(isAdmin, validateCategoryExists, validateCategoryCanBeDeleted, validateCategoryDelete, remove)
  .patch(isAdmin, validateCategoryImage, validateCategoryExists, validateCategoryUpdate, update);

export default categoryRouter;