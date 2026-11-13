// Las apps con panel que hablan el mismo idioma (kit y molde): denuncias en /api/moderacion, personas, errores y uso en
// /api/admin/*, auditoría en /api/auditoria. Es la lista cerrada del puente del panel (/api/panel/accion).
export const APPS_PANEL = [
  { id: "mate", nombre: "La Escuela del Mate", url: "https://escuela-del-mate.fungirak.com", tipo: "kit", emoji: "🧉" },
  { id: "asador", nombre: "La Escuela del Asador", url: "https://escueladelasador.fungirak.com", tipo: "kit", emoji: "🔥" },
  { id: "micoteca", nombre: "Micoteca", url: "https://micoteca.fungirak.com", tipo: "kit", emoji: "🍄" },
  { id: "surco", nombre: "Surco", url: "https://surco.fungirak.com", tipo: "kit", emoji: "🌱" },
  { id: "musgui", nombre: "Musgui", url: "https://musgui.fungirak.com", tipo: "kit", emoji: "🌿" },
  { id: "atalaya", nombre: "Atalaya", url: "https://atalaya.fungirak.com", tipo: "kit", emoji: "🛡️" },
  { id: "mitour", nombre: "MiTour", url: "https://mitour.fungirak.com", tipo: "kit", emoji: "✈️" },
  { id: "cv", nombre: "CV", url: "https://cv.fungirak.com", tipo: "molde", emoji: "📄" },
  { id: "preguntas", nombre: "Preguntas de a Dos", url: "https://preguntas.fungirak.com", tipo: "molde", emoji: "💬" },
  { id: "escanea", nombre: "Escaneá", url: "https://escanea.fungirak.com", tipo: "molde", emoji: "📄" },
  { id: "pasalo", nombre: "Pásalo", url: "https://pasalo.fungirak.com", tipo: "molde", emoji: "📲" },
  { id: "termometro", nombre: "Termómetro", url: "https://termometro.fungirak.com", tipo: "molde", emoji: "🌡️" },
  { id: "rinde", nombre: "Rinde", url: "https://rinde.fungirak.com", tipo: "molde", emoji: "🪙" },
  { id: "que-hago-hoy", nombre: "Qué Hago Hoy", url: "https://que-hago-hoy.fungirak.com", tipo: "molde", emoji: "🎟️" },
  { id: "pescador", nombre: "La Escuela del Pescador", url: "https://escuela-del-pescador.fungirak.com", tipo: "molde", emoji: "🎣" },
  { id: "mascotas", nombre: "La Escuela de las Mascotas", url: "https://escuela-de-mascotas.fungirak.com", tipo: "molde", emoji: "🐾" },
  { id: "auxilios", nombre: "Primeros Auxilios", url: "https://primeros-auxilios.fungirak.com", tipo: "molde", emoji: "⛑️" },
  { id: "trivia", nombre: "La Gran Trivia", url: "https://trivia.fungirak.com", tipo: "molde", emoji: "🎤" },
  { id: "figus", nombre: "Figus", url: "https://figus.fungirak.com", tipo: "molde", emoji: "🃏" },
  { id: "voluntarios", nombre: "Una Mano", url: "https://voluntarios.fungirak.com", tipo: "molde", emoji: "🤝" },
  { id: "prode", nombre: "Prode", url: "https://prode.fungirak.com", tipo: "molde", emoji: "⚽" },
  { id: "afinados", nombre: "Afinados", url: "https://afinados.fungirak.com", tipo: "molde", emoji: "🎶" },
  { id: "oculta", nombre: "Santa Fe Oculta", url: "https://santafe-oculta.fungirak.com", tipo: "molde", emoji: "🗺️" },
  { id: "hoy", nombre: "Hoy", url: "https://hoy.fungirak.com", tipo: "molde", emoji: "☀️" },
  { id: "gourmet", nombre: "Santa Fe Gourmet", url: "https://santafe-gourmet.fungirak.com", tipo: "otro", emoji: "🍽️" },
];

// Cómo se abre el panel de cada app desde el del estudio. Con la Cuenta FUNGIRAK (entrada /api/fungirak/admin): si ya hiciste
// el paso de dos pasos en este navegador (vale 8 h), entrás directo, sin escribir nada. El resto, a su panel propio.
const CON_CUENTA = new Set([...APPS_PANEL.map((a) => new URL(a.url).host), "dertin.fungirak.com", "sin-vueltas.fungirak.com", "cronicasdefungi.fungirak.com", "atlasfit-pro.fungirak.com"]);
const PROPIOS = { "fabrica.fungirak.com": "/dueno", "cuenta.fungirak.com": "/admin" };
export function panelDe(url) {
  let h; try { h = new URL(url).host; } catch { return null; }
  if (CON_CUENTA.has(h)) return { url: `https://${h}/api/fungirak/admin`, directo: true };
  if (PROPIOS[h]) return { url: `https://${h}${PROPIOS[h]}`, directo: h === "cuenta.fungirak.com" };
  return null;
}
