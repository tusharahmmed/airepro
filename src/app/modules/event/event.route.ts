import { Router } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { EventController } from './event.controller';
import { EventValidation } from './event.validation';

const router = Router();

router.delete(
  '/:id/participants/:participantId',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  EventController.removeParticipant
);

router.post(
  '/:id/participants',
  validateRequest(EventValidation.addParticipants),
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  EventController.addParticipants
);

router.put(
  '/:id',
  validateRequest(EventValidation.updateEvent),
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  EventController.updateEvent
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  EventController.deleteSingleEvent
);

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  EventController.getSingleEvent
);

router.post(
  '/',
  validateRequest(EventValidation.createEvent),
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  EventController.createEvent
);

router.get('/', auth(ENUM_USER_ROLE.SUPER_ADMIN), EventController.getAllEvents);

export const EventRoutes = router;
