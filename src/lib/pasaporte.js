"use client";
// Pasaporte FUNGIRAK: cada cosa que el visitante descubre suma un sello.
// Vive en su dispositivo (localStorage); al completarlo se avisa al contador global.

export const SELLOS = [
  { id: "bienvenida", icono: "👋", es: "Nos presentamos", en: "We met" },
  { id: "teamjoy", icono: "🌈", es: "Team Joy", en: "Team Joy" },
  { id: "problematica", icono: "🏠", es: "Tres roles", en: "Three roles" },
  { id: "libro-1", icono: "📕", es: "Libro I", en: "Book I" },
  { id: "libro-2", icono: "📙", es: "Libro II", en: "Book II" },
  { id: "ep", icono: "🎵", es: "El EP", en: "The EP" },
  { id: "mitour", icono: "✈️", es: "MiTour", en: "MiTour" },
  { id: "ecos", icono: "📡", es: "ECOS", en: "ECOS" },
  { id: "atlas", icono: "💪", es: "Atlas Fit Pro", en: "Atlas Fit Pro" },
  { id: "gourmet", icono: "☕", es: "Gourmet", en: "Gourmet" },
  { id: "schools", icono: "🏫", es: "Schools", en: "Schools" },
  { id: "telos", icono: "🌙", es: "Telo's", en: "Telo's" },
  { id: "negro", icono: "🌲", es: "Bosque Negro", en: "Black Forest" },
  { id: "filosofia", icono: "🍄", es: "Filosofía", en: "Philosophy" },
  { id: "trayectoria", icono: "🧭", es: "Trayectoria", en: "Journey" },
  { id: "skills", icono: "✨", es: "Constelación", en: "Constellation" },
  { id: "certificados", icono: "📜", es: "Certificados", en: "Certificates" },
  { id: "acorde", icono: "🎹", es: "El acorde", en: "The chord" },
  { id: "terminal", icono: "⌨️", es: "Hacker", en: "Hacker" },
  { id: "quiz", icono: "🧪", es: "Laboratorio", en: "Lab" },
  { id: "huella", icono: "👣", es: "Mi huella", en: "My mark" },
  { id: "idea", icono: "💡", es: "Una idea", en: "An idea" },
  { id: "youtube", icono: "🎬", es: "En pantalla", en: "On screen" },
  { id: "juego", icono: "🎮", es: "Gamer", en: "Gamer" },
];

// Niveles con la vida de un hongo
export const NIVELES = [
  { min: 0, es: "Espora", en: "Spore", icono: "·" },
  { min: 3, es: "Hifa", en: "Hypha", icono: "〰" },
  { min: 7, es: "Micelio", en: "Mycelium", icono: "🕸" },
  { min: 12, es: "Hongo", en: "Mushroom", icono: "🍄" },
  { min: 19, es: "Bosque", en: "Forest", icono: "🌳" },
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
