import { accesoPanel } from "@/lib/panel-acceso";
import { APPS_PANEL } from "@/lib/panel-apps";

// Dominios (función 28): para cada subdominio de fungirak.com, a dónde apunta el DNS (Google DNS) y si responde por HTTPS.
export const maxDuration = 60;
const EXTRA = ["fungirak.com", "cuenta.fungirak.com", "correo.fungirak.com", "rio.fungirak.com", "pulso.fungirak.com", "nebula.fungirak.com", "fabrica.fungirak.com",
  "dertin.fungirak.com", "atlasfit-pro.fungirak.com", "carta-al-futuro.fungirak.com", "sin-vueltas.fungirak.com", "cronicasdefungi.fungirak.com", "ecos-map.fungirak.com",
  "tribus.fungirak.com", "escueladelasador.fungirak.com", "atalaya.fungirak.com"];

async function revisar(host) {
  const t0 = Date.now();
  const dns = await fetch(`https://dns.google/resolve?name=${host}&type=A`, { signal: AbortSignal.timeout(6000), cache: "no-store" }).then((r) => r.json()).catch(() => null);
  const resp = (dns?.Answer || []).map((a) => String(a.data).replace(/\.$/, ""));
  let https = 0, ms = null;
  try { const r = await fetch(`https://${host}/`, { method: "HEAD", redirect: "manual", signal: AbortSignal.timeout(8000), cache: "no-store" }); https = r.status; ms = Date.now() - t0; } catch {}
  const vercel = resp.some((x) => /vercel-dns\.com$|^76\.76\.21\.|^66\.33\.60\./.test(x));
  return { host, apunta: resp.slice(0, 3), vercel, https, ms, ok: !!resp.length && https > 0 && https < 500 };
}

export async function GET(req) {
  const acc = await accesoPanel(req);
  if (acc.error) return Response.json({ error: acc.error }, { status: acc.status });
  const hosts = [...new Set([...APPS_PANEL.map((a) => new URL(a.url).host), ...EXTRA])].sort();
  const out = []; let i = 0;
  await Promise.all(Array.from({ length: 8 }, async () => { while (i < hosts.length) out.push(await revisar(hosts[i++])); }));
  return Response.json({ dominios: out.sort((a, b) => a.ok - b.ok || a.host.localeCompare(b.host)), generado: new Date().toISOString() }, { headers: { "Cache-Control": "no-store" } });
}
