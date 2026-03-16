import { z } from "zod";

export const TransactionTypeEnum = z.enum(["income", "expense"]);
export type TransactionType = z.infer<typeof TransactionTypeEnum>;

export const IncomeCategoryEnum = z.enum([
  "donation",
  "puja_booking",
  "event_registration",
  "membership",
  "rental",
  "interest",
  "other_income",
]);
export type IncomeCategory = z.infer<typeof IncomeCategoryEnum>;

export const ExpenseCategoryEnum = z.enum([
  "priest_salary",
  "staff_salary",
  "utilities",
  "maintenance",
  "puja_supplies",
  "food_prasadam",
  "insurance",
  "taxes",
  "equipment",
  "marketing",
  "software",
  "rent_mortgage",
  "events",
  "charity",
  "other_expense",
]);
export type ExpenseCategory = z.infer<typeof ExpenseCategoryEnum>;

export const FinanceTransactionSchema = z.object({
  id: z.string().uuid(),
  temple_id: z.string().uuid(),
  type: TransactionTypeEnum,
  category: z.string(),
  amount: z.number().positive(),
  currency: z.string().default("USD"),
  description: z.string().min(1),
  transaction_date: z.string(),
  reference_number: z.string().optional(),
  donation_id: z.string().uuid().optional(),
  booking_id: z.string().uuid().optional(),
  vendor_name: z.string().optional(),
  payment_method: z.string().optional(),
  receipt_url: z.string().url().optional(),
  notes: z.string().optional(),
  approved_by: z.string().uuid().optional(),
  fund: z.string().default("general"),
  is_recurring: z.boolean().default(false),
  recurrence_rule: z.string().optional(),
  created_by: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type FinanceTransaction = z.infer<typeof FinanceTransactionSchema>;

export const CreateFinanceTransactionSchema = FinanceTransactionSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export type CreateFinanceTransaction = z.infer<typeof CreateFinanceTransactionSchema>;

export const FinanceSummarySchema = z.object({
  temple_id: z.string().uuid(),
  period_start: z.string(),
  period_end: z.string(),
  total_income: z.number().nonnegative(),
  total_expenses: z.number().nonnegative(),
  net_income: z.number(),
  income_by_category: z.record(z.number()),
  expenses_by_category: z.record(z.number()),
  income_by_fund: z.record(z.number()),
  expenses_by_fund: z.record(z.number()),
  donation_count: z.number().int().nonnegative(),
  booking_count: z.number().int().nonnegative(),
  average_donation: z.number().nonnegative(),
});
export type FinanceSummary = z.infer<typeof FinanceSummarySchema>;
