import { ofensivas } from "./filtro";

// Reglas del muro: sin links, sin lenguaje ofensivo, sin gritar, sin spam.
export function revisar(texto) {
  if (/(https?:\/\/|www\.|\.com\b|\.ar\b|\.net\b|@\w{3,})/i.test(texto)) return "links";
  if (ofensivas(texto).length) return "lenguaje";
  const letras = texto.replace(/[^a-záéíóúñ]/gi, "");
  if (letras.length > 12 && letras === letras.toUpperCase()) return "gritos";
  if (/(.)\1{7,}/.test(texto)) return "spam";
  return null;
}

// Segunda opinión gratuita y sin clave (PurgoMalum, fuerte en inglés).
// Si el servicio no responde rápido, no bloquea: decide el filtro propio.
export async function segundaOpinion(texto) {
  if (!/[a-z]{3,}/i.test(texto)) return false;
  try {
    const r = await fetch(`https://www.purgomalum.com/service/containsprofanity?text=${encodeURIComponent(texto.slice(0, 900))}`, {
      signal: AbortSignal.timeout(1800),
      cache: "no-store",
    });
    return (await r.text()).trim() === "true";
  } catch {
    return false;
  }
}

export const EMOJIS = ["🍄", "🌱", "🌈", "⭐", "🔥", "💚", "🚀", "🎸", "🎧", "☕", "🧉", "🌎", "🦋", "🌻", "🐙", "👾", "🎨", "📚", "🧠", "✨", "🫶", "🙌", "👋", "⚽"];
