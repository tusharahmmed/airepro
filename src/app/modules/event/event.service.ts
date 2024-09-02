/* eslint-disable no-unused-vars */
import { Event, Prisma } from '@prisma/client';
import { addHours, addMinutes, format } from 'date-fns';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { asyncForEach } from '../../../shared/utils';
import { IEventFilters, IEventPayload } from './event.interface';

// check slot available function
async function isTimeSlotAvailable(
  startTime: string,
  endTime: string,
  location: string,
  forUpdate = false
) {
  const existingEvents = await prisma.event.findMany({
    where: {
      location: location as any,
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
}

// create event
const createEvent = async (payload: IEventPayload) => {
  // destructure
  const { event_participants, start_time, end_time, location, ...rest } =
    payload;

  // format date
  rest.date = new Date(rest.date) as any;

  const start_time_date = new Date(
    addMinutes(
      addHours(
        `${format(rest.date, 'yyyy-MM-dd')}`,
        Number(start_time.split(':')[0])
      ),
      Number(start_time.split(':')[1])
    )
  );

  const end_time_date = new Date(
    addMinutes(
      addHours(
        `${format(rest.date, 'yyyy-MM-dd')}`,
        Number(end_time.split(':')[0])
      ),
      Number(end_time.split(':')[1])
    )
  );

  // check time slot
  const isAvailable = await isTimeSlotAvailable(
    start_time_date as any,
    end_time_date as any,
    location as any
  );

  // if has then throw error
  if (!isAvailable) {
    throw new Error('Time slot is not available.');
  }

  // if not then create new
  const result = await prisma.$transaction(async transactionClient => {
    // create event
    const eventResult = await transactionClient.event.create({
      data: {
        ...(rest as Prisma.EventCreateInput),
        start_time: start_time_date,
        end_time: end_time_date,
        location: location as any,
      },
    });

    // create participants
    await asyncForEach(event_participants, async (participant_id: string) => {
      await transactionClient.eventParticipant.create({
        data: {
          event_id: eventResult.id,
          participant_id: participant_id,
        },
      });
    });

    // return
    return transactionClient.event.findFirst({
      where: {
        id: eventResult.id,
      },
      include: {
        event_participants: true,
      },
    });
  });
  return result;
};

// get all events
const getAllEvents = async (
  options: IPaginationOptions,
  filters: IEventFilters
): Promise<IGenericResponse<any>> => {
  // paginatin
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  // filters
  // eslint-disable-next-line no-unused-vars
  const { searchTerm, ...filterData } = filters;

  const andConditions: any = [];

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

  const whereConditions: Prisma.EventWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.event.findMany({
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

  const total = await prisma.event.count({ where: whereConditions });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

// get single event
const getSingleEvent = async (id: string) => {
  const result = await prisma.event.findUnique({
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
};

// delete single event
const deleteEvent = async (id: string) => {
  const result = await prisma.$transaction(async transactionClient => {
    // delete from event_participants
    const removeFromParticipants =
      await transactionClient.eventParticipant.deleteMany({
        where: {
          event_id: id,
        },
      });

    // delete from events
    const removeFromEvents = await transactionClient.event.delete({
      where: { id },
    });
    return removeFromEvents;
  });

  return result;
};

// update single event
const updateEvent = async (id: string, payload: Event | any) => {
  // destructure
  const { start_time, end_time, location, ...rest } = payload;

  // format date
  if (rest.date) {
    rest.date = new Date(rest.date) as any;
  }

  const start_time_date = new Date(
    addMinutes(
      addHours(
        `${format(rest.date, 'yyyy-MM-dd')}`,
        Number(start_time.split(':')[0])
      ),
      Number(start_time.split(':')[1])
    )
  );

  const end_time_date = new Date(
    addMinutes(
      addHours(
        `${format(rest.date, 'yyyy-MM-dd')}`,
        Number(end_time.split(':')[0])
      ),
      Number(end_time.split(':')[1])
    )
  );

  // check time slot
  const timeSlot: any = await isTimeSlotAvailable(
    start_time_date as any,
    end_time_date as any,
    location as any,
    true
  );

  // check timeslot

  // if there is multiple event on this timeslot
  if (timeSlot?.length > 1) {
    throw new Error('Time slot is not available.');
  } else {
    // if the event is not our
    if (timeSlot[0].id !== id) {
      throw new Error('Time slot is not available.');
    } else {
      const updatedEvent = await prisma.event.update({
        where: {
          id,
        },
        data: {
          ...(rest as Prisma.EventCreateInput),
          start_time: start_time_date,
          end_time: end_time_date,
          location: location as any,
        },
      });

      return updatedEvent;
    }
  }
};

// add participants
const addParticipants = async (id: string, participants: string[]) => {
  // insert data
  await prisma.eventParticipant.createMany({
    data: participants.map(participant_id => ({
      event_id: id,
      participant_id,
    })),
  });

  const result = await prisma.eventParticipant.findMany({
    where: {
      event_id: id,
    },
    include: {
      event: true,
      participant: true,
    },
  });
  return result;
};

// remove participant
const removeParticipant = async (id: string, participantId: string) => {
  // delete data
  const result = await prisma.eventParticipant.delete({
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
};

export const EventService = {
  createEvent,
  getAllEvents,
  getSingleEvent,
  deleteEvent,
  updateEvent,
  addParticipants,
  removeParticipant,
};
