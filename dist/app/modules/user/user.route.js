"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
router.post('/', (0, validateRequest_1.default)(user_validation_1.UserValidation.createUser), (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN), user_controller_1.UserController.createUser);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN), user_controller_1.UserController.deleteSingleUser);
router.patch('/:id', (0, validateRequest_1.default)(user_validation_1.UserValidation.updateUser), (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN), user_controller_1.UserController.updateUser);
router.get('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN), user_controller_1.UserController.getSingleUser);
router.get('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN), user_controller_1.UserController.getAllUsers);
exports.UserRoutes = router;
