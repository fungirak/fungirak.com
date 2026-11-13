import { accesoPanel } from "@/lib/panel-acceso";
import { registrar } from "@/lib/auditoria";
import { APPS_PANEL } from "@/lib/panel-apps";

// Puente del panel hacia las apps: una sola puerta, con lista cerrada de apps y de rutas. Lo que lee (GET) pide la sesión o la
// clave; lo que cambia algo (POST/DELETE) pide la sesión con la Cuenta FUNGIRAK (dos pasos) y queda en la auditoría de fungirak.com
// y en la de la app. La llave maestra la pone el servidor: nunca viaja al navegador.
export const maxDuration = 30;
const CENTRALES = { cuenta: "https://cuenta.fungirak.com", correo: "https://correo.fungirak.com" };
const RUTAS_APP = [/^\/api\/moderacion(\?[\w=&%.-]*)?$/, /^\/api\/admin\/(personas|errores|uso)(\?[\w=&%.@-]*)?$/, /^\/api\/auditoria(\?[\w=&%.-]*)?$/];
const RUTAS_CENTRAL = { cuenta: [/^\/api\/admin(\?[\w=&%.@-]*)?$/], correo: [/^\/api\/admin(\/todas)?(\?[\w=&%.-]*)?$/, /^\/api\/studio$/] };
const intentos = new Map();
const ipDe = (req) => (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "?";

export async function POST(req) {
  const ip = ipDe(req), ahora = Date.now();
  const l = (intentos.get(ip) || []).filter((t) => ahora - t < 60e3);
  if (l.length >= 120) return Response.json({ error: "Demasiados pedidos seguidos." }, { status: 429 });
  l.push(ahora); intentos.set(ip, l); if (intentos.size > 2000) intentos.clear();

  let b = {}; try { b = await req.json(); } catch {}
  const metodo = String(b.metodo || "GET").toUpperCase();
  if (!["GET", "POST", "DELETE"].includes(metodo)) return Response.json({ error: "Método inválido." }, { status: 400 });
  const ruta = String(b.ruta || "");
  const base = CENTRALES[b.app] || APPS_PANEL.find((a) => a.id === b.app)?.url;
  const permitidas = CENTRALES[b.app] ? RUTAS_CENTRAL[b.app] : RUTAS_APP;
  if (!base || !permitidas.some((r) => r.test(ruta))) return Response.json({ error: "Ese pedido no está permitido." }, { status: 400 });

  const acc = await accesoPanel(req);
  if (acc.error) return Response.json({ error: acc.error }, { status: acc.status });
  if (metodo !== "GET" && !acc.sesion) return Response.json({ error: "Para hacer cambios entrá con tu Cuenta FUNGIRAK (dos pasos)." }, { status: 403 });
  const llave = acc.llave, sesion = acc.sesion ? "cuenta" : null;

  try {
    const r = await fetch(`${base}${ruta}`, {
      method: metodo, cache: "no-store", signal: AbortSignal.timeout(20000),
      headers: { "x-admin-key": llave, ...(metodo === "POST" ? { "Content-Type": "application/json" } : {}) },
      body: metodo === "POST" ? JSON.stringify(b.cuerpo || {}) : undefined,
    });
    const j = await r.json().catch(() => ({}));
    if (metodo !== "GET") await registrar(req, "panel.accion", { quien: sesion, app: b.app, ruta: ruta.split("?")[0], metodo, accion: b.cuerpo?.accion || null, ok: r.ok }).catch(() => {});
    return Response.json(j, { status: r.status, headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return Response.json({ error: e?.name === "TimeoutError" ? "La app no respondió a tiempo." : "Sin conexión con la app." }, { status: 504 });
  }
}
