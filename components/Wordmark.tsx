/** Text wordmark for the concept. Deliberately not SPCA's logo. */
export function Wordmark({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const text = tone === "dark" ? "text-navy" : "text-cream";
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className={`font-serif text-[26px] font-bold leading-none tracking-tight ${text}`}>SPCA</span>
      <span className="size-2 rounded-full bg-orange" aria-hidden />
      <span className={`text-[11px] font-extrabold uppercase tracking-[0.16em] ${tone === "dark" ? "text-muted" : "text-mist"}`}>
        concept
      </span>
    </span>
  );
}
