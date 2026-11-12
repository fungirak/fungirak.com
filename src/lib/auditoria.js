import "server-only";
import { sql, hashIp } from "./db";
// Auditoría de fungirak.com: mensajes de «Hablemos», publicaciones del muro, participación en el concurso y la ruleta,
// entradas al panel y moderación. Nunca guarda la IP (solo la misma huella con sal que usa el resto del sitio) ni el
// contenido de los mensajes. Cadena de huellas: cada fila guarda la de la anterior («ant») y la suya (disparador en la base),
// así un cambio o un borrado reciente se detecta con verificarCadena(). Lo común se borra a los 12 meses; lo legal, a los 5 años.
const LEGALES = ["contacto.mensaje", "concurso.participa", "panel.entrada", "moderacion.accion"];
let lista = null;
function asegurar() {
  if (!sql) return Promise.resolve(false);
  lista ??= (async () => {
    await sql`CREATE TABLE IF NOT EXISTS auditoria (id bigserial PRIMARY KEY, evento text NOT NULL, usuario text, ip text, pais text, region text, dispositivo text, detalle jsonb NOT NULL DEFAULT '{}', creado timestamptz NOT NULL DEFAULT now(), ant text, huella text)`;
    await sql`CREATE INDEX IF NOT EXISTS auditoria_evento ON auditoria (evento, creado DESC)`;
    await sql`CREATE OR REPLACE FUNCTION auditoria_cadena() RETURNS trigger LANGUAGE plpgsql AS $f$
      DECLARE a text;
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext('fungirak.auditoria'));
        SELECT huella INTO a FROM auditoria WHERE huella IS NOT NULL ORDER BY id DESC LIMIT 1;
        NEW.ant := a;
        NEW.huella := encode(sha256(convert_to(coalesce(a, '') || '|' || NEW.evento || '|' || coalesce(NEW.usuario, '') || '|' || coalesce(NEW.ip, '') || '|' || NEW.detalle::text || '|' || extract(epoch from NEW.creado)::text, 'UTF8')), 'hex');
        RETURN NEW;
      END $f$`.catch((e) => console.error("auditoria: cadena", e?.message));
    await sql`DROP TRIGGER IF EXISTS auditoria_cadena ON auditoria`.catch(() => {});
    await sql`CREATE TRIGGER auditoria_cadena BEFORE INSERT ON auditoria FOR EACH ROW EXECUTE FUNCTION auditoria_cadena()`.catch((e) => console.error("auditoria: cadena", e?.message));
    return true;
  })().catch((e) => { lista = null; console.error("auditoria", e?.message); return false; });
  return lista;
}
const dispositivoDe = (ua = "") => `${/Edg\//.test(ua) ? "Edge" : /Firefox\//.test(ua) ? "Firefox" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "otro"} · ${/iPhone|iPad/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Mac OS/.test(ua) ? "Mac" : /Linux/.test(ua) ? "Linux" : "otro"}`;

// Nunca frena la acción: si la base no responde, solo queda el error en el log.
export async function registrar(req, evento, detalle = {}) {
  try {
    if (!(await asegurar())) return;
    const h = req.headers;
    await sql`INSERT INTO auditoria (evento, ip, pais, region, dispositivo, detalle) VALUES (${evento}, ${hashIp(req)}, ${h.get("x-vercel-ip-country")}, ${h.get("x-vercel-ip-country-region")}, ${dispositivoDe(h.get("user-agent") || "")}, ${JSON.stringify(detalle || {})}::jsonb)`;
    if (Math.random() < 0.01) {
      await sql`DELETE FROM auditoria WHERE creado < now() - interval '12 months' AND NOT (evento = ANY(${LEGALES}))`;
      await sql`DELETE FROM auditoria WHERE creado < now() - interval '5 years'`;
    }
  } catch (e) { console.error("auditoria", e?.message); }
}

export async function eventos(dias = 30) {
  if (!(await asegurar())) return [];
  return sql`SELECT id, evento, usuario AS apodo, ip, pais, region, dispositivo, detalle, creado FROM auditoria WHERE creado > now() - make_interval(days => ${dias}) ORDER BY id DESC LIMIT 300`;
}

export async function verificarCadena() {
  if (!(await asegurar())) return null;
  const [r] = await sql`WITH c AS (SELECT id, ant, huella, lag(huella) OVER (ORDER BY id) AS lh, lag(creado) OVER (ORDER BY id) AS lc, row_number() OVER (ORDER BY id) AS n,
      encode(sha256(convert_to(coalesce(a.ant, '') || '|' || a.evento || '|' || coalesce(a.usuario, '') || '|' || coalesce(a.ip, '') || '|' || a.detalle::text || '|' || extract(epoch from a.creado)::text, 'UTF8')), 'hex') AS calc
      FROM auditoria a WHERE huella IS NOT NULL)
    SELECT count(*)::int AS encadenadas, count(*) FILTER (WHERE huella <> calc)::int AS alteradas,
      count(*) FILTER (WHERE n > 1 AND coalesce(ant, '') <> coalesce(lh, '') AND lc > now() - interval '12 months')::int AS huecos,
      count(*) FILTER (WHERE n > 1 AND coalesce(ant, '') <> coalesce(lh, '') AND lc <= now() - interval '12 months')::int AS limpiezas FROM c`;
  return { encadenadas: r.encadenadas, alteradas: r.alteradas, huecos: r.huecos, limpiezas: r.limpiezas, sana: !r.alteradas && !r.huecos };
}
