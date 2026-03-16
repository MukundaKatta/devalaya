import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const twilioSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioPhone = Deno.env.get("TWILIO_PHONE_NUMBER");
    const sendgridKey = Deno.env.get("SENDGRID_API_KEY");
    const fromEmail = Deno.env.get("SENDGRID_FROM_EMAIL") || "noreply@devalaya.org";

    const now = new Date();
    const remindersToSend: Array<{
      event: Record<string, unknown>;
      rsvps: Array<Record<string, unknown>>;
      hoursBeforeEvent: number;
    }> = [];

    // Find events that need reminders sent
    // Check for events starting in the next 25 hours (to catch both 24h and 1h reminders)
    const futureLimit = new Date(now.getTime() + 25 * 60 * 60 * 1000).toISOString();

    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select(`
        *,
        temples:temple_id (name, default_language)
      `)
      .eq("status", "published")
      .eq("send_reminders", true)
      .gte("start_date", now.toISOString())
      .lte("start_date", futureLimit);

    if (eventsError) {
      throw new Error(`Failed to fetch events: ${eventsError.message}`);
    }

    for (const event of events || []) {
      const eventStart = new Date(event.start_date);
      const hoursUntilEvent = (eventStart.getTime() - now.getTime()) / (1000 * 60 * 60);
      const reminderHours = event.reminder_hours_before as number[];

      for (const reminderHour of reminderHours) {
        // Check if we're within a 30-minute window of the reminder time
        if (Math.abs(hoursUntilEvent - reminderHour) < 0.5) {
          const { data: rsvps } = await supabase
            .from("event_rsvps")
            .select(`
              *,
              devotees:devotee_id (
                first_name, last_name, email, phone,
                communication_preferences, preferred_language
              )
            `)
            .eq("event_id", event.id)
            .in("status", ["attending", "maybe"]);

          if (rsvps && rsvps.length > 0) {
            remindersToSend.push({
              event,
              rsvps,
              hoursBeforeEvent: reminderHour,
            });
          }
        }
      }
    }

    let emailsSent = 0;
    let smsSent = 0;

    for (const { event, rsvps, hoursBeforeEvent } of remindersToSend) {
      const temple = event.temples as Record<string, unknown>;
      const timeStr = hoursBeforeEvent >= 1
        ? `${Math.round(hoursBeforeEvent)} hour${hoursBeforeEvent > 1 ? "s" : ""}`
        : `${Math.round(hoursBeforeEvent * 60)} minutes`;

      for (const rsvp of rsvps) {
        const devotee = rsvp.devotees as Record<string, unknown>;
        const prefs = devotee.communication_preferences as Record<string, boolean>;

        // Send email reminder
        if (prefs?.email && devotee.email && sendgridKey) {
          const eventDate = new Intl.DateTimeFormat("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }).format(new Date(event.start_date));

          await fetch("https://api.sendgrid.com/v3/mail/send", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${sendgridKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              personalizations: [{ to: [{ email: devotee.email as string }] }],
              from: { email: fromEmail, name: temple.name as string },
              subject: `Reminder: ${event.title} starts in ${timeStr}`,
              content: [
                {
                  type: "text/html",
                  value: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                      <h2 style="color: #8B4513;">Event Reminder</h2>
                      <p>Namaste ${devotee.first_name},</p>
                      <p><strong>${event.title}</strong> is starting in <strong>${timeStr}</strong>.</p>
                      <div style="background: #FFF8F0; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Date & Time:</strong> ${eventDate}</p>
                        ${event.location ? `<p><strong>Location:</strong> ${event.location}</p>` : ""}
                        ${event.is_virtual && event.virtual_link ? `<p><strong>Virtual Link:</strong> <a href="${event.virtual_link}">${event.virtual_link}</a></p>` : ""}
                      </div>
                      ${event.description ? `<p>${event.description}</p>` : ""}
                      <p>We look forward to seeing you!</p>
                      <p style="color: #666; font-size: 12px;">- ${temple.name}</p>
                    </div>
                  `,
                },
              ],
            }),
          });
          emailsSent++;
        }

        // Send SMS reminder
        if (prefs?.sms && devotee.phone && twilioSid && twilioToken && twilioPhone) {
          const encodedBody = new URLSearchParams({
            To: devotee.phone as string,
            From: twilioPhone,
            Body: `${temple.name}: Reminder - ${event.title} starts in ${timeStr}. ${event.location ? `Location: ${event.location}` : ""}`,
          });

          await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
            {
              method: "POST",
              headers: {
                Authorization: `Basic ${btoa(`${twilioSid}:${twilioToken}`)}`,
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: encodedBody.toString(),
            }
          );
          smsSent++;
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        events_processed: remindersToSend.length,
        emails_sent: emailsSent,
        sms_sent: smsSent,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
