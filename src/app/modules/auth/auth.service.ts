import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';

const signup = async (payload: User) => {
  // hash password
  payload.password = await bcrypt.hash(
    payload.password,
    Number(config.bycrypt_salt_rounds)
  );

  const user = await prisma.user.create({ data: payload });

  const accessToken = jwtHelpers.createToken(
    { id: user.id, role: user.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { id: user.id, role: user.role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return { accessToken, refreshToken };
};
const signin = async (payload: Pick<User, 'email' | 'password'>) => {
  const { email, password } = payload;
  // find user
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found!');
  }

  // match password

  const matchedResult = await bcrypt.compare(password, user.password);

  if (!matchedResult) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Password does not matched');
  }

  // create token

  const accessToken = jwtHelpers.createToken(
    { id: user.id, role: user.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { id: user.id, role: user.role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return { accessToken, refreshToken };
};

// refresh token service
const refreshToken = async (payload: string) => {
  const refreshToken = payload;
  let verifiedToken = null;

  // check invalid token
  try {
    verifiedToken = jwtHelpers.verifyToken(
      refreshToken,
      config.jwt.refresh_secret as Secret
    ) as JwtPayload;
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid refresh token');
  }

  // check user exist
  const { id } = verifiedToken;

  const verifiedUser = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!verifiedUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // generate new accessToken
  const newAccessToken = jwtHelpers.createToken(
    {
      id: verifiedUser.id,
      role: verifiedUser.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  signup,
  signin,
  refreshToken,
};
