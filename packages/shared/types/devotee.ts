import { z } from "zod";

export const CommunicationPreferenceSchema = z.object({
  email: z.boolean().default(true),
  sms: z.boolean().default(false),
  push: z.boolean().default(true),
  whatsapp: z.boolean().default(false),
});
export type CommunicationPreference = z.infer<typeof CommunicationPreferenceSchema>;

export const DevoteeSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid().optional(),
  temple_id: z.string().uuid(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
  gotra: z.string().optional(),
  nakshatra: z.string().optional(),
  rashi: z.string().optional(),
  family_id: z.string().uuid().optional(),
  address: z
    .object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
      country: z.string().default("US"),
    })
    .optional(),
  preferred_language: z.string().default("en"),
  communication_preferences: CommunicationPreferenceSchema.default({
    email: true,
    sms: false,
    push: true,
    whatsapp: false,
  }),
  profile_image_url: z.string().url().optional(),
  is_active: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional(),
  total_donations: z.number().nonnegative().default(0),
  last_visit_date: z.string().optional(),
  membership_type: z
    .enum(["none", "basic", "premium", "lifetime"])
    .default("none"),
  membership_expiry: z.string().optional(),
  stripe_customer_id: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Devotee = z.infer<typeof DevoteeSchema>;

export const CreateDevoteeSchema = DevoteeSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  total_donations: true,
  stripe_customer_id: true,
});
export type CreateDevotee = z.infer<typeof CreateDevoteeSchema>;

export const UpdateDevoteeSchema = CreateDevoteeSchema.partial();
export type UpdateDevotee = z.infer<typeof UpdateDevoteeSchema>;

export const FamilySchema = z.object({
  id: z.string().uuid(),
  temple_id: z.string().uuid(),
  family_name: z.string().min(1),
  head_devotee_id: z.string().uuid().optional(),
  address: z
    .object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
      country: z.string().default("US"),
    })
    .optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  gotra: z.string().optional(),
  notes: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Family = z.infer<typeof FamilySchema>;

export const CreateFamilySchema = FamilySchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export type CreateFamily = z.infer<typeof CreateFamilySchema>;
