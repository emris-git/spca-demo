// Password gate for the private demo. The only secret is DEMO_PASSWORD (a Vercel env var).
// The session cookie is `v1.<expiry>.<HMAC-SHA256(expiry)>`, keyed by the password, so
// changing the password invalidates every existing session. Web Crypto only, so it runs in
// the proxy and in route handlers alike.

export const AUTH_COOKIE = "spca_demo_auth";
export const SESSION_SECONDS = 60 * 60 * 24 * 14;

const encoder = new TextEncoder();

function toBase64Url(bytes: ArrayBuffer) {
  let s = "";
  for (const b of new Uint8Array(bytes)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(secret: string, message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(`spca-demo-session:${secret}`),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toBase64Url(await crypto.subtle.sign("HMAC", key, encoder.encode(message)));
}

/** Constant-time comparison of two strings (compares SHA-256 digests). */
export async function safeEqual(a: string, b: string) {
  const [da, db] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(a)),
    crypto.subtle.digest("SHA-256", encoder.encode(b)),
  ]);
  const x = new Uint8Array(da);
  const y = new Uint8Array(db);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

export function getDemoPassword(): string | null {
  const p = process.env.DEMO_PASSWORD;
  return p && p.length > 0 ? p : null;
}

export async function createSessionToken(password: string, now = Date.now()) {
  const expiry = Math.floor(now / 1000) + SESSION_SECONDS;
  return `v1.${expiry}.${await hmac(password, `v1.${expiry}`)}`;
}

export async function verifySessionToken(token: string | undefined, password: string | null) {
  if (!token || !password) return false;
  const [version, expiryRaw, signature] = token.split(".");
  if (version !== "v1" || !expiryRaw || !signature) return false;
  const expiry = Number(expiryRaw);
  if (!Number.isFinite(expiry) || expiry * 1000 < Date.now()) return false;
  return safeEqual(signature, await hmac(password, `v1.${expiry}`));
}

/** Only allow same-site relative paths as a post-login destination. */
export function safeNextPath(value: unknown) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return "/";
  }
  if (value.startsWith("/password") || value.startsWith("/api/")) return "/";
  return value;
}
