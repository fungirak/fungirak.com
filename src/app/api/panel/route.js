// Panel global del estudio (fungirak.com/panel): junta los números de todas las apps con backend en una sola vista.
// No guarda ninguna clave: la contraseña maestra viene en cada pedido (x-admin-key) y se reenvía solo a la lista fija de abajo.
// Team Joy queda afuera (se maneja aparte, en AWS).
const APPS = [
  { id: "mate", nombre: "La Escuela del Mate", url: "https://escuela-del-mate.fungirak.com", tipo: "kit", emoji: "🧉" },
  { id: "asador", nombre: "La Escuela del Asador", url: "https://escueladelasador.fungirak.com", tipo: "kit", emoji: "🔥" },
  { id: "micoteca", nombre: "Micoteca", url: "https://micoteca.fungirak.com", tipo: "kit", emoji: "🍄" },
  { id: "surco", nombre: "Surco", url: "https://surco.fungirak.com", tipo: "kit", emoji: "🌱" },
  { id: "musgui", nombre: "Musgui", url: "https://musgui.fungirak.com", tipo: "kit", emoji: "🌿" },
  { id: "atalaya", nombre: "Atalaya", url: "https://atalaya.fungirak.com", tipo: "kit", emoji: "🛡️" },
  { id: "mitour", nombre: "MiTour", url: "https://mitour.fungirak.com", tipo: "kit", emoji: "✈️" },
  { id: "dertin", nombre: "Dertin", url: "https://dertin.fungirak.com", tipo: "dertin", emoji: "💞" },
  { id: "atlas", nombre: "Atlas Fit Pro", url: "https://atlasfit-pro.fungirak.com", tipo: "atlas", emoji: "🏋️" },
  // las del molde nuevo: su panel da el uso de los últimos 30 días (personas, cuentas y visitas)
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
];
const CORREO = "https://correo.fungirak.com/api/admin";
const intentos = new Map(); // freno por conexión: así nadie usa el panel para probar contraseñas contra todas las apps
const ipDe = (req) => (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "?";

async function pedir(url, llave) {
  try {
    const r = await fetch(url, { headers: { "x-admin-key": llave }, cache: "no-store", signal: AbortSignal.timeout(9000) });
    const j = await r.json().catch(() => ({}));
    return r.ok ? { ok: true, d: j } : { ok: false, codigo: r.status, error: j.error || `Error ${r.status}` };
  } catch (e) { return { ok: false, codigo: 0, error: e?.name === "TimeoutError" ? "No respondió a tiempo" : "Sin conexión" }; }
}
const pendientes = (m) => ["publicaciones", "comentarios", "propuestas", "mensajes"].reduce((t, k) => t + (Array.isArray(m?.[k]) ? m[k].filter((x) => x.oculto || x.denuncias > 0).length : 0), 0);

async function app(a, llave) {
  if (a.tipo === "kit") {
    const [n, m] = await Promise.all([pedir(`${a.url}/api/moderacion?vista=numeros`, llave), pedir(`${a.url}/api/moderacion`, llave)]);
    if (!n.ok) return { ...a, ok: false, error: n.error, codigo: n.codigo };
    const x = n.d.numeros || {};
    return { ...a, ok: true, cuentas: x.cuentas, nuevas7: x.nuevas7, activas7: x.activas7, pendientes: m.ok ? pendientes(m.d) : null, dias: n.d.dias || [], extra: x };
  }
  if (a.tipo === "dertin") {
    const r = await pedir(`${a.url}/api/admin?view=overview`, llave);
    if (!r.ok) return { ...a, ok: false, error: r.error, codigo: r.codigo };
    const o = r.d;
    return { ...a, ok: true, cuentas: o.players, nuevas7: null, nuevasHoy: o.new_today, activas7: o.active_7d, pendientes: (o.reports_open || 0) + (o.msg_reports_7d || 0), extra: o };
  }
  if (a.tipo === "molde") {
    const r = await pedir(`${a.url}/api/admin/uso`, llave);
    if (!r.ok) return { ...a, ok: false, error: r.error, codigo: r.codigo };
    const t = r.d.total || {};
    return { ...a, ok: true, cuentas: t.cuentas, nuevas7: null, activas7: null, pendientes: null, dias: r.d.dias || [], nota: `En 30 días: ${t.personas || 0} personas, ${t.visitas || 0} visitas`, extra: t };
  }
  const r = await pedir(`${a.url}/api/admin?vista=numeros`, llave);
  if (!r.ok) return { ...a, ok: false, error: r.error, codigo: r.codigo };
  const x = r.d.numeros || {};
  return { ...a, ok: true, cuentas: x.cuentas, nuevas7: x.nuevas7, activas7: x.activas7, pendientes: null, dias: r.d.dias || [], extra: x };
}

export async function POST(req) {
  const ip = ipDe(req), ahora = Date.now();
  const l = (intentos.get(ip) || []).filter((t) => ahora - t < 15 * 60e3);
  if (l.length >= 20) return Response.json({ error: "Demasiados pedidos. Esperá unos minutos." }, { status: 429 });
  l.push(ahora); intentos.set(ip, l); if (intentos.size > 2000) intentos.clear();
  const llave = req.headers.get("x-admin-key") || "";
  if (llave.length < 16 || llave.length > 200) return Response.json({ error: "Contraseña incorrecta." }, { status: 401 });
  // primero se prueba contra el correo central: si la contraseña no sirve, no se manda a ninguna app
  const correo = await pedir(CORREO, llave);
  if (!correo.ok && (correo.codigo === 401 || correo.codigo === 429)) return Response.json({ error: correo.codigo === 429 ? "Demasiados intentos. Esperá 15 minutos." : "Contraseña incorrecta." }, { status: correo.codigo });
  const apps = await Promise.all(APPS.map((a) => app(a, llave)));
  return Response.json({ apps, correo: correo.ok ? correo.d : { error: correo.error }, generado: new Date().toISOString() }, { headers: { "Cache-Control": "no-store" } });
}
