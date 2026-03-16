import { z } from "zod";

export const EventTypeEnum = z.enum([
  "daily_puja",
  "weekly_puja",
  "festival",
  "cultural",
  "educational",
  "youth",
  "volunteer",
  "fundraiser",
  "community",
  "other",
]);
export type EventType = z.infer<typeof EventTypeEnum>;

export const EventStatusEnum = z.enum([
  "draft",
  "published",
  "cancelled",
  "completed",
]);
export type EventStatus = z.infer<typeof EventStatusEnum>;

export const EventSchema = z.object({
  id: z.string().uuid(),
  temple_id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  type: EventTypeEnum,
  status: EventStatusEnum.default("draft"),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  is_all_day: z.boolean().default(false),
  is_recurring: z.boolean().default(false),
  recurrence_rule: z.string().optional(),
  location: z.string().optional(),
  is_virtual: z.boolean().default(false),
  virtual_link: z.string().url().optional(),
  livestream_id: z.string().uuid().optional(),
  image_url: z.string().url().optional(),
  max_attendees: z.number().int().positive().optional(),
  current_rsvps: z.number().int().nonnegative().default(0),
  registration_required: z.boolean().default(false),
  registration_fee: z.number().nonnegative().default(0),
  organizer_id: z.string().uuid().optional(),
  volunteer_slots: z.number().int().nonnegative().default(0),
  volunteer_filled: z.number().int().nonnegative().default(0),
  tags: z.array(z.string()).default([]),
  translations: z
    .record(
      z.object({
        title: z.string(),
        description: z.string().optional(),
      })
    )
    .default({}),
  google_calendar_event_id: z.string().optional(),
  send_reminders: z.boolean().default(true),
  reminder_hours_before: z.array(z.number()).default([24, 1]),
  metadata: z.record(z.unknown()).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Event = z.infer<typeof EventSchema>;

export const CreateEventSchema = EventSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  current_rsvps: true,
  volunteer_filled: true,
  google_calendar_event_id: true,
});
export type CreateEvent = z.infer<typeof CreateEventSchema>;

export const UpdateEventSchema = CreateEventSchema.partial();
export type UpdateEvent = z.infer<typeof UpdateEventSchema>;

export const RSVPStatusEnum = z.enum([
  "attending",
  "maybe",
  "not_attending",
  "waitlisted",
]);
export type RSVPStatus = z.infer<typeof RSVPStatusEnum>;

export const EventRSVPSchema = z.object({
  id: z.string().uuid(),
  event_id: z.string().uuid(),
  devotee_id: z.string().uuid(),
  status: RSVPStatusEnum.default("attending"),
  guest_count: z.number().int().nonnegative().default(0),
  notes: z.string().optional(),
  payment_intent_id: z.string().optional(),
  payment_status: z
    .enum(["not_required", "pending", "paid", "refunded"])
    .default("not_required"),
  check_in_time: z.string().datetime().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type EventRSVP = z.infer<typeof EventRSVPSchema>;
