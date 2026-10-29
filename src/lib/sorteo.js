import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { sql } from "./db";

// Concurso bimestral de ideas: cada dos meses, la mejor idea gana el diseño y desarrollo de un sitio web.
// Desde el 30/10/2026 reemplaza al sorteo al azar: en Santa Fe los juegos de azar necesitan autorización previa
// (Ley 6789) que solo se da a asociaciones, así que acá gana el mérito, con criterios publicados, nunca la suerte.
// Elige el Organizador: el día de cada edición le llega un mail con las ideas y un botón firmado para elegir la ganadora.
export const FECHAS = ["2026-12-05", "2027-02-05", "2027-04-05", "2027-06-05", "2027-08-05", "2027-10-05", "2027-12-05", "2028-02-05", "2028-04-05", "2028-06-05", "2028-08-05", "2028-10-05"];
export const CRITERIOS = [
  ["Originalidad", "qué tan nueva o distinta es la idea"],
  ["Utilidad", "a cuántas personas ayuda y cuánto"],
  ["Impacto local", "qué le aporta a tu barrio, tu ciudad o tu comunidad"],
  ["Claridad", "que se entienda qué querés hacer y para quién"],
];
export const IDEA_MIN = 40, IDEA_MAX = 1200;
const hoy = () => new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);
export const proximo = () => FECHAS.find((f) => f >= hoy()) || null;

let listo = null;
function asegurar() {
  listo =
    listo ||
    (async () => {
      await sql`CREATE TABLE IF NOT EXISTS sorteo_resultados (
        fecha date PRIMARY KEY, codigo text NOT NULL, email text NOT NULL,
        participaciones int NOT NULL, creado timestamptz NOT NULL DEFAULT now())`;
      await sql`CREATE TABLE IF NOT EXISTS concurso_ideas (
        codigo text PRIMARY KEY, creado timestamptz NOT NULL DEFAULT now(), edicion date NOT NULL,
        email text NOT NULL, nombre text, idea text NOT NULL, ip_hash text)`;
      await sql`CREATE UNIQUE INDEX IF NOT EXISTS concurso_ideas_una ON concurso_ideas (edicion, lower(email))`;
    })().catch((e) => {
      listo = null;
      throw e;
    });
  return listo;
}

// Público: cronograma, próxima edición, cuántas ideas hay y códigos ganadores (sin emails ni ideas)
export async function estado() {
  const base = { fechas: FECHAS, proximo: proximo(), ideas: 0, ganadores: [] };
  if (!sql) return base;
  await asegurar();
  const [[{ n }], ganadores] = await Promise.all([
    base.proximo ? sql`SELECT count(*)::int AS n FROM concurso_ideas WHERE edicion = ${base.proximo}` : [{ n: 0 }],
    sql`SELECT fecha::text AS fecha, codigo FROM sorteo_resultados ORDER BY fecha`,
  ]);
  return { ...base, ideas: n, ganadores };
}

const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const parte = (n) => Array.from(randomBytes(n), (b) => ALFABETO[b % ALFABETO.length]).join("");

// Mandar (o corregir) la idea para la próxima edición: una por email y por edición; se puede cambiar hasta el cierre.
export async function participar({ email, nombre, idea, ipHash }) {
  if (!sql) return { error: "no-disponible" };
  const edicion = proximo();
  if (!edicion) return { error: "cerrado" };
  const t = String(idea || "").trim();
  if (t.length < IDEA_MIN || t.length > IDEA_MAX) return { error: "idea" };
  await asegurar();
  const [ganador] = await sql`SELECT 1 FROM sorteo_resultados WHERE lower(email) = lower(${email})`;
  if (ganador) return { error: "ya-ganaste" };
  const [r] = await sql`INSERT INTO concurso_ideas (codigo, edicion, email, nombre, idea, ip_hash)
    VALUES (${`IDEA-${parte(6)}`}, ${edicion}, ${email}, ${nombre || null}, ${t}, ${ipHash})
    ON CONFLICT (edicion, lower(email)) DO UPDATE SET idea = excluded.idea, nombre = excluded.nombre, creado = now()
    RETURNING codigo, edicion::text AS edicion, NOT (xmax = 0) AS corregida`;
  return { codigo: r.codigo, edicion: r.edicion, corregida: r.corregida };
}

// Para el mail del Organizador: las ideas de una edición
export async function ideasDe(fecha) {
  if (!sql) return [];
  await asegurar();
  return sql`SELECT codigo, email, nombre, idea, creado FROM concurso_ideas WHERE edicion = ${fecha} ORDER BY creado`;
}

// Firma del botón «Elegir esta idea» del mail (sin la clave, nadie puede elegir)
export function firma(fecha, codigo) {
  const k = process.env.SORTEO_CLAVE || "";
  return k ? createHmac("sha256", k).update(`${fecha}:${codigo}`).digest("base64url").slice(0, 32) : "";
}
export function firmaValida(fecha, codigo, dada) {
  const a = Buffer.from(firma(fecha, codigo)), b = Buffer.from(String(dada || ""));
  return a.length > 0 && a.length === b.length && timingSafeEqual(a, b);
}

// El Organizador elige la idea ganadora de una edición (una sola vez, desde el día de la edición)
export async function elegir(fecha, codigo) {
  if (!sql) return { error: "no-disponible" };
  if (!FECHAS.includes(fecha)) return { error: "fecha-invalida" };
  if (fecha > hoy()) return { error: "todavia-no" };
  await asegurar();
  const [hecho] = await sql`SELECT codigo FROM sorteo_resultados WHERE fecha = ${fecha}`;
  if (hecho) return { error: "ya-elegida", codigo: hecho.codigo };
  const [g] = await sql`SELECT codigo, email, nombre FROM concurso_ideas WHERE codigo = ${codigo} AND edicion = ${fecha}`;
  if (!g) return { error: "codigo" };
  const [{ n }] = await sql`SELECT count(*)::int AS n FROM concurso_ideas WHERE edicion = ${fecha}`;
  await sql`INSERT INTO sorteo_resultados (fecha, codigo, email, participaciones) VALUES (${fecha}, ${g.codigo}, ${g.email}, ${n})`;
  return { fecha, codigo: g.codigo, email: g.email, nombre: g.nombre, ideas: n };
}

// Quienes tenían un número del sorteo anterior (ruleta «Sorteo sitio») y todavía no fueron avisados del cambio a concurso.
export async function participantesViejosSinAviso() {
  if (!sql) return [];
  await asegurar();
  await sql`CREATE TABLE IF NOT EXISTS concurso_avisos (email text PRIMARY KEY, creado timestamptz NOT NULL DEFAULT now())`;
  return sql`SELECT DISTINCT lower(email) AS email FROM ruleta_cupones WHERE premio = 'sorteo'
    AND lower(email) NOT IN (SELECT email FROM concurso_avisos)`.catch(() => []);
}
export const marcarAvisado = (email) => sql`INSERT INTO concurso_avisos (email) VALUES (${email}) ON CONFLICT DO NOTHING`;
