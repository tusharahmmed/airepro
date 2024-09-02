"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const signup = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'name is required' }),
        email: zod_1.z.string({ required_error: 'Email is required' }),
        password: zod_1.z.string({ required_error: 'Password is required' }),
        role: zod_1.z.enum(['user', 'super_admin']).optional(),
    }),
});
const signin = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: 'email is required' }),
        password: zod_1.z.string({ required_error: 'password is required' }),
    }),
});
const refreshToken = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({ required_error: 'Refresh token is required' }),
    }),
});
exports.AuthValidation = {
    signup,
    signin,
    refreshToken,
};
