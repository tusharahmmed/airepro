import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { USER_FILTERED_FIELDS } from './user.constant';
import { UserService } from './user.service';

// create new user
const createUser = catchAsync(async (req, res) => {
  const payload = req.body;

  const result = await UserService.createUser(payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user created successfully',
    data: result,
  });
});

// get all users
const getAllUsers = catchAsync(async (req, res) => {
  const options = pick(req.query, PAGINATION_FIELDS);
  const filters = pick(req.query, USER_FILTERED_FIELDS);

  const result = await UserService.getAllUsers(options, filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// create new user
const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserService.getSingleUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user retrieved successfully',
    data: result,
  });
});

// delete a user
const deleteSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserService.deleteSingleUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user deleted successfully',
    data: result,
  });
});

// delete a user
const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await UserService.updateUser(payload, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user updated successfully',
    data: result,
  });
});

export const UserController = {
  createUser,
  getAllUsers,
  getSingleUser,
  deleteSingleUser,
  updateUser,
};
