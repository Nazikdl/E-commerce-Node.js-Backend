import { Router } from 'express';
import { create, getAll, getOne, remove, update } from './addressCn.js';
import { 
  validateAddressCreate, 
  validateAddressUpdate, 
  validateAddressGet, 
  validateAddressDelete,
  validateAddressExists,
  validateAddressPermission
} from './addressValidator.js';

const addressRouter = Router();

addressRouter.route('/')
  .get(validateAddressGet, getAll)
  .post(validateAddressCreate, create);

addressRouter.route('/:id')
  .get(validateAddressGet, validateAddressExists, validateAddressPermission, getOne)
  .patch(validateAddressExists, validateAddressPermission, validateAddressUpdate, update)
  .delete(validateAddressExists, validateAddressPermission, validateAddressDelete, remove);

export default addressRouter;