import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";
import { createLiveStream, getPlaybackUrl, deleteLiveStream } from "@/lib/mux";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { temple_id, title, description, scheduled_start, event_id, is_public, chat_enabled } = body;

    // Create Mux live stream
    const muxStream = await createLiveStream({
      playback_policy: is_public ? "public" : "signed",
      new_asset_settings: { playback_policy: is_public ? "public" : "signed" },
    });

    const muxData = muxStream.data;
    const playbackId = muxData.playback_ids?.[0]?.id;

    const adminClient = await createSupabaseAdminClient();
    const { data: livestream, error } = await adminClient
      .from("livestreams")
      .insert({
        temple_id,
        title,
        description,
        status: "idle",
        mux_live_stream_id: muxData.id,
        mux_playback_id: playbackId,
        mux_stream_key: muxData.stream_key,
        rtmp_url: "rtmp://global-live.mux.com:5222/app",
        playback_url: playbackId ? getPlaybackUrl(playbackId) : null,
        scheduled_start,
        event_id,
        is_public: is_public ?? true,
        chat_enabled: chat_enabled ?? true,
        is_recorded: true,
      })
      .select()
      .single();

    if (error) {
      // Clean up Mux stream if DB insert fails
      await deleteLiveStream(muxData.id).catch(() => {});
      return NextResponse.json({ error: "Failed to create livestream", details: error }, { status: 500 });
    }

    return NextResponse.json({ livestream });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const templeId = searchParams.get("temple_id");
    const status = searchParams.get("status");

    let query = supabase
      .from("livestreams")
      .select("*")
      .order("created_at", { ascending: false });

    if (templeId) query = query.eq("temple_id", templeId);
    if (status) query = query.eq("status", status);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ livestreams: data });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
