import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { EventRoutes } from '../modules/event/event.route';
import { UserRoutes } from '../modules/user/user.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/events',
    route: EventRoutes,
  },
];

moduleRoutes.forEach(module => router.use(module.path, module.route));
export const applicationRoutes = router;
