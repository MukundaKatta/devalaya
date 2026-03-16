"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Heart, Plus, Users } from "lucide-react";

const mockVolunteers = [
  { id: "1", name: "Anita Desai", skills: ["cooking", "decoration"], status: "active", totalHours: 128, upcomingAssignments: 2 },
  { id: "2", name: "Karthik Nair", skills: ["IT support", "audio/video"], status: "active", totalHours: 86, upcomingAssignments: 1 },
  { id: "3", name: "Pooja Mishra", skills: ["teaching", "event planning"], status: "active", totalHours: 64, upcomingAssignments: 3 },
  { id: "4", name: "Deepak Singh", skills: ["maintenance", "security"], status: "pending_approval", totalHours: 0, upcomingAssignments: 0 },
  { id: "5", name: "Kavitha Reddy", skills: ["cooking", "cleaning"], status: "active", totalHours: 215, upcomingAssignments: 1 },
];

export default function VolunteersPage() {
  const [volunteers] = useState(mockVolunteers);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Volunteers</h1>
          <p className="text-muted-foreground">Manage volunteer coordination and assignments.</p>
        </div>
        <Button variant="temple"><Plus className="mr-2 h-4 w-4" />Add Volunteer</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Volunteers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{volunteers.filter((v) => v.status === "active").length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{volunteers.filter((v) => v.status === "pending_approval").length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{volunteers.reduce((s, v) => s + v.totalHours, 0)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Assignments</CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{volunteers.reduce((s, v) => s + v.upcomingAssignments, 0)}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Upcoming</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteers.map((vol) => (
                <TableRow key={vol.id}>
                  <TableCell className="font-medium">{vol.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {vol.skills.map((s) => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={vol.status === "active" ? "success" : "warning"} className="capitalize">
                      {vol.status.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>{vol.totalHours}h</TableCell>
                  <TableCell>{vol.upcomingAssignments}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {vol.status === "pending_approval" && <Button variant="temple" size="sm">Approve</Button>}
                      <Button variant="ghost" size="sm">View</Button>
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
