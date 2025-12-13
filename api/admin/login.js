export default function handler(req, res) {
  // Solo permitimos POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { password } = req.body || {};

  // La contraseña va en variables de entorno (NO hardcodear en prod)
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_PASSWORD) {
    return res.status(500).json({
      error: "ADMIN_PASSWORD no configurada en Vercel",
    });
  }

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      ok: false,
      error: "Contraseña incorrecta",
    });
  }

  // Login OK
  return res.status(200).json({
    ok: true,
  });
}
