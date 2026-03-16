"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Plus, Search } from "lucide-react";

interface EventItem {
  id: string;
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  status: "draft" | "published" | "cancelled" | "completed";
  rsvps: number;
  maxAttendees: number | null;
}

const mockEvents: EventItem[] = [
  {
    id: "1",
    title: "Ram Navami Celebrations",
    type: "festival",
    startDate: "2026-04-14T08:00:00",
    endDate: "2026-04-14T20:00:00",
    status: "published",
    rsvps: 245,
    maxAttendees: 500,
  },
  {
    id: "2",
    title: "Hanuman Jayanti",
    type: "festival",
    startDate: "2026-04-22T06:00:00",
    endDate: "2026-04-22T21:00:00",
    status: "draft",
    rsvps: 0,
    maxAttendees: 300,
  },
  {
    id: "3",
    title: "Youth Sanskrit Workshop",
    type: "educational",
    startDate: "2026-03-22T10:00:00",
    endDate: "2026-03-22T13:00:00",
    status: "published",
    rsvps: 18,
    maxAttendees: 30,
  },
  {
    id: "4",
    title: "Weekly Satsang",
    type: "weekly_puja",
    startDate: "2026-03-21T18:00:00",
    endDate: "2026-03-21T20:00:00",
    status: "published",
    rsvps: 42,
    maxAttendees: null,
  },
  {
    id: "5",
    title: "Community Diwali Dinner",
    type: "community",
    startDate: "2026-10-20T17:00:00",
    endDate: "2026-10-20T22:00:00",
    status: "draft",
    rsvps: 0,
    maxAttendees: 200,
  },
];

const statusColors: Record<string, "default" | "success" | "warning" | "destructive" | "outline"> = {
  draft: "warning",
  published: "success",
  cancelled: "destructive",
  completed: "outline",
};

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [events] = useState<EventItem[]>(mockEvents);

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">
            Manage pujas, festivals, and temple events.
          </p>
        </div>
        <Button variant="temple">
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter((e) => e.status === "published").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total RSVPs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.reduce((sum, e) => sum + e.rsvps, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter((e) => e.status === "draft").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>RSVPs</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {event.type.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    }).format(new Date(event.startDate))}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[event.status]}>
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {event.rsvps}
                    {event.maxAttendees ? ` / ${event.maxAttendees}` : ""}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
