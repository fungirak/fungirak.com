// Elección de la idea ganadora desde el mail del Organizador. GET muestra una confirmación (así ningún filtro de correo
// que abra enlaces elige por su cuenta); POST, desde esa misma página, la registra y le avisa a quien ganó.
import { firmaValida, elegir } from "@/lib/sorteo";
import { mail, caja, esc, largo } from "@/lib/mail-concurso";
import { mismoOrigen } from "@/lib/db";

const html = (cuerpo, status = 200) => new Response(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Concurso de ideas</title><body style="margin:0;padding:24px;background:#05070f">${caja(cuerpo)}</body>`, { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
const params = async (req) => req.method === "POST" ? Object.fromEntries(new URLSearchParams(await req.text())) : Object.fromEntries(new URL(req.url).searchParams);

export async function GET(req) {
  const { f, c, k } = await params(req);
  if (!firmaValida(f, c, k)) return html("<p>Este enlace no es válido.</p>", 401);
  return html(`<h1 style="font-size:20px">¿Elegís la idea ${esc(c)}?</h1><p>Edición del ${esc(largo(f))}. Una vez elegida no se puede cambiar.</p>
    <form method="post"><input type="hidden" name="f" value="${esc(f)}"><input type="hidden" name="c" value="${esc(c)}"><input type="hidden" name="k" value="${esc(k)}">
    <button style="padding:12px 18px;border-radius:12px;border:0;background:#00e676;font-weight:700;cursor:pointer">Sí, elegir esta idea</button></form>`);
}

export async function POST(req) {
  if (!mismoOrigen(req)) return html("<p>Pedido inválido.</p>", 403);
  const { f, c, k } = await params(req);
  if (!firmaValida(f, c, k)) return html("<p>Este enlace no es válido.</p>", 401);
  const r = await elegir(f, c).catch((e) => ({ error: String(e?.message || e) }));
  if (r.error === "ya-elegida") return html(`<p>Esta edición ya tiene ganadora: <b>${esc(r.codigo)}</b>.</p>`);
  if (r.error) return html(`<p>No se pudo: ${esc(r.error)}.</p>`, 400);
  const aviso = await mail(r.email, "🏆 ¡Tu idea ganó el concurso de FUNGIRAK Studio!", caja(`
    <h1 style="font-size:22px;margin:0 0 12px">¡Ganó tu idea! 🎉</h1>
    <p>Hola${r.nombre ? ` ${esc(r.nombre)}` : ""}: tu idea <b style="font-family:monospace">${esc(r.codigo)}</b> fue elegida en la edición del ${esc(largo(r.fecha))}, entre ${r.ideas} ideas.</p>
    <p>Ganaste el <b>diseño y desarrollo de un sitio web informativo</b>, según las <a href="https://fungirak.com/sorteo" style="color:#00e676">bases del concurso</a>.</p>
    <p><b>Para reclamarlo, respondé este mail dentro de los próximos 7 días</b> confirmando que sos el titular de esta dirección.</p>
    <p>— Gabriel</p>`));
  return html(`<p>Listo: ganó <b>${esc(r.codigo)}</b> (${esc(r.email)}). ${aviso ? "Ya le mandamos el aviso." : "<b>No se pudo mandar el aviso: escribile vos.</b>"} El código ya figura en fungirak.com/sorteo.</p>`);
}
