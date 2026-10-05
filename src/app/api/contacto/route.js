import { guardarMensaje, mensajesRecientes, hashIp, mismoOrigen, sumar, leerJSON, limpio } from "@/lib/db";
import { LINKS } from "@/data/perfil";
import { ofensivas } from "@/lib/filtro";
import { segundaOpinion } from "@/lib/moderacion";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const INTERESES = {
  contratar: "Quiere contratarte / proponerte trabajo",
  proyecto: "Quiere un sitio o una app",
  llamada: "Quiere una llamada",
  colaborar: "Quiere colaborar en un proyecto",
  saludar: "Pasó a saludar",
};

export async function POST(req) {
  if (!mismoOrigen(req)) return Response.json({ ok: false, error: "origen" }, { status: 403 });

  const b = await leerJSON(req, 24_000);
  if (!b) return Response.json({ ok: false, error: "formato" }, { status: 400 });

  // Trampa para robots: si completan el campo oculto, se responde OK sin hacer nada
  if (b._hp) return Response.json({ ok: true });

  const m = {
    nombre: limpio(b.nombre, 80),
    email: limpio(b.email, 120),
    telefono: limpio(b.telefono, 40).replace(/[^\d+\-\s()]/g, ""),
    perfil: limpio(b.perfil, 30),
    interes: limpio(b.interes, 30),
    mensaje: limpio(b.mensaje, 6000, true),
    idioma: b.idioma === "en" ? "en" : "es",
    ip_hash: hashIp(req),
    brief: null,
  };
  // Brief de proyecto: se guarda tal cual (acotado) para leerlo después con detalle
  if (b.brief && typeof b.brief === "object") {
    const txt = JSON.stringify(b.brief);
    if (txt.length <= 8000) m.brief = JSON.parse(txt);
  }

  if (!m.nombre) return Response.json({ ok: false, error: "nombre" }, { status: 400 });
  if (!m.email && !m.telefono) return Response.json({ ok: false, error: "contacto" }, { status: 400 });
  if (m.email && !EMAIL.test(m.email)) return Response.json({ ok: false, error: "email" }, { status: 400 });

  // Lenguaje ofensivo: se revisa todo lo que escribió la persona (también el brief)
  const textos = [m.nombre, m.mensaje, ...(m.brief ? Object.values(m.brief).filter((v) => typeof v === "string") : [])].join(" · ");
  if (ofensivas(textos).length || (await segundaOpinion(`${m.nombre} ${m.mensaje}`))) return Response.json({ ok: false, error: "lenguaje" }, { status: 400 });

  let id = null;
  try {
    if ((await mensajesRecientes(m.ip_hash)) >= 5) return Response.json({ ok: false, error: "limite" }, { status: 429 });
    id = await guardarMensaje(m);
    await sumar("mensajes");
  } catch (e) {
    console.error("contacto/db", e);
  }

  // Aviso por mail a Gabriel (FormSubmit, gratis y sin clave)
  let enviado = false;
  try {
    const r = await fetch(`https://formsubmit.co/ajax/${LINKS.email}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", Origin: "https://fungirak.com", Referer: "https://fungirak.com/" },
      body: JSON.stringify({
        _subject: `🍄 fungirak.com${id ? ` #${id}` : ""} · ${m.nombre}: ${m.brief ? "Pedido de proyecto" : INTERESES[m.interes] || "Nuevo mensaje"}`,
        _template: "table",
        _captcha: "false",
        Nombre: m.nombre,
        Email: m.email || "-",
        Telefono: m.telefono || "-",
        Perfil: m.perfil || "-",
        Interes: INTERESES[m.interes] || m.interes || "-",
        Mensaje: m.mensaje || "-",
        Idioma: m.idioma,
        _replyto: m.email || undefined,
      }),
      signal: AbortSignal.timeout(8000),
    });
    const j = await r.json().catch(() => ({}));
    enviado = r.ok && String(j.success) !== "false";
  } catch (e) {
    console.error("contacto/mail", e);
  }

  return Response.json({ ok: true, enviado, id });
}
