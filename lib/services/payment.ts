// PaymentService — one-off and monthly gifts with wallets and cards.
// Mock: nothing is charged and no card details are ever collected. `confirm` waits a
// moment and returns a fake receipt number.
// Real: a PCI-compliant gateway (e.g. Stripe or Windcave) with Apple Pay and Google Pay,
// hosted card fields so card data never touches SPCA's servers, recurring billing for
// monthly gifts, and webhooks into the CRM for receipts and the tax-credit statement.

export type PaymentMethod = "apple-pay" | "google-pay" | "card";
export type Frequency = "once" | "monthly";

export const METHOD_LABEL: Record<PaymentMethod, string> = {
  "apple-pay": "Apple Pay",
  "google-pay": "Google Pay",
  card: "Card",
};

export type MockReceipt = { reference: string; amount: number; frequency: Frequency; method: PaymentMethod };

export const PaymentService = {
  methods(): PaymentMethod[] {
    return ["apple-pay", "google-pay", "card"];
  },
  async confirm(amount: number, frequency: Frequency, method: PaymentMethod): Promise<MockReceipt> {
    await new Promise((r) => setTimeout(r, 1200));
    return { reference: `DEMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, amount, frequency, method };
  },
};

/** NZ donation tax credit: a third of eligible gifts of $5 or more. */
export const taxCredit = (amount: number) => (amount >= 5 ? Math.floor((amount / 3) * 100) / 100 : 0);
