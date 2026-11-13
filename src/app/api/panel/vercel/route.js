import { accesoPanel } from "@/lib/panel-acceso";

// Publicaciones y límites (funciones 6 y 10): cuántos deploys se usaron en las últimas 24 h (el plan gratis da 100), el último
// de cada app y los que fallaron. Necesita VERCEL_TOKEN_TRABAJO (un token de solo lectura de la cuenta cuenta-work, que crea el
// dueño en vercel.com → Settings → Tokens). Sin token, el panel explica cómo cargarlo.
export const maxDuration = 30;
export async function GET(req) {
  const acc = await accesoPanel(req);
  if (acc.error) return Response.json({ error: acc.error }, { status: acc.status });
  const token = process.env.VERCEL_TOKEN_TRABAJO;
  if (!token) return Response.json({ sinToken: true }, { headers: { "Cache-Control": "no-store" } });
  const desde = Date.now() - 864e5;
  try {
    const r = await fetch(`https://api.vercel.com/v6/deployments?limit=100&since=${desde}`, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(15000), cache: "no-store" });
    if (!r.ok) return Response.json({ error: r.status === 403 || r.status === 401 ? "El token no sirve o venció." : `Vercel respondió ${r.status}.` }, { status: 502 });
    const ds = (await r.json()).deployments || [];
    const ultimo = {};
    for (const d of ds) if (!ultimo[d.name] || d.created > ultimo[d.name].creado) ultimo[d.name] = { app: d.name, estado: d.state || d.readyState, creado: d.created, url: d.url, commit: d.meta?.githubCommitMessage?.split("\n")[0]?.slice(0, 120) || null };
    const primeros = ds.map((d) => d.created).sort((a, b) => a - b);
    return Response.json({
      usados: ds.length, tope: 100,
      liberaEn: primeros.length ? primeros[0] + 864e5 : null,
      fallidos: ds.filter((d) => (d.state || d.readyState) === "ERROR").map((d) => ({ app: d.name, creado: d.created, commit: d.meta?.githubCommitMessage?.split("\n")[0]?.slice(0, 120) || null })),
      ultimos: Object.values(ultimo).sort((a, b) => b.creado - a.creado),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch { return Response.json({ error: "Vercel no respondió." }, { status: 504 }); }
}
