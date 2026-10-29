// Cada historia como imagen vertical 1080×1920 (para subirla a Instagram): /historias/<app>/0 es la presentación y 1 a 5 las propias.
// Misma información y tipografía que el visor de la portada. Se cachea un día.
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { APPS_HISTORIAS, portadaDe, propiasDe, nombreDe, logoDe, colorDe, fuentesDe, trazoDe } from "@/data/historias";
import { tileDe } from "@/data/cards-fondo";

export const dynamic = "force-dynamic"; // la caché la dan los encabezados (un día en el CDN)
// el color de la app, más claro arriba y más oscuro abajo (sin irse a negro)
export const mezcla = (hex, con, k) => { const a = hex.replace("#", ""); return "#" + [0, 2, 4].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - k) + con * k).toString(16).padStart(2, "0")).join(""); };
export const claro = (c) => mezcla(c, 255, 0.22), oscuro = (c) => mezcla(c, 0, 0.45);
const W = 1080, H = 1920;
// El papel tapiz de la app (los mismos dibujitos de su card) como una imagen del tamaño de la historia.
// Satori no repite fondos: el SVG trae su propio <pattern>.
export function tapizSVG(p, W, H, op) {
  const t = tileDe(p.id, trazoDe(p));
  if (!t) return null;
  const adentro = t.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><pattern id="t" width="158" height="158" patternUnits="userSpaceOnUse"><g transform="scale(2.2)">${adentro}</g></pattern></defs><rect width="100%" height="100%" fill="url(#t)" opacity="${op}"/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
// El pie de cada imagen: fungirak.com, abajo FUNGIRAK STUDIO, y el honguito chiquito en gris (la marca).
const HONGO = `data:image/svg+xml;base64,${Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3.5 12.2C3.5 7.5 7.3 3.6 12 3.6s8.5 3.9 8.5 8.6z" fill="#9aa0a8"/><path d="M9.6 12.6h4.8v5.6a2.4 2.4 0 0 1-4.8 0z" fill="#9aa0a8"/><circle cx="8.6" cy="8.9" r="1.1" fill="#fff" opacity=".7"/><circle cx="13.6" cy="7" r="1.2" fill="#fff" opacity=".7"/><circle cx="16.4" cy="10" r=".9" fill="#fff" opacity=".7"/></svg>').toString("base64")}`;
export const pie = (abajo, blanco) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: `0 0 ${abajo}px`, fontFamily: "B", color: blanco ? "#4b5563" : "#fff" }}>
    <img alt="" src={HONGO} width={46} height={46} style={{ opacity: 0.9, marginBottom: 4 }} />
    <div style={{ fontSize: 34, opacity: 0.92, letterSpacing: 1 }}>fungirak.com</div>
    <div style={{ fontSize: 24, opacity: 0.7, letterSpacing: 7 }}>FUNGIRAK STUDIO</div>
  </div>
);
// Los emojis que flotan alrededor del texto (los mismos del visor), afuera del texto: arriba a la izquierda, arriba a la derecha y abajo.
const LUGARES = [[0.08, 0.24, -12, 132], [0.8, 0.3, 10, 116], [0.16, 0.72, 6, 124]];
export const decos = (lista = [], W, H, lugares = LUGARES) => lugares.slice(0, lista.length).map(([x, y, g, t], i) => (
  <div key={i} style={{ position: "absolute", left: Math.round(W * x), top: Math.round(H * y), fontSize: t, transform: `rotate(${g}deg)`, display: "flex" }}>{lista[i]}</div>
));
// Dónde va el celular en la historia con la app funcionando (1080 × 1920): lo usa también el armado del video para Instagram.
export const CEL = { x: 307, y: 560, w: 466, h: 1000 };
async function posterDe(s) {
  try { const b = await readFile(join(process.cwd(), "public", `${s.video}.jpg`)); return `data:image/jpeg;base64,${b.toString("base64")}`; } catch { return null; }
}
export const COL = { display: "flex", flexDirection: "column", alignItems: "center" }; // el generador no apila los fragmentos: cada grupo va en su columna
const fuentes = new Map();
// Google Fonts sin «user-agent» responde TTF, que es lo que entiende el generador de imágenes
export async function fuente(nombre, peso) {
  const k = `${nombre}:${peso}`;
  if (!fuentes.has(k)) fuentes.set(k, (async () => {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${encodeURIComponent(nombre).replace(/%20/g, "+")}:wght@${peso}`, { signal: AbortSignal.timeout(6000) })).text();
    const url = css.match(/src: url\((https:[^)]+)\)/)?.[1];
    return url ? await (await fetch(url, { signal: AbortSignal.timeout(6000) })).arrayBuffer() : null;
  })().catch(() => null));
  return fuentes.get(k);
}
export async function logo(p) {
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
  const icono = (t) => img ? <img alt="" src={img} width={t} height={t} style={{ borderRadius: t * 0.23, boxShadow: "0 30px 70px rgba(0,0,0,.35)" }} />
    : <div style={{ width: t, height: t, borderRadius: t * 0.23, background: "rgba(255,255,255,.95)", color: c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: t * 0.5, fontFamily: "T" }}>{nombre[0]}</div>;
  const ojo = (t) => <div style={{ fontSize: 34, letterSpacing: 9, opacity: 0.8, fontFamily: "B", marginBottom: 30 }}>{t}</div>;
  const frase = (t, tam = 72) => <div style={{ fontSize: tam, lineHeight: 1.22, fontFamily: "T", textAlign: "center", maxWidth: 900 }}>{t}</div>;
  const blanco = p.id === "teamjoy";
  const poster = s?.tipo === "demo" ? await posterDe(s) : null;
  let cuerpo;
  if (!s) cuerpo = <div style={COL}>{icono(300)}<div style={{ fontSize: 96, fontFamily: "T", marginTop: 56, textAlign: "center", lineHeight: 1.05 }}>{nombre}</div>
    <div style={{ fontSize: 34, letterSpacing: 8, opacity: 0.85, fontFamily: "B", margin: "22px 0 70px" }}>FROM FUNGIRAK</div>{frase(portada.frase, 66)}
    {portada.sub ? <div style={{ fontSize: 40, opacity: 0.88, fontFamily: "B", marginTop: 34, textAlign: "center", maxWidth: 860, lineHeight: 1.4 }}>{portada.sub}</div> : null}</div>;
  else if (s.tipo === "dato") cuerpo = <div style={COL}>{ojo("EN NÚMEROS")}<div style={{ fontSize: 300, fontFamily: "T", lineHeight: 1 }}>{s.n}</div>{frase(s.texto, 66)}</div>;
  else if (s.tipo === "pills") cuerpo = <div style={COL}>{ojo(s.ojo)}<div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24, maxWidth: 920 }}>{s.items.map((x) => <div key={x} style={{ padding: "22px 38px", borderRadius: 999, background: "rgba(255,255,255,.16)", border: "3px solid rgba(255,255,255,.4)", fontSize: 44, fontFamily: "B" }}>{x}</div>)}</div></div>;
  else if (s.tipo === "entrar") cuerpo = <div style={COL}>{icono(250)}<div style={{ marginTop: 60, display: "flex" }}>{frase(s.texto, 76)}</div>
    {s.sub ? <div style={{ fontSize: 38, opacity: 0.92, fontFamily: "B", marginTop: 40, textAlign: "center", maxWidth: 880, lineHeight: 1.45 }}>{s.sub}</div> : null}
    <div style={{ marginTop: 56, padding: "34px 56px", borderRadius: 999, background: blanco ? "#1f2937" : "#fff", color: blanco ? "#fff" : "#111", fontSize: 46, fontFamily: "B" }}>{p.url.replace("https://", "")}</div></div>;
  else if (s.tipo === "demo") cuerpo = null; // la historia con la app funcionando: texto arriba y el celular (ver «demo» abajo)
  else cuerpo = <div style={COL}>{s.emoji ? <div style={{ fontSize: 130, marginBottom: 30 }}>{s.emoji}</div> : null}{ojo(s.ojo)}{frase(s.texto, 78)}{s.sub && s.sub !== s.texto ? <div style={{ fontSize: 40, opacity: 0.88, fontFamily: "B", marginTop: 40, textAlign: "center", maxWidth: 860, lineHeight: 1.4 }}>{s.sub}</div> : null}</div>;
  const fondo = blanco ? "#ffffff" : p.id === "dertin" ? "linear-gradient(180deg, #26262e 0%, #0b0b10 48%, #000 100%)" : `linear-gradient(180deg, ${claro(c)} 0%, ${c} 46%, ${oscuro(c)} 100%)`;
  const tapiz = tapizSVG(p, W, H, blanco ? 0.4 : p.id === "dertin" ? 0.22 : 0.17);
  return new ImageResponse(
    <div style={{ width: W, height: H, display: "flex", flexDirection: "column", position: "relative", color: blanco ? "#1f2937" : "#fff", fontFamily: "B", background: fondo }}>
      {tapiz ? <img alt="" src={tapiz} width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }} /> : null}
      <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "70px 80px 0", fontSize: 36 }}>
        {k === 0 ? null : icono(84)}<div style={{ fontFamily: "T", fontSize: 40 }}>{k === 0 ? "fungirak" : nombre}</div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 90px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>{cuerpo}</div>
      </div>
      {s?.deco?.length ? decos(s.deco, W, H) : null}
      {s?.tipo === "demo" ? <div style={{ position: "absolute", left: 0, top: 230, width: W, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {ojo(s.ojo)}{frase(s.texto, 56)}</div> : null}
      {/* el celular: en la imagen va el primer cuadro; el video de Instagram lo pone encima en la misma posición (CEL) */}
      {s?.tipo === "demo" ? <div style={{ position: "absolute", left: CEL.x - 14, top: CEL.y - 14, width: CEL.w + 28, height: CEL.h + 28, borderRadius: 64, background: "#0b0b10", display: "flex", padding: 14, boxShadow: "0 40px 90px rgba(0,0,0,.45)" }}>
        {poster ? <img alt="" src={poster} width={CEL.w} height={CEL.h} style={{ borderRadius: 50, objectFit: "cover" }} /> : null}</div> : null}
      {pie(80, blanco)}
    </div>,
    { width: W, height: H, emoji: "twemoji", fonts: fonts.length ? fonts : undefined, headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400" } }
  );
}
