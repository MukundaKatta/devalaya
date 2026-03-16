import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";
import { stripe, createPaymentIntent } from "@/lib/stripe";

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
      devotee_id,
      type,
      amount,
      method,
      frequency,
      is_anonymous,
      donor_name,
      donor_email,
      in_memory_of,
      in_honor_of,
      notes,
      fund_allocation,
    } = body;

    // Fetch temple for Stripe account
    const adminClient = await createSupabaseAdminClient();
    const { data: temple } = await adminClient
      .from("temples")
      .select("stripe_account_id, name, ein_number")
      .eq("id", temple_id)
      .single();

    if (!temple?.stripe_account_id) {
      return NextResponse.json(
        { error: "Temple payment processing not configured" },
        { status: 400 }
      );
    }

    // Create Stripe payment intent
    const paymentIntent = await createPaymentIntent(
      amount,
      "usd",
      temple.stripe_account_id,
      {
        temple_id,
        devotee_id: devotee_id || "",
        donation_type: type,
        fund: fund_allocation || "general",
      }
    );

    // Record donation
    const { data: donation, error: donationError } = await adminClient
      .from("donations")
      .insert({
        temple_id,
        devotee_id: devotee_id || null,
        type,
        amount,
        currency: "USD",
        method: method || "credit_card",
        frequency: frequency || "one_time",
        stripe_payment_intent_id: paymentIntent.id,
        payment_status: "pending",
        is_anonymous: is_anonymous || false,
        donor_name,
        donor_email,
        in_memory_of,
        in_honor_of,
        notes,
        fund_allocation,
        is_tax_deductible: true,
        transaction_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (donationError) {
      return NextResponse.json(
        { error: "Failed to record donation", details: donationError },
        { status: 500 }
      );
    }

    return NextResponse.json({
      donation,
      client_secret: paymentIntent.client_secret,
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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    let query = supabase
      .from("donations")
      .select("*, devotees(first_name, last_name, email)", { count: "exact" })
      .order("transaction_date", { ascending: false })
      .range(offset, offset + limit - 1);

    if (templeId) {
      query = query.eq("temple_id", templeId);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      donations: data,
      total: count,
      page,
      limit,
      total_pages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
