import { eventos as eventosPropios, verificarCadena as cadenaPropia, registrar } from "@/lib/auditoria";
// Auditoría global del estudio (fungirak.com/panel → «Auditoría»): junta los últimos eventos de todas las apps y el estado de
// la cadena de huellas de cada una (sana = nadie cambió ni borró filas recientes). La contraseña maestra llega en cada pedido
// (x-admin-key), se prueba primero contra el correo central y recién ahí se reenvía a la lista fija de abajo.
export const maxDuration = 60;
const M = (id, nombre, url) => ({ id, nombre, url, tipo: "molde" });
const APPS = [
  M("mate", "La Escuela del Mate", "https://escuela-del-mate.fungirak.com"), M("asador", "La Escuela del Asador", "https://escueladelasador.fungirak.com"),
  M("micoteca", "Micoteca", "https://micoteca.fungirak.com"), M("surco", "Surco", "https://surco.fungirak.com"), M("musgui", "Musgui", "https://musgui.fungirak.com"),
  M("atalaya", "Atalaya", "https://atalaya.fungirak.com"), M("fabrica", "Fábrica", "https://fabrica.fungirak.com"), M("cv", "CV", "https://cv.fungirak.com"),
  M("preguntas", "Preguntas de a Dos", "https://preguntas.fungirak.com"), M("escanea", "Escaneá", "https://escanea.fungirak.com"), M("pasalo", "Pásalo", "https://pasalo.fungirak.com"),
  M("termometro", "Termómetro", "https://termometro.fungirak.com"), M("rinde", "Rinde", "https://rinde.fungirak.com"), M("que-hago-hoy", "Qué Hago Hoy", "https://que-hago-hoy.fungirak.com"),
  M("pescador", "La Escuela del Pescador", "https://escuela-del-pescador.fungirak.com"), M("mascotas", "La Escuela de las Mascotas", "https://escuela-de-mascotas.fungirak.com"),
  M("auxilios", "Primeros Auxilios", "https://primeros-auxilios.fungirak.com"), M("trivia", "La Gran Trivia", "https://trivia.fungirak.com"), M("figus", "Figus", "https://figus.fungirak.com"),
  M("voluntarios", "Una Mano", "https://voluntarios.fungirak.com"), M("prode", "Prode", "https://prode.fungirak.com"), M("afinados", "Afinados", "https://afinados.fungirak.com"),
  M("oculta", "Santa Fe Oculta", "https://santafe-oculta.fungirak.com"), M("hoy", "Hoy", "https://hoy.fungirak.com"),
  { id: "gourmet", nombre: "Santa Fe Gourmet", url: "https://santafe-gourmet.fungirak.com", tipo: "molde" },
  { id: "atlas", nombre: "Atlas Fit Pro", url: "https://atlasfit-pro.fungirak.com", tipo: "atlas" },
  { id: "mitour", nombre: "MiTour", url: "https://mitour.fungirak.com", tipo: "solo-eventos" },
];
const CORREO = "https://correo.fungirak.com/api/admin";
const intentos = new Map();
const ipDe = (req) => (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "?";

async function pedir(url, llave, ms = 12000) {
  try {
    const r = await fetch(url, { headers: { "x-admin-key": llave }, cache: "no-store", signal: AbortSignal.timeout(ms) });
    const j = await r.json().catch(() => ({}));
    return r.ok ? { ok: true, d: j } : { ok: false, codigo: r.status, error: j.error || `Error ${r.status}` };
  } catch (e) { return { ok: false, error: e?.name === "TimeoutError" ? "No respondió a tiempo" : "Sin conexión" }; }
}

async function deApp(a, llave, dias) {
  const rutaEv = a.tipo === "atlas" ? `${a.url}/api/admin?vista=auditoria&dias=${dias}` : `${a.url}/api/auditoria?vista=eventos&dias=${dias}`;
  const rutaCa = a.tipo === "atlas" ? `${a.url}/api/admin?vista=cadena` : a.tipo === "molde" ? `${a.url}/api/auditoria?vista=cadena` : null;
  const [ev, ca] = await Promise.all([pedir(rutaEv, llave), rutaCa ? pedir(rutaCa, llave) : Promise.resolve(null)]);
  return {
    id: a.id, nombre: a.nombre,
    error: ev.ok ? null : ev.error,
    cadena: ca?.ok ? ca.d.cadena || null : null,
    eventos: ev.ok && Array.isArray(ev.d.eventos) ? ev.d.eventos.slice(0, 300).map((e) => ({ ...e, app: a.id })) : [],
  };
}

export async function POST(req) {
  const ip = ipDe(req), ahora = Date.now();
  const l = (intentos.get(ip) || []).filter((t) => ahora - t < 15 * 60e3);
  if (l.length >= 20) return Response.json({ error: "Demasiados pedidos. Esperá unos minutos." }, { status: 429 });
  l.push(ahora); intentos.set(ip, l); if (intentos.size > 2000) intentos.clear();
  const llave = req.headers.get("x-admin-key") || "";
  if (llave.length < 16 || llave.length > 200) return Response.json({ error: "Contraseña incorrecta." }, { status: 401 });
  const correo = await pedir(CORREO, llave);
  if (!correo.ok && (correo.codigo === 401 || correo.codigo === 429)) return Response.json({ error: "Contraseña incorrecta." }, { status: 401 });
  const dias = Math.min(365, Math.max(1, Number(new URL(req.url).searchParams.get("dias")) || 7));
  await registrar(req, "auditoria.consulta", { global: true, dias });
  const [apps, propiaEv, propiaCa] = await Promise.all([Promise.all(APPS.map((a) => deApp(a, llave, dias))), eventosPropios(dias).catch(() => []), cadenaPropia().catch(() => null)]);
  apps.unshift({ id: "fungirak", nombre: "fungirak.com", error: null, cadena: propiaCa, eventos: propiaEv.map((e) => ({ ...e, app: "fungirak" })) });
  const todos = apps.flatMap((a) => a.eventos).sort((x, y) => new Date(y.creado) - new Date(x.creado)).slice(0, 600);
  return Response.json({ apps: apps.map(({ eventos, ...a }) => ({ ...a, n: eventos.length })), eventos: todos, dias, generado: new Date().toISOString() }, { headers: { "Cache-Control": "no-store" } });
}
