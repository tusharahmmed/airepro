"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createUser = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'name is required' }),
        email: zod_1.z.string({ required_error: 'Email is required' }),
        password: zod_1.z.string({ required_error: 'Password is required' }),
        role: zod_1.z
            .enum([...Object.values(client_1.USER_ROLE)])
            .optional(),
    }),
});
const updateUser = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        email: zod_1.z.string().optional(),
        password: zod_1.z.string().optional(),
        role: zod_1.z
            .enum([...Object.values(client_1.USER_ROLE)])
            .optional(),
    }),
});
exports.UserValidation = {
    createUser,
    updateUser,
};
