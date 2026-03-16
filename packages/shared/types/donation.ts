import { z } from "zod";

export const DonationTypeEnum = z.enum([
  "general",
  "puja_offering",
  "festival_sponsorship",
  "building_fund",
  "education_fund",
  "food_offering",
  "flower_offering",
  "maintenance",
  "priest_dakshina",
  "charity",
  "other",
]);
export type DonationType = z.infer<typeof DonationTypeEnum>;

export const DonationMethodEnum = z.enum([
  "credit_card",
  "debit_card",
  "bank_transfer",
  "cash",
  "check",
  "upi",
  "other",
]);
export type DonationMethod = z.infer<typeof DonationMethodEnum>;

export const DonationFrequencyEnum = z.enum([
  "one_time",
  "weekly",
  "monthly",
  "quarterly",
  "annually",
]);
export type DonationFrequency = z.infer<typeof DonationFrequencyEnum>;

export const DonationSchema = z.object({
  id: z.string().uuid(),
  temple_id: z.string().uuid(),
  devotee_id: z.string().uuid().optional(),
  type: DonationTypeEnum,
  amount: z.number().positive(),
  currency: z.string().default("USD"),
  method: DonationMethodEnum,
  frequency: DonationFrequencyEnum.default("one_time"),
  stripe_payment_intent_id: z.string().optional(),
  stripe_subscription_id: z.string().optional(),
  payment_status: z
    .enum(["pending", "succeeded", "failed", "refunded", "cancelled"])
    .default("pending"),
  is_anonymous: z.boolean().default(false),
  donor_name: z.string().optional(),
  donor_email: z.string().email().optional(),
  donor_phone: z.string().optional(),
  donor_address: z
    .object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
      country: z.string().default("US"),
    })
    .optional(),
  in_memory_of: z.string().optional(),
  in_honor_of: z.string().optional(),
  notes: z.string().optional(),
  fund_allocation: z.string().optional(),
  is_tax_deductible: z.boolean().default(true),
  receipt_sent: z.boolean().default(false),
  receipt_number: z.string().optional(),
  transaction_date: z.string().datetime(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Donation = z.infer<typeof DonationSchema>;

export const CreateDonationSchema = DonationSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  receipt_sent: true,
  receipt_number: true,
  payment_status: true,
});
export type CreateDonation = z.infer<typeof CreateDonationSchema>;

export const DonationReceiptSchema = z.object({
  id: z.string().uuid(),
  donation_id: z.string().uuid(),
  temple_id: z.string().uuid(),
  devotee_id: z.string().uuid().optional(),
  receipt_number: z.string(),
  amount: z.number().positive(),
  currency: z.string().default("USD"),
  donation_date: z.string().datetime(),
  donor_name: z.string(),
  donor_address: z
    .object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
      country: z.string(),
    })
    .optional(),
  temple_name: z.string(),
  temple_ein: z.string(),
  temple_address: z.string(),
  description: z.string(),
  is_goods_or_services: z.boolean().default(false),
  goods_or_services_value: z.number().default(0),
  goods_or_services_description: z.string().optional(),
  pdf_url: z.string().url().optional(),
  sent_at: z.string().datetime().optional(),
  created_at: z.string().datetime(),
});
export type DonationReceipt = z.infer<typeof DonationReceiptSchema>;

export const AnnualStatementSchema = z.object({
  id: z.string().uuid(),
  temple_id: z.string().uuid(),
  devotee_id: z.string().uuid(),
  year: z.number().int(),
  total_donations: z.number().nonnegative(),
  total_tax_deductible: z.number().nonnegative(),
  donation_count: z.number().int().nonnegative(),
  donations_summary: z.array(
    z.object({
      date: z.string(),
      amount: z.number(),
      type: DonationTypeEnum,
      receipt_number: z.string(),
    })
  ),
  pdf_url: z.string().url().optional(),
  sent_at: z.string().datetime().optional(),
  created_at: z.string().datetime(),
});
export type AnnualStatement = z.infer<typeof AnnualStatementSchema>;
