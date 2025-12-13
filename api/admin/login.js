export default function handler(req, res) {
  // Evita cache (CRÍTICO)
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Pragma", "no-cache");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { password } = req.body || {};
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "HEYNIDUS+google/2025";

  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ authenticated: false });
  }

  // Cookie para Vercel (HTTPS → Secure)
  const oneWeek = 60 * 60 * 24 * 7;

  res.setHeader("Set-Cookie", [
    `admin_session=1; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${oneWeek}`,
  ]);

  return res.status(200).json({ authenticated: true });
}
