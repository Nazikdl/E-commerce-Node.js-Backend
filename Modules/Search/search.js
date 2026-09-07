import { Router } from "express";
import { search } from "./searchCn.js";
import { validateSearchAll } from "./searchValidator.js";

const searchRouter = Router();

searchRouter.route('/').get(validateSearchAll, search);

export default searchRouter;