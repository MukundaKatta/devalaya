const MUX_TOKEN_ID = process.env.MUX_TOKEN_ID!;
const MUX_TOKEN_SECRET = process.env.MUX_TOKEN_SECRET!;
const MUX_BASE_URL = "https://api.mux.com";

function getAuthHeader(): string {
  return `Basic ${Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString("base64")}`;
}

async function muxRequest(
  path: string,
  method: string = "GET",
  body?: Record<string, unknown>
): Promise<unknown> {
  const response = await fetch(`${MUX_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Mux API error: ${response.status} - ${error}`);
  }

  return response.json();
}

export interface MuxLiveStream {
  id: string;
  stream_key: string;
  status: string;
  playback_ids: Array<{ id: string; policy: string }>;
  reconnect_window: number;
  created_at: string;
}

export async function createLiveStream(options?: {
  playback_policy?: "public" | "signed";
  reconnect_window?: number;
  new_asset_settings?: { playback_policy: string };
}): Promise<{ data: MuxLiveStream }> {
  return muxRequest("/video/v1/live-streams", "POST", {
    playback_policy: [options?.playback_policy || "public"],
    reconnect_window: options?.reconnect_window || 60,
    new_asset_settings: options?.new_asset_settings || {
      playback_policy: ["public"],
    },
  }) as Promise<{ data: MuxLiveStream }>;
}

export async function getLiveStream(
  streamId: string
): Promise<{ data: MuxLiveStream }> {
  return muxRequest(`/video/v1/live-streams/${streamId}`) as Promise<{
    data: MuxLiveStream;
  }>;
}

export async function deleteLiveStream(streamId: string): Promise<void> {
  await muxRequest(`/video/v1/live-streams/${streamId}`, "DELETE");
}

export async function disableLiveStream(streamId: string): Promise<void> {
  await muxRequest(
    `/video/v1/live-streams/${streamId}/disable`,
    "PUT"
  );
}

export async function enableLiveStream(streamId: string): Promise<void> {
  await muxRequest(
    `/video/v1/live-streams/${streamId}/enable`,
    "PUT"
  );
}

export function getPlaybackUrl(playbackId: string): string {
  return `https://stream.mux.com/${playbackId}.m3u8`;
}

export function getThumbnailUrl(
  playbackId: string,
  options?: { width?: number; height?: number; time?: number }
): string {
  const params = new URLSearchParams();
  if (options?.width) params.set("width", String(options.width));
  if (options?.height) params.set("height", String(options.height));
  if (options?.time) params.set("time", String(options.time));
  const queryStr = params.toString();
  return `https://image.mux.com/${playbackId}/thumbnail.jpg${queryStr ? `?${queryStr}` : ""}`;
}
