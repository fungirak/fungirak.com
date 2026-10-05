import { leerMuro, publicarMuro, publicacionesRecientes, accionMuro, hashIp, permitido, mismoOrigen } from "@/lib/db";
import { revisar, EMOJIS } from "@/lib/moderacion";
import { LINKS } from "@/data/perfil";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return Response.json(await leerMuro(), { headers: { "Cache-Control": "public, s-maxage=15, stale-while-revalidate=60" } });
  } catch (e) {
    console.error("muro/get", e);
    return Response.json({ huellas: [], ideas: [] });
  }
}

export async function POST(req) {
  if (!mismoOrigen(req)) return Response.json({ ok: false }, { status: 403 });
  let b = {};
  try {
    b = await req.json();
  } catch {}
  const ip = hashIp(req);

  // Votar una idea o reportar algo
  if (b.accion === "votar" || b.accion === "reportar") {
    const id = Number(b.id);
    if (!Number.isInteger(id) || id < 1) return Response.json({ ok: false }, { status: 400 });
    if (!permitido(`${ip}:${b.accion}:${id}`, 1, 86400_000)) return Response.json({ ok: true, repetido: true });
    try {
      const v = await accionMuro(id, b.accion);
      return Response.json({ ok: true, votos: typeof v === "number" ? v : undefined });
    } catch (e) {
      console.error("muro/accion", e);
      return Response.json({ ok: false }, { status: 500 });
    }
  }

  if (b._hp) return Response.json({ ok: true });
  const tipo = b.tipo === "idea" ? "idea" : "huella";
  const texto = typeof b.texto === "string" ? b.texto.trim().replace(/\s+/g, " ").slice(0, tipo === "idea" ? 280 : 180) : "";
  const nombre = typeof b.nombre === "string" && b.nombre.trim() ? b.nombre.trim().slice(0, 30) : null;
  const emoji = EMOJIS.includes(b.emoji) ? b.emoji : "🍄";
  if (texto.length < 3) return Response.json({ ok: false, error: "corto" }, { status: 400 });
  const motivo = revisar(`${nombre || ""} ${texto}`);
  if (motivo) return Response.json({ ok: false, error: motivo }, { status: 400 });

  try {
    if ((await publicacionesRecientes(ip)) >= 4) return Response.json({ ok: false, error: "limite" }, { status: 429 });
    const item = await publicarMuro({ tipo, nombre, emoji, texto, ip_hash: ip });
    // Las ideas de sitios le llegan a Gabriel por mail
    if (tipo === "idea") {
      await fetch(`https://formsubmit.co/ajax/${LINKS.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json", Origin: "https://www.fungirak.com", Referer: "https://www.fungirak.com/" },
        body: JSON.stringify({ _subject: `💡 fungirak.com · Idea de sitio #${item.id}`, _template: "table", _captcha: "false", Idea: texto, Firma: nombre || "Anónimo", Icono: emoji }),
        signal: AbortSignal.timeout(6000),
      }).catch(() => {});
    }
    return Response.json({ ok: true, item });
  } catch (e) {
    console.error("muro/post", e);
    return Response.json({ ok: false, error: "error" }, { status: 500 });
  }
}
