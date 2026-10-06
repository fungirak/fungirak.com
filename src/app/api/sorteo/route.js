// /api/sorteo — GET: estado público (cronograma, próximo, participaciones, códigos ganadores).
// POST { clave, fecha }: el dueño ejecuta el sorteo de esa fecha (clave en la variable SORTEO_CLAVE).
import { timingSafeEqual } from "node:crypto";
import { mismoOrigen, leerJSON, hashIp, permitido } from "@/lib/db";
import { estado, sortear } from "@/lib/sorteo";

const res = (data, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

export async function GET() {
  try { return res(await estado()); } catch (e) { console.error(e); return res({ error: "servidor" }, 500); }
}

export async function POST(req) {
  if (!mismoOrigen(req)) return res({ error: "origen" }, 403);
  if (!permitido(`sorteo:${hashIp(req)}`, 5, 3600_000)) return res({ error: "despacio" }, 429);
  const b = await leerJSON(req, 1_000);
  const clave = process.env.SORTEO_CLAVE || "";
  const dada = String(b?.clave || "");
  if (!clave || dada.length !== clave.length || !timingSafeEqual(Buffer.from(dada), Buffer.from(clave))) return res({ error: "clave" }, 401);
  try {
    const r = await sortear(String(b.fecha || ""));
    return res(r, r.error ? 409 : 200);
  } catch (e) { console.error(e); return res({ error: "servidor" }, 500); }
}
