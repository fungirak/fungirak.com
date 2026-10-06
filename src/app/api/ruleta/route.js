// /api/ruleta — POST { accion: "girar", dispositivo } → { premio, token? } · POST { accion: "reclamar", token, email, nombre } → { codigo, vence }
// El sorteo y los códigos se hacen acá (servidor). El navegador nunca ve probabilidades ni puede inventar códigos.
import { hashIp, mismoOrigen, leerJSON, limpio, permitido } from "@/lib/db";
import { girar, reclamar } from "@/lib/ruleta";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const res = (data, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req) {
  if (!mismoOrigen(req)) return res({ error: "origen" }, 403);
  const b = await leerJSON(req, 2_000);
  if (!b) return res({ error: "formato" }, 400);
  if (b._hp) return res({ error: "ya-giraste" }); // trampa para robots
  const ip = hashIp(req);
  try {
    if (b.accion === "girar") {
      if (!permitido(`ruleta:${ip}`, 6, 60_000)) return res({ error: "despacio" }, 429);
      const dispositivo = limpio(b.dispositivo, 40).replace(/[^\w-]/g, "");
      if (dispositivo.length < 16) return res({ error: "formato" }, 400);
      const r = await girar(ip, dispositivo);
      return res(r, r.error === "ya-giraste" ? 409 : r.error ? 503 : 200);
    }
    if (b.accion === "reclamar") {
      if (!permitido(`ruleta-r:${ip}`, 5, 600_000)) return res({ error: "despacio" }, 429);
      const email = limpio(b.email, 120).toLowerCase();
      if (!EMAIL.test(email)) return res({ error: "email" }, 400);
      const r = await reclamar({ token: limpio(b.token, 40), email, nombre: limpio(b.nombre, 60), ipHash: ip });
      return res(r, r.error ? (r.error === "no-disponible" ? 503 : 409) : 200);
    }
    return res({ error: "accion" }, 400);
  } catch (e) {
    console.error(e);
    return res({ error: "servidor" }, 500);
  }
}
