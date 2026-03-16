import { z } from "zod";

export const PriestSpecializationEnum = z.enum([
  "vedic",
  "agamic",
  "tantric",
  "puranic",
  "general",
]);
export type PriestSpecialization = z.infer<typeof PriestSpecializationEnum>;

export const PriestSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid().optional(),
  temple_id: z.string().uuid(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  specializations: z.array(PriestSpecializationEnum).default(["general"]),
  languages: z.array(z.string()).default(["en"]),
  bio: z.string().optional(),
  profile_image_url: z.string().url().optional(),
  is_active: z.boolean().default(true),
  is_head_priest: z.boolean().default(false),
  pujas_performed: z.array(z.string().uuid()).default([]),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Priest = z.infer<typeof PriestSchema>;

export const CreatePriestSchema = PriestSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export type CreatePriest = z.infer<typeof CreatePriestSchema>;

export const UpdatePriestSchema = CreatePriestSchema.partial();
export type UpdatePriest = z.infer<typeof UpdatePriestSchema>;

export const AvailabilitySlotSchema = z.object({
  id: z.string().uuid(),
  priest_id: z.string().uuid(),
  temple_id: z.string().uuid(),
  date: z.string(),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}$/),
  is_available: z.boolean().default(true),
  is_booked: z.boolean().default(false),
  booking_id: z.string().uuid().optional(),
  notes: z.string().optional(),
  created_at: z.string().datetime(),
});
export type AvailabilitySlot = z.infer<typeof AvailabilitySlotSchema>;

export const CreateAvailabilitySlotSchema = AvailabilitySlotSchema.omit({
  id: true,
  created_at: true,
  is_booked: true,
  booking_id: true,
});
export type CreateAvailabilitySlot = z.infer<typeof CreateAvailabilitySlotSchema>;
