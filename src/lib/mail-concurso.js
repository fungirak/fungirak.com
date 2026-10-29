import "server-only";
// Mails del concurso de ideas (Resend). Sin clave de Resend no manda nada y devuelve false.
export const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
export async function mail(to, subject, html, replyTo) {
  if (!process.env.RESEND_API_KEY || !to) return false;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: "FUNGIRAK Studio <hola@fungirak.com>", to: [to], reply_to: replyTo || "fungirak@gmail.com", subject, html }),
  }).catch(() => null);
  return !!r?.ok;
}
export const caja = (cuerpo) => `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;border-radius:18px;background:#0a0d1f;color:#f4f6ff">${cuerpo}<p style="color:#9298bf;font-size:12px;margin-top:22px">FUNGIRAK Studio · fungirak.com · <a href="https://fungirak.com/sorteo" style="color:#9298bf">Bases del concurso</a></p></div>`;
export const largo = (f) => new Date(`${f}T12:00:00-03:00`).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
