import { Router } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const router = Router();

router.post(
  '/',
  validateRequest(UserValidation.createUser),
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  UserController.createUser
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  UserController.deleteSingleUser
);

router.patch(
  '/:id',
  validateRequest(UserValidation.updateUser),
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  UserController.updateUser
);
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  UserController.getSingleUser
);

router.get('/', auth(ENUM_USER_ROLE.SUPER_ADMIN), UserController.getAllUsers);

export const UserRoutes = router;
