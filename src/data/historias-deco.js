// Emojis que flotan alrededor del texto de cada historia (afuera del texto, no en el fondo): le dan calidez y cuentan
// de un vistazo de qué se habla. Se eligen por lo que dice cada historia y, si no alcanza, por la app.
const CLAVES = [
  [/pregunt|trivia|quiz|respond/i, "❓"], [/vot|encuesta|elig/i, "🗳️"], [/comunidad|entre todos|vecin|gente|amig|grupo|equipo|compañer|personas/i, "👥"],
  [/chat|charl|mensaj|coment/i, "💬"], [/aplaus|reconoc|felicit/i, "👏"], [/like|me gusta|coraz|afín|afin|match|chispazo/i, "💞"],
  [/foto|álbum|album|captura/i, "📸"], [/video|reel/i, "🎬"], [/mapa|ciudad|provincia|país|pais|lugar/i, "📍"], [/viaj|destino|tour|vuelo/i, "✈️"],
  [/sello|insignia|logro|medalla|cinturón|cinturon/i, "🏅"], [/ranking|torneo|podio|liga|gan/i, "🏆"], [/racha|todos los días|diari/i, "🔥"],
  [/mate|yerba|ronda|bombilla/i, "🧉"], [/asad|carne|parrill|corte/i, "🥩"], [/huert|sembr|semilla|cosech|plant/i, "🌱"], [/hongo/i, "🍄"],
  [/pesca|río|rio|pez|peces/i, "🎣"], [/mascota|perro|gato/i, "🐾"], [/auxilio|rcp|emergencia|salud/i, "⛑️"], [/entren|rutina|ejercicio|gym/i, "💪"],
  [/aliment|nutric|comida|plato|receta/i, "🥗"], [/estafa|segur|cuid/i, "🛡️"], [/carta|futuro/i, "💌"], [/música|musica|canción|cancion|banda|cant/i, "🎵"],
  [/fútbol|futbol|partido|prode|mundial/i, "⚽"], [/figurit|álbum de|pegá/i, "🃏"], [/plata|pesos|precio|ahorr|gasto|rinde/i, "💰"],
  [/clima|frío|frio|calor|lluvia|helada/i, "🌦️"], [/gratis|regalo|prueba/i, "🎁"], [/plan|suscrip/i, "⭐"], [/horas|voluntari|ayud/i, "🤝"],
  [/escane|document|pdf|cv|currícul/i, "📄"], [/curso|aprend|escuela|lección|leccion|clase/i, "🎓"], [/juego|jug/i, "🎮"], [/noche|viernes/i, "🌙"],
];
const DE_APP = { teamjoy: "🎉", dertin: "⚡", cronicas: "🚀", atlas: "💪", mitour: "✈️", atalaya: "🛡️", musgui: "🌿", mate: "🧉", asador: "🔥", surco: "🌱",
  micoteca: "🍄", "carta-al-futuro": "💌", hoy: "☀️", cv: "📄", preguntas: "💬", escanea: "📷", pasalo: "🔁", termometro: "🌡️", rinde: "💰",
  "que-hago-hoy": "🎟️", "escuela-del-pescador": "🎣", "escuela-de-mascotas": "🐾", "primeros-auxilios": "⛑️", trivia: "❓", figus: "🃏",
  voluntarios: "🤝", prode: "⚽", afinados: "🎤", "santafe-oculta": "🗝️", fabrica: "🏭", ecos: "📡" };

export function decoDe(id, ...textos) {
  const t = textos.filter(Boolean).join(" ");
  const r = [];
  for (const [re, e] of CLAVES) if (re.test(t) && !r.includes(e)) r.push(e);
  if (DE_APP[id] && !r.includes(DE_APP[id])) r.push(DE_APP[id]);
  return r.slice(0, 3);
}
