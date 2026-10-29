// Fondo de cada card de la portada: un tono propio (elegido para que las vecinas no se parezcan, no es el color de marca)
// y cuatro dibujitos de línea (los GLIFOS de los sellos) que forman el papel tapiz en diagonal.
// Team Joy va en blanco con los dibujitos de colores surtidos.
import { GLIFOS } from "@/lib/sello-svg";

export const FONDO = {
  teamjoy: [null, ["personas", "burbuja", "corazon", "trofeo"]],
  problematica: ["#5B8DEF", ["personas", "lupa", "foco", "check"]],
  dertin: ["#FF4F9A", ["corazon", "rayo", "estrella", "chispa"]],
  "libro-1": ["#8B5CF6", ["libro", "documento", "foco", "estrella"]],
  "libro-2": ["#F59E0B", ["libro", "luna", "sobre", "estrella"]],
  ep: ["#12B886", ["nota", "chispa", "corazon", "estrella"]],
  atlas: ["#FF6B00", ["rayo", "reloj", "trofeo", "llama"]],
  mitour: ["#1C7ED6", ["brujula", "mapa", "montana", "camara"]],
  atalaya: ["#7C3AED", ["escudo", "llave", "codigo", "lupa"]],
  musgui: ["#2F9E44", ["hoja", "gota", "arbol", "brote"]],
  surco: ["#E8A33D", ["brote", "sol", "gota", "calendario"]],
  micoteca: ["#C2410C", ["hongo", "hoja", "lupa", "gota"]],
  "carta-al-futuro": ["#9775FA", ["sobre", "reloj", "estrella", "corazon"]],
  hoy: ["#FAB005", ["sol", "calendario", "check", "taza"]],
  preguntas: ["#F06595", ["burbuja", "corazon", "personas", "chispa"]],
  termometro: ["#E03131", ["termometro", "burbuja", "personas", "check"]],
  rinde: ["#0CA678", ["moneda", "check", "calendario", "foco"]],
  "que-hago-hoy": ["#4C6EF5", ["nota", "estrella", "mapa", "taza"]],
  voluntarios: ["#F59F00", ["corazon", "personas", "reloj", "flor"]],
  fabrica: ["#6366F1", ["engranaje", "codigo", "rayo", "chispa"]],
  ecos: ["#15AABF", ["ola", "burbuja", "mapa", "nota"]],
  mate: ["#7A9A01", ["mate", "hoja", "gota", "taza"]],
  asador: ["#D9480F", ["llama", "sol", "personas", "reloj"]],
  "escuela-del-pescador": ["#1971C2", ["pez", "ola", "gota", "luna"]],
  "escuela-de-mascotas": ["#9C6644", ["corazon", "casa", "persona", "estrella"]],
  "primeros-auxilios": ["#E03131", ["corazon", "escudo", "check", "reloj"]],
  pasalo: ["#AE3EC9", ["ciclo", "documento", "rayo", "check"]],
  escanea: ["#0B7285", ["camara", "documento", "lupa", "check"]],
  cv: ["#FF3E8A", ["documento", "persona", "estrella", "check"]],
  cronicas: ["#4DABF7", ["joystick", "hongo", "estrella", "montana"]],
  prode: ["#2B8A3E", ["trofeo", "estrella", "calendario", "check"]],
  afinados: ["#C2255C", ["nota", "estrella", "chispa", "burbuja"]],
  "santafe-oculta": ["#5F3DC4", ["brujula", "lupa", "luna", "mapa"]],
  trivia: ["#F08C00", ["foco", "check", "estrella", "trofeo"]],
  figus: ["#E64980", ["estrella", "documento", "trofeo", "chispa"]],
  sinvueltas: ["#3D5AFE", ["documento", "check", "reloj", "casa"]],
  gourmet: ["#D84A2E", ["taza", "llama", "estrella", "casa"]],
  schools: ["#F2C94C", ["libro", "foco", "casa", "estrella"]],
  telos: ["#B5179E", ["luna", "corazon", "estrella", "llave"]],
  negro: ["#495057", ["luna", "nota", "arbol", "estrella"]],
  peyote: ["#86EC2C", ["flor", "nota", "sol", "chispa"]],
  loquero: ["#74C0FC", ["nota", "corazon", "documento", "estrella"]],
  tribus: ["#FF2D7A", ["nota", "personas", "rayo", "estrella"]],
};

const SURTIDOS = ["#FF5B3A", "#3B82F6", "#FFC800", "#8B5CF6"];
const LUGAR = [[4, 4], [40, 4], [22, 38], [58, 38]];
const hechos = new Map();

// { tono, tapiz } para el style de la card; tapiz es un url(...) con el SVG de 72 × 72 que se repite.
export function fondoDe(id) {
  if (hechos.has(id)) return hechos.get(id);
  const f = FONDO[id];
  if (!f) return null;
  const [tono, glifos] = f;
  const trazos = glifos.map((g, i) => `<g transform="translate(${LUGAR[i].join(",")}) rotate(-20 12 12) scale(.7)"><path d="${GLIFOS[g]}" fill="none" stroke="${tono || SURTIDOS[i]}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72">${trazos}</svg>`;
  const r = { tono, tapiz: `url("data:image/svg+xml,${encodeURIComponent(svg)}")` };
  hechos.set(id, r);
  return r;
}
