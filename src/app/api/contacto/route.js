import { guardarMensaje, mensajesRecientes, hashIp, mismoOrigen, sumar } from "@/lib/db";
import { LINKS } from "@/data/perfil";

const limpiar = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
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

  let b;
  try {
    b = await req.json();
  } catch {
    return Response.json({ ok: false, error: "formato" }, { status: 400 });
  }

  // Trampa para robots: si completan el campo oculto, se responde OK sin hacer nada
  if (b._hp) return Response.json({ ok: true });

  const m = {
    nombre: limpiar(b.nombre, 80),
    email: limpiar(b.email, 120),
    telefono: limpiar(b.telefono, 40),
    perfil: limpiar(b.perfil, 30),
    interes: limpiar(b.interes, 30),
    mensaje: limpiar(b.mensaje, 6000),
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
      headers: { "Content-Type": "application/json", Accept: "application/json", Origin: "https://www.fungirak.com", Referer: "https://www.fungirak.com/" },
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
