"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { BookOpen, Plus, Search } from "lucide-react";
import { formatCurrency } from "@devalaya/shared/utils";

interface BookingItem {
  id: string;
  devoteeName: string;
  pujaName: string;
  priestName: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  amount: number;
  paymentStatus: "pending" | "paid" | "refunded";
}

const mockBookings: BookingItem[] = [
  { id: "1", devoteeName: "Anand Kumar", pujaName: "Satyanarayana Puja", priestName: "Pandit Ramesh Shastri", date: "2026-03-16", time: "16:00", status: "confirmed", amount: 151, paymentStatus: "paid" },
  { id: "2", devoteeName: "Meera Iyer", pujaName: "Navagraha Homam", priestName: "Acharya Suresh Dikshitar", date: "2026-03-17", time: "09:00", status: "confirmed", amount: 251, paymentStatus: "paid" },
  { id: "3", devoteeName: "Venkat Reddy", pujaName: "Rudra Abhishekam", priestName: "Pandit Vishnu Sharma", date: "2026-03-18", time: "10:00", status: "pending", amount: 201, paymentStatus: "pending" },
  { id: "4", devoteeName: "Sunita Joshi", pujaName: "Lakshmi Archana", priestName: "Pandit Ramesh Shastri", date: "2026-03-19", time: "11:00", status: "confirmed", amount: 51, paymentStatus: "paid" },
  { id: "5", devoteeName: "Ravi Menon", pujaName: "Ganapathi Homam", priestName: "Acharya Suresh Dikshitar", date: "2026-03-20", time: "08:00", status: "pending", amount: 301, paymentStatus: "pending" },
];

const statusColors: Record<string, "default" | "success" | "warning" | "destructive" | "outline"> = {
  pending: "warning",
  confirmed: "success",
  completed: "default",
  cancelled: "destructive",
};

export default function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings] = useState<BookingItem[]>(mockBookings);

  const filteredBookings = bookings.filter(
    (b) =>
      b.devoteeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.pujaName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">
            Manage puja and service bookings with priest assignments.
          </p>
        </div>
        <Button variant="temple">
          <Plus className="mr-2 h-4 w-4" />
          New Booking
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.filter((b) => b.status === "confirmed").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.filter((b) => b.status === "pending").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(bookings.filter((b) => b.paymentStatus === "paid").reduce((s, b) => s + b.amount, 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Devotee</TableHead>
                <TableHead>Puja</TableHead>
                <TableHead>Priest</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.devoteeName}</TableCell>
                  <TableCell>{booking.pujaName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{booking.priestName}</TableCell>
                  <TableCell>
                    {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(booking.date))},{" "}
                    {booking.time}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[booking.status]}>{booking.status}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(booking.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={booking.paymentStatus === "paid" ? "success" : "warning"}>
                      {booking.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {booking.status === "pending" && (
                        <Button variant="outline" size="sm">Confirm</Button>
                      )}
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
