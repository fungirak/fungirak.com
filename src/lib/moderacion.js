import { ofensivas } from "./filtro";

// Reglas del muro: sin links, sin lenguaje ofensivo, sin gritar, sin spam.
export function revisar(texto) {
  if (/(https?:\/\/|www\.|\.com\b|\.ar\b|\.net\b|@\w{3,})/i.test(texto)) return "links";
  if (ofensivas(texto).length) return "lenguaje";
  const letras = texto.replace(/[^a-záéíóúñ]/gi, "");
  if (letras.length > 12 && letras === letras.toUpperCase()) return "gritos";
  if (/(.)\1{7,}/.test(texto)) return "spam";
  if (/(asdf|qwer|zxcv|hjkl|sdfg|dfgh|fghj|wasd)/i.test(texto)) return "spam"; // tecleo al azar («FGFASDFASDF»)
  if (/\b(freelance|seo|backlinks?|guest post|crypto|bitcoin|forex|casino|viagra|loan|whatsapp|telegram|onlyfans|hire me|my services|marketing agency)\b/i.test(texto)) return "spam";
  return null;
}

// Lo que no se rechaza pero conviene mirar antes de publicar (queda oculto hasta aprobarlo en el panel): mayoría de palabras en
// inglés (el muro es en castellano; casi todo el spam llega en inglés) o un texto que es solo una palabra larga sin espacios.
const INGLES = new Set("the and you your have has any use for with this that are would like from our out about what can will just get need do does".split(" "));
export function sospechoso(texto) {
  const p = texto.toLowerCase().match(/[a-záéíóúñü]+/g) || [];
  if (p.length >= 4 && p.filter((w) => INGLES.has(w)).length / p.length > 0.25) return true;
  if (p.length <= 2 && texto.replace(/\s/g, "").length > 10 && !/[áéíóúñ]/i.test(texto)) return true;
  return false;
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
