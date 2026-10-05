import "server-only";
import { neon } from "@neondatabase/serverless";
import { createHash } from "node:crypto";

// Base Neon (capa gratuita). Si todavía no está conectada, se usa memoria del servidor
// para que el sitio funcione igual (los números se reinician con cada deploy).
const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
export const sql = url ? neon(url) : null;

let listo = null;
export function asegurarTablas() {
  if (!sql) return Promise.resolve();
  listo =
    listo ||
    (async () => {
      await sql`CREATE TABLE IF NOT EXISTS contadores (clave text PRIMARY KEY, valor bigint NOT NULL DEFAULT 0)`;
      await sql`CREATE TABLE IF NOT EXISTS mensajes (
        id serial PRIMARY KEY,
        creado timestamptz NOT NULL DEFAULT now(),
        nombre text NOT NULL,
        email text,
        telefono text,
        perfil text,
        interes text,
        mensaje text,
        idioma text,
        ip_hash text
      )`;
      await sql`ALTER TABLE mensajes ADD COLUMN IF NOT EXISTS brief jsonb`;
      await sql`CREATE INDEX IF NOT EXISTS mensajes_ip_creado ON mensajes (ip_hash, creado)`;
      await sql`CREATE TABLE IF NOT EXISTS muro (
        id serial PRIMARY KEY,
        creado timestamptz NOT NULL DEFAULT now(),
        tipo text NOT NULL,
        nombre text,
        emoji text NOT NULL,
        texto text NOT NULL,
        votos int NOT NULL DEFAULT 0,
        reportes int NOT NULL DEFAULT 0,
        visible boolean NOT NULL DEFAULT true,
        ip_hash text
      )`;
      await sql`CREATE INDEX IF NOT EXISTS muro_tipo_visible ON muro (tipo, visible, creado DESC)`;
    })().catch((e) => {
      listo = null;
      throw e;
    });
  return listo;
}

const memoria = globalThis.__fgkMem || (globalThis.__fgkMem = { contadores: new Map(), mensajes: [] });

export async function sumar(clave, n = 1) {
  if (!sql) {
    const v = (memoria.contadores.get(clave) || 0) + n;
    memoria.contadores.set(clave, v);
    return v;
  }
  await asegurarTablas();
  const r = await sql`INSERT INTO contadores (clave, valor) VALUES (${clave}, ${n})
    ON CONFLICT (clave) DO UPDATE SET valor = contadores.valor + ${n} RETURNING valor`;
  return Number(r[0].valor);
}

export async function leerContadores() {
  if (!sql) return Object.fromEntries(memoria.contadores);
  await asegurarTablas();
  const r = await sql`SELECT clave, valor FROM contadores`;
  return Object.fromEntries(r.map((x) => [x.clave, Number(x.valor)]));
}

export async function guardarMensaje(m) {
  if (!sql) {
    memoria.mensajes.push({ ...m, creado: new Date() });
    return memoria.mensajes.length;
  }
  await asegurarTablas();
  const r = await sql`INSERT INTO mensajes (nombre, email, telefono, perfil, interes, mensaje, idioma, ip_hash, brief)
    VALUES (${m.nombre}, ${m.email}, ${m.telefono}, ${m.perfil}, ${m.interes}, ${m.mensaje}, ${m.idioma}, ${m.ip_hash}, ${m.brief ? JSON.stringify(m.brief) : null}::jsonb)
    RETURNING id`;
  return r[0].id;
}

export async function mensajesRecientes(ipHash) {
  if (!sql) {
    const hace = Date.now() - 3600_000;
    return memoria.mensajes.filter((m) => m.ip_hash === ipHash && m.creado.getTime() > hace).length;
  }
  await asegurarTablas();
  const r = await sql`SELECT count(*)::int AS n FROM mensajes WHERE ip_hash = ${ipHash} AND creado > now() - interval '1 hour'`;
  return r[0].n;
}

// Nunca se guarda la IP: solo un hash con sal para limitar abusos.
export function hashIp(req) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
  return createHash("sha256").update(`${process.env.IP_SALT || "fungirak"}:${ip}`).digest("hex").slice(0, 24);
}

// Límite simple por instancia para eventos livianos (visitas, aplausos)
const ventanas = globalThis.__fgkRate || (globalThis.__fgkRate = new Map());
export function permitido(clave, max, ms) {
  const ahora = Date.now();
  const lista = (ventanas.get(clave) || []).filter((t) => ahora - t < ms);
  if (lista.length >= max) return false;
  lista.push(ahora);
  ventanas.set(clave, lista);
  return true;
}

export function mismoOrigen(req) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    const host = new URL(origin).host;
    return host === req.headers.get("host") || host.endsWith("fungirak.com") || host.endsWith(".vercel.app") || host.startsWith("localhost");
  } catch {
    return false;
  }
}

// ---------- Muro de la comunidad (huellas e ideas de sitios) ----------
export async function leerMuro() {
  if (!sql) {
    const v = (memoria.muro || []).filter((x) => x.visible);
    return {
      huellas: v.filter((x) => x.tipo === "huella").sort((a, b) => b.id - a.id).slice(0, 60),
      ideas: v.filter((x) => x.tipo === "idea").sort((a, b) => b.votos - a.votos || b.id - a.id).slice(0, 40),
    };
  }
  await asegurarTablas();
  const huellas = await sql`SELECT id, creado, nombre, emoji, texto FROM muro WHERE tipo = 'huella' AND visible ORDER BY creado DESC LIMIT 60`;
  const ideas = await sql`SELECT id, creado, nombre, emoji, texto, votos FROM muro WHERE tipo = 'idea' AND visible ORDER BY votos DESC, creado DESC LIMIT 40`;
  return { huellas, ideas };
}

export async function publicarMuro(x) {
  if (!sql) {
    memoria.muro = memoria.muro || [];
    const item = { ...x, id: memoria.muro.length + 1, creado: new Date().toISOString(), votos: 0, reportes: 0, visible: true };
    memoria.muro.push(item);
    const { ip_hash, ...publico } = item;
    return publico;
  }
  await asegurarTablas();
  const r = await sql`INSERT INTO muro (tipo, nombre, emoji, texto, ip_hash) VALUES (${x.tipo}, ${x.nombre}, ${x.emoji}, ${x.texto}, ${x.ip_hash})
    RETURNING id, creado, nombre, emoji, texto, votos`;
  return r[0];
}

export async function publicacionesRecientes(ipHash) {
  if (!sql) return (memoria.muro || []).filter((m) => m.ip_hash === ipHash && Date.now() - new Date(m.creado).getTime() < 3600_000).length;
  await asegurarTablas();
  const r = await sql`SELECT count(*)::int AS n FROM muro WHERE ip_hash = ${ipHash} AND creado > now() - interval '1 hour'`;
  return r[0].n;
}

export async function accionMuro(id, accion) {
  if (!sql) {
    const it = (memoria.muro || []).find((m) => m.id === id);
    if (!it) return null;
    if (accion === "votar") return ++it.votos;
    if (++it.reportes >= 3) it.visible = false;
    return true;
  }
  await asegurarTablas();
  if (accion === "votar") {
    const r = await sql`UPDATE muro SET votos = votos + 1 WHERE id = ${id} AND tipo = 'idea' AND visible RETURNING votos`;
    return r[0]?.votos ?? null;
  }
  await sql`UPDATE muro SET reportes = reportes + 1, visible = (reportes + 1) < 3 WHERE id = ${id}`;
  return true;
}
