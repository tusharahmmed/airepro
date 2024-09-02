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
exports.EventService = void 0;
const date_fns_1 = require("date-fns");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const utils_1 = require("../../../shared/utils");
// check slot available function
function isTimeSlotAvailable(startTime_1, endTime_1, location_1) {
    return __awaiter(this, arguments, void 0, function* (startTime, endTime, location, forUpdate = false) {
        const existingEvents = yield prisma_1.default.event.findMany({
            where: {
                location: location,
                AND: [
                    {
                        start_time: {
                            lt: endTime, // Event starts before new event ends
                        },
                    },
                    {
                        end_time: {
                            gt: startTime, // Event ends after new event starts
                        },
                    },
                ],
            },
        });
        if (forUpdate) {
            return existingEvents;
        }
        return existingEvents.length === 0;
    });
}
// create event
const createEvent = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // destructure
    const { event_participants, start_time, end_time, location } = payload, rest = __rest(payload, ["event_participants", "start_time", "end_time", "location"]);
    // format date
    rest.date = new Date(rest.date);
    const start_time_date = new Date((0, date_fns_1.addMinutes)((0, date_fns_1.addHours)(`${(0, date_fns_1.format)(rest.date, 'yyyy-MM-dd')}`, Number(start_time.split(':')[0])), Number(start_time.split(':')[1])));
    const end_time_date = new Date((0, date_fns_1.addMinutes)((0, date_fns_1.addHours)(`${(0, date_fns_1.format)(rest.date, 'yyyy-MM-dd')}`, Number(end_time.split(':')[0])), Number(end_time.split(':')[1])));
    // check time slot
    const isAvailable = yield isTimeSlotAvailable(start_time_date, end_time_date, location);
    // if has then throw error
    if (!isAvailable) {
        throw new Error('Time slot is not available.');
    }
    // if not then create new
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        // create event
        const eventResult = yield transactionClient.event.create({
            data: Object.assign(Object.assign({}, rest), { start_time: start_time_date, end_time: end_time_date, location: location }),
        });
        // create participants
        yield (0, utils_1.asyncForEach)(event_participants, (participant_id) => __awaiter(void 0, void 0, void 0, function* () {
            yield transactionClient.eventParticipant.create({
                data: {
                    event_id: eventResult.id,
                    participant_id: participant_id,
                },
            });
        }));
        // return
        return transactionClient.event.findFirst({
            where: {
                id: eventResult.id,
            },
            include: {
                event_participants: true,
            },
        });
    }));
    return result;
});
// get all events
const getAllEvents = (options, filters) => __awaiter(void 0, void 0, void 0, function* () {
    // paginatin
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    // filters
    // eslint-disable-next-line no-unused-vars
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    // generate search condition
    // if (searchTerm) {
    //   andConditions.push({
    //     OR: USER_SEARCH_FIELDS.map(field => ({
    //       [field]: {
    //         contains: searchTerm,
    //         mode: 'insensitive',
    //       },
    //     })),
    //   });
    // }
    // // generate filter condition
    // if (Object.keys(filterData).length > 0) {
    //   andConditions.push({
    //     AND: Object.keys(filterData).map(key => ({
    //       [key]: {
    //         equals: (filterData as any)[key],
    //       },
    //     })),
    //   });
    // }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.event.findMany({
        // filters
        where: whereConditions,
        //pagination
        orderBy: {
            [sortBy]: sortOrder,
        },
        skip,
        take: limit,
        include: {
            event_participants: {
                select: { participant: { select: { email: true, name: true } } },
            },
        },
    });
    const total = yield prisma_1.default.event.count({ where: whereConditions });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
// get single event
const getSingleEvent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.event.findUnique({
        where: {
            id,
        },
        include: {
            event_participants: {
                select: { participant: { select: { email: true, name: true } } },
            },
        },
    });
    return result;
});
// delete single event
const deleteEvent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        // delete from event_participants
        const removeFromParticipants = yield transactionClient.eventParticipant.deleteMany({
            where: {
                event_id: id,
            },
        });
        // delete from events
        const removeFromEvents = yield transactionClient.event.delete({
            where: { id },
        });
        return removeFromEvents;
    }));
    return result;
});
// update single event
const updateEvent = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // destructure
    const { start_time, end_time, location } = payload, rest = __rest(payload, ["start_time", "end_time", "location"]);
    // format date
    if (rest.date) {
        rest.date = new Date(rest.date);
    }
    const start_time_date = new Date((0, date_fns_1.addMinutes)((0, date_fns_1.addHours)(`${(0, date_fns_1.format)(rest.date, 'yyyy-MM-dd')}`, Number(start_time.split(':')[0])), Number(start_time.split(':')[1])));
    const end_time_date = new Date((0, date_fns_1.addMinutes)((0, date_fns_1.addHours)(`${(0, date_fns_1.format)(rest.date, 'yyyy-MM-dd')}`, Number(end_time.split(':')[0])), Number(end_time.split(':')[1])));
    // check time slot
    const timeSlot = yield isTimeSlotAvailable(start_time_date, end_time_date, location, true);
    // check timeslot
    // if there is multiple event on this timeslot
    if ((timeSlot === null || timeSlot === void 0 ? void 0 : timeSlot.length) > 1) {
        throw new Error('Time slot is not available.');
    }
    else {
        // if the event is not our
        if (timeSlot[0].id !== id) {
            throw new Error('Time slot is not available.');
        }
        else {
            const updatedEvent = yield prisma_1.default.event.update({
                where: {
                    id,
                },
                data: Object.assign(Object.assign({}, rest), { start_time: start_time_date, end_time: end_time_date, location: location }),
            });
            return updatedEvent;
        }
    }
});
// add participants
const addParticipants = (id, participants) => __awaiter(void 0, void 0, void 0, function* () {
    // insert data
    yield prisma_1.default.eventParticipant.createMany({
        data: participants.map(participant_id => ({
            event_id: id,
            participant_id,
        })),
    });
    const result = yield prisma_1.default.eventParticipant.findMany({
        where: {
            event_id: id,
        },
        include: {
            event: true,
            participant: true,
        },
    });
    return result;
});
// remove participant
const removeParticipant = (id, participantId) => __awaiter(void 0, void 0, void 0, function* () {
    // delete data
    const result = yield prisma_1.default.eventParticipant.delete({
        where: {
            event_id_participant_id: {
                event_id: id,
                participant_id: participantId,
            },
        },
        include: {
            event: true,
            participant: true,
        },
    });
    return result;
});
exports.EventService = {
    createEvent,
    getAllEvents,
    getSingleEvent,
    deleteEvent,
    updateEvent,
    addParticipants,
    removeParticipant,
};
