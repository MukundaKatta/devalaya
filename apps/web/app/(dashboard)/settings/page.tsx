"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SUPPORTED_LANGUAGES } from "@devalaya/shared/i18n";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure your temple&apos;s settings and integrations.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Temple Information</CardTitle>
            <CardDescription>Basic information about your temple.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Temple Name</label>
                <Input defaultValue="Sri Venkateswara Temple" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">URL Slug</label>
                <Input defaultValue="sri-venkateswara-temple" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input defaultValue="+1 (555) 123-4567" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input defaultValue="info@svtemple.org" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">EIN Number</label>
                <Input defaultValue="12-3456789" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Timezone</label>
                <Input defaultValue="America/New_York" />
              </div>
            </div>
            <Button variant="temple">Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Languages</CardTitle>
            <CardDescription>Configure supported languages for your temple.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
                <Badge key={code} variant={code === "en" ? "default" : "outline"} className="cursor-pointer">
                  {name} ({code})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stripe Connect</CardTitle>
            <CardDescription>Configure payment processing for donations and bookings.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge variant="success">Connected</Badge>
              <span className="text-sm text-muted-foreground">Account: acct_1234567890</span>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mux Livestream</CardTitle>
            <CardDescription>Configure video streaming for pujas and events.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge variant="success">Active</Badge>
              <span className="text-sm text-muted-foreground">Stream key configured</span>
              <Button variant="outline" size="sm">Settings</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure email (SendGrid) and SMS (Twilio) settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">SendGrid From Email</label>
                <Input defaultValue="noreply@svtemple.org" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Twilio Phone Number</label>
                <Input defaultValue="+1 (555) 000-0000" />
              </div>
            </div>
            <Button variant="temple">Save</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
