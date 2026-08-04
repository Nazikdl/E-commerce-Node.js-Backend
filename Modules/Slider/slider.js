import { Router } from "express";
import { create, getAll, getOne, remove, update } from "./sliderCn.js";
import isAdmin from "../../Middlewares/isAdmin.js";
import { 
  validateSliderCreate, 
  validateSliderUpdate, 
  validateSliderGet, 
  validateSliderDelete,
  validateSliderExists,
  validateSliderImage
} from "./sliderValidator.js";

const sliderRouter = Router();

sliderRouter.route("/")
  .get(validateSliderGet, getAll)
  .post(isAdmin, validateSliderImage, validateSliderCreate, create);

sliderRouter.route("/:id")
  .get(validateSliderGet, getOne)
  .delete(isAdmin, validateSliderExists, validateSliderDelete, remove)
  .patch(isAdmin, validateSliderImage, validateSliderExists, validateSliderUpdate, update);

export default sliderRouter;