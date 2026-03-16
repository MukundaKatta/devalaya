import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DonationReceiptRequest {
  donation_id: string;
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

    const { donation_id, send_email = true }: DonationReceiptRequest = await req.json();

    // Fetch donation with temple and devotee details
    const { data: donation, error: donationError } = await supabase
      .from("donations")
      .select(`
        *,
        temples:temple_id (
          name, slug, ein_number, address, email, tax_exempt_status
        ),
        devotees:devotee_id (
          first_name, last_name, email, address
        )
      `)
      .eq("id", donation_id)
      .single();

    if (donationError || !donation) {
      return new Response(
        JSON.stringify({ error: "Donation not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const temple = donation.temples as Record<string, unknown>;
    const devotee = donation.devotees as Record<string, unknown> | null;

    if (!temple.ein_number || !temple.tax_exempt_status) {
      return new Response(
        JSON.stringify({ error: "Temple is not configured for tax-deductible receipts" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate receipt number
    const year = new Date().getFullYear();
    const slug = (temple.slug as string).toUpperCase();
    const random = crypto.randomUUID().substring(0, 8).toUpperCase();
    const receiptNumber = `${slug}-${year}-${random}`;

    const donorName = donation.is_anonymous
      ? "Anonymous Donor"
      : donation.donor_name ||
        (devotee ? `${devotee.first_name} ${devotee.last_name}` : "Unknown Donor");

    const donorAddress = donation.donor_address || (devotee ? devotee.address : null);
    const templeAddress = temple.address as Record<string, string>;
    const templeAddressStr = `${templeAddress.street}, ${templeAddress.city}, ${templeAddress.state} ${templeAddress.zip}`;

    // Generate receipt HTML for PDF
    const receiptHtml = generateReceiptHtml({
      receiptNumber,
      templeName: temple.name as string,
      templeEin: temple.ein_number as string,
      templeAddress: templeAddressStr,
      donorName,
      donorAddress: donorAddress as Record<string, string> | null,
      amount: donation.amount,
      currency: donation.currency,
      donationDate: donation.transaction_date,
      description: `${donation.type.replace(/_/g, " ")} donation`,
      isGoodsOrServices: false,
    });

    // Store receipt record
    const { data: receipt, error: receiptError } = await supabase
      .from("donation_receipts")
      .insert({
        donation_id: donation.id,
        temple_id: donation.temple_id,
        devotee_id: donation.devotee_id,
        receipt_number: receiptNumber,
        amount: donation.amount,
        currency: donation.currency,
        donation_date: donation.transaction_date,
        donor_name: donorName,
        donor_address: donorAddress,
        temple_name: temple.name as string,
        temple_ein: temple.ein_number as string,
        temple_address: templeAddressStr,
        description: `${donation.type.replace(/_/g, " ")} donation`,
        is_goods_or_services: false,
        goods_or_services_value: 0,
      })
      .select()
      .single();

    if (receiptError) {
      return new Response(
        JSON.stringify({ error: "Failed to create receipt record", details: receiptError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update donation with receipt number
    await supabase
      .from("donations")
      .update({ receipt_number: receiptNumber, receipt_sent: send_email })
      .eq("id", donation_id);

    // Send email via SendGrid if requested
    if (send_email) {
      const donorEmail = donation.donor_email || (devotee ? devotee.email as string : null);
      if (donorEmail) {
        const sendgridApiKey = Deno.env.get("SENDGRID_API_KEY");
        const fromEmail = Deno.env.get("SENDGRID_FROM_EMAIL") || "noreply@devalaya.org";

        if (sendgridApiKey) {
          await fetch("https://api.sendgrid.com/v3/mail/send", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${sendgridApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              personalizations: [{ to: [{ email: donorEmail }] }],
              from: { email: fromEmail, name: temple.name as string },
              subject: `Donation Receipt #${receiptNumber} - ${temple.name}`,
              content: [
                {
                  type: "text/html",
                  value: receiptHtml,
                },
              ],
            }),
          });

          await supabase
            .from("donation_receipts")
            .update({ sent_at: new Date().toISOString() })
            .eq("id", receipt.id);
        }
      }
    }

    return new Response(
      JSON.stringify({ receipt, receipt_number: receiptNumber }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function generateReceiptHtml(params: {
  receiptNumber: string;
  templeName: string;
  templeEin: string;
  templeAddress: string;
  donorName: string;
  donorAddress: Record<string, string> | null;
  amount: number;
  currency: string;
  donationDate: string;
  description: string;
  isGoodsOrServices: boolean;
}): string {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: params.currency,
  }).format(params.amount);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(params.donationDate));

  const donorAddressStr = params.donorAddress
    ? `${params.donorAddress.street}<br>${params.donorAddress.city}, ${params.donorAddress.state} ${params.donorAddress.zip}`
    : "";

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Georgia', serif; margin: 0; padding: 40px; color: #333; }
    .receipt { max-width: 600px; margin: 0 auto; border: 2px solid #8B4513; padding: 40px; }
    .header { text-align: center; border-bottom: 2px solid #8B4513; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #8B4513; margin: 0; font-size: 24px; }
    .header p { margin: 5px 0; color: #666; }
    .receipt-title { text-align: center; font-size: 18px; font-weight: bold; color: #8B4513; margin: 20px 0; }
    .details { margin: 20px 0; }
    .details table { width: 100%; border-collapse: collapse; }
    .details td { padding: 8px 0; vertical-align: top; }
    .details td:first-child { font-weight: bold; width: 40%; color: #555; }
    .amount { font-size: 24px; font-weight: bold; color: #8B4513; text-align: center; margin: 30px 0; padding: 20px; background: #FFF8F0; border-radius: 8px; }
    .tax-notice { background: #f9f9f9; padding: 15px; border-radius: 8px; font-size: 12px; color: #666; margin-top: 30px; }
    .footer { text-align: center; margin-top: 30px; font-size: 11px; color: #999; }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>${params.templeName}</h1>
      <p>${params.templeAddress}</p>
      <p>EIN: ${params.templeEin}</p>
    </div>
    <div class="receipt-title">DONATION RECEIPT</div>
    <div class="details">
      <table>
        <tr><td>Receipt Number:</td><td>${params.receiptNumber}</td></tr>
        <tr><td>Date of Donation:</td><td>${formattedDate}</td></tr>
        <tr><td>Donor Name:</td><td>${params.donorName}</td></tr>
        ${donorAddressStr ? `<tr><td>Donor Address:</td><td>${donorAddressStr}</td></tr>` : ""}
        <tr><td>Description:</td><td>${params.description}</td></tr>
      </table>
    </div>
    <div class="amount">${formattedAmount}</div>
    <div class="tax-notice">
      <strong>Tax Deduction Notice:</strong><br>
      ${params.templeName} is a tax-exempt organization under Section 501(c)(3) of the Internal Revenue Code.
      ${params.isGoodsOrServices
        ? "Goods or services were provided in exchange for this donation."
        : "No goods or services were provided in exchange for this contribution."
      }
      This receipt may be used for tax deduction purposes. Please retain for your records.
    </div>
    <div class="footer">
      <p>Thank you for your generous contribution.</p>
      <p>Generated by Devalaya Temple Management Platform</p>
    </div>
  </div>
</body>
</html>`;
}
