"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ArrowDownRight, ArrowUpRight, DollarSign, Download, Plus, TrendingUp } from "lucide-react";
import { formatCurrency } from "@devalaya/shared/utils";

const mockTransactions = [
  { id: "1", type: "income" as const, category: "donation", description: "March donations batch", amount: 12500, date: "2026-03-15", fund: "general" },
  { id: "2", type: "income" as const, category: "puja_booking", description: "Puja booking revenue - week 11", amount: 3200, date: "2026-03-14", fund: "general" },
  { id: "3", type: "expense" as const, category: "priest_salary", description: "Priest monthly salaries", amount: 8500, date: "2026-03-01", fund: "general" },
  { id: "4", type: "expense" as const, category: "utilities", description: "Electricity and water bill", amount: 1200, date: "2026-03-05", fund: "general" },
  { id: "5", type: "expense" as const, category: "puja_supplies", description: "Flowers, oil, and incense", amount: 850, date: "2026-03-10", fund: "general" },
  { id: "6", type: "income" as const, category: "event_registration", description: "Ram Navami registration fees", amount: 4500, date: "2026-03-13", fund: "festival" },
  { id: "7", type: "expense" as const, category: "food_prasadam", description: "Weekly prasadam ingredients", amount: 600, date: "2026-03-12", fund: "food" },
  { id: "8", type: "income" as const, category: "donation", description: "Building fund donations", amount: 5000, date: "2026-03-11", fund: "building" },
];

export default function FinancesPage() {
  const [transactions] = useState(mockTransactions);
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const netIncome = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finances</h1>
          <p className="text-muted-foreground">Track income, expenses, and fund allocations.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export Report</Button>
          <Button variant="temple"><Plus className="mr-2 h-4 w-4" />Add Transaction</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netIncome >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(netIncome)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funds</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(transactions.map((t) => t.fund)).size}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Fund</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(tx.date))}</TableCell>
                  <TableCell className="font-medium">{tx.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize text-xs">{tx.category.replace(/_/g, " ")}</Badge>
                  </TableCell>
                  <TableCell className="capitalize">{tx.fund}</TableCell>
                  <TableCell>
                    <Badge variant={tx.type === "income" ? "success" : "destructive"} className="capitalize">
                      {tx.type}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right font-bold ${tx.type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
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
