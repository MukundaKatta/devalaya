"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Calendar,
  CreditCard,
  Home,
  Megaphone,
  Radio,
  Settings,
  Users,
  UserCheck,
  HandHeart,
  DollarSign,
  BookOpen,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Bookings", href: "/bookings", icon: BookOpen },
  { name: "Donations", href: "/donations", icon: HandHeart },
  { name: "Devotees", href: "/devotees", icon: Users },
  { name: "Priests", href: "/priests", icon: UserCheck },
  { name: "Livestream", href: "/livestream", icon: Radio },
  { name: "Volunteers", href: "/volunteers", icon: Users },
  { name: "Communications", href: "/communications", icon: Megaphone },
  { name: "Finances", href: "/finances", icon: DollarSign },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-temple-500" />
          <span className="text-xl font-bold text-temple-500">Devalaya</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-temple-50 text-temple-600"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
