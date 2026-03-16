import { z } from "zod";

export const LivestreamStatusEnum = z.enum([
  "idle",
  "preparing",
  "live",
  "ended",
  "errored",
]);
export type LivestreamStatus = z.infer<typeof LivestreamStatusEnum>;

export const LivestreamSchema = z.object({
  id: z.string().uuid(),
  temple_id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  status: LivestreamStatusEnum.default("idle"),
  mux_live_stream_id: z.string().optional(),
  mux_playback_id: z.string().optional(),
  mux_stream_key: z.string().optional(),
  mux_asset_id: z.string().optional(),
  rtmp_url: z.string().optional(),
  playback_url: z.string().optional(),
  thumbnail_url: z.string().url().optional(),
  scheduled_start: z.string().datetime().optional(),
  actual_start: z.string().datetime().optional(),
  actual_end: z.string().datetime().optional(),
  duration_seconds: z.number().int().nonnegative().optional(),
  viewer_count: z.number().int().nonnegative().default(0),
  peak_viewers: z.number().int().nonnegative().default(0),
  is_recorded: z.boolean().default(true),
  recording_url: z.string().url().optional(),
  event_id: z.string().uuid().optional(),
  is_public: z.boolean().default(true),
  chat_enabled: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Livestream = z.infer<typeof LivestreamSchema>;

export const CreateLivestreamSchema = LivestreamSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  mux_live_stream_id: true,
  mux_playback_id: true,
  mux_stream_key: true,
  mux_asset_id: true,
  rtmp_url: true,
  playback_url: true,
  actual_start: true,
  actual_end: true,
  duration_seconds: true,
  viewer_count: true,
  peak_viewers: true,
  recording_url: true,
});
export type CreateLivestream = z.infer<typeof CreateLivestreamSchema>;
