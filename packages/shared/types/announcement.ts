import { z } from "zod";

export const AnnouncementChannelEnum = z.enum([
  "email",
  "sms",
  "push",
  "in_app",
  "whatsapp",
]);
export type AnnouncementChannel = z.infer<typeof AnnouncementChannelEnum>;

export const AnnouncementPriorityEnum = z.enum(["low", "normal", "high", "urgent"]);
export type AnnouncementPriority = z.infer<typeof AnnouncementPriorityEnum>;

export const AnnouncementSchema = z.object({
  id: z.string().uuid(),
  temple_id: z.string().uuid(),
  title: z.string().min(1),
  body: z.string().min(1),
  priority: AnnouncementPriorityEnum.default("normal"),
  channels: z.array(AnnouncementChannelEnum).default(["in_app"]),
  target_audience: z
    .enum(["all", "devotees", "volunteers", "priests", "families", "custom"])
    .default("all"),
  target_tags: z.array(z.string()).default([]),
  scheduled_at: z.string().datetime().optional(),
  sent_at: z.string().datetime().optional(),
  is_draft: z.boolean().default(true),
  translations: z
    .record(
      z.object({
        title: z.string(),
        body: z.string(),
      })
    )
    .default({}),
  image_url: z.string().url().optional(),
  action_url: z.string().optional(),
  delivery_stats: z
    .object({
      total_recipients: z.number().int().nonnegative().default(0),
      delivered: z.number().int().nonnegative().default(0),
      opened: z.number().int().nonnegative().default(0),
      clicked: z.number().int().nonnegative().default(0),
      failed: z.number().int().nonnegative().default(0),
    })
    .default({
      total_recipients: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      failed: 0,
    }),
  created_by: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Announcement = z.infer<typeof AnnouncementSchema>;

export const CreateAnnouncementSchema = AnnouncementSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  sent_at: true,
  delivery_stats: true,
});
export type CreateAnnouncement = z.infer<typeof CreateAnnouncementSchema>;
