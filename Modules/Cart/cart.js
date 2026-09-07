import { Router } from "express";
import { addItem, clearCart, getOne, remove } from "./cartCn.js";
import {
  validateCartGet,
  validateCartAdd,
  validateCartRemove,
  validateCartClear,
  validateCartExists,
  validateCartPermission,
  validateCartItem
} from "./cartValidator.js";

const cartRouter = Router();

cartRouter.route("/")
  .get(validateCartGet, getOne)
  .post(validateCartAdd, addItem)
  .patch(validateCartRemove, validateCartExists, validateCartItem, remove)
  .delete(validateCartClear, validateCartExists, clearCart);

export default cartRouter;