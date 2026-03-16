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
import { Download, Plus, Search, UserPlus, Users } from "lucide-react";
import { formatCurrency, getInitials } from "@devalaya/shared/utils";

interface DevoteeItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gotra: string;
  familyName: string;
  totalDonations: number;
  membership: "none" | "basic" | "premium" | "lifetime";
  tags: string[];
  isActive: boolean;
}

const mockDevotees: DevoteeItem[] = [
  { id: "1", firstName: "Rajesh", lastName: "Sharma", email: "rajesh@email.com", phone: "+1-555-0101", gotra: "Bharadwaja", familyName: "Sharma Family", totalDonations: 5200, membership: "premium", tags: ["regular", "volunteer"], isActive: true },
  { id: "2", firstName: "Priya", lastName: "Patel", email: "priya@email.com", phone: "+1-555-0102", gotra: "Kashyapa", familyName: "Patel Family", totalDonations: 3100, membership: "basic", tags: ["regular"], isActive: true },
  { id: "3", firstName: "Srinivas", lastName: "Rao", email: "srinivas@email.com", phone: "+1-555-0103", gotra: "Vatsa", familyName: "Rao Family", totalDonations: 12500, membership: "lifetime", tags: ["sponsor", "board_member"], isActive: true },
  { id: "4", firstName: "Anita", lastName: "Gupta", email: "anita@email.com", phone: "+1-555-0104", gotra: "Atri", familyName: "Gupta Family", totalDonations: 800, membership: "none", tags: ["new"], isActive: true },
  { id: "5", firstName: "Venkatesh", lastName: "Iyer", email: "venkat@email.com", phone: "+1-555-0105", gotra: "Vishwamitra", familyName: "Iyer Family", totalDonations: 7800, membership: "premium", tags: ["regular", "priest_committee"], isActive: true },
];

const membershipColors: Record<string, "default" | "secondary" | "saffron" | "outline"> = {
  none: "outline",
  basic: "secondary",
  premium: "saffron",
  lifetime: "default",
};

export default function DevoteesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [devotees] = useState<DevoteeItem[]>(mockDevotees);

  const filteredDevotees = devotees.filter(
    (d) =>
      `${d.firstName} ${d.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.gotra.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Devotees</h1>
          <p className="text-muted-foreground">
            Manage devotee profiles, families, and memberships.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <UserPlus className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="temple">
            <Plus className="mr-2 h-4 w-4" />
            Add Devotee
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devotees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{devotees.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {devotees.filter((d) => d.membership !== "none").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Families</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(devotees.map((d) => d.familyName)).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lifetime Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {devotees.filter((d) => d.membership === "lifetime").length}
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
                placeholder="Search by name, email, or gotra..."
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
                <TableHead>Devotee</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Gotra</TableHead>
                <TableHead>Family</TableHead>
                <TableHead>Membership</TableHead>
                <TableHead>Total Donations</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevotees.map((devotee) => (
                <TableRow key={devotee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-temple-100 text-xs font-medium text-temple-600">
                        {getInitials(devotee.firstName, devotee.lastName)}
                      </div>
                      <span className="font-medium">
                        {devotee.firstName} {devotee.lastName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{devotee.email}</p>
                      <p className="text-xs text-muted-foreground">{devotee.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>{devotee.gotra}</TableCell>
                  <TableCell>{devotee.familyName}</TableCell>
                  <TableCell>
                    <Badge variant={membershipColors[devotee.membership]} className="capitalize">
                      {devotee.membership}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(devotee.totalDonations)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {devotee.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs capitalize">
                          {tag.replace(/_/g, " ")}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View
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
