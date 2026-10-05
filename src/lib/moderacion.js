// Filtro simple para el muro: sin links, sin insultos comunes, sin gritar.
const MALAS = ["boludo", "pelotudo", "puto", "puta", "forro", "mierda", "concha", "verga", "pija", "trolo", "mogolico", "idiota", "imbecil", "estupido", "nazi", "fuck", "shit", "bitch", "nigger", "faggot", "cunt", "porno"];

const norm = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[0@]/g, "o")
    .replace(/[1!]/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/\$/g, "s");

export function revisar(texto) {
  const t = norm(texto);
  if (/(https?:\/\/|www\.|\.com\b|\.ar\b|\.net\b|@\w{3,})/i.test(texto)) return "links";
  if (MALAS.some((m) => new RegExp(`\\b${m}s?\\b`).test(t))) return "lenguaje";
  const letras = texto.replace(/[^a-záéíóúñ]/gi, "");
  if (letras.length > 12 && letras === letras.toUpperCase()) return "gritos";
  if (/(.)\1{7,}/.test(texto)) return "spam";
  return null;
}

export const EMOJIS = ["🍄", "🌱", "🌈", "⭐", "🔥", "💚", "🚀", "🎸", "🎧", "☕", "🧉", "🌎", "🦋", "🌻", "🐙", "👾", "🎨", "📚", "🧠", "✨", "🫶", "🙌", "👋", "⚽"];
