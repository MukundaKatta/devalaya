import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  DollarSign,
  HandHeart,
  Radio,
  Users,
  BookOpen,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your temple&apos;s activities and metrics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Devotees"
          value="1,234"
          description="from last month"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Monthly Donations"
          value="$24,500"
          description="from last month"
          icon={DollarSign}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Active Bookings"
          value="48"
          description="this week"
          icon={BookOpen}
        />
        <StatsCard
          title="Upcoming Events"
          value="7"
          description="next 30 days"
          icon={Calendar}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today&apos;s Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "06:00 AM", name: "Suprabhatam", type: "daily" },
                { time: "07:00 AM", name: "Ganapathi Homam", type: "special" },
                { time: "09:00 AM", name: "Abhishekam - Lord Shiva", type: "daily" },
                { time: "12:00 PM", name: "Madhyana Aarti", type: "daily" },
                { time: "04:00 PM", name: "Satyanarayana Puja", type: "personal" },
                { time: "06:30 PM", name: "Sandhya Aarti", type: "daily" },
                { time: "08:00 PM", name: "Shayan Aarti", type: "daily" },
              ].map((event, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-20">
                      {event.time}
                    </span>
                    <span className="text-sm font-medium">{event.name}</span>
                  </div>
                  <Badge
                    variant={
                      event.type === "special"
                        ? "saffron"
                        : event.type === "personal"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {event.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HandHeart className="h-5 w-5" />
              Recent Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Rajesh Sharma", amount: "$251", type: "General", time: "2h ago" },
                { name: "Priya Patel", amount: "$108", type: "Abhishekam", time: "3h ago" },
                { name: "Anonymous", amount: "$500", type: "Building Fund", time: "5h ago" },
                { name: "Srinivas Rao", amount: "$1,001", type: "Festival Sponsor", time: "1d ago" },
                { name: "Lakshmi Devi", amount: "$51", type: "Food Offering", time: "1d ago" },
              ].map((donation, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{donation.name}</p>
                    <p className="text-xs text-muted-foreground">{donation.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">{donation.amount}</p>
                    <p className="text-xs text-muted-foreground">{donation.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Upcoming Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { devotee: "Anand Kumar", puja: "Satyanarayana Puja", date: "Today, 4:00 PM", status: "confirmed" },
                { devotee: "Meera Iyer", puja: "Navagraha Homam", date: "Tomorrow, 9:00 AM", status: "confirmed" },
                { devotee: "Venkat Reddy", puja: "Rudra Abhishekam", date: "Mar 18, 10:00 AM", status: "pending" },
                { devotee: "Sunita Joshi", puja: "Lakshmi Archana", date: "Mar 19, 11:00 AM", status: "confirmed" },
              ].map((booking, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{booking.devotee}</p>
                    <p className="text-xs text-muted-foreground">{booking.puja}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{booking.date}</p>
                    <Badge variant={booking.status === "confirmed" ? "success" : "warning"}>
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5" />
              Livestream Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-red-50 p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
                  </span>
                  <span className="font-semibold text-red-600">Live Now</span>
                </div>
                <p className="mt-2 text-sm font-medium">Evening Sandhya Aarti</p>
                <p className="text-xs text-muted-foreground">142 viewers</p>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium">Scheduled Streams</p>
                {[
                  { name: "Morning Abhishekam", time: "Tomorrow, 7:00 AM" },
                  { name: "Hanuman Chalisa", time: "Saturday, 6:00 PM" },
                ].map((stream, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span>{stream.name}</span>
                    <span className="text-muted-foreground">{stream.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
