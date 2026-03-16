import { z } from "zod";

export const TempleStatusEnum = z.enum(["active", "inactive", "pending_setup"]);
export type TempleStatus = z.infer<typeof TempleStatusEnum>;

export const AddressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
  country: z.string().default("US"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});
export type Address = z.infer<typeof AddressSchema>;

export const TempleTimingsSchema = z.object({
  day: z.enum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]),
  open_time: z.string().regex(/^\d{2}:\d{2}$/),
  close_time: z.string().regex(/^\d{2}:\d{2}$/),
  is_closed: z.boolean().default(false),
});
export type TempleTimings = z.infer<typeof TempleTimingsSchema>;

export const TempleSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  address: AddressSchema,
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  logo_url: z.string().url().optional(),
  cover_image_url: z.string().url().optional(),
  status: TempleStatusEnum.default("pending_setup"),
  timezone: z.string().default("America/New_York"),
  timings: z.array(TempleTimingsSchema).optional(),
  stripe_account_id: z.string().optional(),
  stripe_onboarding_complete: z.boolean().default(false),
  mux_stream_key: z.string().optional(),
  ein_number: z.string().optional(),
  tax_exempt_status: z.boolean().default(false),
  default_language: z.string().default("en"),
  supported_languages: z.array(z.string()).default(["en"]),
  metadata: z.record(z.unknown()).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Temple = z.infer<typeof TempleSchema>;

export const CreateTempleSchema = TempleSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  stripe_account_id: true,
  stripe_onboarding_complete: true,
  mux_stream_key: true,
});
export type CreateTemple = z.infer<typeof CreateTempleSchema>;

export const UpdateTempleSchema = CreateTempleSchema.partial();
export type UpdateTemple = z.infer<typeof UpdateTempleSchema>;

export const TempleRoleEnum = z.enum(["owner", "admin", "priest", "volunteer", "staff"]);
export type TempleRole = z.infer<typeof TempleRoleEnum>;

export const TempleMemberSchema = z.object({
  id: z.string().uuid(),
  temple_id: z.string().uuid(),
  user_id: z.string().uuid(),
  role: TempleRoleEnum,
  is_active: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type TempleMember = z.infer<typeof TempleMemberSchema>;
