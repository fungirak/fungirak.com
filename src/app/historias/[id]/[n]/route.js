// Cada historia como imagen vertical 1080×1920 (para subirla a Instagram): /historias/<app>/0 es la presentación y 1 a 5 las propias.
// Misma información y tipografía que el visor de la portada. Se cachea un día.
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { APPS_HISTORIAS, portadaDe, propiasDe, nombreDe, logoDe, colorDe, fuentesDe } from "@/data/historias";

export const dynamic = "force-dynamic"; // la caché la dan los encabezados (un día en el CDN)
// el color de la app, más claro arriba y más oscuro abajo (sin irse a negro)
const mezcla = (hex, con, k) => { const a = hex.replace("#", ""); return "#" + [0, 2, 4].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - k) + con * k).toString(16).padStart(2, "0")).join(""); };
const claro = (c) => mezcla(c, 255, 0.22), oscuro = (c) => mezcla(c, 0, 0.45);
const W = 1080, H = 1920;
const COL = { display: "flex", flexDirection: "column", alignItems: "center" }; // el generador no apila los fragmentos: cada grupo va en su columna
const fuentes = new Map();
// Google Fonts sin «user-agent» responde TTF, que es lo que entiende el generador de imágenes
async function fuente(nombre, peso) {
  const k = `${nombre}:${peso}`;
  if (!fuentes.has(k)) fuentes.set(k, (async () => {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${encodeURIComponent(nombre).replace(/%20/g, "+")}:wght@${peso}`, { signal: AbortSignal.timeout(6000) })).text();
    const url = css.match(/src: url\((https:[^)]+)\)/)?.[1];
    return url ? await (await fetch(url, { signal: AbortSignal.timeout(6000) })).arrayBuffer() : null;
  })().catch(() => null));
  return fuentes.get(k);
}
async function logo(p) {
  const l = logoDe(p);
  try {
    if (l.startsWith("/")) { const b = await readFile(join(process.cwd(), "public", l)); return `data:image/${l.endsWith(".svg") ? "svg+xml" : "png"};base64,${b.toString("base64")}`; }
    const r = await fetch(l, { signal: AbortSignal.timeout(5000) }); if (!r.ok) return null;
    const t = r.headers.get("content-type") || ""; if (!/png|jpe?g|svg/.test(t)) return null; // el generador no lee webp
    return `data:${t};base64,${Buffer.from(await r.arrayBuffer()).toString("base64")}`;
  } catch { return null; }
}

export async function GET(_req, { params }) {
  const { id, n } = await params;
  const p = APPS_HISTORIAS.find((x) => x.id === id), k = Number(n);
  if (!p || !Number.isInteger(k) || k < 0 || k > 5) return new Response("No existe", { status: 404 });
  const lang = "es", nombre = nombreDe(p, lang), c = colorDe(p), f = fuentesDe(p) || ["Unbounded", "Poppins"];
  const [titulo, texto, img] = await Promise.all([fuente(f[0], 800).then((x) => x || fuente(f[0], 400)), fuente(f[1], 400), logo(p)]);
  const fonts = [titulo && { name: "T", data: titulo, weight: 800 }, texto && { name: "B", data: texto, weight: 400 }].filter(Boolean);
  const s = k === 0 ? null : propiasDe(p, lang)[k - 1];
  const portada = portadaDe(p, lang);
  const icono = (t) => img ? <img alt="" src={img} width={t} height={t} style={{ borderRadius: t * 0.23, boxShadow: "0 30px 70px rgba(0,0,0,.35)", background: "#fff" }} />
    : <div style={{ width: t, height: t, borderRadius: t * 0.23, background: "rgba(255,255,255,.95)", color: c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: t * 0.5, fontFamily: "T" }}>{nombre[0]}</div>;
  const ojo = (t) => <div style={{ fontSize: 34, letterSpacing: 9, opacity: 0.8, fontFamily: "B", marginBottom: 30 }}>{t}</div>;
  const frase = (t, tam = 72) => <div style={{ fontSize: tam, lineHeight: 1.22, fontFamily: "T", textAlign: "center", maxWidth: 900 }}>{t}</div>;
  let cuerpo;
  if (!s) cuerpo = <div style={COL}>{icono(300)}<div style={{ fontSize: 96, fontFamily: "T", marginTop: 56, textAlign: "center", lineHeight: 1.05 }}>{nombre}</div>
    <div style={{ fontSize: 34, letterSpacing: 8, opacity: 0.85, fontFamily: "B", margin: "22px 0 70px" }}>FROM FUNGIRAK</div>{frase(portada.frase, 66)}
    {portada.sub ? <div style={{ fontSize: 40, opacity: 0.88, fontFamily: "B", marginTop: 34, textAlign: "center", maxWidth: 860, lineHeight: 1.4 }}>{portada.sub}</div> : null}</div>;
  else if (s.tipo === "dato") cuerpo = <div style={COL}>{ojo("EN NÚMEROS")}<div style={{ fontSize: 300, fontFamily: "T", lineHeight: 1 }}>{s.n}</div>{frase(s.texto, 66)}</div>;
  else if (s.tipo === "pills") cuerpo = <div style={COL}>{ojo(s.ojo)}<div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24, maxWidth: 920 }}>{s.items.map((x) => <div key={x} style={{ padding: "22px 38px", borderRadius: 999, background: "rgba(255,255,255,.16)", border: "3px solid rgba(255,255,255,.4)", fontSize: 44, fontFamily: "B" }}>{x}</div>)}</div></div>;
  else if (s.tipo === "entrar") cuerpo = <div style={COL}>{icono(250)}<div style={{ marginTop: 60, display: "flex" }}>{frase(s.texto, 76)}</div>
    {s.sub ? <div style={{ fontSize: 38, opacity: 0.92, fontFamily: "B", marginTop: 40, textAlign: "center", maxWidth: 880, lineHeight: 1.45 }}>{s.sub}</div> : null}
    <div style={{ marginTop: 56, padding: "34px 56px", borderRadius: 999, background: "#fff", color: "#111", fontSize: 46, fontFamily: "B" }}>{p.url.replace("https://", "")}</div></div>;
  else cuerpo = <div style={COL}>{s.emoji ? <div style={{ fontSize: 130, marginBottom: 30 }}>{s.emoji}</div> : null}{ojo(s.ojo)}{frase(s.texto, 78)}{s.sub && s.sub !== s.texto ? <div style={{ fontSize: 40, opacity: 0.88, fontFamily: "B", marginTop: 40, textAlign: "center", maxWidth: 860, lineHeight: 1.4 }}>{s.sub}</div> : null}</div>;
  return new ImageResponse(
    <div style={{ width: W, height: H, display: "flex", flexDirection: "column", color: "#fff", fontFamily: "B", background: `linear-gradient(180deg, ${claro(c)} 0%, ${c} 46%, ${oscuro(c)} 100%)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "70px 80px 0", fontSize: 36 }}>
        {k === 0 ? null : icono(84)}<div style={{ fontFamily: "T", fontSize: 40 }}>{k === 0 ? "fungirak" : nombre}</div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 90px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>{cuerpo}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", padding: "0 0 90px", fontSize: 34, opacity: 0.85, letterSpacing: 4, fontFamily: "B" }}>fungirak.com · FUNGIRAK STUDIO</div>
    </div>,
    { width: W, height: H, emoji: "twemoji", fonts: fonts.length ? fonts : undefined, headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400" } }
  );
}
