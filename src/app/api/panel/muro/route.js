// Moderación del muro de fungirak.com desde el panel: lo que quedó en revisión (inglés, tecleo al azar, enlaces o 3 reportes) se
// aprueba o se borra acá. La contraseña maestra se valida contra el correo central, igual que el panel (no se guarda acá).
import { sql } from "@/lib/db";
import { registrar } from "@/lib/auditoria";

const CORREO = "https://correo.fungirak.com/api/admin";
const intentos = new Map();
const ipDe = (req) => (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "?";

async function autorizado(req) {
  const ip = ipDe(req), ahora = Date.now();
  const l = (intentos.get(ip) || []).filter((t) => ahora - t < 15 * 60e3);
  if (l.length >= 40) return { error: "Demasiados pedidos. Esperá unos minutos.", status: 429 };
  l.push(ahora); intentos.set(ip, l); if (intentos.size > 2000) intentos.clear();
  const llave = req.headers.get("x-admin-key") || "";
  if (llave.length < 16 || llave.length > 200) return { error: "Contraseña incorrecta.", status: 401 };
  try {
    const r = await fetch(CORREO, { headers: { "x-admin-key": llave }, cache: "no-store", signal: AbortSignal.timeout(9000) });
    return r.ok ? null : { error: r.status === 429 ? "Demasiados intentos. Esperá 15 minutos." : "Contraseña incorrecta.", status: r.status === 429 ? 429 : 401 };
  } catch { return { error: "El correo central no responde: probá en un rato.", status: 503 }; }
}
const no = (e) => Response.json({ error: e.error }, { status: e.status, headers: { "Cache-Control": "no-store" } });

// Lo que está en revisión (las 60 más nuevas).
export async function GET(req) {
  const e = await autorizado(req); if (e) return no(e);
  if (!sql) return Response.json({ pendientes: [] });
  const pendientes = await sql`SELECT id, tipo, creado, nombre, emoji, texto, reportes FROM muro WHERE NOT visible ORDER BY creado DESC LIMIT 60`.catch(() => []);
  return Response.json({ pendientes }, { headers: { "Cache-Control": "no-store" } });
}

// { id, accion: "aprobar" | "borrar" }
export async function POST(req) {
  const e = await autorizado(req); if (e) return no(e);
  const b = await req.json().catch(() => ({}));
  const id = Number(b.id);
  if (!sql || !Number.isInteger(id) || !["aprobar", "borrar"].includes(b.accion)) return Response.json({ error: "Pedido inválido." }, { status: 400 });
  if (b.accion === "aprobar") await sql`UPDATE muro SET visible = true, reportes = 0 WHERE id = ${id}`;
  else await sql`DELETE FROM muro WHERE id = ${id}`;
  await registrar(req, "moderacion.accion", { muro: id, accion: b.accion });
  return Response.json({ ok: true });
}
