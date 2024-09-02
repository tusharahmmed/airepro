/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, USER_ROLE, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { excludeFields } from '../../../shared/utils';
import { USER_SEARCH_FIELDS } from './user.constant';
import { IUserFilters } from './user.interface';

const createUser = async (payload: User) => {
  // hash password
  if (payload?.password) {
    payload.password = await bcrypt.hash(
      payload?.password,
      Number(config.bycrypt_salt_rounds)
    );
  }
  const result = await prisma.user.create({
    data: payload,
  });
  const passwordRemoved = excludeFields(result, ['password']);

  return passwordRemoved;
};

// get all user
const getAllUsers = async (
  options: IPaginationOptions,
  filters: IUserFilters
): Promise<IGenericResponse<any>> => {
  // paginatin
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  // filters
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  // generate search condition
  if (searchTerm) {
    andConditions.push({
      OR: USER_SEARCH_FIELDS.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  // generate filter condition
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    // filters
    where: whereConditions,
    //pagination
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const passwordRemoved = result.map(item => excludeFields(item, ['password']));

  const total = await prisma.user.count({ where: whereConditions });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: passwordRemoved,
  };
};

// get single user
const getSingleUser = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  const passwordRemoved = excludeFields(result, ['password'] as any);

  return passwordRemoved;
};

// get single user
const deleteSingleUser = async (id: string) => {
  // check role
  const wantToDeleteUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (wantToDeleteUser?.role === USER_ROLE.super_admin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Can not delete super admin!');
  }
  const result = await prisma.user.delete({
    where: {
      id,
    },
  });

  const passwordRemoved = excludeFields(result, ['password'] as any);

  return passwordRemoved;
};

// update a user
const updateUser = async (payload: Partial<User>, id: string) => {
  if (payload?.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(config.bycrypt_salt_rounds)
    );
  }

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });
  const passwordRemoved = excludeFields(result, ['password']);

  return passwordRemoved;
};

export const UserService = {
  createUser,
  getAllUsers,
  getSingleUser,
  deleteSingleUser,
  updateUser,
};
