import { Router } from "express";
import isAdmin from "../../Middlewares/isAdmin.js";
import isLogin from "../../Middlewares/isLogin.js";
import {
  changePublished,
  create,
  getAll,
  getAllCommentOfProduct,
  remove,
  reply,
} from "./commentCn.js";
import {
  validateCommentCreate,
  validateCommentDelete,
  validateCommentGet,
  validateCommentReply,
  validateGetAllComments,
  validateGetAllCommentsOfProduct,
  validateCommentExists,
  validateCommentPermission,
  validateReplyPermission,
  validateCanDelete
} from "./commentValidator.js";

const commentRouter = Router();

commentRouter.route("/")
  .get(isAdmin, validateGetAllComments, getAll)
  .post(isLogin, validateCommentCreate, create);

commentRouter.route("/:productId")
  .get(validateGetAllCommentsOfProduct, getAllCommentOfProduct);

commentRouter.route("/:id")
  .patch(isAdmin, validateCommentExists, validateCommentGet, changePublished)
  .delete(isAdmin, validateCommentExists, validateCanDelete, validateCommentDelete, remove);

commentRouter.route("/reply/:commentId")
  .post(isLogin, validateCommentReply, validateReplyPermission, reply);

export default commentRouter;