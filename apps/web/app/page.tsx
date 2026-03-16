import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-saffron-50 to-white">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-5xl font-bold tracking-tight text-temple-500">
          Devalaya
        </h1>
        <p className="mt-2 text-lg text-temple-300 italic">
          Temple Management Platform
        </p>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Complete digital management for Hindu temples. Manage pujas, donations,
          events, priests, devotees, and livestreams from one platform.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/login">
            <Button variant="temple" size="lg">
              Temple Admin Login
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg">
              Register Your Temple
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
