import "server-only";
import { randomBytes } from "node:crypto";
import { sql } from "./db";

// Ruleta del micelio, «la ruleta de los que vuelven»: el premio NO es al azar. Lo decide cuántos días distintos
// volviste a girar (por conexión o por dispositivo): la escalera está publicada en la portada y en las bases.
// Así no es un juego de azar (en Santa Fe, la Ley 6789 los prohíbe sin autorización previa). El navegador solo anima.
export const PREMIOS = {
  d10: { es: "10% off en tu proyecto", en: "10% off your project", cupon: "10" },
  d15: { es: "15% off en tu proyecto", en: "15% off your project", cupon: "15" },
  mes: { es: "1 mes gratis del plan FUNGIRAK", en: "1 free month of the FUNGIRAK plan" },
  d20: { es: "20% off en tu proyecto", en: "20% off your project", cupon: "20" },
};
// Día 1, día 2, día 3 y del cuarto en adelante
export const ESCALERA = ["d10", "d15", "mes", "d20"];
const CON_PREMIO = Object.keys(PREMIOS);
export const DIAS_MES = 30;

let listo = null;
function asegurar() {
  listo =
    listo ||
    (async () => {
      await sql`CREATE TABLE IF NOT EXISTS ruleta_giros (
        id serial PRIMARY KEY, creado timestamptz NOT NULL DEFAULT now(),
        dia date NOT NULL DEFAULT (now() AT TIME ZONE 'America/Argentina/Buenos_Aires')::date,
        ip_hash text NOT NULL, dispositivo text NOT NULL, premio text NOT NULL,
        token text UNIQUE NOT NULL, reclamado boolean NOT NULL DEFAULT false)`;
      await sql`CREATE INDEX IF NOT EXISTS ruleta_giros_dia ON ruleta_giros (dia, ip_hash)`;
      await sql`CREATE TABLE IF NOT EXISTS ruleta_cupones (
        codigo text PRIMARY KEY, creado timestamptz NOT NULL DEFAULT now(), vence date NOT NULL,
        premio text NOT NULL, email text NOT NULL, nombre text, giro_id int REFERENCES ruleta_giros(id),
        ip_hash text, usado boolean NOT NULL DEFAULT false)`;
      await sql`CREATE INDEX IF NOT EXISTS ruleta_cupones_email ON ruleta_cupones (lower(email), creado)`;
    })().catch((e) => {
      listo = null;
      throw e;
    });
  return listo;
}

// Cuántos días distintos (antes de hoy) giró esta conexión o este dispositivo → qué premio le toca hoy
async function diasPrevios(ipHash, dispositivo) {
  const [{ n }] = await sql`SELECT count(DISTINCT dia)::int AS n FROM ruleta_giros
    WHERE dia < (now() AT TIME ZONE 'America/Argentina/Buenos_Aires')::date AND (ip_hash = ${ipHash} OR dispositivo = ${dispositivo})`;
  return n;
}
const premioDelDia = (previos) => ESCALERA[Math.min(previos, ESCALERA.length - 1)];

// ¿Puede girar hoy? (sólo consulta, no gira)
export async function puedeGirar(ipHash, dispositivo) {
  if (!sql) return { puede: false, error: "no-disponible" };
  await asegurar();
  const hoy = await sql`SELECT premio FROM ruleta_giros
    WHERE dia = (now() AT TIME ZONE 'America/Argentina/Buenos_Aires')::date AND (ip_hash = ${ipHash} OR dispositivo = ${dispositivo})`;
  const previos = await diasPrevios(ipHash, dispositivo);
  return { puede: hoy.length === 0, dia: previos + 1, premio: premioDelDia(previos) };
}

// Puede girar si hoy (por conexión o por dispositivo) no tuvo un giro "final" y no pasó el tope.
export async function girar(ipHash, dispositivo) {
  if (!sql) return { error: "no-disponible" };
  await asegurar();
  const hoy = await sql`SELECT premio FROM ruleta_giros
    WHERE dia = (now() AT TIME ZONE 'America/Argentina/Buenos_Aires')::date AND (ip_hash = ${ipHash} OR dispositivo = ${dispositivo})`;
  if (hoy.length > 0) return { error: "ya-giraste" };
  const previos = await diasPrevios(ipHash, dispositivo);
  const premio = premioDelDia(previos);
  const token = randomBytes(18).toString("base64url");
  await sql`INSERT INTO ruleta_giros (ip_hash, dispositivo, premio, token) VALUES (${ipHash}, ${dispositivo}, ${premio}, ${token})`;
  return { premio, dia: previos + 1, token };
}

const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin letras/números que se confunden
const parte = (n) => Array.from(randomBytes(n), (b) => ALFABETO[b % ALFABETO.length]).join("");

// Canjea un giro ganador por un código único guardado con el email (una vez por giro, un premio por email cada 30 días)
export async function reclamar({ token, email, nombre, ipHash }) {
  if (!sql) return { error: "no-disponible" };
  await asegurar();
  const [g] = await sql`SELECT * FROM ruleta_giros WHERE token = ${token} AND creado > now() - interval '24 hours'`;
  if (!g || !CON_PREMIO.includes(g.premio)) return { error: "giro-invalido" };
  if (g.reclamado) return { error: "ya-reclamado" };
  // Un premio vigente por email cada 30 días. Si volviste y subiste de escalón, el nuevo reemplaza al anterior que no usaste.
  const previos = await sql`SELECT codigo, premio, usado FROM ruleta_cupones WHERE lower(email) = lower(${email}) AND premio <> 'sorteo' AND creado > now() - interval '30 days'`;
  if (previos.some((x) => x.usado)) return { error: "email-usado" };
  const nivel = (id) => ESCALERA.indexOf(id);
  if (previos.some((x) => nivel(x.premio) >= nivel(g.premio))) return { error: "email-usado" };
  const p = PREMIOS[g.premio];
  // «1 mes de plan»: un código RUL-XXXX-XXXX que se canjea en cuenta.fungirak.com (la cuenta lo valida acá, ver canjearMes)
  const codigo = g.premio === "mes" ? `RUL-${parte(4)}-${parte(4)}` : `FUNGI-${p.cupon}-${parte(5)}`;
  const [ok] = await sql`UPDATE ruleta_giros SET reclamado = true WHERE id = ${g.id} AND NOT reclamado RETURNING id`;
  if (!ok) return { error: "ya-reclamado" };
  if (previos.length) await sql`DELETE FROM ruleta_cupones WHERE codigo = ANY(${previos.map((x) => x.codigo)}) AND NOT usado`;
  const [c] = await sql`INSERT INTO ruleta_cupones (codigo, vence, premio, email, nombre, giro_id, ip_hash)
    VALUES (${codigo}, (now() + interval '60 days')::date, ${g.premio}, ${email}, ${nombre || null}, ${g.id}, ${ipHash}) RETURNING vence::text AS vence`;
  return { codigo, premio: g.premio, vence: c.vence };
}

// La cuenta FUNGIRAK (cuenta.fungirak.com) canjea acá un «1 mes de plan»: si el código existe, no se usó y no venció, se marca usado
// en el mismo paso (así no se canjea dos veces) y devuelve los días. El código es largo y al azar: sin él no se puede canjear nada.
export async function canjearMes(codigo) {
  if (!sql) return { error: "no-disponible" };
  await asegurar();
  const c = String(codigo || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!/^RUL[A-Z0-9]{8}$/.test(c)) return { error: "codigo" };
  const fmt = `RUL-${c.slice(3, 7)}-${c.slice(7)}`;
  const [r] = await sql`UPDATE ruleta_cupones SET usado = true WHERE codigo = ${fmt} AND premio = 'mes' AND NOT usado AND vence >= (now() AT TIME ZONE 'America/Argentina/Buenos_Aires')::date RETURNING codigo`;
  return r ? { ok: true, dias: DIAS_MES } : { error: "no-valido" };
}
// Números públicos de la ruleta (sin datos de nadie): giros de hoy y totales, premios entregados y meses de plan canjeados.
export async function numerosRuleta() {
  if (!sql) return null;
  await asegurar();
  const [x] = await sql`SELECT count(*)::int AS giros, count(*) FILTER (WHERE dia = (now() AT TIME ZONE 'America/Argentina/Buenos_Aires')::date)::int AS hoy FROM ruleta_giros`;
  const [y] = await sql`SELECT count(*)::int AS premios, count(*) FILTER (WHERE premio = 'mes')::int AS meses, count(*) FILTER (WHERE premio = 'mes' AND usado)::int AS meses_canjeados FROM ruleta_cupones`;
  return { ...x, ...y };
}
