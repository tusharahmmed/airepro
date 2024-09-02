import { Location } from '@prisma/client';
import { z } from 'zod';

export const createEvent = z.object({
  body: z.object({
    name: z.string({ required_error: 'name is required' }),
    description: z.string({ required_error: 'Description is required' }),
    date: z.string({ required_error: 'Date is required' }),
    start_time: z.string({ required_error: 'Start time is required' }),
    end_time: z.string({ required_error: 'End time is required' }),
    location: z.enum([...Object.values(Location)] as [string, ...string[]]),
    event_participants: z
      .string({ required_error: 'Participants is required' })
      .array()
      .nonempty({ message: "participant can't be empty!" })
      .min(2, { message: 'Minimum 2 participant are required' }),
  }),
});
export const updateEvent = z.object({
  body: z.object({
    name: z.string({ required_error: 'name is required' }).optional(),
    description: z
      .string({ required_error: 'Description is required' })
      .optional(),
    date: z.string({ required_error: 'Date is required' }),
    start_time: z.string({ required_error: 'Start time is required' }),
    end_time: z.string({ required_error: 'End time is required' }),
    location: z.enum([...Object.values(Location)] as [string, ...string[]]),
  }),
});

const addParticipants = z.object({
  body: z.object({
    event_participants: z
      .string({ required_error: 'Participants is required' })
      .array()
      .nonempty({ message: "participant can't be empty!" }),
  }),
});
export const EventValidation = { createEvent, updateEvent, addParticipants };
