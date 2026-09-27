// SupporterService — every form that would create or update a supporter record.
// Mock: nothing is sent anywhere. Each call waits briefly and returns a fake reference.
// Real: the CRM (SPCA's CRM is not publicly known — an assumption to validate), with
// consent captured per purpose, bequest enquiries routed to the Gifts in Wills team,
// cruelty reports routed to the Inspectorate's case system, and event sign-ups synced
// with the events platform.

export type SupporterRequest =
  | { kind: "bequest-pack"; delivery: "email" | "post" }
  | { kind: "cruelty-report"; urgency: "non-urgent" }
  | { kind: "event-signup"; eventId: string }
  | { kind: "volunteer-interest"; role: string }
  | { kind: "foster-interest" }
  | { kind: "monthly-upgrade"; amount: number }
  | { kind: "adoption-application"; animalId: string };

export const SupporterService = {
  async submit(request: SupporterRequest): Promise<{ reference: string }> {
    await new Promise((r) => setTimeout(r, 700));
    const prefix = request.kind.split("-").map((w) => w[0]).join("").toUpperCase();
    return { reference: `${prefix}-${Math.floor(100000 + Math.random() * 900000)}` };
  },
};
