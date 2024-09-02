"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventValidation = exports.updateEvent = exports.createEvent = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.createEvent = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'name is required' }),
        description: zod_1.z.string({ required_error: 'Description is required' }),
        date: zod_1.z.string({ required_error: 'Date is required' }),
        start_time: zod_1.z.string({ required_error: 'Start time is required' }),
        end_time: zod_1.z.string({ required_error: 'End time is required' }),
        location: zod_1.z.enum([...Object.values(client_1.Location)]),
        event_participants: zod_1.z
            .string({ required_error: 'Participants is required' })
            .array()
            .nonempty({ message: "participant can't be empty!" })
            .min(2, { message: 'Minimum 2 participant are required' }),
    }),
});
exports.updateEvent = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'name is required' }).optional(),
        description: zod_1.z
            .string({ required_error: 'Description is required' })
            .optional(),
        date: zod_1.z.string({ required_error: 'Date is required' }),
        start_time: zod_1.z.string({ required_error: 'Start time is required' }),
        end_time: zod_1.z.string({ required_error: 'End time is required' }),
        location: zod_1.z.enum([...Object.values(client_1.Location)]),
    }),
});
const addParticipants = zod_1.z.object({
    body: zod_1.z.object({
        event_participants: zod_1.z
            .string({ required_error: 'Participants is required' })
            .array()
            .nonempty({ message: "participant can't be empty!" }),
    }),
});
exports.EventValidation = { createEvent: exports.createEvent, updateEvent: exports.updateEvent, addParticipants };
