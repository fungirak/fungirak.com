// Tarea diaria (Vercel Cron, mediodía de Argentina): si hoy es fecha de sorteo y todavía no se hizo, sortea solo
// y avisa por email al ganador y a Gabriel. No necesita clave: no se puede sortear antes de la fecha ni repetirla.
import { sortear, FECHAS } from "@/lib/sorteo";

export const maxDuration = 30;
const hoy = () => new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);
const largo = (f) => new Date(`${f}T12:00:00-03:00`).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });

async function mail(to, subject, html, replyTo) {
  if (!process.env.RESEND_API_KEY) return false;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: "FUNGIRAK Studio <hola@fungirak.com>", to: [to], reply_to: replyTo || "fungirak@gmail.com", subject, html }),
  }).catch(() => null);
  return !!r?.ok;
}
const caja = (cuerpo) => `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;border-radius:18px;background:#0a0d1f;color:#f4f6ff">${cuerpo}<p style="color:#9298bf;font-size:12px;margin-top:22px">FUNGIRAK Studio · fungirak.com · <a href="https://fungirak.com/sorteo" style="color:#9298bf">Bases del sorteo</a></p></div>`;

export async function GET() {
  const fecha = hoy();
  if (!FECHAS.includes(fecha)) return Response.json({ ok: true, hoy: fecha, sorteo: "no es fecha" });
  const r = await sortear(fecha).catch((e) => ({ error: String(e.message || e) }));
  if (r.error) return Response.json({ ok: true, hoy: fecha, resultado: r.error });
  const fechaTxt = largo(fecha);
  const [aGanador, aGabriel] = await Promise.all([
    mail(r.email, "🏆 ¡Ganaste el sorteo de un sitio web de FUNGIRAK Studio!", caja(`
      <h1 style="font-size:22px;margin:0 0 12px">¡Ganaste! 🎉</h1>
      <p>Tu participación <b style="font-family:monospace">${r.codigo}</b> salió sorteada el ${fechaTxt} entre ${r.participaciones} participaciones.</p>
      <p>Ganaste el <b>diseño y desarrollo de un sitio web informativo</b> según las <a href="https://fungirak.com/sorteo" style="color:#00e676">bases y condiciones</a>.</p>
      <p><b>Para reclamarlo, respondé este email dentro de los próximos 7 días</b> confirmando que sos el titular de esta dirección. Si no hay respuesta en ese plazo, se sortea de nuevo.</p>
      <p>— Gabriel</p>`)),
    mail("fungirak@gmail.com", `🏆 Sorteo del ${fechaTxt}: ganó ${r.codigo}`, caja(`
      <h1 style="font-size:20px;margin:0 0 12px">Sorteo realizado</h1>
      <p>Fecha: <b>${fechaTxt}</b><br>Código ganador: <b style="font-family:monospace">${r.codigo}</b><br>Email: <b>${r.email}</b><br>Participaciones: ${r.participaciones}</p>
      <p>Ya le mandamos el aviso al ganador. Tiene 7 días para responder. El código ya figura en fungirak.com.</p>`), r.email),
  ]);
  return Response.json({ ok: true, hoy: fecha, codigo: r.codigo, participaciones: r.participaciones, avisos: { ganador: aGanador, gabriel: aGabriel } });
}
