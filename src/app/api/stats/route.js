import { leerContadores, sumar, hashIp, permitido, mismoOrigen, leerJSON } from "@/lib/db";
import { PROYECTOS } from "@/data/proyectos";

const IDS = new Set(PROYECTOS.map((p) => p.id));

export async function GET() {
  try {
    const c = await leerContadores();
    const aplausos = {};
    for (const [k, v] of Object.entries(c)) if (k.startsWith("aplauso:")) aplausos[k.slice(8)] = v;
    return Response.json(
      { visitas: c.visitas || 0, pasaportes: c.pasaportes || 0, mensajes: c.mensajes || 0, aplausos },
      { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" } }
    );
  } catch (e) {
    console.error("stats/get", e);
    return Response.json({ visitas: 0, pasaportes: 0, mensajes: 0, aplausos: {} });
  }
}

export async function POST(req) {
  if (!mismoOrigen(req)) return Response.json({ ok: false }, { status: 403 });
  const b = (await leerJSON(req, 1_000)) || {};
  const ip = hashIp(req);
  let clave = null;
  if (b.evento === "visita") clave = "visitas";
  else if (b.evento === "pasaporte") clave = "pasaportes";
  else if (b.evento === "aplauso" && IDS.has(b.id)) clave = `aplauso:${b.id}`;
  if (!clave) return Response.json({ ok: false }, { status: 400 });

  const limite = clave === "visitas" ? [3, 3600_000] : clave === "pasaportes" ? [1, 86400_000] : [10, 60_000];
  if (!permitido(`${ip}:${clave}`, ...limite)) return Response.json({ ok: true, limitado: true });

  try {
    const valor = await sumar(clave);
    return Response.json({ ok: true, valor });
  } catch (e) {
    console.error("stats/post", e);
    return Response.json({ ok: false }, { status: 500 });
  }
}
