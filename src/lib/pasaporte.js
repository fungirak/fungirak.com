"use client";
// Pasaporte FUNGIRAK: cada cosa que el visitante descubre suma un sello.
// Vive en su dispositivo (localStorage); al completarlo se avisa al contador global.
// glifo: el ícono del sello de tinta (lib/sello-svg.js); «icono» queda solo para textos que ya lo usaban.

export const SELLOS = [
  { id: "bienvenida", icono: "👋", glifo: "persona", es: "Nos presentamos", en: "We met" },
  { id: "teamjoy", icono: "🌈", glifo: "personas", es: "Team Joy", en: "Team Joy" },
  { id: "problematica", icono: "🏠", glifo: "casa", es: "Tres roles", en: "Three roles" },
  { id: "libro-1", icono: "📕", glifo: "libro", es: "Libro I", en: "Book I" },
  { id: "libro-2", icono: "📙", glifo: "libro", es: "Libro II", en: "Book II" },
  { id: "ep", icono: "🎵", glifo: "nota", es: "El EP", en: "The EP" },
  { id: "mitour", icono: "✈️", glifo: "brujula", es: "MiTour", en: "MiTour" },
  { id: "ecos", icono: "📡", glifo: "lupa", es: "ECOS", en: "ECOS" },
  { id: "atalaya", icono: "🛡️", glifo: "escudo", es: "Atalaya", en: "Atalaya" },
  { id: "atlas", icono: "💪", glifo: "rayo", es: "Atlas Fit Pro", en: "Atlas Fit Pro" },
  { id: "gourmet", icono: "☕", glifo: "taza", es: "Gourmet", en: "Gourmet" },
  { id: "schools", icono: "🏫", glifo: "casa", es: "Schools", en: "Schools" },
  { id: "telos", icono: "🌙", glifo: "luna", es: "Telo's", en: "Telo's" },
  { id: "negro", icono: "🌲", glifo: "arbol", es: "Bosque Negro", en: "Black Forest" },
  { id: "peyote", icono: "🌵", glifo: "montana", es: "Villa Española", en: "Villa Española" },
  { id: "mate", icono: "🧉", glifo: "mate", es: "La ronda", en: "The round" },
  { id: "asador", icono: "🔥", glifo: "llama", es: "El asador", en: "The grill master" },
  { id: "micoteca", icono: "🍄", glifo: "hongo", es: "Micoteca", en: "Micoteca" },
  { id: "musgui", icono: "🌿", glifo: "hoja", es: "Musgui", en: "Musgui" },
  { id: "sinvueltas", icono: "📋", glifo: "calendario", es: "Sin Vueltas", en: "Sin Vueltas" },
  { id: "surco", icono: "🌱", glifo: "brote", es: "La huerta", en: "The garden" },
  { id: "fabrica", icono: "🏭", glifo: "engranaje", es: "Fábrica", en: "Fábrica" },
  { id: "dertin", icono: "⚡", glifo: "corazon", es: "Dertin", en: "Dertin" },
  { id: "cronicas", icono: "🚀", glifo: "estrella", es: "Fungi", en: "Fungi" },
  { id: "tribus", icono: "🤘", glifo: "nota", es: "Tribus", en: "Tribes" },
  { id: "filosofia", icono: "🍄", glifo: "hongo", es: "Filosofía", en: "Philosophy" },
  { id: "trayectoria", icono: "🧭", glifo: "mapa", es: "Trayectoria", en: "Journey" },
  { id: "skills", icono: "✨", glifo: "estrella", es: "Constelación", en: "Constellation" },
  { id: "certificados", icono: "📜", glifo: "trofeo", es: "Certificados", en: "Certificates" },
  { id: "acorde", icono: "🎹", glifo: "nota", es: "El acorde", en: "The chord" },
  { id: "terminal", icono: "⌨️", glifo: "codigo", es: "Hacker", en: "Hacker" },
  { id: "quiz", icono: "🧪", glifo: "lupa", es: "Laboratorio", en: "Lab" },
  { id: "huella", icono: "👣", glifo: "corazon", es: "Mi huella", en: "My mark" },
  { id: "idea", icono: "💡", glifo: "foco", es: "Una idea", en: "An idea" },
  { id: "hoy", icono: "☀️", glifo: "sol", es: "¿Hoy sí o no?", en: "Yes or no today?" },
  { id: "pasalo", icono: "📲", glifo: "sobre", es: "Pase gol", en: "Assist" },
  { id: "termometro", icono: "🌡️", glifo: "termometro", es: "Vecino que opina", en: "Local voice" },
  { id: "rinde", icono: "🪙", glifo: "moneda", es: "Ahorro con plan", en: "Saver with a plan" },
  { id: "que-hago-hoy", icono: "🎟️", glifo: "nota", es: "De salida", en: "Night out" },
  { id: "escuela-del-pescador", icono: "🎣", glifo: "pez", es: "En el río", en: "On the river" },
  { id: "escanea", icono: "📷", glifo: "camara", es: "Escaneado", en: "Scanned" },
  { id: "preguntas", icono: "💬", glifo: "burbuja", es: "De a dos", en: "Two of us" },
  { id: "cv", icono: "📄", glifo: "documento", es: "Tu CV", en: "Your CV" },
  { id: "carta-al-futuro", icono: "✉️", glifo: "sobre", es: "Carta al futuro", en: "Letter to the future" },
  { id: "youtube", icono: "🎬", glifo: "camara", es: "En pantalla", en: "On screen" },
  { id: "juego", icono: "🎮", glifo: "joystick", es: "Gamer", en: "Gamer" },
];

// Niveles con la vida de un hongo
export const NIVELES = [
  { min: 0, glifo: "gota", es: "Espora", en: "Spore", icono: "·" },
  { min: 3, glifo: "ola", es: "Hifa", en: "Hypha", icono: "〰" },
  { min: 7, glifo: "ciclo", es: "Micelio", en: "Mycelium", icono: "🕸" },
  { min: 12, glifo: "hongo", es: "Hongo", en: "Mushroom", icono: "🍄" },
  { min: 19, glifo: "arbol", es: "Bosque", en: "Forest", icono: "🌳" },
];

export const nivelDe = (n) => [...NIVELES].reverse().find((l) => n >= l.min);

const KEY = "fgk-pasaporte";

export function leerSellos() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function guardarSellos(lista) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lista));
  } catch {}
}
