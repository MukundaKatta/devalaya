import { z } from "zod";

export const PujaCategoryEnum = z.enum([
  "daily",
  "weekly",
  "special",
  "festival",
  "personal",
  "homa",
  "abhishekam",
  "archana",
  "other",
]);
export type PujaCategory = z.infer<typeof PujaCategoryEnum>;

export const PujaSchema = z.object({
  id: z.string().uuid(),
  temple_id: z.string().uuid(),
  name: z.string().min(1),
  name_sanskrit: z.string().optional(),
  description: z.string().optional(),
  category: PujaCategoryEnum,
  deity: z.string().optional(),
  duration_minutes: z.number().int().positive(),
  base_price: z.number().nonnegative(),
  max_devotees: z.number().int().positive().optional(),
  requires_priest: z.boolean().default(true),
  is_bookable: z.boolean().default(true),
  is_active: z.boolean().default(true),
  image_url: z.string().url().optional(),
  instructions: z.string().optional(),
  items_provided: z.array(z.string()).default([]),
  items_to_bring: z.array(z.string()).default([]),
  available_days: z
    .array(
      z.enum([
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ])
    )
    .default([
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ]),
  available_time_slots: z
    .array(
      z.object({
        start_time: z.string().regex(/^\d{2}:\d{2}$/),
        end_time: z.string().regex(/^\d{2}:\d{2}$/),
      })
    )
    .default([]),
  translations: z
    .record(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        instructions: z.string().optional(),
      })
    )
    .default({}),
  metadata: z.record(z.unknown()).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Puja = z.infer<typeof PujaSchema>;

export const CreatePujaSchema = PujaSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export type CreatePuja = z.infer<typeof CreatePujaSchema>;

export const UpdatePujaSchema = CreatePujaSchema.partial();
export type UpdatePuja = z.infer<typeof UpdatePujaSchema>;

export const BookingStatusEnum = z.enum([
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
  "no_show",
]);
export type BookingStatus = z.infer<typeof BookingStatusEnum>;

export const PujaBookingSchema = z.object({
  id: z.string().uuid(),
  temple_id: z.string().uuid(),
  puja_id: z.string().uuid(),
  devotee_id: z.string().uuid(),
  priest_id: z.string().uuid().optional(),
  booking_date: z.string(),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}$/),
  status: BookingStatusEnum.default("pending"),
  amount: z.number().nonnegative(),
  donation_amount: z.number().nonnegative().default(0),
  total_amount: z.number().nonnegative(),
  payment_intent_id: z.string().optional(),
  payment_status: z
    .enum(["pending", "paid", "refunded", "failed"])
    .default("pending"),
  devotee_names: z.array(z.string()).default([]),
  gotra: z.string().optional(),
  nakshatra: z.string().optional(),
  special_requests: z.string().optional(),
  cancellation_reason: z.string().optional(),
  confirmation_sent: z.boolean().default(false),
  reminder_sent: z.boolean().default(false),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type PujaBooking = z.infer<typeof PujaBookingSchema>;

export const CreatePujaBookingSchema = PujaBookingSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  confirmation_sent: true,
  reminder_sent: true,
});
export type CreatePujaBooking = z.infer<typeof CreatePujaBookingSchema>;
