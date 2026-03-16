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
import { DollarSign, Download, HandHeart, Plus, Search, TrendingUp } from "lucide-react";
import { formatCurrency } from "@devalaya/shared/utils";

interface DonationItem {
  id: string;
  donorName: string;
  amount: number;
  type: string;
  method: string;
  status: "succeeded" | "pending" | "failed";
  date: string;
  isAnonymous: boolean;
  receiptSent: boolean;
}

const mockDonations: DonationItem[] = [
  { id: "1", donorName: "Rajesh Sharma", amount: 251, type: "general", method: "credit_card", status: "succeeded", date: "2026-03-16T10:30:00", isAnonymous: false, receiptSent: true },
  { id: "2", donorName: "Priya Patel", amount: 108, type: "abhishekam", method: "credit_card", status: "succeeded", date: "2026-03-16T08:15:00", isAnonymous: false, receiptSent: true },
  { id: "3", donorName: "Anonymous", amount: 500, type: "building_fund", method: "bank_transfer", status: "succeeded", date: "2026-03-15T14:00:00", isAnonymous: true, receiptSent: false },
  { id: "4", donorName: "Srinivas Rao", amount: 1001, type: "festival_sponsorship", method: "credit_card", status: "succeeded", date: "2026-03-15T09:00:00", isAnonymous: false, receiptSent: true },
  { id: "5", donorName: "Lakshmi Devi", amount: 51, type: "food_offering", method: "cash", status: "succeeded", date: "2026-03-14T16:30:00", isAnonymous: false, receiptSent: false },
  { id: "6", donorName: "Anil Gupta", amount: 2500, type: "building_fund", method: "check", status: "pending", date: "2026-03-14T11:00:00", isAnonymous: false, receiptSent: false },
];

export default function DonationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [donations] = useState<DonationItem[]>(mockDonations);

  const totalDonations = donations
    .filter((d) => d.status === "succeeded")
    .reduce((sum, d) => sum + d.amount, 0);

  const filteredDonations = donations.filter(
    (d) =>
      d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Donations</h1>
          <p className="text-muted-foreground">
            Track donations and manage tax-deductible receipts.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="temple">
            <Plus className="mr-2 h-4 w-4" />
            Record Donation
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalDonations)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 font-medium">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Donation Count</CardTitle>
            <HandHeart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Donation</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalDonations / donations.filter((d) => d.status === "succeeded").length)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receipts Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {donations.filter((d) => !d.receiptSent && d.status === "succeeded").length}
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
                placeholder="Search donations..."
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
                <TableHead>Donor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Receipt</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDonations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell className="font-medium">
                    {donation.isAnonymous ? (
                      <span className="italic text-muted-foreground">Anonymous</span>
                    ) : (
                      donation.donorName
                    )}
                  </TableCell>
                  <TableCell className="font-bold text-green-600">
                    {formatCurrency(donation.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {donation.type.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">
                    {donation.method.replace(/_/g, " ")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        donation.status === "succeeded"
                          ? "success"
                          : donation.status === "pending"
                            ? "warning"
                            : "destructive"
                      }
                    >
                      {donation.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    }).format(new Date(donation.date))}
                  </TableCell>
                  <TableCell>
                    {donation.receiptSent ? (
                      <Badge variant="success">Sent</Badge>
                    ) : (
                      <Button variant="ghost" size="sm">
                        Send
                      </Button>
                    )}
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
