import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { EVENT_FILTERED_FIELDS } from './event.constant';
import { EventService } from './event.service';

// create an event
const createEvent = catchAsync(async (req, res) => {
  const payload = req.body;

  const result = await EventService.createEvent(payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'event created successfully',
    data: result,
  });
});
// get all users
const getAllEvents = catchAsync(async (req, res) => {
  const options = pick(req.query, PAGINATION_FIELDS);
  const filters = pick(req.query, EVENT_FILTERED_FIELDS);

  const result = await EventService.getAllEvents(options, filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'events retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single event
const getSingleEvent = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await EventService.getSingleEvent(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'event retrieved successfully',
    data: result,
  });
});

// delete single event
const deleteSingleEvent = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await EventService.deleteEvent(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'event deleted successfully',
    data: result,
  });
});

// update single event
const updateEvent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await EventService.updateEvent(id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'event updated successfully',
    data: result,
  });
});

// add participants
const addParticipants = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await EventService.addParticipants(
    id,
    payload.event_participants
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'participants added successfully',
    data: result,
  });
});

// remove participants
const removeParticipant = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { participantId } = req.params;

  const result = await EventService.removeParticipant(id, participantId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'participants removed successfully',
    data: result,
  });
});

export const EventController = {
  createEvent,
  getAllEvents,
  getSingleEvent,
  deleteSingleEvent,
  updateEvent,
  addParticipants,
  removeParticipant,
};
