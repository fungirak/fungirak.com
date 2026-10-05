// Filtro de lenguaje ofensivo, sin IA: diccionario curado + normalización anti-trucos.
// Se usa igual en el navegador (aviso en rojo mientras escriben) y en el servidor (bloqueo real).
// Criterio: solo insultos y obscenidades claras. Palabras ambiguas o de uso sano
// (martillo, infierno, sexo, droga, pis, pedo, maldito…) NO se marcan para no molestar a nadie.

// Palabras completas (se comparan normalizadas, sin tildes, en minúscula)
const PALABRAS = [
  "boludo", "boluda", "boludos", "boludas", "pelotudo", "pelotuda", "pelotudos", "pelotudas", "pelotudez", "puto", "puta", "putos",
  "putas", "putita", "putito", "puton", "putazo", "putear", "puteada", "trolo", "trola", "trolos", "trolas", "forro",
  "forra", "forros", "forras", "conchudo", "conchuda", "conchudos", "conchudas", "chupapija", "chupapijas", "chupaculo", "chupaculos", "chupapollas",
  "pija", "pijas", "pijudo", "verga", "vergas", "vergudo", "poronga", "porongas", "garcha", "garchar", "garche", "cogeme",
  "cogete", "orto", "ortos", "culiado", "culiada", "culiao", "culeado", "culear", "culo", "culos", "culito", "mierda",
  "mierdas", "mierdoso", "pajero", "pajera", "pajeros", "pajerito", "mogolico", "mogolica", "mogolicos", "mongolico", "mongolica", "idiota",
  "idiotas", "imbecil", "imbeciles", "estupido", "estupida", "estupidos", "tarado", "tarada", "taradito", 
  "cabron", "cabrona", "cabrones", "jilipollas", "capullo", "jodete", "follar", "follando", "follador", "maricon", "maricona", "maricones",
  "bollera", "travuco", "ramera", "hdp", "lpm", "lpqtp", "ctm", "csm", "ptm", "lcdtm", "sudaca",
  "sudacas", "porno", "porn", "xxx", "chupala", "chupamela", "mamada", "mamadas", "fuck", "fucking", "fucker", "fucked",
  "motherfucker", "fck", "fuk", "fuking", "fcking", "fkn", "sht", "btch", "shit", "shitty", "bullshit", "bitch", "bitches", "bastard", "asshole", "assholes", "dickhead", "cocksucker", "pussy",
  "cunt", "cunts", "whore", "slut", "sluts", "nigger", "niggers", "nigga", "faggot", "faggots", "fag", "retard",
  "retarded", "wanker", "twat", "gilipollas", "tortillera",
];

// Frases (se buscan como secuencia de palabras)
const FRASES = [
  "hijo de puta", "hija de puta", "hijos de puta", "hijo de re mil puta", "la concha de tu madre", "la concha de la lora",
  "concha de tu madre", "concha tu madre", "la puta que te pario", "la puta madre", "puta madre", "andate a la mierda",
  "anda a la mierda", "vete a la mierda", "chupame la pija", "chupame la", "te voy a matar", "los voy a matar",
  "andate a cagar", "anda a cagar", "negro de mierda", "bolita de mierda", "paragua de mierda", "trava de mierda", "sos una perra", "sos un perro", "sos una zorra", "manga de giles", "suck my", "kill yourself", "kys", "son of a bitch",
];

// Palabras sanas que contienen algo "feo" adentro: nunca se marcan
const PERMITIDAS = new Set(["computadora", "disputa", "reputacion", "imputado", "culinario", "culinaria", "escupir", "pajaro", "pajaros", "ortodoncia"]);

const LEET = { 0: "o", 1: "i", 3: "e", 4: "a", 5: "s", 7: "t", 8: "b", "@": "a", $: "s", "!": "i", "|": "i", "€": "e" };

export function normalizar(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[0134578@$!|€]/g, (c) => LEET[c] || c)
    .replace(/(\p{L})[\.\-_*·•'"`´]+(?=\p{L})/gu, "$1") // p.u.t.o / p-u-t-o / p*u*t*o
    .replace(/(\p{L})\1{2,}/gu, "$1$1") // puuuuto -> puuto
    .replace(/[^\p{L}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Une letras sueltas separadas por espacios: "p u t o" -> "puto"
const unirSueltas = (t) => t.replace(/\b(?:\p{L} ){2,}\p{L}\b/gu, (m) => m.replace(/ /g, ""));

const SET = new Set(PALABRAS.map(normalizar).filter((p) => !PERMITIDAS.has(p)));
const FRASES_N = FRASES.map(normalizar);

// Devuelve las palabras ofensivas encontradas (vacío si el texto está bien)
export function ofensivas(texto) {
  const base = normalizar(texto);
  if (!base) return [];
  const encontradas = new Set();
  for (const t of [base, unirSueltas(base)]) {
    const conEspacios = ` ${t} `;
    for (const f of FRASES_N) if (conEspacios.includes(` ${f} `)) encontradas.add(f);
    for (const w of t.split(" ")) {
      const simple = w.replace(/(\p{L})\1+/gu, "$1"); // puuto -> puto
      if (SET.has(w)) encontradas.add(w);
      else if (SET.has(simple) && !PERMITIDAS.has(simple)) encontradas.add(simple);
    }
  }
  return [...encontradas];
}
