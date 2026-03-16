import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

export async function createConnectedAccount(
  templeName: string,
  templeEmail: string
): Promise<Stripe.Account> {
  return stripe.accounts.create({
    type: "standard",
    country: "US",
    email: templeEmail,
    business_type: "non_profit",
    company: {
      name: templeName,
    },
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });
}

export async function createAccountLink(
  accountId: string,
  returnUrl: string,
  refreshUrl: string
): Promise<Stripe.AccountLink> {
  return stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: "account_onboarding",
  });
}

export async function createPaymentIntent(
  amount: number,
  currency: string,
  connectedAccountId: string,
  metadata: Record<string, string>
): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    metadata,
    transfer_data: {
      destination: connectedAccountId,
    },
  });
}

export async function createDonationSubscription(
  customerId: string,
  priceId: string,
  connectedAccountId: string,
  metadata: Record<string, string>
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    metadata,
    transfer_data: {
      destination: connectedAccountId,
    },
  });
}

export async function createCustomer(
  email: string,
  name: string,
  metadata: Record<string, string>
): Promise<Stripe.Customer> {
  return stripe.customers.create({
    email,
    name,
    metadata,
  });
}
