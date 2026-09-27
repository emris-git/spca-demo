// Shared class recipes. Every interactive element is at least 44px tall.
const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-extrabold leading-tight transition-colors disabled:cursor-not-allowed disabled:opacity-60";

export const btn = {
  primary: `${base} bg-blue text-white hover:bg-blue-dark`,
  accent: `${base} bg-orange text-navy hover:bg-[#e8943a]`,
  dark: `${base} bg-navy text-cream hover:bg-navy-2`,
  secondary: `${base} border-2 border-navy/15 bg-paper text-navy hover:border-navy/40`,
  onDark: `${base} border-2 border-cream/30 text-cream hover:border-cream/70`,
  danger: `${base} bg-danger text-white hover:bg-[#8f1e18]`,
};

export const card = "rounded-3xl border border-line bg-paper";
export const eyebrow = "text-[13px] font-extrabold uppercase tracking-[0.14em] text-blue";
export const container = "mx-auto w-full max-w-6xl px-4 sm:px-6";
