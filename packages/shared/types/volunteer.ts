import { z } from "zod";

export const VolunteerStatusEnum = z.enum([
  "active",
  "inactive",
  "pending_approval",
]);
export type VolunteerStatus = z.infer<typeof VolunteerStatusEnum>;

export const VolunteerSchema = z.object({
  id: z.string().uuid(),
  temple_id: z.string().uuid(),
  devotee_id: z.string().uuid(),
  status: VolunteerStatusEnum.default("pending_approval"),
  skills: z.array(z.string()).default([]),
  availability: z
    .array(
      z.object({
        day: z.enum([
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ]),
        start_time: z.string().regex(/^\d{2}:\d{2}$/),
        end_time: z.string().regex(/^\d{2}:\d{2}$/),
      })
    )
    .default([]),
  total_hours: z.number().nonnegative().default(0),
  notes: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  background_check_status: z
    .enum(["not_required", "pending", "cleared", "failed"])
    .default("not_required"),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Volunteer = z.infer<typeof VolunteerSchema>;

export const CreateVolunteerSchema = VolunteerSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  total_hours: true,
});
export type CreateVolunteer = z.infer<typeof CreateVolunteerSchema>;

export const VolunteerAssignmentSchema = z.object({
  id: z.string().uuid(),
  volunteer_id: z.string().uuid(),
  event_id: z.string().uuid(),
  temple_id: z.string().uuid(),
  role: z.string().min(1),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  check_in_time: z.string().datetime().optional(),
  check_out_time: z.string().datetime().optional(),
  hours_logged: z.number().nonnegative().default(0),
  status: z.enum(["assigned", "confirmed", "completed", "no_show"]).default("assigned"),
  notes: z.string().optional(),
  created_at: z.string().datetime(),
});
export type VolunteerAssignment = z.infer<typeof VolunteerAssignmentSchema>;
