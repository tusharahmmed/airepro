"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const event_route_1 = require("../modules/event/event.route");
const user_route_1 = require("../modules/user/user.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/users',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/events',
        route: event_route_1.EventRoutes,
    },
];
moduleRoutes.forEach(module => router.use(module.path, module.route));
exports.applicationRoutes = router;
