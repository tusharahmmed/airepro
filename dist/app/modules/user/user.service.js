"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const utils_1 = require("../../../shared/utils");
const user_constant_1 = require("./user.constant");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // hash password
    if (payload === null || payload === void 0 ? void 0 : payload.password) {
        payload.password = yield bcrypt_1.default.hash(payload === null || payload === void 0 ? void 0 : payload.password, Number(config_1.default.bycrypt_salt_rounds));
    }
    const result = yield prisma_1.default.user.create({
        data: payload,
    });
    const passwordRemoved = (0, utils_1.excludeFields)(result, ['password']);
    return passwordRemoved;
});
// get all user
const getAllUsers = (options, filters) => __awaiter(void 0, void 0, void 0, function* () {
    // paginatin
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    // filters
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    // generate search condition
    if (searchTerm) {
        andConditions.push({
            OR: user_constant_1.USER_SEARCH_FIELDS.map(field => ({
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
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.user.findMany({
        // filters
        where: whereConditions,
        //pagination
        orderBy: {
            [sortBy]: sortOrder,
        },
        skip,
        take: limit,
    });
    const passwordRemoved = result.map(item => (0, utils_1.excludeFields)(item, ['password']));
    const total = yield prisma_1.default.user.count({ where: whereConditions });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: passwordRemoved,
    };
});
// get single user
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    const passwordRemoved = (0, utils_1.excludeFields)(result, ['password']);
    return passwordRemoved;
});
// get single user
const deleteSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // check role
    const wantToDeleteUser = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    if ((wantToDeleteUser === null || wantToDeleteUser === void 0 ? void 0 : wantToDeleteUser.role) === client_1.USER_ROLE.super_admin) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Can not delete super admin!');
    }
    const result = yield prisma_1.default.user.delete({
        where: {
            id,
        },
    });
    const passwordRemoved = (0, utils_1.excludeFields)(result, ['password']);
    return passwordRemoved;
});
// update a user
const updateUser = (payload, id) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload === null || payload === void 0 ? void 0 : payload.password) {
        payload.password = yield bcrypt_1.default.hash(payload.password, Number(config_1.default.bycrypt_salt_rounds));
    }
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: payload,
    });
    const passwordRemoved = (0, utils_1.excludeFields)(result, ['password']);
    return passwordRemoved;
});
exports.UserService = {
    createUser,
    getAllUsers,
    getSingleUser,
    deleteSingleUser,
    updateUser,
};
