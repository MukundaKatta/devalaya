"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Mail, Megaphone, MessageSquare, Plus, Search, Send } from "lucide-react";

interface AnnouncementItem {
  id: string;
  title: string;
  channels: string[];
  audience: string;
  priority: "low" | "normal" | "high" | "urgent";
  isDraft: boolean;
  sentAt: string | null;
  stats: { delivered: number; opened: number };
}

const mockAnnouncements: AnnouncementItem[] = [
  { id: "1", title: "Ram Navami Schedule & Volunteer Sign-up", channels: ["email", "push", "sms"], audience: "all", priority: "high", isDraft: false, sentAt: "2026-03-15T10:00:00", stats: { delivered: 892, opened: 645 } },
  { id: "2", title: "Weekly Newsletter - March 2nd Week", channels: ["email"], audience: "devotees", priority: "normal", isDraft: false, sentAt: "2026-03-14T09:00:00", stats: { delivered: 1024, opened: 412 } },
  { id: "3", title: "Temple Closed for Maintenance - March 25", channels: ["email", "sms", "push"], audience: "all", priority: "urgent", isDraft: true, sentAt: null, stats: { delivered: 0, opened: 0 } },
  { id: "4", title: "Annual Gala Dinner Invitation", channels: ["email"], audience: "families", priority: "normal", isDraft: true, sentAt: null, stats: { delivered: 0, opened: 0 } },
];

const priorityColors: Record<string, "default" | "secondary" | "warning" | "destructive"> = {
  low: "secondary",
  normal: "default",
  high: "warning",
  urgent: "destructive",
};

export default function CommunicationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [announcements] = useState(mockAnnouncements);

  const filtered = announcements.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Communications</h1>
          <p className="text-muted-foreground">
            Send announcements via email, SMS, and push notifications.
          </p>
        </div>
        <Button variant="temple">
          <Plus className="mr-2 h-4 w-4" />
          New Announcement
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements.filter((a) => !a.isDraft).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements.filter((a) => a.isDraft).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">62%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS Sent</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">456</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search announcements..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Channels</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stats</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {item.channels.map((ch) => (
                        <Badge key={ch} variant="outline" className="text-xs capitalize">{ch}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{item.audience}</TableCell>
                  <TableCell>
                    <Badge variant={priorityColors[item.priority]} className="capitalize">{item.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.isDraft ? "warning" : "success"}>
                      {item.isDraft ? "Draft" : "Sent"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {!item.isDraft ? (
                      <span className="text-sm">{item.stats.opened}/{item.stats.delivered} opened</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">--</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {item.isDraft && <Button variant="temple" size="sm">Send</Button>}
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
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
