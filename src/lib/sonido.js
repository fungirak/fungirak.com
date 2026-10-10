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
