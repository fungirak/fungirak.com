import "server-only";
import { randomBytes } from "node:crypto";
import { sql } from "./db";

// Sorteo bimestral del sitio web: 12 sorteos, el día 5 de cada mes par, de dic-2026 a oct-2028.
// Participan los códigos SORTEO-… que da la ruleta (tabla ruleta_cupones). Cada participación vale una
// chance en todos los sorteos siguientes, hasta 24 meses o hasta que esa persona gane.
export const FECHAS = ["2026-12-05", "2027-02-05", "2027-04-05", "2027-06-05", "2027-08-05", "2027-10-05", "2027-12-05", "2028-02-05", "2028-04-05", "2028-06-05", "2028-08-05", "2028-10-05"];
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
    })().catch((e) => {
      listo = null;
      throw e;
    });
  return listo;
}

// Público: cronograma, próximo sorteo, cuántas participaciones hay y códigos ganadores (sin emails)
export async function estado() {
  const base = { fechas: FECHAS, proximo: proximo(), participaciones: 0, ganadores: [] };
  if (!sql) return base;
  await asegurar();
  const [[{ n }], ganadores] = await Promise.all([
    sql`SELECT count(*)::int AS n FROM ruleta_cupones c WHERE c.premio = 'sorteo' AND c.creado > now() - interval '24 months'
      AND lower(c.email) NOT IN (SELECT lower(email) FROM sorteo_resultados)`.catch(() => [{ n: 0 }]),
    sql`SELECT fecha::text AS fecha, codigo FROM sorteo_resultados ORDER BY fecha`,
  ]);
  return { ...base, participaciones: n, ganadores };
}

// Sólo el dueño (con clave): sortea la fecha indicada. Una vez por fecha; no antes de que llegue.
export async function sortear(fecha) {
  if (!sql) return { error: "no-disponible" };
  if (!FECHAS.includes(fecha)) return { error: "fecha-invalida" };
  if (fecha > hoy()) return { error: "todavia-no" };
  await asegurar();
  const [hecho] = await sql`SELECT codigo FROM sorteo_resultados WHERE fecha = ${fecha}`;
  if (hecho) return { error: "ya-sorteado", codigo: hecho.codigo };
  // Participaciones vigentes hasta el día del sorteo, sin ganadores anteriores (cada código = 1 chance)
  const lista = await sql`SELECT codigo, email FROM ruleta_cupones
    WHERE premio = 'sorteo' AND creado::date <= ${fecha}::date AND creado > ${fecha}::date - interval '24 months'
      AND lower(email) NOT IN (SELECT lower(email) FROM sorteo_resultados)
    ORDER BY codigo`;
  if (!lista.length) return { error: "sin-participantes" };
  const g = lista[randomBytes(4).readUInt32BE(0) % lista.length];
  await sql`INSERT INTO sorteo_resultados (fecha, codigo, email, participaciones) VALUES (${fecha}, ${g.codigo}, ${g.email}, ${lista.length})`;
  return { fecha, codigo: g.codigo, email: g.email, participaciones: lista.length };
}
