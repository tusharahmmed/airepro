import httpStatus from 'http-status';
import config from '../../../config';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';

const signup = catchAsync(async (req, res) => {
  const { refreshToken, accessToken } = await AuthService.signup(req.body);

  // set refresh token to cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'none',

    expires: new Date(Date.now() + config.refreh_cookie_expires_in), // 1year
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User signup successfully!',
    data: { accessToken },
  });
});

const signin = catchAsync(async (req, res) => {
  const { refreshToken, accessToken } = await AuthService.signin(req.body);

  // set refresh token to cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'none',
    expires: new Date(Date.now() + config.refreh_cookie_expires_in), // 1year
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User signin successfully!',
    data: { accessToken },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully generate refresh token',
    data: result,
  });
});

export const AuthController = {
  signup,
  signin,
  refreshToken,
};
