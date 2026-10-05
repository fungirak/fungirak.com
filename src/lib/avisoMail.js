"use client";
// Aviso por mail a Gabriel vía FormSubmit (gratis, sin clave). Se manda desde el navegador del visitante
// porque FormSubmit rechaza pedidos desde servidores. El mensaje ya quedó guardado en la base antes de esto.
const DESTINO = "https://formsubmit.co/ajax/fungirak@gmail.com";

export async function avisarPorMail(asunto, campos, responderA) {
  if (await enviarUnaVez(asunto, campos, responderA)) return true;
  await new Promise((r) => setTimeout(r, 2500));
  return enviarUnaVez(asunto, campos, responderA);
}

async function enviarUnaVez(asunto, campos, responderA) {
  try {
    const r = await fetch(DESTINO, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ _subject: asunto, _template: "table", _captcha: "false", ...(responderA ? { _replyto: responderA } : {}), ...campos }),
      signal: AbortSignal.timeout(10000),
    });
    const j = await r.json().catch(() => ({}));
    return r.ok && String(j.success) === "true";
  } catch {
    return false;
  }
}
