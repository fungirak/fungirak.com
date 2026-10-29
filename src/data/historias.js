// Historias de fungirak.com (la foto de la portada): una de presentación por cada app, sitio y juego, y 5 propias de cada una.
// Se arman solas con la ficha de cada proyecto (lema, números, destacados, descripción): si se suma una app, aparece sola.
// Cada día arranca con otra app, en orden (no al azar), así en un mes pasan todas.
import { PROYECTOS, ORDEN, ORDEN_HISTORIAS } from "./proyectos";
import { conDemos } from "./historias-demos";
import { tonoDe } from "./cards-fondo";
import { TEXTOS } from "./historias-textos";
// (copia de tx de lib/i18n: aquel archivo es solo del navegador y este también lo usa el servidor para las imágenes)
const tx = (v, lang) => (v && typeof v === "object" && !Array.isArray(v) ? v[lang] ?? v.es : v);

// Solo apps y juegos: afuera los libros y el EP, los homenajes a bandas y los sitios (guías, Sin Vueltas, Tribus, Telo's).
const FUERA = new Set(["problematica", "libro-1", "libro-2", "ep", "negro", "peyote", "loquero", "gourmet", "schools", "telos", "tribus", "sinvueltas"]);
// La tipografía de cada app (la misma que usa en su sitio): [títulos, texto]. Se cargan de Google Fonts solo al abrir su historia.
export const FUENTES = {
  dertin: ["Syne", "Onest"], atlas: ["Chakra Petch", "Chakra Petch"], mitour: ["Unbounded", "Instrument Sans"], atalaya: ["Chakra Petch", "Space Grotesk"],
  musgui: ["Sniglet", "Nunito"], mate: ["Gloock", "Instrument Sans"], asador: ["Space Grotesk", "Space Grotesk"], surco: ["Bricolage Grotesque", "Literata"],
  micoteca: ["Fraunces", "Atkinson Hyperlegible"], ecos: ["Chakra Petch", "Manrope"], "carta-al-futuro": ["Newsreader", "Figtree"], hoy: ["Bricolage Grotesque", "Figtree"],
  cv: ["Fraunces", "Manrope"], pasalo: ["Lexend", "Outfit"], termometro: ["DM Serif Display", "Public Sans"], rinde: ["Space Grotesk", "Manrope"],
  "que-hago-hoy": ["Big Shoulders", "Archivo"], "escuela-del-pescador": ["Bricolage Grotesque", "Nunito Sans"], "escuela-de-mascotas": ["Fredoka", "Rubik"],
  "primeros-auxilios": ["Archivo Black", "Public Sans"], trivia: ["Bowlby One SC", "Lexend Deca"], figus: ["Dela Gothic One", "Plus Jakarta Sans"],
  voluntarios: ["Bricolage Grotesque", "Figtree"], prode: ["Bungee", "Saira"], afinados: ["Unbounded", "Onest"], "santafe-oculta": ["Fraunces", "Instrument Sans"],
  escanea: ["Sora", "IBM Plex Sans"], preguntas: ["Baloo 2", "Nunito"], fabrica: ["Geist", "Geist"], cronicas: ["Orbitron", "Rajdhani"], teamjoy: ["Poppins", "Poppins"],
};
export const fuentesDe = (p) => FUENTES[p.id] || null;
// Hoja de Google Fonts para una app (títulos en 700/800, texto en 400/700)
export function hojaFuentes(p) {
  const f = fuentesDe(p); if (!f) return null;
  const fam = (n, w) => `family=${encodeURIComponent(n).replace(/%20/g, "+")}:wght@${w}`;
  const una = (n) => ["Gloock", "DM Serif Display", "Archivo Black", "Bowlby One SC", "Dela Gothic One", "Bungee"].includes(n); // vienen en un solo peso
  const pares = [...new Set(f)].map((n, i) => (una(n) ? `family=${encodeURIComponent(n).replace(/%20/g, "+")}` : fam(n, i === 0 && f[0] !== f[1] ? "700;800" : "400;700;800")));
  return `https://fonts.googleapis.com/css2?${pares.join("&")}&display=swap`;
}
// Team Joy no tiene logo en el sitio: usa el ícono de la cuenta FUNGIRAK.
const LOGOS = { teamjoy: "/img/logos/teamjoy.png" };

const orden = (p) => { const i = ORDEN_HISTORIAS.indexOf(p.id); return i < 0 ? 999 + ORDEN.indexOf(p.id) : i; };
export const APPS_HISTORIAS = PROYECTOS.filter((p) => !FUERA.has(p.id) && !p.pausa && p.url && !["libro", "ep"].includes(p.tipo)).sort((a, b) => orden(a) - orden(b));

// La primera frase de un texto (para no meter párrafos en una historia).
const frase = (t) => { const s = String(t || "").trim(); const m = s.match(/^(.{20,170}?[.!?])(\s|$)/); return m ? m[1] : s.slice(0, 170); };

// La de presentación: el lema (o el tagline) como frase central.
// Que ninguna frase termine con una palabra sola en el último renglón: las dos últimas van unidas (espacio que no corta).
export const sinViuda = (t) => (typeof t === "string" ? t.replace(/\s+(\S+)\s*$/, "\u00A0$1") : t);
const pulir = (x) => ({ ...x, ...(x.texto && { texto: sinViuda(x.texto) }), ...(x.sub && { sub: sinViuda(x.sub) }) });
export const portadaDe = (p, lang) => ({ frase: sinViuda(tx(p.lema, lang) || tx(p.tagline, lang) || ""), sub: sinViuda(tx(p.lema, lang) ? tx(p.tagline, lang) || "" : "") });

// La promo de la quinta: gratis para siempre, lo que suma el plan FUNGIRAK y la prueba de 30 días.
const PRECIO = "$4.990";
// Las 5 propias: 1 el gancho, 2 la comunidad, 3 lo mejor, 4 un número (o lo mejor) y 5 la promo con el botón para entrar.
export function propiasDe(p, lang) { return propiasCrudas(p, lang).map(pulir); }
function propiasCrudas(p, lang) {
  const es = lang !== "en";
  const t = es ? TEXTOS[p.id] : null;
  if (t) {
    const dato = (p.datos || [])[0];
    return conDemos(p.id, [
      { tipo: "destacado", ojo: "LO MEJOR", texto: t.gancho },
      { tipo: "destacado", ojo: "EN COMUNIDAD", emoji: "👥", texto: t.comunidad },
      { tipo: "destacado", ojo: "ADEMÁS", texto: t.f[0] },
      dato ? { tipo: "dato", n: dato.n, texto: tx(dato, lang) } : { tipo: "destacado", ojo: "Y TAMBIÉN", texto: t.f[1] },
      { tipo: "entrar", texto: "Gratis para siempre.", sub: `Con el plan FUNGIRAK (desde ${PRECIO} por mes, una sola suscripción para todas las apps) sumás ${t.plan}. Y al crear tu cuenta, 30 días de Personal gratis.`, boton: `Abrir ${nombreDe(p, lang)}` },
    ]);
  }
  const que = { tipo: "que", ojo: es ? "QUÉ ES" : "WHAT IT IS", texto: tx(p.tagline, lang) || frase(tx(p.descripcion, lang)), sub: frase(tx(p.descripcion, lang)) };
  const datos = (p.datos || []).slice(0, 2).map((d) => ({ tipo: "dato", n: d.n, texto: tx(d, lang) }));
  const dest = (tx(p.destacados, lang) || []).map((t) => ({ tipo: "destacado", ojo: es ? "LO QUE TIENE" : "WHAT YOU GET", texto: t }));
  const pills = (p.pills || []).filter((x) => !/^\+18$/.test(x));
  const relleno = [
    ...dest,
    ...(pills.length ? [{ tipo: "pills", ojo: es ? "ASÍ ES" : "WHAT IT'S LIKE", items: pills.slice(0, 5) }] : []),
    ...(tx(p.descripcion, lang) ? [{ tipo: "destacado", ojo: es ? "EN CRIOLLO" : "IN SHORT", texto: frase(tx(p.descripcion, lang).slice(frase(tx(p.descripcion, lang)).length).trim()) || frase(tx(p.descripcion, lang)) }] : []),
  ];
  const medio = [...datos, ...relleno].slice(0, 3);
  while (medio.length < 3) medio.push({ tipo: "destacado", ojo: es ? "HECHO EN ARGENTINA" : "MADE IN ARGENTINA", texto: es ? "Hecha por FUNGIRAK Studio, desde Santa Fe." : "Made by FUNGIRAK Studio, from Santa Fe." });
  const entrar = { tipo: "entrar", texto: es ? "Probala ahora: es gratis." : "Try it now: it's free.", boton: es ? `Abrir ${nombreDe(p, lang)}` : `Open ${nombreDe(p, lang)}` };
  return [que, ...medio, entrar];
}

export const nombreDe = (p, lang) => String(tx(p.nombre, lang)).replace(/^Sitio homenaje a /, "").replace(/^Tribute site to /, "");
// Color de los dibujitos del papel tapiz de las historias: blancos sobre el tono; Dertin, verde lima; Team Joy, surtidos.
export const trazoDe = (p) => (p.id === "teamjoy" ? null : p.id === "dertin" ? "#C6F432" : "#ffffff");
export const logoDe = (p) => LOGOS[p.id] || p.logo || "/icons/icon-192.png";
// Un color de fondo que siempre deje leer texto blanco (los muy claros, como el gris de Experimento Negro, se oscurecen).
// Dertin va en negro (su verde propio no queda bien de fondo); Team Joy, en blanco con dibujitos de colores (ver .hst-cel.blanco).
// Las demás usan el mismo tono propio de su card en fungirak.com (src/data/cards-fondo.js), oscurecido si hace falta para el texto blanco.
const COLOR_FIJO = { dertin: "#0b0b10", teamjoy: "#ffffff" };
export function colorDe(p) {
  if (COLOR_FIJO[p.id]) return COLOR_FIJO[p.id];
  const c = String(tonoDe(p.id) || p.color || "#0b0d12").replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) || 0);
  const luz = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const f = luz > 0.62 ? 0.42 : luz > 0.5 ? 0.62 : 1; // oscurecer los claros
  const h = (v) => Math.round(v * f).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

// Con qué app arranca hoy: un día después del otro, en orden (día argentino).
export function inicioDeHoy(n = APPS_HISTORIAS.length) {
  const hoy = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));
  const dias = Math.floor(Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()) / 864e5) - Math.floor(Date.UTC(2026, 9, 29) / 864e5); // el 29/10/2026 arrancó la primera
  return ((dias % n) + n) % n;
}
