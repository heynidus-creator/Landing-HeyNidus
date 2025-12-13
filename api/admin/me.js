export default function handler(req, res) {
  // Evita 304 / cache del CDN (CRÍTICO para auth)
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Pragma", "no-cache");

  const cookie = req.headers.cookie || "";
  const authenticated = cookie.includes("admin_session=1");

  res.status(200).json({ authenticated });
}
