import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${(err as Error).message}` },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseAdminClient();

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const metadata = paymentIntent.metadata;

      if (metadata.donation_type) {
        // Update donation payment status
        await supabase
          .from("donations")
          .update({ payment_status: "succeeded" })
          .eq("stripe_payment_intent_id", paymentIntent.id);

        // Update devotee total donations
        if (metadata.devotee_id) {
          const { data: donation } = await supabase
            .from("donations")
            .select("amount")
            .eq("stripe_payment_intent_id", paymentIntent.id)
            .single();

          if (donation) {
            await supabase.rpc("increment_devotee_donations", {
              p_devotee_id: metadata.devotee_id,
              p_amount: donation.amount,
            });
          }
        }

        // Trigger receipt generation
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const { data: donationRecord } = await supabase
          .from("donations")
          .select("id")
          .eq("stripe_payment_intent_id", paymentIntent.id)
          .single();

        if (donationRecord) {
          await fetch(`${supabaseUrl}/functions/v1/donation-receipt`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            },
            body: JSON.stringify({
              donation_id: donationRecord.id,
              send_email: true,
            }),
          });
        }
      }

      if (metadata.booking_type === "puja_booking") {
        // Update booking payment status
        await supabase
          .from("puja_bookings")
          .update({
            payment_status: "paid",
            status: "confirmed",
          })
          .eq("payment_intent_id", paymentIntent.id);
      }

      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;

      await supabase
        .from("donations")
        .update({ payment_status: "failed" })
        .eq("stripe_payment_intent_id", paymentIntent.id);

      await supabase
        .from("puja_bookings")
        .update({ payment_status: "failed" })
        .eq("payment_intent_id", paymentIntent.id);

      break;
    }

    case "charge.refunded": {
      const charge = event.data.object;
      const paymentIntentId = charge.payment_intent as string;

      await supabase
        .from("donations")
        .update({ payment_status: "refunded" })
        .eq("stripe_payment_intent_id", paymentIntentId);

      await supabase
        .from("puja_bookings")
        .update({ payment_status: "refunded" })
        .eq("payment_intent_id", paymentIntentId);

      break;
    }

    case "account.updated": {
      const account = event.data.object;

      if (account.charges_enabled && account.payouts_enabled) {
        await supabase
          .from("temples")
          .update({ stripe_onboarding_complete: true })
          .eq("stripe_account_id", account.id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
