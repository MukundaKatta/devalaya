"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Radio, Video, Eye } from "lucide-react";

interface StreamItem {
  id: string;
  title: string;
  status: "idle" | "live" | "ended";
  scheduledStart: string | null;
  viewerCount: number;
  peakViewers: number;
  isRecorded: boolean;
}

const mockStreams: StreamItem[] = [
  { id: "1", title: "Evening Sandhya Aarti", status: "live", scheduledStart: null, viewerCount: 142, peakViewers: 198, isRecorded: true },
  { id: "2", title: "Morning Abhishekam", status: "idle", scheduledStart: "2026-03-17T07:00:00", viewerCount: 0, peakViewers: 0, isRecorded: true },
  { id: "3", title: "Saturday Hanuman Chalisa", status: "idle", scheduledStart: "2026-03-21T18:00:00", viewerCount: 0, peakViewers: 0, isRecorded: true },
  { id: "4", title: "Shivratri Special Abhishekam", status: "ended", scheduledStart: null, viewerCount: 0, peakViewers: 523, isRecorded: true },
];

export default function LivestreamPage() {
  const [streams] = useState<StreamItem[]>(mockStreams);
  const liveStream = streams.find((s) => s.status === "live");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Livestream</h1>
          <p className="text-muted-foreground">
            Manage live broadcasts of pujas and temple events via Mux.
          </p>
        </div>
        <Button variant="temple">
          <Plus className="mr-2 h-4 w-4" />
          Schedule Stream
        </Button>
      </div>

      {liveStream && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
                  </span>
                  <Badge variant="destructive">LIVE</Badge>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{liveStream.title}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {liveStream.viewerCount} viewers
                    (peak: {liveStream.peakViewers})
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">View Stream</Button>
                <Button variant="destructive">End Stream</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Streams</CardTitle>
            <Radio className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {streams.filter((s) => s.status === "live").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {streams.filter((s) => s.status === "idle" && s.scheduledStart).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recordings</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {streams.filter((s) => s.status === "ended" && s.isRecorded).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Streams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {streams
                .filter((s) => s.status === "idle" && s.scheduledStart)
                .map((stream) => (
                  <div key={stream.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">{stream.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Intl.DateTimeFormat("en-US", {
                          weekday: "short", month: "short", day: "numeric",
                          hour: "numeric", minute: "2-digit",
                        }).format(new Date(stream.scheduledStart!))}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="temple" size="sm">Go Live</Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Past Recordings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {streams
                .filter((s) => s.status === "ended")
                .map((stream) => (
                  <div key={stream.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">{stream.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Peak viewers: {stream.peakViewers}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Video className="mr-2 h-3 w-3" />
                      Watch
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
