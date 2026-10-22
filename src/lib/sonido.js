"use client";
// Modo músico: cada card toca una nota con Web Audio. Las 5 centrales forman un acorde de Do mayor con 9na.

let ctx;
const audio = () => {
  if (typeof window === "undefined") return null;
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
};

// Notas por card (Hz). Fila 1 = acorde; fila 2 = escala pentatónica.
export const NOTAS = {
  teamjoy: 261.63, // Do
  problematica: 329.63, // Mi
  "libro-1": 392.0, // Sol
  "libro-2": 493.88, // Si
  ep: 587.33, // Re (9na)
  mitour: 440.0,
  ecos: 523.25,
  atalaya: 587.33,
  atlas: 659.25,
  gourmet: 349.23,
  schools: 293.66,
  telos: 220.0,
  negro: 196.0,
  peyote: 246.94,
  mate: 174.61,
  asador: 130.81,
  micoteca: 698.46,
  musgui: 783.99,
  sinvueltas: 164.81,
  surco: 392.0,
  fabrica: 880.0,
  dertin: 1046.5,
  cronicas: 1174.66,
  tribus: 329.63,
  hoy: 523.25,
  cv: 554.37,
  preguntas: 622.25,
  escanea: 659.25,
  pasalo: 698.46,
  termometro: 739.99,
  rinde: 783.99,
  "que-hago-hoy": 830.61,
  "escuela-del-pescador": 698.46,
  "escuela-de-mascotas": 587.33,
  "afinados": 554.37,
  "santafe-oculta": 493.88,
  "primeros-auxilios": 622.25,
  "trivia": 659.25,
  "figus": 698.46,
  "voluntarios": 523.25,
  "prode": 587.33,
  "carta-al-futuro": 587.33,
};

export function tocar(freq, { dur = 0.9, tipo = "triangle", vol = 0.12 } = {}) {
  const a = audio();
  if (!a || !freq) return;
  const t = a.currentTime;
  const osc = a.createOscillator();
  const osc2 = a.createOscillator();
  const g = a.createGain();
  const filtro = a.createBiquadFilter();
  osc.type = tipo;
  osc2.type = "sine";
  osc.frequency.value = freq;
  osc2.frequency.value = freq * 2;
  filtro.type = "lowpass";
  filtro.frequency.value = 2400;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(filtro);
  osc2.connect(filtro);
  filtro.connect(g);
  g.connect(a.destination);
  osc.start(t);
  osc2.start(t);
  osc.stop(t + dur);
  osc2.stop(t + dur);
}

export function arpegio(freqs, paso = 0.11) {
  freqs.forEach((f, i) => setTimeout(() => tocar(f, { dur: 1.6, vol: 0.09 }), i * paso * 1000));
}
