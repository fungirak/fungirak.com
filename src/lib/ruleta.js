import "server-only";
import { randomBytes } from "node:crypto";
import { sql } from "./db";

// Ruleta del micelio: el resultado lo decide SIEMPRE el servidor (el navegador sólo anima).
// Probabilidades y códigos nunca llegan al frontend. Cada código queda guardado con su email.
// Pesos (suman 100): ajustables acá. Los descuentos altos salen poco.
export const PREMIOS = {
  d10: { peso: 26, es: "10% off en tu proyecto", en: "10% off your project", cupon: "10" },
  d15: { peso: 12, es: "15% off en tu proyecto", en: "15% off your project", cupon: "15" },
  d20: { peso: 4, es: "20% off en tu proyecto", en: "20% off your project", cupon: "20" },
  sorteo: { peso: 10, es: "Participás del sorteo de un sitio gratis", en: "You're in the free website giveaway", cupon: "SORTEO" },
  mes: { peso: 8, es: "1 mes gratis del plan FUNGIRAK", en: "1 free month of the FUNGIRAK plan" },
  otro: { peso: 16 },
  nada: { peso: 24 },
};
const CON_PREMIO = ["d10", "d15", "d20", "sorteo", "mes"];
export const DIAS_MES = 30;
const MAX_GIROS_DIA = 4; // aunque salga "otro giro" varias veces

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

function sortear() {
  // Número al azar criptográfico entre 0 y 99
  let r = randomBytes(4).readUInt32BE(0) % 100;
  for (const [id, p] of Object.entries(PREMIOS)) {
    if (r < p.peso) return id;
    r -= p.peso;
  }
  return "nada";
}

// ¿Puede girar hoy? (sólo consulta, no gira)
export async function puedeGirar(ipHash, dispositivo) {
  if (!sql) return { puede: false, error: "no-disponible" };
  await asegurar();
  const hoy = await sql`SELECT premio FROM ruleta_giros
    WHERE dia = (now() AT TIME ZONE 'America/Argentina/Buenos_Aires')::date AND (ip_hash = ${ipHash} OR dispositivo = ${dispositivo})`;
  return { puede: !(hoy.filter((g) => g.premio !== "otro").length > 0 || hoy.length >= MAX_GIROS_DIA) };
}

// Puede girar si hoy (por conexión o por dispositivo) no tuvo un giro "final" y no pasó el tope.
export async function girar(ipHash, dispositivo) {
  if (!sql) return { error: "no-disponible" };
  await asegurar();
  const hoy = await sql`SELECT premio FROM ruleta_giros
    WHERE dia = (now() AT TIME ZONE 'America/Argentina/Buenos_Aires')::date AND (ip_hash = ${ipHash} OR dispositivo = ${dispositivo})`;
  const finales = hoy.filter((g) => g.premio !== "otro").length;
  if (finales > 0 || hoy.length >= MAX_GIROS_DIA) return { error: "ya-giraste" };
  const premio = sortear();
  const token = randomBytes(18).toString("base64url");
  await sql`INSERT INTO ruleta_giros (ip_hash, dispositivo, premio, token) VALUES (${ipHash}, ${dispositivo}, ${premio}, ${token})`;
  return { premio, token: CON_PREMIO.includes(premio) ? token : null };
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
  const [previo] = await sql`SELECT 1 FROM ruleta_cupones WHERE lower(email) = lower(${email}) AND creado > now() - interval '30 days'`;
  if (previo) return { error: "email-usado" };
  const p = PREMIOS[g.premio];
  // «1 mes de plan»: un código RUL-XXXX-XXXX que se canjea en cuenta.fungirak.com (la cuenta lo valida acá, ver canjearMes)
  const codigo = g.premio === "sorteo" ? `SORTEO-${parte(6)}` : g.premio === "mes" ? `RUL-${parte(4)}-${parte(4)}` : `FUNGI-${p.cupon}-${parte(5)}`;
  const [ok] = await sql`UPDATE ruleta_giros SET reclamado = true WHERE id = ${g.id} AND NOT reclamado RETURNING id`;
  if (!ok) return { error: "ya-reclamado" };
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
