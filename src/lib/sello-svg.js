// Copia de cuenta/lib/sello-svg.js (el generador es uno solo para todo el Studio: se cambia allá y se copia).
// Sellos de tinta en SVG para el Pasaporte FUNGIRAK y las libretas de todas las apps (sin emojis).
// selloSVG({...}) devuelve el SVG como texto: sirve igual en React (dangerouslySetInnerHTML), en páginas sin framework y en mails.
// Forma según la app (círculo, óvalo, octógono o estampilla troquelada), el nombre de la app en curva, un ícono de línea fina al
// centro, el nombre del sello en versalitas, la fecha y una textura de tinta despareja. Los que faltan: contorno punteado tenue.

// Íconos de línea (viewBox 24 × 24, trazo redondeado). Dibujos propios, simples a propósito: se leen chicos y en tinta.
export const GLIFOS = {
  brote: "M12 21v-8M12 13c0-4 3-6.5 7-6.5 0 4-3 6.5-7 6.5zM12 15c0-3.2-2.4-5.2-5.6-5.2 0 3.2 2.4 5.2 5.6 5.2z",
  hoja: "M5 19C5 10 11 4 20 4c0 9-6 15-15 15zM5 19l8-8",
  arbol: "M12 22v-6M12 16c-4.4 0-7-2.6-7-6 0-2.4 1.6-4.3 3.6-4.8C9.4 3.3 10.6 2 12 2s2.6 1.3 3.4 3.2c2 .5 3.6 2.4 3.6 4.8 0 3.4-2.6 6-7 6z",
  hongo: "M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8H4zM9.5 12v5.5a2.5 2.5 0 0 0 5 0V12M8 8.5h.01M13 7h.01M16 9.5h.01",
  gota: "M12 3c3.5 4.4 6 7.6 6 10.6A6 6 0 0 1 6 13.6C6 10.6 8.5 7.4 12 3z",
  sol: "M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  luna: "M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z",
  estrella: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3z",
  corazon: "M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7.5 3c0 5.4-7.5 10-7.5 10z",
  escudo: "M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6L12 3zM9 12l2.2 2.2L15.5 10",
  mate: "M7 9h10l-1 9.5a2.5 2.5 0 0 1-2.5 2.5h-3A2.5 2.5 0 0 1 8 18.5L7 9zM6 9c0-2.8 2.7-4 6-4s6 1.2 6 4M14 5l3.5-3",
  llama: "M12 22c-4 0-6.5-2.7-6.5-6.2 0-3.6 2.8-5.4 3.6-9.3 2.6 1.6 3.6 3.9 3.4 6.1 1.2-.6 2-1.8 2.2-3.4 2 1.7 3.8 4.2 3.8 6.8 0 3.5-2.5 6-6.5 6z",
  brujula: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM15.5 8.5l-2 5-5 2 2-5 5-2z",
  mapa: "M3 6.5l6-2.5 6 2.5 6-2.5v13.5l-6 2.5-6-2.5-6 2.5V6.5zM9 4v13.5M15 6.5V20",
  libro: "M4 5.5C4 4.7 4.7 4 5.5 4H11v15H5.5C4.7 19 4 19.7 4 20.5v-15zM20 5.5c0-.8-.7-1.5-1.5-1.5H13v15h5.5c.8 0 1.5.7 1.5 1.5v-15z",
  camara: "M4 8h3l1.8-2.5h6.4L17 8h3v11H4V8zM12 10.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z",
  burbuja: "M4 5h16v11H9l-4.5 3.5V16H4V5zM8 10h.01M12 10h.01M16 10h.01",
  persona: "M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM4.5 20.5c.8-3.8 3.9-6 7.5-6s6.7 2.2 7.5 6",
  personas: "M9 5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zM2.5 20c.6-3.3 3.2-5.3 6.5-5.3s5.9 2 6.5 5.3M16 5.3a3.3 3.3 0 0 1 0 6.4M18.5 14.9c1.6.8 2.7 2.5 3 5.1",
  sobre: "M3 6h18v12H3V6zM3 6l9 7 9-7",
  reloj: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 7v5l3.5 2",
  calendario: "M4 6h16v14H4V6zM4 10h16M8 3v5M16 3v5M8 14h2M12 14h2M16 14h.01",
  insecto: "M12 7a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0v-5a3 3 0 0 1 3-3zM10 7l-2-3M14 7l2-3M9 11H5M15 11h4M9 15H5.5M15 15h3.5M12 10v8",
  ciclo: "M20 12a8 8 0 0 1-14.3 4.9M4 12a8 8 0 0 1 14.3-4.9M18.5 3v4.5H14M5.5 21v-4.5H10",
  lupa: "M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zM15.3 15.3L20 20",
  llave: "M8 10a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM11 13l9-9M17 7l2.5 2.5M14.5 9.5L16 11",
  trofeo: "M8 4h8v5a4 4 0 0 1-8 0V4zM8 6H5c0 3 1.5 4.5 3 5M16 6h3c0 3-1.5 4.5-3 5M12 13v4M8.5 21h7M9.5 17h5v4h-5z",
  ola: "M3 10c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0",
  pez: "M3 12c3-4 7-5.5 11-4.5 2.2.6 3.8 2.3 4.5 4.5-.7 2.2-2.3 3.9-4.5 4.5-4 1-8-.5-11-4.5zM18.5 12L22 8.5v7L18.5 12zM13 10.5h.01",
  montana: "M2 20l7-12 4 6.5 2.5-3.5L22 20H2zM7.5 12.5l1.5 1.5 1.5-1.5",
  casa: "M4 11l8-7 8 7v9H4v-9zM10 20v-5h4v5",
  check: "M5 12.5l4.5 4.5L19 7.5",
  nota: "M9 18V6l11-2v12M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM20 16a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z",
  documento: "M6 3h8l4 4v14H6V3zM14 3v4h4M9 11h6M9 14.5h6M9 18h4",
  rayo: "M13 2L4.5 13.5H12L11 22l8.5-11.5H12L13 2z",
  taza: "M5 8h11v6a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V8zM16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 2.5c-.6 1 .6 2 0 3M11 2.5c-.6 1 .6 2 0 3",
  engranaje: "M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zM12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1",
  codigo: "M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16",
  termometro: "M10 4a2 2 0 0 1 4 0v10.3a4 4 0 1 1-4 0V4zM12 9v8M16 6h3M16 10h2",
  foco: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z",
  joystick: "M6 9h12a4 4 0 0 1 4 4v1a3 3 0 0 1-5.4 1.8L15 14H9l-1.6 1.8A3 3 0 0 1 2 14v-1a4 4 0 0 1 4-4zM7 11v3M5.5 12.5h3M15.5 12h.01M17.5 13.5h.01",
  copo: "M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5M4.5 10.6L7.9 9.6 7 6.2M19.5 13.4l-3.4 1 .9 3.4M4.5 13.4l3.4 1-.9 3.4M19.5 10.6l-3.4-1 .9-3.4",
  flor: "M12 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM12 9.5C10 6.5 10.5 3 12 3s2 3.5 0 6.5zM14.5 12c3-2 6.5-1.5 6.5 0s-3.5 2-6.5 0zM12 14.5c2 3 1.5 6.5 0 6.5s-2-3.5 0-6.5zM9.5 12c-3 2-6.5 1.5-6.5 0s3.5-2 6.5 0z",
  chispa: "M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8M12 10.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z",
};

// Qué ícono le toca a cada sello, por palabras de su id o su nombre. Si nada encaja, el del mundo de la app y si no, una estrella.
const REGLAS = [
  [/hong|seta|mico|espor/, "hongo"], [/mate|yerba|ronda|cebad|bombill/, "mate"], [/asad|fuego|parrill|brasa|carb|leñ|corte|vino|marid/, "llama"],
  [/arbol|árbol|bosque|monte/, "arbol"], [/huert|siemb|semill|brote|plant|cultiv|balc|muss|musg|frasc/, "brote"], [/hoja|verde|ventan/, "hoja"],
  [/plag|bicho|insect|diagn|doctor/, "insecto"], [/compost|recicl|ciclo/, "ciclo"], [/agua|rieg|gota|lluv/, "gota"], [/sol|verano|calor|luz/, "sol"],
  [/luna|noche|sueñ|dorm|cielo|estrell/, "luna"], [/calend|fecha|vencim|plazo|mes\b/, "calendario"], [/reloj|hora|tiempo|racha/, "reloj"],
  [/escud|segur|vig|truch|estaf|ataq|phish|contraseñ|clave/, "escudo"], [/llave|acceso/, "llave"], [/mapa|ruta|provinc|ciudad|barrio|calle/, "mapa"],
  [/viaj|brúj|bruj|país|pais|tour|pasaport|explor/, "brujula"], [/foto|cámar|camar|mostr|imagen|album|álbum/, "camara"],
  [/libro|ficha|guía|guia|aprend|lecci|leer|tramit|trámit|glosar/, "libro"], [/coment|charla|mensaj|pregunt|chat|habl/, "burbuja"],
  [/carta|correo|sobre|mail/, "sobre"], [/comunid|gente|segu[ií]|invit|amig|juntos|todos|mesa/, "personas"], [/cuenta|nombre|perfil|vos\b/, "persona"],
  [/megust|regad|aplaus|corazon|corazón|amor|cuid/, "corazon"], [/pesc|pez|río|rio/, "pez"], [/ola|mar\b|litoral/, "ola"], [/canci|karaok|músic|music|nota/, "nota"],
  [/busc|lupa|ojo|mir/, "lupa"], [/trofeo|campe|gran|maestr|record|récord|nivel/, "trofeo"], [/rayo|rápid|rapid|energ|entren|pulso|pausa/, "rayo"],
  [/casa|hogar|inicio/, "casa"], [/primer|primera|bienven/, "estrella"],
];
const MUNDO = { surco: "brote", micoteca: "hongo", musgui: "hoja", mate: "mate", asador: "llama", atalaya: "escudo", sinvueltas: "libro",
  "carta-al-futuro": "sobre", dertin: "corazon", atlas: "rayo", mitour: "brujula", cronicas: "estrella", fungirak: "estrella" };
export function glifoPara(id = "", nombre = "", app = "") {
  const t = `${id} ${nombre}`.toLowerCase();
  for (const [re, g] of REGLAS) if (re.test(t)) return g;
  return MUNDO[app] || "estrella";
}

const hash = (s) => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const FORMAS = ["circulo", "ovalo", "octogono", "estampilla"];
const fechaCorta = (f) => { try { return new Date(f).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase().replace(/\./g, ""); } catch { return ""; } };

// Partir el nombre del sello en hasta dos renglones cortos (va en versalitas al pie del ícono).
function renglones(n, max = 13) {
  const palabras = String(n || "").toUpperCase().split(/\s+/).filter(Boolean);
  const r = [""];
  for (const p of palabras) { const a = r[r.length - 1]; if ((a + " " + p).trim().length <= max || !a) r[r.length - 1] = (a + " " + p).trim(); else if (r.length < 2) r.push(p); else { r[1] = (r[1] + " " + p).slice(0, max - 1) + "…"; break; } }
  return r;
}

// opciones: app (id), marca (texto en curva, ej. "SURCO"), id y nombre del sello, color (tinta), fecha, ok (ganado), forma (opcional),
// tam (px), glifo (opcional, si no se elige solo).
export function selloSVG({ app = "", marca = "", id = "", nombre = "", color = "#0f8a5f", fecha = null, ok = true, forma, tam = 120, glifo } = {}) {
  const h = hash(`${app}:${id}`);
  const f = forma || FORMAS[hash(app || id) % FORMAS.length];
  const giro = ok ? ((h % 17) - 8) : 0;
  const tinta = ok ? `var(--tinta, ${tintaClara(color)})` : "currentColor";
  const op = ok ? 1 : 0.32;
  const uid = `s${h.toString(36)}`;
  const g = GLIFOS[glifo || glifoPara(id, nombre, app)] || GLIFOS.estrella;
  const arriba = esc(String(marca || app).toUpperCase().slice(0, 22));
  const abajo = ok && fecha ? esc(fechaCorta(fecha)) : ok ? "FUNGIRAK" : "POR GANAR";
  const trazo = ok ? "" : ' stroke-dasharray="3 3"';
  const rugoso = ok ? ` filter="url(#${uid}t)"` : "";
  let marco = "", curvaArriba = "", curvaAbajo = "";
  if (f === "ovalo") {
    marco = `<ellipse cx="60" cy="60" rx="56" ry="44"${trazo}/><ellipse cx="60" cy="60" rx="50" ry="38" stroke-width="1"${trazo}/>`;
    curvaArriba = "M18 60a42 31 0 0 1 84 0"; curvaAbajo = "M14 60a46 35 0 0 0 92 0";
  } else if (f === "octogono") {
    marco = `<path d="M38 5h44l33 33v44l-33 33H38L5 82V38z"${trazo}/><path d="M40.5 11h39L109 40.5v39L79.5 109h-39L11 79.5v-39z" stroke-width="1"${trazo}/>`;
    curvaArriba = "M20 60a40 40 0 0 1 80 0"; curvaAbajo = "M16 60a44 44 0 0 0 88 0";
  } else if (f === "estampilla") {
    let p = ""; for (let i = 0; i < 12; i++) { const x = 8 + i * 9.5; p += `<circle cx="${x}" cy="5" r="2.4"/><circle cx="${x}" cy="115" r="2.4"/><circle cx="5" cy="${x}" r="2.4"/><circle cx="115" cy="${x}" r="2.4"/>`; }
    marco = `<rect x="5" y="5" width="110" height="110" rx="4"${trazo}/><rect x="12" y="12" width="96" height="96" rx="3" stroke-width="1"${trazo}/>${ok ? `<g fill="var(--pp-papel, #fff)" stroke="none">${p}</g>` : ""}`;
    curvaArriba = "M22 60a38 38 0 0 1 76 0"; curvaAbajo = "M18 60a42 42 0 0 0 84 0";
  } else {
    marco = `<circle cx="60" cy="60" r="55"${trazo}/><circle cx="60" cy="60" r="48" stroke-width="1"${trazo}/>`;
    curvaArriba = "M17 60a43 43 0 0 1 86 0"; curvaAbajo = "M13 60a47 47 0 0 0 94 0";
  }
  // Adornos que cambian sello a sello (aunque sean de la misma app): así cientos de sellos no se ven repetidos.
  const [l1, l2] = renglones(nombre);
  const ad = (h >>> 5) % (l2 ? 5 : 6); // la cinta (5) solo cuando el nombre entra en un renglón
  const estrellita = (x, y, r) => `<path d="M${x} ${y - r}l${r * 0.3} ${r * 0.7} ${r * 0.7} ${r * 0.3}-${r * 0.7} ${r * 0.3}-${r * 0.3} ${r * 0.7}-${r * 0.3}-${r * 0.7}-${r * 0.7}-${r * 0.3} ${r * 0.7}-${r * 0.3}z" style="fill:${tinta}" stroke="none"/>`;
  let adorno = "";
  if (ad === 0) adorno = estrellita(25, 60, 4) + estrellita(95, 60, 4);
  else if (ad === 1) adorno = [22, 27, 32].map((x) => `<circle cx="${x}" cy="60" r="1.1" style="fill:${tinta}" stroke="none"/><circle cx="${120 - x}" cy="60" r="1.1" style="fill:${tinta}" stroke="none"/>`).join("");
  else if (ad === 2) adorno = `<path d="M30 69.5h18M72 69.5h18" stroke-width="1"/>${estrellita(60, 69.5, 2.2)}`;
  else if (ad === 3) adorno = Array.from({ length: 12 }, (_, i) => { const a = (i * 30 * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a); return `M${(60 + c * 19).toFixed(1)} ${(48 + s * 19).toFixed(1)}L${(60 + c * 22.5).toFixed(1)} ${(48 + s * 22.5).toFixed(1)}`; }).reduce((p, d) => p + d, '<path stroke-width="1.1" d="') + '"/>';
  else if (ad === 4) adorno = `<circle cx="60" cy="48" r="18" stroke-width="1"/>`;
  else adorno = `<path d="M23 75.5l7-4v12l-7-4zM97 75.5l-7-4v12l7-4z" style="fill:${tinta}" stroke="none"/><path d="M30 71.5h60v12H30z" stroke-width="1"/>`;
  const titulo = `${esc(nombre)}${ok ? "" : " (por ganar)"}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" class="sello-svg" style="--tinta-c:${tintaClara(color)};--tinta-o:${tintaOscura(color)}" viewBox="0 0 120 120" width="${tam}" height="${tam}" role="img" aria-label="${titulo}">
<title>${titulo}</title>
<defs>${ok ? `<filter id="${uid}t" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="${h % 97}" result="r"/><feColorMatrix in="r" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1 2.1"/><feComposite in="SourceGraphic" operator="in"/></filter>` : ""}<path id="${uid}a" d="${curvaArriba}"/><path id="${uid}b" d="${curvaAbajo}"/></defs>
<g transform="rotate(${giro} 60 60)" opacity="${op}" fill="none" style="stroke:${tinta}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"${rugoso}>
${marco}
${adorno}
<g style="fill:${tinta}" stroke="none" font-family="'Arial Narrow', 'Roboto Condensed', 'Helvetica Neue', Arial, sans-serif" font-weight="800" letter-spacing="1.4">
<text font-size="${arriba.length > 14 ? 8 : 9.6}"><textPath href="#${uid}a" startOffset="50%" text-anchor="middle">${arriba}</textPath></text>
<text font-size="6.8" letter-spacing="1.1"><textPath href="#${uid}b" startOffset="50%" text-anchor="middle" dominant-baseline="hanging">· ${abajo} ·</textPath></text>
<text x="60" y="${l2 ? 80 : 81}" font-size="8.4" text-anchor="middle" letter-spacing="0.6">${esc(l1)}</text>${l2 ? `<text x="60" y="89.5" font-size="8.4" text-anchor="middle" letter-spacing="0.6">${esc(l2)}</text>` : ""}
</g>
<g transform="translate(44 31) scale(1.34)" stroke-width="1.6"><path d="${g}"/></g>
</g>
</svg>`;
}

// Los colores de las apps son vivos (pensados para fondo oscuro). Como tinta sobre papel claro se oscurecen según lo claros que
// sean; sobre fondo oscuro se aclaran los que son muy oscuros. Así cualquier color de app queda legible en los dos temas.
const rgb = (hex) => { const m = /^#?([0-9a-f]{6})$/i.exec(String(hex).trim()); if (!m) return null; const n = parseInt(m[1], 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const luz = ([r, g, b]) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
const aHex = (c) => `#${c.map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, "0")).join("")}`;
export function tintaClara(hex) {
  const c = rgb(hex); if (!c) return hex;
  const l = luz(c), k = l > 0.6 ? 0.5 : l > 0.45 ? 0.38 : l > 0.3 ? 0.22 : 0.05;
  return aHex(c.map((x) => x * (1 - k)));
}
export function tintaOscura(hex) {
  const c = rgb(hex); if (!c) return hex;
  const l = luz(c), k = l < 0.25 ? 0.5 : l < 0.45 ? 0.25 : 0;
  return aHex(c.map((x) => x + (255 - x) * k));
}

// CSS para la página que muestra sellos: en claro usa la tinta oscurecida y en oscuro la aclarada. Vale tanto para el sistema como para data-theme="dark".
export const SELLO_CSS = `@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) .sello-svg{--tinta:var(--tinta-o)}}
.sello-svg{--tinta:var(--tinta-c)}
:root[data-theme="dark"] .sello-svg,.oscuro .sello-svg{--tinta:var(--tinta-o)}`;
