// /api/ruleta/canje — POST { codigo } → { ok, dias } · Lo llama la cuenta FUNGIRAK (servidor a servidor) cuando alguien canjea su
// «1 mes de plan» de la ruleta. Marca el código usado en el mismo paso. Freno por conexión para que nadie pruebe códigos.
import { hashIp, leerJSON, limpio, permitido } from "@/lib/db";
import { canjearMes } from "@/lib/ruleta";

const res = (data, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
export async function POST(req) {
  if (!permitido(`ruleta-canje:${hashIp(req)}`, 30, 600_000)) return res({ error: "despacio" }, 429);
  const b = await leerJSON(req, 500);
  if (!b) return res({ error: "formato" }, 400);
  try {
    const r = await canjearMes(limpio(b.codigo, 20));
    return res(r, r.ok ? 200 : r.error === "no-disponible" ? 503 : 404);
  } catch (e) { console.error(e); return res({ error: "servidor" }, 500); }
}
