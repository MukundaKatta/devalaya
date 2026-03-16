import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";
import { createPaymentIntent } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      temple_id,
      puja_id,
      devotee_id,
      booking_date,
      start_time,
      end_time,
      devotee_names,
      gotra,
      nakshatra,
      special_requests,
      donation_amount,
    } = body;

    const adminClient = await createSupabaseAdminClient();

    // Fetch puja details
    const { data: puja } = await adminClient
      .from("pujas")
      .select("*")
      .eq("id", puja_id)
      .single();

    if (!puja) {
      return NextResponse.json({ error: "Puja not found" }, { status: 404 });
    }

    // Check for priest availability and assign
    let priestId: string | null = null;
    if (puja.requires_priest) {
      const { data: availableSlot } = await adminClient
        .from("priest_availability")
        .select("*, priests(*)")
        .eq("temple_id", temple_id)
        .eq("date", booking_date)
        .eq("is_available", true)
        .eq("is_booked", false)
        .lte("start_time", start_time)
        .gte("end_time", end_time)
        .limit(1)
        .single();

      if (availableSlot) {
        priestId = availableSlot.priest_id;
      }
    }

    const totalAmount = Number(puja.base_price) + (donation_amount || 0);

    // Fetch temple for Stripe
    const { data: temple } = await adminClient
      .from("temples")
      .select("stripe_account_id")
      .eq("id", temple_id)
      .single();

    let paymentIntentId: string | null = null;
    let clientSecret: string | null = null;

    if (temple?.stripe_account_id && totalAmount > 0) {
      const paymentIntent = await createPaymentIntent(
        totalAmount,
        "usd",
        temple.stripe_account_id,
        {
          temple_id,
          puja_id,
          devotee_id,
          booking_type: "puja_booking",
        }
      );
      paymentIntentId = paymentIntent.id;
      clientSecret = paymentIntent.client_secret;
    }

    // Create booking
    const { data: booking, error: bookingError } = await adminClient
      .from("puja_bookings")
      .insert({
        temple_id,
        puja_id,
        devotee_id,
        priest_id: priestId,
        booking_date,
        start_time,
        end_time,
        status: "pending",
        amount: Number(puja.base_price),
        donation_amount: donation_amount || 0,
        total_amount: totalAmount,
        payment_intent_id: paymentIntentId,
        payment_status: totalAmount === 0 ? "paid" : "pending",
        devotee_names: devotee_names || [],
        gotra,
        nakshatra,
        special_requests,
      })
      .select()
      .single();

    if (bookingError) {
      return NextResponse.json(
        { error: "Failed to create booking", details: bookingError },
        { status: 500 }
      );
    }

    // Mark priest slot as booked
    if (priestId) {
      await adminClient
        .from("priest_availability")
        .update({ is_booked: true, booking_id: booking.id })
        .eq("priest_id", priestId)
        .eq("date", booking_date)
        .eq("is_available", true)
        .eq("is_booked", false)
        .lte("start_time", start_time)
        .gte("end_time", end_time);
    }

    return NextResponse.json({
      booking,
      client_secret: clientSecret,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const templeId = searchParams.get("temple_id");
    const status = searchParams.get("status");

    let query = supabase
      .from("puja_bookings")
      .select(
        "*, pujas(name, category, deity), devotees(first_name, last_name), priests(first_name, last_name)",
        { count: "exact" }
      )
      .order("booking_date", { ascending: true });

    if (templeId) query = query.eq("temple_id", templeId);
    if (status) query = query.eq("status", status);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ bookings: data, total: count });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
