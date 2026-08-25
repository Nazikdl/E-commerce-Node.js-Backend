import isLogin from "../../Middlewares/isLogin.js";
import isAdmin from "../../Middlewares/isAdmin.js";
import { Router } from "express";
import { checkDiscountCode, create, getAll, getOne, remove, update } from "./discountCodeCn.js";
const discountCodeRouter=Router()
discountCodeRouter.route('/').get(isAdmin,getAll).post(isAdmin,create)
discountCodeRouter.route('/:id').get(isAdmin,getOne).patch(isAdmin,update).delete(isAdmin,remove)
discountCodeRouter.route('/check').post(isLogin,checkDiscountCode)
export default discountCodeRouter