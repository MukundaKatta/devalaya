"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, UserCheck } from "lucide-react";
import { getInitials } from "@devalaya/shared/utils";

interface PriestItem {
  id: string;
  firstName: string;
  lastName: string;
  specializations: string[];
  languages: string[];
  isHeadPriest: boolean;
  isActive: boolean;
  todayBookings: number;
  weekBookings: number;
}

const mockPriests: PriestItem[] = [
  { id: "1", firstName: "Pandit Ramesh", lastName: "Shastri", specializations: ["vedic", "agamic"], languages: ["en", "hi", "te"], isHeadPriest: true, isActive: true, todayBookings: 3, weekBookings: 12 },
  { id: "2", firstName: "Acharya Suresh", lastName: "Dikshitar", specializations: ["agamic", "tantric"], languages: ["en", "ta", "te"], isHeadPriest: false, isActive: true, todayBookings: 2, weekBookings: 8 },
  { id: "3", firstName: "Pandit Vishnu", lastName: "Sharma", specializations: ["vedic", "puranic"], languages: ["en", "hi", "kn"], isHeadPriest: false, isActive: true, todayBookings: 1, weekBookings: 6 },
];

export default function PriestsPage() {
  const [priests] = useState<PriestItem[]>(mockPriests);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Priests</h1>
          <p className="text-muted-foreground">
            Manage priest profiles, schedules, and availability.
          </p>
        </div>
        <Button variant="temple">
          <Plus className="mr-2 h-4 w-4" />
          Add Priest
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Priests</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {priests.filter((p) => p.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {priests.reduce((sum, p) => sum + p.todayBookings, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {priests.reduce((sum, p) => sum + p.weekBookings, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {priests.map((priest) => (
          <Card key={priest.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-temple-100 text-lg font-semibold text-temple-600">
                  {getInitials(priest.firstName.split(" ").pop() || priest.firstName, priest.lastName)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">
                      {priest.firstName} {priest.lastName}
                    </h3>
                    {priest.isHeadPriest && (
                      <Badge variant="saffron">Head Priest</Badge>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {priest.specializations.map((spec) => (
                      <Badge key={spec} variant="outline" className="text-xs capitalize">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Languages: {priest.languages.map((l) => l.toUpperCase()).join(", ")}
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-sm">
                    <span>
                      <strong>{priest.todayBookings}</strong> today
                    </span>
                    <span>
                      <strong>{priest.weekBookings}</strong> this week
                    </span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm">
                      Schedule
                    </Button>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
