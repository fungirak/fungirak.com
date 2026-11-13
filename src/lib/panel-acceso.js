// Acceso al panel del estudio con la Cuenta FUNGIRAK (rol admin + código de dos pasos), igual que el /admin de cada app.
// La cuenta firma un pase ES256 de 2 minutos para «estudio»; /api/panel/entrar lo canjea por una cookie propia (8 h, httpOnly,
// SameSite=Strict) firmada con PANEL_SECRETO. Con esa cookie el servidor usa la llave maestra guardada en Vercel
// (FUNGIRAK_ADMIN_KEY) para hablar con las apps: la clave nunca pasa por el navegador.
import "server-only";
import { cookies } from "next/headers";
import { createHmac, createPublicKey, timingSafeEqual, verify } from "node:crypto";

export const CUENTA = "https://cuenta.fungirak.com";
export const ID_PANEL = "estudio";
export const COOKIE_PANEL = "fk_panel";
export const HORAS_PANEL = 8;
const secreto = () => process.env.PANEL_SECRETO || "";
const firma = (q, exp) => createHmac("sha256", `panel:${secreto()}`).update(`${q}.${exp}`).digest("base64url");

export function valorSesion(usuario) {
  const q = Buffer.from(String(usuario)).toString("base64url"), exp = Math.floor(Date.now() / 1000) + HORAS_PANEL * 3600;
  return `${q}.${exp}.${firma(q, exp)}`;
}
// Quién tiene el panel abierto en este navegador, o null.
export async function sesionPanel() {
  if (secreto().length < 32) return null;
  const [q, exp, f] = ((await cookies()).get(COOKIE_PANEL)?.value || "").split(".");
  if (!q || !f || !(Number(exp) > Date.now() / 1000)) return null;
  const a = Buffer.from(f), b = Buffer.from(firma(q, exp));
  return a.length === b.length && timingSafeEqual(a, b) ? Buffer.from(q, "base64url").toString() : null;
}
// La llave para hablar con las apps: la del servidor si hay sesión; si no, la que mandó el navegador (modo viejo, con clave).
export async function llavePanel(req) {
  if (await sesionPanel()) return process.env.FUNGIRAK_ADMIN_KEY || "";
  return req.headers.get("x-admin-key") || "";
}

let jwks = null, jwksEn = 0;
async function claves(forzar) {
  if (!forzar && jwks && Date.now() - jwksEn < 3600e3) return jwks;
  const r = await fetch(`${CUENTA}/.well-known/jwks.json`, { signal: AbortSignal.timeout(5000), cache: "no-store" });
  jwks = (await r.json()).keys || []; jwksEn = Date.now();
  return jwks;
}
// Verifica el pase de la cuenta: firma ES256, para «estudio», vigente y de tipo admin. Devuelve el contenido o null.
export async function verificarPase(token) {
  const [h, p, f] = String(token || "").trim().split(".");
  if (!h || !p || !f) return null;
  let cab, cuerpo; try { cab = JSON.parse(Buffer.from(h, "base64url")); cuerpo = JSON.parse(Buffer.from(p, "base64url")); } catch { return null; }
  if (cab.alg !== "ES256") return null;
  for (const forzar of [false, true]) {
    const k = (await claves(forzar).catch(() => [])).find((x) => x.kid === cab.kid);
    if (!k) continue;
    const ok = verify("sha256", Buffer.from(`${h}.${p}`), { key: createPublicKey({ key: k, format: "jwk" }), dsaEncoding: "ieee-p1363" }, Buffer.from(f, "base64url"));
    const ahora = Math.floor(Date.now() / 1000);
    if (!ok || cuerpo.aud !== ID_PANEL || cuerpo.iss !== CUENTA || !(cuerpo.exp > ahora) || cuerpo.iat > ahora + 60 || cuerpo.tipo !== "admin" || typeof cuerpo.sub !== "string") return null;
    return cuerpo;
  }
  return null;
}

// Modo viejo (clave pegada): antes de usarla contra cualquier app se valida contra el correo central, con tope de 5 fallos
// cada 15 minutos por conexión. Las válidas se recuerdan 5 minutos (solo una huella, nunca la clave).
const okClaves = new Map(), fallos = new Map();
export async function accesoPanel(req) {
  if (await sesionPanel()) return { llave: process.env.FUNGIRAK_ADMIN_KEY || "", sesion: true };
  const llave = req.headers.get("x-admin-key") || "";
  if (llave.length < 16 || llave.length > 200) return { error: "Entrá de nuevo al panel.", status: 401 };
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "?", ahora = Date.now();
  const f = (fallos.get(ip) || []).filter((t) => ahora - t < 15 * 60e3);
  if (f.length >= 5) return { error: "Demasiados intentos. Esperá 15 minutos.", status: 429 };
  const h = createHmac("sha256", "panel-clave").update(llave).digest("base64url");
  if ((okClaves.get(h) || 0) > ahora) return { llave, sesion: false };
  const r = await fetch("https://correo.fungirak.com/api/admin", { headers: { "x-admin-key": llave }, cache: "no-store", signal: AbortSignal.timeout(9000) }).catch(() => null);
  if (!r?.ok) { f.push(ahora); fallos.set(ip, f); if (fallos.size > 2000) fallos.clear(); return { error: "Contraseña incorrecta.", status: 401 }; }
  okClaves.set(h, ahora + 5 * 60e3); if (okClaves.size > 50) okClaves.clear();
  return { llave, sesion: false };
}
