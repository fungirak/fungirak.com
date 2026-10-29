// /api/sorteo — GET: estado público del concurso de ideas (cronograma, próxima edición, cuántas ideas, códigos ganadores).
// POST { email, nombre, idea }: mandar o corregir la idea para la próxima edición (una por email y por edición).
import { mismoOrigen, leerJSON, hashIp, permitido, limpio } from "@/lib/db";
import { estado, participar } from "@/lib/sorteo";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const res = (data, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

export async function GET() {
  try { return res(await estado()); } catch (e) { console.error(e); return res({ error: "servidor" }, 500); }
}

export async function POST(req) {
  if (!mismoOrigen(req)) return res({ error: "origen" }, 403);
  if (!permitido(`concurso:${hashIp(req)}`, 5, 3600_000)) return res({ error: "despacio" }, 429);
  const b = await leerJSON(req, 4_000);
  if (!b) return res({ error: "formato" }, 400);
  if (b._hp) return res({ ok: true }); // trampa para robots
  const email = limpio(b.email, 120).toLowerCase();
  if (!EMAIL.test(email)) return res({ error: "email" }, 400);
  if (b.acepto !== true) return res({ error: "bases" }, 400);
  try {
    const r = await participar({ email, nombre: limpio(b.nombre, 60), idea: limpio(b.idea, 1300, true), ipHash: hashIp(req) });
    return res(r, r.error ? (r.error === "no-disponible" ? 503 : 400) : 200);
  } catch (e) { console.error(e); return res({ error: "servidor" }, 500); }
}
