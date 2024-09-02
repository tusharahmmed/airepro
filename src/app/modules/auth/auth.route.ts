import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = Router();

router.post(
  '/signup',
  validateRequest(AuthValidation.signup),
  AuthController.signup
);

router.post(
  '/signin',
  validateRequest(AuthValidation.signin),
  AuthController.signin
);
router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshToken),
  AuthController.refreshToken
);

export const AuthRoutes = router;
