// Tarea diaria (Vercel Cron, mediodía de Argentina) del concurso de ideas: el día de cada edición le manda a Gabriel
// las ideas con un botón firmado para elegir la ganadora (nada se decide al azar). También avisa una sola vez del cambio
// de sorteo a concurso a quien tenía un número del sorteo anterior, y borra lo vencido según la política.
import { FECHAS, ideasDe, firma, participantesViejosSinAviso, marcarAvisado } from "@/lib/sorteo";
import { mail, caja, esc, largo } from "@/lib/mail-concurso";
import { sql } from "@/lib/db";

export const maxDuration = 30;
const hoy = () => new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);

// Plazos de la política (cuenta.fungirak.com/legal/sitios): mensajes de «Hablemos», 24 meses; mails de la ruleta, 26 meses.
// Los ganadores quedan en sorteo_resultados para no volver a participar.
async function borrarVencidos() {
  if (!sql) return;
  await sql`DELETE FROM mensajes WHERE creado < now() - interval '24 months'`.catch(() => {});
  await sql`DELETE FROM ruleta_cupones WHERE creado < now() - interval '26 months'`.catch(() => {});
  await sql`DELETE FROM concurso_ideas WHERE creado < now() - interval '26 months'`.catch(() => {});
}

async function avisarCambio() {
  for (const { email } of await participantesViejosSinAviso().catch(() => [])) {
    const ok = await mail(email, "Cambió el sorteo de FUNGIRAK: ahora es un concurso de ideas", caja(`
      <h1 style="font-size:20px;margin:0 0 12px">Ahora gana la mejor idea</h1>
      <p>Tenías un número para el sorteo de un sitio web de FUNGIRAK Studio. Lo cambiamos por un <b>concurso de ideas</b>: el premio es el mismo, pero en lugar de sortearlo, cada dos meses gana la idea más original, útil y con más impacto.</p>
      <p>Para seguir participando, mandá tu idea (dos o tres líneas alcanzan) desde <a href="https://fungirak.com/sorteo" style="color:#00e676">fungirak.com/sorteo</a> con este mismo mail.</p>
      <p>— Gabriel</p>`));
    if (ok) await marcarAvisado(email).catch(() => {});
  }
}

export async function GET() {
  await borrarVencidos();
  await avisarCambio();
  const fecha = hoy();
  if (!FECHAS.includes(fecha)) return Response.json({ ok: true, hoy: fecha, concurso: "no es fecha" });
  const ideas = await ideasDe(fecha).catch(() => []);
  const lista = ideas.length
    ? ideas.map((x) => `<div style="border:1px solid #2a2f55;border-radius:12px;padding:12px;margin:10px 0">
        <b style="font-family:monospace">${esc(x.codigo)}</b>${x.nombre ? ` · ${esc(x.nombre)}` : ""} · ${esc(x.email)}
        <p style="white-space:pre-wrap;margin:8px 0">${esc(x.idea)}</p>
        <a href="https://fungirak.com/api/sorteo/elegir?${new URLSearchParams({ f: fecha, c: x.codigo, k: firma(fecha, x.codigo) })}" style="color:#00e676;font-weight:700">Elegir esta idea →</a></div>`).join("")
    : "<p>No llegó ninguna idea para esta edición: no hay ganador.</p>";
  const enviado = await mail("fungirak@gmail.com", `💡 Concurso del ${largo(fecha)}: ${ideas.length} ${ideas.length === 1 ? "idea" : "ideas"} para elegir`, caja(`
    <h1 style="font-size:20px;margin:0 0 12px">Elegí la idea ganadora</h1>
    <p>Criterios publicados: originalidad, utilidad, impacto local y claridad. Tocá «Elegir esta idea» en la que gane; se publica su código y le avisamos por mail.</p>${lista}`));
  return Response.json({ ok: true, hoy: fecha, ideas: ideas.length, aviso: enviado });
}
