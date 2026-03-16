import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnnualStatementRequest {
  temple_id: string;
  devotee_id: string;
  year: number;
  send_email?: boolean;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { temple_id, devotee_id, year, send_email = true }: AnnualStatementRequest =
      await req.json();

    // Fetch temple details
    const { data: temple, error: templeError } = await supabase
      .from("temples")
      .select("*")
      .eq("id", temple_id)
      .single();

    if (templeError || !temple) {
      return new Response(
        JSON.stringify({ error: "Temple not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch devotee details
    const { data: devotee, error: devoteeError } = await supabase
      .from("devotees")
      .select("*")
      .eq("id", devotee_id)
      .single();

    if (devoteeError || !devotee) {
      return new Response(
        JSON.stringify({ error: "Devotee not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch all donations for the year
    const startDate = `${year}-01-01T00:00:00.000Z`;
    const endDate = `${year}-12-31T23:59:59.999Z`;

    const { data: donations, error: donationsError } = await supabase
      .from("donations")
      .select("*")
      .eq("temple_id", temple_id)
      .eq("devotee_id", devotee_id)
      .eq("payment_status", "succeeded")
      .gte("transaction_date", startDate)
      .lte("transaction_date", endDate)
      .order("transaction_date", { ascending: true });

    if (donationsError) {
      throw new Error(`Failed to fetch donations: ${donationsError.message}`);
    }

    if (!donations || donations.length === 0) {
      return new Response(
        JSON.stringify({ error: "No donations found for this devotee in the specified year" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate totals
    const totalDonations = donations.reduce((sum, d) => sum + Number(d.amount), 0);
    const totalTaxDeductible = donations
      .filter((d) => d.is_tax_deductible)
      .reduce((sum, d) => sum + Number(d.amount), 0);

    const donationsSummary = donations.map((d) => ({
      date: d.transaction_date,
      amount: Number(d.amount),
      type: d.type,
      receipt_number: d.receipt_number || "N/A",
    }));

    // Upsert annual statement
    const { data: statement, error: statementError } = await supabase
      .from("annual_statements")
      .upsert(
        {
          temple_id,
          devotee_id,
          year,
          total_donations: totalDonations,
          total_tax_deductible: totalTaxDeductible,
          donation_count: donations.length,
          donations_summary: donationsSummary,
        },
        { onConflict: "temple_id,devotee_id,year" }
      )
      .select()
      .single();

    if (statementError) {
      throw new Error(`Failed to create annual statement: ${statementError.message}`);
    }

    // Generate HTML statement
    const templeAddress = temple.address as Record<string, string>;
    const statementHtml = generateStatementHtml({
      year,
      templeName: temple.name,
      templeEin: temple.ein_number || "",
      templeAddress: `${templeAddress.street}, ${templeAddress.city}, ${templeAddress.state} ${templeAddress.zip}`,
      donorName: `${devotee.first_name} ${devotee.last_name}`,
      donorAddress: devotee.address as Record<string, string> | null,
      totalDonations,
      totalTaxDeductible,
      donations: donationsSummary,
    });

    // Send email if requested
    if (send_email && devotee.email) {
      const sendgridKey = Deno.env.get("SENDGRID_API_KEY");
      const fromEmail = Deno.env.get("SENDGRID_FROM_EMAIL") || "noreply@devalaya.org";

      if (sendgridKey) {
        await fetch("https://api.sendgrid.com/v3/mail/send", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sendgridKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: devotee.email }] }],
            from: { email: fromEmail, name: temple.name },
            subject: `${year} Annual Donation Statement - ${temple.name}`,
            content: [{ type: "text/html", value: statementHtml }],
          }),
        });

        await supabase
          .from("annual_statements")
          .update({ sent_at: new Date().toISOString() })
          .eq("id", statement.id);
      }
    }

    return new Response(
      JSON.stringify({
        statement,
        total_donations: totalDonations,
        total_tax_deductible: totalTaxDeductible,
        donation_count: donations.length,
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

function generateStatementHtml(params: {
  year: number;
  templeName: string;
  templeEin: string;
  templeAddress: string;
  donorName: string;
  donorAddress: Record<string, string> | null;
  totalDonations: number;
  totalTaxDeductible: number;
  donations: Array<{
    date: string;
    amount: number;
    type: string;
    receipt_number: string;
  }>;
}): string {
  const fmt = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  const donorAddressStr = params.donorAddress
    ? `${params.donorAddress.street}<br>${params.donorAddress.city}, ${params.donorAddress.state} ${params.donorAddress.zip}`
    : "";

  const donationRows = params.donations
    .map(
      (d) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">
          ${new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(d.date))}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-transform: capitalize;">
          ${d.type.replace(/_/g, " ")}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${d.receipt_number}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${fmt(d.amount)}</td>
      </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Georgia', serif; margin: 0; padding: 40px; color: #333; }
    .statement { max-width: 700px; margin: 0 auto; border: 2px solid #8B4513; padding: 40px; }
    .header { text-align: center; border-bottom: 2px solid #8B4513; padding-bottom: 20px; margin-bottom: 20px; }
    .header h1 { color: #8B4513; margin: 0; font-size: 22px; }
    .header p { margin: 4px 0; color: #666; font-size: 13px; }
    .title { text-align: center; font-size: 18px; font-weight: bold; color: #8B4513; margin: 20px 0; }
    .info { display: flex; justify-content: space-between; margin: 20px 0; }
    .info-block p { margin: 3px 0; font-size: 13px; }
    .info-block strong { color: #555; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #8B4513; color: white; padding: 10px 8px; text-align: left; font-size: 13px; }
    th:last-child { text-align: right; }
    .totals { background: #FFF8F0; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .totals table { margin: 0; }
    .totals td { padding: 6px 0; font-size: 14px; }
    .totals td:last-child { text-align: right; font-weight: bold; }
    .tax-notice { font-size: 11px; color: #666; margin-top: 30px; padding: 15px; background: #f9f9f9; border-radius: 8px; }
    .footer { text-align: center; margin-top: 20px; font-size: 11px; color: #999; }
  </style>
</head>
<body>
  <div class="statement">
    <div class="header">
      <h1>${params.templeName}</h1>
      <p>${params.templeAddress}</p>
      <p>EIN: ${params.templeEin}</p>
    </div>
    <div class="title">${params.year} ANNUAL DONATION STATEMENT</div>
    <div style="margin: 20px 0;">
      <div style="margin-bottom: 15px;">
        <strong>Donor:</strong><br>
        ${params.donorName}<br>
        ${donorAddressStr}
      </div>
      <div>
        <strong>Statement Period:</strong> January 1, ${params.year} - December 31, ${params.year}
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Receipt #</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${donationRows}
      </tbody>
    </table>
    <div class="totals">
      <table>
        <tr><td>Total Donations (${params.donations.length} contributions):</td><td>${fmt(params.totalDonations)}</td></tr>
        <tr><td>Total Tax-Deductible Amount:</td><td>${fmt(params.totalTaxDeductible)}</td></tr>
      </table>
    </div>
    <div class="tax-notice">
      <strong>IRS Disclosure:</strong> ${params.templeName} is a tax-exempt organization under
      Section 501(c)(3) of the Internal Revenue Code (EIN: ${params.templeEin}).
      No goods or services were provided in exchange for these contributions unless
      otherwise noted on individual receipts. This statement is provided for your
      tax records. Please consult your tax advisor regarding deductibility.
    </div>
    <div class="footer">
      <p>Thank you for your generous support throughout ${params.year}.</p>
      <p>Generated by Devalaya Temple Management Platform</p>
    </div>
  </div>
</body>
</html>`;
}
