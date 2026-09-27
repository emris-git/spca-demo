export function money(amount: number, opts: { cents?: boolean } = {}) {
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: opts.cents ? 2 : 0,
    minimumFractionDigits: opts.cents ? 2 : 0,
  }).format(amount);
}

export const number = (n: number) => new Intl.NumberFormat("en-NZ").format(n);

export function distance(km: number) {
  if (km < 1) return "under 1 km";
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

export function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}
