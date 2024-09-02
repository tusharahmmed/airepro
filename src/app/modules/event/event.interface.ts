import { z } from 'zod';
import { createEvent } from './event.validation';

export type IEventFilters = {
  searchTerm?: string;
  // role?: string;
};

// Create a TypeScript type from the schema
export type IEventPayload = z.infer<typeof createEvent.shape.body>;
